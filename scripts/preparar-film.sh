#!/bin/bash
# Copia o rig e o motor do Take One para a pasta de um filme. O export.mjs e o gate.mjs
# so servem arquivos de dentro dessa pasta; a fonte do rig continua sendo personagens/chars.js.
# Uso: bash scripts/preparar-film.sh episodios/teste
set -euo pipefail
pasta="${1:?pasta do filme}"
raiz="$(cd "$(dirname "$0")/.." && pwd)"
motor="${TAKE_ONE:-$HOME/.claude/skills/take-one/scripts}"
cp "$raiz/personagens/chars.js" "$pasta/chars.js"
cp "$motor/export.mjs" "$motor/serve.mjs" "$motor/springs.js" "$pasta/"
