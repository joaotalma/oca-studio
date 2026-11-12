# Origem da engine

A engine é uma cópia, sem vínculo com os projetos de origem. Nada aqui lê arquivos de fora do Plotline. O commit `245f0c7` guarda os arquivos intactos, então `git log --follow` e `git diff 245f0c7 HEAD -- engine/` (caminho anterior, até 2026-11-12) mostram cada adaptação. Em 2026-11-12 a pasta passou a se chamar `motor/` na Oca Studio.

## Se Vira, Tico

Repositório local `se-vira-tico`, commit `3b291564022fd43bb9789193d11258ae9718e1b0`, com a árvore limpa.

| Origem | Aqui | O que mudou |
|---|---|---|
| `series/se-vira-tico/personagens/motor.js` | `motor.js` | Elenco e caso do cachorro saíram; o elenco vem do vídeo; o mapa de tempo foi para `tempo.js` |
| `series/se-vira-tico/personagens/chars.js` | `rig/chars.js` | Nada. Veja `rig/README.md` |
| `series/se-vira-tico/personagens/cenarios.js` | `cenarios.js` | Ficaram só os utilitários e o cenário `vazio` |
| `scripts/sincronizar.py` | `sincronizar.py` | Aceita wav, mp3, m4a e flac; repassa `fx`; a duração vem das falas |
| `scripts/masterizar.sh` | `masterizar.sh` | Nada |
| `scripts/preparar-film.sh` | `preparar-film.sh` | Reescrito para `series/misterios-do-brasil/roteiros/`, `render/` e `templates/` |
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

Transferência solicitada pelo João em 2026-11-09: pacote de referência 2D em `render/transferencias/se-vira-tico-visual-2d/`, copiado para `C:/Users/joaot/Projetos/se-vira-tico/render/referencias-plotline-2d/`. Inclui estudos v3/v4, exemplos, testes, guia e licença do servidor local; 50 arquivos conferidos por SHA-256 e testes executados dentro da cópia. Não inclui chaves, vozes ou código de fundo 3D e não altera fontes de produção do Tico. A futura adaptação deve ser local e independente, sem importar o Plotline em execução. Guia e prompt em `estudos/_arquivo/TRANSFERENCIA-VISUAL-2D-TICO.md` e `estudos/_arquivo/PROMPT-TRANSFERENCIA-TICO-2D.md`.

Revisão de 2026-11-09: `estudos/ator-organico-v4/`, evolução local do estudo v3 por pedido do João. Contornos curvos, roupa, boca/arcada e olhos gráficos criados no Plotline; cabelo/orelhas derivados da mesma ficha aprovada. `anterior.mjs` preserva o ator v3 para comparação. Reutiliza o servidor local existente e não lê outro projeto. Séries citadas pelo João orientam apenas o princípio do olho sem íris colorida, sem copiar personagens ou assets.

Estudo de 2026-11-09: `estudos/_arquivo/ator-expressivo-v3/`, com poses, desenho Canvas e articulação criados no Plotline. Os recortes vêm de `series/misterios-do-brasil/personagens/voce-ficha.svg`; membros e mãos foram adaptados para o estudo. Reutiliza o servidor local já atribuído ao Take One acima. Não copia o rig/elenco do Se Vira, Tico nem depende daquele projeto. Referências externas orientam princípios gerais, não desenhos de personagens.

`tempo.js`, `fatiar-narracao.py`, `estimar-tempos.mjs` e `montar.sh`.

Estudo de 2026-11-08: `estudos/2d-cenario3d/`, criado no Plotline. Perspectiva 3D procedural em Canvas, com recortes do personagem dos episódios já aprovados. Usa o exportador local existente, sem ler ou copiar arquivos de outro projeto. Não altera o template ilustrado nem a estética aprovada do canal.

Evolução no mesmo dia, a pedido de João após aprovar o exemplo: `ambiente3d.js`, `preparar-cenas3d.mjs`, `camadas3d.mjs` e os testes em `testes/ambiente3d.test.mjs` promovem o estudo ao fluxo do template ilustrado. O motor é independente do experimento e dos seus temas. Adiciona estrelas/nuvens por horário, preenchimento neutro mais claro e fontes de luz compartilhadas pelo cenário e personagem. `fundos3d-legados.json` é um snapshot textual dos fundos gerados pela própria `cenas-lib.py`, usado para reconhecer cenas antigas. Nenhum arquivo de outro projeto foi copiado. A mudança foi verificada sem renderizar imagens ou vídeos.

## Dependências

Node com `playwright-core`, Google Chrome, FFmpeg, e Python com NumPy. No Windows, rode os `.sh` pelo Git Bash.

## Fluxo de voz e revisão v2 — 2026-11-08

A pedido explícito do João, foi consultado `se-vira-tico/scripts/gerar-vozes-elevenlabs.mjs`, `scripts/elevenlabs-criar-vozes.mjs` e `docs/VOZES.md`. Nova implementação independente: `voz-elevenlabs.mjs`, usando a API REST, sem importar SDK, arquivos ou vozes daquele projeto em tempo de execução. A chave foi transferida uma única vez para `.env.local` do Plotline, ignorado pelo git. O projeto de origem não foi alterado.

O plano Starter ativo e a inclusão de licença comercial foram conferidos na API e em https://elevenlabs.io/pricing. João autorizou criar uma voz original jovem e empolgante, em lugar do clone que ainda não estava disponível. O registro fica em `series/misterios-do-brasil/canal/voz-elevenlabs.json`; não é clone nem imitação da voz do João. Prévias e áudios ficam fora do git. A autorização desta conversa inclui a produção do apagão revisado; não aprova automaticamente outras pautas, vídeos ou publicação.

`gerar-roteiro.mjs`, `revisar-catalogo.mjs`, `desenvolvimentos-v2.json`, `cenas-apagao-v2.mjs` e `fatiar-alinhamento.py` foram criados no Plotline. O alinhamento real substitui a escolha de pausas por tamanho. O motor visual ganhou câmera parada, trajetórias explícitas e aparelhos 3D; saiu a rotação automática de movimentos na montagem de planos. Direção e pesquisa estão em `docs/DIRECAO-VISUAL.md` e `docs/PROMPT-PESQUISA.md`.
