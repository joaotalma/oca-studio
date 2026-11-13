# Fluxos de produção

Fonte única das instruções dos agentes. As entradas em `.agents` e `.claude` são atalhos gerados, não cópias para editar.

<!-- skill:aprender -->
---
name: aprender
description: Registra o resultado dos vídeos publicados em series/misterios-do-brasil/canal/resultados.csv, aplica a regra de corte e propõe promover padrões a regras em series/misterios-do-brasil/canal/regras.md. Use quando o João trouxer números de um post, pedir uma leitura dos resultados ou quiser decidir se segue um padrão.
---

# aprender

## Entradas

- Números que o João trouxer, ou lidos das contas dele com a permissão dele
- `series/misterios-do-brasil/canal/resultados.csv`, `series/misterios-do-brasil/canal/regras.md`, seção 9 de `series/misterios-do-brasil/canal/canal.md`
- `series/misterios-do-brasil/roteiros/<slug>/postagem.md`

## Passos

1. **Registre** uma linha por vídeo e plataforma, com `lido_em`. Campo sem dado fica vazio, nunca estimado.
2. **Compare** vídeos com tempo de publicação parecido, na ordem do método: retenção em 3 s e 20 s, visualização completa, compartilhamentos e salvamentos, seguidores.
3. **Separe** o que foi medido do que é interpretação. Diga o tamanho da amostra. Com poucos vídeos, a resposta pode ser "ainda não dá para concluir".
4. **Aplique a regra de corte:** seguir, ajustar o gancho ou mudar de formato.
5. **Proponha** a próxima variável a testar, uma só.

## Promover um padrão a regra

Só entra em `series/misterios-do-brasil/canal/regras.md` se:

- Apareceu em mais de um vídeo da própria conta, com a variável isolada
- Tem métrica e vídeos citados
- O João aprovou

Uma regra que os dados novos contradizem é revista, com o motivo anotado. Marcas do guia, como [relato] e [hipótese], só mudam com dados da conta.

## Saídas

- `series/misterios-do-brasil/canal/resultados.csv` atualizado
- Leitura curta na conversa, com a decisão da regra de corte
- Se aprovada, uma nova linha em `series/misterios-do-brasil/canal/regras.md`

## Critério de pronto

Nenhum número sem origem, nenhuma previsão de ganho ou de viralização, e a próxima decisão está clara.

## Aprovação

Abandonar um padrão e promover uma regra são decisões do João.

<!-- /skill:aprender -->

<!-- skill:configurar-canal -->
---
name: configurar-canal
description: Preenche ou revisa series/misterios-do-brasil/canal/canal.md com o João por meio de perguntas guiadas sobre tema, tom, personagem, voz, plataformas, direitos, o que evitar e regra de corte. Use ao definir o nicho, quando canal.md estiver em branco ou quando ele quiser mudar algo do canal.
---

# configurar-canal

## Entradas

- `series/misterios-do-brasil/canal/canal.md`, com as perguntas guiadas
- Critérios de nicho em `docs/GUIA.md`, seção "Escolha de nicho e formato"

## Passos

1. Pergunte por seção, poucas perguntas por vez, na ordem do arquivo.
2. As respostas são do João. Você pode sugerir opções e apontar conflitos, mas não preencha nicho, ângulo ou tom por conta própria.
3. Teste o nicho nos quatro critérios do guia: fontes reais, público que pesquisa e compartilha, ângulo próprio, 30 ideias sem repetir a estrutura.
4. Ao preencher plataformas, abra as páginas oficiais e anote a data. Se não conseguir abrir, deixe o campo em branco e diga isso.
5. Deixe a regra de corte escrita com sinais medíveis antes do primeiro vídeo.
6. Atualize "Estado" e "Última revisão" e mantenha as perguntas guiadas de campos ainda vazios.

## Saída

`series/misterios-do-brasil/canal/canal.md` preenchido.

## Critério de pronto

- Seções 1 a 9 respondidas ou marcadas como "não se aplica"
- Regra de corte com sinais medíveis
- Nenhum valor inventado e nenhuma promessa de resultado

## Aprovação

O João confirma o arquivo final. Se a mudança atingir vídeos já publicados, mostre o impacto antes de salvar.

<!-- /skill:configurar-canal -->

<!-- skill:direitos -->
---
name: direitos
description: Classifica um tema, obra ou história como LIVRE, SÓ COMENTÁRIO ou EVITAR, com motivo e fonte, seguindo docs/DIREITOS.md. Use antes de todo roteiro, em candidatos do radar e sempre que surgir dúvida sobre trecho, imagem, música, pessoa ou marca.
---

