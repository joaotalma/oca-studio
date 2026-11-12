# Template: ilustrado

**Estado:** funcional. Testado em 1080 x 1920, sem áudio, com `series/misterios-do-brasil/roteiros/_teste-ilustrado`. Fonte: Barlow Condensed ExtraBold, com a licença em `OFL-BarlowCondensed.txt`.

Personagem 2D aprovado em cenário 3D estilizado, com legenda no ritmo da voz e selo que separa fato de hipótese. Motor 3D adotado em 2026-11-08; céu e preenchimento ajustados por pedido do João, sem novo render nesta mudança.

## Motor 3D padrão

`motor/montar.sh` verifica as camadas e prepara as texturas neutras quando necessário. `motor/preparar-film.sh` copia `motor/cenas/ambiente3d.js` e compila `cenas3d.js` a partir dos SVGs e das configurações do episódio. Não depende da pasta do experimento nem de seus dois temas.

- Estrelas determinísticas à noite e nuvens lentas de dia, apenas em ambientes externos e atrás dos volumes.
- Preenchimento neutro mais claro no personagem (`preenchimento: 0.22`), independente da animação das fontes. A intensidade, o lado e a cor da janela/poste afetam cenário, personagem, sombra e luz no chão no mesmo instante.
- Câmeras em arco, deslocamento lateral e aproximação conforme o plano, com personagem em destaque e menos chão vazio. As camadas de objetos não recebem a antiga flutuação automática.
- Recorte no plano próximo corrigido para o chão não desaparecer durante a câmera.
- O vazamento de luz global e as partículas antigas ficam desligados no modo 3D. Os selos, legendas, sincronização de voz e filtros de passado continuam no template.
- Imagens sem camadas não passam silenciosamente como 3D: precisam ser separadas. Fundos personalizados sem identificação são preservados com aviso, sem inventar uma rua ou uma sala.

Os geradores registram `<!--ambiente:noite-->`, `<!--ambiente:sala-->`, `<!--ambiente:ceu-->`, etc. Os retratos novos herdam o ambiente da cena de origem. Um catálogo textual reconhece fundos próprios antigos. Para direção específica, use `cenas3d.json` no episódio:

```json
{
  "padrao": { "preenchimento": 0.22 },
  "cenas": {
    "c12a": {
      "tipo": "sala",
      "periodo": "noite",
      "luzes": [{
        "id": "janela-direita",
        "tipo": "janela",
        "posicao": [2.975, 2, 7],
        "cor": "#ffdaa0",
        "intensidade": 1,
        "animacao": { "inicio": 1.2, "duracao": 0.75, "de": 0, "para": 1 }
      }]
    },
    "c13a": { "tipo": "campo", "periodo": "dia", "nuvens": 6 }
  }
}
```

Tempos de luz são locais ao plano no relógio do roteiro; a conversão da narração permanece em `tempo.js`. `VIDEO.ambiente3d` recebe padrões gerais, e `fala.cena3d` permite ajustes por plano. Tipos: `rua`, `colonial`, `terreno`, `campo`, `floresta`, `estrada`, `mar`, `sala`, `interior`, `oficina`, `estudio` e `arte`. Em `arte`, o fundo aprovado é preservado; para um ambiente inteiramente modelado, marque seu tipo ou descreva-o no JSON. Posicione fontes de janela na parede correspondente; não use a mesma direção em todas as cenas por conveniência.

`ambiente3d: false` em `VIDEO` mantém o modo anterior explicitamente. O 3D é usado tanto no rascunho quanto no final, para que a aprovação visual corresponda ao que será entregue. Detalhes e composição de cada episódio ainda precisam de revisão nas âncoras e no QA; a atualização não concede aprovação às próximas imagens.

Verificação sem render: `node --test motor/testes/ambiente3d.test.mjs`.

## O que o roteiro entrega

Na pasta `series/misterios-do-brasil/roteiros/<slug>/`:

