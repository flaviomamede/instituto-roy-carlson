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
