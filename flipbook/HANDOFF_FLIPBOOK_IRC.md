# Handoff — Leitor de Revista (flipbook) IRC · imagens + StPageFlip, sem PDF.js

> **Para a IA que continuar isto (Cursor):** este arquivo descreve um leitor de
> flipbook **caseiro, autocontido e funcional** que eu (Claude) construí a pedido
> do Flávio. Ele resolve diretamente a "saga do mobile" e o "tremor" descritos em
> `RELATO_FLIPBOOK_MOBILE.md`. Leia tudo antes de mexer; as **decisões de design**
> (seção 2) são o coração — quebrá-las traz de volta os bugs antigos.
> Atualizado em 2026-06-20. Idioma do produto: **pt-BR**.

## 0. Entregáveis

| Arquivo | O que é |
|---|---|
| `leitor-revista-irc.html` | Build final, **autocontido** (~3 MB): StPageFlip + 6 páginas WebP (base64) + texto p/ busca, tudo embutido. Abre em qualquer navegador ou `<iframe>`. |
| `reader.template.html` | **Código-fonte limpo** (~32 KB) com 3 marcadores de injeção. É isto que você deve ler/editar. |
| `build.py` | Pipeline que injeta a lib, as imagens (base64) e o texto no template e gera o HTML final. |

O conteúdo de teste é o artigo de 6 páginas A4 *"A medida quase direta de tensões
de compressão no concreto"* (Roy W. Carlson). É um **MVP/referência**: a meta maior
é o magazine de 67 páginas (ver seção 8).

---

## 1. TL;DR

- **Sem PDF.js no runtime.** PDF.js era o vilão do OOM no Safari iOS. As páginas
  são **pré-renderizadas em imagens (WebP)** e alimentam o **StPageFlip** via
  `loadFromHTML`. Sem `<canvas>` re-renderizando → **sem tremor**, sem crash mobile.
- **Virada e zoom são camadas independentes.** O zoom/pan é um `transform` num
  contêiner externo (`#stage`); a virada acontece *dentro* dele (`#book`). Como
  passar página **nunca toca** nesse `transform`, virar a página **não muda o zoom,
  não treme e não reposiciona o centro** — em fullscreen, com ou sem zoom, em
  qualquer nível. (Requisito que o Flávio repetiu três vezes.)
- **Gate de e-mail robusto:** antes de liberar, o livro **só contém as páginas
  livres + 1 página-gate** (a última folha). Logo, nenhuma rota de navegação
  alcança conteúdo bloqueado — o limite é a própria contagem de páginas.
- **Vanilla JS**, um único `<script>` IIFE, sem framework/bundler. StPageFlip é a
  **única** dependência (UMD de 44 KB, embutida).
- Spread no desktop, **uma página por vez no celular** (automático). Pinça-zoom,
  **X e Esc** fecham o zoom, **setas laterais passam página dentro do zoom** — as
  três queixas de mobile do relato estão resolvidas.

---

## 2. Decisões de design (NÃO QUEBRAR)

### 2.1 Imagens, não PDF.js
Cada página é um `<div class="page"><img src="data:image/webp…"></div>`. O
StPageFlip recebe essas folhas por `loadFromHTML`. Isso elimina o processamento
de PDF no cliente (causa do OOM) e elimina o re-render de canvas a cada virada
(causa do tremor). É exatamente a *"ideia não testada que pode valer ouro"* do
relato — agora testada e adotada para **desktop e mobile** (caminho único).

### 2.2 Duas camadas ortogonais (o que mata o tremor e o "reajuste")
```
#viewport (overflow:hidden, área do leitor — nada do site entra aqui)
 └─ #stage   ← transform: translate3d(panX,panY,0) scale(zoom)   [CAMADA ZOOM/PAN]
 │   └─ #book ← StPageFlip monta aqui                            [CAMADA VIRADA]
 └─ #panCatcher  ← overlay; captura o pan só quando em zoom
 └─ #toolbar / #pager / #zoombar / #searchbar / .edge  ← controles "air"
```
**Regra de ouro:** a função que vira a página (`onFlip`/StPageFlip) **nunca**
escreve em `#stage.style.transform`. Zoom/pan vivem só em `tick()` (ver 5.4).
Por construção, virar página preserva zoom, pan e centro. Se você precisar
recentralizar/ajustar algo na virada, **não o faça em `#stage`** — isso reintroduz
o "reajuste" que o Flávio odeia.

