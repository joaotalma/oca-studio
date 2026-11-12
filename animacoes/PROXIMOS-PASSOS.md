# Próximos passos

Atualizado em 2026-11-12. Inclui a unificação na Oca Studio, o feedback do piloto e a evolução visual aprovada. Publicação continua manual.

## Unificação na Oca Studio — 2026-11-12

O nome final da agência é **Oca Studio** (antes se pensava em Blink Studio). O repositório privado é `joaotalma/oca-studio`. Plotline e Se Vira, Tico foram importados com histórico, e o Plotline virou a frente `animacoes/`.

**Fase 1, reorganização (feita em 2026-11-12):**

- [x] Estrutura `motor/`, `templates/`, `series/`, `referencias/`, `estudos/` e `docs/`.
- [x] Tico em `series/se-vira-tico/`. Mistérios (canal, roteiros, radar e personagem) em `series/misterios-do-brasil/`. Filmes em `series/filmes/`.
- [x] As 13 referências analisadas e as transcrições, que estavam fora do git, foram para `referencias/videos-analisados/`. O método Blink, os outliers e a pesquisa da reconstrução do Tico também foram para `referencias/`.
- [x] As branches do Tico `ep04`, `ep05-v2`, `t1-formato` e `visual-plotline` viraram `tico/*` no repositório novo, com o trabalho não commitado das worktrees. O rig orgânico do Tico foi copiado para `estudos/tico-rig-organico/`.
- [x] A v3 e a transferência visual foram para `estudos/_arquivo/`. Os scripts do Codex para o ep06 foram para `series/se-vira-tico/episodios/ep06/producao-codex/`.

**Fase 2, um motor só (pendente, com teste antes e depois):**

- [ ] Gravar uma referência de render: um episódio do Tico e um roteiro dos Mistérios, comparando quadro a quadro.
- [ ] Juntar `motor/` com `series/se-vira-tico/personagens/` (motor, chars, cenarios e acabamento), tendo o rig orgânico v4 como padrão e o rig clássico só para reabrir episódios antigos.
- [ ] Separar o motor em `render/`, `rig/`, `cenarios/`, `cenas/`, `audio/` e `qa/`.
- [ ] Áudio com uma versão de cada script: usar o `mixar` do Tico (trilha e efeitos como opção) e o `sincronizar` do motor, e trocar os `mixagem.py` de cada episódio por dados de configuração.
- [ ] QA único (`qa-video`) também para o Tico, no lugar do `qa-episodio`.
- [ ] Trazer para o motor o que valer dos scripts do Codex do ep06: entonação, abertura em 3 s e empacotamento.
- [ ] Escolher, com o João, a versão de cada episódio que vale entre as branches `tico/*` e juntar na `main`.
- [ ] Manter o teste de fundo 3D como etapa própria, ainda pendente.

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

## Atuação e motor expressivo — pedido de 2026-11-09

Diagnóstico em `estudos/MOTOR-EXPRESSIVO-V3.md`; estudo isolado em `estudos/_arquivo/ator-expressivo-v3/`. O ator atual é uma imagem inteira. O estudo testa cor mais clara e articulação de rosto/corpo, sem substituir a estética de produção.

- [x] Relacionar falhas das 13 referências e do piloto com limitações do motor.
- [x] Criar estudo com olhar, piscada, sobrancelhas, boca/dentes/língua, cabeça e braços separados.
- [x] Separar cadência do ator de câmera/texto; testar determinismo, volume local e pés plantados.
- [ ] Refinar mãos, mandíbula e poses extremas; aprovar desenho de frente, 3/4 e perfil.
- [ ] Testar ação com contato em objeto e narração aprovada; implementar sincronização labial verificável.
- [ ] Comparar duas direções de arte claras/coloridas em 9:16, com legenda e leitura de celular.
- [ ] Escolher tratamento e revisar âncoras antes de integrar à produção e fazer novo episódio. Não reprocessar catálogo em lote.

## Feedback de formas, sombra, dentes e olhar — 2026-11-09

João considerou a atuação bem melhor, mas pediu traços arredondados em pernas, cotovelos e roupa, sombra mais viva e dentes expressivos. Acrescentou que os olhos ainda pareciam sem vida, apesar das pálpebras.

