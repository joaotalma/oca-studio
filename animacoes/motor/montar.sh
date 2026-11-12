#!/bin/bash
# Do roteiro ao vídeo. Sem narração em audio/<slug>/, gera um render mudo com os tempos estimados.
# Uso: bash motor/montar.sh series/misterios-do-brasil/roteiros/<slug> [--rascunho] [--sem-duracao] [--musica faixa.wav]
# Grave em audio/<slug>/narracao.wav (ou .m4a, .mp3, .flac). Rode pelo Git Bash.
set -euo pipefail
pasta="${1:?pasta do roteiro}"; pasta="${pasta%/}"; shift
raiz="$(cd "$(dirname "$0")/.." && pwd)"
slug="$(basename "$pasta")"
slug_config="$(sed -nE "s/.*slug: *'([a-z0-9-]+)'.*/\1/p" "$pasta/video.js" | head -1)"
slug="${slug_config:-$slug}"
audio="$raiz/audio/$slug"; film="$raiz/render/$slug"
W=1080; H=1920; FPS=30; qa=(); musica=()
while [ $# -gt 0 ]; do
  case "$1" in
    --rascunho) W=540; H=960; FPS=15; qa+=(--rascunho) ;;
    --sem-duracao) qa+=(--sem-duracao) ;;
    --musica) musica=(--musica "$2"); shift ;;
    *) echo "opção desconhecida: $1" >&2; exit 2 ;;
  esac
  shift
done

narracao="$(ls "$audio"/narracao.* 2>/dev/null | head -1 || true)"
if [ -n "$narracao" ]; then
  python "$raiz/motor/audio/fatiar-narracao.py" "$narracao" "$pasta/falas.js" "$audio"
  python "$raiz/motor/audio/sincronizar.py" "$pasta" "$audio"
else
  rm -f "$pasta/tempos.js"
  qa+=(--mudo)
  echo "Sem narração em $audio: render mudo, com os tempos estimados."
fi

# A base neutra é preparada só na montagem solicitada, nunca ao editar o motor.
# Evita acumular a luz antiga do SVG com a fonte dinâmica do cenário 3D.
if ! node "$raiz/motor/cenas/preparar-cenas3d.mjs" "$pasta" --camadas-prontas; then
  node "$raiz/motor/cenas/desenhar-cenas.mjs" "$pasta"
fi
bash "$raiz/motor/preparar-film.sh" "$pasta" >/dev/null
(cd "$film" && W=$W H=$H node export.mjs "$FPS" imagem.mp4)

final="$film/$slug.mp4"
if [ -n "$narracao" ]; then
  python "$raiz/motor/audio/mixar.py" "$audio" "$film/mix.wav" --narrado ${musica[@]+"${musica[@]}"}
  bash "$raiz/motor/audio/masterizar.sh" "$film/mix.wav" "$film/master.wav"
  ffmpeg -v error -y -i "$film/imagem.mp4" -i "$film/master.wav" -c:v copy -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart "$final"
else
  ffmpeg -v error -y -i "$film/imagem.mp4" -c:v copy -movflags +faststart "$final"
fi
node "$raiz/motor/qa/qa-video.mjs" "$film" "$final" ${qa[@]+"${qa[@]}"}
