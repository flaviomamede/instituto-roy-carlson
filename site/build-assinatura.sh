#!/usr/bin/env bash
# Regenera os BR Codes (Pix Copia e Cola) e os QR dos planos de assinatura
# a partir de site/assinatura/assinatura.config.json.
#
# Local apenas (requer 'qrcode[pil]'): os artefatos (pix.json + qr-*.png) são
# versionados e publicados como estáticos, então o build da Vercel NÃO precisa
# rodar isto. Rode após mudar a chave Pix / valores / titular:
#     pip install 'qrcode[pil]' && bash site/build-assinatura.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
python3 "$ROOT/scripts/gen-assinatura.py"
