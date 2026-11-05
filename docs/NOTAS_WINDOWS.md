# Notas de Windows

Testado em Windows 11, com Node 24, Git Bash, FFmpeg 9 e Chrome 156. Os scripts do Take One rodaram sem alteração.

## Como renderizar

Use o Git Bash, porque `bash` não está no PATH do PowerShell. Se precisar chamá-lo de lá, use `"C:\Program Files\Git\bin\bash.exe"`.

```bash
bash scripts/preparar-film.sh episodios/teste
cd episodios/teste
W=1080 H=1920 bash ~/.claude/skills/take-one/scripts/render-parallel.sh 30 4 ../../render/teste.mp4 1 12
W=1080 H=1920 PLAYWRIGHT_NODE_MODULES="$(cd ../..; pwd)/node_modules" node ~/.claude/skills/take-one/scripts/gate.mjs film.html --mp4 ../../render/teste.mp4
```

Rode um render por vez.

## O que observar

- **PATH:** terminais abertos antes de instalar `gh` e `ffmpeg` não enxergam esses comandos. Abra um terminal novo.
- **Pasta do filme:** `export.mjs` e `gate.mjs` só servem arquivos de dentro dela. `scripts/preparar-film.sh` copia para lá o rig e o motor; essas cópias ficam fora do git.
- **Reinício do render:** se uma parte não escreve nada em 60 s, `render-parallel.sh` a reinicia. O encerramento pode deixar processos do Chrome para trás. Eles têm `playwright_chromiumdev_profile` na linha de comando, o que os separa do Chrome normal.

## Ordem dos scripts no `film.html`

Isso não é específico do Windows, mas trava a página. Se `READY` nunca chega, o render fica reiniciando sem mostrar a causa.

1. Carregue `springs.js` antes de definir `window.module`. Se `module` existir, ele não cria o `Spring` global.
2. Defina `window.module = { exports: {} }` antes de `chars.js`, que usa `module.exports`.
3. Não redeclare `CHARS` nem `drawChar` no escopo global: `chars.js` já os define. Use-os direto e deixe o código do filme dentro de uma função.
