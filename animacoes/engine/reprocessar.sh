#!/bin/bash
# Reprocessa vídeos do template ilustrado, um por vez. A montagem usa o motor 3D
# adotado em 2026-11-08, com céu por horário, luz dinâmica e base neutra do personagem.
# Uso: bash engine/reprocessar.sh <slug> [<slug> ...]
# Resultado de cada vídeo: render/<slug>/montagem.log e render/<slug>/previa-muda.mp4 (rascunho mudo).
set -u
raiz="$(cd "$(dirname "$0")/.." && pwd)"
cd "$raiz" || exit 1
for s in "$@"; do
  if [ ! -d "roteiros/$s/cenas-v1" ] && ! grep -q "<!--P-->\|<!--F-->" roteiros/$s/cenas/*.svg 2>/dev/null; then
    echo "$s | sem marcas de camada: gere as cenas de novo (engine/desenhar-lote*.py) antes de reprocessar"; continue
  fi
  python -I engine/reforcar-cortes.py "$s" > /dev/null || { echo "$s | falhou ao refazer as cenas"; continue; }
  node engine/estimar-tempos.mjs "roteiros/$s/falas.js" > /dev/null
  node engine/desenhar-cenas.mjs "roteiros/$s" > /dev/null || { echo "$s | falhou ao desenhar"; continue; }
  mkdir -p "render/$s"
  bash engine/montar.sh "roteiros/$s" --rascunho > "render/$s/montagem.log" 2>&1
  [ -f "render/$s/$s.mp4" ] && ffmpeg -v error -y -i "render/$s/$s.mp4" -c:v libx264 -crf 25 -an -movflags +faststart "render/$s/previa-muda.mp4"
  echo "$s | $(grep -m1 '^RESULTADO' "render/$s/montagem.log")"
done
