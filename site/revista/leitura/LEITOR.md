# Leitor flipbook — Revista IRC

Build atual: **2026-06-19-v3** (PDF `revista_piloto001_FINAL_V3.pdf`, 67 páginas)

## Arquitetura

```
index.html          → HTML + CSS
js/main.js          → bootstrap
js/flip-controller  → API única de navegação
js/flip-css.js      → virada rápida (boot)
js/flip-sf.js       → StPageFlip (efeito livro, upgrade em background)
js/viewport.js      → BookViewport (zoom ancorado na revista)
js/zoom.js          → lightbox em alta resolução
js/gate.js          → prévia + captura de e-mail
js/pdf.js           → PDF.js 3.x local + cache de render
```

## Requisitos

| Área | Comportamento |
|------|----------------|
| Abertura | CSS imediato; StPageFlip em background (indicador “Preparando página X/67”) |
| Virada | Efeito livro (arraste canto); clique esquerda/direita; ← → |
| Zoom | Botão ou `Z`; revista centrada; pan limitado; virar mantém zoom e recentraliza |
| Gate | Prévia até fim da dupla do índice (`indexPage: 2`); Apps Script |
| Mobile | PDF.js UMD 3.11; modo leitura (`F`) no iOS |
| Deep links | `?artigo=slug`, `?page=N` — ver `ARTICLE_SLUGS` em `js/config.js` |

## Atualizar PDF

1. Colocar PDF em `revista/revista_piloto001_FINAL_V*.pdf`
2. `site/build.sh` copia V3 → `revista/leitura/revista.pdf`
3. Conferir `ARTICLE_SLUGS` se paginação mudou
4. `./deploy.sh`

## Checklist de teste

- [ ] Abrir `/revista/leitura/` — capa rápida, depois efeito livro
- [ ] Clique direita/esquerda e arraste canto
- [ ] Zoom: ampliar, arrastar, virar página (zoom mantido, revista centrada)
- [ ] Gate após índice; e-mail libera continuação
- [ ] `?artigo=roy-carlson-reminiscencias`
- [ ] Celular Safari / Android
- [ ] Rodapé mostra build `2026-06-19-v3`
