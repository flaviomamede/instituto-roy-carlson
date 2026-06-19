'use strict';

import { RS } from './config.js';
import { state } from './state.js';
import { el } from './dom.js';
import { gateActive } from './gate.js';
import { isEditingPage } from './page-jump-state.js';
import { renderPdfPage } from './pdf.js';
import { renderDemoPage } from './demo.js';
import { drawHighlightsOnCanvas, getSearchHighlightQuery } from './search-highlight.js';

export function buildSheets() {
  const { Book } = state;
  el.pages.innerHTML = '';
  Book.sheetEls = [];
  Book.sheets = Math.ceil(Book.N / 2);
  Book.maxK = (Book.N % 2 === 0) ? Book.sheets : (Book.sheets - 1);
  if (Book.maxK < 0) Book.maxK = 0;

  el.book.style.width = (Book.pw * 2) + 'px';
  el.book.style.height = (Book.ph) + 'px';

  for (let i = 0; i < Book.sheets; i++) {
    const sheet = document.createElement('div');
    sheet.className = 'sheet';

    const front = document.createElement('div');
    front.className = 'face front';
    const back = document.createElement('div');
    back.className = 'face back';

    const fPage = 2 * i;
    const bPage = 2 * i + 1;

    const fCanvas = document.createElement('canvas');
    front.appendChild(fCanvas);
    if (bPage < Book.N) {
      const bCanvas = document.createElement('canvas');
      back.appendChild(bCanvas);
      sheet._back = { faceEl: back, canvas: bCanvas, page: bPage, done: false };
    } else {
      back.classList.add('blank');
      const note = document.createElement('div');
      note.className = 'empty-note';
      note.textContent = '';
      back.appendChild(note);
      sheet._back = { faceEl: back, canvas: null, page: null, done: true };
    }

    sheet.appendChild(front);
    sheet.appendChild(back);
    el.pages.appendChild(sheet);

    Book.sheetEls.push({
      el: sheet,
      front: { faceEl: front, canvas: fCanvas, page: fPage, done: false },
      back: sheet._back
    });
    delete sheet._back;
  }
}

export async function renderFace(face) {
  if (!face || face.done || !face.canvas) return;
  face.done = true;
  try {
    if (state.Book.source === 'pdf') {
      await renderPdfPage(face.canvas, face.page, state.Book.pw * RS);
      if (getSearchHighlightQuery()) await drawHighlightsOnCanvas(face.canvas, face.page);
    } else renderDemoPage(face.canvas, face.page, RS);
  } catch (e) {
    face.done = false;
  }
}

export async function preRenderPages(indices) {
  const { Book } = state;
  if (!Book.sheetEls || !Book.sheetEls.length) return;
  const tasks = [];
  for (const pageIdx of indices) {
    if (pageIdx < 0 || pageIdx >= Book.N) continue;
    const sheetIdx = Math.floor(pageIdx / 2);
    const s = Book.sheetEls[sheetIdx];
    if (!s) continue;
    if (s.front.page === pageIdx) tasks.push(renderFace(s.front));
    if (s.back && s.back.page === pageIdx) tasks.push(renderFace(s.back));
  }
  await Promise.all(tasks);
}

export function prefetchBackground(fromPage) {
  const { Book } = state;
  if (state.prefetchStarted || Book.source !== 'pdf') return;
  state.prefetchStarted = true;
  const start = Math.max(0, fromPage | 0);
  const end = Math.min(Book.N - 1, start + 12);
  (async () => {
    for (let p = start; p <= end; p++) {
      const sheetIdx = Math.floor(p / 2);
      const s = Book.sheetEls[sheetIdx];
      if (!s) continue;
      if (s.front.page === p) await renderFace(s.front);
      if (s.back && s.back.page === p) await renderFace(s.back);
      await new Promise(r => setTimeout(r, 0));
    }
  })();
}

export function ensureRendered(k) {
  const { Book } = state;
  const from = Math.max(0, k - 2), to = Math.min(Book.sheets - 1, k + 1);
  for (let i = from; i <= to; i++) {
    const s = Book.sheetEls[i];
    if (!s) continue;
    renderFace(s.front);
    renderFace(s.back);
  }
}

