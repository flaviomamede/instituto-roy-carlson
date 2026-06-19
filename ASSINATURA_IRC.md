# Prompt — Módulo de Assinatura (planos + Pix) do Instituto Roy Carlson

> **Como usar:** cole este arquivo inteiro como instrução para a IA do Cursor.
>
> ⚠️ **Estado real do projeto (conferido):** a camada de segurança/login da
> Biblioteca **já está implementada** (não é mais uma dependência a fazer). Este
> prompt já reflete o código existente e descreve **apenas o que falta**: a página
> de planos, o checkout via Pix e o **único ajuste** necessário no back-end para a
> assinatura expirar (validade). Não reimplemente login/allowlist/entrega de
> arquivos — eles existem e funcionam.

---

## 1. O que já existe (não mexer, só integrar)

Site do **Instituto Roy Carlson** na **Vercel** (`institutoroycarlson.org`), HTML +
**JS vanilla (ES Modules)**, sem framework/bundler, **pt-BR**, paleta petróleo/latão
(`--petrol #1f5163`, `--brass #c79a4b`), Libre Baskerville + DM Sans, navegação
compartilhada (`site/site-nav.css`, `site/js/site-nav.js`). Build: `site/build.sh`
→ `site/build-library.sh`.

**Autenticação da Biblioteca (Serverless Functions da Vercel):**

| Arquivo | Papel |
|---|---|
| `site/api/login.js` | `POST {email}` → se o e-mail está na allowlist, grava cookie de sessão. Resposta **sempre neutra** (`{ok:true}`), com rate-limit (20/min/IP). |
| `site/api/logout.js` | Limpa o cookie. |
| `site/api/session.js` | `GET` → `{logged, email, planLevel, name}` a partir do cookie. |
| `site/api/file/[slug].js` | Entrega o PDF: público direto; privado só se a sessão tiver nível suficiente (senão 403). Lê de `api/_data/library/files/`. |
| `site/api/_lib/auth.js` | Cookie `irc_library_session`, **HMAC-SHA256** (`IRC_SESSION_SECRET`), token `{email, planLevel, name, exp}`, sessão de **14 dias**. `findUser()` busca na allowlist. |
| `site/api/_lib/access.js` | Hierarquia de níveis e regra de acesso. |
| `site/api/_lib/catalog.js` | Catálogo **completo** server-side (`api/_data/library/catalog.full.json`) + `privateFilePath()` (com guarda anti path-traversal). |

**Allowlist (onde moram os assinantes):**
- Produção: variável de ambiente **`IRC_ALLOWLIST_JSON`** (conteúdo JSON).
- Dev (fallback): arquivo **`biblioteca-adapters/irc/allowlist.json`** (NÃO publicado;
  o `build-library.sh` aborta se ele vazar para `site/biblioteca/data/`).
- Schema atual de cada usuário: `{ "email", "planLevel", "name" }`.

**Níveis (de `_lib/access.js`)** — ordem crescente:
`public` < `member` < `founder` < `sponsor`. Acesso é por *rank* (nível ≥ mínimo do
documento). Hoje o catálogo só usa `public` e `member`.

➡️ **Mapeamento dos planos para os níveis:**
- **Leitor (grátis)** = `public`.
- **Assinante pago (R$197/ano ou R$19/mês)** = **`member`** (libera o acervo exclusivo).
- **Fundador / Patrocinador** = `founder` / `sponsor` — concedidos **manualmente**
  (institucional/negociado), **fora** do checkout de R$197.

**Importante (o gap):** `findUser()` só verifica *presença* na allowlist e o token
expira em 14 dias, mas **o re-login é livre** (basta digitar o e-mail). Não há
campo de **validade de assinatura**. Logo, hoje uma assinatura anual/mensal **não
venceria sozinha**. Fechar isso é a Tarefa 4.

---

## 2. Planos e cobrança (decisões tomadas)

- **Anual — R$ 197 / ano → plano PRINCIPAL (destaque "Recomendado").** Paga uma vez,
  vale 1 ano. ~13% mais barato que 12×R$19.
- **Mensal — R$ 19 / mês → secundário, "renovação manual".**
  ⚠️ Pix estático não cobra nem renova sozinho; o mensal exige novo pagamento a cada
  mês. Deixe isso explícito na UI e **destaque o anual**.
- **Leitor (grátis)** entra só como coluna de comparação (sem checkout).

**Estágio interino:** o Instituto ainda **não tem PJ nem gateway**. Cobrança por
**Pix estático** em conta pessoal, **ativação manual**. Desenhar para trocar
Pix pessoal → chave da PJ → gateway (Stripe/Mercado Pago) por **config**, sem
reescrever a UI.

