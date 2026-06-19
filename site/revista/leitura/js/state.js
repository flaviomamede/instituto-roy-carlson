'use strict';

import { CONFIG } from './config.js';

const memStore = {};

export const state = {
  Book: {
    source: 'demo',
    pdf: null,
    N: 0,
    Nfull: 0,
    sheets: 0,
    maxK: 0,
    k: 0,
    pw: CONFIG.PAGE_WIDTH,
    ph: Math.round(CONFIG.PAGE_WIDTH * 1.3),
    aspect: 1.3,
    sheetEls: [],
    flipping: false
  },
  FLIP: 'custom',
  sf: null,
  sfLib: null,
  sfLoading: null,
  sfReady: false,
  sfOrientation: 'landscape',
  sfUpgradeRunning: false,
  hasInteracted: false,
  pdfjsLib: null,
  pdfjsLoading: null,
  magazineViewOpen: false,
  prefetchStarted: false,
  pdfDocumentReady: false,
  pendingPage: null,
  unlocked: false,
  leadSource: (CONFIG.GATE && CONFIG.GATE.source) || 'site',
  store: {
    get(k) {
      try { return localStorage.getItem(k); }
      catch (e) { return (k in memStore) ? memStore[k] : null; }
    },
    set(k, v) {
      try { localStorage.setItem(k, v); }
      catch (e) { memStore[k] = v; }
    }
  }
};
