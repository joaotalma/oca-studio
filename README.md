# Oca Studio

Agência de IA do João. Cada frente tem a sua pasta. Oca é a casa indígena em tupi: uma casa só, várias frentes dentro.

| Frente | Pasta | Estado |
|---|---|---|
| Animações (antigo Plotline) | [`animacoes/`](animacoes/) | em produção |
| Automações | [`automacoes/`](automacoes/) | a definir |
| Trading com IA | [`trading/`](trading/) | a definir |

## Animações

`animacoes/` é o antigo Plotline.

| Pasta | O que tem |
|---|---|
| [`motor/`](animacoes/motor/) | motor único de todas as séries: personagem (rig orgânico e clássico), cenas, áudio, roteiro e QA |
| [`templates/`](animacoes/templates/) | chat, ilustrado e filmes |
| [`series/se-vira-tico/`](animacoes/series/se-vira-tico/) | Se Vira, Tico: elenco, episódios, vozes e resultados |
| [`series/misterios-do-brasil/`](animacoes/series/misterios-do-brasil/) | Mistérios do Brasil (nome a definir): canal, roteiros e pautas |
| [`series/filmes/`](animacoes/series/filmes/) | Filmes (nome a definir), em exploração |
| [`referencias/`](animacoes/referencias/) | vídeos de outros criadores analisados, pesquisas e visuais |
| [`estudos/`](animacoes/estudos/) | protótipos, entre eles o ator orgânico v4 aprovado |

Branches: `main` é a linha principal. As branches `tico/ep04`, `tico/ep05-v2`, `tico/t1-formato` e `tico/visual-plotline` guardam versões paralelas do Tico que ainda vão ser escolhidas e juntadas.

## Regras gerais

- Vídeos, áudios e renders ficam fora do git. Chaves ficam em variáveis de ambiente ou em `.env.local`, nunca no repositório.
- Cada frente segue o `AGENTS.md` da própria pasta.
- Só o João publica, nas contas dele.

## Origem

Criado em 2026-11-12 juntando, com histórico, dois repositórios locais:

- `plotline` (branch `main`) em `animacoes/`
- `se-vira-tico` (branch `codex/ep06-final-t1`, que contém `main`) em `animacoes/se-vira-tico/`

Por cima de cada importação há um commit com o estado do disco naquele dia, incluindo o que ainda não estava commitado. As branches de episódio que não entraram na `codex/ep06-final-t1` (`ep04`, `ep05-v2`, `t1-formato`, `visual-plotline`) foram trazidas como `tico/*`, com o trabalho das worktrees que ainda não estava commitado. Em 2026-11-12 tudo foi reorganizado na estrutura acima (veja `animacoes/PROXIMOS-PASSOS.md`).
