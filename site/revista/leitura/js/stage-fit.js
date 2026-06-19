'use strict';

import { state } from './state.js';
import { el } from './dom.js';

let baseFit = 1;

export function updateLayoutMode() { /* reservado */ }

function applyViewTransform() {
  el.scaler.style.transform = 'scale(' + baseFit + ')';
}

export function fit() {
  updateLayoutMode();
  const { Book } = state;
  const pad = document.body.classList.contains('reading-mode') ? 8 : 28;
  const availW = el.stage.clientWidth - pad * 2;
  const availH = el.stage.clientHeight - pad * 2;
  if (availW <= 0 || availH <= 0) return;
  const bookW = Book.pw * 2, bookH = Book.ph;
  baseFit = Math.min(availW / bookW, availH / bookH);
  applyViewTransform();
}

export function bindStageFit() {
  window.addEventListener('resize', fit);
}
