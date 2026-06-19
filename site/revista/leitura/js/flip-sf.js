'use strict';

import { CONFIG } from './config.js';
import { state } from './state.js';
import { el, showLoader, hideLoader } from './dom.js';
import { gateActive } from './gate.js';
import { isEditingPage } from './page-jump-state.js';
import {
  buildSheets,
  pageToDataURL,
  refreshUI,
  setStateImmediate
} from './flip-css.js';
import { fit } from './stage-fit.js';
import { scheduleSearchHighlights } from './search-highlight.js';

export function loadStPageFlip() {
  if (state.sfLib) return Promise.resolve(state.sfLib);
  if (state.sfLoading) return state.sfLoading;
  const urls = [
    'https://cdn.jsdelivr.net/npm/page-flip@2.0.7/dist/js/page-flip.browser.min.js',
    'https://cdn.jsdelivr.net/npm/page-flip@2.0.7/dist/js/page-flip.browser.js',
    'https://unpkg.com/page-flip@2.0.7/dist/js/page-flip.browser.min.js'
  ];
  state.sfLoading = new Promise((resolve, reject) => {
    let i = 0;
    (function tryNext() {
      if (i >= urls.length) { reject(new Error('sem-cdn')); return; }
      const s = document.createElement('script');
      s.src = urls[i++];
      s.async = true;
      s.onload = () => {
        if (window.St && window.St.PageFlip) { state.sfLib = window.St; resolve(state.sfLib); }
        else { s.remove(); tryNext(); }
      };
      s.onerror = () => { s.remove(); tryNext(); };
      document.head.appendChild(s);
    })();
  });
  return state.sfLoading;
}

export function sizeSfRoot() {
  const pad = 20;
  const availW = el.stage.clientWidth - pad * 2;
  const availH = el.stage.clientHeight - pad * 2;
  if (availW <= 0 || availH <= 0) return;
  const aspect = state.Book.aspect || 1.3;
  const W = Math.max(240, Math.floor(Math.min(availW, (2 * availH) / aspect)));
  el.flipWrap.style.width = W + 'px';
}

export function sfVisibleIndices() {
  if (!state.sf) return [0];
  const i = state.sf.getCurrentPageIndex();
  if (i <= 0) return [0];
  if (state.sfOrientation === 'portrait') return [i];
  const out = [i];
  if (i + 1 < state.Book.N) out.push(i + 1);
  return out;
}

export function sfRefreshUI() {
  if (isEditingPage()) return;
  if (!state.sf) return;
  const locked = gateActive();
  const i = state.sf.getCurrentPageIndex();
  const n = state.Book.N;
  let label;
  if (i <= 0) label = 'Capa';
  else if (i >= n - 1) label = (n > 1 ? 'Contracapa' : 'Capa');
  else if (state.sfOrientation === 'portrait') label = 'p. ' + (i + 1) + ' de ' + n;
  else {
    const r = Math.min(i + 1, n - 1);
    label = (r > i) ? ('p. ' + (i + 1) + '–' + (r + 1) + ' de ' + n)
      : ('p. ' + (i + 1) + ' de ' + n);
  }
  const base = label.replace(/(\d+(?:–\d+)?)/, '<b>$1</b>');
  el.indicator.innerHTML = (locked ? '<span class="preview-tag">Prévia</span> · ' : '') + base;
  el.prev.disabled = (i <= 0);
  el.next.disabled = (i >= n - 1);
}

function currentLeadIndexForBuild() {
  if (state.FLIP === 'sf' && state.sf) return state.sf.getCurrentPageIndex();
  const { Book } = state;
  return (Book.k <= 0) ? 0 : (2 * Book.k - 1);
}

function showSfBuildProgress(cur, total) {
  if (!el.sfBuildProgress) return;
  el.sfBuildProgress.hidden = false;
  el.sfBuildProgress.setAttribute('aria-hidden', 'false');
  const pct = total ? Math.round((cur / total) * 100) : 0;
  el.sfBuildProgress.querySelector('.sf-build-bar').style.width = pct + '%';
  el.sfBuildProgress.querySelector('.sf-build-label').textContent =
    'Preparando virada suave… ' + cur + ' / ' + total;
}

function hideSfBuildProgress() {
  if (!el.sfBuildProgress) return;
  el.sfBuildProgress.hidden = true;
  el.sfBuildProgress.setAttribute('aria-hidden', 'true');
}

