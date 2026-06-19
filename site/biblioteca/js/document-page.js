'use strict';

import { accessLabel, isLockedForUser } from './core/access.js';
import { PLAN_LABELS } from './core/levels.js';
import {
  getSession,
  loginWithEmail,
  logout,
  ensureSession,
  getViewerPreference,
  setViewerPreference
} from './auth.js';
import {
  loadCatalog,
  getDocumentBySlug,
  escapeHtml,
  canReadPdf,
  resolvePdfPath,
  flipbookUrl,
  revistaArticleUrl,
  lockIconHtml,
  testNoticeHtml
} from './data.js';

const params = new URLSearchParams(location.search);
const slug = params.get('slug');

const el = {
  main: document.getElementById('docMain')
};

function renderAuthBar(onChange) {
  const session = getSession();
  let html = '<div class="auth-bar" id="inlineAuth">';
  if (session) {
    html +=
      `<span>Logado como <strong>${escapeHtml(session.name || session.email)}</strong></span>` +
      `<button type="button" class="button" id="logoutBtn">Sair</button>`;
  } else {
    html +=
      `<form id="loginForm"><input type="email" id="loginEmail" placeholder="E-mail autorizado" required />` +
      `<button type="submit" class="button primary">Entrar</button></form>`;
  }
  html += '</div>';
  return html;
}

function bindAuth(onChange) {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.onclick = async () => {
      await logout();
      onChange();
    };
    return;
  }
  const form = document.getElementById('loginForm');
  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      const result = await loginWithEmail(document.getElementById('loginEmail').value);
      if (!result.ok) {
        alert(result.error);
        return;
      }
      onChange();
    };
  }
}

function renderMetaGrid(doc) {
  const rows = [
    ['Autores', (doc.authors || []).join(', ')],
    ['Ano', doc.year],
    ['Idioma', doc.language === 'en' ? 'Inglês' : doc.language === 'pt' ? 'Português' : doc.language],
    ['Tipo', doc.type],
    ['Coleção', doc.collection],
    ['Acesso', accessLabel(doc)]
  ].filter(([, v]) => v);

  return (
    `<div class="meta-grid">` +
    rows.map(([k, v]) => `<div class="meta-card"><strong>${k}</strong>${escapeHtml(String(v))}</div>`).join('') +
    `</div>`
  );
}

function renderToc(doc) {
  const toc = doc.public && doc.public.toc;
  if (!toc || !toc.length) return '';
  return (
    `<h2>Sumário</h2><ul class="toc-list">` +
    toc.map((item) => `<li><span>${escapeHtml(item.title)}</span><span>p. ${item.page}</span></li>`).join('') +
    `</ul>`
  );
}

function renderFicha(doc) {
  const ficha = doc.public && doc.public.ficha;
  if (!ficha || !Object.keys(ficha).length) return '';
  const rows = Object.entries(ficha)
    .map(([k, v]) => `<tr><th>${escapeHtml(k)}</th><td>${escapeHtml(String(v))}</td></tr>`)
    .join('');
  return `<h2>Ficha</h2><table><tbody>${rows}</tbody></table>`;
}

function renderViewerHtml(doc, session) {
  if (!canReadPdf(doc, session)) {
    return (
      `<section id="viewerSection">` +
      `<div class="notice">` +
      `<strong>Conteúdo exclusivo</strong> — plano mínimo: <em>${escapeHtml(PLAN_LABELS[doc.access.minLevel] || doc.access.minLevel)}</em>. ` +
      `A ficha e o resumo permanecem públicos.` +
      `</div>` +
      `<div class="button-row">` +
      `<a class="button" href="/biblioteca/">← Voltar ao catálogo</a>` +
      `<a class="button" href="mailto:institutoroycarlson@gmail.com?subject=Solicitação%20de%20acesso%20Biblioteca%20IRC">Solicitar acesso</a>` +
      `</div></section>`
    );
  }

  const pdfPath = resolvePdfPath(doc);
  const mode = getViewerPreference();
  const flipUrl = flipbookUrl(doc, session);

  return (
    `<section id="viewerSection">` +
    `<h2>Leitura</h2>` +
    `<div class="viewer-toggle" role="group" aria-label="Modo de leitura">` +
    `<button type="button" data-mode="iframe" class="${mode === 'iframe' ? 'active' : ''}">Leitura rápida (PDF)</button>` +
    `<button type="button" data-mode="flipbook" class="${mode === 'flipbook' ? 'active' : ''}">Flipbook (livro)</button>` +
    `</div>` +
    `<div class="viewer-actions">` +
    `<a class="button" href="${pdfPath}" download target="_blank" rel="noopener">Download</a>` +
    (flipUrl ? `<a class="button" href="${flipUrl}" target="_blank" rel="noopener">Abrir flipbook em nova aba</a>` : '') +
    `</div>` +
    `<div id="viewerMount"></div></section>`
  );
}

