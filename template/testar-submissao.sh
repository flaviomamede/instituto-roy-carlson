#!/usr/bin/env bash
# Teste local da submissão de artigos (formulário + API + PDF).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SITE_PORT="${SITE_PORT:-8765}"
API_PORT="${API_PORT:-8791}"

echo "=== Revista IRC — teste de submissão ==="
echo ""
echo "1) Terminal A (este script mantém o API rodando):"
echo "   python3 template/serve-submissao.py  →  http://127.0.0.1:${API_PORT}"
echo ""
echo "2) Terminal B — site estático:"
echo "   cd site && python3 -m http.server ${SITE_PORT}"
echo ""
echo "3) Abra no navegador:"
echo "   http://localhost:${SITE_PORT}/revista/submissao/"
echo ""
echo "4) Preencha o formulário com um .md e um .zip de figuras."
echo "   O PDF sai em template/artigos/NNN-slug/saida/artigo.pdf"
echo ""

if ss -tlnp 2>/dev/null | grep -q ":${API_PORT} "; then
  echo "API já ativa na porta ${API_PORT}."
else
  echo "Iniciando API na porta ${API_PORT}…"
  exec python3 "$ROOT/template/serve-submissao.py"
fi
