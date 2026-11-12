# Formato explicativo dos Mistérios

Adotado pelo João em 2026-11-12, a partir do formato do Planeta Desmontado (análise em `animacoes/referencias/videos-analisados/temporada-viral-metodo.md`). Ele complementa o gancho "Imagine..." do canal e responde ao feedback do piloto do apagão: a pauta precisa despertar curiosidade **hoje**, sem depender de alguém lembrar do fato.

## A linha do vídeo (de 40 a 65 s)

| Tempo | Bloco | O que entra |
|---|---|---|
| 0 s | **Pergunta** | A curiosidade em forma de pergunta, já com voz e texto grande. Ex.: "Por que o Brasil comprou o Acre com um cavalo de ferro?" Nada de "hoje eu vou explicar". |
| até 5 s | **Jeito errado** | O palpite mais errado e engraçado, encenado pelo personagem, que segura quem chegou. |
| meio | **Desmontar** | Peça por peça, cada uma com uma imagem nova a cada 3 a 5 s. **O segredo é a última peça.** |
| fim | **Uso e vitória** | O que isso muda na vida de quem assiste hoje (a consequência do canal). |
| último segundo | **Pergunta aberta** | Do jeito da pessoa: "E na sua cidade, ainda falta...?" Nunca "comente". |

## Regras

- **Voz de quem explica para um amigo:** animada, com uma piada leve de vez em quando.
- **Termo técnico só com a explicação junto.**
- **Fato sempre conferido e com fonte** (regra do projeto). Uma explicação errada vira comentário corrigindo, e o engajamento cai.
- **Dois ou três detalhes escondidos, de 1 a 2 s, sem seta:** quem nota comenta, e quem não notou volta para ver. Nos Mistérios, esses detalhes são **visuais** (um objeto fora de época, um personagem de outro vídeo, um número no fundo). **Nunca um erro de fato.**
- **Sem isca:** nada de "comente", "envie" ou "marque" na tela ou na fala. O QA reprova (`motor/qa/qa-video.mjs`).
- **Legenda** palavra por palavra, dentro da área segura.
- **Duração:** de 40 a 65 s, a faixa do formato explicativo. O roteiro narrado de 66 a 72 s da revisão v2 continua valendo até o João escolher.

## Como usar com a revisão v2

Antes de produzir uma pauta, confira se ela se escreve como **pergunta de curiosidade** com um **segredo final**. Se não se escreve, a pauta provavelmente é das "chatas, pouco lembradas" que o João apontou no apagão.
