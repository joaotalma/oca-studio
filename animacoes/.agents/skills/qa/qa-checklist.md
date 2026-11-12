# Checklist de QA

"Automático" é medido por `motor/qa-video.mjs`. "À vista" é conferido em uma folha de quadros ou assistindo. "João" só ele decide.

## Automático

| Item | Critério |
|---|---|
| Duração | 30 a 90 s, ou a faixa de `series/misterios-do-brasil/canal/canal.md` |
| Resolução | 1080x1920; rascunho 540x960 |
| Quadros por segundo | 30; rascunho 15 |
| Loudness | -16 LUFS, ±1 LU; não cobrado em rascunho ou render mudo |
| Tempo sem texto novo | Até 2,5 s entre o fim de uma fala e o início da próxima |
| Gate: determinismo | O mesmo quadro sai igual, em qualquer ordem |
| Gate: contrato | Sem relógio, sem `Math.random`, sem estado entre quadros |
| Gate: saltos | Nada aparece de repente sem ser um corte declarado |
| Gate: tela parada | Só onde o template não declara `window.HOLDS` |

## À vista

| Item | Critério |
|---|---|
| Primeiro quadro | O gancho já está na tela, legível |
| Sincronia | A palavra aparece com a voz, sem ficar atrás |
| Área segura | Nada essencial fora dela e nada cortado |
| Rolagem | Nenhuma mensagem some antes de dar tempo de ler |
| Destaques | Caem na palavra certa da frase |
| Tela | Sem tela preta, texto estourado ou sobreposição |
| Cartão final | O fecho fica na tela tempo suficiente para ler |

## Conteúdo

| Item | Critério |
|---|---|
| Fatos | Cada fato do roteiro tem fonte em `fontes.md` |
| Direitos | A etiqueta está no roteiro e o vídeo a respeita |
| Mídia | Voz, música e imagens com licença anotada |
| Rótulo | Rótulo de conteúdo sintético decidido e anotado por plataforma |
| Exemplo | Nada marcado como teste vai para publicação |

## João

- Assistiu no celular, com som e sem som.
- A história faz sentido nas duas vezes.
- A voz soa como ele.