- [x] Preparar revisão isolada em `estudos/ator-organico-v4/`, preservando a v3 para comparação.
- [x] Desenhar contornos curvos para mangas/calças, caimento e tênis arredondados.
- [x] Projetar sombra da silhueta e separar penumbra do contato sob as solas.
- [x] Redesenhar boca/arcada com queixo e bochechas acompanhando o sorriso.
- [x] Rever olhos: íris, cobertura, foco, assimetria, reflexo e tensão de sobrancelhas por intenção.
- [x] Testar a direção posterior do João: olho sem íris colorida, com pupila preta, foco para ambos os lados, brilho e variação de tamanho por emoção. Opção colorida preservada para comparação.
- [x] João avaliou e aprovou o comparativo v4 em 2026-11-09: “Ficou perfeito!”. Desenho de referência em `series/misterios-do-brasil/personagens/voce-v4.md`.
- [ ] Testar depois o personagem v4 aprovado com fundo 3D estilizado: luz compartilhada, sombra, oclusão, escala/perspectiva e cores claras. Preservar o desenho e as expressões; depois conferir a integração no motor de produção.

## Transferência visual 2D para o Se Vira, Tico — 2026-11-09

- [x] Preparar guia/prompt de adaptação, código dos estudos, testes e exemplos aprovados, distinguindo implementação de proposta.
- [x] Copiar o pacote independente para `C:/Users/joaot/Projetos/se-vira-tico/render/referencias-plotline-2d/`: 50 arquivos verificados por SHA-256; testes passaram dentro da cópia.
- [ ] Iniciar no chat do Tico a adaptação ao elenco e cenários 2D, usando o prompt entregue ao João. As fontes de produção do Tico não foram alteradas nesta transferência; fundo 3D fica para depois.

## Onde paramos

- **Entrega v2 atual:** 28 roteiros revisados com originais preservados; índice em `series/misterios-do-brasil/radar/revisao-roteiros-v2.md`. Gerador, guia visual e prompt de pesquisa estratégica estão integrados ao fluxo.
- **Piloto do apagão v2:** completo, com áudio, 1080 x 1920, 30 fps e aproximadamente 72 s. Verificações técnicas aprovadas com pausas de leitura justificadas. João gostou da narração e do vídeo, mas pediu pauta mais forte e visual mais claro/colorido para a próxima versão.
- **Aprovação editorial:** o feedback do piloto não aprova as outras 27 versões v2 nem torna a pauta do apagão prioritária.

Histórico das versões anteriores, preservadas:

- **Vídeos prontos em rascunho:** 2 a 10, 12 a 23 e 25 a 30, mudos, em 540 x 960, aprovados nos itens medidos do QA. Prévias em `render/<nome-do-vídeo>/previa-muda.mp4`.
- **Vídeo 1, greve dos caminhoneiros:** versão muda anterior, em 1080 x 1920 e sem partículas de luz. Falta a aprovação final.
- **Vídeos 11 e 24:** sem tema.
- **Aprovados por João:** 28 roteiros, 28 conjuntos de imagens, as seis paletas e os rostos. A aprovação final dos vídeos ainda não foi dada.

## A fazer

### Estética definitiva

**Atualização de 2026-11-08:** João aprovou o caminho de personagem 2D em cenário 3D no exemplo de Varginha/apagão e pediu estrelas à noite, nuvens de dia e personagem menos escuro sem perder as luzes dinâmicas. Isso agora é padrão do motor ilustrado (`motor/ambiente3d.js`), com direção e horário por cena. As próximas montagens preparam a base neutra do personagem automaticamente quando faltar ou estiver desatualizada. Cenas manuais sem marcas de camada ainda precisam ser separadas; fundos personalizados não identificados são preservados com aviso até receberem direção própria em `cenas3d.json`.

Na primeira atualização do motor não houve novo render. Depois foi produzido o piloto do apagão v2, descrito acima; as demais prévias continuam sendo da versão anterior. Conferir as novas âncoras e o QA na montagem de cada final. A próxima evolução deve atender ao feedback de mais cor e luminosidade.

