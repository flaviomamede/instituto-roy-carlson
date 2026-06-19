'use strict';

import { dpr } from './config.js';
import { state } from './state.js';
import { el, showLoader, hideLoader } from './dom.js';
import { atGate, openGate } from './gate.js';
import { renderPdfPage } from './pdf.js';
import { renderDemoPage } from './demo.js';
import { drawHighlightsOnCanvas, getSearchHighlightQuery } from './search-highlight.js';
import { visibleSpread, next, prev } from './flip-controller.js';
import { BookViewport } from './viewport.js';

let viewport = null;
let currentIdxs = [];

function getBookEl() {
  if (el.lbBook) return el.lbBook;
  if (!el._lbBookFallback) {
    const wrap = document.createElement('div');
    wrap.id = 'lbBook';
    wrap.className = 'lb-book';
    if (el.lbContent && el.lbContent.parentNode === el.lbStage) {
      el.lbStage.insertBefore(wrap, el.lbContent);
      wrap.appendChild(el.lbContent);
    }
    el._lbBookFallback = wrap;
    el.lbBook = wrap;
  }
  return el.lbBook;
}

function ensureViewport() {
  const bookEl = getBookEl();
  if (!viewport) {
    viewport = new BookViewport(el.lbStage, bookEl, el.lbContent);
    viewport.bindEvents({
      onEdgeTap: (delta) => lbTurn(delta),
      onResize: () => el.lb.classList.contains('open')
    });
  }
  return viewport;
}

async function renderZoomCanvases(idxs) {
  el.lbContent.innerHTML = '';
  const target = Math.min(1800, Math.round(state.Book.pw * 3.2));
  for (const pageIndex of idxs) {
    const c = document.createElement('canvas');
    el.lbContent.appendChild(c);
    if (state.Book.source === 'pdf') {
      await renderPdfPage(c, pageIndex, target);
      if (getSearchHighlightQuery()) await drawHighlightsOnCanvas(c, pageIndex);
    } else renderDemoPage(c, pageIndex, 4);
    c.style.width = (c.width / dpr) + 'px';
    c.style.height = (c.height / dpr) + 'px';
  }
  el.lbPage.textContent = (idxs.length === 1)
    ? ('p. ' + (idxs[0] + 1))
    : ('p. ' + (idxs[0] + 1) + '–' + (idxs[idxs.length - 1] + 1));
}

export async function openZoom() {
  if (state.Book.N <= 0) return;
  currentIdxs = visibleSpread();
  if (!currentIdxs || !currentIdxs.length) currentIdxs = [0];

  el.lb.classList.add('open');
  el.lb.setAttribute('aria-hidden', 'false');
  showLoader('Ampliando…');
  await renderZoomCanvases(currentIdxs);
  hideLoader();
  const vp = ensureViewport();
  requestAnimationFrame(() => vp.fit());
}

export async function lbTurn(delta) {
  if (!el.lb.classList.contains('open')) return;
  if (delta > 0) {
    if (atGate()) { openGate(); return; }
    next();
  } else {
    prev();
  }
  currentIdxs = visibleSpread();
  await renderZoomCanvases(currentIdxs);
  const vp = ensureViewport();
  requestAnimationFrame(() => vp.onSpreadChange());
}

export function closeZoom() {
  el.lb.classList.remove('open');
  el.lb.setAttribute('aria-hidden', 'true');
  el.lbContent.innerHTML = '';
  if (viewport) {
    viewport.userZoom = false;
    viewport.panX = 0;
    viewport.panY = 0;
  }
}

export function zoomIn() {
  if (!viewport) return;
  viewport.zoomBy(1.3);
}

export function zoomOut() {
  if (!viewport) return;
  viewport.zoomBy(1 / 1.3);
}

export function isZoomOpen() {
  return el.lb.classList.contains('open');
}
