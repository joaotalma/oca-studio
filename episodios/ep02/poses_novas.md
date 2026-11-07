# Episódio 2: poses e desenhos novos

## Tico empurrando a moto (cena 3b, montagem)

**Direção do autor:** o Tico anda ao lado da moto, com ela vindo na direção da câmera e a estrada sumindo ao fundo. A referência serve só para o enquadramento e não entra no repositório nem no vídeo.

**Enquadramento**

- **Moto:** em primeiro plano, à esquerda e embaixo, em três quartos de frente. A roda dianteira fica grande e cortada pela borda da tela.
- **Tico:** à direita da moto, um pouco mais atrás, de corpo inteiro e virado para a câmera. As pernas ficam visíveis ao lado da moto.
- **Fundo:** a estrada em perspectiva de `estradaSVG`, com o ponto de fuga atrás dele. A rua se move devagar, no ritmo de quem anda.

**Pose do Tico**

- **Braços:** os dois vão para a esquerda da tela e seguram as pontas do guidão. O braço do lado da moto fica quase esticado, e o outro, dobrado na frente do corpo.
- **Tronco:** inclinado na direção da moto, com a cabeça um pouco baixa.
- **Pernas:** o passo sem sair do lugar, já existente no rig.
- **Rosto:** `cansado`, com `suor`. A expressão muda ao longo dos três planos.

**O que precisa ser criado**

- **`motoFrenteSVG`, em `personagens/cenarios.js`:** a `motoSVG` atual é só de perfil. A nova usa as mesmas cores e o adesivo "Companheira" no tanque, com o motor desligado e as rodas girando devagar.
- **Ordem de desenho:** estrada, Tico e moto por cima, com as mãos dele sobre as pontas do guidão para não se soltarem.
- **Linhas de fedor e camiseta escurecendo:** crescem do primeiro ao terceiro plano.

**A conferir:** testar a pose em `personagens/estudio.html` antes de animar. Se as mãos não alcançarem o guidão, ajuste a posição da moto, não o comprimento dos braços.

## Outras poses e desenhos

- **Letícia na garupa:** visão do guidão, atrás do Tico, com o celular de live na mão.
- **Os dois no ar:** a pose da lombada, com a moto saindo do chão.
- **Cheirando a axila:** braço levantado e cabeça virada para o lado. Conferir se os membros continuam conectados.
- **Vendedor de paçoca:** personagem novo, calvo e barrigudo, sentado num banco, com a caixa no colo.
