---
name: qa
description: Confere um vídeo montado com medições automáticas, folha de quadros e checagem de conteúdo e direitos, e registra o resultado em qa.md. Use depois de montar e antes de mostrar o vídeo final ao João, ou quando ele pedir uma revisão.
---

# qa

## Entradas

- `render/<slug>/<slug>.mp4`
- `series/misterios-do-brasil/roteiros/<slug>/` com roteiro, fontes e etiqueta
- `qa-checklist.md`, nesta pasta

## Passos

1. **Medições:**

```bash
node motor/qa/qa-video.mjs render/<slug> render/<slug>/<slug>.mp4
```

2. **À vista:** extraia uma folha de quadros, olhe de fato cada um e confira o primeiro quadro, a virada e o último.

```bash
ffmpeg -v error -y -i render/<slug>/<slug>.mp4 -vf "fps=1/2,scale=270:-1,tile=6x4" -frames:v 1 render/<slug>/folha.png
```

3. **Conteúdo:** fatos, direitos, licenças e rótulo, conforme o checklist.
4. **Classifique:** cada problema é **bloqueia** ou **sugestão**, com o momento do vídeo.

## Saída

`series/misterios-do-brasil/roteiros/<slug>/qa.md`, com a saída das medições, o que foi visto, o que não foi conferido e os problemas por classe.

## Critério de pronto

Nenhum **bloqueia** aberto. Item não medido fica como "não conferido", nunca como aprovado. Um render mudo não passa como final.

## Limites

O QA não ouve o áudio nem julga graça ou voz. Isso é do João, que assiste no celular com som e sem som.

## Aprovação

Reprovado volta a `montar`. Aprovado vai para o João como vídeo final: **PARE: aprovação 3**.
