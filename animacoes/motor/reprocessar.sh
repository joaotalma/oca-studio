#!/bin/bash
# Reprocessa vídeos do template ilustrado, um por vez. A montagem usa o motor 3D
# adotado em 2026-11-08, com céu por horário, luz dinâmica e base neutra do personagem.
# Uso: bash motor/reprocessar.sh <slug> [<slug> ...]
# Resultado de cada vídeo: render/<slug>/montagem.log e render/<slug>/previa-muda.mp4 (rascunho mudo).
set -u
raiz="$(cd "$(dirname "$0")/.." && pwd)"
cd "$raiz" || exit 1
for s in "$@"; do
  if [ ! -d "series/misterios-do-brasil/roteiros/$s/cenas-v1" ] && ! grep -q "<!--P-->\|<!--F-->" series/misterios-do-brasil/roteiros/$s/cenas/*.svg 2>/dev/null; then
    echo "$s | sem marcas de camada: gere as cenas de novo (motor/desenhar-lote*.py) antes de reprocessar"; continue
  fi
  python -I motor/reforcar-cortes.py "$s" > /dev/null || { echo "$s | falhou ao refazer as cenas"; continue; }
  node motor/estimar-tempos.mjs "series/misterios-do-brasil/roteiros/$s/falas.js" > /dev/null
  node motor/desenhar-cenas.mjs "series/misterios-do-brasil/roteiros/$s" > /dev/null || { echo "$s | falhou ao desenhar"; continue; }
  mkdir -p "render/$s"
  bash motor/montar.sh "series/misterios-do-brasil/roteiros/$s" --rascunho > "render/$s/montagem.log" 2>&1
  [ -f "render/$s/$s.mp4" ] && ffmpeg -v error -y -i "render/$s/$s.mp4" -c:v libx264 -crf 25 -an -movflags +faststart "render/$s/previa-muda.mp4"
  echo "$s | $(grep -m1 '^RESULTADO' "render/$s/montagem.log")"
done