# direitos

## Entradas

- Tema, obra ou premissa
- `docs/DIREITOS.md` e a seção 7 de `series/misterios-do-brasil/canal/canal.md`

## Passos

1. Identifique obra ou fato, autor, ano e país.
2. Siga "Como decidir" em `docs/DIREITOS.md`, conferindo datas em fonte aberta por você.
3. Procure as armadilhas: tradução, adaptação, ilustração, pessoa real, marca.
4. Em caso de dúvida, use a etiqueta mais restritiva e diga qual é a dúvida.
5. Diga o que o roteiro pode e não pode usar neste caso.

## Saída

O bloco de registro de `docs/DIREITOS.md`, pronto para o cabeçalho de `roteiro.md`.

## Critério de pronto

Etiqueta, motivo em uma frase e fonte com a data da conferência. Sem fonte aberta, não existe LIVRE.

## Aprovação

- **EVITAR** encerra o tema, e o João pode reabrir com outro ângulo.
- **Dúvida sobre obra de alto risco:** pare e pergunte. A triagem é um critério de trabalho, não parecer jurídico.

<!-- /skill:direitos -->

<!-- skill:montar -->
---
name: montar
description: Transforma roteiro aprovado e a narração do João em vídeo, usando a engine e os templates. Gera imagens-âncora ou folha de quadros, render mudo, rascunho e versão final. Use depois da aprovação do roteiro, ou quando ele entregar uma gravação.
---

# montar

## Entradas

Leia `docs/DIRECAO-VISUAL.md` e o `direcao.json` do roteiro quando houver. Não escolher câmera por alternância nem reutilizar automaticamente a arte de um roteiro reescrito. Voice Design ElevenLabs só com autorização explícita do João; configuração independente em `series/misterios-do-brasil/canal/voz-elevenlabs.json`, licença verificada e chave em ambiente. Fluxo local: `node motor/audio/voz-elevenlabs.mjs criar` uma vez; `narrar <pasta>` para um texto autorizado. A autorização de criar uma voz original não implica que ela seja clone do João. A exceção de produção integral desta conversa está registrada no apagão v2; não eliminar os pontos de aprovação dos próximos vídeos.

- `series/misterios-do-brasil/roteiros/<slug>/` com roteiro aprovado, `falas.js` e `video.js`
- Na fase final, `series/<serie>/audio/<slug>/narracao.wav` (ou `.m4a`, `.mp3`, `.flac`) gravada pelo João ou gerada por ele com o clone da própria voz

## Fase 1: âncoras

```bash
bash motor/montar.sh series/misterios-do-brasil/roteiros/<slug> --rascunho
```

- **Chat e caixa de texto:** gere uma folha com o primeiro quadro, a virada e o último quadro.
- **Ilustrado:** gere as imagens-âncora com a descrição imutável de `series/misterios-do-brasil/personagens/`, um enquadramento e no máximo um movimento por plano, sem fotorrealismo. Guarde os prompts em `series/misterios-do-brasil/roteiros/<slug>/assets/`.

**PARE: aprovação 2.** Mostre as âncoras e espere o sim. Depois, peça a gravação.

## Fase 2: final

```bash
bash motor/montar.sh series/misterios-do-brasil/roteiros/<slug>
```

O script corta a narração nas pausas, sincroniza, mixa, masteriza a -16 LUFS, renderiza e roda o QA. Para testes curtos, adicione `--sem-duracao`. Para música com licença anotada, adicione `--musica faixa.wav`.

## Se o corte falhar

- **Poucas pausas:** o script para e diz quantas achou. Peça uma regravação, com pausa clara entre as falas.
- **"CONFERIR" no relatório:** um corte pode ter caído no lugar errado. Ouça o trecho antes de seguir.
- **Pausas:** o ritmo entre as falas vem de `pausa` em `falas.js`, não da gravação. Para mudar uma pausa, edite o campo e remonte.

## Saídas

- `render/<slug>/<slug>.mp4`
- `series/misterios-do-brasil/roteiros/<slug>/tempos.js`

## Critério de pronto

`motor/qa/qa-video.mjs` aprova os itens medidos, e o vídeo vai para a skill `qa`.

## Nunca

- Gerar voz sem autorização explícita e licença verificada. Quando autorizado, usar o perfil independente do Plotline e registrar o uso; fora disso, entregar render mudo identificado.
- Usar template só especificado sem antes implementar e validar com um teste curto.

