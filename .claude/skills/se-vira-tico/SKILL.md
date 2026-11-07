---
name: se-vira-tico
description: "Fluxo de produção dos episódios da série animada Se Vira, Tico (TikTok, 90 s, votação A/B). Use ao escrever roteiro, montar cena, gerar áudio com tempo por palavra, renderizar ou revisar qualquer episódio."
---

# Se Vira, Tico

Comédia romântica animada em 2D para TikTok. Cada episódio tem cerca de 90 s, em vídeo vertical, e corta o clímax com duas opções A/B para o público votar. O desfecho vencedor abre o episódio seguinte.

**Logline:** Tico, 31, vive de bico em bico e chama o desemprego de "transição de carreira". Ao reencontrar a Lua, vizinha de infância e primeiro crush, passa a inventar mentiras e bicos cada vez mais absurdos para parecer que a vida está resolvida.

O desenho é feito em código com o motor da skill `take-one`: `film.html` desenha cada quadro como função do tempo, o Chrome captura os quadros e o ffmpeg gera o MP4.

## Bíblia curta

A fonte da história é `docs/BIBLIA.md`, com a temporada 1 episódio a episódio, o arco de 10 temporadas e o banco de sátiras. Leia antes de escrever.

**Tom:** afetuoso, em português do Brasil coloquial. O humor vem da situação e do carinho pelos personagens, não do deboche. Toda dureza ganha uma piada, e todo episódio fecha com um fio de esperança. Sem narrador.

**Elenco:** Tico, Lua, Jão, Letícia, Fiscal e Dona Marlene (só voz na temporada 1). Quem é cada um, como fala, paleta e traços estão em `references/elenco.md`.

**Mundo:** capital grande sem bairro real, em paleta quente (laranja, verde-limão, azul-turquesa), com fios de poste, laje e parede com reboco aparente.

**Roteiro:** estrutura de 90 s, regra do absurdo e votação estão em `references/roteiro.md`.

**Produção:** números de cada regra, kit do piloto e fases estão em `references/regras.md`. Respeite a ordem das fases.

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
- A fonte do rig é `personagens/chars.js`. Não edite as cópias nas pastas de episódio. Depois de mudar o rig, rode `node gen-assets.js` na pasta `personagens`.

### Motor do episódio

Cada episódio é dado, não código novo. Siga `episodios/ep01`:

- `roteiro.md` é a fonte das falas e dos tempos. `node scripts/gerar-falas.mjs episodios/epNN` gera `falas.js` a partir dele.
- `ep.js` define planos, câmera, poses, telas e latidos.
- `personagens/motor.js` e `personagens/cenarios.js` são compartilhados. Só crie cenário ou objeto novo quando a história pedir.
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

Trabalhe na branch `epNN` e abra um Pull Request para `main`. Não faça merge.

### 1. Roteiro: `episodios/epNN/roteiro.md`

Siga `references/roteiro.md`: de 200 a 230 palavras, começando no meio da ação, com a regra do absurdo e a sinopse do episódio em `docs/BIBLIA.md`. Cada fala indica personagem, emoção, gesto, plano, cenário, objeto-informação e efeito sonoro. A partir do ep. 2, abra com o desfecho da opção vencedora.

Conte as palavras e meça os tempos: as cenas saem dessa conta. Assim que o autor aprovar o roteiro, acrescente a linha do episódio em `episodios/continuidade.md`. Atualize essa linha quando o vídeo sair e a votação fechar.

### 2. Cenas: `episodios/epNN/cenas.md`

Liste duração, quem aparece, pose e expressão de cada personagem.

### 3. Filme provisório

Monte `film.html` com tempos estimados por um modelo de ritmo, marcados como PROVISÓRIO, e faça um rascunho em 540x960 a 15 fps:

```bash
bash scripts/preparar-film.sh episodios/epNN
cd episodios/epNN
W=540 H=960 bash ~/.claude/skills/take-one/scripts/render-parallel.sh 15 90 ../../render/epNN_rascunho.mp4 1 12
```

Depois gere as vozes localmente com `python scripts/gerar-vozes.py episodios/epNN audio/epNN`, com o VoiceStudio aberto. Os arquivos ficam em `audio/epNN/` (`01_tico.mp3`, `02_lua.mp3`...). A licença do motor é não comercial: leia `docs/VOZES.md`. Confira cada fala com transcrição e ajuste a grafia quando a pronúncia sair errada.

### 4. Áudio com tempo por palavra

- Obtenha o tempo de cada palavra pela API de timestamps do ElevenLabs se houver chave no `.env`; senão, use faster-whisper local em português. Salve em `episodios/epNN/timeline.json`.
- A boca segue o volume da fala do personagem, com as 4 bocas.
- Legendas de 1 a 3 palavras, com destaque na palavra-chave, sincronizadas ao `timeline.json`.
- Música e efeitos sintetizados em código, sem amostras com direitos.
- Mixe com a voz e normalize para cerca de -16 LUFS.

### 5. Render final

1080x1920, 30 fps. Um render por vez: dois na mesma pasta corrompem as peças. Em Windows, veja `docs/NOTAS_WINDOWS.md`.

### 6. QA

```bash
node .claude/skills/se-vira-tico/scripts/qa-episodio.mjs episodios/epNN render/epNN.mp4
```

No rascunho, acrescente `--rascunho`: resolução e fps passam a ser 540x960 e 15, e a loudness não é cobrada. O script cobre os itens medidos; extraia quadros e confira os itens visuais de `references/qa-checklist.md`. Relate os reprovados como estão.

## Checklist de QA

- [ ] Nenhuma imagem parada por mais de 1 s.
- [ ] Membros conectados nas poses de braço levantado.
- [ ] Boca seguindo o volume.
- [ ] Legenda alinhada à voz real.
- [ ] Loudness perto de -16 LUFS (TikTok).
- [ ] Duração de 85 a 95 s.
- [ ] Gesto antes da palavra; expressão troca na piscada; imagem muda a cada 2 a 3 s.
- [ ] Compreensível sem ter visto os episódios anteriores.

Detalhes e forma de medir: `references/qa-checklist.md`.

**Respiração não basta:** 1–2 px mudam menos de 0,5% da imagem, e o gate reprova. Em todo trecho sem ação, inclua piscada, balanço, olhar, câmera ou algo no cenário.

## Nunca

- Copiar personagem existente, inclusive pelas receitas de estilo de terceiros, como as da `huashu-art-motion`.
- Commitar vídeo, áudio ou chave de API.
- Declarar `HOLDS` ou `CUTS` falsos para passar no gate.
- Gastar créditos sem o autor confirmar o valor.
