'use strict';

import './polyfill.js';
import { BUILD, CONFIG, ARTICLE_SLUGS, LOW_MEM } from './config.js';
import { state } from './state.js';
import { el, showLoader, hideLoader, showError, hideError } from './dom.js';
import {
  initGate,
  setupGateFromUrl,
  setupGateTexts,
  resolveStartPage,
  maybeOpenGateForDeepLink
} from './gate.js';
import {
  getPage,
  goTo,
  refreshUI,
  spreadView,
  rebuildView,
  tryMaybeUpgrade
} from './flip-controller.js';
import {
  buildSheets,
  preRenderPages,
  prefetchBackground,
  setStateImmediate
} from './flip-css.js';
import { loadStPageFlip, bindSfResize, upgradeToStPageFlipInBackground } from './flip-sf.js';
import { bindStageFit, fit } from './stage-fit.js';
import { initNavigation } from './navigation.js';
import { initThumbnails, onPageChange } from './thumbnails.js';
import { initPageJump } from './page-jump.js';
import { initSearch, clearSearchIndex } from './search.js';
import { initShare } from './share.js';
import { clearPageCache, loadPdfJs } from './pdf.js';
import { initImageReader } from './image-reader.js';
import { DEMO } from './demo.js';

async function openMagazineView() {
  if (!state.pdfDocumentReady || state.Book.source !== 'pdf') return;
  if (state.magazineViewOpen) return;
  state.magazineViewOpen = true;

  const start = resolveStartPage();
  state.FLIP = 'custom';
  el.stage.classList.remove('sf-mode');
  buildSheets();
  setStateImmediate(start > 0 ? Math.min(state.Book.maxK, Math.ceil(start / 2)) : 0);

  showLoader('Abrindo capa e índice…');
  const priority = [0, 1, 2];
  if (start > 2) priority.push(start, start + 1);
  await preRenderPages(priority);
  hideLoader();
  fit();
  prefetchBackground(3);
  maybeOpenGateForDeepLink();
  if (CONFIG.FLIP_LIB && state.sfReady && !LOW_MEM) upgradeToStPageFlipInBackground();
}

function onFlipLibReady() {
  if (!state.pdfDocumentReady || state.Book.source !== 'pdf') {
    tryMaybeUpgrade();
    return;
  }
  if (state.magazineViewOpen) {
    if (state.FLIP !== 'sf') upgradeToStPageFlipInBackground();
    return;
  }
  if (state.hasInteracted) return;
  openMagazineView();
}

function loadDemo() {
  hideError();
  state.hasInteracted = false;
  state.prefetchStarted = false;
  clearPageCache();
  state.Book.source = 'demo';
  state.Book.pdf = null;
  state.Book.Nfull = DEMO.pages;
  state.Book.N = state.Book.Nfull;
  state.Book.aspect = 1.30;
  state.Book.ph = Math.round(state.Book.pw * state.Book.aspect);
  state.magazineViewOpen = false;
  state.pdfDocumentReady = false;
  rebuildView(0);
}

async function loadMagazinePdf() {
  showLoader('Carregando Revista IRC…');
  hideError();
  try {
    const lib = await loadPdfJs();
    const url = CONFIG.DEFAULT_PDF_URL;
    const needsCreds = url.startsWith('/api/');
    const pdf = await lib.getDocument({ url, withCredentials: needsCreds }).promise;
    state.Book.source = 'pdf';
    state.Book.pdf = pdf;
    state.Book.Nfull = pdf.numPages;
    state.Book.N = state.Book.Nfull;
    const p1 = await pdf.getPage(1);
    const vp = p1.getViewport({ scale: 1 });
    state.Book.aspect = vp.height / vp.width;
    state.Book.ph = Math.round(state.Book.pw * state.Book.aspect);
    state.pdfDocumentReady = true;
    state.prefetchStarted = false;
    clearPageCache();
    clearSearchIndex();
    await openMagazineView();
  } catch (err) {
    hideLoader();
    console.error(err);
    showError(
      'Não foi possível carregar a Revista IRC. Confira se revista.pdf está em leitura/. ' +
      (err && err.message ? err.message : String(err))
    );
  }
}

