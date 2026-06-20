'use strict';

/* Comparador "descortinar" (antes/depois) da foto do Dr. Carlson.
   Arraste (mouse/touch) em qualquer ponto da imagem; setas no teclado
   quando o controle (range) está focado. */
(function () {
  const ba = document.getElementById('royBA');
  if (!ba) return;
  const range = ba.querySelector('.ba-range');

  function setPos(pct) {
    pct = Math.max(0, Math.min(100, pct));
    ba.style.setProperty('--pos', pct + '%');
    if (range && Math.round(Number(range.value)) !== Math.round(pct)) {
      range.value = String(Math.round(pct));
    }
  }

  function pctFromX(clientX) {
    const r = ba.getBoundingClientRect();
    return r.width ? ((clientX - r.left) / r.width) * 100 : 50;
  }

  let dragging = false;
  ba.addEventListener('pointerdown', (e) => {
    dragging = true;
    if (ba.setPointerCapture) {
      try { ba.setPointerCapture(e.pointerId); } catch (_) {}
    }
    setPos(pctFromX(e.clientX));
    if (range) range.focus({ preventScroll: true });
    e.preventDefault();
  });
  ba.addEventListener('pointermove', (e) => {
    if (dragging) setPos(pctFromX(e.clientX));
  });
  const stop = () => { dragging = false; };
  ba.addEventListener('pointerup', stop);
  ba.addEventListener('pointercancel', stop);

  // Teclado (range focável, mesmo invisível)
  if (range) range.addEventListener('input', () => setPos(Number(range.value)));
})();
