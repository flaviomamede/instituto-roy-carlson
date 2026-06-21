# Relato — Leitor da Revista (flipbook) e a saga do mobile

> Mapa para retomar com cabeça fria. Registra o que foi tentado, **o que falhou
> e por quê**, a experiência que o Flávio quer, e o que dá para **reaproveitar**
> ao integrar um projeto open-source de flipbook. Atualizado em 2026-06-20.

## TL;DR
- **PDF.js estoura a memória do Safari no iOS** — a capa nem chega a aparecer. É o
  vilão central. Reduzir o tamanho do PDF **não resolve**.
- O que funciona no celular é **imagem + página única/scroll** (sem PDF.js).
- O **leitor precisa ser chrome-mínimo** (sem o menu do site dividindo a tela).
- Decisão do Flávio: **não** usar ferramenta paga (Heyzine/FlipHTML5/Publuu);
  **adotar um projeto open-source** e reaproveitar código.

## ✅ Desfecho (2026-06-21) — leitor novo no ar para teste
Adotamos um **flipbook que outro Claude escreveu** (`flipbook/reader.template.html`):
**StPageFlip alimentado por imagens** (`loadFromHTML` com `<img loading="lazy">`),
**sem PDF.js**. Adaptado às 67 páginas da Revista via `site/scripts/build-flip.py`
(troca os marcadores do template pelas imagens reais + texto do PDF para a busca).

**Rota de teste publicada:** `/revista/leitura/flip/`
(`https://institutoroycarlson.org/revista/leitura/flip/`).

> ⚠️ O `reader.template.html` **não abre sozinho** — é um template com marcadores
> (`__PAGES__`, `__PAGE_TEXT__`, `<script>/*__STF__*/</script>`). Quem roda é o
> **gerado** `site/revista/leitura/flip/index.html` (ou a URL acima). Abrir o
> template direto trava o navegador.

### Quatro defeitos encontrados e corrigidos no template
1. **Livro vazia ao desbloquear o gate.** O StPageFlip transforma o próprio `#book`
   em `.stf__parent` e o `destroy()` **remove o `#book` do DOM** — a remontagem caía
   num nó destacado. Correção: **recriar um `#book` fresco dentro do `#stage` a cada
   `initFlip`**.
2. **Nada virava no celular.** Em *portrait* (página única), `flipNext("top")` é
   no-op. Correção: canto **`"bottom"` em portrait, `"top"` em landscape** (`flipCorner()`).
3. **Não voltava a página.** `flipPrev` não anima nesta versão (2.0.7) em nenhuma
   orientação. Correção: **`turnToPrevPage()`** (volta animando, nas duas).
4. **Barra de busca sempre visível.** `.air{display:flex}` vencia o atributo
   `[hidden]`. Correção: **`.air[hidden]{display:none}`**.

As correções foram para o **template** e o `build-flip.py` entrou no `build.sh`, então
deploys futuros regeneram o leitor sozinhos.

### Verificado (headless Chrome — iPhone 13 e desktop)
- **Sem PDF.js**; só imagens lazy: prévia carrega **2** imagens, pós-unlock **5**, e vai
  carregando ao virar (era exatamente o PDF.js que estourava a memória do iOS).
- Gate de e-mail → desbloqueia as **67 páginas**; virar **pra frente e pra trás** nas
  duas orientações, **zero erros**.
- **Zoom de verdade** (1.85×) e **flip dentro do zoom pela seta lateral mantendo a escala
  exata** — os dois requisitos que o Flávio fez questão.
- **Busca** funcionando ("concreto" → 28 ocorrências). Página única no celular, spread no
  desktop.

**Falta o teste real:** Safari do iPhone (o OOM era específico do iOS, não dá para simular
aqui). Se aprovado, o próximo passo é **trocar o leitor principal** (`/revista/leitura`) por
este e fiar a persistência do lead (cookie/localStorage + allowlist no servidor).

