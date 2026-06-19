# Biblioteca IRC — Requisitos e Plano de Implementação

> **Status:** aprovado (v0.2 — 19/06/2026)  
> **Escopo:** seção institucional modular, com acesso diferenciado por plano, pagamento acoplado depois.

---

## 1. Contexto

### O que já existe

| Ativo | Situação |
|-------|----------|
| Site publicado (`site/`) | Estático, Vercel, identidade `revista.css`, **Revista IRC em destaque** |
| Acervo local (`biblioteca/`) | PDFs, reminiscências, imagens — **não publicados na web** |
| Protótipo Furnas (`PROJETO_FM_FURNAS_ENGENHARIA`) | SPA React/Vite em `/biblioteca`: filtros, lista + viewer PDF, **sem auth, sem busca** |
| Flipbook | Gate de e-mail + leads (Apps Script) — padrão reutilizável para “desbloqueio” |

### O que você pediu

1. Manter perfil visual atual; **Revista IRC sempre em destaque** (home + menu).
2. Biblioteca institucional com **maioria dos documentos bloqueados** para não-membros.
3. **Público sempre vê:** busca, ficha, resumo e (quando existir) sumário.
4. **Alguns documentos-chave gratuitos** para todos.
5. Módulo **reutilizável** em outro site (ex.: Furnas) com outro perfil visual.
6. **Pagamento depois**, desacoplado — hoje não há conta bancária.

---

## 2. Requisitos funcionais (para aprovação)

### RF-01 — Catálogo público

- [ ] Página `/biblioteca/` listando o acervo com cards editoriais.
- [ ] **Busca textual** por título, autor, tag, coleção e resumo.
- [ ] **Filtros** por coleção, tipo, idioma, ano, tag e nível de acesso (público / exclusivo).
- [ ] Ordenação: relevância (busca), ano (desc), título (A–Z).
- [ ] Estado vazio amigável quando filtros não retornam itens.
- [ ] Aviso editorial obrigatório: *“A biblioteca está em organização e será ampliada progressivamente.”* (`ARQUITETURA_SITE.md` §5.4)

### RF-02 — Ficha pública por documento

- [ ] URL estável: `/biblioteca/documento/{slug}/` (deep link, compartilhável).
- [ ] **Sempre visível ao público**, mesmo com PDF bloqueado:
  - título, subtítulo (se houver);
  - autores;
  - ano, idioma, tipo, coleção;
  - tags;
  - **resumo** (obrigatório);
  - **ficha bibliográfica** (campos estruturados);
  - **sumário** (opcional — lista `{ título, página }`, quando disponível);
  - indicador visual de acesso: 🔓 aberto / 🔒 exclusivo + nome do plano mínimo;
  - documentos relacionados (ex.: artigo na Revista IRC).
- [ ] **Nunca** expor URL direta do PDF completo na ficha de item bloqueado.

### RF-03 — Níveis de acesso

Hierarquia proposta (do menor ao maior privilégio):

| Nível | Quem | O que acessa |
|-------|------|--------------|
| `public` | Visitante | Documentos marcados como abertos + metadados de todos |
| `member` | Assinante IRC | Acervo “membro” (maioria) |
| `founder` | Membro fundador | Acervo membro + exclusivos fundador |
| `sponsor` | Patrocinador | Acervo ampliado / benefícios extras |

Regras:

- [ ] Cada documento declara `access.minLevel` (`public` | `member` | `founder` | `sponsor`).
- [ ] Visitante vê card e ficha de **todos**; PDF/viewer só se `minLevel` permitido.
- [ ] Itens bloqueados exibem CTA: *“Torne-se assinante para ler”* (sem prometer preço ainda).

### RF-04 — Leitura e download (membros)

- [ ] Após auth, **o usuário escolhe o modo de leitura** (não é fixo por obra):
  - **Leitura rápida** — iframe PDF (como no site Furnas);
  - **Flipbook** — efeito livro (reutiliza motor de `revista/leitura/`).
- [ ] Toggle visível na ficha e na área de leitura; última escolha salva em `localStorage`.
- [ ] Botão download **somente após auth** e se política do documento permitir.

### RF-05 — Autenticação (MVP sem pagamento)

- [ ] Login por **e-mail + magic link** ou **lista manual de membros** (planilha / JSON administrado).
- [ ] Sessão persistida (cookie/localStorage com TTL).
- [ ] Perfil do usuário carrega `planLevel` (`member` | `founder` | `sponsor`).
- [ ] **Logout** explícito.
- [ ] Página *“Solicitar acesso”* (formulário → planilha/e-mail), enquanto pagamento não existe.

> Pagamento real entra depois via **adaptador** (§4.3), sem reescrever catálogo nem UI.

