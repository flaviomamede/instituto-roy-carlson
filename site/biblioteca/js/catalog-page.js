'use strict';

import { filterDocuments, sortDocuments, uniqueCollections, uniqueTypes } from './core/search.js';
import { accessLabel, isLockedForUser } from './core/access.js';
import { getSession, loginWithEmail, logout, ensureSession } from './auth.js';
import { loadCatalog, getDocuments, escapeHtml, lockIconHtml } from './data.js';

const el = {
  search: document.getElementById('searchInput'),
  collection: document.getElementById('filterCollection'),
  type: document.getElementById('filterType'),
  access: document.getElementById('filterAccess'),
  grid: document.getElementById('docGrid'),
  count: document.getElementById('resultCount'),
  authBar: document.getElementById('authBar')
};

let catalog = null;

function renderAuthBar() {
  const session = getSession();
  if (!el.authBar) return;

  if (session) {
    el.authBar.innerHTML =
      `<span>Logado como <strong>${escapeHtml(session.name || session.email)}</strong> (${escapeHtml(session.planLevel)})</span>` +
      `<button type="button" class="button" id="logoutBtn">Sair</button>`;
    document.getElementById('logoutBtn').addEventListener('click', async () => {
      await logout();
      renderAuthBar();
      renderGrid();
    });
    return;
  }

  el.authBar.innerHTML =
    `<form id="loginForm"><label class="sr-only" for="loginEmail">E-mail</label>` +
    `<input type="email" id="loginEmail" placeholder="seu@email.com" required autocomplete="email" />` +
    `<button type="submit" class="button primary">Entrar</button></form>` +
    `<span style="color:var(--muted)">Assinantes, fundadores e patrocinadores</span>`;

  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const result = await loginWithEmail(email);
    if (!result.ok) {
      alert(result.error);
      return;
    }
    renderAuthBar();
    renderGrid();
  });
}

function renderGrid() {
  const session = getSession();
  const docs = sortDocuments(
    filterDocuments(getDocuments(catalog), {
      q: el.search.value,
      collection: el.collection.value,
      type: el.type.value,
      access: el.access.value
    }),
    'year-desc'
  );

  el.count.textContent = docs.length + (docs.length === 1 ? ' documento' : ' documentos');

  if (!docs.length) {
    el.grid.innerHTML = '<div class="empty-state">Nenhum documento encontrado com estes filtros.</div>';
    return;
  }

  el.grid.innerHTML = docs
    .map((doc) => {
      const locked = isLockedForUser(doc, session);
      const badgeClass = locked ? 'locked' : 'open';
      const badgeIcon = lockIconHtml(locked);
      const authors = (doc.authors || []).join(' · ');
      const summary = (doc.public && doc.public.summary) || '';
      const tags = (doc.tags || [])
        .slice(0, 4)
        .map((t) => `<span class="lib-tag">${escapeHtml(t)}</span>`)
        .join('');

      return (
        `<a class="lib-card" href="/biblioteca/documento/?slug=${encodeURIComponent(doc.slug)}">` +
        `<div class="lib-card-head">` +
        `<h3>${escapeHtml(doc.title)}</h3>` +
        `<span class="lib-badge ${badgeClass}">${badgeIcon} ${escapeHtml(accessLabel(doc))}</span>` +
        `</div>` +
        `<p class="lib-card-meta">${escapeHtml(doc.collection || '')}${doc.year ? ' · ' + doc.year : ''}${authors ? ' · ' + escapeHtml(authors) : ''}</p>` +
        `<p>${escapeHtml(summary.slice(0, 160))}${summary.length > 160 ? '…' : ''}</p>` +
        (tags ? `<div class="lib-tags">${tags}</div>` : '') +
        `</a>`
      );
    })
    .join('');
}

function fillSelect(select, options, allLabel) {
  select.innerHTML = `<option>${allLabel}</option>` + options.map((o) => `<option>${escapeHtml(o)}</option>`).join('');
}

async function bootstrap() {
  await ensureSession();
  catalog = await loadCatalog();
  fillSelect(el.collection, uniqueCollections(getDocuments(catalog)), 'Todos');
  fillSelect(el.type, uniqueTypes(getDocuments(catalog)), 'Todos');

  [el.search, el.collection, el.type, el.access].forEach((node) => {
    node.addEventListener('input', renderGrid);
    node.addEventListener('change', renderGrid);
  });

  renderAuthBar();
  renderGrid();
}

bootstrap().catch((err) => {
  console.error(err);
  el.grid.innerHTML = '<div class="empty-state">Erro ao carregar o catálogo.</div>';
});