### Arquivos do leitor novo
- `flipbook/reader.template.html` — template (StPageFlip + gate + zoom); **não roda direto**.
- `flipbook/HANDOFF_FLIPBOOK_IRC.md` — spec detalhada do template.
- `site/scripts/build-flip.py` — gera `flip/index.html` (imagens lazy + texto p/ busca + gate).
- `site/revista/leitura/flip/index.html` — **o leitor que roda** (gerado).
- `site/revista/leitura/flip/page-flip.browser.min.js` — StPageFlip 2.0.7 (local).

## Estado atual do código (o que está no ar)
Leitor em `site/revista/leitura/` (JS vanilla, ES Modules):
- **Desktop:** flipbook com PDF.js + **StPageFlip** (virada com curvatura). Funciona bem.
- **Mobile/toque (`LOW_MEM`):** **leitor de imagens** (`js/image-reader.js`) — scroll
  vertical de páginas em imagem (`pages/pNNN.jpg`), sob demanda, **sem PDF.js**,
  com o gate de e-mail. Abre no iPhone, mas a UX ainda é “ler PDF rolando”, não a
  experiência de flip que o Flávio quer.
- **Navegação:** menu vira **hambúrguer** no celular (`site/js/site-nav.js`).

## A saga do mobile — tentativas e lições
1. **Aliviar o motor de virada** (`LOW_MEM`: não carregar StPageFlip, menos prefetch,
   menor resolução de render). → **Insuficiente.** Ainda travava.
2. **PDF leve** (`revista-mobile.pdf`, ~6 MB / 100 DPI, em vez dos 28 MB / 300 DPI). →
   **Insuficiente.** O problema não é o tamanho do arquivo.
3. **Diagnóstico conclusivo (teste do Flávio):** o `revista-mobile.pdf` **abre normal**
   no visualizador nativo do Safari, mas no flipbook a **capa nem aparece, tela branca,
   trava** → quem estoura a memória é o **PDF.js**, ao carregar/processar, antes de
   desenhar qualquer página.
4. **Leitor de imagens** (sem PDF.js): scroll de `pages/*.jpg` sob demanda. → **Abriu
   no iPhone.** Mas surgiram as queixas de UX abaixo.

### Queixas de UX que ficaram (no celular)
- O **menu do site** ocupava metade/2/3 da tela. → corrigido com **hambúrguer**, mas o
  leitor ainda não é “tela cheia de leitura”.
- **Página dupla** (spread) fica minúscula no celular; pior na horizontal.
- A **virada treme** ao passar a página (re-render de canvas no PDF.js).
- No **modo Zoom** do flipbook: no celular **não aparece o “x” de fechar nem Esc**, e
  **não há flip dentro do zoom**.

## Lições (causa raiz destilada)
- **PDF.js + iOS = OOM.** Não escala para um magazine pesado. Evitar no caminho mobile.
- PDF de **28 MB / 300 DPI** (67 páginas, cada uma uma imagem 2490×3518) é qualidade de
  impressão — exagero para tela.
- **Imagens + página única/scroll** é o padrão que funciona no celular (Issuu etc.).
- O **leitor tem que ser chrome-mínimo** (no máximo “← voltar” + título). Sem nav do site.
- **Spread só no desktop**; **uma página por vez no celular**.
- **Ideia não testada que pode valer ouro:** alimentar o **StPageFlip com imagens**
  (`loadFromImages`), **sem PDF.js**. Manteria a virada e tiraria o vilão da memória.
  Não chegamos a testar — vale experimentar antes de descartar a virada no mobile.

## A experiência que o Flávio quer (na voz dele — não perder isto)
Ele disse que não consegue especificar 100%, mas o essencial é:
- **Zoom de verdade** (“zoom com zoom”): mergulhar no texto, nas imagens e nos gráficos.
- **Fechar o zoom** com botão **“x”** e com **Esc** (faltam no mobile hoje).
- **Setas laterais (“>” / “<”)** para **passar de página dentro do zoom**, sem precisar
  voltar o zoom.