### RF-06 — Integração com o site IRC

- [ ] Home (`site/index.html`): Revista IRC **permanece CTA principal**; Biblioteca como segundo bloco (não competir visualmente).
- [ ] Menu superior institucional ampliado: Início · Revista IRC · Biblioteca · (Instituto)* · Contato*.
- [ ] Cross-links Revista ↔ Biblioteca (ex.: Reminiscências, Concreto massa no Brasil).
- [ ] Mesma folha `revista.css` (ou `site.css` extraído dela).

\* Instituto e Contato podem ser placeholders nesta fase, conforme `ARQUITETURA_SITE.md`.

### RF-07 — Modularidade / reutilização

- [ ] **Núcleo independente de framework** (`biblioteca-core/`) — catálogo, busca, regras de acesso.
- [ ] **Adaptadores de site** (`biblioteca-adapters/irc/`, `.../furnas/`) — tema, rotas, auth, pagamento.
- [ ] Catálogo em **JSON/YAML versionado**, não hardcoded em TypeScript.
- [ ] Outro site reutiliza o core trocando: `catalog.json`, CSS variables, adaptador auth.

---

## 3. Requisitos não funcionais

| ID | Requisito |
|----|-----------|
| RNF-01 | Compatível com site estático atual (Vercel, sem backend pesado no MVP). |
| RNF-02 | Core testável isoladamente (funções puras de busca e `canAccess(doc, user)`). |
| RNF-03 | PDFs protegidos: URLs não adivinháveis no MVP; evolução para signed URLs / API. |
| RNF-04 | Performance: catálogo indexado no cliente; lazy load de PDF. |
| RNF-05 | Acessibilidade: navegação por teclado, labels, contraste editorial existente. |
| RNF-06 | SEO: fichas públicas indexáveis; PDFs bloqueados com `noindex` nos assets. |
| RNF-07 | LGPD: login mínimo (e-mail); política de privacidade linkada no gate de acesso. |

---

## 4. Arquitetura modular proposta

```
PROJETO_IRoyCarlson/
├── biblioteca-core/              # Pacote reutilizável (vanilla JS, ES modules)
│   ├── schema/
│   │   └── catalog.schema.json   # Validação do catálogo
│   ├── src/
│   │   ├── catalog.js            # Load + validate
│   │   ├── search.js             # Busca + filtros + facets
│   │   ├── access.js             # canAccess(), getPublicFields()
│   │   └── types.d.ts            # Tipos para editores
│   └── README.md
│
├── biblioteca-adapters/
│   ├── irc/                      # Site Instituto Roy Carlson
│   │   ├── catalog.json          # Acervo IRC
│   │   ├── auth-stub.js          # MVP: allowlist / magic link
│   │   └── payment-stub.js       # No-op até Stripe/etc.
│   └── _template/                # Copiar para novo site (Furnas, etc.)
│
└── site/
    ├── index.html                # Home (Revista em destaque + bloco Biblioteca)
    ├── site.css                  # Extraído de revista.css (opcional)
    └── biblioteca/
        ├── index.html            # Catálogo
        ├── documento/
        │   └── index.html        # Shell + ?slug= (ou /{slug}/ com cleanUrls)
        ├── js/
        │   ├── main.js           # Bootstrap UI
        │   ├── catalog-page.js
        │   └── document-page.js
        └── assets/               # Capas, thumbnails (públicos)
```

### 4.1 Modelo de dados (evolução do protótipo Furnas)

```json
{
  "id": "reminiscencias-roy-carlson",
  "slug": "reminiscencias-roy-carlson",
  "title": "Reminiscências — Dr. Roy W. Carlson",
  "authors": ["Roy W. Carlson"],
  "year": 1996,
  "language": "en",
  "type": "livro",
  "collection": "Memória técnica",
  "tags": ["Roy Carlson", "Furnas", "concreto massa"],
  "access": { "minLevel": "member" },
  "public": {
    "summary": "Relatos pessoais e técnicos do pioneiro do concreto massa...",
    "ficha": {
      "editora": "…",
      "paginas": 120,
      "isbn": null
    },
    "toc": [
      { "title": "Família e primeiros anos", "page": 1 },
      { "title": "Furnas", "page": 45 }
    ]
  },
  "assets": {
    "pdf": "protected/reminiscencias.pdf",
    "cover": "assets/covers/reminiscencias.jpg"
  },
  "related": {
    "revistaArticle": "roy-carlson-reminiscencias"
  }
}
```

### 4.2 Interfaces de adaptador (contratos)

**AuthAdapter**

```javascript
// authenticate(credentials) → { ok, user: { email, planLevel } }
// getSession() → user | null
// logout()
```

Implementações previstas:

