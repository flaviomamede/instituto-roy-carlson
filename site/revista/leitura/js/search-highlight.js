'use strict';

import { RS, dpr } from './config.js';
import { state } from './state.js';
import { el } from './dom.js';
import { getPdfPage, renderPdfPage } from './pdf.js';

let activeQuery = '';
let refreshTimer = null;
let resizeBound = false;

function normalizeText(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function visiblePageIndices() {
  const { Book } = state;
  if (state.FLIP === 'sf' && state.sf) {
    const i = state.sf.getCurrentPageIndex();
    if (i <= 0) return [0];
    if (state.sfOrientation === 'portrait') return [i];
    const out = [i];
    if (i + 1 < Book.N) out.push(i + 1);
    return out;
  }
  if (Book.k === 0) return [0];
  const mobile = window.innerWidth < 680;
  if (mobile) {
    const p = Book.k <= 0 ? 0 : 2 * Book.k - 1;
    return [Math.max(0, Math.min(Book.N - 1, p))];
  }
  const l = 2 * Book.k - 1;
  const r = 2 * Book.k;
  const out = [];
  if (l < Book.N) out.push(l);
  if (r < Book.N) out.push(r);
  return out.length ? out : [0];
}

function getFaceForPage(pageIndex) {
  const { Book } = state;
  if (!Book.sheetEls || !Book.sheetEls.length) return null;
  const sheetIdx = Math.floor(pageIndex / 2);
  const s = Book.sheetEls[sheetIdx];
  if (!s) return null;
  if (s.front.page === pageIndex) return s.front;
  if (s.back && s.back.page === pageIndex) return s.back;
  return null;
}

function itemRectForRange(item, viewport, charStart, charEnd, pdfjsLib) {
  const full = item.str || '';
  const len = full.length;
  if (!len || charEnd <= charStart) return null;

  const util = pdfjsLib.Util;
  const transform = util.transform(viewport.transform, item.transform);
  const fontHeight = Math.hypot(transform[2], transform[3]);
  const totalWidth = item.width * viewport.scale;
  const x = transform[4];
  const y = transform[5] - fontHeight;

  const start = Math.max(0, Math.min(len, charStart));
  const end = Math.max(start + 1, Math.min(len, charEnd));

  return {
    left: x + totalWidth * (start / len),
    top: y,
    width: totalWidth * ((end - start) / len),
    height: fontHeight * 1.12
  };
}

export async function computeHighlightRects(pageIndex, queryNorm) {
  if (!state.Book.pdf || !state.pdfjsLib || !queryNorm) {
    return { rects: [], viewport: null };
  }

  const page = await getPdfPage(pageIndex);
  const viewport = page.getViewport({ scale: 1 });
  const textContent = await page.getTextContent();
  const items = textContent.items;

  let normStr = '';
  const segments = [];

  for (let i = 0; i < items.length; i++) {
    const str = items[i].str || '';
    if (!str) continue;
    const itemNorm = normalizeText(str);
    const start = normStr.length;
    normStr += itemNorm;
    segments.push({ itemIndex: i, normStart: start, normEnd: normStr.length, str, itemNorm });
    normStr += ' ';
  }

  const rects = [];
  let from = 0;
  while (from < normStr.length) {
    const idx = normStr.indexOf(queryNorm, from);
    if (idx === -1) break;
    const qEnd = idx + queryNorm.length;

    for (const seg of segments) {
      if (seg.normEnd <= idx || seg.normStart >= qEnd) continue;

      const overlapStart = Math.max(idx, seg.normStart);
      const overlapEnd = Math.min(qEnd, seg.normEnd);
      const inNormStart = overlapStart - seg.normStart;
      const inNormEnd = overlapEnd - seg.normStart;
      const item = items[seg.itemIndex];

      const charStart = Math.floor((inNormStart / Math.max(1, seg.itemNorm.length)) * seg.str.length);
      const charEnd = Math.ceil((inNormEnd / Math.max(1, seg.itemNorm.length)) * seg.str.length);

      const r = itemRectForRange(item, viewport, charStart, charEnd, state.pdfjsLib);
      if (r && r.width > 0 && r.height > 0) rects.push(r);
    }

    from = idx + 1;
  }

  return { rects, viewport };
}

/** Desenha realce amarelo direto no canvas (modo CSS e zoom). */
export async function drawHighlightsOnCanvas(canvas, pageIndex, queryNorm) {
  const q = queryNorm != null ? normalizeText(queryNorm) : activeQuery;
  if (!canvas || !q || state.Book.source !== 'pdf') return;

  const { rects, viewport } = await computeHighlightRects(pageIndex, q);
  if (!rects.length || !viewport) return;

  const sx = canvas.width / viewport.width;
  const sy = canvas.height / viewport.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.save();
  ctx.fillStyle = 'rgba(255, 220, 0, 0.55)';
  for (const r of rects) {
    ctx.fillRect(r.left * sx, r.top * sy, r.width * sx, r.height * sy);
  }
  ctx.restore();
}

function getSfHlRoot() {
  let root = document.getElementById('searchSfHlRoot');
  if (!root) {
    root = document.createElement('div');
    root.id = 'searchSfHlRoot';
    root.setAttribute('aria-hidden', 'true');
    root.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:85;overflow:visible';
    document.body.appendChild(root);
  }
  return root;
}

function removeSfOverlay() {
  document.getElementById('searchSfHlRoot')?.remove();
}

function sfOrientation() {
  try {
    if (state.sf && state.sf.getOrientation) return state.sf.getOrientation();
  } catch (e) { /* ignore */ }
  return state.sfOrientation || 'landscape';
}

/** Geometria do livro renderizado pela StPageFlip (px CSS do canvas). */
function sfRenderRect() {
  if (!state.sf) return null;
  try {
    const render = state.sf.getRender && state.sf.getRender();
    const rect = render && render.getRect && render.getRect();
    if (rect && rect.height > 0) return rect;
  } catch (e) { /* ignore */ }
  return null;
}

function sfCanvasEl() {
  return el.flipWrap ? el.flipWrap.querySelector('canvas') : null;
}

/**
 * Retângulo de tela (px) da página `pageIndex`. A StPageFlip (loadFromImages)
 * desenha o livro inteiro num único <canvas>, então não há elemento por página:
 * calculamos a posição pela geometria que a própria lib expõe (getRect()).
 */
function sfPageScreenRect(pageIndex, vis) {
  const canvas = sfCanvasEl();
  if (!canvas) return null;
  const cR = canvas.getBoundingClientRect();
  if (cR.width < 2 || cR.height < 2) return null;

  const sx = cR.width / (canvas.clientWidth || cR.width);
  const sy = cR.height / (canvas.clientHeight || cR.height);
  const orient = sfOrientation();
  const spread = orient === 'landscape' && vis && vis.length > 1;
  const lead = vis && vis.length ? Math.min.apply(null, vis) : pageIndex;

  const rect = sfRenderRect();
  if (rect) {
    const pw = rect.pageWidth || rect.width;
    const wOne = pw * sx;
    const top = cR.top + rect.top * sy;
    const height = rect.height * sy;
    let left;
    if (spread) {
      // spread de 2 páginas: lado esquerdo = líder, direito = líder+1
      const baseLeft = cR.left + rect.left * sx;
      left = (pageIndex === lead) ? baseLeft : baseLeft + wOne;
    } else {
      // página única (portrait, capa, contracapa): centralizada na área visível.
      // Em portrait, rect.left refere-se ao quadro de 2 páginas (pode ser negativo),
      // então centralizamos pela largura do canvas, não por rect.left.
      left = cR.left + (cR.width - wOne) / 2;
    }
    return { left, top, width: wOne, height };
  }

  // Fallback geométrico (sem getRect): metades do canvas.
  if (!spread) return { left: cR.left, top: cR.top, width: cR.width, height: cR.height };
  const half = cR.width / 2;
  return {
    left: (pageIndex === lead) ? cR.left : cR.left + half,
    top: cR.top, width: half, height: cR.height
  };
}

function paintSfPageHighlights(pageIndex, rects, viewport, vis) {
  if (!rects.length || !viewport) return;

  const pr = sfPageScreenRect(pageIndex, vis || visiblePageIndices());
  if (!pr || pr.width < 2 || pr.height < 2) return;

  const root = getSfHlRoot();
  root.querySelector(`[data-hl-page="${pageIndex}"]`)?.remove();

  const layer = document.createElement('div');
  layer.dataset.hlPage = String(pageIndex);
  layer.style.cssText =
    `position:fixed;left:${pr.left}px;top:${pr.top}px;` +
    `width:${pr.width}px;height:${pr.height}px;overflow:hidden;pointer-events:none;`;

  for (const r of rects) {
    const mark = document.createElement('span');
    mark.className = 'search-hl-mark';
    mark.style.left = (r.left / viewport.width) * 100 + '%';
    mark.style.top = (r.top / viewport.height) * 100 + '%';
    mark.style.width = (r.width / viewport.width) * 100 + '%';
    mark.style.height = (r.height / viewport.height) * 100 + '%';
    layer.appendChild(mark);
  }

  root.appendChild(layer);
}

async function refreshCssFaceHighlights(pageIndex) {
  const face = getFaceForPage(pageIndex);
  if (!face || !face.canvas || state.Book.source !== 'pdf') return;

  face.done = false;
  await renderPdfPage(face.canvas, face.page, state.Book.pw * RS);
  await drawHighlightsOnCanvas(face.canvas, face.page);
  face.done = true;
}

async function paintPageHighlights(pageIndex, vis) {
  if (!activeQuery || state.Book.source !== 'pdf') return;

  const { rects, viewport } = await computeHighlightRects(pageIndex, activeQuery);
  if (!rects.length || !viewport) return;

  if (state.FLIP === 'sf' && state.sf) {
    paintSfPageHighlights(pageIndex, rects, viewport, vis || visiblePageIndices());
    return;
  }

  await refreshCssFaceHighlights(pageIndex);
}

function bindResizeRefresh() {
  if (resizeBound) return;
  resizeBound = true;
  window.addEventListener(
    'resize',
    () => scheduleSearchHighlights(),
    { passive: true }
  );
}

export function clearAllSearchHighlights() {
  activeQuery = '';
  document.querySelectorAll('.search-hl-layer').forEach((l) => {
    l.innerHTML = '';
  });
  removeSfOverlay();
}

export function setSearchHighlightQuery(rawQuery) {
  activeQuery = normalizeText((rawQuery || '').trim());
  bindResizeRefresh();
}

export function getSearchHighlightQuery() {
  return activeQuery;
}

export async function refreshSearchHighlightsForPage(pageIndex) {
  if (!activeQuery) return;
  await paintPageHighlights(pageIndex);
}

export function scheduleSearchHighlights() {
  if (!activeQuery) return;
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(async () => {
    await refreshSearchHighlightsNow();
  }, 100);
}

export async function refreshSearchHighlightsNow() {
  if (!activeQuery) {
    clearAllSearchHighlights();
    return;
  }

  if (state.FLIP === 'sf' && state.sf) {
    removeSfOverlay();
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  }

  const pages = visiblePageIndices();
  for (const p of pages) {
    await paintPageHighlights(p, pages);
  }
}
