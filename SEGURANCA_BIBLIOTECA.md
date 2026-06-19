# Prompt — Proteger e-mails (e acervo exclusivo) da Biblioteca IRC

> **Como usar:** cole este arquivo inteiro como instrução para a IA do Cursor.
> Objetivo principal pedido pelo cliente: **parar de expor os e-mails autorizados**.
> Como a autenticação é a mesma que libera os PDFs exclusivos, o prompt também
> fecha a brecha dos arquivos privados (hoje baixáveis por URL direta). As duas
> coisas são o mesmo sistema de login — resolver só os e-mails deixaria o acervo
> exposto.

---

## Contexto e plataforma

Site do **Instituto Roy Carlson** publicado na **Vercel** (`institutoroycarlson.org`),
o que **permite Serverless Functions** (pasta `api/` na raiz publicada `site/`).
A Biblioteca é HTML + **JavaScript vanilla (ES Modules)**, sem framework/bundler.
Idioma **pt-BR**. Mantenha esse padrão.

### Pipeline de build (importante)
- `site/build.sh` → chama `site/build-library.sh`.
- `site/build-library.sh` copia, do repositório para a pasta publicada:
  - `biblioteca-adapters/irc/catalog.json`  → `site/biblioteca/data/catalog.json`
  - `biblioteca-adapters/irc/allowlist.json` → `site/biblioteca/data/allowlist.json`
  - PDFs do acervo → `site/biblioteca/files/public/` e `site/biblioteca/files/private/`
- `site/vercel.json` define `cleanUrls`, redirects e alguns headers.

### Front-end relevante (`site/biblioteca/js/`)
| Arquivo | Papel |
|---|---|
| `auth.js` | **Faz `fetch('/biblioteca/data/allowlist.json')` no navegador** e compara o e-mail digitado. Guarda sessão em `sessionStorage`. |
| `data.js` | Carrega `catalog.json`; `resolvePdfPath()` monta `/biblioteca/files/{public\|private}/<arquivo>`. |
| `catalog-page.js` | Lista/filtra documentos, barra de login. |
| `document-page.js` | Página de ficha do documento. |
| `core/access.js`, `core/levels.js`, `core/search.js` | Regras de nível/acesso/busca (compartilhadas com `biblioteca-core/src/`). |

---

## As três vulnerabilidades a corrigir

1. **Vazamento de e-mails (foco do cliente).**
   `https://institutoroycarlson.org/biblioteca/data/allowlist.json` é **público** e
   contém os e-mails autorizados (fundadores etc.) com `planLevel`. Qualquer um faz
   `curl` e lê a lista. O `auth.js` baixa esse arquivo no cliente — então **não há
   como** esconder os e-mails enquanto a verificação for client-side.

2. **Acervo "exclusivo" desprotegido.**
   Os PDFs ditos privados são servidos como estáticos:
   `…/biblioteca/files/private/estudos-hgen.pdf` responde **HTTP 200** sem login. E
   a URL é **derivável do `catalog.json` público** (`assets.pdf` + `minLevel` →
   pasta `private`). Os headers `private, no-store`/`noindex` em `vercel.json`
   **não** autenticam nada — só afetam cache/indexação. O gating atual é cosmético.

3. **Catálogo público revela nomes de arquivos privados.**
   `catalog.json` expõe `assets.pdf` mesmo de documentos exclusivos, entregando o
   caminho do arquivo protegido.

---

## Arquitetura-alvo (login e arquivos no servidor)

Mover a autenticação e a entrega de arquivos para **Serverless Functions** da
Vercel. O navegador nunca mais vê a allowlist nem o caminho real do PDF privado.

### A) Allowlist sai do site publicado
- **Remover** a cópia de `allowlist.json` para `site/biblioteca/data/` em
  `site/build-library.sh`. A allowlist passa a viver **apenas no servidor**:
  preferencialmente como **variável de ambiente** na Vercel
  (`IRC_ALLOWLIST_JSON`, conteúdo JSON) ou um arquivo lido apenas pela função
  (fora de qualquer pasta servida estaticamente). Documentar no README como
  atualizar.
