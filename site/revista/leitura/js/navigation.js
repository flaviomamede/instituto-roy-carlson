'use strict';

import { CONFIG } from './config.js';
import { el } from './dom.js';
import { closeGate, submitLead, finishUnlock } from './gate.js';
import {
  next,
  prev,
  goStart,
  goEnd,
  flipClickRoot
} from './flip-controller.js';
import { openZoom, closeZoom, isZoomOpen, lbTurn, zoomIn, zoomOut } from './zoom.js';
import { fit } from './stage-fit.js';

let handleFile = () => {};

function isMobileView() {
  return window.innerWidth < (CONFIG.MOBILE_BREAKPOINT || 680);
}

function toggleFullscreen() {
  const d = document;
  const canNative = !!(d.documentElement.requestFullscreen || d.documentElement.webkitRequestFullscreen);
  const isNative = !!(d.fullscreenElement || d.webkitFullscreenElement);
  if (canNative && !isMobileView()) {
    if (!isNative) {
      (d.documentElement.requestFullscreen || d.documentElement.webkitRequestFullscreen).call(d.documentElement);
    } else {
      (d.exitFullscreen || d.webkitExitFullscreen).call(d);
    }
    return;
  }
  document.body.classList.toggle('reading-mode');
  setTimeout(fit, 50);
}

const stageTap = { active: false, id: null, x: 0, y: 0, moved: false };

function handleStageFlipClick(e) {
  if (el.gate.classList.contains('open') || isZoomOpen()) return;
  const root = flipClickRoot();
  if (!root) return;
  const r = root.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
  const nx = (e.clientX - r.left) / r.width;
  const ny = (e.clientY - r.top) / r.height;
  const edge = 0.16;
  if ((nx < edge || nx > 1 - edge) && (ny < edge || ny > 1 - edge)) return;
  if (nx > 0.52) next();
  else if (nx < 0.48) prev();
}

export function initNavigation(opts = {}) {
  if (opts.handleFile) handleFile = opts.handleFile;

  el.prev.addEventListener('click', prev);
  el.next.addEventListener('click', next);
  el.zoom.addEventListener('click', openZoom);
  el.fs.addEventListener('click', toggleFullscreen);
  el.file.addEventListener('change', (e) => handleFile(e.target.files && e.target.files[0]));

  el.gateSubmit.addEventListener('click', submitLead);
  el.gateEmail.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); submitLead(); }
  });
  el.gateEmail.addEventListener('input', () => {
    el.gateEmail.classList.remove('err');
    el.gateMsg.textContent = '';
  });
  el.gateSkip.addEventListener('click', finishUnlock);
  el.gate.addEventListener('click', (e) => { if (e.target === el.gate) closeGate(); });

  el.lbIn.addEventListener('click', zoomIn);
  el.lbOut.addEventListener('click', zoomOut);
  el.lbPrev.addEventListener('click', () => lbTurn(-1));
  el.lbNext.addEventListener('click', () => lbTurn(1));
  el.lbClose.addEventListener('click', closeZoom);

  el.stage.addEventListener('pointerdown', (e) => {
    if (el.gate.classList.contains('open') || isZoomOpen()) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const root = flipClickRoot();
    if (!root) return;
    const r = root.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
    stageTap.active = true;
    stageTap.id = e.pointerId;
    stageTap.x = e.clientX;
    stageTap.y = e.clientY;
    stageTap.moved = false;
  }, { passive: true });

  el.stage.addEventListener('pointermove', (e) => {
    if (!stageTap.active || e.pointerId !== stageTap.id) return;
    if (Math.abs(e.clientX - stageTap.x) + Math.abs(e.clientY - stageTap.y) > 12) stageTap.moved = true;
  }, { passive: true });

  el.stage.addEventListener('pointerup', (e) => {
    if (!stageTap.active || e.pointerId !== stageTap.id) return;
    stageTap.active = false;
    if (stageTap.moved) return;
    handleStageFlipClick(e);
  });

  el.stage.addEventListener('pointercancel', () => { stageTap.active = false; });

  document.addEventListener('keydown', (e) => {
    if (el.gate.classList.contains('open')) {
      if (e.key === 'Escape') closeGate();
      return;
    }
    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
        next();
        break;
      case 'ArrowLeft':
      case 'PageUp':
        prev();
        break;
      case 'Home':
        goStart();
        break;
      case 'End':
        goEnd();
        break;
      case 'z':
      case 'Z':
        if (isZoomOpen()) closeZoom();
        else openZoom();
        break;
      case 'Escape':
        if (isZoomOpen()) closeZoom();
        else return;
        break;
      case 'f':
      case 'F':
        toggleFullscreen();
        break;
      default:
        return;
    }
    e.preventDefault();
  });

  ['dragenter', 'dragover'].forEach(ev =>
    el.stage.addEventListener(ev, (e) => {
      e.preventDefault();
      el.stage.classList.add('dragover');
    }));
  ['dragleave', 'drop'].forEach(ev =>
    el.stage.addEventListener(ev, (e) => {
      e.preventDefault();
      if (ev === 'dragleave' && e.target !== el.stage) return;
      el.stage.classList.remove('dragover');
    }));
  el.stage.addEventListener('drop', (e) => {
    const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) handleFile(f);
  });

  document.addEventListener('fullscreenchange', () => { setTimeout(fit, 50); });
  document.addEventListener('webkitfullscreenchange', () => { setTimeout(fit, 50); });
}
