'use strict';

export const el = {
  stage: document.getElementById('stage'),
  scaler: document.getElementById('scaler'),
  flipWrap: document.getElementById('flipWrap'),
  book: document.getElementById('book'),
  pages: document.getElementById('pages'),
  prev: document.getElementById('prevBtn'),
  next: document.getElementById('nextBtn'),
  zoom: document.getElementById('zoomBtn'),
  fs: document.getElementById('fsBtn'),
  indicator: document.getElementById('indicator'),
  file: document.getElementById('fileInput'),
  loader: document.getElementById('loader'),
  loaderTxt: document.getElementById('loaderText'),
  errbox: document.getElementById('errbox'),
  errText: document.getElementById('errText'),
  lb: document.getElementById('lightbox'),
  lbStage: document.getElementById('lbStage'),
  lbBook: document.getElementById('lbBook'),
  lbContent: document.getElementById('lbContent'),
  lbPage: document.getElementById('lbPage'),
  lbIn: document.getElementById('lbIn'),
  lbOut: document.getElementById('lbOut'),
  lbPrev: document.getElementById('lbPrev'),
  lbNext: document.getElementById('lbNext'),
  lbClose: document.getElementById('lbClose'),
  gate: document.getElementById('gate'),
  gateEmail: document.getElementById('gateEmail'),
  gateSubmit: document.getElementById('gateSubmit'),
  gateMsg: document.getElementById('gateMsg'),
  gateSkip: document.getElementById('gateSkip'),
  buildTag: document.getElementById('buildTag')
};

export function showLoader(text) {
  el.loaderTxt.textContent = text || 'Carregando…';
  el.loader.classList.add('show');
}

export function hideLoader() {
  el.loader.classList.remove('show');
}

export function showError(msg) {
  el.errText.textContent = msg;
  el.errbox.classList.add('show');
}

export function hideError() {
  el.errbox.classList.remove('show');
}
