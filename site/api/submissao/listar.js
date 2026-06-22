'use strict';

// Lista as submissões para a redação (restrito a founder). Lê os manifest.json
// do Blob privado e devolve metadados + links de download.

const { getSessionFromRequest } = require('../_lib/auth.js');
const { meetsMinLevel } = require('../_lib/access.js');

async function streamToString(webStream) {
  const reader = webStream.getReader();
  const chunks = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks).toString('utf-8');
}

module.exports = async function handler(req, res) {
  const session = getSessionFromRequest(req);
  if (!session || !meetsMinLevel(session.planLevel, 'founder')) {
    res.status(403).json({ error: 'forbidden' });
    return;
  }
  try {
    const { list, get } = await import('@vercel/blob');
    const { blobs } = await list({ prefix: 'submissoes/' });
    const manifests = (blobs || []).filter(function (b) { return b.pathname.endsWith('/manifest.json'); });
    const out = [];
    for (const m of manifests) {
      try {
        const r = await get(m.pathname, { access: 'private' });
        if (r && r.statusCode === 200 && r.stream) {
          out.push(JSON.parse(await streamToString(r.stream)));
        }
      } catch (e) { /* ignora manifesto ilegível */ }
    }
    out.sort(function (a, b) { return String(b.recebidoEm || '').localeCompare(String(a.recebidoEm || '')); });
    res.setHeader('Cache-Control', 'private, no-store');
    res.status(200).json({ ok: true, submissoes: out });
  } catch (err) {
    console.error('[submissao/listar]', err && err.message);
    res.status(500).json({ error: 'list_failed' });
  }
};
