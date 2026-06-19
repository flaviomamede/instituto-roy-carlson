'use strict';

const fs = require('fs');
const path = require('path');
const { getSessionFromRequest } = require('../_lib/auth.js');
const { getDocumentBySlug, privateFilePath } = require('../_lib/catalog.js');
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

  if (!canAccessDocument(doc, session)) {
    res.status(403).json({ error: 'forbidden' });
    return;
  }

  const filePath = privateFilePath(doc.assets.pdf);
  if (!filePath || !fs.existsSync(filePath)) {
    res.status(404).json({ error: 'not_found' });
    return;
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename="' + doc.assets.pdf + '"');
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');

  if (req.method === 'HEAD') {
    res.status(200).end();
    return;
  }

  fs.createReadStream(filePath).pipe(res);
};
