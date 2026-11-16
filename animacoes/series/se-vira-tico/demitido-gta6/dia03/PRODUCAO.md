# Dia 3 — como reproduzir a arte

Estado em 15/11/2026: roteiro v2 aprovado, 21 falas gravadas (`../../audio/demitido-gta6-dia03/`, script `scripts/gerar-falas-dia03.mjs`), **episódio concluído e entregue** (114 s; QA 7/7; `entregas/demitido-antes-do-gta/dia03/`).

1. Na raiz de `animacoes/`: `node series/se-vira-tico/demitido-gta6/dia03/hq/preparar.mjs` (prepara `render/demitido-gta6/dia03-hq/`, fora do Git). Origem: `dia01/estudos/hq-v10-15s-v2/direcao-hq.js` (linhas 1–63) + `dia02/hq/pecas.js` (rig do elenco, `ator()`) + `hq/final.js` (cenas do Dia 3).
2. Quadros avulsos: na pasta preparada, `node still.mjs film.html stills 4,32.9,76`.
3. Amostra em vídeo: `FILM=film.html W=540 H=960 START=27.4 END=38.6 node export.mjs 15 saida.mp4`.
4. Som: `python hq/efeitos.py animacoes/render/demitido-gta6/dia03-final/efeitos.wav` (efeitos sintetizados: campainha, rangido, CRAAC, rodinhas, controle, pings, moto do Jão, voto) e depois `node hq/audio-final.mjs` (vozes + efeitos, filtro de WhatsApp no Jão, −16 LUFS).
5. As falas e os marcos vivem em `falas.js` (tempos reais). Legendas e o filme integrado ainda não foram feitos: seguir `../dia02/PRODUCAO.md` como modelo.

Amostras com som dos dois planos sem precedente: `amostra/amostra-cadeira.mp4` (27,4–38,6 s) e `amostra/amostra-barra.mp4` (73,2–81,0 s), com efeitos, sem legendas.

6. Render: na pasta preparada, `W=540 H=960 PARTES=3 node export.mjs 15 rascunho-mudo.mp4`, mux com `audio-master.wav` (AAC 192k, 114 s), QA `--rascunho --duracao 105,140 --sem-texto --leitura hq/pausas-visuais.json`; depois `W=1080 H=1920 PARTES=3 node export.mjs 30` e `--final-leve`. Atenção: o hash da fonte inclui PNGs e MP4s dentro da pasta preparada; guarde quadros e amostras fora dela (`render/demitido-gta6/dia03-extras/`).
7. Capa: `node hq/preparar-capa.mjs` e, de `series/se-vira-tico/`, `node demitido-gta6/dia03/capa.mjs`.

8. Risadas e "Ops": `node hq/risadas.mjs` recorta a faixa "Risadas de Fundo" (pack do João, em Downloads) em 8 rajadas e usa 4 delas (CRAAC, "se aposentando", gol contra e CLANK); o "Ops" (`56- Ops.mp3`, mesmo pack) entra em 32,8 s no `hq/audio-final.mjs`. Essas fontes ficam fora do Git e têm origem/licença não verificadas (a pasta do pack se chama "chaves"): conferir antes de publicar ou monetizar. `hq/risadas.py` (risadas sintetizadas) ficou como alternativa sem direitos de terceiros.