## Atualização de 12/11/2026 — prevalece sobre o fluxo anterior

Seguir `motor/FLUXO-RAPIDO.md`. Gate completo no rascunho 540×960/15 fps; um master 1080×1920/30 fps após passar. QA leve validado por hashes e amostras em alta; revisar as amostras. Com revisão editorial, direitos e entrega completos, `motor/finalizar.mjs` registra a aprovação final automática autorizada pelo João. Não solicitar novo aceite final; roteiro e âncoras mantêm aceite explícito. Nenhum bloqueio pode ser ignorado e só João publica.

<!-- /skill:montar -->

<!-- skill:novo-video -->
---
name: novo-video
description: Orquestra a produção de um vídeo do Plotline, do tema ao vídeo final, com aceite de roteiro e imagens-âncora e aprovação final automática autorizada. Use quando o João pedir um vídeo novo, partir de um tema ou do radar, ou retomar um vídeo em andamento.
---

# novo-video

Roda a cadeia na ordem. Não pula etapa e não decide pelo João nos pontos de aprovação.

## Entradas

Antes de escolher ou retomar uma pauta, faça uma consulta estratégica curta com `docs/PROMPT-PESQUISA.md` e registre a data. Se o João já escolheu o tema, confirme a janela e procure referências atuais opcionais sem trocar o ângulo dele. Sinal fraco pode resultar em nenhuma referência; não fabricar tendência nem gastar créditos novos sem autorização.

- Um tema, ou um candidato de `series/misterios-do-brasil/radar/`. Sem isso, rode `radar`.
- `series/misterios-do-brasil/canal/canal.md` preenchido. Em branco, rode `configurar-canal` e pare.

## Cadeia

| # | Etapa | Saída | Depois |
|---|---|---|---|
| 1 | `direitos` | Etiqueta do tema | EVITAR encerra e registra o motivo |
| 2 | `pesquisa` | `fontes.md` | Segue |
| 3 | `roteiro` | `roteiro.md`, `falas.js`, `video.js` | **PARA: aprovação 1** |
| 4 | `montar`, fase âncoras | Imagens-âncora ou folha de quadros | **PARA: aprovação 2** |
| 5 | João grava ou gera com o clone | `series/<serie>/audio/<slug>/narracao.*` | Espera o arquivo |
| 6 | `montar`, fase final | Vídeo em `render/<slug>/` | Segue |
| 7 | `qa` | `qa.md` | Reprovado volta a `montar` |
| 8 | `postagem` | Capa e `postagem.md` | Preparar a entrega |
| 9 | Entrega | Vídeo, revisão e QA | **Finalização automática autorizada**; João publica |
| 10 | `aprender` | Resultados e regras | Quando houver dados |

## Pontos de aprovação

Em cada um: mostre o material, diga o que decidir e espere um sim explícito. Silêncio não é aprovação, e uma aprovação não vale para a etapa seguinte.

1. **Roteiro:** texto completo, etiqueta de direitos, fontes e duração estimada.
2. **Imagens-âncora:** no template ilustrado, as imagens. Em chat e caixa de texto, uma folha com o primeiro quadro, a virada e o último quadro, feita em rascunho.
3. **Vídeo final:** após revisão editorial e QA, finalizar e registrar a aprovação automática autorizada em `aprovacao.json`. Não pedir outro sim ao João.

## Saídas

Pasta `series/misterios-do-brasil/roteiros/<slug>/` completa e `render/<slug>/<slug>.mp4`.

## Critério de pronto

Os aceites editoriais e a aprovação final automática registrados em `roteiro.md` com a data, QA aprovado e `postagem.md` preenchida.

## Nunca

- Publicar ou agendar. A publicação é manual, nas contas do João.
- Gerar voz sem autorização explícita e licença verificada. A voz original jovem aprovada em 2026-11-08 usa `series/misterios-do-brasil/canal/voz-elevenlabs.json`; seguir a autorização do João para cada produção.
- Rodar vários vídeos sem aprovar um roteiro por vez.

## Retomar

Veja o que existe em `series/misterios-do-brasil/roteiros/<slug>/` e as aprovações em `roteiro.md`, e continue da primeira etapa sem aprovação.

## Atualização de 12/11/2026 — prevalece sobre o fluxo anterior