### Config central — criar `site/assinatura/js/config.js`
```js
export const ASSINATURA = {
  pix: {
    key: '337e5967-9bcd-40cd-b9c9-3de086f1baf4', // chave aleatória (Pix)
    holder: 'Flávio Mamede Pereira Gomes',        // titular exibido (confiança)
    city: 'Anápolis-GO'
  },
  plans: {
    anual:  { id: 'anual',  label: 'Anual',  price: 197.00, periodo: 'ano', months: 12, destaque: true  },
    mensal: { id: 'mensal', label: 'Mensal', price: 19.00,  periodo: 'mês', months: 1,  destaque: false }
  },
  grantsLevel: 'member',                       // nível concedido ao assinante pago
  notifyEmail: 'institutoroycarlson@gmail.com', // recebe avisos p/ ativar
  intakeEndpoint: '<MESMO_APPS_SCRIPT_DO_GATE_DA_REVISTA>' // reusar (ver gate.js)
};
```

### Pix "Copia e Cola" (BR Code) já validados (CRC conferido)
Valor embutido por plano; titular ajustado ao limite de 25 chars (o banco mostra o
titular real da chave de qualquer forma); `txid = ***` (máxima compatibilidade — a
conciliação é por e-mail no formulário, não por txid):

- **Anual R$ 197,00:**
  `00020126580014br.gov.bcb.pix0136337e5967-9bcd-40cd-b9c9-3de086f1baf45204000053039865406197.005802BR5921FLAVIO MAMEDE P GOMES6008ANAPOLIS62070503***63044EE1`
- **Mensal R$ 19,00:**
  `00020126580014br.gov.bcb.pix0136337e5967-9bcd-40cd-b9c9-3de086f1baf4520400005303986540519.005802BR5921FLAVIO MAMEDE P GOMES6008ANAPOLIS62070503***63045A29`

---

## 3. Fluxo (Pix manual, sem gateway)
```
/assinatura/ (planos)  → escolhe Anual/Mensal
   → tela de pagamento: titular + valor + QR + "Copia e Cola" + formulário (nome, e-mail)
   → POST ao Apps Script (reusa o do gate) → grava lead + e-mail para notifyEmail
   → UI: "Recebido. Após confirmar o Pix, liberamos o acesso por e-mail (até X h úteis)."
   → [MANUAL] Flávio confere o Pix, casa pelo e-mail/nome e adiciona o usuário à
              allowlist com planLevel:'member' e validUntil = hoje + período
   → login do usuário (api/login) concede acesso; expira sozinho em validUntil
```

---

## Tarefa 1 — Geração dos QR e BR Codes no build *(sem dep. em runtime)*
Valor é fixo por plano ⇒ QR é asset estático; gere no build.
- Em `site/build.sh` (ou `build-assinatura.sh` chamado por ele): gerar o BR Code EMV
  de cada plano a partir de `ASSINATURA.pix` + `price` (TLVs + **CRC16-CCITT**, init
  `0xFFFF`, polinômio `0x1021`), gerar as imagens `site/assinatura/qr-anual.png` e
  `qr-mensal.png` (ex.: Python `qrcode`), e emitir as strings "copia e cola" em
  `site/assinatura/pix.json`.
- **Aceite:** escanear o QR num app de banco real pré-preenche o valor correto.

## Tarefa 2 — Página `/assinatura/` *(visual + comparativo)*
- `site/assinatura/index.html` no padrão do site; linkar "Assinar" na navegação.
- Hero (proposta de valor: acervo exclusivo + Revista IRC completa + memória técnica
  do concreto massa). Grade de 3 planos com **Anual em destaque**:
  - **Leitor (grátis):** catálogo, fichas, resumos, revista em prévia, acervo aberto.
  - **Assinante (R$197/ano · R$19/mês):** leitura integral do acervo exclusivo +
    revista completa.
  - **Fundador / Patrocinador:** "Fale com o Instituto" →
    `mailto:institutoroycarlson@gmail.com` (sem checkout automático).
- Tabela comparativa + FAQ (o que é o acervo, cobrança via Pix, prazo de liberação,
  como renovar o mensal, cancelamento/reembolso). Acessível, responsivo,
  `prefers-reduced-motion`.

## Tarefa 3 — "Checkout" Pix *(tela de pagamento)*
- Rota `/assinatura/pagar/?plano=anual|mensal` (ou painel pós-escolha).
- Mostrar titular, valor, **QR** (do build) e **botão "Copiar código Pix"** (string do
  `pix.json`) com confirmação visual.
