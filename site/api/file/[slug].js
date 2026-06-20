'use strict';

const fs = require('fs');
const path = require('path');
const { Readable } = require('node:stream');
const { getSessionFromRequest } = require('../_lib/auth.js');
const { getDocumentBySlug } = require('../_lib/catalog.js');
const { getMinLevel, canAccessDocument } = require('../_lib/access.js');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.status(405).end();
    return;
  }

  const slug = req.query.slug;
  const doc = getDocumentBySlug(slug);
  if (!doc || !doc.assets || !doc.assets.pdf) {
    res.status(404).json({ error: 'not_found' });
    return;
  }

  const minLevel = getMinLevel(doc);
  const session = getSessionFromRequest(req);

  // Acesso ABERTO: servido do estático (CDN), sem autenticação.
  if (minLevel === 'public') {
    const publicPath = path.join(process.cwd(), 'biblioteca', 'files', 'public', doc.assets.pdf);
    if (fs.existsSync(publicPath)) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="' + doc.assets.pdf + '"');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      if (req.method === 'HEAD') {
        res.status(200).end();
        return;
      }
      fs.createReadStream(publicPath).pipe(res);
      return;
    }
  }

  // Acesso EXCLUSIVO: exige sessão com nível suficiente.
  if (!canAccessDocument(doc, session)) {
    res.status(403).json({ error: 'forbidden' });
    return;
  }

  // PDFs exclusivos vivem no Vercel Blob privado (nunca no deploy). A função
  // os transmite após validar o acesso. Auth do Blob: OIDC automático na Vercel.
  res.setHeader('Content-Disposition', 'inline; filename="' + doc.assets.pdf + '"');
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');

  if (req.method === 'HEAD') {
    res.setHeader('Content-Type', 'application/pdf');
    res.status(200).end();
    return;
  }

  try {
    const { get } = await import('@vercel/blob');
    const result = await get('biblioteca/' + doc.assets.pdf, { access: 'private' });
    if (!result || result.statusCode !== 200 || !result.stream) {
      res.status(404).json({ error: 'not_found' });
      return;
    }
    res.setHeader('Content-Type', (result.blob && result.blob.contentType) || 'application/pdf');
    Readable.fromWeb(result.stream).pipe(res);
  } catch (err) {
    console.error('[api/file] blob', err && err.message);
    res.status(502).json({ error: 'blob_unavailable' });
  }
};
