# QA do exemplo 2D + cenário 3D

Data: 2026-11-08. Arquivo de entrega: `render/exemplo-2d-3d/exemplo-2d-3d-v3.mp4`.

É um estudo visual mudo de 16 s para avaliação de João. Não recebe aprovação final em nome dele e não é tratado como episódio pronto para publicar.

## O que foi medido

- Exportação: 1080 × 1920, 30 fps, H.264, 480 quadros, 16 s, sem faixa de áudio.
- Antes da última correção geométrica, a inspeção do render confirmou ausência de erros de página, determinismo e luz sincronizada entre janela e personagem. Em 11,6 s, ambos têm potência 0,4501; em 12 s, ambos chegam a 1. Dois pixels da textura foram comparados: o canal vermelho subiu 11 níveis à direita e 0 à esquerda. Essa amostragem não mede toda a iluminação; a direção também foi conferida visualmente.
- Na v3, o vídeo inteiro foi decodificado em 270 × 480 para medir movimento entre quadros: mínimo de 0,867% e mediana de 2,545% de área alterada por quadro. Nenhuma pausa involuntária sob o critério de 0,5% do gate.
- As únicas diferenças abruptas detectadas na v3 estão nos quadros 120, 240 e 360: trocas planejadas aos 4, 8 e 12 s. Os saltos involuntários da v2 nos quadros 200 e 425 foram corrigidos recortando as faces no plano próximo da câmera, em vez de descartar a face inteira.
- A saída completa da medição final da engine fica em `render/exemplo-2d-3d/qa-automatico-v3.txt`; os dados do arquivo ficam em `arquivo-v3.json`.
- Resultado final da engine na v3: **aprovado nos itens medidos**, incluindo os sete itens do gate. Arquivo com 5.226.646 bytes. A folha de 16 quadros extraída do MP4 foi examinada após a correção do chão; personagem, janela, legendas e enquadramentos permanecem legíveis.
- O validador de timeline retornou zero erros. Dois avisos foram considerados inaplicáveis ao estudo: não há termos de busca obrigatórios para uma amostra visual e todo o vídeo é silencioso, sem desenho sonoro ou pico musical.

## Conferência visual e revisão independente

Foram examinados os quadros de abertura, revelação da criatura, corte entre cenários, janela apagada, acendimento, janela acesa e encerramento. Na primeira versão, a revisão apontou excesso de chão e janela pequena. Ambos foram ajustados.

A segunda revisão independente confirmou personagem sólido, sem aparência translúcida, luz coerente à direita, sombra para o lado oposto, janela visível e melhor ocupação do quadro. A câmera revela a criatura em Varginha e aproxima a reação do personagem no apagão. O movimento contínuo é complementado pela medição do MP4, não por alegação de ter assistido ou ouvido o arquivo inteiro.

Sugestão opcional: mais luz quente na parede imediatamente ao redor da janela no plano final. A casa usa geometria e iluminação estilizadas; não é uma simulação física completa de luz indireta.

## Conteúdo e direitos

Quatro frases copiadas dos roteiros próprios já aprovados. A origem está em `FACTS.md`; nenhuma afirmação histórica nova. `E SE...` permanece na tela durante toda a amostra. Personagem aprovado preservado, com luz aplicada sobre o recorte. Arte do cenário criada no Plotline, sem material audiovisual externo. Fonte Barlow Condensed sob SIL OFL 1.1. Sem voz, música ou áudio sintético.

## Limites

- Som, interpretação e sincronismo com narração: não conferidos; não há áudio.
- Desempenho em plataforma ou promessa de alcance: não avaliado.
- O cenário é uma ilustração de hipótese, não uma reconstrução fiel de Varginha ou de uma rua real.
- Atualização posterior de 2026-11-08: João aprovou o caminho visual e pediu incorporá-lo ao motor com estrelas/nuvens e personagem menos escuro, preservando as fontes dinâmicas. Esses ajustes foram implementados sem novo render. A aprovação de cada episódio final continua individual.
