#!/usr/bin/env bash
# Servidor local do site (raiz = pasta site/).
# Abra: http://localhost:8080/  ou  http://localhost:8080/biblioteca/
cd "$(dirname "$0")"
bash build-library.sh 2>/dev/null || true
echo "Servidor em http://localhost:8080/"
echo "  Biblioteca: http://localhost:8080/biblioteca/"
python3 -m http.server 8080
