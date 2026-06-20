'use strict';

/* Página de assinatura — planos + pagamento via Pix (sem gateway).
   Fonte única: /assinatura/assinatura.config.json e /assinatura/pix.json
   (gerados por scripts/gen-assinatura.py). Ativação é manual: o formulário
   apenas avisa o Instituto; a concessão do nível 'member' + validUntil é feita
   na allowlist server-side (ver site/biblioteca/README.md). */

const fmtBRL = (v) =>
  Number.isInteger(v) ? 'R$ ' + v : 'R$ ' + v.toFixed(2).replace('.', ',');

const el = (id) => document.getElementById(id);
const q = (sel) => document.querySelector(sel);

let CFG = null;
let PIX = null;
let selected = 'anual';

async function load() {
  const [cfg, pix] = await Promise.all([
    fetch('/assinatura/assinatura.config.json').then((r) => r.json()),
    fetch('/assinatura/pix.json').then((r) => r.json())
  ]);
  CFG = cfg;
  PIX = pix;
}

function planLabel(id) {
  return (CFG.plans[id] && CFG.plans[id].label) || id;
}

/* Atualiza o cartão "Assinante" conforme a periodicidade escolhida. */
function applyBilling(id) {
  selected = id;
  const plan = CFG.plans[id];
  q('[data-price-amount]').textContent = fmtBRL(plan.price);
  q('[data-price-period]').textContent = '/' + plan.periodo;

  const note = q('[data-price-note]');
  if (id === 'anual') {
    const mensal = plan.price / 12;
    note.textContent =
      'Equivale a ' + fmtBRL(Math.round(mensal * 100) / 100).replace('R$ ', 'R$ ') +
      '/mês · um pagamento por ano';
  } else {
    note.textContent = 'Renovação manual a cada mês';
  }

  document.querySelectorAll('.billing-opt').forEach((b) => {
    const on = b.dataset.billing === id;
    b.classList.toggle('is-active', on);
    b.setAttribute('aria-pressed', String(on));
  });
}

/* ---------- Painel de pagamento ---------- */
function openPay() {
  const plan = CFG.plans[selected];
  const pix = PIX[selected];
  if (!plan || !pix) return;

  q('[data-pay-plan]').textContent = plan.label;
  q('[data-pay-amount]').textContent = fmtBRL(plan.price);
  q('[data-pay-holder]').textContent = CFG.pix.holder;
  el('payQr').src = '/assinatura/qr-' + selected + '.png';
  el('payQr').alt = 'QR Code Pix — plano ' + plan.label + ' (' + fmtBRL(plan.price) + ')';
  el('payCode').value = pix.payload;

  el('payStatus').textContent = '';
  el('payStatus').className = 'pay-status';
  el('payForm').reset();

  const ov = el('payOverlay');
  ov.classList.add('open');
  ov.setAttribute('aria-hidden', 'false');
  setTimeout(() => el('payNome').focus(), 30);
}

function closePay() {
  const ov = el('payOverlay');
  ov.classList.remove('open');
  ov.setAttribute('aria-hidden', 'true');
}

async function copyCode() {
  const code = el('payCode').value;
  try {
    await navigator.clipboard.writeText(code);
  } catch {
    el('payCode').select();
    document.execCommand && document.execCommand('copy');
  }
  const btn = el('payCopyBtn');
  const old = btn.textContent;
  btn.textContent = 'Copiado ✓';
  setTimeout(() => (btn.textContent = old), 1800);
}

function mailtoFallback(nome, email) {
  const plan = CFG.plans[selected];
  const subject = 'Assinatura ' + plan.label + ' — ' + fmtBRL(plan.price);
  const body =
    'Olá! Acabei de pagar via Pix o plano ' + plan.label + ' (' + fmtBRL(plan.price) + ').\n\n' +
    'Nome: ' + nome + '\nE-mail de acesso: ' + email + '\n\nPor favor, liberem meu acesso à Biblioteca IRC.';
  return (
    'mailto:' + CFG.notifyEmail +
    '?subject=' + encodeURIComponent(subject) +
    '&body=' + encodeURIComponent(body)
  );
}

