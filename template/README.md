# Template de artigos — Revista Concreto

Pipeline para reproduzir o layout do Word piloto (*Carlson — Medição de tensões em concreto*) e gerar PDF a partir de Markdown + figuras.

## Estrutura

```
template/
├── assets/              # RC.png, Logo6.jpeg (cabeçalho)
├── article.template.html
├── article.css
├── build-article.py     # meta.json + artigo.md → HTML + PDF
├── serve-submissao.py   # recebe o formulário do site (local)
└── artigos/
    └── 001-carlson-medicao-tensoes/
        ├── meta.json
        ├── artigo.md
        ├── figuras/
        └── saida/
            ├── artigo.html
            └── artigo.pdf
```

## Protótipo

O artigo **001** é a palestra de Roy W. Carlson traduzida por Vladimir Antonio Paulón e revisada por Flávio M. P. Gomes — mesmo conteúdo do `.docx` na pasta.

## Gerar PDF (manual)

```bash
cd template
python3 build-article.py artigos/001-carlson-medicao-tensoes
# ou todos:
python3 build-article.py --all
```

Requisitos: `pandoc`, Chrome/Chromium (`google-chrome --headless`), opcional `PyMuPDF` para contar páginas.

## Formulário no site

Página: `site/revista/submissao/`

1. Autor preenche metadados, envia `artigo.md` e `figuras.zip`.
2. Com o servidor local ativo, o POST cria `artigos/NNN-slug/`, aplica o template e gera o PDF.

```bash
cd template
python3 serve-submissao.py
# Em outro terminal, sirva o site em localhost e abra /revista/submissao/
```

## Formato do Markdown

- Seções com `## Título da seção`
- Ênfase com `*itálico*`
- Figuras: `![legenda](figuras/arquivo.png)` — os arquivos devem estar no `.zip` ou em `figuras/`

## meta.json

Campos principais: `titulo`, `autores` (lista com `nome` e `papel`), datas, `sumario`, `palavras_chave`, `volume`, `numero`, `ano`, `paginas`.

## Próximos passos

- Cabeçalho/rodapé corrido com numeração em todas as páginas (CSS Paged Media ou pós-processamento)
- API em produção (Vercel Blob + fila de build)
- Legendas automáticas a partir do alt das imagens

## Versionamento (git)

O repositório é **público**, então versionamos apenas a **ferramenta** (código,
template, CSS, assets de cabeçalho e este README). **Não** entram no git:

- `artigos/` — conteúdo e saídas dos artigos (material do Dr. Carlson, sujeito a
  direitos; mantido **local**);
- `_docx-media/`, `*.docx`, `**/saida/`, `**/figuras.zip` — fontes pesadas e
  arquivos gerados, reproduzíveis pelo pipeline.

Para reprocessar um artigo, coloque-o em `artigos/NNN-slug/` (meta.json + artigo.md
+ figuras) e rode `python3 build-article.py artigos/NNN-slug`.