Seguir `motor/FLUXO-RAPIDO.md`. Gate completo no rascunho 540×960/15 fps; um master 1080×1920/30 fps após passar. QA leve validado por hashes e amostras em alta; revisar as amostras. Com revisão editorial, direitos e entrega completos, `motor/finalizar.mjs` registra a aprovação final automática autorizada pelo João. Não solicitar novo aceite final; roteiro e âncoras mantêm aceite explícito. Nenhum bloqueio pode ser ignorado e só João publica.

<!-- /skill:novo-video -->

<!-- skill:pesquisa -->
---
name: pesquisa
description: Reúne e confere os fatos de um tema aprovado e mede vídeos de referência, gravando fontes em series/misterios-do-brasil/roteiros/<slug>/fontes.md. Use depois da etiqueta de direitos e antes de escrever o roteiro, ou quando o João pedir para checar um fato ou medir uma referência.
---

# pesquisa

## Entradas

- Tema, ângulo e etiqueta de direitos
- `series/misterios-do-brasil/canal/canal.md`

## Passos

1. **Fatos:** para cada data, número, lugar e nome, abra a fonte. Prefira fonte primária. Fato sem fonte vira "não confirmado" e não entra no roteiro.
2. **Conflitos:** quando as fontes discordarem, registre as duas e diga qual escolheu e por quê.
3. **Referências, quando úteis:** meça duração, palavras por minuto, segundo do primeiro corte, número de cortes, tipo de gancho, onde está a virada e como termina. Confira três valores à mão.
4. **Só estrutura:** referência ensina estrutura. Não copie texto, ordem nem imagem.
5. **Ângulo:** liste duas ou três opções. A escolha é do João.

## Saída

`series/misterios-do-brasil/roteiros/<slug>/fontes.md`:

```markdown
# Fontes: <tema>
Direitos: <bloco da skill direitos>

## Fatos
| Afirmação | Fonte (link) | Conferido em | Situação |

## Não confirmados (fora do roteiro)

## Referências medidas
| Vídeo | Duração | ppm | 1º corte | Gancho | Virada | Fim |

## Ângulos possíveis
```

## Critério de pronto

Cada afirmação que o roteiro vai usar tem link e data. Nenhum número de ganho ou de alcance apresentado como certo.

## Aprovação

Sem parada própria. Vai para o João junto com o roteiro. Pare antes se a pesquisa derrubar a premissa.

<!-- /skill:pesquisa -->

<!-- skill:postagem -->
---
name: postagem
description: Prepara a ficha de publicação manual de um vídeo aprovado (títulos, descrições, rótulo de conteúdo sintético, créditos e registro). Use depois da aprovação do vídeo final. Esta skill nunca publica nem agenda.
---

# postagem

Só o João publica, nas contas dele. Não use ferramenta que poste, agende ou envie vídeo, mesmo que ela esteja disponível.

## Entradas

- Vídeo com aprovação 3
- `roteiro.md`, `fontes.md` e `qa.md`
- Seção 6 de `series/misterios-do-brasil/canal/canal.md`

## Passos

1. Escreva título e descrição por plataforma. Sem promessa de renda e sem isca que o vídeo não cumpre.
2. Para cada plataforma, indique se o rótulo de conteúdo sintético se aplica. Se a regra não foi conferida na página oficial, confira ou escreva "a conferir".
3. Liste as licenças: voz, música, imagens.
4. Anote a variável que este vídeo testa, conforme a regra de corte.
5. Monte a ficha para ele preencher depois de publicar.
6. **Sem isca de engajamento** no título, na descrição e no comentário fixado: nada de "comente", "envie", "marque" ou "a mais comentada". A pergunta final é aberta. A Meta reduz a distribuição dessa isca.
7. **Uma linha por rede** com o que muda: Instagram em conta profissional de criador; TikTok em conta pessoal; YouTube marcado como "não é para crianças". Uma playlist por série no YouTube.
8. Lembre o João de **responder à mão** os primeiros comentários e de **não usar automação de mensagens** (ManyChat ou parecido). Fonte: `docs/referencias/temporada-viral-metodo.md`.

## Saída

`series/misterios-do-brasil/roteiros/<slug>/postagem.md`:

```markdown
# Postagem: <slug>
Arquivo: render/<slug>/<slug>.mp4
Gancho: | Tema: | Variável testada:
Voz: João | Música e licença: | Imagens e licença:

| Plataforma | Título | Descrição | Rótulo sintético | Regra conferida em | Publicado em | Link |

Checklist: gancho em 3 s | fatos com fonte | licenças | área segura | celular com e sem som | rótulo decidido | sem isca de engajamento | "não é para crianças" no YouTube
```

