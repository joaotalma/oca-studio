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
| **Aprendizados com os ajustes do João** | `docs/APRENDIZADOS.md`. Leia antes de escrever, produzir ou revisar qualquer vídeo, de qualquer série |
| Plano e pendências | `PROXIMOS-PASSOS.md` |

### Séries

- **Mistérios do Brasil** (nome a definir): `series/misterios-do-brasil/`. Canal em `canal/canal.md`, roteiros em `roteiros/<slug>/` e pautas em `radar/`. Render: `bash motor/montar.sh series/misterios-do-brasil/roteiros/<slug>` no Git Bash, rodado a partir de `animacoes/`. Revisão v2: `radar/revisao-roteiros-v2.md`, com as versões novas em `roteiros/<slug>/v2/`. Antes de montar, confira qual versão o João escolheu.
- **Se Vira, Tico:** `series/se-vira-tico/`. Tem motor de produção, elenco, episódios e `AGENTS.md` próprios, que valem dentro da pasta. A reconstrução dos roteiros está em `reconstrucao/` e os resultados medidos em `resultados/`.
- **Filmes** (nome a definir): `series/filmes/`. Formato "Vale a pena?" em exploração.

O fluxo de produção é a skill `novo-video`, com aprovação de roteiro e âncoras; a aprovação final foi delegada em 12/11/2026. Se `canal.md` da série estiver em branco, rode antes a skill `configurar-canal`.

## Motor

Há **um motor só**, em `motor/` (veja `motor/README.md`). Todas as séries usam ele:

- `motor/personagem/` tem o rig com elenco, os cenários e o motor de cena. É usado pelo Tico. Ele tem dois estilos, `ESTILO_RIG = 'organico'` (padrão, o v4 aprovado pelo João em 2026-11-09) e `'classico'`. Os eps. 1 a 6 do Tico fixam o clássico no `ep.js`.
- `motor/cenas/`, `motor/audio/`, `motor/roteiro/` e `motor/qa/` são usados por todas as séries. O `mixar.py` tem o modo episódio (trilha sintetizada do Tico) e o modo `--narrado`.
- Mudou o motor? Prove com `motor/qa/quadros.mjs` (gravar antes e comparar depois) que os vídeos prontos não mudaram.

O ator orgânico v4 dos Mistérios (`estudos/ator-organico-v4/`, em Canvas) segue como estudo de referência do personagem "você"; as cenas dos Mistérios ainda são desenhadas por `motor/cenas/`.

## Regras

- **Publicação:** só o João publica, nas contas dele. Não poste nem agende, mesmo que uma ferramenta permita.
- **Voz:** por decisão explícita do João em 2026-11-08, os Mistérios também podem usar o narrador original jovem do ElevenLabs, com licença comercial verificada e perfil em `series/misterios-do-brasil/canal/voz-elevenlabs.json`. Não trate essa voz como clone do João. Outras vozes exigem decisão dele.
- **Humano no meio:** roteiro, ângulo e voz são dele. Agentes rascunham e checam, e ele decide. Nada de cadeia automática de roteiro, voz, imagem e vídeo.
- **Aprovações:** roteiro e imagens-âncora mantêm aceite explícito. Por autorização do João em 12/11/2026, o vídeo final é aprovado automaticamente ao concluir revisão, QA e entrega, registrando `aprovacao.json`; não pedir outro aceite. Ver `motor/FLUXO-RAPIDO.md`.
- **Fatos:** todo roteiro tem fontes anotadas. Sem fonte, o fato sai do texto.
- **Ganhos:** não invente números nem prometa viralização. Dados de um post isolado são hipótese.
- **Regras de plataforma:** as do guia vêm de terceiros. Confirme na página oficial antes de decidir.
- **Decisões:** pergunte antes do que não dá para desfazer. No resto, escolha o padrão razoável e diga qual foi.
- **Git:** commit só a pedido. Chaves ficam em variáveis de ambiente ou em `.env.local`, nunca no git. O vídeo final aprovado de cada episódio vai para `entregas/<série>/<ep>/video.mp4`, com uma pasta por rede (capa e postagem); limite de 100 MB por arquivo. Rascunhos e áudios brutos ficam fora, exceto as falas gravadas do spin-off "Demitido Antes do GTA", que entram para permitir remixar de qualquer lugar.
- **Referências:** o material de `referencias/` é de terceiros e serve só para estudo. Não copie personagens, trechos ou assets para os vídeos, e não publique este repositório.

## Finalização e QA (12/11/2026)

Usar o fluxo único em `motor/FLUXO-RAPIDO.md`: rascunho 540×960/15 fps com gate completo; master 1080×1920/30 fps uma vez, QA leve e aprovação final automática autorizada. Revisão editorial e de direitos continua necessária. Só João publica. A T1 do Tico termina no EP6; roteiros 7–10 excluídos.
