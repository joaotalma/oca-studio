# Montagem do rig dos personagens

Rig V12, em `chars.js`. Use `estudio.html` para experimentar poses e expressões.

## Regras

1. **Silhueta contínua:** peças da mesma cor viram uma só. Primeiro todos os contornos, depois todos os preenchimentos, sem linha de emenda.
2. **Juntas redondas:** ombro, cotovelo, quadril e joelho têm um círculo na junta, para não abrir buraco em nenhum ângulo.
3. **Membro por ângulo:** cada membro sai da posição da junta anterior. A animação só interpola ângulos, então nada se solta.
4. **Chão automático:** o corpo é posicionado para que o pé mais baixo fique em y = 0. Não ajuste a altura à mão.
5. **Sem emenda na manga:** a manga sai do ombro, e um círculo sem contorno apaga a costura sobre o tronco. Com o braço abaixado, a linha interna da manga fica visível e funciona como a dobra da axila.
6. **Pele sobre o tecido:** o braço de pele nasce na bainha, sempre por cima, por isso o antebraço dobrado passa à frente da manga.
7. **Manga longa dobrada:** com mais de 55° de dobra no cotovelo, o antebraço de tecido é desenhado à parte, para a dobra aparecer.

## Pose

`drawChar(CHARS.tico, pose)` e `drawDog(estado ou pose)` devolvem texto SVG.

| Campo | O que faz |
|---|---|
| `armL`, `armR`, `legL`, `legR` | `[junta de cima, junta de baixo]` em graus absolutos a partir de "reto para baixo"; negativo aponta para a esquerda da tela |
| `lean` | Inclina o tronco para os lados |
| `head` | Inclina a cabeça para os lados |
| `expr` | Uma das expressões de `EXPR_ORDER` |
| `mouth` | Boca de fala: `closed`, `small`, `open`, `wide`; tem prioridade sobre a boca da expressão |
| `detalhe` | `suor`, `lagrima`, `veia` ou `brilho`; aceita uma lista |
| `blink` | Fecha os olhos a partir de 0,5 |
| `breath` | Sobe o tronco, em pixels |
| `liftL`, `liftR` | De 0 a 1: encurta a perna para o passo visto de frente |
| `propL`, `propR` | Objeto na mão: `phone` ou `cup` |
| `frente` | `'L'` ou `'R'`: desenha esse braço à frente do rosto |

No Fiscal, `fN` e `fF` são as patas da frente, de perto e de longe, e `bN` e `bF`, as de trás. Os outros campos são `head`, `tail`, `expr`, `mouth` (de 0 a 1), `blink` e `breath`.

## Ordem das camadas

1. Mochila e cabelo de trás
2. Sapatos e calça
3. Tronco, pescoço e crachá
4. Braços, exceto o marcado em `frente`
5. Cabeça e cabelo da frente
6. Braço marcado em `frente`

## Poses úteis

- **Café da Lua:** `armR: [8, 150], propR: 'cup'`
- **Celular:** `armR: [18, 150], propR: 'phone'`
- **Mãos na cintura:** `armL: [-55, 40], armR: [55, -40]`
- **Aceno:** `armR: [128, 150]`
- **Mão no queixo:** `armR: [22, 165], frente: 'R'`

## Limitações

- Humanos só têm vista de frente; o Fiscal só tem perfil, virado para a esquerda.
- Andar é um passo sem sair do lugar. O deslocamento vem da posição animada no filme.
- A cabeça só inclina para os lados, não para a frente.

## Pernas

Personagem de corpo inteiro sempre tem pernas. `semPernas` serve só para enquadramentos em que a cintura não aparece. O motor confere isso quadro a quadro: se o corte da cintura ficaria à vista, ele ignora `semPernas`, desenha as pernas e avisa no console. Quando algo em primeiro plano esconde o corte, como o guidão ou a moldura do celular, declare `cobrePernas: true` no plano.
