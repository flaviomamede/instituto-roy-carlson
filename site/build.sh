#!/usr/bin/env bash
set -euo pipefail
SRC_V3="../revista/revista_piloto001_FINAL_V3.pdf"
SRC_V2="../revista/revista_piloto001_FINAL_V2.pdf"
SRC_V1="../revista/revista_piloto001_FINAL.pdf"
DST="revista/leitura/revista.pdf"
if [ -f "$SRC_V3" ]; then cp "$SRC_V3" "$DST"
elif [ -f "$SRC_V2" ]; then cp "$SRC_V2" "$DST"
elif [ -f "$SRC_V1" ]; then cp "$SRC_V1" "$DST"
elif [ -f "$DST" ]; then exit 0
else echo "PDF da revista não encontrado" >&2; exit 1; fi

# Versão leve da revista para celular/tablet: o Safari no iOS não aguenta o PDF
# original (~28 MB / 300 DPI) e a aba colapsa. O leitor usa esta quando LOW_MEM.
# (ghostscript existe no build local; na Vercel o build sai antes, usando o
# revista-mobile.pdf já versionado.)
if command -v gs >/dev/null 2>&1; then
  gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.5 \
     -dDownsampleColorImages=true -dColorImageResolution=100 -dColorImageDownsampleThreshold=1.0 \
     -dDownsampleGrayImages=true -dGrayImageResolution=100 \
     -dJPEGQ=80 -dNOPAUSE -dBATCH -dQUIET \
     -sOutputFile="revista/leitura/revista-mobile.pdf" "$DST" \
    && echo "→ Revista mobile: $(du -h revista/leitura/revista-mobile.pdf | cut -f1)"
fi

# Páginas em imagem para o leitor leve (iPhone/iPad — sem PDF.js). PyMuPDF local.
if python3 -c "import fitz" >/dev/null 2>&1; then
  python3 "$(dirname "$0")/scripts/gen-revista-pages.py" || true
  # Leitor flipbook (StPageFlip + imagens lazy, sem PDF.js): zoom de verdade,
  # flip dentro do zoom, gate de e-mail. Regenera flip/index.html do template.
  python3 "$(dirname "$0")/scripts/build-flip.py" || true
fi

bash build-library.sh
bash build-favicons.sh
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
if [ -f "$ROOT/imagens/Logo5.svg" ]; then
  convert -background none "$ROOT/imagens/Logo5.svg" -resize 192x192 "$ROOT/site/favicon-192.png" 2>/dev/null || true
fi