- Garantir, via `.gitignore` e/ou `vercel.json`, que nenhum
  `allowlist.json` seja publicado. Adicionar verificação no build que **falha** se
  `site/biblioteca/data/allowlist.json` existir.

### B) `POST /api/login` — autenticação no servidor
- Nova função `site/api/login.js` (runtime Node ou Edge da Vercel).
- Recebe `{ email }`, normaliza (trim + lowercase), procura na allowlist do
  servidor. Para evitar enumeração de e-mails, **sempre** responder de forma neutra
  (ex.: `{ ok: true }` mesmo quando não autorizado, **sem** revelar se o e-mail
  existe) — e, se autorizado, emitir o token; se não, não emitir. Decidir a
  mensagem com o Flávio, mas **nunca** ecoar a lista nem confirmar/negar e-mail de
  forma explorável em massa (considerar rate-limit simples por IP).
- Em caso autorizado: gerar um **token assinado** (JWT HS256 ou HMAC próprio) com
  `{ email, planLevel, exp }`, assinado por um segredo em env (`IRC_SESSION_SECRET`).
  Entregar como **cookie `httpOnly`, `Secure`, `SameSite=Lax`** (não em
  `localStorage`/`sessionStorage`).
- Sem dependências pesadas: pode usar `jsonwebtoken` **ou** assinar com o
  `crypto` nativo do Node (HMAC-SHA256) — preferir o nativo para não adicionar
  build.

### C) `POST /api/logout`
- Limpa o cookie de sessão.

### D) `GET /api/session` (opcional, conveniência)
- Lê o cookie, valida a assinatura e a expiração, e devolve
  `{ logged: bool, planLevel }` para a UI ajustar cadeados/avisos. **Nunca**
  devolve e-mails de terceiros.

### E) `GET /api/file/:slug` — entrega protegida dos PDFs privados
- Nova função que:
  1. Lê e **valida o token** do cookie (assinatura + `exp`).
  2. Busca o documento por `slug` no catálogo do servidor.
  3. Aplica a regra de nível (reusar a lógica de `biblioteca-core/src/levels.js` /
     `access.js`): se `minLevel` do doc exigir mais que o `planLevel` do usuário,
     responder **403**.
  4. Se liberado, **fazer stream** do PDF a partir de um local **não servido
     estaticamente** (ver F) com `Content-Type: application/pdf` e
     `Content-Disposition: inline`.
- Documentos **públicos** continuam podendo ser servidos direto (ou também via
  função, por uniformidade — escolher um caminho e documentar).

### F) Tirar os PDFs privados da pasta pública
- Os PDFs exclusivos **não** podem ficar em `site/biblioteca/files/private/`
  (servida estaticamente). Opções:
  - Mover para uma pasta **fora de `site/`** que só a função `api/file` leia do
    filesystem do deploy (incluí-la via `includeFiles`/config de função da Vercel),
    **ou**
  - Usar **Vercel Blob** (bucket privado) e o `api/file` gera o stream/`signed URL`
    de curta duração.
- Ajustar `build-library.sh` para colocar os privados nesse local protegido, e
  **remover** `site/biblioteca/files/private/` do output estático.
- Confirmar no fim: `curl https://…/biblioteca/files/private/estudos-hgen.pdf`
  deve dar **404/403**, não 200.

### G) Catálogo público deixa de revelar arquivos privados
- No `catalog.json` **público**, omitir `assets.pdf` (e qualquer caminho real) de
  documentos exclusivos — manter só metadados públicos (título, autores, ano,
  resumo, tags, `minLevel`). A resolução do arquivo passa a ser feita **no
  servidor** por `slug`, em `api/file`. Ajustar o `build-library.sh`/adapter para
  gerar essa versão "saneada" do catálogo público (a versão completa, com caminhos,
  fica no servidor).

### H) Ajustar o front-end
- `auth.js`: trocar `loadAllowlist()` + comparação local por chamadas a
  `/api/login`, `/api/logout`, `/api/session`. **Remover** qualquer `fetch` da
  allowlist. Sessão passa a ser o cookie httpOnly (a UI consulta `/api/session`).
