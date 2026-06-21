# Prompt — Melhorias do Flipbook da Revista IRC

> **Como usar:** cole este arquivo inteiro como instrução para a IA do Cursor.
> Ele descreve o estado atual, as tarefas e os critérios de aceite. Trabalhe
> incrementalmente, uma tarefa por vez, sem quebrar a cadeia de fallback existente.

---

## Contexto do projeto

Site institucional do **Instituto Roy Carlson**, publicado na **Vercel**
(`institutoroycarlson.org`). O leitor de revista ("flipbook") é **caseiro** e já
bem arquitetado:

- **Renderização:** PDF.js (local, em `site/revista/leitura/pdfjs/`) desenha cada
  página do PDF em `<canvas>`.
- **Motor de virada em camadas, com degradação graciosa:**
  1. **StPageFlip** (curvatura realista, carregado de CDN com 3 fallbacks) →
  2. **CSS 3D** (caso o CDN falhe) →
  3. **Demo** (caso não haja PDF).
  Nada pode quebrar essa cadeia.
- **Gate de e-mail** (modo "prévia"): após a página `GATE.indexPage`, abre um
  modal pedindo e-mail (integração Google Apps Script).
- **Stack:** HTML + CSS + **JavaScript vanilla em ES Modules** (sem framework,
  sem bundler). Idioma **pt-BR**. Acessibilidade já presente (`aria-label`,
  `:focus-visible`, `sr-only`, `prefers-reduced-motion`, `dvh/svh`,
  `safe-area-inset`). Mantenha esse padrão.

### Mapa de arquivos (raiz do leitor: `site/revista/leitura/`)

| Arquivo | Papel |
|---|---|
| `index.html` | Marcação, CSS embutido, barra de controles, lightbox, gate. |
| `js/main.js` | Bootstrap, carrega o PDF, orquestra os motores. |
| `js/config.js` | `CONFIG` (PDF padrão, gate, breakpoint), `ARTICLE_SLUGS`. |
| `js/state.js` | Estado global (`state.Book`, `state.FLIP`, etc.). |
| `js/dom.js` | Referências de elementos + loader/erro. |
| `js/pdf.js` | Carrega PDF.js, renderiza/cacheia páginas em canvas. |
| `js/flip-css.js` | Motor CSS 3D (folhas/`.sheet`), pré-render, prefetch. |
| `js/flip-sf.js` | Motor StPageFlip (carrega CDN, build, indicador). |
| `js/flip-controller.js` | Navegação comum (goTo, refreshUI, spreadView). |
| `js/navigation.js` | Botões, teclado, clique, arraste de canto, drop de PDF. |
| `js/zoom.js` | Lightbox (zoom/pan/roda). |
| `js/gate.js` | Gate de e-mail (prévia). |
| `js/stage-fit.js`, `js/viewport.js`, `js/polyfill.js` | Layout/fit, viewport, polyfills. |

> Antes de codar, **leia esses arquivos** para reaproveitar funções existentes
> (ex.: `getPage`/render em `pdf.js`, `goTo`/`refreshUI` em `flip-controller.js`,
> `gateActive()` em `gate.js`). Não duplique lógica.

### Regras invariáveis
- **Não** introduzir framework, bundler ou dependência npm no runtime do leitor.
- **Não** quebrar a cadeia StPageFlip → CSS → demo, nem o gate de prévia.
- Todo recurso novo deve **respeitar o gate**: quando a leitura está travada na
  prévia (`gateActive() === true`), miniaturas, busca e "ir para página" só podem
  navegar dentro das páginas liberadas; ao tentar ir além, **abrir o gate**
  (reusar o fluxo de `gate.js`), nunca expor páginas bloqueadas.
- Manter acessibilidade (foco, `aria-*`, teclado) e `prefers-reduced-motion`.
- Mobile (≤ `CONFIG.MOBILE_BREAKPOINT`, hoje 680px): uma página por vez; os
  painéis novos devem virar overlays utilizáveis com o polegar.

---

## Tarefa 1 — Painel de miniaturas / índice navegável  *(prioridade alta)*

**Objetivo:** dar ao leitor o recurso nº 1 das ferramentas pagas (Issuu /
FlipHTML5 / Heyzine): um painel lateral com **miniaturas de todas as páginas** +
um **sumário clicável** baseado em `ARTICLE_SLUGS`.

