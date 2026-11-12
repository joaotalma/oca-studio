# Estudo visual 2D: técnicas do Plotline no elenco do Tico

**Status:** aprovado pelo João em 10/11/2026 ("Pode aplicar") e aplicado às fontes compartilhadas: `personagens/chars.js` (`RigOrganico`, `sombraSVG`, `setEstiloRig`), `personagens/cenarios.js` (`PortaRica`) e `personagens/motor.js` (sombra antes dos atores). Ver `docs/ACABAMENTO_VISUAL.md`. Desde então, `organico.js` é só uma ponte, e o estudo continua comparando os estilos 'classico' e 'organico'. Episódios publicados não mudaram.

## Como funciona

- `organico.js` carrega depois de `chars.js` e troca, por chave, as funções do rig: olho, boca, braço, pernas e tronco. Com `Organico.ativar(false)`, o rig desenha exatamente como o original, e o teste 1 confere isso byte a byte. Isso permite o antes e depois no mesmo quadro.
- **A API não muda.** `drawChar(d, pose)` continua igual. O único campo novo, e opcional, é `pose.look = [x, y]`, o foco do olhar dos dois olhos. Sem ele, vale o olhar da expressão.
- `cenario-rico.js` é a porta do Conjunto Esperança com mais profundidade. Usa o mesmo formato de camadas de `CENARIOS`.
- `estudo.js` tem a atuação e a composição: 13 s, sem som, Tico e Lua, com as mesmas poses nos dois painéis.
- `film.html` gera o comparativo, com o rig atual em cima e o estudo embaixo. `depois.html` gera só o estudo, em 9:16 cheio.
- `preparar.sh` copia as fontes compartilhadas para a pasta. As cópias ficam fora do git.

**Nada é importado do Plotline.** `ribbon`, `pupil`, `eyeFocus`, `roundMouth` e `shadow` foram reescritos para o SVG e para os ângulos do rig do Tico.

## O que foi implementado

| Pedido | No estudo |
|---|---|
| Corpo orgânico | Braços e pernas seguem duas curvas com tangente comum na junta, como o ribbon do Plotline. O cotovelo e o joelho ficam redondos e preservam pivôs, comprimentos e apoio dos pés. As mangas têm volume e barra reta. Há dobras no lado de dentro da junta quando ela dobra, vinco na calça e sombra interna do lado oposto à luz. O tronco ganhou sombreado de volume e dobras. |
| Olhos | O olho tem forma de pálpebra, sem círculo. A pupila é preta, sem íris colorida. O foco é comum aos dois olhos, com uma leve convergência. O tamanho muda com a emoção: maior na alegria, menor no susto. O brilho é pequeno e fica do lado da luz. A desconfiança fecha um olho mais que o outro, sem baixar os dois por igual. A bochecha empurra a pálpebra de baixo no sorriso sincero. |
| Boca e dentes | A arcada é uma faixa curva recortada dentro da boca, com dois sulcos discretos. Há língua no riso e nos visemas abertos. O sorriso sincero levanta os cantos e a bochecha. O sorriso forçado estica os cantos para os lados, sem subir, mostra as duas arcadas fechadas e tem tensão nos cantos. O susto é um "o" redondo. |
| Atuação | Os movimentos seguem as etapas perceber, preparar, agir, reagir e acomodar. O olhar chega antes da cabeça. Há antecipação e ultrapassagem pequena no gesto do convite e no dar de ombros. Cabeça, braços e tronco têm tempos próprios. A piscada fecha mais rápido do que abre. |
| Sombra | Há contato denso sob cada sola apoiada. A projeção da silhueta corre no chão e sobe pela parede, deslocada para longe da luz (sol à direita de dia, poste à direita à noite). A ordem de desenho é cenário, sombra e ator. |
| Cenário | A porta do Conjunto ganhou camadas: céu em gradiente com nuvens ou estrelas, prédios com névoa de distância, marquise, batente com espessura, degrau, interfone, caixas de correio, janela gradeada com cortina, tijolo aparente, cano, rodapé de azulejo, calçada em perspectiva, meio-fio e bueiro. A luz é motivada: o sol entra pela direita de dia, e à noite há o poste com cone e poça de luz, a janela e a porta acesas. As placas, o vaso, a lixeira, os fios e o reboco da cena original foram mantidos. |

## O que foi conferido

- **`node testar.mjs`:**
  - desligado, o rig é idêntico ao original;
  - os quadros não têm NaN, undefined ou Infinity;
  - a ordem direta e a inversa geram o mesmo SVG;
  - o rig fica desligado ao fim de cada quadro;
  - os 11 personagens funcionam com as 13 expressões e as 4 bocas, incluindo mão com celular;
  - dobras extremas e foco exagerado continuam com coordenadas finitas.
- **Quadros em 1080x1920, nos dois arquivos:**
  - rosto próximo, corpo inteiro, dia e noite;
  - olhos (foco para os dois lados, desconfiança, susto e alegria);
  - dentes (sorriso sincero, forçado e riso);
  - mãos (convite, mão na cintura e celular);
  - sombra no chão e na parede.
- **Pés presos à perna:** depois do aviso do João ("pé flutuando"), a barra da calça passou a terminar pela distância real até o tornozelo, com a canela entre a barra e o calçado. O degrau foi recuado para junto da parede, para os pés pisarem na calçada com sombra de contato. A correção foi conferida em recorte ampliado, no comparativo e na tela cheia.

## O que ainda falta ou fica para depois

- **Fiscal:** o rig do cachorro não mudou e precisa de uma adaptação própria.
- **Fala sincronizada:** os visemas novos (`vsmall`, `vopen`, `vwide`) desenham, mas não foram testados com áudio real. O estudo é mudo.
- **Mãos:** continuam as mesmas do rig. O celular segue o ângulo do antebraço, então ainda aparece inclinado em algumas poses.
- **Perfil e 3/4:** não existem no rig e não foram tentados.
- **Fundo 3D:** fica para depois, como combinado.
- **Os outros cenários** (rua, carro, cozinha, quartos e outros) ainda não receberam o tratamento da porta do Conjunto.
- **Aplicação em lote:** depois do aceite, o código passa para `personagens/chars.js`, para `personagens/cenarios.js` e para o motor (a sombra entra na ordem das camadas). Também é preciso atualizar `docs/ACABAMENTO_VISUAL.md` e `personagens/MONTAGEM_DO_RIG.md`, e só então propagar a episódios novos. Episódios já publicados não mudam.
- **Custo de render:** o quadro novo tem mais elementos (sombra e recortes). Medir o tempo num episódio inteiro antes de adotar.