- Formulário mínimo: Nome, E-mail (`type=email`, obrigatório, nota "use o e-mail que
  usará para acessar a Biblioteca") + honeypot anti-bot.
- Enviar → `POST` para `ASSINATURA.intakeEndpoint` com `{nome,email,plano,valor,ts}`.
  Sucesso → mensagem de confirmação + instrução de pagamento + prazo de liberação.
  Degradar sem JS para instrução textual (chave + valor).
- **Aceite:** o lead chega no e-mail `notifyEmail`; a string copiada é idêntica à do
  build.

## Tarefa 4 — Acoplar ao acesso + **validade de assinatura** *(back-end existente)*
Este é o **único** ajuste no back-end já pronto. Mínimo e cirúrgico:

**(a) Schema da allowlist** — adicionar campos **opcionais** ao usuário:
`validUntil` (ISO date, ex. `"2027-06-19"`), `since`, `source` (ex. `"pix-anual"`).
Atualizar o JSON Schema se existir (`biblioteca-adapters/schema/allowlist.schema.json`).
Fundadores/patrocinadores **omitem** `validUntil` (acesso perpétuo).

**(b) Enforçar a validade em `site/api/_lib/auth.js`:**
- Em `findUser()` (ou em quem monta a sessão): se `user.validUntil` existir e já
  passou (`Date.now() > Date.parse(validUntil)`), tratar como **não autorizado**
  (retornar `null`) → não emite sessão.
- Em `setSessionCookie()`: limitar o `exp` do token a
  **`min(now + 14 dias, validUntil)`**, para a sessão ativa se auto-revogar ao fim da
  assinatura (não só no próximo login). Como `file/[slug].js` valida o token via
  `getSessionFromRequest`/`verifyToken` (que já checa `exp`), isso cobre a entrega de
  arquivos automaticamente.
- Manter a resposta de `login` **neutra** (sem revelar se o e-mail existe ou venceu).

**(c) Ativação manual (MVP)** — documentar no `site/biblioteca/README.md`:
para liberar/renovar um assinante, adicionar/editar a entrada na allowlist
(`IRC_ALLOWLIST_JSON` em produção; `biblioteca-adapters/irc/allowlist.json` em dev),
ex.:
```json
{ "email": "fulano@dominio.com", "planLevel": "member", "name": "Fulano",
  "validUntil": "2027-06-19", "since": "2026-06-19", "source": "pix-anual" }
```
*Opcional/futuro:* endpoint admin protegido (`api/admin/grant`) ou script para
automatizar essa concessão.

- **Aceite:** assinante adicionado com `validUntil` futuro entra e abre o exclusivo;
  passada a data, o acesso fecha sozinho (login deixa de conceder e sessões ativas
  expiram). Fundador/patrocinador (sem `validUntil`) seguem perpétuos.

## Tarefa 5 — Caminho para gateway real *(documentar, não implementar)*
No `config.js`/README, registrar a evolução sem refatorar UI:
1. Trocar `ASSINATURA.pix.*` pela chave da **PJ** (mesmo fluxo manual).
2. Plugar **Stripe** ou **Mercado Pago** (Pix + cartão + webhook): o webhook passa a
   **gravar/renovar** a entrada da allowlist com `planLevel:'member'` e `validUntil`
   automaticamente (substitui a ativação manual da Tarefa 4-c) e habilita renovação
   automática do mensal. O contrato de dados (campos da allowlist) **não muda**.

---

## Observações (registrar no README; decisão do Flávio)
- **Conta pessoal (CPF) recebendo receita recorrente é interino** (limites de Pix +
  fiscal). Migrar para PJ/gateway antes de escalar volume.
- **Pix estático não confirma nem renova** automaticamente — ativação/renovação
  manuais até haver gateway; por isso o **anual é o principal**.
- **Conciliação pelo formulário** (e-mail/nome), não pelo txid.
- Política de **cancelamento/reembolso** clara no FAQ.

## Como testar
- `bash serve.sh` (estático) + `vercel dev` na raiz `site/` para `api/*`.
- Escanear os QR num app de banco real (valor/titular corretos).
- Enviar o formulário e conferir o e-mail em `institutoroycarlson@gmail.com`.
- Validade: adicionar usuário com `validUntil` no passado → `api/login` não concede;
  com `validUntil` futuro → concede e `api/file/<slug-exclusivo>` responde o PDF;
  expirar a data → acesso fecha.

## Entrega
- Commits pequenos por tarefa (1→5). Não tocar na lógica de login/allowlist/arquivos
  além do item 4 (validade).
- Atualizar `build.sh`/novo `build-assinatura.sh`, `site/assinatura/*`,
  `site/api/_lib/auth.js` (validade), schema da allowlist e o
  `site/biblioteca/README.md` (ativação/renovação + migração para gateway).
- Resumo final: arquivos criados/alterados e o resultado do teste do QR real e da
  expiração.
