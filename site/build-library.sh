#!/usr/bin/env bash
# Copia acervo da biblioteca para site/biblioteca/ (PDFs públicos + catálogo saneado).
# PDFs exclusivos ficam em site/api/_data/library/ (somente serverless).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/biblioteca"
ADAPTER="$ROOT/biblioteca-adapters/irc"
DST="$ROOT/site/biblioteca"
PRIVATE_DST="$ROOT/site/api/_data/library/files"
FULL_CATALOG="$ROOT/site/api/_data/library/catalog.full.json"

mkdir -p "$DST/data" "$DST/files/public" "$PRIVATE_DST"
rm -rf "$DST/files/private"
mkdir -p "$DST/js/core"

python3 "$ROOT/site/scripts/library-build.py" \
  "$ADAPTER/catalog.json" \
  "$DST/data/catalog.json" \
  "$FULL_CATALOG"

if [ -f "$DST/data/allowlist.json" ]; then
  echo "ERRO: allowlist.json não deve ser publicada em site/biblioteca/data/" >&2
  exit 1
fi

cp "$ROOT/biblioteca-core/src/"*.js "$DST/js/core/"

copy_public() {
  local from="$1" to="$2"
  if [ -f "$from" ]; then cp "$from" "$DST/files/public/$to"
  else echo "AVISO: não encontrado $from" >&2; fi
}

copy_private() {
  local from="$1" to="$2"
  if [ -f "$from" ]; then cp "$from" "$PRIVATE_DST/$to"
  else echo "AVISO: não encontrado $from" >&2; fi
}

copy_private "$SRC/EstudosHGen.pdf" "estudos-hgen.pdf"
copy_private "$SRC/concreto_massa_no_brasil.pdf" "concreto-massa-brasil.pdf"
copy_public "$SRC/IWHR2014.pdf" "iwhr-2014.pdf"
copy_public "$SRC/IWHR2024.pdf" "iwhr-2024.pdf"
copy_public "$SRC/IWHR2025.pdf" "iwhr-2025.pdf"

copy_private "$SRC/P183 2025 ConhecimentoEstatísticas&GestãoRiscosPrevisibilidadeSegurançaBaragens.pdf" "p183-andriolo.pdf"
copy_private "$SRC/P184 2025 AspectosGestãoQualidadeConstruçãoRetrospectivaPotenciaisCausasDeRiscos.pdf" "p184-andriolo.pdf"
copy_private "$SRC/P185 2025 BarragensContemporâneasConhecimentoFalhas&Riscos.pdf" "p185-andriolo.pdf"
copy_private "$SRC/P186 2025 ComportamentoJuntasFundação&Concreto&JuntasConstruçãoConcreto.pdf" "p186-andriolo.pdf"
copy_private "$SRC/P187 2025 Hábitos&PráticaRecentesEmProjeto&ConstruçãoBarragensReduçãoQualidadeSegurança.pdf" "p187-andriolo.pdf"
copy_private "$SRC/P188 2025 NecessárioTreinamentoParaQualidadeConstruçõesSustentabilidadeBarragens.pdf" "p188-andriolo.pdf"
copy_private "$SRC/P189 2025 OperaçãoManutençãoInspeção-NecessidadeAtençõesSegurançaBarragens.pdf" "p189-andriolo.pdf"
copy_private "$SRC/P190 2025 Ocupações Entorno Barragens Responsabilidades&Cuidados.pdf" "p190-andriolo.pdf"
copy_private "$SRC/P191 2025 DisponibilidadesCrescentesInspeçãoMonitoramento&ControleBarragens.pdf" "p191-andriolo.pdf"
copy_private "$SRC/P192 2025 InspeçõesManutençõesReabilitações&ReparosBarramentos&Estruturas.pdf" "p192-andriolo.pdf"
copy_private "$SRC/reminiscences/Dr. Roy W. Carlson's 85th Birthday - REMINISCENCES.pdf" "reminiscencias-roy-carlson.pdf"

PUBLIC_N=$(find "$DST/files/public" -name '*.pdf' 2>/dev/null | wc -l)
PRIVATE_N=$(find "$PRIVATE_DST" -name '*.pdf' 2>/dev/null | wc -l)
echo "→ Biblioteca: ${PUBLIC_N} PDFs públicos, ${PRIVATE_N} PDFs protegidos (api/_data)"
