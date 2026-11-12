#!/bin/bash
# Monta a pasta do Instagram no Drive: vídeo final, capa, story (se houver) e postagem.md.
# Uso: bash scripts/kit-instagram.sh episodios/ep02
set -e
EP=$(basename "$1")
RAIZ=$(cd "$(dirname "$0")/.." && pwd)
DRIVE="${DRIVE_TICO:-/g/Meu Drive/Se Vira, Tico}"
DEST="$DRIVE/${EP}_instagram"
for f in "$RAIZ/render/${EP}_final.mp4" "$RAIZ/render/${EP}_capa.png" "$RAIZ/episodios/$EP/postagem.md"; do
  [ -f "$f" ] || { echo "falta: $f"; exit 1; }
done
grep -q -E "OmniVoice|ElevenLabs" "$RAIZ/episodios/$EP/postagem.md" || { echo "postagem.md sem o crédito das vozes (OmniVoice ou ElevenLabs)"; exit 1; }
mkdir -p "$DEST"
cp "$RAIZ/render/${EP}_final.mp4" "$RAIZ/render/${EP}_capa.png" "$DEST/"
[ -f "$RAIZ/render/${EP}_story.png" ] && cp "$RAIZ/render/${EP}_story.png" "$DEST/"
cp "$RAIZ/episodios/$EP/postagem.md" "$DEST/${EP}_postagem.md"
echo "kit pronto em $DEST"
