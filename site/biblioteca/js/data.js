'use strict';

import { canAccessDocument, getMinLevel } from './core/access.js';
import { getSession } from './auth.js';

let catalogCache = null;

export async function loadCatalog() {
  if (catalogCache) return catalogCache;
  const res = await fetch('/biblioteca/data/catalog.json');
  if (!res.ok) throw new Error('Catálogo indisponível');
  catalogCache = await res.json();
  return catalogCache;
}

export function getDocuments(catalog) {
  return catalog.documents || [];
}

export function getDocumentBySlug(catalog, slug) {
  return getDocuments(catalog).find((d) => d.slug === slug) || null;
}

export function resolvePdfPath(doc) {
  const min = getMinLevel(doc);
  if (min === 'public') {
    const file = doc.assets && doc.assets.pdf;
    if (!file) return null;
    return `/biblioteca/files/public/${file}`;
  }
  return `/api/file/${encodeURIComponent(doc.slug)}`;
}

export function canReadPdf(doc, user) {
  return canAccessDocument(doc, user);
}

export function flipbookUrl(doc, user) {
  const session = user !== undefined ? user : getSession();
  if (!canAccessDocument(doc, session)) return null;
  const pdf = resolvePdfPath(doc);
  if (!pdf) return null;
  const q = new URLSearchParams({
    pdf,
    title: doc.title,
    src: 'biblioteca-' + doc.slug
  });
  const toc = doc.public && doc.public.toc;
  if (toc && toc.length) {
    q.set('toc', encodeURIComponent(JSON.stringify(toc)));
  }
  return `/revista/leitura/index.html?${q.toString()}`;
}

export function lockIconHtml(locked) {
  const label = locked ? 'Exclusivo' : 'Aberto';
  const svg = locked ? lockClosedSvg() : lockOpenSvg();
  return `<span class="lib-lock" title="${label}" aria-label="${label}">${svg}</span>`;
}

function lockClosedSvg() {
  return (
    '<svg class="lib-lock-svg" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">' +
    '<rect x="4.25" y="8" width="7.5" height="5.5" rx="1" fill="currentColor"/>' +
    '<path d="M6 8V6.25C6 4.455 7.567 3 9.5 3S13 4.455 13 6.25V8" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>' +
    '</svg>'
  );
}

function lockOpenSvg() {
  return (
    '<svg class="lib-lock-svg lib-lock-svg-open" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">' +
    '<rect x="4.25" y="8" width="7.5" height="5.5" rx="1" fill="currentColor"/>' +
    '<path d="M6 8V6.25C6 4.8 7.2 3.5 8.75 3" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>' +
    '</svg>'
  );
}

export function testNoticeHtml() {
  return '<div class="lib-test-notice" role="status">Biblioteca está em fase de teste</div>';
}

export function revistaArticleUrl(slug) {
  if (!slug) return null;
  return `/revista/edicoes/v1n1/artigos/${slug}.html`;
}

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
