---
name: novo-video
description: Orquestra a produção de um vídeo do Plotline, do tema ao vídeo final, e para em três pontos de aprovação (roteiro, imagens-âncora e vídeo final). Use quando o João pedir um vídeo novo, partir de um tema ou do radar, ou retomar um vídeo em andamento.
---

# novo-video

Roda a cadeia na ordem. Não pula etapa e não decide pelo João nos pontos de aprovação.

## Entradas

- Um tema, ou um candidato de `radar/`. Sem isso, rode `radar`.
- `canal/canal.md` preenchido. Em branco, rode `configurar-canal` e pare.

## Cadeia

| # | Etapa | Saída | Depois |
|---|---|---|---|
| 1 | `direitos` | Etiqueta do tema | EVITAR encerra e registra o motivo |
| 2 | `pesquisa` | `fontes.md` | Segue |
| 3 | `roteiro` | `roteiro.md`, `falas.js`, `video.js` | **PARA: aprovação 1** |
| 4 | `montar`, fase âncoras | Imagens-âncora ou folha de quadros | **PARA: aprovação 2** |
| 5 | João grava | `audio/<slug>/narracao.*` | Espera o arquivo |
| 6 | `montar`, fase final | Vídeo em `render/<slug>/` | Segue |
| 7 | `qa` | `qa.md` | Reprovado volta a `montar` |
| 8 | Entrega | Vídeo e relatório | **PARA: aprovação 3** |
| 9 | `postagem` | `postagem.md` | Publicação manual pelo João |
| 10 | `aprender` | Resultados e regras | Quando houver dados |

## Pontos de aprovação

Em cada um: mostre o material, diga o que decidir e espere um sim explícito. Silêncio não é aprovação, e uma aprovação não vale para a etapa seguinte.

1. **Roteiro:** texto completo, etiqueta de direitos, fontes e duração estimada.
2. **Imagens-âncora:** no template ilustrado, as imagens. Em chat e caixa de texto, uma folha com o primeiro quadro, a virada e o último quadro, feita em rascunho.
3. **Vídeo final:** o arquivo, o relatório de QA e o lembrete de assistir no celular, com som e sem som.

## Saídas

Pasta `roteiros/<slug>/` completa e `render/<slug>/<slug>.mp4`.

## Critério de pronto

As três aprovações registradas em `roteiro.md` com a data, QA aprovado e `postagem.md` preenchida.

## Nunca

- Publicar ou agendar. A publicação é manual, nas contas do João.
- Gerar a voz. Sem a gravação, a cadeia espera ou entrega um render mudo identificado como tal.
- Rodar vários vídeos sem aprovar um roteiro por vez.

## Retomar

Veja o que existe em `roteiros/<slug>/` e as aprovações em `roteiro.md`, e continue da primeira etapa sem aprovação.
