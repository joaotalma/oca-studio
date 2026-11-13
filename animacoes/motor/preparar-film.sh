#!/bin/bash
# Monta render/<slug>/ com o template, os dados do roteiro e o que o render precisa.
# O export só serve arquivos de dentro dessa pasta. A fonte continua em motor/templates/, motor/ e series/misterios-do-brasil/roteiros/.
# Uso: bash motor/preparar-film.sh series/misterios-do-brasil/roteiros/<slug>
set -euo pipefail
pasta="${1:?pasta do roteiro}"; pasta="${pasta%/}"
raiz="$(cd "$(dirname "$0")/.." && pwd)"
slug="$(basename "$pasta")"
slug_config="$(sed -nE "s/.*slug: *'([a-z0-9-]+)'.*/\1/p" "$pasta/video.js" | head -1)"
slug="${slug_config:-$slug}"
template="$(sed -nE "s/.*template: *'([a-z-]+)'.*/\1/p" "$pasta/video.js" | head -1)"
modo="$template"
[ "$template" = "filmes" ] && template="ilustrado"
[ -f "$raiz/motor/templates/$template/film.html" ] || { echo "template sem film.html: '$template'" >&2; exit 2; }
film="$raiz/render/$slug"
mkdir -p "$film"
cp "$raiz/motor/templates/$template/"* "$film/"
cp "$raiz/motor/tempo.js" "$raiz/motor/take-one/export.mjs" "$raiz/motor/take-one/serve.mjs" "$raiz/motor/take-one/springs.js" "$film/"
cp "$pasta/video.js" "$pasta/falas.js" "$film/"
if [ -f "$pasta/tempos.js" ]; then cp "$pasta/tempos.js" "$film/"; else echo '// sem narração: vale o tempo do roteiro' > "$film/tempos.js"; fi
node -e 'const fs=require("fs"),p=require("path"),f=p.resolve(process.argv[1]),base=p.resolve(process.argv[2],"render");if(p.dirname(f)!==base)throw Error("Destino fora do render");const alvo=p.join(f,"assets");if(p.dirname(alvo)!==f)throw Error("Destino inválido");fs.rmSync(alvo,{recursive:true,force:true})' "$film" "$raiz"
[ -d "$pasta/assets" ] && cp -r "$pasta/assets" "$film/"
if [ "$modo" = "filmes" ]; then
  node -e 'const fs=require("fs"),p=process.argv[1];let s=fs.readFileSync(p,"utf8");s=s.replace("paletas.js","paletas-filmes.js").replace("ilustrado.js","filmes.js").replace(/<script src="(?:cenas3d|ambiente3d)\.js"><\/script>\r?\n/g,"");fs.writeFileSync(p,s)' "$film/film.html"
fi
if [ "$modo" = "ilustrado" ]; then
  # Só prepara dados e copia o motor; não gera imagens, voz nem vídeo.
  node "$raiz/motor/cenas/preparar-cenas3d.mjs" "$pasta" "$film"
fi
# Template com personagem: um arquivo .usa-rig na pasta do template traz o motor e o rig
if [ -f "$raiz/motor/templates/$template/.usa-rig" ]; then
  cp "$raiz/motor/personagem/chars.js" "$raiz/motor/personagem/cenarios.js" "$film/"
  cat "$raiz/motor/personagem/acabamento.js" "$raiz/motor/personagem/motor.js" > "$film/motor.js"
fi
echo "$film"
