'use strict';

// Download dos arquivos de uma submissão — restrito à redação (nível founder).
// Lê o Blob privado em submissoes/<sid>/<arquivo> e entrega como anexo.

const { Readable } = require('node:stream');
const { getSessionFromRequest } = require('../_lib/auth.js');
const { meetsMinLevel } = require('../_lib/access.js');

const PATH = /^submissoes\/[0-9]{10,16}-[a-z0-9]{4,12}\/[A-Za-z0-9 ._()\-]+\.[A-Za-z0-9]+$/;

module.exports = async function handler(req, res) {
  const session = getSessionFromRequest(req);
  if (!session || !meetsMinLevel(session.planLevel, 'founder')) {
    res.status(403).json({ error: 'forbidden' });
    return;
  }

  const p = String((req.query && req.query.p) || '');
  if (p.indexOf('..') !== -1 || !PATH.test(p)) {
    res.status(400).json({ error: 'bad_path' });
    return;
  }

  try {
    const { get } = await import('@vercel/blob');
    const result = await get(p, { access: 'private' });
    if (!result || result.statusCode !== 200 || !result.stream) {
      res.status(404).json({ error: 'not_found' });
      return;
    }
    res.setHeader('Content-Type', (result.blob && result.blob.contentType) || 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename="' + p.split('/').pop().replace(/"/g, '') + '"');
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    Readable.fromWeb(result.stream).pipe(res);
  } catch (err) {
    console.error('[submissao/baixar]', err && err.message);
    res.status(502).json({ error: 'blob_unavailable' });
  }
};
