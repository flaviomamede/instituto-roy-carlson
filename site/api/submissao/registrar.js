'use strict';

// Fecha a submissão: grava o manifesto (metadados + lista de arquivos) no Blob
// privado e avisa a redação por e-mail (via Apps Script). NÃO gera PDF — isso é
// feito depois, na redação, com o pipeline local.

const SID = /^[0-9]{10,16}-[a-z0-9]{4,12}$/;
const NOTIFY_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxNl-alO6cSr3wGn0r1EgTnP7Cx7035YRIrVv5ZeCM4kYXFgOxh4hd1fV1JqzUbfH5S/exec';
const DESTINATARIOS = ['flaviomamede.gomes@gmail.com', 'institutoroycarlson@gmail.com'];
const BASE = 'https://institutoroycarlson.org';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'method_not_allowed' }); return; }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};

  const sid = String(body.sid || '');
  const meta = body.meta || {};
  const arquivos = Array.isArray(body.arquivos) ? body.arquivos : [];
  if (!SID.test(sid)) { res.status(400).json({ error: 'bad_sid' }); return; }
  if (!meta.titulo) { res.status(400).json({ error: 'sem_titulo' }); return; }

  const manifest = {
    sid: sid,
    recebidoEm: new Date().toISOString(),
    meta: meta,
    arquivos: arquivos.map(function (a) {
      return { campo: a.campo || '', nome: a.name || '', pathname: a.pathname || '',
               baixar: BASE + '/api/submissao/baixar?p=' + encodeURIComponent(a.pathname || '') };
    })
  };

  // 1) grava o manifesto no Blob privado (registro confiável)
  try {
    const { put } = await import('@vercel/blob');
    await put('submissoes/' + sid + '/manifest.json', JSON.stringify(manifest, null, 2), {
      access: 'private', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: true
    });
  } catch (err) {
    console.error('[submissao/registrar] manifest', err && err.message);
    res.status(500).json({ error: 'manifest_failed' }); return;
  }

  // 2) notifica a redação (melhor-esforço; não derruba a submissão se falhar)
  try {
    await fetch(NOTIFY_ENDPOINT, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipo: 'submissao-revista',
        destinatarios: DESTINATARIOS,
        sid: sid,
        titulo: meta.titulo,
        autores: meta.autores,
        email_autor: meta.email_autor || '',
        arquivos: manifest.arquivos,
        ts: Date.now()
      })
    });
  } catch (err) { console.error('[submissao/registrar] notify', err && err.message); }

  res.status(200).json({ ok: true, sid: sid });
};