- **`cenas/*.svg`:** cenas em 1080 x 1920. Podem usar o personagem aprovado com `<use href="#frente"/>` ou `<use href="#perfil"/>`.
- **`assets/*.png`:** gerados das cenas por `node motor/cenas/desenhar-cenas.mjs series/misterios-do-brasil/roteiros/<slug>`. É o que passa pela aprovação de imagens-âncora.
- **`assets/*-albedo.png` e `*-pisca-albedo.png`:** cor-base neutra do personagem, preparada sem a iluminação fixa do SVG para receber a luz 3D. Não altera o desenho ou a roupa. Registradas em `assets/camadas.js`.
- **`video.js`:** `const VIDEO = { template: 'ilustrado', paleta: 'roxo' };`, com uma paleta de `paletas.js`.
- **`falas.js`:** uma fala por linha, em JSON válido.

| Campo | Obrigatório | O que faz |
|---|---|---|
| `n` | sim | Número da fala, a partir de 1 |
| `quem` | sim | Quem fala, para leitura do roteiro |
| `texto` | sim | O que aparece e o que é narrado |
| `imagem` | sim | Caminho em `assets/`. Falas seguidas com a mesma imagem formam um plano |
| `camada` | sim | `foi` mostra o selo "ACONTECEU". `seria` e `voce` mostram "E SE..." |
| `selo` | não | Troca o texto do selo, por exemplo "O FILME" ou "NOTA". A cor continua vindo de `camada`: escura em `foi`, âmbar nas outras |
| `movimento` | não | `zoom-in` (padrão), `zoom-out`, `esq`, `dir`, `cima` ou `baixo`. Vale o da primeira fala do plano |
| `destaque` | não | Palavras em âmbar na legenda |
| `inteiro` | não | Use na primeira fala, o gancho: texto grande e completo desde o primeiro quadro, com avanço rápido sobre a imagem |
| `pausa` | não | Segundos de silêncio antes da fala. Padrão: 0,25 |
| `ini`, `fim` | sim | Tempo no roteiro. Preenchidos por `motor/audio/estimar-tempos.mjs` |

## Regras

Revisão v2: `docs/DIRECAO-VISUAL.md` define a direção. `direcao.json` registra a intenção e `fala.cena3d.camera` aplica trajetórias explícitas `{de:[x,y,z],para:[x,y,z],alvo:[x,y,z]}`. `movimento: 'parado'` é válido e passou a ser o padrão quando não há direção. Os planos não alternam movimentos por índice; legenda nova não é motivo automático para mover a câmera. A legenda mostra um bloco por vez, sem palavras sobrepostas. Objetos 3D adicionais: `geladeira`, `chuveiro`, `televisao`, `medidor`; são recursos disponíveis, não itens a inserir em todos os vídeos.

- **Selo:** nada que não seja fato com fonte pode usar `camada: 'foi'`. O selo "E SE..." fica na tela durante toda a parte imaginada.
- **Gancho:** a primeira fala tem `inteiro: true` e `pausa: 0`, usa a imagem mais forte do vídeo e dura até 3 s, sem apresentação. O texto fica no alto, então a cena deixa o rosto abaixo de y = 950.
- **Plano:** um movimento intencional de câmera por plano; preserve o foco e dê tempo para ler. `planoMax` controla subdivisões quando definido. Não alternar zooms para simular movimento.
- **Luz:** direção e animação no descritor 3D da cena; base neutra do personagem, conforme `series/misterios-do-brasil/personagens/voce.md`. O modo anterior conserva a luz do SVG.
- **QA:** sem `HOLDS` no filme inteiro, porque o movimento mantém a imagem viva. As trocas de imagem entram em `window.CUTS`.

## Montar

```bash
node motor/audio/estimar-tempos.mjs series/misterios-do-brasil/roteiros/<slug>/falas.js
node motor/cenas/desenhar-cenas.mjs series/misterios-do-brasil/roteiros/<slug>
bash motor/montar.sh series/misterios-do-brasil/roteiros/<slug>
```

## Regra de ouro

Se a imagem não ajuda a entender a frase naquele segundo, troque ou corte.