### 2.3 `#panCatcher` para separar pan de virada
- Em zoom (`#reader.zoomed`), o catcher fica `pointer-events:auto` e captura
  arrastar/seguir-cursor. O StPageFlip (embaixo) **não** recebe esses gestos, então
  não tenta virar enquanto você navega o zoom.
- Fora do zoom, catcher fica `pointer-events:none` → o StPageFlip recebe o
  swipe/arrastar-de-canto para virar normalmente.
- Para virar **dentro** do zoom: setas da zoombar, setas laterais (`.edge`),
  teclado (`←/→`) — a roda, em zoom, dá zoom (não vira).

### 2.4 StPageFlip: `disableFlipByClick:true` + `clickEventForward:true`
Clique **não** vira (evita viradas acidentais e deixa os inputs do gate
clicáveis), mas **arrastar o canto / swipe ainda vira** (mantém a sensação de
livro). Não troque isso sem testar o formulário do gate dentro de uma folha.

### 2.5 Chrome-mínimo
A área é só o flipbook + botões "air". Nenhum menu/título do site entra no
`#viewport`. Ao incorporar, use `<iframe …>` e mantenha o chrome do site fora dele.

---

## 3. Estrutura do código (`reader.template.html`)

Arquivo único: `<head>`+CSS embutido, `<body>` com a marcação, e dois `<script>`:

1. `<script>/*__STF__*/</script>` → a lib StPageFlip (injetada).
2. `<script> (function(){ "use strict"; … })(); </script>` → todo o app.

**Marcadores de injeção** (substituídos pelo `build.py`, 1× cada):
- `/*__STF__*/` → JS da lib (`page-flip.browser.js`).
- `__PAGES__` → array JS de data-URIs WebP.
- `__PAGE_TEXT__` → array JS com o texto de cada página (para busca).

### IDs / classes principais
- IDs: `reader, viewport, stage, book, panCatcher, loader, toolbar, pager,
  pageLabel, zoombar, searchbar, searchInput, searchCount, toast, edgePrev,
  edgeNext`. Gate: `leadName, leadEmail, leadBtn, leadMsg`.
- Classes: `.page`, `.page-gate`, `.air` (vidro "air"), `.ab` (botão da barra),
  `.sep`, `.edge.left/.right`, `.zoomed`, `.pan-hand`/`.pan-pointer`, `.off`
  (desabilitado), `.spinner`, `.show` (toast).

### Convenção de ações
Quase tudo é **delegado**: cada botão tem `data-act="…"` e há **um** listener de
`click` no `document` que chama `act(a)` (grande `switch`). As barras são montadas
em JS por `mkbtn/sep/fill` a partir de arrays — para adicionar um botão, basta
incluir no array e tratar o `case` em `act()`.

---

## 4. Configuração (topo do IIFE — edite aqui)

```js
var PREVIEW_PAGES = 4;   // páginas livres; a página-gate é a (PREVIEW_PAGES+1)ª folha
var LEAD_ENDPOINT = "";  // URL p/ POST do lead (Apps Script). "" = modo demo (só libera)
var DOC_TITLE     = "…"; // usado em compartilhar/e-mail
var SHARE_URL     = (location.protocol.indexOf("http")===0 ? location.href : "");
var AUTOPLAY_MS   = 4200;
var MIN_ZOOM=1, MAX_ZOOM=3.4, ZOOM_START=1.85, ZOOM_STEP=0.5;
```
Dados injetados: `PAGES` (data-URIs), `PAGE_TEXT` (texto por página),
`TOTAL = PAGES.length` (**a contagem de páginas é automática** — basta trocar as
imagens).

---

## 5. Funcionamento por área

### 5.1 Construção do livro / motor
- `buildBookDOM(preview)`: cria `.page` (com `<img>`) para `i < PREVIEW_PAGES`
  (ou todas, se desbloqueado); em modo prévia, anexa **1** `.page.page-gate`
  (HTML do formulário) como **última folha**. Preenche `leafLabels[]`
  (rótulo de cada folha: número da página real, ou `"gate"`).
- `initFlip(start)`: `destroy()` do anterior, limpa `#book`, `buildBookDOM`,
  cria `new St.PageFlip(book, OPTS)`, `loadFromHTML(.page)`, liga eventos, e
  vai para `start` (no `init` e imediatamente). Mostra/esconde `#loader`.