export function applyZ(topIdx) {
  const { Book } = state;
  for (let i = 0; i < Book.sheetEls.length; i++) {
    const s = Book.sheetEls[i].el;
    let z = s.classList.contains('flipped') ? (i + 1) : (1000 - i);
    if (i === topIdx) z = 5000;
    s.style.zIndex = z;
  }
}

export function txFor(k) {
  const { Book } = state;
  if (Book.N <= 0) return '0%';
  if (k === 0) return '-25%';
  const rightIdx = 2 * k;
  if (rightIdx >= Book.N) return '25%';
  return '0%';
}

export function pageLabel(k) {
  const { Book } = state;
  if (Book.N <= 0) return '—';
  if (k === 0) return 'Capa';
  const leftIdx = 2 * k - 1, rightIdx = 2 * k;
  const leftReal = leftIdx < Book.N, rightReal = rightIdx < Book.N;
  if (rightReal) return 'p. ' + (leftIdx + 1) + '–' + (rightIdx + 1) + ' de ' + Book.N;
  if (leftReal) return 'p. ' + (leftIdx + 1) + ' de ' + Book.N;
  return 'Contracapa';
}

export function refreshUI() {
  if (isEditingPage()) return;
  const { Book } = state;
  const locked = gateActive();
  const base = pageLabel(Book.k).replace(/(\d+(?:–\d+)?)/, '<b>$1</b>');
  el.indicator.innerHTML = (locked ? '<span class="preview-tag">Prévia</span> · ' : '') + base;
  el.prev.disabled = (Book.k <= 0) || Book.flipping;
  el.next.disabled = (Book.k >= Book.maxK) || Book.flipping;
  el.book.style.transform = 'translateX(' + txFor(Book.k) + ')';
}

export function refreshUIWithProgress(msg) {
  const locked = gateActive();
  const extra = msg ? msg.replace(/(\d+(?:\/\d+)?)/, '<b>$1</b>') : '';
  el.indicator.innerHTML = (locked ? '<span class="preview-tag">Prévia</span> · ' : '') + extra;
}

export function setStateImmediate(k) {
  const { Book } = state;
  k = Math.max(0, Math.min(Book.maxK, k));
  Book.sheetEls.forEach((s, i) => s.el.classList.toggle('flipped', i < k));
  const prevTrans = el.book.style.transition;
  el.book.style.transition = 'none';
  Book.sheetEls.forEach(s => { s.el.style.transition = 'none'; });
  Book.k = k;
  applyZ(-1);
  refreshUI();
  void el.book.offsetWidth;
  el.book.style.transition = prevTrans || '';
  Book.sheetEls.forEach(s => { s.el.style.transition = ''; });
  ensureRendered(k);
}

export function flipForward() {
  const { Book } = state;
  if (Book.flipping || Book.k >= Book.maxK) return;
  const i = Book.k;
  const s = Book.sheetEls[i];
  if (!s) return;
  ensureRendered(i + 1);
  Book.flipping = true;
  s.el.classList.add('flipping');
  applyZ(i);
  s.el.classList.add('flipped');
  Book.k = i + 1;
  refreshUI();
  onFlipEnd(s.el);
}

export function flipBackward() {
  const { Book } = state;
  if (Book.flipping || Book.k <= 0) return;
  const i = Book.k - 1;
  const s = Book.sheetEls[i];
  if (!s) return;
  ensureRendered(i);
  Book.flipping = true;
  s.el.classList.add('flipping');
  applyZ(i);
  s.el.classList.remove('flipped');
  Book.k = i;
  refreshUI();
  onFlipEnd(s.el);
}

function onFlipEnd(sheetEl) {
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    sheetEl.classList.remove('flipping');
    state.Book.flipping = false;
    applyZ(-1);
    refreshUI();
    ensureRendered(state.Book.k);
  };
  sheetEl.addEventListener('transitionend', finish, { once: true });
  setTimeout(finish, 900);
}

export async function pageToDataURL(pageIndex) {
  const { Book } = state;
  const c = document.createElement('canvas');
  if (Book.source === 'pdf') await renderPdfPage(c, pageIndex, Math.round(Book.pw * 2.2));
  else renderDemoPage(c, pageIndex, 2);
  return c.toDataURL('image/jpeg', 0.88);
}
