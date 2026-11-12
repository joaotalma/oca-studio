# Exemplo: personagem 2D em cenário 3D

Pedido de João em 2026-11-08: vídeo de exemplo com histórias e materiais já aprovados. Estudo visual isolado, sem substituir a estética do canal ou os vídeos existentes.

Reutiliza sem redesenhar as camadas aprovadas do personagem em `et-de-varginha/assets/c16a-voce.png` e `apagao-2001/assets/c20a-voce.png`, com suas versões de olhos fechados. As quatro frases são transcritas de `falas.js` desses episódios; só há hipóteses, sempre marcadas com E SE. Direitos e fontes continuam nos episódios de origem. Nenhuma afirmação histórica nova.

O fundo é geometria tridimensional procedural, projetada em perspectiva: muros com espessura, casas com telhados, chão, calçadas, postes e janelas. O personagem continua sendo um recorte 2D. Não é vídeo gerado por um modelo de IA, nem somente zoom na imagem completa. É uma proposta de movimento a partir da arte existente. Os cenários são ilustrações, não reconstruções de locais reais.

16 segundos, 1080 × 1920, 30 fps. Sem áudio: não existe narração fornecida no projeto. Aprovações anteriores de roteiro e personagem são preservadas; o novo estudo visual e o vídeo não recebem aprovação em nome de João. Uma adoção no canal depende da avaliação dele.

Referências internas de linguagem: cenas aprovadas c16a de Varginha (muro, terreno e criatura) e c12a/c13a do apagão (casas e postes). Estratégias consideradas: fundo plano com paralaxe; passeio longo entre cenários; duas vinhetas em perspectiva. Escolhida a última para comparar o efeito em dois temas sem alterar os roteiros.

Relógio: leitura. Um deslocamento lateral suave em Varginha; aproximação suave no apagão. Oclusão, sombra de contato e faces com luz distinta tornam a profundidade verificável. As legendas ficam acima do rosto. Sem trilha, CTA ou voz para esta amostra.

Revisão pedida por João durante a montagem: aproximar o enquadramento, reduzir chão vazio, usar câmera com intenção, detalhar os cenários e ligar a luz do personagem à fonte visível. Varginha tem poste à direita; o apagão tem janela à direita. A janela, a luz sobre o lado direito do personagem, a iluminação das superfícies e os reflexos no chão usam a mesma curva de acendimento, de 11,25 a 12 s. As cores-base e o desenho do personagem são preservados; a luz é aplicada sobre o recorte. Sombras antigas da imagem são removidas para substituição por sombras no plano do chão. O teste de luz compara pixels da textura do personagem antes e depois do acendimento, além de conferir o valor sincronizado da fonte.

Preparação: `node experimentos/2d-cenario3d/preparar.mjs`. Inspeção: `node experimentos/2d-cenario3d/conferir.mjs`. Render com o exportador existente, definindo FILM=render/exemplo-2d-3d/film.html, W=1080 e H=1920, a 30 fps.

Exportação: `node experimentos/2d-cenario3d/renderizar.mjs`. Depois: `node experimentos/2d-cenario3d/validar.mjs`, que mede o MP4 v3 e gera as folhas a partir do próprio vídeo. A v3 corrige o recorte do chão no plano próximo da câmera; a v2 foi retida para diagnóstico.
