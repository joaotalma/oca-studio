---
name: se-vira-tico
description: "Fluxo de produção dos episódios da série animada Se Vira, Tico (Reels, pouco mais de 60 s, votação A/B). Use ao escrever roteiro, montar cena, gerar áudio com tempo por palavra, renderizar ou revisar qualquer episódio."
---

# Se Vira, Tico

Comédia romântica animada em 2D para Reels (Instagram); TikTok e YouTube estão pausados. Os eps. 1 e 2 têm cerca de 90 s; do ep. 3 ao 6, pouco mais de 60 s; na T2, teste de 1:45 a 2:20 (acima de 1 min, requisito de monetização), em vídeo vertical, e corta o clímax com duas opções A/B para o público votar. O desfecho vencedor abre o episódio seguinte.

**Logline:** Tico, 31, vive de bico em bico e chama o desemprego de "transição de carreira". Ao reencontrar a Lua, vizinha de infância e primeiro crush, passa a inventar mentiras e bicos cada vez mais absurdos para parecer que a vida está resolvida.

O desenho é feito em código com o motor da skill `take-one`: `film.html` desenha cada quadro como função do tempo, o Chrome captura os quadros e o ffmpeg gera o MP4.

## Bíblia curta

A fonte da história é `docs/BIBLIA.md`, com a temporada 1 episódio a episódio, o arco de 10 temporadas e o banco de sátiras. Leia antes de escrever.

**Tom:** afetuoso, em português do Brasil coloquial. O humor vem da situação e do carinho pelos personagens, não do deboche. Toda dureza ganha uma piada, e todo episódio fecha com um fio de esperança. Sem narrador.

**Elenco:** Tico, Lua, Jão, Letícia, Fiscal e Dona Marlene (só voz na temporada 1). Quem é cada um, como fala, paleta e traços estão em `docs/ELENCO.md`.

**Mundo:** capital grande sem bairro real, em paleta quente (laranja, verde-limão, azul-turquesa), com fios de poste, laje e parede com reboco aparente.

**Centro:** a relação do Tico com a Lua, com os altos e baixos da falta de estabilidade financeira e emocional dos dois. Bicos e cargos são o contorno.

**Roteiro:** contrato do episódio (fio, pergunta, pista, virada, entrega), estrutura de pouco mais de 60 s, votação e regra do absurdo estão em `docs/ROTEIRO.md`. O percurso da temporada e a memória de cada voto estão em `episodios/PRE_ROTEIROS_T1.md`.

**Postagem:** legenda com emojis, comentário fixado e kit do Instagram estão em `docs/POSTAGEM.md`. Para montar a pasta no Drive, rode `bash scripts/kit-instagram.sh episodios/epNN`.

**Produção:** números de cada regra, kit do piloto e fases estão em `docs/REGRAS.md`. Respeite a ordem das fases.

**Erros já cometidos:** `docs/ERROS.md`. Releia antes de escrever, produzir ou revisar. Todo erro novo, do autor ou da conferência, entra lá na hora, com a causa e a regra que o evita.

**Aprendizados da Oca Studio:** `../../docs/APRENDIZADOS.md` (a partir de `series/se-vira-tico/`), com a lógica por trás dos ajustes do autor em todas as séries.

## Rig

Antes de criar ou alterar uma pose, leia `personagens/MONTAGEM_DO_RIG.md`. O essencial:

- `drawChar(CHARS.tico, pose)` devolve texto SVG, com o pé de apoio no chão (y = 0) e o corpo subindo em y negativo. `drawDog(estado ou pose)` faz o mesmo para o Fiscal.
- Pose: `armL`, `armR`, `legL` e `legR` são pares `[junta superior, junta inferior]` em graus absolutos a partir de "reto para baixo"; negativo aponta para a esquerda da tela.
- Outros campos: `lean`, `head`, `expr`, `mouth`, `blink`, `breath`, `liftL`, `liftR`, `propL`, `propR` e `frente` (`'L'` ou `'R'`: braço à frente do rosto).
- Pose do Fiscal: `head`, `tail`, `fN`, `fF`, `bN`, `bF` (pares de ângulos das patas), `expr`, `mouth` (0 a 1), `blink`, `breath`.
- Anime só interpolando esses valores. Assim os membros não se soltam.
- Use apenas o que existe:
  - Expressões: `neutro`, `cansado`, `feliz`, `rindo`, `surpreso`, `preocupado`, `envergonhado`, `forcado` (sorriso de quem mente), `bravo`, `triste`, `lado`, `pensando`, `aliviado`.
  - Detalhes do rosto, no campo `detalhe`: `suor`, `lagrima`, `veia`, `brilho`.
  - Bocas de fala: `closed`, `small`, `open`, `wide`.
  - Objetos na mão: `phone`, `cup`.
  - Fiscal: `stand`, `alerta`, `latindo`.