function bindViewer(doc) {
  const section = document.getElementById('viewerSection');
  if (!section || !document.getElementById('viewerMount')) return;

  const session = getSession();
  const pdfPath = resolvePdfPath(doc);
  const flipUrl = flipbookUrl(doc, session);
  const mount = document.getElementById('viewerMount');
  const mode = getViewerPreference();

  section.querySelectorAll('.viewer-toggle button').forEach((btn) => {
    btn.addEventListener('click', () => {
      setViewerPreference(btn.dataset.mode);
      section.querySelectorAll('.viewer-toggle button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      showViewer(mount, doc, btn.dataset.mode, pdfPath, flipUrl);
    });
  });

  showViewer(mount, doc, mode, pdfPath, flipUrl);
}

function showViewer(mount, doc, mode, pdfPath, flipUrl) {
  if (mode === 'flipbook' && flipUrl) {
    mount.innerHTML = `<iframe class="viewer-frame" title="Flipbook: ${escapeHtml(doc.title)}" src="${flipUrl}"></iframe>`;
    return;
  }
  mount.innerHTML = `<iframe class="viewer-frame" title="PDF: ${escapeHtml(doc.title)}" src="${pdfPath}#view=FitH"></iframe>`;
}

function renderDocument(doc) {
  const session = getSession();
  const locked = isLockedForUser(doc, session);
  document.title = doc.title + ' — Biblioteca IRC';

  const revista = doc.related && doc.related.revistaArticle;
  const revistaLink = revista ? revistaArticleUrl(revista) : null;

  el.main.innerHTML =
    `<p class="eyebrow"><a href="/biblioteca/">Biblioteca IRC</a></p>` +
    testNoticeHtml() +
    `<h1>${escapeHtml(doc.title)} ${lockIconHtml(locked)}</h1>` +
    renderAuthBar(() => renderPage(doc)) +
    renderMetaGrid(doc) +
    `<h2>Resumo</h2><p>${escapeHtml((doc.public && doc.public.summary) || '')}</p>` +
    renderToc(doc) +
    renderFicha(doc) +
    (revistaLink
      ? `<p><a href="${revistaLink}">Ver também na Revista IRC →</a></p>`
      : '') +
    (doc.tags && doc.tags.length
      ? `<h2>Tags</h2><div class="lib-tags">${doc.tags.map((t) => `<span class="lib-tag">${escapeHtml(t)}</span>`).join('')}</div>`
      : '') +
    renderViewerHtml(doc, session);

  bindAuth(() => renderPage(doc));
  bindViewer(doc);
}

function renderPage(doc) {
  renderDocument(doc);
}

async function bootstrap() {
  await ensureSession();

  if (!slug) {
    el.main.innerHTML = '<p>Documento não especificado. <a href="/biblioteca/">Voltar ao catálogo</a>.</p>';
    return;
  }

  const catalog = await loadCatalog();
  const doc = getDocumentBySlug(catalog, slug);
  if (!doc) {
    el.main.innerHTML = '<p>Documento não encontrado. <a href="/biblioteca/">Voltar ao catálogo</a>.</p>';
    return;
  }

  renderPage(doc);
}

bootstrap().catch(console.error);
