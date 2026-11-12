---
name: novo-video
description: Orquestra a produção de um vídeo do Plotline, do tema ao vídeo final, com aceite de roteiro e imagens-âncora e aprovação final automática autorizada. Use quando o João pedir um vídeo novo, partir de um tema ou do radar, ou retomar um vídeo em andamento.
---

# novo-video

Roda a cadeia na ordem. Não pula etapa e não decide pelo João nos pontos de aprovação.

## Entradas

Antes de escolher ou retomar uma pauta, faça uma consulta estratégica curta com `docs/PROMPT-PESQUISA.md` e registre a data. Se o João já escolheu o tema, confirme a janela e procure referências atuais opcionais sem trocar o ângulo dele. Sinal fraco pode resultar em nenhuma referência; não fabricar tendência nem gastar créditos novos sem autorização.

- Um tema, ou um candidato de `series/misterios-do-brasil/radar/`. Sem isso, rode `radar`.
- `series/misterios-do-brasil/canal/canal.md` preenchido. Em branco, rode `configurar-canal` e pare.

## Cadeia

| # | Etapa | Saída | Depois |
|---|---|---|---|
| 1 | `direitos` | Etiqueta do tema | EVITAR encerra e registra o motivo |
| 2 | `pesquisa` | `fontes.md` | Segue |
| 3 | `roteiro` | `roteiro.md`, `falas.js`, `video.js` | **PARA: aprovação 1** |
| 4 | `montar`, fase âncoras | Imagens-âncora ou folha de quadros | **PARA: aprovação 2** |
| 5 | João grava ou gera com o clone | `audio/<slug>/narracao.*` | Espera o arquivo |
| 6 | `montar`, fase final | Vídeo em `render/<slug>/` | Segue |
| 7 | `qa` | `qa.md` | Reprovado volta a `montar` |
| 8 | `postagem` | Capa e `postagem.md` | Preparar a entrega |
| 9 | Entrega | Vídeo, revisão e QA | **Finalização automática autorizada**; João publica |
| 10 | `aprender` | Resultados e regras | Quando houver dados |

## Pontos de aprovação

Em cada um: mostre o material, diga o que decidir e espere um sim explícito. Silêncio não é aprovação, e uma aprovação não vale para a etapa seguinte.

1. **Roteiro:** texto completo, etiqueta de direitos, fontes e duração estimada.
2. **Imagens-âncora:** no template ilustrado, as imagens. Em chat e caixa de texto, uma folha com o primeiro quadro, a virada e o último quadro, feita em rascunho.
3. **Vídeo final:** após revisão editorial e QA, finalizar e registrar a aprovação automática autorizada em `aprovacao.json`. Não pedir outro sim ao João.

## Saídas

Pasta `series/misterios-do-brasil/roteiros/<slug>/` completa e `render/<slug>/<slug>.mp4`.

## Critério de pronto

Os aceites editoriais e a aprovação final automática registrados em `roteiro.md` com a data, QA aprovado e `postagem.md` preenchida.

## Nunca

- Publicar ou agendar. A publicação é manual, nas contas do João.
- Gerar voz sem autorização explícita e licença verificada. A voz original jovem aprovada em 2026-11-08 usa `series/misterios-do-brasil/canal/voz-elevenlabs.json`; seguir a autorização do João para cada produção.
- Rodar vários vídeos sem aprovar um roteiro por vez.

## Retomar

Veja o que existe em `series/misterios-do-brasil/roteiros/<slug>/` e as aprovações em `roteiro.md`, e continue da primeira etapa sem aprovação.

## Atualização de 12/11/2026 — prevalece sobre o fluxo anterior

Seguir `motor/FLUXO-RAPIDO.md`. Gate completo no rascunho 540×960/15 fps; um master 1080×1920/30 fps após passar. QA leve validado por hashes e amostras em alta; revisar as amostras. Com revisão editorial, direitos e entrega completos, `motor/finalizar.mjs` registra a aprovação final automática autorizada pelo João. Não solicitar novo aceite final; roteiro e âncoras mantêm aceite explícito. Nenhum bloqueio pode ser ignorado e só João publica.
