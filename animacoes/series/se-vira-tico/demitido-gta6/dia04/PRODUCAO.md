# Dia 4: Paçoca (produção)

Estado em 16/11/2026: **roteiro v3 aprovado pelo João** (`roteiro.md`). **Episódio produzido e entregue** (93 s; gate 7/7; QA final aprovado nos itens medidos; `entregas/demitido-antes-do-gta/dia04/`; ver `qa.md`). Falta só a publicação do João e o placar 24 h depois. Notas de produção abaixo.

Como reproduzir (Linux, Node 26 do nvm; `python3` com numpy num venv): `node dia04/hq/preparar.mjs` (de `animacoes/`); som com `python hq/efeitos.py|musica.py|risadas.py render/demitido-gta6/dia04-final/<x>.wav` e `node hq/audio-final.mjs`; render final 1080×1920 com `PARTES=2` (3 partes estoura a memória de 8 GB); capa com `node demitido-gta6/dia04/hq/preparar-capa.mjs` e `node demitido-gta6/dia04/capa.mjs` de `series/se-vira-tico/`.

## Autorizações do João (16/11/2026)

- Roteiro aprovado. Conferência da política do Instagram **dispensada**. O pedido de curtida/seguidor e o "comentário mais criativo" são exceção autorizada ao item 19 de `docs/APRENDIZADOS.md`; o QA deve registrar como exceção, não reprovar.
- Voz e render autorizados a seguir. Antes de gerar a voz, **mostrar a estimativa de créditos** (12 falas do Kauã, cerca de 875 caracteres; só a voz `kaua2`, sem outras vozes) e gerar com `--confirmar`. Não gerar nada além das 12 falas.
- Finalização automática vale (delegada em 12/11/2026): revisão editorial/visual, QA e entrega completos, sem novo aceite. **Só o João publica**; não postar nem agendar. Sem commit, a menos que ele peça.

## O que ler antes

`../../../../docs/APRENDIZADOS.md`, `../METRICAS.md` (dados do Instagram dos dias 1 a 3 e as regras a testar), `roteiro.md` (falas, tempos-alvo, cenas), `../BIBLIA.md`, `../GUIA-CAPAS.md`, `../dia03/PRODUCAO.md` e `../dia02/PRODUCAO.md` (modelos do processo).

## Regras que vieram dos dados (não mexer sem avisar o João)

- Aos 10 s o espectador já tem de ter entendido a premissa e rido. A fala 1 e a 2 do roteiro cumprem isso.
- Sem "ontem vocês votaram" na fala. Sem pedido de seguir no meio. Sem tela de votação separada; o pedido do comentário é falado por cima da última cena.
- Voz clara, sem filtro abafado. Primeiro quadro já com a barra e o relógio.
- O placar de ajuda no celular começa **em zero**; nunca mostrar número inventado. O Dia 4 não usa nenhum número do Dia 3.

## Passos

1. **Voz.** Copiar `../../scripts/gerar-falas-dia03.mjs` para `gerar-falas-dia04.mjs` (anotar a origem), com as 12 falas de `roteiro.md` (F1 a F12), voz `kaua2`, marcas de tom como nas falas do Dia 3. Mostrar a estimativa e só então rodar com `--confirmar`. Áudios em `../../audio/demitido-gta6-dia04/`.
2. **`falas.js`** em `dia04/`, no formato do `dia03/falas.js` (tempos reais medidos das gravações, mais as pausas de imagem, e `MARCOS`). Os tempos do roteiro são só alvo.
3. **HQ V10 (sem 3D).** Pasta `dia04/hq/`, partindo de `../dia03/hq/` (`preparar.mjs`, `final.js`, `pecas.js` do Dia 2, `direcao-hq.js` do Dia 1): copiar e anotar a origem, sem editar as cópias preparadas. Arte nova: mercadinho (balcão), caixa de paçocas, senhora, criança com a mãe, cliente do Pix e o QR code desenhado em papelão, o quarto com a cama, o controle tunado (acelerador de moto, adesivos de chama, espelhinho, buzininha), o bilhete do Jão, a TV com o jogo de futebol genérico, o celular com o placar zerado e a barra de dinheiro (R$ 13,20 → R$ 0 → R$ 3 → R$ 15). Paçoca é objeto pequeno e mão em close é risco do rig: planos médios (APRENDIZADOS 11 a 15).
4. **Som.** Efeitos sintetizados no estilo do Dia 3 (`hq/efeitos.py`): caixa registradora, mordida, Pix que falha, moto do Jão, acelerador do controle, pings. Mixagem em `hq/audio-final.mjs` a −16 LUFS. Risadas do pack do João: ver a ressalva de licença no `dia03/PRODUCAO.md`; preferir as sintetizadas.
5. **Render.** Rascunho mudo 540×960, mux com o áudio mestre, QA `--rascunho --duracao 85,140 --sem-texto --leitura hq/pausas-visuais.json` (o alvo é ~92 s, abaixo da faixa 105–140 s do Dia 3, por decisão de manter o ritmo; registrar isso no `qa.md`). Depois 1080×1920 a 30 fps e `--final-leve`. Guardar quadros e amostras fora da pasta preparada. Um render por vez.
6. **Capa** conforme `../GUIA-CAPAS.md`: `node demitido-gta6/dia04/capa.mjs` a partir de `series/se-vira-tico/` (copiar do `dia03/capa.mjs`).
7. **Entrega** em `../../../../entregas/demitido-antes-do-gta/dia04/`: `video.mp4` (até 100 MB), `aprovacao.json`, `STATUS.md`, `instagram/capa.png` e `instagram/postagem.md`. A legenda da postagem não pode ter "Ep. 4" no vídeo (só na capa). Sugestão de horário para o João: dia útil por volta do meio-dia.
8. Atualizar `BIBLIA.md` (estado do Dia 4) ao fechar.

## Depois de publicado (trabalho do João e do próximo chat)

- 24 h depois: ler curtidas, seguidores e compartilhamentos do Dia 4 e calcular o placar (R$ 1, R$ 5, R$ 15). Registrar em `../METRICAS.md`.
- O João escolhe o comentário mais criativo; o Dia 5 abre com o placar real e uma versão adaptada do comentário. Sem comentário bom, o Kauã diz isso e volta à paçoca. Mostrar sem o @, salvo autorização.
- Colar os pontos de retenção do Dia 4 (3 s, 10 s, ~60 s e o final) e comparar com os dias 1 a 3.
