# Plano — Migrar PDFs privados da Biblioteca para Vercel Blob

> Retomada para a próxima sessão (criado em 2026-06-19, executar a partir de 2026-06-20).
> Lê rápido a seção "Onde paramos" e vai direto pro "Plano de execução".

## Onde paramos (estado em 2026-06-19, fim do dia)

- **Importação feita e commitada** (`main` @ `ba2af2b`, já no GitHub): +50 documentos
  no catálogo — 11 livros (coleção **"Marcelo Protz"**, tipo `livro`, member) + 39
  papers (coleção **"Papers do Dr. Carlson"**, tipo `papers`), member exceto 3
  abertos: `causes-control-cracking`, `consid-optimum-cem-mass-conc`,
  `carlson-lista-publicacoes`. Catálogo agora tem **66 docs**.
- **NÃO está no ar.** O deploy falhou: a função serverless `api/file` passou do
  limite de **250 MB** da Vercel — os PDFs privados somam **243 MB** e são embutidos
  na função via `includeFiles` no `vercel.json`.
- **Produção está saudável** na versão anterior (16 docs, assinatura, flipbook —
  tudo funcionando). O deploy com erro chegou a derrubar o domínio por ~2 min; foi
  restaurado repromovendo o último deploy bom (ver "Recuperação de emergência").
- **Descompasso esperado:** git tem 66 docs, produção tem 16. Vai alinhar quando
  este plano for executado.

## ⚠️ Antes de qualquer coisa
**NÃO rodar `site` → `deploy.sh` com o estado atual** — vai falhar pelo mesmo limite
e pode derrubar o domínio de novo. Só deployar depois de tirar os PDFs privados da
função (este plano).

## O problema (causa raiz)
- `site/vercel.json` → `functions[...].includeFiles: "api/_data/library/**"` empacota
  **todos** os PDFs privados dentro da função `api/file`.
- `site/api/file/[slug].js` lê o PDF do disco com `fs.createReadStream` via
  `privateFilePath()` (em `site/api/_lib/catalog.js`), que aponta para
  `process.cwd()/api/_data/library/files/<arquivo>`.
- `site/build-library.sh` copia os privados para `site/api/_data/library/files/`
  (públicos vão para `site/biblioteca/files/public/`, esses são estáticos e OK).
- Logo: quanto mais acervo exclusivo, maior a função → estoura 250 MB. Não escala.

## Plano de execução — mover privados para Vercel Blob

> Públicos (6 PDFs, ~33 MB em `site/biblioteca/files/public/`) **continuam estáticos**
> (CDN, sem limite). Só os **privados** (243 MB) vão para o Blob.

### 1. Habilitar o Blob e o token
- Dashboard Vercel → projeto `instituto-roy-carlson` → **Storage → Create → Blob**
  (ou `npx vercel blob` CLI). Isso cria a env `BLOB_READ_WRITE_TOKEN` no projeto.
- Para dev local, exportar `BLOB_READ_WRITE_TOKEN` (não commitar — `.env*` está no
  `.gitignore`).
- Adicionar dependência `@vercel/blob` (criar `site/package.json` se não houver; é
  uma dep pequena, não pesa na função).

### 2. Subir os PDFs privados para o Blob
- Script novo `site/scripts/upload-blob.mjs` que percorre o manifesto
  `biblioteca-adapters/irc/extra-files.tsv` **+** as entradas privadas antigas e, para
  cada `dest` (ex. `estudos-hgen.pdf`), faz:
  ```js
  import { put } from '@vercel/blob';
  await put(`biblioteca/${dest}`, fileBuffer, { access: 'public', addRandomSuffix: false, contentType: 'application/pdf' });
  ```
- **Privacidade:** o Blob só tem `access: 'public'`, mas a URL é aleatória/opaca e
  **nunca é exposta** — quem serve é o `api/file`, que valida a sessão e faz o stream.
  Usar um pathname previsível (`biblioteca/<slug>.pdf`) com `addRandomSuffix:false`
  para o `api/file` montar a URL pelo slug, **ou** guardar a URL retornada no
  catálogo completo (preferível: guardar `blobUrl` por doc no `catalog.full.json`).
- Idempotente: pular o que já existe (ou `put` sobrescreve com `allowOverwrite:true`).

### 3. `api/file/[slug].js` passa a transmitir do Blob
- Após a checagem de acesso (mantém `getSessionFromRequest` + `canAccessDocument`),
  em vez de `fs.createReadStream(privateFilePath)`:
  ```js
  const url = doc.assets.blobUrl;            // ou `${BASE}/biblioteca/${doc.assets.pdf}`
  const r = await fetch(url);                // server-side, URL não exposta ao cliente
  res.setHeader('Content-Type','application/pdf');
  res.setHeader('Cache-Control','private, no-store');
  // stream r.body → res
  ```
- **Públicos** continuam podendo ser servidos do estático (`/biblioteca/files/public/`)
  ou também via Blob — escolher um e documentar.

### 4. Tirar o peso da função
- `site/vercel.json`: **remover** (ou esvaziar) o `functions[...].includeFiles` de
  `api/_data/library/**`. A função volta a ser pequena.
- `site/build-library.sh`: parar de copiar privados para `api/_data/library/files/`
  (passa a só chamar o upload pro Blob, ou deixar o upload como passo separado do
  deploy). Manter a geração do `catalog.full.json` (com `blobUrl` se for por doc).
- Garantir que `api/_data/library/files/` **não** seja mais embarcado.

### 5. Deploy e verificação
- `cd site && bash deploy.sh` (agora a função é pequena → passa).
- Conferir:
  - `curl -I https://institutoroycarlson.org/` → 200 (e demais rotas).
  - `curl …/biblioteca/data/catalog.json` → **66 docs**.
  - `api/file/<slug-público>` → 200 PDF; `api/file/<slug-member>` sem sessão → 403;
    com sessão de assinante → 200 PDF (testar login real com e-mail da allowlist).
  - allowlist.json e PDFs estáticos privados → 404 (proteções intactas).

## Recuperação de emergência (se o domínio cair de novo)
Repromover o último deploy bom (precisa do `--scope` do time):
```bash
cd site
npx vercel promote https://instituto-roy-carlson-<ID-BOM>.vercel.app \
  --scope flavio-mamede-pereira-gomes-projects --yes
```
Listar deploys para achar um `Ready`: `npx vercel ls instituto-roy-carlson --prod`.
(Em 2026-06-19 o bom era `instituto-roy-carlson-hosofxunp.vercel.app`.)

## Alternativas ao Blob
- **Cloudflare R2 / AWS S3 / Backblaze B2** via SDK no `api/file` (mesma ideia: a
  função busca/transmite do storage). R2 não cobra egress — bom se o volume crescer.
- Blob é o mais integrado à Vercel (menos setup) → recomendado para começar.

## Arquivos-chave (referência rápida)
- `site/vercel.json` — `functions.includeFiles` (remover o de `_data/library`).
- `site/api/file/[slug].js` — troca fs → fetch do Blob.
- `site/api/_lib/catalog.js` — `privateFilePath()`/`loadFullCatalog()`.
- `site/build-library.sh` — copia privados (mudar para upload Blob).
- `biblioteca-adapters/irc/extra-files.tsv` — manifesto folder/origem/destino.
- `site/scripts/import-biblioteca-batch.py` — gerador do catálogo (já rodado).
- Fonte dos PDFs (gitignored): `biblioteca/` e `biblioteca/Carlson/`.
