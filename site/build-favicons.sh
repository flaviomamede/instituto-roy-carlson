#!/usr/bin/env bash
# Gera favicons na raiz publicada (site/) a partir do logo IRC.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SITE="$ROOT/site"
SRC="$ROOT/imagens/Logo5.svg"

if [ ! -f "$SRC" ]; then
  SRC="$ROOT/biblioteca/Logo6.svg"
fi
if [ ! -f "$SRC" ]; then
  echo "AVISO: logo SVG não encontrado; favicons não gerados" >&2
  exit 0
fi

cp "$SRC" "$SITE/icon.svg"

convert -background none "$SRC" -resize 180x180 "$SITE/apple-touch-icon.png"
convert -background none "$SRC" -resize 32x32 "$SITE/favicon-32.png"
convert -background none "$SRC" -resize 16x16 "$SITE/favicon-16.png"
convert "$SITE/favicon-16.png" "$SITE/favicon-32.png" "$SITE/favicon.ico"

echo "→ Favicons gerados em site/"
