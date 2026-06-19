'use strict';

import { state } from './state.js';
import { el } from './dom.js';
import { gateActive, previewCount, openGate } from './gate.js';
import { goTo, getPage } from './flip-controller.js';
import { setPageJumpEditing, isEditingPage } from './page-jump-state.js';

export { isEditingPage } from './page-jump-state.js';

let refreshUIRef = () => {};

function finishEdit(revert) {
  if (!isEditingPage()) return;
  setPageJumpEditing(false);
  if (!revert) {
    const input = document.getElementById('pageJumpInput');
    if (input) {
      let val = parseInt(input.value, 10);
      if (Number.isFinite(val)) {
        val = Math.max(1, Math.min(maxPage(), val));
        const index = val - 1;
        if (gateActive() && index >= previewCount()) {
          state.pendingPage = index;
          openGate();
        } else {
          goTo(index);
        }
      }
    }
  }
  refreshUIRef();
}

function maxPage() {
  return Math.max(1, state.Book.N || 1);
}

function showInput() {
  if (isEditingPage() || !el.indicator) return;
  setPageJumpEditing(true);
  const cur = getPage() + 1;
  const input = document.createElement('input');
  input.type = 'number';
  input.min = '1';
  input.max = String(maxPage());
  input.value = String(cur);
  input.className = 'page-jump-input';
  input.setAttribute('aria-label', 'Ir para a página');
  input.id = 'pageJumpInput';
  el.indicator.replaceChildren(input);
  input.focus();
  input.select();

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      finishEdit(false);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      finishEdit(true);
    }
  });
  input.addEventListener('blur', () => finishEdit(false));
}

export function initPageJump(refreshUI) {
  if (!el.indicator) return;
  refreshUIRef = refreshUI;
  el.indicator.classList.add('page-jump-trigger');
  el.indicator.setAttribute('role', 'button');
  el.indicator.setAttribute('tabindex', '0');
  el.indicator.setAttribute('title', 'Clique para ir a uma página');
  el.indicator.addEventListener('click', (e) => {
    if (e.target.closest('input')) return;
    showInput();
  });
  el.indicator.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      showInput();
    }
  });
}