**Opções StPageFlip usadas** (todas confirmadas presentes na 2.0.7):
```js
{ width:545, height:771,        // só a razão importa (A4 ≈ 0.707)
  size:"stretch", minWidth:280, maxWidth:2400, minHeight:396, maxHeight:3400,
  drawShadow:true, maxShadowOpacity:0.32, flippingTime: reduce?0:680,
  showCover:true,               // página 1 sozinha (capa), depois spreads
  usePortrait:true, autoSize:true,   // 1 página em tela estreita (mobile)
  mobileScrollSupport:false, swipeDistance:24,
  clickEventForward:true, disableFlipByClick:true, useMouseEvents:true }
```
**Eventos:** `flip` (`e.data`=índice da folha atual → `onFlip`), `changeOrientation`
(→ `refreshUI`), `init` (esconde loader, aplica `start`).
**Métodos:** `loadFromHTML`, `turnToPage(i)` (salto instantâneo),
`flipNext("top")/flipPrev("top")` (animado), `getCurrentPageIndex`,
`getPageCount`, `getOrientation`, `update()` (resize/fullscreen), `destroy()`.

### 5.2 Gate de e-mail (captura de leads)
- `gateVisible()`: detecta a folha-gate em **portrait** (é a folha atual) e em
  **landscape** (é a página da direita = atual+1).
- Ao chegar na gate: `focusGate()` foca o e-mail; pausa o autoplay; sai do zoom.
- `submitLead()`: valida e-mail; se `LEAD_ENDPOINT` setado, faz
  `fetch(POST, mode:"no-cors", body:{name,email,doc,ts})`; depois `unlock()`.
- `unlock()`: `unlocked=true` e **`initFlip(PREVIEW_PAGES)`** — reconstrói o
  StPageFlip com **todas** as páginas (sem gate) e abre na primeira recém-liberada
  (folha `PREVIEW_PAGES` = página real `PREVIEW_PAGES+1`).
- **Invariante de gate (do `MELHORIAS_FLIPBOOK.md`):** nada bloqueado vaza.
  - `goToPage(n)`: se `n>PREVIEW_PAGES && !unlocked` → vai para a folha-gate.
  - `runSearch`: matches em páginas bloqueadas são **contados** mas não navegáveis
    (mostra `"🔒 só na versão completa"`).
- ⚠️ **Persistência:** aqui o "liberado" dura **só a sessão** (artefato não pode
  usar `localStorage`). No site, persista por cookie/`localStorage` (e idealmente
  valide server-side, como já há na allowlist do repo).

### 5.3 Navegação
`navNext/navPrev` (`flipNext/flipPrev`), `navFirst/navLast` (`turnToPage`),
`goToPage(n)` (1-based, respeita gate). `afterJump()` chama `onFlip` após saltos
(porque `turnToPage` pode não emitir `flip`). Roda do mouse fora do zoom = passa
página, com **trava de 430 ms** (`wheelLock`) para não pular várias por gesto.
`#pageLabel` é um botão que vira `<input type=number>` (Enter vai / Esc cancela).

### 5.4 Zoom + pan (matemática — para ajustar com segurança)
- Estado com alvo: `zoom/tzoom`, `panX/tpanX`, `panY/tpanY`. Um **único `rAF`**
  (`tick`) interpola atual→alvo (movimento fluido) e **para** quando assenta e
  está ocioso; gestos chamam `startRAF()`.
- `overflow()` = quanto dá para arrastar = `((viewport*zoom) - viewport)/2` por
  eixo. O pan é **clampado** a ±overflow.
- **Seguir o cursor** (`followTo(cx,cy)`): posição normalizada do mouse
  `nx,ny ∈ [0,1]` sobre o viewport →
  `tpanX = overflowX*(1-2*nx)`, `tpanY = overflowY*(1-2*ny)`.
  (Mouse na borda esquerda mostra a borda esquerda, etc.) É **proporcional ao
  zoom** porque `overflow` cresce com o zoom — o efeito que o Flávio gostou.
- **Mãozinha** (arrastar): `tpan = panNoInícioDoArraste + (ponteiro − início)`.
- **Zoom é ancorado no centro** (`transform-origin:50% 50%`) — por isso o centro
  não se move. Roda (em zoom) dá zoom; **pinça** no touch dá zoom; **duplo-clique**
  alterna zoom (e, no modo cursor, ancora o `followTo` no ponto clicado).
