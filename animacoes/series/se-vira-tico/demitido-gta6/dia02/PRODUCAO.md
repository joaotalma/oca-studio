# Dia 2 — reprodução da entrega

**Revisão do João, 14/11/2026:** usar `revisao-joao/preparar.mjs` para preparar a montagem atual em `animacoes/render/demitido-gta6/dia02-revisao-joao/`. Reutiliza as três gravações autorizadas já existentes em `audio/demitido-gta6-dia02/revisao-joao/`; não chamar novamente o gerador de voz. Duração medida 107,116 s. As instruções abaixo documentam a versão anterior e o mesmo fluxo de render/QA; a revisão usa seu próprio áudio, linha do tempo e pausas de leitura, todos dentro da pasta preparada.

Fontes específicas deste episódio. O roteiro e o elenco estão aprovados; a finalização segue a autorização automática de 12/11/2026. Não gerar novamente as vozes.

1. Na raiz do repositório: `node animacoes/series/se-vira-tico/demitido-gta6/dia02/hq/preparar-final.mjs`.
2. Executar `hq/efeitos.py` com o Python disponível e o destino `animacoes/render/demitido-gta6/dia02-final/efeitos.wav`; depois `node animacoes/series/se-vira-tico/demitido-gta6/dia02/hq/audio-final.mjs`.
3. Na pasta preparada `animacoes/render/demitido-gta6/dia02-final`, exportar com W=540, H=960, PARTES=3, 15 fps. Muxar o mesmo `audio-master.wav`, AAC 192 kb/s, com duração de 117,8 s.
4. A partir de `animacoes`, executar `motor/qa/qa-video.mjs` com `--rascunho --audio-origem <audio-master.wav> --duracao 105,140 --sem-texto --leitura series/se-vira-tico/demitido-gta6/dia02/hq/pausas-visuais.json --relatorio <filme>/qa-resultados/qa-rascunho.json`. Olhar o rascunho e os trechos apontados.
5. Somente após aprovação: exportar a mesma fonte com W=1080, H=1920, PARTES=3, 30 fps. Muxar o mesmo áudio; executar o QA com `--final-leve --qa-rascunho <qa-rascunho.json>` e as mesmas demais opções.
6. Conferir as oito amostras em alta, mais os trechos críticos. Registrar revisão vinculada aos hashes em `qa-resultados/revisao-final.json` e finalizar pelo `motor/finalizar.mjs`, com origem `series/se-vira-tico/demitido-gta6/dia02` e entrega `entregas/demitido-antes-do-gta/dia02`.

Para capa: `node .../dia02/hq/preparar-capa.mjs` prepara a fonte adaptada da capa aprovada do Dia 1. Na raiz da série, `node demitido-gta6/dia02/capa.mjs` gera a capa e a cópia oficial idêntica. Não precisa renderizar o vídeo por mudança de capa.

`hq/montar-master.mjs` documenta a montagem intermediária antiga em três MP4s. A entrega concluída usa o filme integrado, que mantém uma linha do tempo global e permite verificar as duas emendas e as legendas no mesmo gate.

Os arquivos de trabalho ficam em `animacoes/render/demitido-gta6/dia02-final/`, ignorados pelo Git. Na entrega entram vídeo aprovado, capa, ficha e registros; somente João publica.
