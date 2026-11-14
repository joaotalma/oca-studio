# Prompt para reconstruir a versão existente

Estou no repositório Oca Studio. Quero reconstruir a última amostra de 15 segundos, sem reinterpretar o visual nem criar nova voz.

1. Leia as instruções do repositório e teste_visual/README.md.
2. Use as fontes em animacoes/series/se-vira-tico/demitido-gta6/dia01/estudos/hq-v10-15s-v2/. O arquivo direcao-hq.js contém poses, cabelo segmentado, paleta, cenários, explosão, etiqueta e carta. O HTML e preparar.mjs montam uma preparação autocontida a partir do rig compartilhado.
3. O vídeo de referência da própria entrega é teste_visual/video.mp4. Compare o resultado a ele, não apenas aos prompts. Os prompts descrevem decisões; o código fixa a implementação exata.
4. Rode node teste_visual/reproduzir.mjs --render, com dependências de animacoes instaladas, Chrome e FFmpeg disponíveis. A saída vai para animacoes/render/demitido-gta6/estudo-hq-v10-15s-v2/.
5. Copie a faixa AAC dos mesmos primeiros 15 segundos de animacoes/entregas/demitido-antes-do-gta/dia01-hibrido-r2/video.mp4 sem recodificar. Não chamar ElevenLabs nem outra API de geração.
6. Rode o QA completo no master, confira âncoras e extraia o último quadro antes de 15 s. O AAC copiado pode deixar o contêiner com cerca de 15,02 s; não buscar imagem depois do último quadro.
7. Preserve episódios aprovados e versões anteriores. Não faça commit, push, publicação ou gasto sem o pedido correspondente.

Para outra abertura, preserve os princípios visuais e redesenhe os efeitos conforme o sentido da fala, sem transformar toda informação em uma explosão idêntica.
