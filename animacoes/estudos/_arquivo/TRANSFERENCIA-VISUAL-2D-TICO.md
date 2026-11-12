# Transferência de direção visual 2D para o Se Vira, Tico

2026-11-09 · Solicitada pelo João. Escopo: personagem, atuação, boca/olhos, sombra e cenários 2D. O teste de fundo 3D fica fora desta transferência.

## Referência aprovada e limite da entrega

João aprovou a versão final do estudo `experimentos/ator-organico-v4/`, painel direito do comparativo de 12 s: “Ficou perfeito!”. A aprovação cobre a direção visual mostrada. A versão usa pupila preta sem íris colorida, foco por intenção, contornos mais orgânicos e boca integrada ao rosto.

O pacote contém código de estudo executável, exemplos renderizados, testes, notas de revisão e este guia. Ele é material para **adaptar o elenco e os cenários do Tico**; não é uma atualização já aplicada ao motor dele. O ator do Plotline serve apenas para demonstrar técnicas. Não transferir seu cabelo, roupa, cores, sinais ou identidade para o Tico.

| Item | Estado no Plotline | Como levar ao Tico |
|---|---|---|
| Curvas de roupa/membros, boca, olhos e gestos | Implementados no estudo v4 e aprovados | Adaptar ao rig e proporções de cada personagem |
| Pupila preta, foco/brilho/tamanho por emoção | Implementados e aprovados | Opção gráfica para os humanos, preservando os dados antigos como compatibilidade |
| Sombra da silhueta + contato das solas | Implementados como aproximação 2D | Integrar ao acabamento por plano, respeitando luz, chão e oclusão |
| Cenário 2D de teste claro/colorido e composição em camadas | Implementado no comparativo | Aplicar princípios aos lugares específicos do universo Tico |
| Cenários ricos genéricos para qualquer pauta | Direção e critérios, não biblioteca universal pronta | Evoluir os cenários compartilhados que o Tico já tem |
| Fala sincronizada, mãos conduzindo objeto, caminhada, 3/4/perfil | Ainda precisam de prova própria nesta evolução | Preservar o que o Tico já oferece e validar melhorias, sem declarar capacidade inexistente |
| Personagem novo sobre fundo 3D | Teste solicitado para depois | Fora deste escopo 2D |

## 1. Corpo com desenho, não aparência de boneco

- Silhueta contínua, com curvas cúbicas/quadráticas e espessura variável sobre as articulações. Evitar dois segmentos grossos com uma quina no encontro.
- Cotovelo e joelho com tangente suave e volume preservado; preservar pivôs e comprimentos. Não trocar uma junta angular por borracha sem anatomia.
- Mangas com volume e dobras localizadas; roupa acompanhando peito, quadril e inclinação, com pequeno atraso na acomodação.
- Ombros integrados ao tronco, sem pico junto à gola; punhos e tênis arredondados. Conferir a silhueta em repouso e na pose extrema.
- Pés apoiados, joelhos com flexão motivada, sem losango permanente ou deslizamento. Não adicionar balanço global para esconder falta de atuação.

Referência de algoritmo: `formas.mjs`, função `ribbon`; uso em `filme.mjs`, funções `sleeve`, `trouser`, `torso` e `paintActor`. O Tico usa SVG e outro sistema de coordenadas/ângulos: aproveitar o contorno, não copiar os valores do corpo do Plotline.

## 2. Olhos gráficos com intenção

- Branco do olho + pupila preta, sem aro de íris colorida na opção nova.
- Foco comum dos dois olhos, com pequena assimetria e convergência. Olhar encontra o alvo antes ou junto da cabeça; sem varredura ou tremor aleatório.
- Pupila pode diminuir no choque e aumentar na alegria como exagero gráfico, não simulação fisiológica. Intensidade regulável: surpresa leve não precisa parecer pânico.
- Reflexo pequeno e coerente com a luz. Não usar brilhos grandes idênticos que façam os olhos parecer vidro.
- Pálpebras mudam a forma por emoção. Desconfiança usa tensão de sobrancelha e aberturas diferentes; baixar os dois olhos por igual pode parecer sono.
- Alegria envolve bochecha, pálpebra inferior e boca; piscar sozinho não dá vida. Piscada fecha mais rápido do que abre e não reinicia automaticamente em cada corte.

