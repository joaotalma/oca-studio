#!/bin/bash
# Leva a mixagem a -16 LUFS em duas passadas, com limitador. Uso: masterizar.sh entrada.wav saida.wav
set -euo pipefail
ent="$1"; sai="$2"
pre='acompressor=threshold=-26dB:ratio=3:attack=6:release=140:makeup=6dB,alimiter=limit=0.8:level=false'
med=$(ffmpeg -hide_banner -nostats -i "$ent" -af "$pre,loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json" -f null - 2>&1 </dev/null | tr -d '\r')
pega() { echo "$med" | grep "\"$1\"" | sed -E 's/.*: "?([^",]+)"?,?/\1/'; }
ffmpeg -v error -y -i "$ent" -af "$pre,loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$(pega input_i):measured_TP=$(pega input_tp):measured_LRA=$(pega input_lra):measured_thresh=$(pega input_thresh):offset=$(pega target_offset):linear=true" -ar 48000 -ac 2 "$sai" </dev/null
ffmpeg -hide_banner -nostats -i "$sai" -af loudnorm=print_format=summary -f null - 2>&1 </dev/null | grep -E "Input (Integrated|True Peak|LRA)"