Histórico da versão anterior, aprovada em 2026-11-07 com o piloto do ET de Varginha. Reprocessar um vídeo por vez, com calma, usando `bash motor/reprocessar.sh <slug>`.

- [x] ET de Varginha (piloto)
- [x] Confisco, apagão de 2001, Recife e hiperinflação (reprocessados em 2026-11-07; falta João assistir)
- [ ] Vídeos 7 a 30 (as cenas precisam ser geradas de novo com `python -I motor/desenhar-lote2.py` antes)
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

- [x] Criar voz original jovem no ElevenLabs, autorizada pelo João; perfil em `series/misterios-do-brasil/canal/voz-elevenlabs.json`.
- [x] Conferir plano pago ativo e licença comercial na página oficial.
- [x] Medir o piloto e registrar o ritmo em `series/misterios-do-brasil/canal/canal.md`; João gostou da narração.
- [ ] Conferir o ritmo real de cada nova gravação, sem acelerar texto para caber.

### Canal

- [ ] Definir as palavras proibidas, depois de ouvir a voz.
- [ ] Confirmar os padrões marcados como "a confirmar" em `series/misterios-do-brasil/canal/canal.md`.
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

- **Canal:** `series/misterios-do-brasil/canal/canal.md`
- **Pauta e calendário:** `series/misterios-do-brasil/radar/pauta-30-videos.md`
- **Roteiros 7 a 30:** `series/misterios-do-brasil/radar/roteiros-videos-7-a-30.md`
- **Paletas:** `series/misterios-do-brasil/radar/paletas-30-videos.md`
- **Personagem e rostos:** `series/misterios-do-brasil/personagens/`
- **Cada vídeo:** `series/misterios-do-brasil/roteiros/<nome-do-vídeo>/`

## Reconstrução de roteiros e método Blink — 2026-11-11

Pedido: analisar três PDFs de produção/roteiro, cruzar os roteiros do Tico com cinco resultados de Instagram/Reels e propor versões para Shorts/TikTok. Relatório em `referencias/pesquisas/reconstrucao-tico/relatorio.md`; método em `referencias/videos-analisados/METODO-BLINK-ROTEIROS.md`; índice dos rascunhos em `series/se-vira-tico/reconstrucao/reconstrucao-2026-11-11/README.md`.

- [x] Ler os três PDFs, identificar páginas úteis e separar princípios de orientações históricas de plataforma.
- [x] Auditar as métricas recebidas e preservar snapshots/divergências em `series/se-vira-tico/resultados/`, sem misturar com o canal Plotline.
- [x] Auditar cânone e roteiros EP1–6, distinguindo produção, pré-roteiro e variantes locais não aprovadas.
- [x] Registrar decisões do João: EP6 segue OUTRO MOTORISTA; remakes EP1–5 mantêm acontecimentos e usam perguntas retrospectivas.
- [x] Incorporar contrato editorial, prompt e rubrica de avisos ao método, com compatibilidade do gerador narrado e testes; não houve ajuste de pesos de IA.
- [x] Concluir seis masters e doze arquivos completos por plataforma; conferir 30 arquivos de proposta, contagens, tempos estimados, presença das falas e links do índice. Os seis contratos não apresentaram avisos estruturais; isso não aprova humor ou retenção.
- [x] Entregar o pacote em `render/tico-roteiros-shorts-tiktok-2026-11-11.zip` e copiar 48 arquivos verificados para `C:/Users/joaot/Projetos/se-vira-tico/render/propostas-roteiros-blink-2026-11-11/`, preservando as fontes canônicas.
- [ ] João revisar e escolher as novas versões de EP1–6 antes de voz, imagens ou render. EP6 tem prioridade para a estreia informada de 11/11 às 18h BRT; o horário não foi agendado por esta entrega.
- [ ] Na republicação do EP6, conferir se a janela de voto ainda está aberta; usar pergunta retrospectiva se já encerrada.
- [ ] Medir as versões publicadas em janelas comparáveis por plataforma. A reconstrução muda várias variáveis e não constitui teste causal.

Esta entrega de roteiros não inicia a unificação dos projetos no Blink Studio e não substitui episódios publicados.