Referência: `olhos.mjs` (`pupil`, `eyeFocus`) e `filme.mjs` (`face`). Opção colorida preservada por `eyeStyle: 'iris'` no estudo, para comparação. Manter a identidade e diferenças entre Tico, Lua, Jão e Letícia; não dar a todos a mesma cara ou a mesma atuação. Fiscal pede adaptação própria ao rig canino.

## 3. Boca, dentes e rosto como conjunto

- Arcada superior contínua e curva, recortada dentro da boca; poucas divisões discretas. Evitar retângulo branco ou grade de dentes.
- Lábios, cantos, bochechas e queixo acompanham abertura, sorriso e intensidade. Língua fica subordinada à expressão.
- Separar sorriso fechado, sorriso aberto, riso e sorriso forçado. No Tico, `forcado` é recurso de personalidade e não deve virar alegria sincera.
- Preservar as bocas/tempos de fala já existentes no Tico. As oito formas do estudo não comprovam alinhamento de fonemas nem substituem o áudio real.
- Pausas fecham/relaxam a boca; não abrir e fechar por seno ou pelo número da legenda. Volume de áudio sozinho não determina fonema.

Referência: `formas.mjs` (`roundMouth`), `filme.mjs` (`headBase`, `face`) e folhas `bocas.png`/`sorrisos.png`.

## 4. Atuação e cadência

Uma intenção principal por bloco: perceber → preparar → agir → reagir → acomodar. Usar antecipação, arcos, ultrapassagem pequena e atraso de partes. Poses fortes sustentadas são válidas; não movimentar tudo o tempo inteiro.

O estudo anima o ator em dois a 30 fps, isto é, 15 poses/s. A 24 fps seriam 12. Câmera, legendas e objetos de leitura mantêm seus próprios relógios. O Tico deve conservar seu FPS de produção até comparar as opções; não reduzir o vídeo inteiro para fingir acabamento artesanal.

Smear, linhas de ação e squash/stretch são recursos pontuais. Não deformar o ator inteiro, borrar a imagem para esconder juntas ou aplicar aberração/grão/tremor em todas as cenas. Nenhum filtro substitui boa pose.

## 5. Cenários 2D mais ricos, sem poluição

O Tico **já tem** camadas, paralaxe, rua detalhada e acabamento. Preservar esse avanço. A evolução é tornar os lugares mais específicos e os objetos úteis à ação, sem trocar o universo pela cozinha do Plotline.

- Primeiro/meio/fundo com sobreposição clara, perspectiva coerente e variação de escala. Paralaxe discreta só quando a câmera exigir.
- Cor local viva e legível; base quente com contraponto turquesa/verde do universo Tico. Reservar maior contraste/detalhe ao rosto, mão ou objeto decisivo.
- Luz motivada por janela, sol, poste ou aparelho, com preenchimento suficiente. Noite não pode apagar olhos/pele. Não sobrepor uma camada amarela sobre o rosto inteiro.
- Fachadas, portas, piso, objetos usados e pequenos sinais de vida específicos do local. Quantidade de detalhes não é riqueza: retirar o que disputa atenção com a piada.
- Casa/prédio: profundidade de porta/janela, planos de parede e piso, móveis/objetos da situação; espaço para o gesto e a legenda.
- Rua: conservar fachadas, toldos, árvores, fios, drenagem e tráfego já existentes; variar distância, material e função. Evitar duplicar estrada ou aplicar a mesma rua em qualquer lugar.
- Local de bico/trabalho: balcão, equipamento e circulação que tornem a tarefa compreensível. O objeto precisa participar da gag, não apenas decorar.
- Movimento ambiental pequeno e motivado: folha, cortina, veículo ao longe. Não flutuar objetos nem adicionar loops independentes por obrigação.
- Próximo para reação; médio para rosto+mãos; aberto para geografia/ação. Câmera revela informação e não substitui gesto. Reservar olho, boca, mão e pista fora da legenda/interface.