- **Virada (flip)** que funcione no celular **sem tremer**.
- **Gate de e-mail** (captura de leads) — **não** entregar o PDF cru quando compartilham.
- Já teve uma experiência de flipbook assim e gostou; é a referência de qualidade.

## O que dá para reaproveitar (já pronto no repo)
- **Imagens das páginas:** `site/revista/leitura/pages/pNNN.jpg` (67, 1080 px) +
  `pages/manifest.json`. Gerador: `site/scripts/gen-revista-pages.py` (PyMuPDF).
- **Leitor de imagens base + gate:** `site/revista/leitura/js/image-reader.js`.
- **Gate de e-mail (leads):** `CONFIG.GATE` em `js/config.js` (endpoint Apps Script →
  planilha “Leads”; ver também o gate do flip em `js/gate.js`).
- **Build:** `site/build.sh` já gera `revista-mobile.pdf` e as imagens das páginas.
- **Detecção de aparelho:** `LOW_MEM` em `js/config.js` (toque/pointer coarse).
- Flipbook desktop (PDF.js + StPageFlip) — referência do efeito desejado.

## Caminhos avaliados
- **Ferramentas maduras pagas** (Heyzine, FlipHTML5, Publuu): fariam zoom-com-flip,
  mobile e captura de leads de fábrica. **Descartado** — Flávio quer gratuito/open-source.
- **Open-source a integrar (a decidir):** alimentar com as imagens já geradas, embutir o
  gate de e-mail, e manter o leitor **tela cheia / chrome-mínimo**. Avaliar suporte a
  zoom-com-zoom + setas laterais no zoom + página única no celular.

## Arquivos-chave
- `site/revista/leitura/index.html` — página do leitor (CSS inline + chrome).
- `site/revista/leitura/js/main.js` — bootstrap (escolhe flipbook vs leitor de imagens).
- `site/revista/leitura/js/image-reader.js` — leitor mobile (imagens + gate).
- `site/revista/leitura/js/flip-sf.js` — StPageFlip (tem `loadFromImages`).
- `site/revista/leitura/js/config.js` — `CONFIG`, `LOW_MEM`, `CONFIG.GATE`.
- `site/scripts/gen-revista-pages.py` — gera as imagens das páginas.
- `site/js/site-nav.js` — hambúrguer mobile.

---

## Apêndice — linha do tempo do projeto (contexto amplo)
Tudo no ar em `institutoroycarlson.org` (Vercel; deploy **só** via `site/deploy.sh` —
a integração Git foi desconectada porque `git push` disparava deploys quebrados).

- **Avaliação inicial** do flipbook e da Biblioteca; specs de melhoria escritas.
- **Flipbook:** modularização + miniaturas, busca, ir-para-página, share; **correção do
  realce de busca** no StPageFlip (overlay por geometria do render).
- **Biblioteca — segurança:** login server-side (cookie HMAC), allowlist fora do site;
  achada e **fechada uma exposição grave** (a Vercel servia `/api/_data/...` estático).
- **Acervo:** importados 50 docs (livros “Marcelo Protz” + papers do Dr. Carlson).
- **Vercel Blob:** PDFs exclusivos migrados para Blob privado (a função estourava 250 MB);
  `api/file` transmite com `get(..., {access:'private'})`.
- **Assinatura:** página de planos + Pix (QR/copia-e-cola), gate por Apps Script
  (planilha “Leads” + e-mail de assinatura/fundador), validade na allowlist.
- **Página Sobre:** comparador “descortinar” (foto Carlson antes/depois), carrossel de
  homenageados, Conselho Editorial, Lições (esqueleto). Login na nav; expediente corrigido.
- **Mobile do flipbook:** esta saga (ver acima).

Avisos: repo é **público** — nunca versionar allowlist, PDFs privados nem `/biblioteca/`.
Recuperação de domínio: `npx vercel promote <deploy-Ready> --scope flavio-mamede-pereira-gomes-projects --yes`.
