'use strict';

import { state } from './state.js';
import { el } from './dom.js';
import { gateActive, previewCount, openGate } from './gate.js';
import { goTo } from './flip-controller.js';
import {
  setSearchHighlightQuery,
  clearAllSearchHighlights,
  refreshSearchHighlightsNow
} from './search-highlight.js';

let open = false;
let results = [];
let resultIndex = -1;
let textIndex = null;
let indexing = false;
let lastQueryRaw = '';

function normalizeText(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function isPageSearchable(pageIndex) {
  if (!gateActive()) return true;
  return pageIndex < previewCount();
}

async function indexPage(pageIndex) {
  if (textIndex && textIndex[pageIndex] != null) return textIndex[pageIndex];
  if (!state.Book.pdf) return '';
  const page = await state.Book.pdf.getPage(pageIndex + 1);
  const tc = await page.getTextContent();
  const text = tc.items.map((it) => it.str).join(' ');
  if (!textIndex) textIndex = [];
  textIndex[pageIndex] = text;
  return text;
}

async function buildIndex(onProgress) {
  if (textIndex) return textIndex;
  textIndex = [];
  const n = state.Book.N;
  for (let p = 0; p < n; p++) {
    if (!isPageSearchable(p)) {
      textIndex[p] = '';
      continue;
    }
    if (onProgress) onProgress(p + 1, n);
    await indexPage(p);
    if (p % 3 === 2) await new Promise((r) => setTimeout(r, 0));
  }
  return textIndex;
}

function snippetAround(text, q, len) {
  const norm = normalizeText(text);
  const i = norm.indexOf(q);
  if (i === -1) return '';
  const start = Math.max(0, i - 24);
  const end = Math.min(text.length, i + q.length + 48);
  let snip = text.slice(start, end).replace(/\s+/g, ' ').trim();
  if (start > 0) snip = '…' + snip;
  if (end < text.length) snip += '…';
  return snip;
}

function repaintHighlights() {
  return refreshSearchHighlightsNow().then(() => {
    setTimeout(() => refreshSearchHighlightsNow(), 180);
    setTimeout(() => refreshSearchHighlightsNow(), 520);
  });
}

async function runSearch(query) {
  const raw = query.trim();
  const q = normalizeText(raw);
  lastQueryRaw = raw;

  if (q.length < 2) {
    results = [];
    resultIndex = -1;
    clearAllSearchHighlights();
    renderResults();
    updateStatusHint();
    return;
  }

  setSearchHighlightQuery(raw);
  el.searchStatus.textContent = 'Indexando…';
  indexing = true;

  try {
    await buildIndex((cur, total) => {
      el.searchStatus.textContent = 'Indexando ' + cur + ' / ' + total + '…';
    });

    results = [];
    for (let p = 0; p < state.Book.N; p++) {
      if (!isPageSearchable(p)) continue;
      const text = textIndex[p] || '';
      if (normalizeText(text).includes(q)) {
        results.push({ page: p, snippet: snippetAround(text, q, 80) });
      }
    }

    resultIndex = results.length ? 0 : -1;
    renderResults();

    if (results.length === 1) {
      await goToResult(0, { closePanel: true });
    } else if (results.length > 1) {
      updateStatusHint();
    } else {
      updateStatusHint();
    }
  } finally {
    indexing = false;
    if (results.length !== 1) updateStatusHint();
  }
}

function updateStatusHint() {
  if (!el.searchStatus) return;
  if (!results.length) {
    el.searchStatus.textContent = 'Nenhum resultado';
    return;
  }
  const n = results.length;
  const base = n + (n === 1 ? ' resultado' : ' resultados');
  if (n === 1) {
    el.searchStatus.textContent = base + ' — Enter ou clique para ver no documento';
  } else {
    el.searchStatus.textContent =
      base + ' — clique ou Enter para ir · Shift+Enter anterior · Esc fecha (realce permanece)';
  }
}

function renderResults() {
  if (!results.length) {
    el.searchResults.innerHTML = '<p class="search-empty">Nenhuma página encontrada.</p>';
    return;
  }

  el.searchResults.innerHTML = results
    .map(
      (r, i) =>
        `<button type="button" class="search-hit${i === resultIndex ? ' active' : ''}" data-i="${i}">` +
        `<strong>p. ${r.page + 1}</strong><span>${escapeHtml(r.snippet)}</span></button>`
    )
    .join('');

  el.searchResults.querySelectorAll('.search-hit').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      goToResult(parseInt(btn.dataset.i, 10), { closePanel: true });
    });
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function goToResult(i, opts = {}) {
  if (i < 0 || i >= results.length) return;
  const closePanel = opts.closePanel !== false;
  const keepOpen = opts.keepOpen === true;
  const shouldClose = closePanel && !keepOpen;

  resultIndex = i;
  const target = results[i].page;

  if (gateActive() && target >= previewCount()) {
    state.pendingPage = target;
    openGate();
    return;
  }

  goTo(target);
  renderResults();

  if (shouldClose) closeSearch(false);

  await repaintHighlights();
}

export function openSearch() {
  if (!el.searchPanel) return;
  el.searchPanel.classList.add('open');
  el.searchPanel.setAttribute('aria-hidden', 'false');
  open = true;
  el.searchInput.focus();
  if (lastQueryRaw && results.length) updateStatusHint();
}

export function closeSearch(repaint) {
  if (!open) return;
  el.searchPanel.classList.remove('open');
  el.searchPanel.setAttribute('aria-hidden', 'true');
  open = false;
  if (repaint !== false && lastQueryRaw) repaintHighlights();
}

export function initSearch() {
  if (!el.searchBtn || !el.searchPanel) return;

  el.searchBtn.addEventListener('click', () => {
    if (open) closeSearch();
    else openSearch();
  });

  el.searchClose.addEventListener('click', () => closeSearch());

  el.searchPanel.addEventListener('click', (e) => {
    if (e.target === el.searchPanel) closeSearch();
  });

  el.searchPanel.querySelector('.search-panel-inner')?.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  let debounce = null;
  el.searchInput.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => runSearch(el.searchInput.value), 280);
  });

  el.searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      closeSearch();
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      if (!results.length) {
        runSearch(el.searchInput.value);
        return;
      }
      if (e.shiftKey) {
        const prev = (resultIndex - 1 + results.length) % results.length;
        goToResult(prev, { keepOpen: true, closePanel: false });
        return;
      }
      const idx = resultIndex >= 0 ? resultIndex : 0;
      goToResult(idx, { closePanel: true });
    }
  });

  document.addEventListener(
    'keydown',
    (e) => {
      if (!open) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        closeSearch();
      }
    },
    true
  );
}

export function isSearchOpen() {
  return open;
}

export function clearSearchIndex() {
  textIndex = null;
  results = [];
  resultIndex = -1;
  lastQueryRaw = '';
  clearAllSearchHighlights();
}