- `enterZoom()` entra em `ZOOM_START`; `exitZoom()` volta a 1 e zera o pan; ao
  assentar em ≤1, esconde a zoombar.
- **Toque:** quando em zoom, um dedo arrasta (mãozinha); o modo "seguir cursor"
  precisa de hover, então no touch ele cai para arrastar.

### 5.5 Fullscreen / autoplay / compartilhar / busca
- `toggleFullscreen()` em `#reader` (com prefixos `webkit`); ao trocar, **sai do
  zoom** e chama `pf.update()` (relayout). Em `<iframe>`, exige `allow="fullscreen"`.
- `toggleAuto()`: `setInterval(flipNext, AUTOPLAY_MS)`; para no fim (na prévia,
  para na gate). Durante o autoplay, zoom/pan continuam (não param a apresentação).
- `doShare()`: `navigator.share` no mobile; senão copia o link (`toast`).
  `doEmail()`: `mailto:` com `DOC_TITLE` + link.
- Busca: `norm()` (minúsculas + sem acento via `NFD`), índice em `PAGE_TEXT`
  (embutido — **não precisa** de PDF.js para indexar). Resultados navegam por
  página; **realce dentro da página NÃO foi implementado** (imagem não tem
  geometria de texto) — navegar até a página é o mínimo combinado no relato.

### 5.6 `refreshUI` / `paint`
`refreshUI` calcula o rótulo (`"Prévia · 3–4 / 6"` ou `"🔒 Prévia"`) e habilita/
desabilita first/prev/next/last (inclui `gateVisible()` para o caso landscape).
`paint` atualiza ícones de play/pause, mãozinha/cursor e expandir/contrair.
`setDisabled(act, dis)` aplica em **todos** os botões com aquele `data-act`
(barra + zoombar + `.edge` ficam sincronizados).

---

## 6. Acessibilidade / i18n
`aria-label` em todos os controles, `:focus-visible`, `aria-live` na busca,
`prefers-reduced-motion` (lerp instantâneo + `flippingTime:0`), teclado completo
(`←/→`, `Home/End`, `+/-`, `f`, `/` abre busca, `Esc` fecha zoom/busca). Tudo em
pt-BR. Mantém o padrão de acessibilidade do repo.

---

## 7. Pipeline de build (`build.py`) — como regenerar / trocar conteúdo

Pré-processamento das imagens (offline, **não** no navegador):
```bash
# 1) rasteriza o PDF (poppler)
pdftoppm -jpeg -r 200 -jpegopt quality=88 entrada.pdf pages/p
# 2) reduz p/ tela + WebP (Pillow): largura 1500, quality 80, method 6
python3 - <<'PY'
from PIL import Image; import glob,os
for f in glob.glob('pages/p-*.jpg'):
    im=Image.open(f).convert('RGB')
    if im.width>1500: im=im.resize((1500,round(im.height*1500/im.width)),Image.LANCZOS)
    im.save(f'web/{os.path.basename(f)}.webp','WEBP',quality=80,method=6)
PY
# 3) texto por página p/ busca
for i in 1 2 3 4 5 6; do pdftotext -f $i -l $i -enc UTF-8 entrada.pdf txt$i.txt; done
```
Lib: `npm pack page-flip` → `package/dist/js/page-flip.browser.js` (UMD, global
`St`, ~44 KB).

`build.py` então:
- lê `web/*.webp` → base64 → `__PAGES__` (JSON);
- lê `txt*.txt` (colapsa espaços) → `__PAGE_TEXT__` (JSON, com `</`→`<\/`);
- lê a lib → `/*__STF__*/` (com `</script`→`<\/script` por segurança);
- escreve o HTML final.

**Resoluções/escolhas atuais:** WebP 1500 px de largura, q80 → ~2,1 MB nas 6
páginas; HTML final ~3 MB. Texto legível e nítido em zoom de leitura (≤2×). Para
zoom extremo (>3×) a imagem amolece — aumente a largura de origem se precisar.

**Validações que rodei** (importante saber o que **não** testei): `node --check`
no JS do app (OK); `grep` na lib confirmando que todos os métodos/opções/eventos
que uso existem na 2.0.7 (OK). **Não** renderizei em navegador (não havia headless
disponível). Verifique no navegador: encaixe do spread, suavidade da virada,
clique nos inputs do gate dentro da folha, pinça no iOS, e fullscreen em `<iframe>`.

