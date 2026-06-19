'use strict';

import { CONFIG } from './config.js';
import { state } from './state.js';
import { el } from './dom.js';
import { atGate, openGate, gateActive, previewCount } from './gate.js';
import { scheduleSearchHighlights } from './search-highlight.js';
import {
  buildSheets,
  flipForward,
  flipBackward,
  refreshUI as cssRefreshUI,
  setStateImmediate
} from './flip-css.js';
import {
  buildStPageFlip,
  sfRefreshUI,
  sfVisibleIndices,
  maybeUpgrade
} from './flip-sf.js';

export function isMobileView() {
  return window.innerWidth < (CONFIG.MOBILE_BREAKPOINT || 680);
}

export function spreadView() {
  if (state.FLIP === 'sf' && state.sf) return state.sfOrientation !== 'portrait';
  return !isMobileView();
}

export function getPage() {
  if (state.FLIP === 'sf' && state.sf) return state.sf.getCurrentPageIndex();
  const { Book } = state;
  return (Book.k <= 0) ? 0 : (2 * Book.k - 1);
}

export function visibleSpread() {
  if (state.FLIP === 'sf' && state.sf) return sfVisibleIndices();
  const { Book } = state;
  if (Book.k === 0) return [0];
  if (isMobileView()) return [Math.max(0, getPage())];
  const idxs = [];
  const l = 2 * Book.k - 1, r = 2 * Book.k;
  if (l < Book.N) idxs.push(l);
  if (r < Book.N) idxs.push(r);
  return idxs.length ? idxs : [0];
}

export function refreshUI() {
  if (state.FLIP === 'sf' && state.sf) sfRefreshUI();
  else cssRefreshUI();
  state.uiHooks.onPageChange();
  scheduleSearchHighlights();
}

export function flipClickRoot() {
  return (state.FLIP === 'sf') ? el.flipWrap : el.book;
}

export function next() {
  if (atGate()) { openGate(); return; }
  state.hasInteracted = true;
  if (state.FLIP === 'sf' && state.sf) state.sf.flipNext();
  else flipForward();
}

export function prev() {
  state.hasInteracted = true;
  if (state.FLIP === 'sf' && state.sf) state.sf.flipPrev();
  else flipBackward();
}

export function goStart() {
  state.hasInteracted = true;
  if (state.FLIP === 'sf' && state.sf) state.sf.turnToPage(0);
  else setStateImmediate(0);
}

export function goEnd() {
  state.hasInteracted = true;
  if (state.FLIP === 'sf' && state.sf) state.sf.turnToPage(Math.max(0, state.Book.N - 1));
  else setStateImmediate(state.Book.maxK);
}

export function goTo(index) {
  const { Book } = state;
  if (Book.N <= 0) return;
  index = Math.max(0, Math.min(Book.N - 1, index | 0));
  if (gateActive() && index >= previewCount()) {
    state.pendingPage = index;
    openGate();
    return;
  }
  state.hasInteracted = true;
  if (state.FLIP === 'sf' && state.sf) {
    try { state.sf.turnToPage(index); } catch (e) {}
    sfRefreshUI();
    scheduleSearchHighlights();
    return;
  }
  const k = index <= 0 ? 0 : Math.min(Book.maxK, Math.ceil(index / 2));
  setStateImmediate(k);
  scheduleSearchHighlights();
}

export function rebuildView(startIndex) {
  if (CONFIG.FLIP_LIB && state.sfReady) {
    buildStPageFlip(startIndex || 0);
  } else {
    state.FLIP = 'custom';
    el.stage.classList.remove('sf-mode');
    buildSheets();
    const k = (startIndex && startIndex > 0) ? Math.min(state.Book.maxK, Math.ceil(startIndex / 2)) : 0;
    setStateImmediate(k);
    fit();
  }
}

export function tryMaybeUpgrade() {
  maybeUpgrade(rebuildView);
}