- **Vista:** os humanos só têm vista de frente, e o Fiscal só tem perfil, virado para a esquerda. Não escreva cena que dependa de outra vista: liste a necessidade em `poses_novas.md`. Andar é um passo sem sair do lugar; o deslocamento vem da animação da posição.
- Precisa de pose ou expressão nova? Liste em `poses_novas.md` na pasta do episódio em vez de inventar no filme.
- Para experimentar poses, abra `personagens/estudio.html`. O botão "Exportar JSON" dá os valores prontos.
- A fonte do rig é `../../motor/personagem/chars.js`. Não edite as cópias nas pastas de episódio. Depois de mudar o rig, rode `node gen-assets.js` na pasta `personagens`.

### Motor do episódio

Cada episódio é dado, não código novo. Siga `episodios/ep01`:

- `roteiro.md` é a fonte das falas e dos tempos. `node scripts/gerar-falas.mjs episodios/epNN` gera `falas.js` a partir dele.
- `ep.js` define planos, câmera, poses, telas e latidos.
- `../../motor/personagem/motor.js` e `../../motor/personagem/cenarios.js` são compartilhados. Só crie cenário ou objeto novo quando a história pedir.
- `continua: true` marca um plano que segue o anterior sem corte; comece a câmera dele onde a anterior parou.
- `impactos` lista só impactos propositais, como um estouro. Trocas de legenda e entradas de objeto precisam ser suavizadas, não declaradas.

### Montagem do `film.html`

Siga `episodios/teste/film.html`:

```html
<script src="springs.js"></script>
<script src="chars.js"></script>
```

- `chars.js` deixa vários nomes globais, como `CHARS`, `drawChar`, `T`, `OUT` e `lerp`. Deixe o código do filme dentro de uma função `(() => { ... })();` e não redeclare `CHARS` nem `drawChar` fora dela. Se houver conflito, `READY` nunca chega e o render fica reiniciando sem mostrar a causa.
- Exponha `window.FILM_DURATION`, `window.renderFrame(t)` e `window.READY`.
- `renderFrame` monta o SVG, carrega em uma `Image`, faz `await img.decode()` e desenha no canvas.
- Tudo depende só de `t`. Sem `Math.random`, relógio ou `localStorage`.
- Declare cortes secos em `window.CUTS`. Use `window.HOLDS` só para pausas que são mesmo intencionais, nunca para fazer o gate passar.

## Fluxo por episódio

Use uma branch `codex/<serie>-<episodio>`. Commit e push apenas quando solicitados; merge na main somente a pedido.

### 1. Roteiro: `episodios/epNN/roteiro.md`

Parta do `pre_roteiro.md` do episódio e dos comentários do autor nele. Siga `docs/ROTEIRO.md`: escreva primeiro o contrato e a corrente de causa e consequência, depois as falas. Cada fala indica personagem, emoção, gesto, plano, cenário, objeto-informação e efeito sonoro. Abra retomando o ponto exato em que o episódio anterior parou, no caminho vencedor, sem voltar no tempo.

Conte falas e palavras e meça os tempos pelo ritmo das vozes do episódio anterior: as cenas saem dessa conta. Antes de pedir aprovação, passe a conferência do fim de `docs/ROTEIRO.md`. Assim que o autor aprovar o roteiro, acrescente a linha do episódio em `episodios/continuidade.md`. Atualize essa linha quando o vídeo sair e a votação fechar.

### 2. Cenas: `episodios/epNN/cenas.md`

Liste duração, quem aparece, pose e expressão de cada personagem.

### 3. Filme provisório

Monte `film.html` com tempos estimados por um modelo de ritmo, marcados como PROVISÓRIO, e faça um rascunho em 540x960 a 15 fps:

```bash
bash scripts/preparar-film.sh episodios/epNN
cd episodios/epNN
W=540 H=960 node export.mjs 15 ../../render/epNN_rascunho.mp4
```

Depois gere as vozes no ElevenLabs com `node --env-file=.env.local scripts/gerar-vozes-elevenlabs.mjs episodios/epNN audio/epNN`, como descreve `docs/VOZES.md`. Os arquivos ficam em `audio/epNN/`. Confira cada fala com transcrição e ajuste a grafia quando a pronúncia sair errada. O OmniVoice, de licença não comercial, ficou só nos eps. 1 e 2.

### 4. Áudio com tempo por palavra

