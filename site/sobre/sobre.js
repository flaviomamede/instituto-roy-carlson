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

/* Carrossel de homenageados: janela de 4, avança 1 a cada 2s, cíclico.
   Loop contínuo com clones do início; pausa no hover/foco e com a aba oculta. */
(function () {
  const carousel = document.getElementById('homCarousel');
  const track = document.getElementById('homTrack');
  if (!carousel || !track) return;

  const originals = Array.prototype.slice.call(track.children);
  const N = originals.length;
  if (N <= 1) return;
  for (let k = 0; k < Math.min(4, N); k++) {
    track.appendChild(originals[k].cloneNode(true));
  }

  let i = 0;
  let timer = null;

  function stepPx() {
    const first = track.children[0];
    return first ? first.getBoundingClientRect().width : 0;
  }
  function render(animate) {
    track.style.transition = animate ? '' : 'none';
    track.style.transform = 'translateX(' + (-i * stepPx()) + 'px)';
  }
  function advance() {
    i += 1;
    render(true);
    if (i >= N) {
      window.setTimeout(function () { i = 0; render(false); }, 640);
    }
  }
  function play() { if (!timer) timer = window.setInterval(advance, 2000); }
  function pause() { if (timer) { window.clearInterval(timer); timer = null; } }

  carousel.addEventListener('mouseenter', pause);
  carousel.addEventListener('mouseleave', play);
  carousel.addEventListener('focusin', pause);
  carousel.addEventListener('focusout', play);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) pause(); else play();
  });
  window.addEventListener('resize', function () { render(false); });

  render(false);
  play();
})();