Referência implementada: `filme.mjs`, `background`, `plant` e composição. A função `background` desenha só o cenário de teste, não uma biblioteca pronta do Tico. Os critérios gerais também constam de `DIRECAO-VISUAL.md` e `MOTOR-EXPRESSIVO-V3.md` do material de consulta.

## 6. Sombra viva e integração 2D

Separar sombra de contato curta/mais densa sob a sola da projeção difusa do ator. A projeção responde à silhueta, braços, cabeça e inclinação e segue o lado da luz; não é um oval que pulsa sozinho. A implementação do estudo é afim, aproximada, não sombra física 3D.

Ordem de desenho depende da profundidade. No teste: cenário → sombra → planta → ator. Evitar sombra sobre um objeto que deveria ocluir a luz ou planta cobrindo braço por acidente. Conferir tanto no aberto quanto no próximo. Não copiar a ordem do exemplo como regra universal.

## 7. Mapa de aplicação no Se Vira, Tico

Arquivos consultados em leitura em 2026-11-09. Conferir estado/branch atuais antes de editar.

| Arquivo do Tico | Aplicação |
|---|---|
| `personagens/chars.js` | Evoluir `eyeSVG`, `browSVG`, `mouthSVG`, rosto/tronco e membros; preservar `drawChar`, `CHARS`, expressões e coordenadas atuais |
| `personagens/MONTAGEM_DO_RIG.md` | Manter silhueta contínua, juntas redondas, apoio automático, braço à frente e pele sobre tecido; documentar controles novos |
| `personagens/cenarios.js` | Evoluir lugares/objetos e camadas; preservar fatores de paralaxe e chão |
| `personagens/acabamento.js` | Integrar pupila/rosto ao acabamento e sombra projetada; preservar compatibilidade de `visual` e direção dia/noite |
| `personagens/motor.js` | Integrar controles de intenção/tempo e ordem das camadas, sem quebrar câmera, props, legendas e planos |
| `personagens/estudio.html` | Comparar expressões, pupilas, curvas e mãos no elenco real |
| `docs/ACABAMENTO_VISUAL.md` | Acrescentar direção aprovada, origem e limites; manter os recursos já aprovados do Tico |
| `scripts/preparar-film.sh` / gerador de assets | Propagar fontes compartilhadas apenas para o estudo/episódio escolhido; não editar cópias de episódio manualmente |

O rig do Tico já articula membros: não descrevê-lo como a imagem inteira do antigo Plotline. `ribbon` produz um caminho que pode virar SVG, mas os ângulos e a origem do pé são diferentes. Criar uma adaptação local; nunca importar código da pasta do Plotline em execução.

## 8. Aplicação em etapas e aceitação

1. Ler AGENTS, skill da série, bíblia/README, montagem do rig e acabamento; conferir trabalho em andamento. Este pedido transfere visual, não altera roteiro, elenco, vozes, relações ou votação.
2. Comparar fonte atual e material do pacote; listar o que já existe e o que realmente falta. Não substituir arquivos inteiros nem portar o renderer Canvas todo para cima do SVG.
3. Criar estudo isolado de 10–15 s, 9:16, com Tico e Lua: repouso atento, olhar para ambos os lados, desconfiança, sorriso sincero/forçado, espanto e um gesto corporal. Manter uma comparação controlada antes/depois.
4. Usar um lugar 2D da série com composição mais rica. Conferir rosto próximo e corpo inteiro, mãos/props, contato dos pés e uma luz de dia/noite. Não inventar fala ou fonema para passar QA; usar teste mudo ou áudio já aprovado compatível.
5. Rodar testes de determinismo em ordem inversa e conferir quadros/tiras em resolução de entrega e celular; verificar recortes de mãos, olhos/dentes, oclusão e espaço de legendas. Notas artísticas e testes técnicos são resultados diferentes.
6. Apresentar ao João a prova concreta antes de aplicar em lote. Após aceite, integrar nas fontes compartilhadas e seguir as regras de branch/commit/push do Tico. Preservar episódios publicados e cópias anteriores.

Vídeos de referência com muitos likes não provam que uma técnica causou retenção. Esta transferência não promete viralização nem copia personagens/cenas de terceiros. O 3D fica para o teste futuro já anotado no Plotline.
