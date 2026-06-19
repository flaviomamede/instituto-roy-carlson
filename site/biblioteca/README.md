# Biblioteca IRC (site)

## Testar localmente

### Só arquivos estáticos

```bash
cd site
bash serve.sh
```

Catálogo: http://localhost:8080/biblioteca/

### Com login e PDFs protegidos (API)

```bash
cd site
vercel dev
```

As funções `/api/login`, `/api/session`, `/api/file/:slug` exigem `vercel dev` ou deploy na Vercel.

Login de teste: e-mail em `biblioteca-adapters/irc/allowlist.json` (lido pelo servidor em dev).

## Segurança

- **Allowlist** não é mais publicada no site. Configure na Vercel:
  - `IRC_SESSION_SECRET` — string aleatória longa
  - `IRC_ALLOWLIST_JSON` — JSON compacto `{ "users": [...] }`
- Gerar valor para env: `python3 scripts/export-allowlist-env.py`
- PDFs exclusivos ficam em `api/_data/library/files/` (somente serverless).
- Catálogo público omite `assets.pdf` de documentos exclusivos.

## Build

```bash
cd site
bash build.sh   # revista + biblioteca + favicons
```

## Estrutura

- `data/catalog.json` — catálogo público (sanitizado)
- `files/public/` — PDFs abertos
- `api/_data/library/` — catálogo completo + PDFs exclusivos (servidor)
- `js/core/` — cópia de `biblioteca-core/src/`

Fonte editável: `biblioteca-adapters/irc/catalog.json` e `allowlist.json`.
