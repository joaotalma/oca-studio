#!/bin/bash
# Copia o rig e o motor do Take One para a pasta de um filme. O export.mjs e o gate.mjs
# só servem arquivos de dentro dessa pasta. A fonte do rig é o motor único da Oca Studio:
# animacoes/motor/personagem/ (chars.js, cenarios.js, motor.js e acabamento.js).
# Estilo do rig: orgânico por padrão. Episódios antigos fixam ESTILO_RIG = 'classico' no ep.js.
# Uso: bash scripts/preparar-film.sh episodios/teste
set -euo pipefail
pasta="${1:?pasta do filme}"
raiz="$(cd "$(dirname "$0")/.." && pwd)"
personagem="$raiz/../../motor/personagem"
# Na Oca Studio, o Take One fica em animacoes/motor/take-one (mesmos arquivos da skill, conferidos por SHA-256 em 2026-11-12).
motor="${TAKE_ONE:-$raiz/../../motor/take-one}"
cp "$personagem/chars.js" "$personagem/cenarios.js" "$pasta/"
cp "$motor/export.mjs" "$motor/serve.mjs" "$motor/springs.js" "$pasta/"

# O módulo de acabamento precede o motor no mesmo bundle, sem mudar film.html.
cat "$personagem/acabamento.js" "$personagem/motor.js" > "$pasta/motor.js"