**Implementação sugerida:**
- Novo botão na barra de controles (`index.html`), `aria-label="Índice / miniaturas"`,
  ícone de grade. Abre um **painel lateral** (drawer) ou overlay.
- Renderizar miniaturas em baixa resolução reaproveitando o PDF.js já carregado
  (renderizar cada página em escala ~0.2 num canvas pequeno; **lazy** via
  `IntersectionObserver` — só renderiza a thumb quando entra na viewport do painel).
- Cada miniatura mostra o número da página; clique chama `goTo(...)` do
  `flip-controller.js`. A página atual fica destacada.
- **Sumário:** acima das miniaturas, listar as entradas de `CONFIG.ARTICLE_SLUGS`
  (título legível → página). Clique navega para a página do artigo.
- **Gate:** miniaturas das páginas bloqueadas aparecem esmaecidas com cadeado; o
  clique abre o gate em vez de navegar.
- Novo módulo `js/thumbnails.js`; importar em `main.js`. Reusar cache de páginas
  de `pdf.js` quando possível (não renderizar 2×).

**Critérios de aceite:**
- Abrir o painel não congela a UI (render incremental/lazy).
- Clicar numa miniatura/sumário navega corretamente nos **três** motores.
- No mobile o painel é utilizável (rolagem vertical, fecha com X e com `Esc`).
- Páginas bloqueadas nunca são exibidas em alta resolução nem alcançáveis.

---

## Tarefa 2 — Campo "ir para página"  *(prioridade alta, simples)*

**Objetivo:** navegação direta, hoje só há Anterior/Próxima.

**Implementação sugerida:**
- Tornar o indicador de página (`#indicator`) **clicável**: ao clicar, vira um
  `<input type="number" min="1" max="N">` com `aria-label="Ir para a página"`.
  `Enter` chama `goTo(...)`; `Esc` cancela. Reverte para texto ao confirmar/sair.
- Validar limites (1..N) e respeitar o gate (se o destino estiver bloqueado, abrir
  o gate). Funciona com teclado e em ambos os motores.

**Critérios de aceite:** digitar um número e `Enter` leva à página certa; valores
inválidos são ignorados; foco/aria corretos.

---

## Tarefa 3 — Busca de texto dentro da revista  *(prioridade alta)*

**Objetivo:** busca textual como nos leitores pagos.

**Implementação sugerida:**
- Novo botão "Buscar" na barra → abre um campo de busca (overlay no topo do palco).
- Construir um **índice de texto** com `page.getTextContent()` do PDF.js, página a
  página, **sob demanda na primeira busca** (mostrar progresso discreto; não
  bloquear). Guardar o texto por página em memória (`state`), em minúsculas e sem
  acento (normalizar com `String.prototype.normalize('NFD')`).
- Resultados: lista de páginas com ocorrências + trecho de contexto. Clique navega
  via `goTo(...)`. `Enter`/`Shift+Enter` pula próximo/anterior resultado.
- Realce: ao chegar na página, desenhar um retângulo translúcido sobre os matches
  (use as posições de `getTextContent`/viewport; se for custoso, ao menos rolar/
  destacar a página inteira). Realce é "nice to have"; navegar para a página é o
  mínimo.
- **Gate:** não retornar resultados de páginas bloqueadas (ou exibi-los marcados,
  e o clique abre o gate). Decidir por **não vazar** o conteúdo bloqueado.
- Novo módulo `js/search.js`; importar em `main.js`.

**Critérios de aceite:** buscar um termo conhecido lista as páginas certas e
navega até elas; acentuação/maiúsculas indiferentes; não revela texto bloqueado;
a indexação não trava a UI.

---

## Tarefa 4 — Favicon e ícones do site  *(rápido)*

**Problema atual:** `favicon.ico`, `apple-touch-icon.png` e
`/revista/leitura/favicon.ico` retornam **404** (aparecem no console e deixam a
aba do navegador sem ícone).

**Implementação sugerida:**
- Gerar o conjunto a partir de `imagens/Logo5.svg` (ou `site/biblioteca/Logo6.svg`):
  `favicon.ico` (multi-tamanho), `favicon-32.png`, `favicon-16.png`,
  `apple-touch-icon.png` (180×180), `icon.svg`, e um `site.webmanifest`.