async function submitIntake(e) {
  e.preventDefault();
  const form = el('payForm');
  if (form.website && form.website.value) return; // honeypot

  const nome = el('payNome').value.trim();
  const email = el('payEmail').value.trim();
  const status = el('payStatus');

  if (!nome || !email || !/.+@.+\..+/.test(email)) {
    status.textContent = 'Preencha nome e um e-mail válido.';
    status.className = 'pay-status err';
    return;
  }

  const plan = CFG.plans[selected];
  status.textContent = 'Enviando…';
  status.className = 'pay-status';
  el('paySubmit').disabled = true;

  const payload = new URLSearchParams({
    tipo: 'assinatura',
    source: 'assinatura-' + selected,
    plano: plan.label,
    valor: String(plan.price),
    nome,
    email,
    ua: navigator.userAgent
  });

  try {
    await fetch(CFG.intakeEndpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: payload.toString()
    });
    status.innerHTML =
      'Recebido! Assim que confirmarmos o Pix, liberamos seu acesso por e-mail. ' +
      'Se preferir, <a href="' + mailtoFallback(nome, email) + '">confirme também por e-mail</a>.';
    status.className = 'pay-status ok';
    form.reset();
  } catch {
    status.innerHTML =
      'Não consegui enviar automaticamente. ' +
      '<a href="' + mailtoFallback(nome, email) + '">Clique para avisar por e-mail</a>.';
    status.className = 'pay-status err';
  } finally {
    el('paySubmit').disabled = false;
  }
}

/* ---------- Contato Fundador / Patrocinador ---------- */
function openContact() {
  el('contactStatus').textContent = '';
  el('contactStatus').className = 'pay-status';
  el('contactForm').reset();
  const ov = el('contactOverlay');
  ov.classList.add('open');
  ov.setAttribute('aria-hidden', 'false');
  setTimeout(() => el('contactNome').focus(), 30);
}

function closeContact() {
  const ov = el('contactOverlay');
  ov.classList.remove('open');
  ov.setAttribute('aria-hidden', 'true');
}

function contactMailto(nome, email, msg) {
  const subject = 'Fundador/Patrocinador — Instituto Roy Carlson';
  const body =
    'Nome: ' + nome + '\nE-mail: ' + email + '\n\n' +
    (msg || 'Tenho interesse em apoiar o Instituto Roy Carlson.');
  return (
    'mailto:' + CFG.notifyEmail +
    '?subject=' + encodeURIComponent(subject) +
    '&body=' + encodeURIComponent(body)
  );
}

async function submitContact(e) {
  e.preventDefault();
  const form = el('contactForm');
  if (form.website && form.website.value) return; // honeypot

  const nome = el('contactNome').value.trim();
  const email = el('contactEmail').value.trim();
  const msg = el('contactMsg').value.trim();
  const status = el('contactStatus');

  if (!nome || !/.+@.+\..+/.test(email)) {
    status.textContent = 'Preencha nome e um e-mail válido.';
    status.className = 'pay-status err';
    return;
  }

  status.textContent = 'Enviando…';
  status.className = 'pay-status';
  el('contactSubmit').disabled = true;

  const payload = new URLSearchParams({
    tipo: 'fundador',
    source: 'assinatura-fundador',
    nome,
    email,
    mensagem: msg,
    ua: navigator.userAgent
  });

  try {
    await fetch(CFG.intakeEndpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: payload.toString()
    });
    status.innerHTML =
      'Recebido! Entraremos em contato. Se preferir, ' +
      '<a href="' + contactMailto(nome, email, msg) + '">envie também por e-mail</a>.';
    status.className = 'pay-status ok';
    form.reset();
  } catch {
    status.innerHTML =
      'Não consegui enviar automaticamente. ' +
      '<a href="' + contactMailto(nome, email, msg) + '">Clique para avisar por e-mail</a>.';
    status.className = 'pay-status err';
  } finally {
    el('contactSubmit').disabled = false;
  }
}

function bind() {
  document.querySelectorAll('.billing-opt').forEach((b) =>
    b.addEventListener('click', () => applyBilling(b.dataset.billing))
  );
  q('[data-assinar]').addEventListener('click', openPay);
  el('payClose').addEventListener('click', closePay);
  el('payOverlay').addEventListener('click', (e) => {
    if (e.target === el('payOverlay')) closePay();
  });
  el('payCopyBtn').addEventListener('click', copyCode);
  el('payForm').addEventListener('submit', submitIntake);

  q('[data-contato]').addEventListener('click', openContact);
  el('contactClose').addEventListener('click', closeContact);
  el('contactOverlay').addEventListener('click', (e) => {
    if (e.target === el('contactOverlay')) closeContact();
  });
  el('contactForm').addEventListener('submit', submitContact);

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (el('payOverlay').classList.contains('open')) closePay();
    if (el('contactOverlay').classList.contains('open')) closeContact();
  });
}

(async function init() {
  try {
    await load();
    applyBilling('anual');
    bind();
  } catch (err) {
    console.error('assinatura:', err);
  }
})();
