#!/bin/bash
# Copia as fontes compartilhadas do Tico e o exportador do Take One para esta pasta de estudo.
# O estudo nunca edita personagens/: ele carrega organico.js e cenario-rico.js por cima das cópias.
set -euo pipefail
aqui="$(cd "$(dirname "$0")" && pwd)"; raiz="$(cd "$aqui/../.." && pwd)"
motor="${TAKE_ONE:-$HOME/.claude/skills/take-one/scripts}"
cp "$raiz/personagens/chars.js" "$raiz/personagens/cenarios.js" "$raiz/personagens/acabamento.js" "$aqui/"
cp "$motor/export.mjs" "$motor/serve.mjs" "$motor/frames.mjs" "$aqui/"
echo "fontes copiadas para $aqui"