- Colocar na **raiz publicada** (`site/`) e referenciar no `<head>` de **todas** as
  páginas (a navegação/`<head>` é compartilhada — verificar `site/`,
  `site/revista/leitura/index.html`, `site/biblioteca/` e templates de build).
- Garantir que `cleanUrls`/Vercel sirva os arquivos da raiz.

**Critérios de aceite:** nenhum 404 de favicon no console; ícone aparece na aba e
ao salvar na tela inicial (iOS/Android).

---

## Tarefa 5 — Separar o progresso do build StPageFlip do contador de página  *(qualidade)*

**Problema atual:** enquanto o StPageFlip pré-renderiza as 67 páginas em segundo
plano, o indicador exibe **"Preparando página X de 67…"**. Em conexão lenta isso
parece travado, embora o motor CSS já esteja interativo.

**Implementação sugerida:** em `flip-sf.js` (função de build, msg em
`'Preparando página N de…'`), **não** escrever esse progresso no `#indicator` de
página. Em vez disso:
- Manter o `#indicator` mostrando o estado real de leitura (ex.: `Prévia · 3 / 67`)
  servido pelo motor ativo no momento (CSS), e
- Mostrar o progresso do build do StPageFlip como **barra/spinner discreto e
  separado** (ou simplesmente silencioso), trocando para o motor StPageFlip só
  quando o build concluir.

**Critérios de aceite:** durante o pré-render, o contador mostra páginas reais e
navegáveis; a troca para a virada com curvatura é suave; nada fica "preso" em
"Preparando…".

---

## Tarefa 6 — Compartilhar e baixar  *(média)*

**Objetivo:** ações que os leitores pagos oferecem.

**Implementação sugerida:**
- **Compartilhar:** botão que usa a deep-link existente por artigo/página
  (`ARTICLE_SLUGS` / parâmetro de página). Em mobile usar `navigator.share()`;
  no desktop, copiar o link para a área de transferência com confirmação visual.
- **Baixar PDF:** botão opcional, **controlado por `CONFIG`** (ex.:
  `CONFIG.ALLOW_DOWNLOAD`), default desligado — porque `revista.pdf` é servido com
  `Cache-Control: private, no-store` (ver `site/vercel.json`). Só habilitar se o
  Flávio decidir liberar o arquivo.

**Critérios de aceite:** compartilhar gera link que reabre na mesma página; baixar
respeita a flag de configuração.

---

## Tarefa 7 — Carregamento mais leve do PDF  *(opcional / secundária)*

**Contexto:** `revista.pdf` tem ~28 MB; o primeiro quadro depende de baixar boa
parte. PDF.js já usa range-requests quando o servidor permite.

**Sugestões (avaliar custo/benefício, não obrigatório):**
- Confirmar que a Vercel responde `Accept-Ranges: bytes` para `revista.pdf` (range
  streaming → primeira página aparece antes do download completo).
- Alternativa: gerar, no `build.sh`, uma versão **linearizada** do PDF, ou exportar
  páginas como **WebP** otimizado por página para o primeiro paint, mantendo o PDF
  para zoom/qualidade.
- Mostrar progresso de download real (bytes) no loader inicial.

**Critérios de aceite:** tempo até a capa aparecer perceptivelmente menor, sem
regressão de qualidade no zoom.

---

## Como testar
1. Servir localmente: na raiz do projeto, `bash serve.sh` (ou servir `site/` num
   http-server) e abrir `/revista/leitura/`.
2. Verificar em **desktop e mobile** (DevTools responsivo, ≤680px).
3. Checar **console sem erros** (especialmente os 404 de favicon) e o caminho de
   **fallback**: simular falha do CDN do StPageFlip (bloquear `cdn.jsdelivr.net`)
   e confirmar que a virada CSS assume sem quebrar nada.
4. Validar o **gate**: nas tarefas 1–3, garantir que nada do conteúdo bloqueado
   vaza.
5. Acessibilidade: navegar tudo só com teclado; `prefers-reduced-motion` ativo não
   deve animar.

## Ordem sugerida de execução
4 (favicon) → 2 (ir-para-página) → 5 (contador) → 1 (miniaturas) → 3 (busca) →
6 (compartilhar) → 7 (otimização).

## Entrega
- Commits pequenos e descritivos por tarefa.
- Não alterar o pipeline de deploy (`deploy.sh`, `vercel.json`) além do necessário
  para favicon (Tarefa 4).
- Resumo final: o que mudou por arquivo e como testar.
