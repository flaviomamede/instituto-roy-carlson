'use strict';

const fs = require('fs');
const path = require('path');

let catalogCache = null;

function catalogPath() {
  return path.join(process.cwd(), 'api', '_data', 'library', 'catalog.full.json');
}

function loadFullCatalog() {
  if (catalogCache) return catalogCache;
  const p = catalogPath();
  if (!fs.existsSync(p)) {
    throw new Error('Catálogo completo indisponível no servidor');
  }
  catalogCache = JSON.parse(fs.readFileSync(p, 'utf8'));
  return catalogCache;
}

function getDocumentBySlug(slug) {
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) return null;
  return (loadFullCatalog().documents || []).find((d) => d.slug === slug) || null;
}

function privateFilePath(filename) {
  if (!filename || !/^[a-z0-9._-]+\.pdf$/i.test(filename)) return null;
  const base = path.join(process.cwd(), 'api', '_data', 'library', 'files');
  const resolved = path.resolve(base, filename);
  if (!resolved.startsWith(path.resolve(base) + path.sep)) return null;
  return resolved;
}

module.exports = { loadFullCatalog, getDocumentBySlug, privateFilePath };
