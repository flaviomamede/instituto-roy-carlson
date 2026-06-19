'use strict';

import { CONFIG } from './config.js';
import { state } from './state.js';
import { el } from './dom.js';

/** Callbacks registrados por flip-controller (evita import circular). */
let deps = {
  getCurrentLeadIndex: () => 0,
  goToPageIndex: () => {},
  refreshUI: () => {},
  spreadView: () => true
};

export function initGate(api) {
  deps = { ...deps, ...api };
}

export function setupGateFromUrl(ARTICLE_SLUGS) {
  const G = CONFIG.GATE || {};
  try {
    const sp = new URLSearchParams(location.search);
    if (sp.get('src')) state.leadSource = sp.get('src');
    const slug = sp.get('artigo');
    if (slug && ARTICLE_SLUGS[slug] != null) {
      state.pendingPage = ARTICLE_SLUGS[slug];
      if (!sp.get('src')) state.leadSource = 'artigo-' + slug;
    }
    const pg = parseInt(sp.get('page'), 10);
    if (pg > 0) state.pendingPage = pg - 1;
  } catch (e) {}
  if (state.store.get('lead_ok') === '1') state.unlocked = true;
}

export function setupGateTexts() {
  const G = CONFIG.GATE || {};
  const set = (id, txt) => { const n = document.getElementById(id); if (n) n.textContent = txt; };
  set('gateKicker', G.kicker || 'Continue a leitura');
  set('gateTitle', G.title || 'Receba a edição completa');
  set('gateSub', G.subtitle || 'Deixe seu e-mail para continuar lendo.');
  set('gateBtnText', G.button || 'Continuar lendo');

  const note = document.getElementById('gateNote');
  if (note) {
    note.textContent = G.privacy || '';
    if (G.privacyUrl) {
      const a = document.createElement('a');
      a.href = G.privacyUrl;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = ' Política de privacidade.';
      note.appendChild(a);
    }
  }
  if (G.allowSkip && el.gateSkip) el.gateSkip.style.display = '';
}

export function previewCount() {
  const ip = Math.max(1, (CONFIG.GATE && (CONFIG.GATE.indexPage || CONFIG.GATE.freePages)) || 2);
  const D = deps.spreadView() ? ((ip % 2 === 1) ? ip : ip + 1) : ip;
  return Math.max(1, Math.min(D, state.Book.Nfull || D));
}

export function gateActive() {
  return !!(CONFIG.GATE && CONFIG.GATE.enabled) && !state.unlocked && (state.Book.Nfull | 0) > previewCount();
}

export function validEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());
}

export function atGate() {
  if (!gateActive()) return false;
  const lim = previewCount() - 1;
  const { Book, FLIP, sf } = state;
  let rightVisible;
  if (FLIP === 'sf' && sf) {
    const cur = sf.getCurrentPageIndex();
    rightVisible = deps.spreadView() ? (cur + 1) : cur;
  } else {
    rightVisible = (Book.k <= 0) ? 0 : (2 * Book.k);
  }
  return rightVisible >= lim;
}

export function openGate() {
  el.gate.classList.add('open');
  el.gate.setAttribute('aria-hidden', 'false');
  el.gateMsg.textContent = '';
  el.gateEmail.classList.remove('err');
  setTimeout(() => { try { el.gateEmail.focus(); } catch (e) {} }, 60);
}

export function closeGate() {
  el.gate.classList.remove('open');
  el.gate.setAttribute('aria-hidden', 'true');
}

export function sendLead(email) {
  const G = CONFIG.GATE || {};
  const info = {
    email: String(email || '').trim(),
    source: state.leadSource,
    page: deps.getCurrentLeadIndex() + 1,
    ref: document.referrer || '',
    ua: navigator.userAgent,
    ts: new Date().toISOString()
  };

  if ((G.mode || '') === 'google_form') {
    const f = G.form || {};
    const ready = f.action && f.action.indexOf('FORM_ID') === -1 &&
      f.email && f.email.indexOf('0000000000') === -1;
    if (!ready) { console.log('[lead] (configure CONFIG.GATE.form para gravar)', info); return; }
    const body = new URLSearchParams();
    body.append(f.email, info.email);
    if (f.source) body.append(f.source, info.source);
    if (f.page) body.append(f.page, String(info.page));
    if (f.ref) body.append(f.ref, info.ref);
    if (f.ua) body.append(f.ua, info.ua);
    try { fetch(f.action, { method: 'POST', mode: 'no-cors', body, keepalive: true }).catch(() => {}); } catch (e) {}
    return;
  }

  const url = G.endpoint;
  if (!url) { console.log('[lead] (defina CONFIG.GATE.endpoint para gravar)', info); return; }
  const body = new URLSearchParams();
  body.append('email', info.email);
  body.append('source', info.source);
  body.append('page', String(info.page));
  body.append('ref', info.ref);
  body.append('ua', info.ua);
  body.append('ts', info.ts);
  try {
    fetch(url, { method: 'POST', mode: 'no-cors', body, keepalive: true }).catch(() => {});
  } catch (e) {}
}

export function finishUnlock() {
  state.unlocked = true;
  state.store.set('lead_ok', '1');
  closeGate();
  deps.refreshUI();
  if (state.pendingPage != null) {
    deps.goToPageIndex(state.pendingPage);
    return;
  }
  const next = Math.min(state.Book.N - 1, deps.getCurrentLeadIndex() + 1);
  deps.goToPageIndex(next);
}

export function submitLead() {
  const email = el.gateEmail.value;
  if (!validEmail(email)) {
    el.gateEmail.classList.add('err');
    el.gateMsg.textContent = 'Digite um e-mail válido para continuar.';
    try { el.gateEmail.focus(); } catch (e) {}
    return;
  }
  sendLead(email);
  finishUnlock();
}

export function resolveStartPage() {
  if (state.pendingPage == null) return 0;
  if (state.unlocked) return state.pendingPage;
  return Math.min(state.pendingPage, Math.max(0, previewCount() - 1));
}

export function maybeOpenGateForDeepLink() {
  if (state.unlocked || state.pendingPage == null || !gateActive()) return;
  if (state.pendingPage < previewCount()) return;
  const sub = document.getElementById('gateSub');
  if (sub) sub.textContent = 'Deixe seu e-mail para continuar lendo a partir deste artigo.';
  setTimeout(openGate, 500);
}