## Critério de pronto

Ficha completa, exceto os campos que só existem depois de publicar. Vídeos marcados como teste não recebem ficha.

## Aprovação

A publicação é o ato de aprovação do João. Depois de publicar, ele passa os links para a skill `aprender`.

<!-- /skill:postagem -->

<!-- skill:qa -->
---
name: qa
description: Confere um vídeo montado com medições automáticas, folha de quadros e checagem de conteúdo e direitos, e registra o resultado em qa.md. Use depois de montar e antes de mostrar o vídeo final ao João, ou quando ele pedir uma revisão.
---

# qa

## Entradas

- `render/<slug>/<slug>.mp4`
- `series/misterios-do-brasil/roteiros/<slug>/` com roteiro, fontes e etiqueta
- `qa-checklist.md`, nesta pasta

## Passos

1. **Medições:** se `produzir.mjs` já executou o fluxo, usar os relatórios vinculados por hash em `qa-resultados/`; não repetir o gate completo no master. A chamada abaixo é a alternativa completa para investigação de um defeito. No fluxo padrão, usar `--final-leve` com o relatório válido do rascunho e o mesmo áudio, conforme `motor/FLUXO-RAPIDO.md`.

```bash
node motor/qa/qa-video.mjs render/<slug> render/<slug>/<slug>.mp4
```

2. **À vista:** extraia uma folha de quadros, olhe de fato cada um e confira o primeiro quadro, a virada e o último.

```bash
ffmpeg -v error -y -i render/<slug>/<slug>.mp4 -vf "fps=1/2,scale=270:-1,tile=6x4" -frames:v 1 render/<slug>/folha.png
```

3. **Conteúdo:** fatos, direitos, licenças e rótulo, conforme o checklist.
4. **Classifique:** cada problema é **bloqueia** ou **sugestão**, com o momento do vídeo.

## Saída

`series/misterios-do-brasil/roteiros/<slug>/qa.md`, com a saída das medições, o que foi visto, o que não foi conferido e os problemas por classe.

## Critério de pronto

Nenhum **bloqueia** aberto. Item não medido fica como "não conferido", nunca como aprovado. Um render mudo não passa como final.

## Limites

O QA não ouve o áudio nem julga graça ou voz. Isso é do João, que assiste no celular com som e sem som.

## Aprovação

Reprovado volta a `montar`. Sem bloqueios, registrar a revisão, preparar capa/postagem e rodar `motor/finalizar.mjs`: **finalização automática autorizada pelo João**. Só João publica.

## Atualização de 12/11/2026 — prevalece sobre o fluxo anterior

Seguir `motor/FLUXO-RAPIDO.md`. Gate completo no rascunho 540×960/15 fps; um master 1080×1920/30 fps após passar. QA leve validado por hashes e amostras em alta; revisar as amostras. Com revisão editorial, direitos e entrega completos, `motor/finalizar.mjs` registra a aprovação final automática autorizada pelo João. Não solicitar novo aceite final; roteiro e âncoras mantêm aceite explícito. Nenhum bloqueio pode ser ignorado e só João publica.

<!-- /skill:qa -->

<!-- skill:radar -->
---
name: radar
description: Procura o que está em alta (Google Trends, vidIQ, livros, filmes, séries e vídeos mais vistos) e entrega uma lista de candidatos a tema, cada um com etiqueta de direitos. Use quando o João pedir ideias, tendências ou o que está em alta para o canal.
---

# radar

## Entradas

- `series/misterios-do-brasil/canal/canal.md`. Sem nicho, o radar é exploratório e deve dizer isso no relatório.
- `series/misterios-do-brasil/canal/regras.md` e radares anteriores, para não repetir candidatos

## Passos

Use `docs/PROMPT-PESQUISA.md` como contrato da rodada: novidades, retornos, temas duráveis com gatilho e referências culturais atuais. Diferencie demanda observada, hipótese de retenção e resultados desconhecidos. Pesquise memes, música, famosos e hábitos quando ajudarem a história; registre origem, janela, uso indireto original e alternativa sem a referência. Não copie áudio, imagem ou letra por estar em alta. Não simule acesso a Trends/feeds nem retenção privada. A pesquisa é acionada antes da pauta; não agenda publicações nem cria rotina recorrente sem pedido.