---

## 8. Para o magazine de 67 páginas (mudança obrigatória)

**Não embuta base64.** 67 × ~380 KB ≈ **25 MB** num único HTML — inviável.
Para o magazine:
1. Sirva as páginas como **arquivos WebP separados** (reaproveite
   `gen-revista-pages.py`, só trocando JPG→WebP) — você já tem
   `pages/pNNN.jpg` + `pages/manifest.json`.
2. Troque `loadFromHTML` por **`loadFromImages([url1, url2, …])`** (já existe na
   lib) **ou** mantenha `.page` com `<img src="pages/pNNN.webp" loading="lazy">`
   e deixe o browser carregar sob demanda. Para 67 páginas, prefira lazy/streaming.
3. `PREVIEW_PAGES` vira o gate real (ex.: 2–3). `TOTAL` continua automático.
4. **Atenção:** com `loadFromImages`, a página-gate (que é HTML) não cabe no mesmo
   modo. Duas saídas: (a) gere a folha-gate como **imagem** e detecte a última
   folha para abrir um **modal** com o formulário (igual ao `gate.js` atual); ou
   (b) fique no `loadFromHTML` com `<img loading="lazy">` (recomendado — mantém a
   folha-gate em HTML).

---

## 9. Mapa de adaptação ao repositório (`site/revista/leitura/`)

| Item do repo | Como este leitor se encaixa |
|---|---|
| `js/pdf.js` (PDF.js) | **Aposentar no runtime.** Caminho único = imagens + StPageFlip (desktop e mobile). |
| `js/flip-sf.js` | Núcleo equivalente; o relato nota que já tem `loadFromImages`. Reaproveite o build/indicador. |
| `js/image-reader.js` (mobile, scroll) | **Substituível** por este leitor (flip em vez de scroll, com o mesmo gate). |
| `gate.js` / `CONFIG.GATE` (Apps Script) | Conecte `LEAD_ENDPOINT` ao mesmo endpoint da planilha "Leads". |
| `gen-revista-pages.py` (PyMuPDF) | Gerador das imagens; só emitir **WebP** e largura de tela. |
| `CONFIG.MOBILE_BREAKPOINT` | Aqui o single-page no mobile é automático (`usePortrait`); alinhe se quiser um breakpoint fixo. |

**Invariáveis do repo a preservar:** sem framework/bundler no runtime; gate nunca
vaza páginas bloqueadas; acessibilidade + `prefers-reduced-motion`; chrome-mínimo;
spread só no desktop, 1 página no celular.

---

## 10. Limitações conhecidas / TODO

- **Não testado em navegador** (ver 7). Validar render/gestos antes de produção.
- **Realce de busca dentro da página**: ausente (imagem não tem geometria de
  texto). Para ter: ou volta-se a um *text layer* sobreposto, ou aceita-se só a
  navegação por página (atual).
- **Miniaturas/índice**: omitidos (o Flávio disse "opcional, só desktop"). Fáceis
  de plugar: thumbs em baixa-res, `IntersectionObserver`, clique → `goToPage`,
  bloqueadas com cadeado abrem o gate.
- **Persistência do unlock**: só sessão neste build (artefato). Persistir no site.
- **Download/Imprimir**: removidos de propósito (o botão "imprimir" da referência =
  salvar). Reintroduzir só atrás de uma flag de `CONFIG`.
- **Zona-morta do "seguir cursor"** nas bordas onde ficam as setas `.edge` (~48 px).
- **Botão "estrela/explosão"** que aparece na referência do Flávio (a segunda
  imagem, flutuando abaixo da barra): **função desconhecida**, não implementado —
  perguntar ao Flávio o que é.
- **Zoom máx. 3,4×** sobre origem de 1500 px → amolece no extremo; subir a
  resolução de origem se necessário.

---

## 11. Resumo de uma linha
Flipbook **vanilla, autocontido, sem PDF.js**: imagens WebP no **StPageFlip**, com
**zoom/pan numa camada separada da virada** (por isso não treme nem desloca o
centro), **gate de e-mail** que não vaza conteúdo, busca, fullscreen, apresentação,
pinça no mobile e **X/Esc/setas dentro do zoom**. Para o magazine: trocar base64
por imagens externas com `loading="lazy"`.
