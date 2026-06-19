#!/usr/bin/env bash
# Publica o site na Vercel (evita bloqueio por e-mail Git do último commit).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
SITE="$ROOT/site"
TMP="/tmp/irc-vercel-deploy-$$"
trap 'rm -rf "$TMP"' EXIT

echo "→ Build do site (revista + biblioteca)…"
(cd "$SITE" && bash build.sh)

echo "→ Copiando site para deploy temporário…"
rsync -a --exclude '.vercel' "$SITE/" "$TMP/"
cp -r "$SITE/.vercel" "$TMP/.vercel"

echo "→ Deploy em produção…"
cd "$TMP"
npx vercel@latest deploy --prod --yes --force \
  -m gitCommitAuthorEmail=flaviomamede.gomes@gmail.com \
  -m gitCommitAuthorName="Flavio Mamede"

echo "→ Pronto: https://institutoroycarlson.org/revista/"