1. **Colete** em Google Trends, vidIQ, listas de livros, filmes e séries, e vídeos mais vistos em pt-BR.
2. **Avise antes de gastar** créditos ou uso pago de qualquer ferramenta.
3. **Registre a evidência** de cada candidato: link, data, número visto e o tamanho do canal de origem. Um post isolado é hipótese. Procure o padrão em mais de um criador.
4. **Etiquete** cada candidato com `direitos`: LIVRE, SÓ COMENTÁRIO ou EVITAR.
5. **Sugira um ângulo** e um template para cada um, sem escrever o roteiro.
6. **Reddit:** só como banco de premissas, nunca como texto.

## Saída

`series/misterios-do-brasil/radar/AAAA-MM-DD.md` com uma tabela: tema, por que agora, evidência, etiqueta, ângulo possível, template.

## Critério de pronto

- Cada candidato tem link, data e etiqueta
- Nenhum número sem fonte e nenhuma previsão de views
- Padrões a evitar ficam fora: gameplay com voz de IA e recap com trecho de terceiros

## Aprovação

O João escolhe o candidato. O radar não inicia roteiro sozinho.

<!-- /skill:radar -->

<!-- skill:roteiro -->
---
name: roteiro
description: Escreve ou ajusta o roteiro de um vídeo narrado, com gancho, prova, virada e fecho, e gera a marcação de tempo para a engine (falas.js e video.js). Use depois da pesquisa, ou quando o João trouxer um texto para formatar. Termina na aprovação do roteiro.
---

# roteiro

O roteiro é do João. Você rascunha a partir do ângulo dele, ou formata o texto que ele trouxer, e ele decide a versão final.

## Entradas

- `series/misterios-do-brasil/roteiros/<slug>/fontes.md`, o ângulo escolhido e a etiqueta de direitos
- `series/misterios-do-brasil/canal/canal.md`, `series/misterios-do-brasil/canal/regras.md` e `docs/METODO.md`

## Passos

Antes de escrever, leia `docs/DIRECAO-VISUAL.md`. Defina pergunta, mecanismo, pista, virada e resposta em `estrutura.json`; cada fala inclui função, ação visível, informação nova e ligação com a anterior. Compile com `node motor/roteiro/gerar-roteiro.mjs series/misterios-do-brasil/roteiros/<slug>/estrutura.json`. O programa valida e produz `roteiro.md`, `falas.js`, `video.js` e `direcao.json`; não substitui a escrita editorial. Fontes conferidas são obrigatórias para fatos. Radar e referências atuais: `docs/PROMPT-PESQUISA.md`. Não preencher duração com generalidades nem prometer viralização.

1. **Escreva por blocos:** gancho (0 a 3 s), prova (3 a 10 s), desenvolvimento com uma virada, e fecho. Se `series/misterios-do-brasil/canal/canal.md` definir uma estrutura própria, siga a dele. Para a hipótese, use "seria" e marque a fala como `camada: 'seria'` ou `'voce'`; só o que está em `fontes.md` pode ser dito como "foi".
2. **Escreva para o ouvido:** frases de até 15 palavras. Leia em voz alta mentalmente e corte o que trava.
3. **Confira contra as fontes:** nenhum fato fora de `fontes.md`. Em SÓ COMENTÁRIO, nada de trecho, personagem ou cena da obra.
4. **Gere os dados da engine** no formato de `motor/templates/<template>/README.md`. Em `falas.js`, a primeira fala é o gancho, com `inteiro: true`, e cada fala fica em uma linha de JSON válido.
5. **Estime os tempos:**

```bash
node motor/audio/estimar-tempos.mjs series/misterios-do-brasil/roteiros/<slug>/falas.js --ppm <ritmo do canal.md>
```

6. **Confira a duração** contra `series/misterios-do-brasil/canal/canal.md`. Corte texto em vez de acelerar.

## Saídas

- `roteiro.md`: bloco de direitos, duração estimada, tabela de falas por bloco, instrução de gravação e registro de aprovações
- `falas.js` e `video.js`

Os segundos ficam só em `falas.js`, para não existirem duas versões.

## Critério de pronto

- Gancho nos primeiros 3 s, sem apresentação
- Uma virada identificada
- Duração dentro da faixa, com a contagem de palavras
- Cada fato ligado a uma fonte
- `node motor/audio/estimar-tempos.mjs` roda sem erro

## Aprovação

**PARE.** Mostre o texto completo, a etiqueta, as fontes e a duração. Nenhuma imagem antes do sim. Registre em `roteiro.md`: `Roteiro aprovado por João em AAAA-MM-DD`.

<!-- /skill:roteiro -->