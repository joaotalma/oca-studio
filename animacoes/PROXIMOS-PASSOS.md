# Próximos passos

Atualizado em 2026-11-08. Inclui o feedback do João sobre o piloto do apagão v2 e o pedido de commit desta entrega. Publicação continua manual.

## Prioridade: feedback do piloto do apagão v2

**O que funcionou:** João gostou da narração e da execução do vídeo. Preservar a voz original jovem, a clareza da fala, a sincronização e o caminho de personagem 2D com profundidade.

**O que não funcionou:** a pauta pareceu chata, pouco lembrada e sem impacto percebido suficiente para despertar interesse. Isso é a avaliação editorial do João, não uma afirmação de que o acontecimento histórico foi irrelevante. Não depender de o público lembrar de um fato antigo para se importar: a consequência ou curiosidade precisa fazer sentido hoje.

**Visual:** o piloto ficou escuro demais; as referências enviadas tinham mais cores. Buscar mais luminosidade e variedade de cores em cenários e objetos, preservando volume, contraste legível e luz com direção. Não resolver apenas aumentando brilho ou removendo todas as sombras.

- [ ] Reavaliar a prioridade dos 28 temas pelo interesse atual, reconhecimento imediato e impacto concreto para o espectador. A pauta do apagão v2 fica como teste de execução, sem prioridade de publicação por enquanto.
- [ ] Pesquisar e apresentar três pautas mais fortes, com evidência atual e uma frase que explique por que alguém se importaria agora. Considerar novidades, retornos e referências culturais do radar; não presumir viralização.
- [ ] Preparar duas opções de visual mais claro e colorido para a próxima pauta, usando primeiro quadro, virada e fecho como prova de composição.
- [ ] Comparar as opções com as referências enviadas: cor local nos objetos, separação entre planos, pele legível e pouca área escura sem função narrativa.
- [ ] Produzir o próximo piloto com uma pauta mais atraente e o visual revisto, mantendo a narração que funcionou, após a escolha do João.

Este pedido registra tarefas; não solicita refazer agora o piloto nem renderizar todo o catálogo.

## Onde paramos

- **Entrega v2 atual:** 28 roteiros revisados com originais preservados; índice em `radar/revisao-roteiros-v2.md`. Gerador, guia visual e prompt de pesquisa estratégica estão integrados ao fluxo.
- **Piloto do apagão v2:** completo, com áudio, 1080 x 1920, 30 fps e aproximadamente 72 s. Verificações técnicas aprovadas com pausas de leitura justificadas. João gostou da narração e do vídeo, mas pediu pauta mais forte e visual mais claro/colorido para a próxima versão.
- **Aprovação editorial:** o feedback do piloto não aprova as outras 27 versões v2 nem torna a pauta do apagão prioritária.

Histórico das versões anteriores, preservadas:

- **Vídeos prontos em rascunho:** 2 a 10, 12 a 23 e 25 a 30, mudos, em 540 x 960, aprovados nos itens medidos do QA. Prévias em `render/<nome-do-vídeo>/previa-muda.mp4`.
- **Vídeo 1, greve dos caminhoneiros:** versão muda anterior, em 1080 x 1920 e sem partículas de luz. Falta a aprovação final.
- **Vídeos 11 e 24:** sem tema.
- **Aprovados por João:** 28 roteiros, 28 conjuntos de imagens, as seis paletas e os rostos. A aprovação final dos vídeos ainda não foi dada.

## A fazer

### Estética definitiva

**Atualização de 2026-11-08:** João aprovou o caminho de personagem 2D em cenário 3D no exemplo de Varginha/apagão e pediu estrelas à noite, nuvens de dia e personagem menos escuro sem perder as luzes dinâmicas. Isso agora é padrão do motor ilustrado (`engine/ambiente3d.js`), com direção e horário por cena. As próximas montagens preparam a base neutra do personagem automaticamente quando faltar ou estiver desatualizada. Cenas manuais sem marcas de camada ainda precisam ser separadas; fundos personalizados não identificados são preservados com aviso até receberem direção própria em `cenas3d.json`.

