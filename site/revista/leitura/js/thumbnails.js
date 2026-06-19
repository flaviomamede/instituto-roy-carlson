'use strict';

import { CONFIG, ARTICLE_SLUGS, ARTICLE_TITLES } from './config.js';
import { state } from './state.js';
import { el } from './dom.js';
import { gateActive, previewCount, openGate } from './gate.js';
import { getPage, goTo } from './flip-controller.js';
import { renderPdfPage } from './pdf.js';
import { renderDemoPage } from './demo.js';

let panelOpen = false;
const thumbCache = new Map();
let observer = null;

function isPageBlocked(pageIndex) {
  return gateActive() && pageIndex >= previewCount();
}

function slugTitle(slug) {
  if (ARTICLE_TITLES[slug]) return ARTICLE_TITLES[slug];
  return slug.replace(/-/g, ' ');
}

async function renderThumb(pageIndex, canvas) {
  if (thumbCache.has(pageIndex)) {
    const src = thumbCache.get(pageIndex);
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Página ' + (pageIndex + 1);
    canvas.replaceWith(img);
    return;
  }
  const w = 72;
  const h = Math.round(w * (state.Book.aspect || 1.3));
  canvas.width = w;
  canvas.height = h;
  try {
    if (state.Book.source === 'pdf') await renderPdfPage(canvas, pageIndex, w);
    else renderDemoPage(canvas, pageIndex, w / (state.Book.pw || 470));
    const src = canvas.toDataURL('image/jpeg', 0.72);
    thumbCache.set(pageIndex, src);
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Página ' + (pageIndex + 1);
    canvas.replaceWith(img);
  } catch {
    canvas.classList.add('thumb-fail');
  }
}

function buildTocHtml() {
  if (CONFIG.READER_CONTEXT === 'biblioteca') {
    const toc = CONFIG.DOC_TOC || [];
    if (!toc.length) return '';
    const entries = toc
      .map((item) => ({
        title: item.title || '',
        page: Math.max(0, (item.page | 0) - 1)
      }))
      .filter((e) => e.title)
      .sort((a, b) => a.page - b.page);
    if (!entries.length) return '';
    return (
      '<nav class="thumb-toc" aria-label="Sumário do documento">' +
      '<h3>Sumário</h3><ul>' +
      entries
        .map(
          (e) =>
            `<li><button type="button" class="toc-link${isPageBlocked(e.page) ? ' locked' : ''}" data-page="${e.page}">` +
            `<span>${escapeHtml(e.title)}</span><span>p. ${e.page + 1}</span></button></li>`
        )
        .join('') +
      '</ul></nav>'
    );
  }

  const entries = Object.entries(ARTICLE_SLUGS)
    .map(([slug, page]) => ({ slug, page: page - 1, title: slugTitle(slug) }))
    .sort((a, b) => a.page - b.page);
  if (!entries.length) return '';
  return (
    '<nav class="thumb-toc" aria-label="Sumário">' +
    '<h3>Artigos</h3><ul>' +
    entries
      .map(
        (e) =>
          `<li><button type="button" class="toc-link${isPageBlocked(e.page) ? ' locked' : ''}" data-page="${e.page}">` +
          `<span>${e.title}</span><span>p. ${e.page + 1}</span></button></li>`
      )
      .join('') +
    '</ul></nav>'
  );
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function panelTitle() {
  const tocHtml = buildTocHtml();
  if (tocHtml) return 'Índice';
  if (CONFIG.READER_CONTEXT === 'biblioteca') return 'Páginas';
  return 'Índice';
}

function buildGridHtml() {
  const n = state.Book.N;
  let html = '<div class="thumb-grid">';
  for (let p = 0; p < n; p++) {
    const blocked = isPageBlocked(p);
    html +=
      `<button type="button" class="thumb-item${blocked ? ' locked' : ''}" data-page="${p}" aria-label="Página ${p + 1}">` +
      (blocked ? '<span class="thumb-lock" aria-hidden="true">🔒</span>' : '') +
      `<canvas width="72" height="96" data-page="${p}"></canvas>` +
      `<span class="thumb-num">${p + 1}</span></button>`;
  }
  html += '</div>';
  return html;
}

function highlightCurrent() {
  const cur = getPage();
  el.thumbPanel.querySelectorAll('.thumb-item').forEach((btn) => {
    const p = parseInt(btn.dataset.page, 10);
    btn.classList.toggle('current', p === cur);
  });
}

function bindPanelEvents() {
  el.thumbPanel.querySelectorAll('[data-page]').forEach((node) => {
    if (node.tagName === 'CANVAS') return;
    node.addEventListener('click', () => {
      const p = parseInt(node.dataset.page, 10);
      if (isPageBlocked(p)) {
        state.pendingPage = p;
        openGate();
        return;
      }
      goTo(p);
      highlightCurrent();
    });
  });

  if (observer) observer.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const canvas = entry.target;
        const p = parseInt(canvas.dataset.page, 10);
        if (Number.isNaN(p) || canvas.dataset.done) return;
        canvas.dataset.done = '1';
        renderThumb(p, canvas);
        observer.unobserve(canvas);
      });
    },
    { root: el.thumbPanel.querySelector('.thumb-scroll'), rootMargin: '80px' }
  );

  el.thumbPanel.querySelectorAll('canvas[data-page]').forEach((c) => observer.observe(c));
}

function openPanel() {
  if (!state.Book.N) return;
  const tocHtml = buildTocHtml();
  el.thumbPanel.innerHTML =
    '<div class="thumb-panel-inner">' +
    '<header class="thumb-panel-head">' +
    `<h2>${panelTitle()}</h2>` +
    '<button type="button" class="icon-btn" id="thumbClose" aria-label="Fechar índice">×</button>' +
    '</header>' +
    '<div class="thumb-scroll">' +
    tocHtml +
    buildGridHtml() +
    '</div></div>';
  el.thumbPanel.classList.add('open');
  el.thumbPanel.setAttribute('aria-hidden', 'false');
  panelOpen = true;
  document.getElementById('thumbClose').addEventListener('click', closePanel);
  bindPanelEvents();
  highlightCurrent();
}

export function closePanel() {
  if (!panelOpen) return;
  el.thumbPanel.classList.remove('open');
  el.thumbPanel.setAttribute('aria-hidden', 'true');
  panelOpen = false;
  if (observer) observer.disconnect();
}

export function initThumbnails() {
  if (!el.thumbBtn || !el.thumbPanel) return;
  el.thumbBtn.addEventListener('click', () => {
    if (panelOpen) closePanel();
    else openPanel();
  });
  el.thumbPanel.addEventListener('click', (e) => {
    if (e.target === el.thumbPanel) closePanel();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panelOpen) closePanel();
  });
}

export function onPageChange() {
  if (panelOpen) highlightCurrent();
}

export function isPanelOpen() {
  return panelOpen;
}
