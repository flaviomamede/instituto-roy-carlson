'use strict';

import { CONFIG, dpr } from './config.js';
import { state } from './state.js';

/** Cache de objetos PDFPageProxy (índice 0-based). */
export const pageCache = new Map();

export function loadPdfJs() {
  if (state.pdfjsLib) return Promise.resolve(state.pdfjsLib);
  if (state.pdfjsLoading) return state.pdfjsLoading;

  const base = CONFIG.PDFJS_BASE || '/revista/leitura/pdfjs';

  function finish(lib) {
    lib.GlobalWorkerOptions.workerSrc = base + '/pdf.worker.min.js';
    state.pdfjsLib = lib;
    return lib;
  }

  state.pdfjsLoading = new Promise((resolve, reject) => {
    if (window.pdfjsLib) {
      resolve(finish(window.pdfjsLib));
      return;
    }
    const s = document.createElement('script');
    s.src = base + '/pdf.min.js';
    s.async = true;
    s.onload = () => {
      const lib = window.pdfjsLib;
      if (!lib) {
        reject(new Error('PDF.js não inicializou após carregar o script.'));
        return;
      }
      resolve(finish(lib));
    };
    s.onerror = () => reject(new Error('Não foi possível carregar PDF.js em ' + s.src));
    document.head.appendChild(s);
  });

  return state.pdfjsLoading;
}

export function clearPageCache() {
  pageCache.clear();
}

async function getPdfPage(pageIndex) {
  if (pageCache.has(pageIndex)) return pageCache.get(pageIndex);
  const page = await state.Book.pdf.getPage(pageIndex + 1);
  pageCache.set(pageIndex, page);
  return page;
}

export async function renderPdfPage(canvas, pageIndex, targetCssWidth) {
  const page = await getPdfPage(pageIndex);
  const unit = page.getViewport({ scale: 1 });
  const scale = (targetCssWidth * dpr) / unit.width;
  const viewport = page.getViewport({ scale });
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  const ctx = canvas.getContext('2d');
  await page.render({ canvasContext: ctx, viewport }).promise;
}