| Fase | Implementação |
|------|----------------|
| MVP | `AllowlistAdapter` — e-mails em JSON/planilha Google |
| v2 | `MagicLinkAdapter` — token por e-mail (Resend / Apps Script) |
| v3 | Integração com provedor OAuth se necessário |

**PaymentAdapter**

```javascript
// getAvailablePlans() → Plan[]
// subscribe(planId) → redirectUrl | error   // stub retorna "em breve"
// syncSubscription(userId) → planLevel    // webhook futuro
```

MVP: `PaymentStub` — botão “Assinaturas em breve” + formulário solicitar acesso.

**AssetDeliveryAdapter**

```javascript
// getPdfUrl(documentId, user) → url | null
```

MVP: função serverless Vercel valida sessão e faz stream do PDF.  
Fallback inicial (menos seguro): PDF fora de `public/` + gate só na UI — **aceitar só temporariamente**.

### 4.3 O que reaproveitar do protótipo Furnas

| Do Furnas | Adaptação IRC |
|-----------|---------------|
| Master-detail (lista + painel) | Catálogo + ficha; viewer só se autorizado |
| Filtros por projeto/tag | Filtros por coleção/tag/tipo/acesso |
| `LibraryDocument` interface | Expandir com `access`, `public.ficha`, `public.toc` |
| Cards clicáveis | + ícone cadeado + badge de plano |
| iframe PDF `#view=FitH` | Mesmo, atrás de auth |
| Dados em código TS | **Migrar para `catalog.json`** |

| Não levar | Motivo |
|-----------|--------|
| Stack React/Vite inteira | Site IRC é estático; core vanilla JS |
| Tailwind do Furnas | Usar `revista.css` |
| Tudo público | Requisito oposto |

---

## 5. Conteúdo inicial sugerido (seed)

Itens candidatos já no disco (`biblioteca/`):

| Documento | Acesso sugerido | Ficha pública |
|-----------|-----------------|---------------|
| Reminiscências (Roy Carlson) | `member` | resumo + sumário (4 partes) |
| Concreto massa no Brasil (Amaral) | `public` | já na Revista — PDF aberto |
| IWHR 2014 / 2024 / 2025 | `member` | resumo + metadados congresso |
| Estudos HGen | `founder` ou `member` | resumo |
| Livro Reminiscências Comentado | `sponsor` ou `founder` | resumo |

**Meta MVP:** 5–8 itens reais com ficha completa; restante “em organização”.

---

## 6. Plano de implementação (fases)

### Fase 0 — Aprovação (você)

- [x] Validar níveis de acesso (`member` / `founder` / `sponsor`).
- [x] Validar MVP auth: allowlist manual.
- [x] Validar conteúdo seed (PDFs em `biblioteca/` + catálogo JSON).
- [x] Validar menu **Biblioteca**; Revista continua protagonista na home.

### Fase 1 — Núcleo + catálogo público (≈ 1 sprint)

1. Criar `biblioteca-core/` com schema, busca, access rules + testes unitários simples.
2. Criar `biblioteca-adapters/irc/catalog.json` com seed.
3. Criar `site/biblioteca/index.html` — busca, filtros, cards, cadeado.
4. Criar ficha pública `/biblioteca/documento/?slug=…`
5. Atualizar home + nav (Revista em destaque, Biblioteca secundária).
6. Cross-links com Revista.

**Entregável:** catálogo 100% navegável; PDFs bloqueados só mostram CTA.

### Fase 2 — Auth stub + leitura membro (≈ 1 sprint)

1. `AllowlistAdapter` + UI login (e-mail).
2. Sessão local + indicador “logado como …”.
3. Viewer/download para documentos permitidos.
4. Formulário “Solicitar acesso” → Google Sheets (como flipbook).
5. Vercel Function `/api/library/pdf/[id]` — entrega condicional.

**Entregável:** você cadastra e-mails manualmente; membros leem PDF.

### Fase 3 — Endurecer segurança e UX (≈ 0,5 sprint)

1. Signed URLs ou token de curta duração para PDF.
2. Thumbnails/capas públicas.
3. Sumários extraídos (manual YAML ou semi-automático).
4. Página “Minha biblioteca” (favoritos — opcional).

### Fase 4 — Pagamento modular (quando houver conta)

1. Implementar `PaymentAdapter` (Stripe / Mercado Pago / Asaas — a definir).
2. Webhook → atualiza `planLevel` do usuário.
3. Substituir CTA “em breve” por checkout.
4. **Zero mudança** em `catalog.json` e UI pública.

### Fase 5 — Reutilização Furnas (opcional)

