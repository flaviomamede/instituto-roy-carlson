'use strict';

// Serve as fotos exclusivas do Planejamento apenas para assinantes/fundadores
// (nível >= member). Os arquivos ficam em api/_data/planejamento/fotos/ (fora do
// estático, protegidos pelo redirect /api/_data/* -> 404) e só saem por aqui,
// após checagem de sessão. Espelha o padrão de api/file/[slug].js.

const fs = require('fs');
const path = require('path');
const { getSessionFromRequest } = require('../_lib/auth.js');
const { meetsMinLevel } = require('../_lib/access.js');

const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.pdf': 'application/pdf' };

module.exports = function handler(req, res) {
  const session = getSessionFromRequest(req);
  if (!session || !meetsMinLevel(session.planLevel, 'member')) {
    res.status(403).json({ error: 'forbidden' });
    return;
  }

  const name = String((req.query && req.query.name) || '');
  // só nomes seguros: letras/números/._-/ e subpasta (ex.: burec/burec-1.png)
  if (name.indexOf('..') !== -1 || !/^[A-Za-z0-9][A-Za-z0-9._\-\/]*\.(png|jpe?g|pdf)$/.test(name)) {
    res.status(400).json({ error: 'bad_name' });
    return;
  }

  const baseDir = path.join(process.cwd(), 'api', '_data', 'planejamento', 'fotos');
  const file = path.join(baseDir, name);
  if (file.indexOf(baseDir) !== 0 || !fs.existsSync(file)) {
    res.status(404).json({ error: 'not_found' });
    return;
  }

  res.setHeader('Content-Type', MIME[path.extname(file).toLowerCase()] || 'application/octet-stream');
  res.setHeader('Content-Disposition', 'inline');   /* renderiza no iframe (PDF não baixa) */
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  if (req.method === 'HEAD') { res.status(200).end(); return; }
  fs.createReadStream(file).pipe(res);
};
