#!/bin/bash
# Copia o rig e o motor do Take One para a pasta de um filme. O export.mjs e o gate.mjs
# so servem arquivos de dentro dessa pasta; a fonte do rig continua sendo personagens/chars.js.
# Uso: bash scripts/preparar-film.sh episodios/teste
set -euo pipefail
pasta="${1:?pasta do filme}"
raiz="$(cd "$(dirname "$0")/.." && pwd)"
# Na Oca Studio, o Take One fica em animacoes/motor/take-one (mesmos arquivos da skill, conferidos por SHA-256 em 2026-11-12).
motor="${TAKE_ONE:-$raiz/../../motor/take-one}"
cp "$raiz/personagens/chars.js" "$raiz/personagens/cenarios.js" "$pasta/"
cp "$motor/export.mjs" "$motor/serve.mjs" "$motor/springs.js" "$pasta/"

# O módulo de acabamento precede o motor no mesmo bundle, sem mudar film.html.
cat "$raiz/personagens/acabamento.js" "$raiz/personagens/motor.js" > "$pasta/motor.js"