1. Copiar `biblioteca-core/` para o repo Furnas (ou npm workspace).
2. `biblioteca-adapters/furnas/` com catálogo UHE Batalha, tema Tailwind.
3. Auth/pagamento próprios ou compartilhados.

---

## 7. Riscos e mitigação

| Risco | Mitigação |
|-------|-----------|
| PDF “vazando” por URL direta | API de entrega na Fase 2; não linkar PDF em HTML público |
| Escopo crescer antes do pagamento | PaymentAdapter stub; allowlist manual |
| Biblioteca parecer vazia | Seed 5–8 itens + aviso “em organização” |
| Duplicar lógica do flipbook | AuthAdapter separado; mesma planilha Sheets se fizer sentido |
| React vs estático | Core vanilla JS; Furnas consome core via wrapper fino depois |

---

## 8. Decisões aprovadas (19/06/2026)

| # | Decisão | Escolha |
|---|---------|---------|
| 1 | Nome no menu | **Biblioteca** |
| 2 | Login MVP | **Allowlist manual** (e-mails abaixo). Magic link fica para v2 — ver nota abaixo. |
| 3 | Conteúdo aberto (`public`) | Estudos HGen, IWHR 2014/2024/2025, Concreto massa no Brasil |
| 3b | Conteúdo exclusivo (`member`+) | Papers P183–P192 (Francisco Andriolo) |
| 3c | Reminiscências | `member`+; viewer **flipbook** (opcional por documento) |
| 4 | Viewer | **Escolha do usuário** — toggle “Leitura rápida (PDF)” / “Flipbook (livro)” em toda obra com PDF; preferência salva no navegador |
| 5 | Armazenamento PDF | **Híbrido Vercel** (recomendado) — ver §8.1 |

**Allowlist inicial:** `biblioteca-adapters/irc/allowlist.json`  
**Catálogo seed:** `biblioteca-adapters/irc/catalog.json`

### 8.1 Armazenamento de PDFs (decisão técnica)

**Recomendação adotada — híbrido em Vercel:**

| Tipo | Onde | Como entrega |
|------|------|--------------|
| **Abertos** (`public`) | `site/biblioteca/files/public/` | URL estática normal (rápido, SEO ok) |
| **Exclusivos** (`member`+) | `site/biblioteca/files/private/` (nomes opacos) | **Vercel Function** `/api/library/pdf/[id]` valida e-mail da allowlist |

**Por quê não Drive nem R2 agora?**
- **Google Drive privado:** lento, URLs frágeis, difícil de auditar.
- **Cloudflare R2:** ótimo em escala, mas setup extra sem benefício imediato para ~20 PDFs.
- **Vercel Blob:** boa evolução na Fase 3 se o acervo crescer muito; por ora o bundle + API basta.

PDFs **nunca** linkados por nome original na HTML pública (ex.: `P183...pdf`).

### 8.2 Magic link (nota)

**Magic link** = login sem senha: você digita o e-mail → recebe um link único por e-mail → clicou, entrou.  
Mais confortável que allowlist pura, mas exige serviço de e-mail (Resend, Apps Script).  
**MVP:** allowlist + login só com e-mail (confia que quem digita é o dono). **v2:** magic link ou código OTP.

### 8.3 Mapeamento PDFs de teste → catálogo

| Arquivo em `biblioteca/` | ID catálogo | Acesso |
|--------------------------|-------------|--------|
| `EstudosHGen.pdf` | `estudos-hgen` | public |
| `concreto_massa_no_brasil.pdf` | `concreto-massa-brasil` | public |
| `IWHR2014.pdf` | `iwhr-2014` | public |
| `IWHR2024.pdf` | `iwhr-2024` | public |
| `IWHR2025.pdf` | `iwhr-2025` | public |
| `P183 … P192 …pdf` | `p183-andriolo` … `p192-andriolo` | member |
| `reminiscences/…REMINISCENCES.pdf` | `reminiscencias-roy-carlson` | member, flipbook |

*(Na Fase 1, `site/build.sh` copiará e renomeará para `files/public/` e `files/private/`.)*

---

## 8 (legado). Decisões pendentes — **encerrado**

~~Responda ou marque o que preferir~~ — substituído pela §8 acima.

---

## 9. Critério de pronto (MVP biblioteca)

- [ ] Home mantém Revista IRC como CTA principal.
- [ ] `/biblioteca/` com busca e ≥ 5 documentos reais.
- [ ] Ficha pública completa (resumo + ficha; sumário onde existir).
- [ ] Itens bloqueados sem URL de PDF exposta.
- [ ] Login allowlist funcional para testadores.
- [ ] Formulário solicitar acesso operacional.
- [ ] Core documentado para reuso em outro site.

---

*Fase 0 concluída. Próximo passo: **Fase 1** (catálogo público no site).*
