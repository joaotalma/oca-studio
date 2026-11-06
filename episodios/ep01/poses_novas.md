# Poses e recursos novos do episódio 1

## Precisam de mudança no rig

| Item | Fala ou cena | Por quê |
|---|---|---|
| Tico sentado na calçada | "Dez minutos depois" | O rig não tem pose sentada |
| Bag vermelha em qualquer personagem | Cena 1 em diante | Hoje a mochila é fixa no Jão |
| Boca e olhos da Dona Marlene e do Borracheiro | Cenas 3 e 6 | Personagens novos no mesmo rig |
| Tico pilotando | Fala 6 | Mostrado do quadril para cima, com `semPernas` |
| Bolo apoiado na mão | Cena 3 | Fica sempre nivelado, como uma bandeja |
| Objetos novos na mão: chave, bolo, chave de roda, pão com vela | Cenas 1, 3 e 6 | Hoje só existem `phone` e `cup` |

## Dá para fazer com o rig atual

Valores iniciais, a ajustar no estúdio.

| Gesto | Fala | Pose |
|---|---|---|
| Mãos juntas pedindo | 1 | `armL: [-35, 150], armR: [35, -150], frente: 'R'` |
| Estender a chave | 2 | `armR: [70, 75]` |
| Apontar para o alto | 4 | `armR: [150, 170]` |
| Mãos na cabeça | 8 | `armL: [-130, 150], armR: [130, -150]` |
| Apontar para a porta | 15 | `armR: [85, 90]` |
| Estender a mão | 14 | `armR: [55, 75]` |
| Acenar | 32 | `armR: [128, 150]` |
| Dedo em riste | 30 | `armR: [75, 140]`, `expr: 'bravo'` |

## Pilotagem

Visão do guidão: a câmera fica presa nele, voltada para o piloto, e a estrada foge atrás. O rig mostra o piloto do quadril para cima, com `semPernas`. Quando a moto está parada, ela aparece de perfil, ao lado do personagem. Vista lateral dos humanos segue fora do rig.
