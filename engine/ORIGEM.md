# Origem da engine

A engine é uma cópia, sem vínculo com os projetos de origem. Nada aqui lê arquivos de fora do Plotline. O commit `245f0c7` guarda os arquivos intactos, então `git diff 245f0c7 HEAD -- engine/` mostra cada adaptação.

## Se Vira, Tico

Repositório local `se-vira-tico`, commit `3b291564022fd43bb9789193d11258ae9718e1b0`, com a árvore limpa.

| Origem | Aqui | O que mudou |
|---|---|---|
| `personagens/motor.js` | `motor.js` | Elenco e caso do cachorro saíram; o elenco vem do vídeo; o mapa de tempo foi para `tempo.js` |
| `personagens/chars.js` | `rig/chars.js` | Nada. Veja `rig/README.md` |
| `personagens/cenarios.js` | `cenarios.js` | Ficaram só os utilitários e o cenário `vazio` |
| `scripts/sincronizar.py` | `sincronizar.py` | Aceita wav, mp3, m4a e flac; repassa `fx`; a duração vem das falas |
| `scripts/masterizar.sh` | `masterizar.sh` | Nada |
| `scripts/preparar-film.sh` | `preparar-film.sh` | Reescrito para `roteiros/`, `render/` e `templates/` |
| `scripts/mixar.py` | `mixar.py` | Saíram trilha, deixas e efeitos da série; ficaram voz, efeitos genéricos e música opcional |
| `.claude/skills/se-vira-tico/scripts/qa-episodio.mjs` | `qa-video.mjs` | Limites por opção, `--mudo`, tempo sem texto novo, gate local |
| `.claude/skills/se-vira-tico/references/qa-checklist.md` | `.claude/skills/qa/qa-checklist.md` | Reescrito para vídeo narrado |

**Não vieram:** `gerar-vozes.py`, `gerar-falas.mjs`, `medir-vozes.py` (OmniVoice, CC-BY-NC), vozes, assets do elenco, episódios e bíblia.

## Take One

Skill `take-one`, versão 0.1.0 do `package.json`. Ela não tem git, então a versão é identificada pelo hash. Arquivos em `take-one/`, sem alteração, com licenças em `take-one/licencas/`:

| Arquivo | SHA-256 (início) |
|---|---|
| `export.mjs` | `6381599e1754bb80` |
| `serve.mjs` | `6a0375f6bacb6a2e` |
| `springs.js` | `34cbdc2308616218` |
| `gate.mjs` | `a5c87519c79b586d` |

**Licenças:** Take One é MIT (Tal Siach). O `gate.mjs` é adaptado do anidoodle, Apache 2.0 (Alex Greenshpun); o aviso segue no próprio arquivo e em `licencas/`.

## Criados no Plotline

`tempo.js`, `fatiar-narracao.py`, `estimar-tempos.mjs` e `montar.sh`.

## Dependências

Node com `playwright-core`, Google Chrome, FFmpeg, e Python com NumPy. No Windows, rode os `.sh` pelo Git Bash.
