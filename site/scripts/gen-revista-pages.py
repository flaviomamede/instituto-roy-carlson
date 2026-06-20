#!/usr/bin/env python3
"""Renderiza as páginas de revista.pdf como JPEG para o leitor de imagens (iOS).

O Safari no iPhone estoura a memória ao abrir o PDF via PDF.js; no celular o
leitor mostra estas imagens (carregadas sob demanda). Saída em
site/revista/leitura/pages/ (p001.jpg … + manifest.json).
"""
import json
import os

import fitz  # PyMuPDF

SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(SITE, "revista", "leitura", "revista.pdf")
OUT = os.path.join(SITE, "revista", "leitura", "pages")
TARGET_W = 1080  # largura boa para iPhone retina, leve

os.makedirs(OUT, exist_ok=True)
doc = fitz.open(SRC)
w = h = 0
for i, page in enumerate(doc, 1):
    scale = TARGET_W / page.rect.width
    pix = page.get_pixmap(matrix=fitz.Matrix(scale, scale))
    pix.pil_save(os.path.join(OUT, f"p{i:03d}.jpg"), format="JPEG", quality=80, optimize=True)
    w, h = pix.width, pix.height

with open(os.path.join(OUT, "manifest.json"), "w", encoding="utf-8") as f:
    json.dump({"count": doc.page_count, "w": w, "h": h}, f)

print(f"→ Revista (imagens): {doc.page_count} páginas {w}x{h} em pages/")
