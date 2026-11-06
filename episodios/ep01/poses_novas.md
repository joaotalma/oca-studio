# Poses e recursos novos do episódio 1

## Precisam de mudança no rig

| Item | Fala ou cena | Por quê |
|---|---|---|
| Tico sentado na calçada | "Dez minutos depois" | O rig não tem pose sentada |
| Bag vermelha em qualquer personagem | Cena 1 em diante | Hoje a mochila é fixa no Jão |
| Boca e olhos da Dona Marlene e do Borracheiro | Cenas 3 e 6 | Personagens novos no mesmo rig |
| Fiscal com a cabeça dentro da bag | "Dez minutos depois" | A cabeça dele não sai do lugar |
| Fiscal com a embalagem na boca | Corte da cena 5 | O focinho não segura objetos |
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
| Fiscal olhando para a câmera | "Dez minutos depois" | A cabeça dele já é frontal |

## Cenas sem pilotagem

Ninguém aparece pilotando, porque os humanos só têm vista de frente. O Tico fica ao lado da moto de perfil nas cenas 1, 2 e 3. Quando a moto se desloca, a cena muda antes de ela andar.
