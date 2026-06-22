# Template de artigos — Revista IRC

Pipeline editorial: reproduz o layout do Word piloto e gera **HTML + PDF** a partir de
Markdown e anexos (figuras, tabelas, gráficos).

## Pipeline (não usa LaTeX)

```
artigo.md  →  pré-processamento (tabelas CSV → HTML)
          →  Pandoc (Markdown + equações TeX → HTML, MathJax)
          →  article.template.html + article.css
          →  Chrome headless → artigo.pdf
```

**Não há** geração de `.tex` intermediário. O autor escreve em **Markdown**; equações em
**LaTeX inline** no próprio `.md` (`$...$` ou `$$...$$`). No PDF, fórmulas complexas podem
precisar de ajuste manual — ou o autor envia a equação como **figura** em `figuras/`.

## Estrutura de um artigo

```
artigos/NNN-slug/
├── meta.json
├── artigo.md
├── figuras/      ← fotos e ilustrações (zip opcional)
├── tabelas/      ← um .csv por tabela (zip opcional)
├── graficos/     ← imagem do gráfico + .csv dos dados (zip opcional)
└── saida/
    ├── artigo.html
    └── artigo.pdf
```

## Formato do Markdown

| Tipo | Sintaxe no `.md` | Anexo |
|------|------------------|--------|
| Seção | `## Título` | — |
| Figura | `![legenda](figuras/foto.png)` | `figuras.zip` |
| Tabela | `![legenda](tabelas/dados.csv)` | `tabelas.zip` |
| Gráfico | `![legenda](graficos/ensaio.png)` | `graficos.zip` (PNG + CSV opcional) |
| Equação | `$E=mc^2$` ou `$$ ... $$` | no próprio `.md` |

### Tabelas

Cada tabela é um **CSV** (vírgula ou ponto-e-vírgula; primeira linha = cabeçalho). No texto:

```markdown
![Tabela 1 — Resultados do ensaio](tabelas/resultados-ensaio.csv)
```

### Gráficos

Sem regra automática de plotagem: o autor envia a **imagem** que deve aparecer no artigo e,
se quiser, um **CSV** com os dados para referência da redação. Você ajusta o gráfico final
manualmente quando necessário.

```markdown
![Figura 3 — Tensão axial vs. tempo](graficos/tensao-axial.png)
```

Arquivos sugeridos no `graficos.zip`: `tensao-axial.png`, `tensao-axial-dados.csv`.

## Gerar PDF (manual)

```bash
cd template
python3 build-article.py artigos/001-carlson-medicao-tensoes
python3 build-article.py --all
```

Requisitos: `pandoc`, Chrome/Chromium, opcional `PyMuPDF` para contar páginas.

## Formulário no site

`site/revista/submissao/` — em produção (fase de testes) direciona ao editor; em
**localhost** com `serve-submissao.py` ativo, aceita os três zips e gera o PDF.

```bash
cd template && python3 serve-submissao.py
```

## meta.json

`titulo`, `autores`, datas, `sumario`, `palavras_chave`, `volume`, `numero`, `mes_ano`, `paginas`.

## Versionamento (git)

Versionamos a **ferramenta** (código, template, CSS). Conteúdo de `artigos/` e saídas
geradas ficam em geral **fora** do git público.