export async function buildStPageFlip(startIndex, opts) {
  opts = opts || {};
  const silent = !!opts.silent;
  startIndex = startIndex || 0;
  if (!silent) showLoader('Preparando virada de livro…');
  try {
    const lib = await loadStPageFlip();
    const { Book } = state;

    const imgs = [];
    for (let p = 0; p < Book.N; p++) {
      if (p % 4 === 0) {
        const msg = 'Preparando página ' + (p + 1) + ' de ' + Book.N + '…';
        if (silent) showSfBuildProgress(p + 1, Book.N);
        else el.loaderTxt.textContent = msg;
      }
      imgs.push(await pageToDataURL(p));
      if (p % 2 === 1) await new Promise(r => setTimeout(r, 0));
    }

    const target = currentLeadIndexForBuild();

    if (state.sf) { try { state.sf.destroy(); } catch (e) {} }
    el.flipWrap.innerHTML = '';
    sizeSfRoot();

    const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const minW = Math.round((CONFIG.MOBILE_BREAKPOINT || 680) / 2);

    state.sf = new lib.PageFlip(el.flipWrap, {
      width: Book.pw,
      height: Book.ph,
      size: 'stretch',
      minWidth: minW,
      maxWidth: 1600,
      minHeight: Math.round(minW * (Book.aspect || 1.3)),
      maxHeight: 2400,
      drawShadow: true,
      maxShadowOpacity: 0.5,
      showCover: true,
      usePortrait: true,
      mobileScrollSupport: false,
      useMouseEvents: true,
      disableFlipByClick: true,
      showPageCorners: true,
      flippingTime: RM ? 1 : 700,
      autoSize: true,
      startPage: target
    });

    state.sf.on('init', (e) => {
      state.sfOrientation = (e.data && e.data.mode) || state.sfOrientation;
      sfRefreshUI();
    });
    state.sf.on('flip', () => {
      sfRefreshUI();
      state.hasInteracted = true;
      scheduleSearchHighlights();
    });
    state.sf.on('changeOrientation', (e) => {
      state.sfOrientation = e.data || state.sfOrientation;
      sfRefreshUI();
    });

    state.sf.loadFromImages(imgs);
    try { if (state.sf.getOrientation) state.sfOrientation = state.sf.getOrientation(); } catch (e) {}
    if (target > 0) {
      const applyTarget = () => {
        try { state.sf.turnToPage(target); } catch (e) {}
        sfRefreshUI();
      };
      applyTarget();
      [60, 250, 600].forEach((ms) => setTimeout(applyTarget, ms));
    }

    state.FLIP = 'sf';
    el.stage.classList.add('sf-mode');
    hideSfBuildProgress();
    if (!silent) hideLoader();
    sfRefreshUI();
    requestAnimationFrame(sizeSfRoot);
  } catch (err) {
    console.warn('StPageFlip indisponível; usando a virada em CSS.', err);
    hideSfBuildProgress();
    if (!silent) hideLoader();
    state.FLIP = 'custom';
    el.stage.classList.remove('sf-mode');
    if (!state.Book.sheetEls || !state.Book.sheetEls.length) buildSheets();
    setStateImmediate(Math.min(state.Book.maxK, Math.ceil((startIndex || 0) / 2)));
    fit();
  }
}

export async function upgradeToStPageFlipInBackground() {
  if (!CONFIG.FLIP_LIB || !state.sfReady || state.FLIP === 'sf' || state.sfUpgradeRunning || state.Book.N <= 0) return;
  state.sfUpgradeRunning = true;
  try {
    await buildStPageFlip(currentLeadIndexForBuild(), { silent: true });
  } finally {
    state.sfUpgradeRunning = false;
    if (state.FLIP === 'sf') sfRefreshUI();
    else refreshUI();
  }
}

export function maybeUpgrade(rebuildView) {
  if (!CONFIG.FLIP_LIB || !state.sfReady) return;
  if (state.FLIP === 'sf' || state.Book.N <= 0 || state.hasInteracted) return;
  if (state.Book.source !== 'demo') return;
  rebuildView(currentLeadIndexForBuild());
}

export function bindSfResize() {
  window.addEventListener('resize', () => { if (state.FLIP === 'sf') sizeSfRoot(); });
}
