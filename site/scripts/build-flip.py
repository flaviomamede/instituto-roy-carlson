#!/usr/bin/env python3
"""Gera o leitor flipbook do magazine (site/revista/leitura/flip/index.html) a
partir do template reader.template.html do Claude — imagens externas lazy (sem
PDF.js), texto do PDF para busca, e o gate ligado ao Apps Script.

Reusa as imagens já geradas em site/revista/leitura/pages/ (pNNN.jpg).
"""
import json
import os
import re

import fitz  # PyMuPDF

SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEMPLATE = os.path.join(SITE, "..", "flipbook", "reader.template.html")
PDF = os.path.join(SITE, "revista", "leitura", "revista.pdf")
PAGES_DIR = os.path.join(SITE, "revista", "leitura", "pages")
OUT = os.path.join(SITE, "revista", "leitura", "flip", "index.html")

PREVIEW_PAGES = 4
LEAD_ENDPOINT = "https://script.google.com/macros/s/AKfycbxNl-alO6cSr3wGn0r1EgTnP7Cx7035YRIrVv5ZeCM4kYXFgOxh4hd1fV1JqzUbfH5S/exec"
DOC_TITLE = "Revista IRC — Vol. 1, No. 1"

# contagem e texto por página
doc = fitz.open(PDF)
n = doc.page_count
pages = [f"/revista/leitura/pages/p{i:03d}.jpg" for i in range(1, n + 1)]
text = []
for p in doc:
    t = re.sub(r"\s+", " ", p.get_text() or "").strip()
    text.append(t)

assert all(os.path.exists(os.path.join(PAGES_DIR, f"p{i:03d}.jpg")) for i in range(1, n + 1)), \
    "faltam imagens em pages/"

html = open(TEMPLATE, encoding="utf-8").read()

# 1) lib StPageFlip: EMBUTIDA no HTML (não como <script src> externo).
# Um arquivo .js separado pode ser bloqueado por content-blocker/Private Relay/
# filtro de rede no aparelho (foi o que derrubou no iPhone real: a tag carregava
# erro). Embutida, ela vem junto com o HTML que já carregou — nada a bloquear.
LIB = os.path.join(PAGES_DIR, "..", "flip", "page-flip.browser.min.js")
lib_js = open(LIB, encoding="utf-8").read().replace("</script", "<\\/script")
html = html.replace('<script>/*__STF__*/</script>',
                    '<script>\n' + lib_js + '\n</script>')

# 2) dados
html = html.replace('var PAGES = __PAGES__;',
                    'var PAGES = ' + json.dumps(pages, ensure_ascii=False) + ';')
html = html.replace('var PAGE_TEXT = __PAGE_TEXT__;',
                    'var PAGE_TEXT = ' + json.dumps(text, ensure_ascii=False).replace('</', '<\\/') + ';')

# 3) config
html = html.replace('var PREVIEW_PAGES = 4;', f'var PREVIEW_PAGES = {PREVIEW_PAGES};')
html = html.replace('var LEAD_ENDPOINT = "";', f'var LEAD_ENDPOINT = "{LEAD_ENDPOINT}";')
html = re.sub(r'var DOC_TITLE     = "[^"]*";', f'var DOC_TITLE     = "{DOC_TITLE}";', html)

# 4) imagens externas com loading lazy (as 2 primeiras eager p/ a capa aparecer já)
html = html.replace(
    'img.src=PAGES[i]; img.alt="Página "+(i+1); img.setAttribute("draggable","false");',
    'img.src=PAGES[i]; img.alt="Página "+(i+1); img.setAttribute("draggable","false");'
    ' img.loading=(i<2?"eager":"lazy"); img.decoding="async";'
)

os.makedirs(os.path.dirname(OUT), exist_ok=True)
open(OUT, "w", encoding="utf-8").write(html)

txt_chars = sum(len(t) for t in text)
print(f"→ flip/index.html gerado: {n} páginas, texto p/ busca: {txt_chars} chars "
      f"({'há texto' if txt_chars > 200 else 'PDF é só imagem — busca vazia'})")
print(f"  HTML: {os.path.getsize(OUT)/1024:.0f} KB")