async function loadPdfFromData(data, label) {
  showLoader('Abrindo ' + (label || 'PDF') + '…');
  hideError();
  try {
    const lib = await loadPdfJs();
    const task = lib.getDocument(data);
    const pdf = await task.promise;
    state.Book.source = 'pdf';
    state.Book.pdf = pdf;
    state.Book.Nfull = pdf.numPages;
    state.Book.N = state.Book.Nfull;
    const p1 = await pdf.getPage(1);
    const vp = p1.getViewport({ scale: 1 });
    state.Book.aspect = vp.height / vp.width;
    state.Book.ph = Math.round(state.Book.pw * state.Book.aspect);
    state.pdfDocumentReady = true;
    state.prefetchStarted = false;
    state.magazineViewOpen = false;
    clearPageCache();
    hideLoader();
    await openMagazineView();
  } catch (err) {
    hideLoader();
    console.error(err);
    showError('Não foi possível abrir este PDF (' + (err && err.message ? err.message : 'erro') + ').');
  }
}

function handleFile(file) {
  if (!file) return;
  if (file.type && file.type.indexOf('pdf') === -1 && !/\.pdf$/i.test(file.name)) {
    showError('Selecione um arquivo PDF.');
    return;
  }
  const reader = new FileReader();
  reader.onload = () => loadPdfFromData({ data: new Uint8Array(reader.result) }, file.name);
  reader.onerror = () => showError('Falha ao ler o arquivo.');
  reader.readAsArrayBuffer(file);
}

function applyConfigToDom() {
  document.getElementById('mastTitle').textContent = CONFIG.MAGAZINE.name;
  document.getElementById('mastKicker').textContent = CONFIG.MAGAZINE.kicker;
  document.getElementById('mastTag').textContent = CONFIG.MAGAZINE.tagline;
  document.title = CONFIG.MAGAZINE.name + ' — Leitura';

  if (el.buildTag) el.buildTag.textContent = BUILD;

  if (CONFIG.SHOW_FILE_UPLOAD === false) {
    const btn = document.querySelector('.file-btn');
    if (btn) btn.style.display = 'none';
    const spacers = document.querySelectorAll('.controls .spacer');
    if (spacers.length) spacers[spacers.length - 1].style.display = 'none';
  }
}

function applyBibliotecaModeFromUrl() {
  try {
    const sp = new URLSearchParams(location.search);
    const pdf = sp.get('pdf');
    if (!pdf) return;

    CONFIG.DEFAULT_PDF_URL = pdf;
    CONFIG.GATE.enabled = false;
    CONFIG.READER_CONTEXT = 'biblioteca';

    const src = sp.get('src') || '';
    if (src.startsWith('biblioteca-')) {
      CONFIG.DOC_SLUG = src.slice('biblioteca-'.length);
    }

    const tocRaw = sp.get('toc');
    if (tocRaw) {
      try {
        CONFIG.DOC_TOC = JSON.parse(decodeURIComponent(tocRaw));
      } catch {
        CONFIG.DOC_TOC = [];
      }
    }

    const title = sp.get('title');
    if (title) {
      CONFIG.MAGAZINE.name = title;
      CONFIG.MAGAZINE.kicker = 'Biblioteca IRC';
      CONFIG.MAGAZINE.tagline = 'Instituto Roy Carlson';
      CONFIG.MAGAZINE.coverLine = title;
      CONFIG.MAGAZINE.coverKicker = 'leitura';
    }
    if (src) CONFIG.GATE.source = src;
  } catch (e) { /* ignore */ }
}

function bootstrap() {
  applyBibliotecaModeFromUrl();
  applyConfigToDom();
  setupGateFromUrl(ARTICLE_SLUGS);

  // iPhone/iPad e aparelhos de toque: o PDF.js estoura a memória do Safari no
  // iOS (a capa nem chega a aparecer). Para a Revista, usamos o leitor de
  // imagens — páginas sob demanda, leve — mantendo o gate de e-mail. Desktop e
  // o modo biblioteca seguem com o flipbook em PDF.
  if (LOW_MEM && CONFIG.READER_CONTEXT === 'revista') {
    initImageReader();
    return;
  }

  setupGateTexts();

  initGate({
    getCurrentLeadIndex: getPage,
    goToPageIndex: goTo,
    refreshUI,
    spreadView
  });

  bindStageFit();
  bindSfResize();
  initNavigation({ handleFile });
  initThumbnails();
  initPageJump(refreshUI);
  initSearch();
  initShare();
  state.uiHooks.onPageChange = onPageChange;

  if (CONFIG.FLIP_LIB && !LOW_MEM) {
    loadStPageFlip()
      .then(() => {
        state.sfReady = true;
        onFlipLibReady();
      })
      .catch(() => { /* mantém virada em CSS */ });
  }

  if (CONFIG.DEFAULT_PDF_URL) {
    loadMagazinePdf();
  } else {
    loadDemo();
  }
}

bootstrap();
