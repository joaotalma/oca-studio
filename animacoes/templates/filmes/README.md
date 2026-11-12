# Template: filmes

**Estado:** escrito em 2026-11-07, ainda não renderizado. O João pediu para não desenhar nada por enquanto; o primeiro teste visual fica para quando ele liberar.

É o motor do `ilustrado` com acabamento de cinema, para o canal "Vale a pena?". O corpo dos bonecos segue o do Se Vira Tico. Do vídeo de referência (enviado pelo João em 2026-11-07) vêm só técnicas de luz, câmera, olho e legenda, nunca personagens, cenários ou cores próprias dele.

## O que veio da referência

| Técnica | Onde está |
|---|---|
| Íris com brilho quadrado, brilho pequeno, sombra da pálpebra e reflexo do que o personagem vê | `engine/desenhar-cenas.mjs`, com `olhos: 'cinema'` em `video.js`; o reflexo vem de `reflexo()` em `engine/cenas-filmes.py` |
| Céu de fim de tarde (roxo para laranja), sol estourado atrás do personagem e contorno de luz | `ceu()`, `sol()` e `contorno_luz()` em `engine/cenas-filmes.py`; paletas em `paletas.js` |
| Profundidade: fundo desfocado e cabeças escuras muito desfocadas em primeiro plano | `fundo_desfocado()` e `silhuetas_frente()` |
| Poeira brilhando no ar e bolhas de luz fora de foco | `desenharParticulas` em `filmes.js` |
| Vazamento de luz quente que respira | `desenharLuz` |
| Fusão curta com clarão na troca de imagem | `desenharPlano` (`dissolve` em `video.js`, padrão 0,18 s) |
| Sombra atravessando a tela | `sombra: true` na fala |
| Lembrança em sépia | `filtro: 'flashback'` na fala (ou `'noite'`) |
| Números de painel com brilho frio e contagem | `hud` na fala |
| Legenda de 1 a 3 palavras, caixa alta, palavra-chave em destaque | `desenharLegenda` |
| Grão e vinheta mais fortes que no ilustrado | `desenharAcabamento` |

## Campos novos em `falas.js`

Os campos do `ilustrado` continuam valendo, inclusive `selo`.

| Campo | O que faz |
|---|---|
| `hud` | `{ rotulo: 'IMDb', valor: 8.2 }` ou uma lista deles. Conta de 0 até o valor, com brilho frio. Use nas notas |
| `carimbo` | `'VALE A PENA'` (verde), `'DEPENDE'` (âmbar) ou `'NÃO VALE'` (vermelho). Entra grande e bate na tela |
| `filtro` | `'flashback'` ou `'noite'`. Vale para o plano inteiro |
| `sombra` | `true`: uma sombra atravessa a tela no começo da fala |
| `imagens` | Lista de imagens: a fala vira um corte por imagem, em partes iguais. Mantenha `imagem` com a primeira |

## Rosto por cena

Uma cena pode trocar a expressão do "você" com o comentário `<!--rosto:bravo-->` no SVG. `engine/desenhar-filmes.py` faz isso com `voce(enquadramento, 'bravo')`. As opções estão em `personagens/rostos.json`. Com olhos de cinema, a sobrancelha fica mais grossa e não há cílios, para o rosto não ler como feminino (ajuste pedido pelo João em 2026-11-07).

## Ritmo e animação

O ritmo vem das trocas de imagem (duas imagens nas falas longas), não de cortes na mesma imagem. Cada imagem tem um movimento de câmera só, lento e contínuo; o "vai e vem" de aberto e fechado foi tirado a pedido do João em 2026-11-07.

**Camadas:** `engine/desenhar-cenas.mjs` separa cada cena marcada em fundo, boneco (com uma versão de olhos fechados) e frente, e grava `assets/camadas.js`. O template anima cada camada:
- **Boneco:** respira, balança, sobe e desce de leve, pisca a cada 2,6 a 4 s e sobe um pouco ao entrar na cena.
- **Frente:** os objetos flutuam devagar.
- **Profundidade:** o fundo anda menos que a câmera e a frente anda mais.
- **Sobra em volta:** boneco e frente são desenhados com 300 px de sobra nas laterais e no alto, e 520 px embaixo (`caixa` em `camadas.js`). Nos closes, o rosto passa das bordas e o balanço nunca mostra a linha do corte. O balanço é medido em pixels no rosto, então não exagera nos closes.
- **Piscada:** troca seca de olho aberto para fechado, sem meio-termo. No close extremo do olho, ponha `<!--sempisca-->` na cena.
- **Sem vazio embaixo:** boneco e frente são desenhados com 520 px de sobra abaixo do quadro. No enquadramento só do tronco, o movimento nunca mostra o corte do corpo. Com os pés em cena, o boneco fica preso ao chão: não sobe, só respira e balança a partir dos pés, e anda junto com o fundo (ajuste pedido pelo João em 2026-11-07).

**Marcas no SVG:** `voce()` em `engine/desenhar-filmes.py` já põe `<!--P-->`, `<!--/P-->` e o pivô. Em cena sem personagem, ponha `FRENTE` antes dos objetos que devem flutuar.

## `video.js`

```js
const VIDEO = { template: 'filmes', paleta: 'crepusculo', rosto: 'desconfiado', olhos: 'cinema' };
```

Paletas: `crepusculo`, `noite-azul`, `vela`, `neon`, `verao` e `tempestade`.

## Regras de cena para o canal de filmes

- **Arquétipos, nunca o filme:** o personagem do filme é o "você" ou um figurante genérico com o figurino do gênero. Nada de rosto, cabelo, figurino marcante, objeto icônico, logo ou cenário reconhecível do filme. Nada de pôster ou cena.
- **Close no olho:** a cena mais forte de cada vídeo é um close do olho refletindo o que importa (a câmera, o holofote, a tela). É a assinatura visual do canal.
- **Três camadas:** silhuetas desfocadas na frente, personagem nítido no meio, fundo desfocado atrás.
- **Uma fonte de luz visível:** sol, tela, vela ou holofote. O lado do personagem virado para ela fica quente; o outro, frio.
- **Tela de nota:** fundo escuro limpo, só o `hud` e o carimbo. Nome dos sites em texto, sem logo.

## Montar

```bash
node engine/estimar-tempos.mjs roteiros/<slug>/falas.js
node engine/desenhar-cenas.mjs roteiros/<slug>
bash engine/montar.sh roteiros/<slug>
```
