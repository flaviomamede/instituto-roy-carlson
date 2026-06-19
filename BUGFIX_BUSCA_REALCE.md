# Bugfix — Realce da busca desalinhado no modo de virada (StPageFlip)

> Prompt focado para o Cursor. Diagnóstico confirmado por reprodução em navegador
> real (headless) no site publicado. Afeta **só** o realce no modo de virada com
> curvatura (StPageFlip); no **Zoom** funciona, e no fallback **CSS** também.

## Diagnóstico (causa raiz — confirmada)

O leitor usa **StPageFlip 2.0.7 via `loadFromImages`** (`site/revista/leitura/js/flip-sf.js`).
Nessa configuração, a biblioteca **renderiza o livro inteiro num único `<canvas>`** —
**não existem `<img>` nem `<canvas>` por página** dentro de `#flipWrap`.

Evidência (DOM real, após o StPageFlip montar):
```
#flipWrap → imgs: 0 | canvases: 1 | .stf__item: 0   (usesCanvasRender = true)
```

O código de realce em `site/revista/leitura/js/search-highlight.js` assume que cada
página é um elemento DOM próprio:

- `burnHighlightsIntoSfImage(pageIndex)` faz `querySelectorAll('img')[pageIndex]` →
  como há **0 imgs**, retorna `false` (caminho morto).
- O fallback `paintSfPageHighlights` chama `findSfPageEl(pageIndex)`, que procura
  `img`/`canvas`/`.stf__item` por página. Resultado:
  - **Páginas ≥ 1:** `canvases.length (1) > pageIndex` é falso → retorna `null` →
    **nenhum realce é pintado**.
  - **Página 0 (capa):** retorna o **canvas do livro inteiro** e posiciona as marcas
    como porcentagem do *viewport de uma página* dentro da caixa de *duas páginas* →
    **realce no lugar errado**.

Por isso o Zoom acerta (renderiza um canvas fresco por página e desenha o realce
nele, 1:1) e o modo de virada erra/some. **O cálculo dos retângulos
(`computeHighlightRects`/`itemRectForRange`) está correto** — o defeito é só onde/como
o overlay é posicionado no StPageFlip.

## Correção

Reescrever o caminho de realce do StPageFlip em `search-highlight.js` para **não
depender de elementos por página** (eles não existem). Em vez disso, posicionar um
overlay usando a **geometria que a própria StPageFlip expõe**:

- `state.sf.getRender().getRect()` → `{ left, top, width, height, pageWidth }` em
  pixels CSS da área de desenho (o canvas preenche `#flipWrap`).
- `state.sf.getOrientation()` → `'portrait'` | `'landscape'`.

### Passos

1. **Rect da área do livro na tela:** pegar o `<canvas>` de `#flipWrap`
   (`el.flipWrap.querySelector('canvas')`) e seu `getBoundingClientRect()` (`canvasR`).
   A geometria de `getRect()` já está no mesmo espaço de pixels CSS do canvas, então a
   posição na tela de um ponto `(x,y)` do render é `canvasR.left + x`, `canvasR.top + y`
   (validar a escala: se `canvas.clientWidth !== rect.width` do render, aplicar
   `sx = canvasR.width / canvas.clientWidth`).

2. **Retângulo de cada página visível** (usar `sfVisibleIndices()` para saber quais
   índices estão à mostra):
   - Sejam `R = getRender().getRect()` e `pw = R.pageWidth`.
   - **Portrait / página única (capa/contracapa):** a página ocupa
     `{ left: R.left, top: R.top, width: pw, height: R.height }`.
   - **Landscape (spread de 2 páginas):** página **esquerda** (índice-líder) =
     `{ left: R.left, top: R.top, width: pw, height: R.height }`; página **direita**
     (líder+1) = `{ left: R.left + pw, top: R.top, width: pw, height: R.height }`.
   - Tratar capa (índice 0) e contracapa como **página única** (como `sfRefreshUI` já
     faz com "Capa"/"Contracapa"), mapeando para o lado correto que a StPageFlip
     mostra (com `showCover: true`).

3. **Pintar as marcas:** para cada página visível, criar uma camada
   `position:fixed` no rect de tela calculado (passo 1+2) e adicionar as marcas
   (`.search-hl-mark`) com `left/top/width/height` em **porcentagem do viewport de
   uma página** (`r.left / viewport.width * 100%`, etc.) — exatamente como
   `paintSfPageHighlights` já faz, mas agora sobre o rect **correto da página**, não
   sobre o canvas inteiro.

4. **Remover/aposentar** o caminho morto `burnHighlightsIntoSfImage` (e
   `sfOrigSrc`/`restoreSfImages`, que dependem de `<img>` inexistentes) e o
   `findSfPageEl` baseado em elementos por página. Manter `removeSfOverlay()` e o
   `getSfHlRoot()` (a camada `position:fixed` global).

5. **Reposicionar nos eventos certos** (já existe parte): repintar em `flip` (fim da
   virada — já há `scheduleSearchHighlights()` em `flip-sf.js`), em `resize`, e nos
   re-paints com atraso de `search.js` (`repaintHighlights` 180/520ms). Não pintar
   durante a animação (só no estado de repouso).

> Observação: `getRect()` cobre capa/contracapa e portrait automaticamente porque
> `pageWidth` reflete a largura real da página renderizada. Se `getRender()` não
> estiver acessível em alguma versão, usar fallback geométrico: `canvasR` dividido em
> metades (landscape) ou cheio (portrait), detectando spread único via
> `getOrientation()` + índice de capa/contracapa.

## Critérios de aceite
- Buscar um termo comum (ex.: "concreto"), ir a um resultado **em página interna** no
  modo de virada: o realce amarelo cai **sobre a palavra**, tanto na página esquerda
  quanto na direita do spread, em desktop (landscape) e celular (portrait).
- Capa/contracapa: se houver ocorrência, o realce fica na página certa, não deslocado.
- Ao virar a página, os realces se reposicionam corretamente; ao redimensionar a
  janela, idem.
- Zoom continua funcionando como hoje (não regredir).

## Como testar (reprodução usada no diagnóstico)
- Abrir com o gate desligado para varrer o documento inteiro:
  `…/revista/leitura/index.html?pdf=/revista/leitura/revista.pdf`
- Esperar o `#stage` ganhar a classe `sf-mode` (StPageFlip montado).
- Abrir Busca (`#searchBtn`), digitar "concreto", **Enter** para ir ao 1º resultado,
  e conferir o alinhamento do realce sobre a palavra.
- Repetir avançando páginas (esquerda e direita do spread) e em viewport mobile.
- *Checagem extra (não é o foco, mas validar):* ao clicar/Enter num resultado, a
  virada deve **navegar até a página** do resultado (no teste manual o indicador
  ficou em "Capa" — confirmar que `goTo(target)` move o StPageFlip via `turnToPage`).

## Arquivos
- Principal: `site/revista/leitura/js/search-highlight.js` (reescrita do caminho SF).
- Referência (não mexer): `flip-sf.js` (geometria/eventos), `zoom.js` (caminho que já
  funciona), `search.js` (orquestra os re-paints).
