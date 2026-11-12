# Movimento e revisão de forma

Esta revisão altera o desenho sobre a atuação v3, sem retemporizar a sequência. `atuacao.mjs` é uma cópia local do estado avaliado da v3; `anterior.mjs` é um recorte do renderer anterior para comparação, ambos gerados por `preparar.mjs`. Não depende de outro projeto.

Articulações mantêm os pivôs e comprimentos; contornos de mangas e calças usam curvas cúbicas com tangente comum no cotovelo/joelho e espessura variável. Não se aplica blur ao personagem para esconder juntas.

Tecido segue o tempo absoluto quantizado do ator, com respiração pequena e atraso de 130 ms em relação à inclinação do tronco. Não há simulação física de roupa.

Ator desenhado numa camada em 2× com margem para mãos e cabeça. A mesma máscara produz a sombra projetada; penumbra e contato são separados. A planta é composta após a sombra para não receber uma projeção indevida sobre suas folhas. Pés continuam apoiados; sombra não pulsa sozinha.

Boca é um contorno contínuo; arcada curva recortada dentro dela. Queixo, bochechas e parte inferior das pálpebras acompanham o sorriso. Sem alinhamento de fonemas nesta prova muda.

Olhos: contorno amendoado, íris parcialmente coberta, foco comum com pequena convergência e aberturas assimétricas. Desconfiança tensiona uma sobrancelha e diferencia os olhos em vez de baixar ambos igualmente. Reflexo principal pequeno, sem segundo brilho idêntico. Não adicionar tremor aleatório à pupila. Sorriso usa bochecha/pálpebra inferior; surpresa abre com intenção, sem manter aro branco em volta de toda a íris.

Por direção posterior do João, a opção padrão do estudo remove a íris colorida. `olhos.mjs` define pupila preta com raio e brilho por intenção; espanto contrai e alegria amplia como exagero gráfico. `eyeFocus` guia a curiosidade para um lado, a desconfiança para o outro, e o repouso para o centro. A versão colorida permanece em `eyeStyle: 'iris'` para comparação. Não usar mudança aleatória de tamanho nem só percorrer a tela com a pupila.

Cada quadro limpa explicitamente o estado Canvas. Cabelo/orelhas são rasterizados uma vez em 3×; a ordem das poses não escolhe a resolução da imagem. A checagem de pixels usa sequência e ordem inversa.

Executar `node experimentos/ator-organico-v4/preparar.mjs`, depois `node experimentos/ator-organico-v4/testar.mjs` e `node experimentos/ator-organico-v4/renderizar.mjs`. O render usa Chrome local e FFmpeg; saídas em `render/ator-organico-v4/`. Gerar folhas com `folhas.py` e Python/Pillow.

Limites da comparação: a revisão inclui luz/desenho do personagem e sombra, não apenas suavização de contorno. Layout, tempos e painel esquerdo são controlados; não se declara o fundo inteiro pixel idêntico dentro da região coberta por ator/sombra.
