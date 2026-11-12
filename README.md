# Oca Studio

Agência de IA do João. Cada frente tem a sua pasta. Oca é a casa indígena em tupi: uma casa só, várias frentes dentro.

| Frente | Pasta | Estado |
|---|---|---|
| Animações (antigo Plotline) | [`animacoes/`](animacoes/) | em produção |
| Automações | [`automacoes/`](automacoes/) | a definir |
| Trading com IA | [`trading/`](trading/) | a definir |

## Animações

`animacoes/` é o kit do Plotline: engine, templates, skills e docs compartilhados pelos canais de animação.

| Canal | Onde está | Estado |
|---|---|---|
| Se Vira, Tico | [`animacoes/se-vira-tico/`](animacoes/se-vira-tico/) | episódios em produção |
| Mistérios do Brasil (nome a definir) | [`animacoes/misterios-do-brasil/`](animacoes/misterios-do-brasil/) | roteiros em `animacoes/roteiros/` |
| Filmes (nome a definir) | [`animacoes/filmes/`](animacoes/filmes/) | em exploração |

## Regras gerais

- Vídeos, áudios e renders ficam fora do git. Chaves ficam em variáveis de ambiente ou em `.env.local`, nunca no repositório.
- Cada frente segue o `AGENTS.md` da própria pasta.
- Só o João publica, nas contas dele.

## Origem

Criado em 2026-11-12 juntando, com histórico, dois repositórios locais:

- `plotline` (branch `main`) em `animacoes/`
- `se-vira-tico` (branch `codex/ep06-final-t1`, que contém `main`) em `animacoes/se-vira-tico/`

Por cima de cada importação há um commit com o estado do disco naquele dia, incluindo o que ainda não estava commitado. As branches de episódio que não entraram na `codex/ep06-final-t1` (`ep04`, `ep05-v2`, `t1-formato`, `visual-plotline`) continuam só em `joaotalma/se-vira-tico`.
