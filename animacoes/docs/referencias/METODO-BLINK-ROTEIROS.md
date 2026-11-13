# Método Blink para escrever e revisar roteiros

Versão de trabalho de 2026-11-11. Aplicável à narração do Plotline e à ficção dialogada do Se Vira, Tico, com identidades preservadas. Fontes: três PDFs fornecidos pelo João, dados de cinco posts do Tico no Instagram e conferência oficial contemporânea de Shorts/TikTok. **É direção editorial e hipótese de trabalho; não é regra comprovada de distribuição ou promessa de viralização.**

## O que foi incorporado

O método combina promessa coerente com a abertura e escalada/entrega do manual atribuído ao MrBeast (pp.5–8/29/35), unidade compreensível e pergunta respondida do Storykit (pp.14/18), e entrada por qualquer episódio, participação e medição do Creator Playbook for Brands (pp.20/29–30/75–80). Páginas físicas desde a capa. A análise paginada e os limites estão no [relatório](pesquisa-tico/relatorio.md).

“Treinar”, aqui, significa atualizar instruções, contrato editorial, repertório e revisão de cada versão. Não houve ajuste dos pesos de modelo de IA. A revisão humana de sentido, naturalidade, humor e atuação continua necessária; preencher um formulário não torna o roteiro bom.

## Uma promessa e uma entrega por episódio

Antes de escrever falas ou pedir imagens, explicitar o que o público acompanha e a mudança que recebe neste vídeo. O título, primeiro quadro e primeira ação precisam corresponder a essa promessa. Ela pode aparecer em imagem, gesto, diálogo ou narração: não existe obrigação de começar com uma frase ou de eliminar silêncio. Uma abertura silenciosa funciona quando o conflito e o motivo para acompanhar são compreensíveis.

Responder: quem quer o quê, que obstáculo existe agora, qual é o custo e por que isso importa a quem nunca viu a série. Dar apenas o contexto necessário. Uma retomada serve para compreender a ação atual; não é uma cobrança para rever todo o capítulo anterior. Marca e numeração não ocupam o lugar do conflito.

## Construir uma corrente de tentativas e consequências

Cada bloco tem uma função: tentativa, consequência, pista, reação ou decisão. O que acontece precisa alterar informação, risco, relação ou possibilidade de ação. Se o bloco só repete o estado anterior, cortar ou fundir. Se cortá-lo elimina a ponte que explica o próximo, reescrever em vez de simplesmente apagar.

Escalada significa consequências diferentes e ligadas à premissa. Para o Tico, uma avaliação pode alterar acesso ao trabalho, consumir combustível e pressionar uma promessa à Lua; repetir constrangimento com palavras novas não cria outro degrau. Para o Plotline, a consequência hipotética seguinte precisa decorrer do mecanismo apresentado, com fato e hipótese identificados.

Planejar a resposta local antes do cliffhanger. Um episódio pode terminar com uma questão nova, desde que o público receba uma mudança concreta referente à pergunta inicial. Um dilema não resolvido não deve apagar toda a entrega. A reação, uma piada visual e uma pausa podem fazer parte da recompensa; compressão não exige ritmo uniforme.

## Usar participação com agência verdadeira

Definir se a participação é **retrospectiva**, **futura** ou ausente. Em um episódio antigo cuja história permanece fixa, perguntar o que a pessoa teria feito. Não prometer que novos comentários modificarão capítulos já decididos. Em uma escolha futura real, deixar alternativas e custos claros e registrar onde o resultado será apurado.

No Se Vira, Tico, os remakes dos EP1–5 usam perguntas retrospectivas por decisão do João em 11/11/2026. O EP6 usa o ramo OUTRO MOTORISTA, também confirmado por ele, e pode abrir BEIJA/NÃO BEIJA para uma consequência posterior. Definir a fonte de verdade antes de combinar votos de plataformas diferentes. Contagem de comentários não equivale a votantes únicos.

No EP6, separar a estreia atual da republicação. A pergunta é ativa enquanto sua janela efetiva estiver aberta. Se o capítulo chegar ao Shorts/TikTok depois do encerramento, usar a alternativa retrospectiva e registrar o estado publicado/decidido no contrato. Data antiga de produção não autoriza prometer agência nova ao público.

