#!/bin/bash
# Monta render/<slug>/ com o template, os dados do roteiro e o que o render precisa.
# O export só serve arquivos de dentro dessa pasta. A fonte continua em templates/, engine/ e roteiros/.
# Uso: bash engine/preparar-film.sh roteiros/<slug>
set -euo pipefail
pasta="${1:?pasta do roteiro}"; pasta="${pasta%/}"
raiz="$(cd "$(dirname "$0")/.." && pwd)"
slug="$(basename "$pasta")"
template="$(sed -nE "s/.*template: *'([a-z-]+)'.*/\1/p" "$pasta/video.js" | head -1)"
[ -f "$raiz/templates/$template/film.html" ] || { echo "template sem film.html: '$template'" >&2; exit 2; }
film="$raiz/render/$slug"
mkdir -p "$film"
cp "$raiz/templates/$template/"* "$film/"
cp "$raiz/engine/tempo.js" "$raiz/engine/take-one/export.mjs" "$raiz/engine/take-one/serve.mjs" "$raiz/engine/take-one/springs.js" "$film/"
cp "$pasta/video.js" "$pasta/falas.js" "$film/"
if [ -f "$pasta/tempos.js" ]; then cp "$pasta/tempos.js" "$film/"; else echo '// sem narração: vale o tempo do roteiro' > "$film/tempos.js"; fi
[ -d "$pasta/assets" ] && cp -r "$pasta/assets" "$film/"
# Template com personagem: um arquivo .usa-rig na pasta do template traz o motor e o rig
if [ -f "$raiz/templates/$template/.usa-rig" ]; then
  cp "$raiz/engine/rig/chars.js" "$raiz/engine/cenarios.js" "$raiz/engine/motor.js" "$film/"
fi
echo "$film"