- `data.js`: `resolvePdfPath()` e `flipbookUrl()` passam a apontar para
  `/api/file/<slug>` (em vez de `/biblioteca/files/private/...`). O leitor de PDF
  (flipbook em `?pdf=`) deve aceitar essa URL protegida — a função responde o PDF
  se o cookie for válido; senão, a UI mostra o aviso de acesso e o botão "Entrar".
- `catalog-page.js` / `document-page.js`: continuar mostrando ficha, resumo e
  cadeado normalmente; o conteúdo integral só abre quando `api/file` autoriza.
- Tratamento de erro: 401/403 → mostrar convite a entrar / "Solicitar acesso".

---

## Itens de segurança a observar
- Segredos (`IRC_SESSION_SECRET`, `IRC_ALLOWLIST_JSON`) **só** em env vars da
  Vercel; nunca commitados, nunca no bundle do cliente.
- Cookie de sessão: `httpOnly` + `Secure` + `SameSite=Lax`, com `exp` (ex.: 7–30
  dias) e validação de assinatura em toda função protegida.
- Não vazar, em nenhuma resposta de API, a lista de e-mails nem confirmar a
  existência de um e-mail específico de forma que permita enumeração em massa
  (resposta neutra + rate-limit básico por IP).
- Headers em `vercel.json`: manter `noindex`/`no-store` nas rotas de arquivo, mas
  ciente de que **não substituem** a verificação na função.
- Validar/normalizar entradas (`email`, `slug`) e evitar path traversal em
  `api/file` (mapear `slug → arquivo` por uma tabela do servidor, nunca concatenar
  caminho a partir de input do cliente).

---

## Critérios de aceite
1. `curl https://…/biblioteca/data/allowlist.json` → **404** (arquivo não existe
   mais no site publicado). Nenhum e-mail acessível no front-end ou na rede.
2. `curl https://…/biblioteca/files/private/estudos-hgen.pdf` → **404/403**
   (não mais 200).
3. Sem cookie válido, `GET /api/file/estudos-hgen` → **401/403**; com sessão de
   nível suficiente → o PDF abre.
4. Documento exclusivo no `catalog.json` público **não** contém o nome do arquivo
   real (`assets.pdf` ausente/saneado).
5. Login: e-mail autorizado entra e lê o exclusivo; e-mail não autorizado não entra
   e **não** consegue descobrir, pela resposta, quem está na lista.
6. Documentos **públicos** continuam abrindo normalmente para todos.
7. Build falha (ou avisa) se um `allowlist.json` for parar na pasta publicada.

## Como testar
- Local: `bash serve.sh` cobre o estático; para as funções, usar `vercel dev` na
  raiz `site/` (ou ambiente de preview da Vercel) e exercitar `/api/login`,
  `/api/session`, `/api/file/:slug` com e sem cookie.
- Repetir os `curl` dos critérios 1–3 no **preview** antes de promover a produção.
- Conferir o fluxo completo na UI: entrar, abrir um exclusivo no flipbook, sair,
  confirmar que o exclusivo volta a bloquear.

## Entrega
- Commits pequenos por etapa (A→H).
- Atualizar `site/build.sh`/`build-library.sh`, `vercel.json` e o README da
  biblioteca documentando: onde fica a allowlist agora, quais env vars criar na
  Vercel e como adicionar/remover um assinante.
- Resumo final: arquivos alterados/criados e os resultados dos `curl` de
  verificação.

> **Observação ao Flávio:** o pedido foi "proteger os e-mails", mas a mesma
> allowlist é o que libera os PDFs exclusivos — por isso o prompt fecha as duas
> brechas juntas. Se você quiser fazer só a parte dos e-mails agora (etapas A–D +
> ajuste de `auth.js`) e deixar os arquivos para depois, dá para separar; só saiba
> que, até a etapa E–G, o acervo "exclusivo" continua baixável por URL direta.