Concluir sem despedida, cartela longa ou várias chamadas concorrentes. O CTA pode estar na própria ação, ser uma fala ou uma pergunta curta legível. Sua forma e duração precisam caber no momento dramático. Não impor os dez segundos de CTA de um exemplo histórico de anúncio a um vídeo de sessenta segundos.

## Escrever para duas linguagens sem misturá-las

| Aspecto | Plotline | Se Vira, Tico |
|---|---|---|
| Voz narrativa | Narrador e hipótese declarada conforme o canal | Diálogo, gesto, subtexto e situações; sem narrador explicativo acrescentado |
| Fonte de verdade | Fatos com fonte; hipótese separada do ocorrido | Bíblia, roteiro produzido, continuidade e decisões do João |
| Pergunta local | Fenômeno/consequência que o vídeo explica | Problema/decisão do personagem que muda naquele episódio |
| Entrega | Resposta, prova ou consequência compreensível | Consequência concreta, mudança de relação e payoff cômico/emocional |
| Risco ao cortar | Remover mecanismo ou fonte e deixar afirmação solta | Cortar motivação ou ponte e mudar a história |
| Participação | Pergunta com relação ao tema, sem promessa falsa | Retrospectiva ou voto futuro identificado; preservar escolhas já produzidas |

As falas devem funcionar ao ouvido. Ler em voz alta, identificar referências ambíguas e cortar redundâncias. Frase curta é um recurso de clareza, não uma obrigação de todas as pessoas falarem igual. O humor afetuoso do Tico depende também de hesitação, silêncio e contraste entre fala e gesto. No Plotline, explicação clara não autoriza inserir números sem fonte.

## Contrato editorial por versão

Usar um objeto `editorial` na estrutura do vídeo. Os campos registram decisões, não um placar de qualidade. O [prompt compartilhado](PROMPT-ROTEIROS-BLINK.md) orienta a escrita; o avaliador em `motor/roteiro/rubrica-roteiros.mjs` confere campos e inconsistências para revisão.

| Campo | Decisão que precisa ser legível |
|---|---|
| `promessa` | O que o primeiro quadro/título fazem valer acompanhar |
| `contextoNovo` | Contexto mínimo para quem chegou agora |
| `perguntaLocal` | Questão específica resolvida ou transformada neste vídeo |
| `payoffLocal` | Entrega observável antes da pergunta seguinte |
| `escalada` | Degraus distintos e suas consequências |
| `continuidade.entrada` | Estado/decisão que o vídeo recebe |
| `continuidade.saida` | Estado novo que deve ser preservado no próximo |
| `participacao.tipo` | `retrospectiva`, `futura` ou `nenhuma` |
| `participacao.pergunta` | Convite coerente com a agência efetiva da audiência |
| `publicadoAnteriormente` | Se o episódio de origem já foi publicado |
| `hipoteseTeste` | O que a nova versão pretende melhorar e o que os dados não permitem concluir |

Exemplo de contrato, referente ao caminho confirmado para EP6 e não a falas definitivas:

```json
{
  "editorial": {
    "promessa": "Uma entrega perdida mostra o custo e o valor de avisar a verdade.",
    "contextoNovo": "Tico prometeu entregar as caixas às oito e avisou que chegaria tarde.",
    "perguntaLocal": "O aviso serviu para alguma coisa se ele perdeu a entrega?",
    "payoffLocal": "Lua conseguiu chamar outro motorista; Tico aprende a conferir antes de prometer.",
    "escalada": [
      "Outro carro leva as caixas; Tico perde os R$20.",
      "Lua reconhece que o aviso permitiu resolver.",
      "No convite seguinte, ele consulta a agenda antes de aceitar."
    ],
    "continuidade": {
      "entrada": "OUTRO MOTORISTA, confirmado pelo João.",
      "saida": "Cinema; Lua sabe do curso em trinta dias, Tico ainda não."
    },
    "participacao": {
      "tipo": "futura",
      "pergunta": "BEIJA ou NÃO BEIJA?"
    },
    "publicadoAnteriormente": false,
    "hipoteseTeste": "Entrada compreensível e payoff local; ainda sem resultado nas novas plataformas."
  }
}
```

O compilador narrado do Plotline continua separado do formato de diálogo do Tico. Não compilar os personagens como um único narrador só para satisfazer uma API. O contrato é compartilhável; a encenação, a voz e as fontes de produção continuam específicas. Campos presentes não comprovam que uma piada funciona nem que uma ação é executável no rig.

