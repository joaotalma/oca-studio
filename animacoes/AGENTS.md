# Animações (antigo Plotline): instruções para agentes

Frente de animações da Oca Studio. Aqui ficam o motor, os templates e as séries de vídeos verticais narrados. Responda ao João em português do Brasil, de forma direta.

## Onde está cada coisa

| O quê | Onde |
|---|---|
| Motor único (render, rig, cenários, áudio, QA) | `motor/`, com a origem de cada arquivo em `motor/ORIGEM.md` |
| Templates de vídeo | `templates/`. `chat` e `ilustrado` estão funcionais |
| Séries | `series/<serie>/`, com canal, roteiros, personagens e resultados de cada uma |
| Referências externas (vídeos analisados, pesquisas, visuais) | `referencias/` |
| Estudos e protótipos | `estudos/`. O que está em `estudos/_arquivo/` é só histórico |
| Método, direitos e guia | `docs/METODO.md`, `docs/DIREITOS.md`, `docs/GUIA.md` e `docs/DIRECAO-VISUAL.md` |
| Plano e pendências | `PROXIMOS-PASSOS.md` |

### Séries

- **Mistérios do Brasil** (nome a definir): `series/misterios-do-brasil/`. Canal em `canal/canal.md`, roteiros em `roteiros/<slug>/` e pautas em `radar/`. Render: `bash motor/montar.sh series/misterios-do-brasil/roteiros/<slug>` no Git Bash, rodado a partir de `animacoes/`. Revisão v2: `radar/revisao-roteiros-v2.md`, com as versões novas em `roteiros/<slug>/v2/`. Antes de montar, confira qual versão o João escolheu.
- **Se Vira, Tico:** `series/se-vira-tico/`. Tem motor de produção, elenco, episódios e `AGENTS.md` próprios, que valem dentro da pasta. A reconstrução dos roteiros está em `reconstrucao/` e os resultados medidos em `resultados/`.
- **Filmes** (nome a definir): `series/filmes/`. Formato "Vale a pena?" em exploração.

O fluxo de produção é a skill `novo-video`, que para em três pontos de aprovação. Se `canal.md` da série estiver em branco, rode antes a skill `configurar-canal`.

## Motores

Por enquanto existem dois motores com a mesma raiz:

- `motor/` é genérico, sem elenco fixo, e é usado pelos templates (Mistérios e Filmes).
- `series/se-vira-tico/personagens/` é o motor de produção do Tico, que já entregou os episódios 1 a 6.

O padrão definido para personagem é o **ator orgânico v4**, aprovado pelo João em 2026-11-09. Ele está em `estudos/ator-organico-v4/`, e a versão adaptada ao Tico está em `estudos/tico-rig-organico/`. Unir os dois motores num só é a fase 2 (veja `PROXIMOS-PASSOS.md`). Só faça isso com um teste de render de cada série antes e depois.

## Regras

- **Publicação:** só o João publica, nas contas dele. Não poste nem agende, mesmo que uma ferramenta permita.
- **Voz:** por decisão explícita do João em 2026-11-08, os Mistérios também podem usar o narrador original jovem do ElevenLabs, com licença comercial verificada e perfil em `series/misterios-do-brasil/canal/voz-elevenlabs.json`. Não trate essa voz como clone do João. Outras vozes exigem decisão dele.
- **Humano no meio:** roteiro, ângulo e voz são dele. Agentes rascunham e checam, e ele decide. Nada de cadeia automática de roteiro, voz, imagem e vídeo.
- **Aprovações:** pare no roteiro, nas imagens-âncora e no vídeo final. Não avance sem um sim explícito.
- **Fatos:** todo roteiro tem fontes anotadas. Sem fonte, o fato sai do texto.
- **Ganhos:** não invente números nem prometa viralização. Dados de um post isolado são hipótese.
- **Regras de plataforma:** as do guia vêm de terceiros. Confirme na página oficial antes de decidir.
- **Decisões:** pergunte antes do que não dá para desfazer. No resto, escolha o padrão razoável e diga qual foi.
- **Git:** commit só a pedido. Vídeos e áudios ficam fora do git, e chaves ficam em variáveis de ambiente ou em `.env.local`.
- **Referências:** o material de `referencias/` é de terceiros e serve só para estudo. Não copie personagens, trechos ou assets para os vídeos, e não publique este repositório.
