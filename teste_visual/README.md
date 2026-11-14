# Teste visual — GTA, abertura HQ V10, versão 2

Última amostra criada nesta conversa: primeiros 15 segundos do Dia 1, com os ajustes de rosto, cabelo, cores, textos e cenário. Organizada em 14/11/2026 a pedido do João.

- [Vídeo da versão 2](video.mp4): 1080×1920, 30 fps, aproximadamente 15 segundos.
- [Comparação V1 × V2](comparativo_v1_v2.mp4): primeira amostra à esquerda, segunda à direita; mesmo áudio.
- [Prompt principal](prompts/01_direcao_visual.md), [ajustes da versão 2](prompts/02_ajustes_v2.md) e [prompt para reconstrução](prompts/03_reconstruir.md).
- [Fontes canônicas](../animacoes/series/se-vira-tico/demitido-gta6/dia01/estudos/hq-v10-15s-v2/): desenho, atuação, HTML e preparação. Não há segunda cópia manual do motor nesta pasta.
- [Reprodução local](reproduzir.mjs): ajuda com node teste_visual/reproduzir.mjs; render com node teste_visual/reproduzir.mjs --render.

Os prompts foram organizados a partir dos pedidos e ajustes desta conversa para serem reutilizados; não são uma transcrição literal completa das mensagens. O vídeo é renderizado por código, não por um modelo de geração de vídeo.

## O que define esta versão

Rosto sem pontinhos nem textura de papel sobre a pele; cachos com movimento independente e raiz firme; explosão do 6 em pêssego, rosa e lilás; DIAS em faixa legível; R$ 3,20 em etiqueta discreta com moedas na palma; carta sem achatamento; quarto com sinais de uso e mais objetos.

Mesmos roteiro e áudio da abertura já gravada. Nenhuma voz nova. O estudo não substitui o episódio inteiro e a estética do restante do Dia 1 não foi automaticamente alterada. Publicação somente pelo João. Referência Hybrid Studio V10 fornecida pelo João para estudo de linguagem; os arquivos de terceiros não são necessários para renderizar esta amostra.

## Verificação

QA completo aprovado: 7/7 itens do gate, 1080×1920, 30 fps, 15.02 s, −16,3 LUFS. A pequena diferença sobre 15 s vem do último pacote AAC copiado. Conferência visual por amostragem e igualdade da faixa de áudio verificadas. Registro: [manifesto.json](manifesto.json).

Instalar as dependências com npm ci em animacoes/; ter Node, Chrome e FFmpeg no computador. O áudio vem da entrega de Dia 1 já incluída no repositório. Não exige chave de API nem compra de créditos. Uma nova exportação pode variar em compressão/antialiasing conforme o ambiente; este pacote preserva o MP4 já conferido.
