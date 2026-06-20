'use strict';

/* Leitor leve para iPhone/iPad (e demais aparelhos de toque): em vez do PDF.js
   (que estoura a memória do Safari no iOS), exibe a revista como páginas em
   imagem, carregadas sob demanda (lazy). Mantém o gate de captura de e-mail. */

import { CONFIG } from './config.js';
import { state } from './state.js';
import { el, showError, hideError } from './dom.js';
import { previewCount } from './gate.js';

const PAGES_DIR = '/revista/leitura/pages/';

function pageImg(i, eager) {
  const img = document.createElement('img');
  img.className = 'img-page';
  img.src = PAGES_DIR + 'p' + String(i).padStart(3, '0') + '.jpg';
  img.alt = 'Revista IRC — página ' + i;
  img.loading = eager ? 'eager' : 'lazy';
  img.decoding = 'async';
  img.draggable = false;
  return img;
}

function leadUnlocked() {
  try {
    return !!(state.store && state.store.get && state.store.get('lead_ok') === '1');
  } catch (e) {
    return false;
  }
}

function postLead(email) {
  const G = CONFIG.GATE || {};
  if (!G.endpoint) return;
  try {
    const body = new URLSearchParams();
    body.append('email', String(email || '').trim());
    body.append('source', state.leadSource || G.source || 'revista-mobile');
    body.append('page', String(previewCount() + 1));
    body.append('ref', document.referrer || '');
    body.append('ua', navigator.userAgent);
    body.append('ts', new Date().toISOString());
    fetch(G.endpoint, { method: 'POST', mode: 'no-cors', body, keepalive: true }).catch(() => {});
  } catch (e) { /* ignore */ }
}

function gateBlock(onUnlock) {
  const G = CONFIG.GATE || {};
  const box = document.createElement('div');
  box.className = 'img-gate';
  box.innerHTML =
    '<div class="img-gate-card">' +
    '<div class="img-gate-kicker">' + (G.kicker || 'Continue a leitura') + '</div>' +
    '<h3>' + (G.title || 'Receba a edição completa') + '</h3>' +
    '<p class="sub">' + (G.subtitle || 'Deixe seu e-mail para continuar lendo esta edição.') + '</p>' +
    '<form class="img-gate-form" novalidate>' +
    '<input type="email" inputmode="email" autocomplete="email" placeholder="seu@email.com" aria-label="Seu e-mail" />' +
    '<button type="submit">' + (G.button || 'Continuar lendo') + '</button>' +
    '<div class="img-gate-msg" aria-live="polite"></div>' +
    '</form>' +
    (G.privacy ? '<p class="img-gate-note">' + G.privacy + '</p>' : '') +
    '</div>';

  const form = box.querySelector('form');
  const input = box.querySelector('input');
  const msg = box.querySelector('.img-gate-msg');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const v = input.value.trim();
    if (!/.+@.+\..+/.test(v)) { msg.textContent = 'Informe um e-mail válido.'; return; }
    postLead(v);
    try { if (state.store && state.store.set) state.store.set('lead_ok', '1'); } catch (_) {}
    state.unlocked = true;
    onUnlock();
  });
  return box;
}

export async function initImageReader() {
  document.body.classList.add('img-mode');
  hideError();

  let man;
  try {
    man = await fetch(PAGES_DIR + 'manifest.json', { cache: 'no-cache' }).then((r) => r.json());
  } catch (e) {
    showError('Não consegui carregar a revista. Tente novamente.');
    return;
  }
  const N = (man && man.count) | 0;
  if (!N) { showError('Revista indisponível no momento.'); return; }

  const gateOn = !!(CONFIG.GATE && CONFIG.GATE.enabled) && !leadUnlocked();
  const preview = gateOn ? Math.min(N, previewCount()) : N;

  const reader = document.createElement('div');
  reader.className = 'img-reader';

  for (let i = 1; i <= preview; i++) reader.appendChild(pageImg(i, i <= 2));

  if (gateOn && preview < N) {
    const rest = document.createElement('div');
    rest.className = 'img-rest';
    rest.hidden = true;
    for (let i = preview + 1; i <= N; i++) rest.appendChild(pageImg(i, false));

    const gate = gateBlock(function () {
      gate.remove();
      rest.hidden = false;
    });
    reader.appendChild(gate);
    reader.appendChild(rest);
  }

  el.stage.appendChild(reader);
}