Na primeira atualização do motor não houve novo render. Depois foi produzido o piloto do apagão v2, descrito acima; as demais prévias continuam sendo da versão anterior. Conferir as novas âncoras e o QA na montagem de cada final. A próxima evolução deve atender ao feedback de mais cor e luminosidade.

Histórico da versão anterior, aprovada em 2026-11-07 com o piloto do ET de Varginha. Reprocessar um vídeo por vez, com calma, usando `bash engine/reprocessar.sh <slug>`.

- [x] ET de Varginha (piloto)
- [x] Confisco, apagão de 2001, Recife e hiperinflação (reprocessados em 2026-11-07; falta João assistir)
- [ ] Vídeos 7 a 30 (as cenas precisam ser geradas de novo com `python -I engine/desenhar-lote2.py` antes)
- [ ] Greve dos caminhoneiros: as cenas foram feitas à mão e não têm marcas de camada; precisam ser redesenhadas
- [ ] Revisar as folhas e as prévias de cada lote reprocessado


### Revisão

- [ ] Assistir às prévias e dizer se o padrão visual e o ritmo estão bons.
- [ ] Decidir se as partículas de luz ficam como estão.
- [ ] Decidir sobre a legenda, que às vezes cobre o personagem ou o objeto.

### Vídeos 11 e 24

- [ ] Escolher os temas. Sugestões sem pesquisa: Bug do Milênio e ponte Rio-Niterói.
- [ ] Pesquisar as fontes e aprovar os roteiros.
- [ ] Desenhar as cenas e montar. Paletas reservadas: petróleo no 11 e roxo no 24.

### Fontes

- [ ] Reforçar as fontes mais fracas: Recife, informática, linha telefônica, mudança da capital e corte portuguesa.
- [ ] Reconferir o resultado da perseguição na Noite dos OVNIs.

### Voz

- [x] Criar voz original jovem no ElevenLabs, autorizada pelo João; perfil em `canal/voz-elevenlabs.json`.
- [x] Conferir plano pago ativo e licença comercial na página oficial.
- [x] Medir o piloto e registrar o ritmo em `canal/canal.md`; João gostou da narração.
- [ ] Conferir o ritmo real de cada nova gravação, sem acelerar texto para caber.

### Canal

- [ ] Definir as palavras proibidas, depois de ouvir a voz.
- [ ] Confirmar os padrões marcados como "a confirmar" em `canal/canal.md`.
- [ ] Confirmar o arquivo final do canal.
- [ ] Decidir se o tom muda em temas mais leves, como lagosta e França no Rio.
- [ ] Conferir quando o rótulo de IA é obrigatório no Instagram.
- [ ] Criar as contas novas no TikTok, no Instagram e no YouTube.

### Versões finais

- [x] Montar o piloto do apagão v2 em 1080 x 1920, com áudio, e rodar o QA.
- [ ] Montar as demais versões escolhidas com áudio e QA, após revisar pauta e visual.
- [ ] Reduzir o tamanho dos arquivos antes de postar.
- [ ] Aprovar cada vídeo final.
- [ ] Preparar as fichas de publicação com a skill `postagem`.

### Publicação

Só João publica. Ritmo planejado: TikTok, 2 por dia; Instagram e YouTube Shorts, 1 por dia.

- [ ] Definir a data de início e a ordem final.
- [ ] Não abrir o calendário com a greve dos caminhoneiros enquanto o boato de greve estiver em alta.
- [ ] Antes de cada post, conferir se não há crise parecida em andamento, principalmente no apagão do Amapá e nos vídeos sobre dinheiro.
- [ ] Registrar os resultados com a skill `aprender` e aplicar a regra de corte, usando os 5 primeiros vídeos como base.

### Repositório

João pediu commit de toda a entrega em 2026-11-08. Consultar `git log` para o identificador. Chaves, áudios, vídeos, renders e arquivos temporários ficam fora do commit. Nenhum push foi solicitado.

## Onde está cada coisa

- **Canal:** `canal/canal.md`
- **Pauta e calendário:** `radar/pauta-30-videos.md`
- **Roteiros 7 a 30:** `radar/roteiros-videos-7-a-30.md`
- **Paletas:** `radar/paletas-30-videos.md`
- **Personagem e rostos:** `personagens/`
- **Cada vídeo:** `roteiros/<nome-do-vídeo>/`
