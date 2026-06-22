'use strict';

// Recebe UM arquivo da submissão (corpo cru) e grava no Blob privado em
// submissoes/<sid>/<nome>. Um arquivo por requisição (limite ~4,5 MB da função).
// Arquivos maiores: o autor envia por e-mail (botão "Falar com o editor").

const SAFE_NAME = /^[A-Za-z0-9][A-Za-z0-9 ._()\-]*\.(md|markdown|zip|csv|png|jpe?g|pdf)$/i;
const SID = /^[0-9]{10,16}-[a-z0-9]{4,12}$/;
const MAX = 4.4 * 1024 * 1024;

async function readBody(req) {
  if (req.body && Buffer.isBuffer(req.body)) return req.body;
  const chunks = [];
  for await (const c of req) chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c));
  return Buffer.concat(chunks);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'method_not_allowed' }); return; }

  const sid = String((req.query && req.query.sid) || '');
  const name = String((req.query && req.query.name) || '');
  if (!SID.test(sid) || name.indexOf('..') !== -1 || !SAFE_NAME.test(name)) {
    res.status(400).json({ error: 'bad_params' }); return;
  }

  let buf;
  try { buf = await readBody(req); } catch (e) { res.status(400).json({ error: 'read_failed' }); return; }
  if (!buf || !buf.length) { res.status(400).json({ error: 'empty' }); return; }
  if (buf.length > MAX) { res.status(413).json({ error: 'too_large' }); return; }

  try {
    const { put } = await import('@vercel/blob');
    const pathname = 'submissoes/' + sid + '/' + name;
    const result = await put(pathname, buf, {
      access: 'private',
      contentType: req.headers['content-type'] || 'application/octet-stream',
      addRandomSuffix: false,
      allowOverwrite: true
    });
    res.status(200).json({ ok: true, pathname: result.pathname });
  } catch (err) {
    console.error('[submissao/upload]', err && err.message);
    res.status(500).json({ error: 'upload_failed' });
  }
};
