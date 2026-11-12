#!/bin/bash
# Copia as fontes compartilhadas do Tico e o exportador do Take One para esta pasta de estudo.
# O estudo nunca edita motor/personagem/: ele carrega organico.js e cenario-rico.js por cima das cópias.
set -euo pipefail
aqui="$(cd "$(dirname "$0")" && pwd)"; raiz="$(cd "$aqui/../.." && pwd)"; personagem="$raiz/motor/personagem"
motor="${TAKE_ONE:-$raiz/motor/take-one}"
cp "$personagem/chars.js" "$personagem/cenarios.js" "$personagem/acabamento.js" "$aqui/"
cp "$motor/export.mjs" "$motor/serve.mjs" "$motor/frames.mjs" "$aqui/"
echo "fontes copiadas para $aqui"
