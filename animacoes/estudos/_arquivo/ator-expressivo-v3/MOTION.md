# Convenções do estudo

Tempo absoluto em segundos; qualquer quadro pode ser renderizado em qualquer ordem. Poses vêm de `atuacao.mjs`; `filme.mjs` só desenha. Sem `Math.random`, relógio do sistema ou acumulação de deltas na atuação.

Pivô de corpo no quadril; cabeça no pescoço; braços em ombro/cotovelo/punho; pés em coordenadas fixas, pernas resolvidas por dois ossos. A cabeça usa squash local moderado e escala inversa em X para conservar área; isso não simula volume 3D. Não aplicar squash à imagem inteira.

Um gesto principal por bloco. Antecipação, reação, ultrapassagem e acomodação são poses explícitas. Olhar pode anteceder a cabeça. Pálpebras fecham mais rápido do que abrem; piscadas não reiniciam por plano. Expressões e sobrancelhas são assimétricas quando a intenção pede.

Ator em dois opcional: dois frames por pose no filme a 30 fps = 15 poses/s. Texto e câmera não herdam a quantização do ator. Não usar essa cadência como correção automática para uma atuação ruim.

Traços do original: cabelo cacheado, mecha prateada, pinta, risco na sobrancelha, jaqueta ferrugem/creme/mostarda, jeans e tênis claros. Não usar elenco do rig legado. Assets derivados de `personagens/voce-ficha.svg`; não há personagem de referência copiado.

Testar `node experimentos/ator-expressivo-v3/testar.mjs`. Preparar assets: `node experimentos/ator-expressivo-v3/preparar.mjs`. Render: `node experimentos/ator-expressivo-v3/renderizar.mjs`. Folhas: Python com Pillow em `folhas.py`.

Limites: estudo frontal, mãos ainda simplificadas, mandíbula sem contorno independente, sem coarticulação, contato com objetos, caminhada, giro 3/4, luz 3D ou sincronização de fala. Nada disso pode ser marcado como entregue só por existir uma boca aberta.