- Obtenha o tempo de cada palavra pela API de timestamps do ElevenLabs se houver chave no `.env`; senão, use faster-whisper local em português. Salve em `episodios/epNN/timeline.json`.
- A boca segue o volume da fala do personagem, com as 4 bocas.
- Legendas de 1 a 3 palavras, com destaque na palavra-chave, sincronizadas ao `timeline.json`.
- Música e efeitos sintetizados em código, sem amostras com direitos.
- Mixe com a voz e normalize para cerca de -16 LUFS.

### 5. Montagem e render com gate no rascunho

Depois de sincronizar e preparar a mixagem/master, usar o fluxo compartilhado, a partir da raiz da série:

```bash
node ../../motor/produzir.mjs episodios/epNN --audio render/epNN_master.wav --duracao 61,68 --sem-texto
```

A faixa 61–68 s corresponde aos episódios 3–6 da T1; usar 85–95 s nos dois primeiros e 105–140 s no spin-off. O fluxo renderiza 540×960/15 fps, aplica o gate completo e só então produz o master 1080×1920/30 fps. Render paralelo não é padrão; permanece experimento. Um render por vez.

### 6. Revisão e finalização

Conferir o rascunho visualmente antes do master quando houver ajustes de cena; `--rascunho` encerra na etapa de prévia. O QA final reutiliza o gate do rascunho apenas com hashes válidos de fonte, áudio e MP4; mede o áudio e extrai amostras em alta. Não repetir o gate completo no master sem um defeito que justifique.

Depois de olhar as amostras e conferir conteúdo/direitos, registrar `qa-resultados/revisao-final.json`, preparar capa/postagem e executar `../../motor/finalizar.mjs` conforme `../../motor/FLUXO-RAPIDO.md`. A aprovação final foi delegada ao fluxo pelo João em 12/11/2026: não pedir novo aceite. Roteiro e âncoras continuam com aceite explícito. Somente João publica.

O comando `node scripts/qa-episodio.mjs <filme> <video>` continua disponível para investigar um episódio; o uso sem `--final-leve` executa o gate completo e não deve ser repetido automaticamente após `produzir.mjs`.

## Checklist de QA

- [ ] Nenhuma imagem parada por mais de 1 s.
- [ ] Membros conectados nas poses de braço levantado.
- [ ] Boca seguindo o volume.
- [ ] Legenda alinhada à voz real.
- [ ] Loudness perto de -16 LUFS (TikTok).
- [ ] Duração de 85 a 95 s nos eps. 1 e 2; de 61 a 68 s do ep. 3 ao 6; de 1:45 a 2:20 do ep. 7 em diante (teste da T2).
- [ ] Tela do voto com "Vocês decidem", sem "Comente" (o QA reprova isca de engajamento).
- [ ] Gesto antes da palavra; expressão troca na piscada; cada corte motivado por informação nova ou reação.
- [ ] Conflito compreensível nos primeiros 3 s, sem ter visto os episódios anteriores.
- [ ] Toda tela de texto legível no celular sem pausar.

Detalhes e forma de medir: `docs/QA-CHECKLIST.md`.

**Respiração não basta:** 1–2 px mudam menos de 0,5% da imagem, e o gate reprova. Em todo trecho sem ação, inclua piscada, balanço, olhar, câmera ou algo no cenário.

## Nunca

- Copiar personagem existente, inclusive pelas receitas de estilo de terceiros, como as da `huashu-art-motion`.
- Commitar vídeo, áudio ou chave de API.
- Declarar `HOLDS` ou `CUTS` falsos para passar no gate.
- Gastar créditos sem o autor confirmar o valor.

## Acabamento aprovado para novos episódios

Antes de montar cenas novas, leia `docs/ACABAMENTO_VISUAL.md`. Use `EPISODIO.visual` para luz de recorte e sombra por ambiente; `SerieVisual` oferece rua detalhada, abertura configurável, GPS com trajeto compartilhado e setas animadas. Live pertence à tela do aparelho. Preserve pausas de reação e proporções do cenário. Não reprepare nem rerenderize o EP2 publicado por causa dessas melhorias.

## Atualização de produção (12/11/2026)

A T1 terminou no EP6; roteiros 7–10 excluídos. Para o spin-off e novos episódios usar `../../motor/FLUXO-RAPIDO.md`: gate completo em 540×960/15 fps, master uma vez em 1080×1920/30 fps e QA leve. Revisão artística/editorial permanece. Finalização registra aprovação automática autorizada, sem solicitar outro aceite final. Só João publica.

## Capas do spin-off

Antes de criar capa de Demitido Antes do GTA, ler `demitido-gta6/GUIA-CAPAS.md` na raiz da série. Esse padrão foi aprovado explicitamente pelo João em 12/11/2026 e prevalece sobre a capa inicial do Dia 1.