Implementação desta entrega: `motor/roteiro/rubrica-roteiros.mjs` oferece `avaliarEditorial(estrutura)` e relatórios de avisos, sem score. `motor/roteiro/gerar-roteiro.mjs` aplica a auditoria quando existe `editorial`, preservando a entrada legada sem esse objeto. A integração e os casos de compatibilidade receberam onze testes, sete da rubrica e quatro legados, conforme verificação da implementação. Isso comprova comportamento do programa, não eficácia de retenção.

## Duas revisões antes de produzir

A revisão editorial pergunta se um desconhecido entende a situação, se a embalagem promete o que se entrega, se há consequência, se a piada/reação tem espaço, se o cânone se mantém e se a participação é honesta. A revisão de produção confere capacidade de desenhar e animar cada ação, duração de leitura, segurança de legendas, clareza dos objetos e viabilidade do som. O roteiro não deve prometer contato, giro ou expressão que o motor ainda não oferece.

Tempo novo é **estimado** até existir narração/diálogo final medido. Somar falas, reações, deslocamentos e leitura de telas; não calcular duração apenas pelo número de palavras. Se uma fala não cabe, reduzir ou redistribuir texto antes de acelerar a voz. Registrar se a versão é master ou específica de plataforma e manter seus tempos coerentes. Preservar originais aprovados e mostrar a proposta antes de gerar voz/imagens/vídeo.

## O que medir e como aprender

Registrar snapshots sem sobrescrever anteriores: série, episódio, versão, plataforma, momento de publicação, momento de coleta conhecido, idade do post, duração real, views, medidas de atenção inicial, curva, conclusão, compartilhamentos, salvamentos e seguidores/inscritos. Campo desconhecido fica vazio. Recebimento de um resumo não substitui horário da coleta. Separar orgânico de pago quando o painel permitir e preservar divergências.

Shorts admite até três minutos nas condições da documentação atual; isso não define duração ideal. As métricas de `engaged views`, permanência inicial e duração assistida têm denominadores próprios no YouTube. O TikTok usa vários sinais de interação; duração de programa de monetização não é regra geral de recomendação. Não transportar números de um painel para o nome de outra métrica. ([YouTube: duração](https://support.google.com/youtube/answer/15424877?hl=en), [YouTube: métricas](https://support.google.com/youtube/answer/12220281?hl=en), [TikTok: recomendações](https://support.tiktok.com/pt_BR/using-tiktok/exploring-videos/how-tiktok-recommends-content).)

Comparar dentro da mesma plataforma e com idade semelhante, por exemplo snapshots em 24h e 72h. Esses horários são um plano de coleta, não janelas mágicas do algoritmo. Uma remontagem que muda abertura, visual, duração e CTA é uma mudança de pacote; não identifica qual parte causou o resultado. Depois dela, variar uma dimensão, começando pela abertura com miolo/fecho estáveis. Comparações orgânicas ainda são exploratórias e precisam de repetição.

Cinco episódios com idades e mídia diferentes não promovem uma regra empírica do canal. Registrar hipótese, observar mais de um vídeo, conferir a variável e submeter a decisão ao João antes de alterar `series/misterios-do-brasil/canal/regras.md`. Curtidas, comentários, retenção e seguidores medem coisas diferentes; nenhum indicador isolado substitui o objetivo da série.

## Limites das fontes

O manual atribuído ao MrBeast não foi autenticado externamente quanto a edição/data. O Storykit tem metadados de 2023 e uma abordagem comercial específica; a porcentagem retórica atribuída ao roteiro não foi adotada como fato. O Playbook tem metadados de 2016 e produtos/interfaces antigos; suas instruções de plataforma foram substituídas por conferência oficial atual. Nenhum dos três demonstra uma fórmula de viralização para o Tico.

Fontes locais: [MrBeast](<C:/Users/joaot/Downloads/66edaa19db6e9359bb92931f_How-To-Succeed-At-MrBeast-Production (2)_cópia.pdf>), [Storykit](C:/Users/joaot/Downloads/ENG-academy-ebook-script_cópia.pdf), [Creator Playbook for Brands](C:/Users/joaot/Downloads/youtube-playbook_cópia.pdf). Os dados e a auditoria do Tico ficam separados em [series/se-vira-tico/resultados](../../series/se-vira-tico/resultados/LEIA-ME.md), sem contaminar os resultados do canal Plotline.
