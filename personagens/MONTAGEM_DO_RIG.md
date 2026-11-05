# Montagem do rig dos personagens (membros conectados)

Problema: braços e pernas pareciam peças soltas coladas no corpo.
Causa: cada segmento tinha contorno próprio, então a ponta redonda de cada peça aparecia como círculo/linha sobre a peça vizinha, e as pontas das canelas vazavam por baixo dos sapatos.

## Regras (de animação de recorte: Toon Boom, Spine, tutoriais de rig 2D)
1. Dê a cada parte sua própria camada e ligue em cadeia: coxa -> canela -> pé; braço -> antebraço -> mão. O pivô fica no centro da junta.
2. Cubra a junta com forma redonda. Pontas de peças que se sobrepõem devem ser círculos, para que não abra buraco em nenhum ângulo.
3. Desenhe a parte escondida inteira, por baixo da vizinha (o antebraço entra por baixo da manga; a canela, por baixo do sapato).
4. Peças da mesma cor viram uma silhueta só: contorno de todas por baixo, preenchimento de todas por cima. Sem linha de emenda.
5. Esconda juntas fracas sob adereços (manga, barra da calça, sapato, crachá).
6. Peças de cor diferente se encontram em ponta redonda (manga redonda sobre o antebraço de pele).

## Como ficou no código (versão final, chars.js / drawChar)
Linhas soltas com ponta redonda davam aspecto de palito. Agora cada membro é uma forma afilada de verdade:
- Perna: coxa (quad afilado) + círculo no joelho + canela (quad afilado) + círculo no tornozelo, tudo numa silhueta só (merge: contornos por baixo, preenchimentos por cima). O pé cobre o tornozelo; tornozelo a 20 px do chão com a perna reta.
- Braço de pele (antebraço + mão): começa DENTRO da manga, passa pelo cotovelo (círculo) e termina numa mão oval alinhada com o antebraço. Uma silhueta só.
- Manga: forma fechada, desenhada ANTES do braço de pele (ver correção abaixo). Pontos: ponto do ombro no contorno do tronco, bainha reta (punho) a uma fração do braço, axila e uma curva (cava) ligando axila e ombro. A cava toca o contorno nas duas pontas, então lê como costura de manga e não como linha solta.
- Comprimento da manga por personagem (d.sleeve): Tico .5 (camiseta), Lua .8, Bia .88, Jão .9.
- Ordem de camadas: pernas, saia, bolsa (Jão), cabelo de trás, pescoço, tronco, detalhes (lapela, crachá, alças), mangas, braços de pele + objeto na mão (o objeto vem antes da mão, que o segura), cabeça, cabelo da frente.

## Para o motor (Take One)
- Cada personagem é função de (pose, expressão, boca): pose = ângulos { armL:[ombro,cotovelo], armR, legL, legR, lean }.
- Ângulo medido a partir de "reto para baixo", em graus; a animação só interpola esses 5 pares + lean, então não há emenda para se soltar.
- Pose do café da Lua: armR = [8, 150]. Braço cruzando o peito até a boca ficou poluído com o crachá; fica para plano fechado.

## Correção: braço levantado e antebraço dobrado (3ª versão)
Erros que apareceram nas poses: a manga ficava por cima do antebraço dobrado, e com o braço levantado a forma da manga se cruzava.
- A manga agora é desenhada ANTES da pele. O trecho de pele punho->cotovelo é cortado exatamente na linha do punho (clipPath), então nasce da bainha. Antebraço e mão ficam à FRENTE da manga, mesmo dobrados de volta sobre ela.
- Lado "de cima" da manga: perpendicular ao braço que aponta para cima; com o braço quase vertical, usa-se o lado de fora. Axila fixa no tronco (side*(tw - 1.3*hs), ty+46), independente da pose, então a cava nunca se cruza.
