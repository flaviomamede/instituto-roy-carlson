'use strict';

import { getMinLevel } from './access.js';

function norm(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
}

function docHaystack(doc) {
  const p = doc.public || {};
  return norm(
    [
      doc.title,
      doc.subtitle,
      doc.collection,
      doc.type,
      doc.language,
      doc.year,
      (doc.authors || []).join(' '),
      (doc.tags || []).join(' '),
      p.summary,
      p.ficha && JSON.stringify(p.ficha)
    ].join(' ')
  );
}

export function filterDocuments(documents, { q = '', collection = '', type = '', access = '' } = {}) {
  const nq = norm(q.trim());
  return documents.filter((doc) => {
    if (collection && collection !== 'Todos' && doc.collection !== collection) return false;
    if (type && type !== 'Todos' && doc.type !== type) return false;
    if (access && access !== 'Todos') {
      const min = getMinLevel(doc);
      if (access === 'Aberto' && min !== 'public') return false;
      if (access === 'Exclusivo' && min === 'public') return false;
    }
    if (!nq) return true;
    return docHaystack(doc).includes(nq);
  });
}

export function sortDocuments(documents, sort = 'title') {
  const list = [...documents];
  if (sort === 'year-desc') {
    list.sort((a, b) => (b.year || 0) - (a.year || 0));
  } else {
    list.sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
  }
  return list;
}

export function uniqueCollections(documents) {
  return [...new Set(documents.map((d) => d.collection).filter(Boolean))].sort();
}

export function uniqueTypes(documents) {
  return [...new Set(documents.map((d) => d.type).filter(Boolean))].sort();
}
