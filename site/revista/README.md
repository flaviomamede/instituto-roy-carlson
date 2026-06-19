# Repositório web — Revista IRC

Seção estática do periódico para ISSN/DOI. A **leitura integral** é pelo flipbook (`leitura/`), com captura de e-mail — não há link público de download do PDF.

## Estrutura

```
site/revista/
├── index.html
├── apresentacao.html
├── expediente.html
├── normas-publicacao.html
├── revista.css
├── leitura/
│   ├── index.html      # Flipbook (gate de e-mail)
│   └── revista.pdf     # Só para o flipbook (sem link no site)
└── edicoes/
    └── v1n1/
        ├── index.html
        └── artigos/
```

## Deploy (Vercel)

1. No projeto Vercel, defina **Root Directory** = `site`
2. O `vercel.json` copia o PDF no build: `revista/revista_piloto001_FINAL.pdf` → `revista/leitura/revista.pdf`
3. URL provisória: `https://instituto-roy-carlson.vercel.app/revista/`
4. Depois: `institutoroycarlson.com` ou `roycarlsoninstitute.com`

## Leads (Google Sheets)

- Planilha: [Leads IRC](https://docs.google.com/spreadsheets/d/1KJN372VysUkxqUWBDVAdHCDRV9Na84CpDezAp1f4fMU/edit)
- Script: `revista/leads-google-apps-script.gs`
- Endpoint no flipbook: `CONFIG.GATE.endpoint`

**Diagnóstico:** abra a URL `/exec` no navegador. Deve retornar JSON com `ok: true` e `rows`. Se `ok: false`, reimplante o Apps Script e autorize acesso à planilha.

## Teste local

```bash
cd site/revista/leitura
cp ../../../revista/revista_piloto001_FINAL.pdf revista.pdf
python3 -m http.server 8080
```

Ver `revista/CHECKLIST_DOI_ISSN.md` para ISSN e Crossref.
