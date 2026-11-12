# Roteiros e continuidade do Se Vira Tico

Leitura local em 2026-11-11. Pesquisa dos roteiros e fontes de produção; nenhuma fonte do Se Vira Tico foi alterada. As novas versões deverão ser propostas separadas, aguardando aceite, preservando as publicadas. Os tempos abaixo são os das tabelas de roteiro, não extraídos dos vídeos publicados; `tempos.js` faz ajustes para áudio real. Dados de audiência vêm da mensagem do João nesta conversa, em 11/11, e não foram conferidos em painel privado.

## Qual sequência e quais versões devem ser reconstruídas?

### Takeaway

A sequência ativa fecha a T1 no episódio 6. Os episódios 1–5 possuem roteiro de produção, falas e uma alternativa `roteiro_tiktok.md`; essas alternativas não são uma fonte segura de continuidade e não devem ser tratadas como remakes já aprovados. O EP6 tem somente pré-roteiro local, com dois blocos iniciais condicionais. O João confirmou em 11/11 que venceu **OUTRO MOTORISTA** no EP5; isso seleciona a abertura do EP6.

### Cited Findings

- Hierarquia: `continuidade.md` prevalece para o já acontecido; `PRE_ROTEIROS_T1.md` guarda o percurso ativo; bíblia/README têm informações antigas sobre 90 s e oito/dez capítulos. A skill atual determina foco na relação e episódios de pouco mais de 60 s, sem narrador. — [Regra de roteiro](C:/Users/joaot/Projetos/se-vira-tico/.claude/skills/se-vira-tico/references/roteiro.md), [continuidade](C:/Users/joaot/Projetos/se-vira-tico/episodios/continuidade.md), [percurso ativo](C:/Users/joaot/Projetos/se-vira-tico/episodios/PRE_ROTEIROS_T1.md), [skill](C:/Users/joaot/Projetos/se-vira-tico/.claude/skills/se-vira-tico/SKILL.md).
- O inventário local tem produção de EP01 a EP05. EP06 contém apenas `pre_roteiro.md`; EP07–10 são explicitamente banco de cenas fora da T1, não episódios já feitos. — [EP6](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep06/pre_roteiro.md), [EP7](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep07/pre_roteiro.md), [EP8](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep08/pre_roteiro.md), [EP9](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep09/pre_roteiro.md), [EP10](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep10/pre_roteiro.md).
- Por instrução nova do João, os remakes de EP1–5 para Shorts/TikTok mantêm a história e usam perguntas retrospectivas; não devem prometer uma nova votação que mude capítulos já fixados. EP6 é o lançamento atual previsto para 11/11 às18h BRT. — Fonte: resposta do João transmitida à coordenação nesta conversa em 11/11.

| EP | Fonte de produção / estado documentado | Alternativas e ressalvas |
|---|---|---|
| 1 | `ep01/roteiro.md`, `falas.js`, `ep.js`; roteiro informa final de86,5s | `roteiro_tiktok.md` v2, `poses_novas.md`, `postagem.md`, `kit.md`; TikTokv2 não traz registro de aceite |
| 2 | `ep02/roteiro.md` aprovado; falas39/202palavras; produção segue caminhoVerdade | `pre_roteiro_A_verdade.md`, `pre_roteiro_B_historia.md`, `esboco_A.md`, `roteiro_tiktok.md`; o cabeçalho antigo diz vozes ainda não existem, mas existem arquivos de produção/sincronização; não tratá-lo como status em tempo real |
| 3 | `ep03/roteiro.md` aprovado para cenas no caminhoChuveiro;12falas noFALAS,65palavras incluindo18reaproveitadas | `pre_roteiro.md`, `pre_roteiro_chuveiro.md`, `roteiro_tiktok.md`; varal/café da alternativa não substituem nove papéis e lanche do produzido |
| 4 | `ep04/roteiro.md` aprovado no caminhoAgoraNão,14falas/65palavras,61,3s de tabela | `pre_roteiro.md`, `roteiro_tiktok.md`; alternativa reposiciona avaliação e encerra corrida sem resolver voto, contrariando produção |
| 5 | `ep05/roteiro.md` aprovado no caminhoVerdade,15falas/72palavras,65,1s de tabela | `pre_roteiro.md`, `roteiro_tiktok.md`; alternativa tem segredo tratado como suspeita doTico e conflito de relógio |
| 6 | `ep06/pre_roteiro.md`, cerca63s/10falas previstas, **não roteiro final produzido** | Apenas início variável; agora usarOutroMotorista por confirmação doJoão; aprovação de curso/cinema/ganchoT2 já constam no plano |

Contagens acima foram calculadas dos arrays `FALAS` de EP1–5, tokenização por espaços:196,202,65,65,72. Incluem palavrão censurado como um token noEP1; não expandem numeral em palavras. As contagens não medem todo texto na tela. — [EP1falas](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep01/falas.js), [EP2falas](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep02/falas.js), [EP3falas](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep03/falas.js), [EP4falas](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep04/falas.js), [EP5falas](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep05/falas.js).

### Inferences

- Nome do arquivo `roteiro_tiktok.md` não equivale a roteiro validado para a nova plataforma. Deve-se reescrever com fonte canônica explícita e duração medida.
- A nova autorização de reconstrução cobre criar propostas separadas; não é autorização para trocar o vídeo de hoje ou apagar roteiros anteriores.

### Gaps

- Não há arquivo final/áudio/render de EP6 na pasta local consultada. Outro chat/worktree pode estar produzindo algo; a coordenação precisa evitar sobrescrever trabalho não visto.
- A postagem de EP4 enviada peloJoão aparece como67s. O roteiro local informa61,3s e o ep.js usa61,8 antes da sincronização. Sem identificar o arquivo exato publicado, não transformar os tempos de tabela em timestamps exatos da curva.

## Como os eventos e votos de EP1 a EP6 se conectam?

### Takeaway

O fio recorrente é promessa/confiabilidade, não troca de emprego. Tico evita vergonha; Lua esconde o próprio sonho. O número “às oito” percorre os capítulos2,5e6: promete sem experiência, promete sem conferir e finalmente confere antes de aceitar. A história pode ser reconstruída com entradas independentes mantendo essa corrente.

### Cited Findings

| Ponte | História que deve permanecer | Estado da escolha / números e horários |
|---|---|---|
| EP1→EP2 | Tico usa bolo deMarlene para consertar pneu daCompanheira emprestada peloJão; reencontraLua na entrega; ela pergunta se é entregador | **Verdade**, confirmado pelo autor e registrado como vencedor noTikTok. RespostaEP2: começouhoje, mas“temporário”. Nota inicial−0,3; prejuízoR$120 resolvido pela troca dobolo |
| EP2→EP3 | Promete mototáxi às8, app exige5estrelas na corrida de teste; Letícia usa live para alongar corrida; combustível acaba; Tico chega empurrando e se esconde daLua por vergonha docheiro | Fonte antiga mantém **Chuveiro como premissa a confirmar por contagem**. É o caminho adotado/aprovado para produção; não afirmar porcentagem ou vitória medida sem dado. Regra: nota5,0 substitui−0,3, só valeuma vez |
| EP3→EP4 | Lua perde reunião/promoção; Júnior recebe posto e pede arquivo dela; Tico devolve moto aoJão, ganha perfume, pede desculpa e oferece **lanche por papéis entrejanelas** | **AgoraNão**, decidido pelo autor e chamado“venceu” no mapa ativo. Respeitar recusa. Não houve encontro anterior; a corrida seguinte é paga |
| EP4→EP5 | Tico apaga mensagem insistente;5estrelas permitem primeira diária grátis de carro; passageiro do ventilador dá1estrela e nota cai para3,0; Lua pega corrida, sente perfume nocinto, pergunta porquesumiu | **Verdade**, roteiro seguinte aprovado nesse caminho e mapa dizvenceu. Ele fugiu por vergonha, não porque a moto quebrou |
| EP5→EP6 | Ele confessa; ela cobra aviso e ri; Lua faz6caixas e combinaR$20 por entrega às20h; Tico promete semver agenda18h30, divulga doces deLua no carro; Letícia“pertinho”leva38km; Lua se inscreve secretamente em curso | **OutroMotorista**, confirmado diretamente peloJoão nesta conversa11/11. Às19h40 Tico estáa34min; Lua lêàs19h41. Outrocarro leva caixasàs19h45; Tico chegaàs20h14 e não recebe osR$20. Não mudar para7h58: esse horário pertenciaàcaronaEP2/3 |
| EP6→T2 | Lua o convida para cinema; ele confereapp antes deaceitaràs8; ela éaprovada no cursoemPortoAlegre e guarda notícia; osdois seaproximam durante sessão | Público sabe daviagem; Tico não. Início em30dias, confirmarvaga atéamanhã. Votoativo pode ser **Beija/NãoBeija**, resultado sónaT2; não equivale namoro |

Fontes da tabela: [continuidade](C:/Users/joaot/Projetos/se-vira-tico/episodios/continuidade.md), [memória dos votos](C:/Users/joaot/Projetos/se-vira-tico/episodios/PRE_ROTEIROS_T1.md), [EP1](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep01/roteiro.md), [EP2](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep02/roteiro.md), [EP3](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep03/roteiro.md), [EP4](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep04/roteiro.md), [EP5](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep05/roteiro.md), [EP6](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep06/pre_roteiro.md). Resultado novoEP5: mensagem doJoão11/11, ainda não incorporada ao registro canônico local durante esta pesquisa.

- Fiscal late somente para mentira dita em voz alta na presença dele. Nada de latir contra promessa por mensagem, segredo silencioso ou fala em outro local. O cinto doEP4 é mentira pequena dentrodocarro semFiscal, por isso não há latido. — [Regra doFiscal](C:/Users/joaot/Projetos/se-vira-tico/.claude/skills/se-vira-tico/references/roteiro.md).
- O negócio, receitas, preços e decisões deLua continuam dela; ajuda doTico não compra encontro. Corrida paga, consentimento e votação de gesto permanecem distintos de namoro. — [Centro da série](C:/Users/joaot/Projetos/se-vira-tico/.claude/skills/se-vira-tico/references/roteiro.md), [percurso](C:/Users/joaot/Projetos/se-vira-tico/episodios/PRE_ROTEIROS_T1.md).

### Inferences

- Para remakes, reconstruir perguntas locais sem anunciar voto para mudança futura emEP1–5. É possível manter decisões visíveis e perguntar retrospectivamente“Você teria feito…?”; não fingir votação nova nem adulterar o resultado antigo.
- Remover uma gag não pode remover o mecanismo necessário ao próximo episódio: conservar5estrelas→carrogratuito→nota3,0; perfume→cinto; caderno→doces→curso; aviso→OutroMotorista→crescimento.

### Gaps

- Os arquivos antigos doEP2 e da continuidade não trazem contagem/porcentagem do votoChuveiro. Reconstrução segue o caminho produzido, com proveniência da escolha identificada.

## O que acontece em cada roteiro publicado e onde estão promessa, virada e entrega?

### Takeaway

EP1/2 têm195–202palavras e crises concretas cedo, mas longos percursos até o núcleo romântico. EP3–5 cortaram muito a fala sem necessariamente reduzir o trabalho de leitura/reconstrução temporal: papéis, telas, recaps e cartelas ocupam boa parte da primeira passagem. Silêncio não é defeito por si: o teste é se a ação visível entrega conflito e progresso compreensíveis.

### Cited Findings

### EP1 — Entregador Não Sobe

- **0–4,6:**“Primeiro dia, primeira entrega. Hoje muda tudo.”(0,3–2,6); pneuexplode2,7; reação censurada3,3–4,4.
- **4,6–13,4:** flashback“Duas horas antes”; pede motoemprestada(4,8–7,4), aceita responsabilidade e ouve regra“entregador não sobe”(10,2–12,4).
- **13,4–26:** entrega perdida/nota−0,3; bagcombolo“Feliz80anos,Marlene”; dívidaR$120; ideiaerrada25s.
- **26–45,5:** recadocantado quenãopediram, pedeR$120; borracheiroentendeotroco;“QueméMarlene?”/“Você,atéopneuficarpronto.”; novaentrega45,5.
- **46–64:** briga deinterfone, ela pedequesuba eelecitaJão;“Desçoemdoisminutos”, cartela“Dezminutosdepois”; Fiscal estabelece mentira.
- **64–75,5:** acliente éLua, crushdeinfância; riem, elaperguntaseéentregador; cortaantesresposta.
- **75,5–82:** votoVerdade/História e“Não tô pedindoajuda.Mas…oqueeufalo?”.
- **82–87:** Marlenesozinhaassopravelaempão. Payoffmoral prepara dor dooutro lado daesperteza; autor decidiu manter nomeigualàMãe, chamadaapenas“Mãe”nassubsequentes.

Fonte e tempos: [EP1roteiro](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep01/roteiro.md), [EP1falas](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep01/falas.js), [decisão duasMarlene](C:/Users/joaot/Projetos/se-vira-tico/episodios/BACKLOG.md).

**Leitura:** conflito físico/econômico aparece antes3s, mas a promessa genérica“Hoje muda tudo” não diz porquê valeacompanhar. Lua sóaparecea64s, cerca74% de86,5s. O arco de solucionaropneu temmicroentregaantesdoromance; não eliminá-la ao cortar. Hipóteses: reduzir explicação/doisregressos e preservar situação grotescadesenhável e custo moral.

### EP2 — Cinco Estrelas

- **0–5,8:** Letícia“esse homem era umninguém”, Tico“Eu tenho nome”, lombada“elevoa”; congelaevolta“Na noite anterior”.
- **5,8–22,5:** respostaVerdade; Lua pede mototáxi para reuniãoàs8;“Temexperiência?”/“Àsoitoeutenho”.
- **22,5–25,5:** apptrava mototáxi até5estrelascorridateste.
- **25,5–62,4:** única passageira5hLetícia, liveemtroca nota; voltas para audiência; GPSnovelo;humilhaçãopequena→biografiainventada; forçaTicoareconhecer“ocurso”comoquem“salvou”.
- **62,4–72,1:** estrelasentregues, Letíciadesce; combustívelacaba7h31;27minapéatéconjunto, camisetaencharcada.
- **72,1–82,8:** Lua agradece(73,1–79,2), elecheiraaxila, nota5,0contrastacomvergonha.
- **82,8–87,7:** Carona/Chuveiro.
- **87,7–93,9:** paçocacomprandoocursoquesuhumilhaçãovendeu.

Fontes: [EP2roteiro](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep02/roteiro.md), [EP2falas](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep02/falas.js).

**Leitura:** mecânica deescalada forte quando voltas aumentamaudiência/diminuemgasolinae tempo; problemaéchegaràmissãonovaapósretornotemporal. Média26sindicariaqueboa parte do consumoaconteceantesdaliveprincipalescalar; média nãolocalizaindivíduos e nãoprova abandonoexatoem26s. Cortarvia causalidade, não simplesmentetodasaspiadasesubtextos.

### EP3 — O Dia Errado

- **0–10:** reaproveitaáudioLua1–7,1 com18palavras, Ticosome docheiro7,2–8,8, chegaemcasa8,8–10.
- **10–11,5:** título.
- **11,5–23,8:**“Nãovouconseguir…”portexto; Lua pegaônibus, portafecha16,5–17,4;1ªfalanova17,5“Parabéns,Júnior”;Júniorpedearquivo/Lua“Mando”;mensagem“Chegueiatrasada”.
- **23,8–39,7:** devolvemoto; Jãodiferenciaencontrodecompensação,dáperfume;“Éencontrooudedetização?”;“Então começaouvindo”.
- **39,7–55,9:** nove papéisescritos perantepúblico:DESCULPA/ACONTECE/COMOFOILÁ?/NÃOFOI/ACULPAÉMINHA/TALVEZ/PRECISOCOMPENSARDEALGUMAFORMA/COMO?/TEPAGO UMLANCHE,QUETAL?;aguarda.
- **55,9–60,4:** Aceita/AgoraNão.
- **60,4–62,9:** CEO“Esseéomeumenino”,passamãonogeldoJúnior.

Fontes: [EP3roteiro](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep03/roteiro.md), [EP3falas](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep03/falas.js).

**Leitura:** 65palavras faladas não significam baixa carga: nove papéis e mensagens somam novas leituras, escrita e interpretação de espaços. O acolhimento daLua exige sentirquebra decompromisso eouvirooutro. Preservar isso, reduzirrecap/textos redundantes. Ganho possível: cena de janela com menos intercâmbios e leitura confortável, não leituraacelerada.

### EP4 — É Só Uma Corrida

- **0–1,5:** replaymudo, Lua comcanetão.
- **1,5–4:** papel“AGORA NÃO.NÃOTÔCOMCABEÇA”.
- **4–6:** Tico“TUDOBEM.”em papel.
- **6–10:** ela pega/abre/abraçacadernodaavó“Descansar40minutos”.
- **10–12,3:** luzdelaapaga,elesegurapapelnasecapela.
- **12,3–13,3:** título.
- **13,8:** primeira fala doepisódio:“‘Outroassunto’comtrêsparágrafos?”.
- **13,3–27,4:** Jãooajudarespeitarrecusa; apagamensagem;5estrelasvalemdiáriagrátis;chave.
- **27,4–31,9:** passageiroventilador/“Primeiroocinto”.
- **31,9–41,2:** Luachamacorrida,separaencontroetrabalho;perfume nocinto.
- **41,2–53,3:** escolalembra infância;“Vocêmatava.Eui junto”;“Porquevocêsumiu?”48,8–51,6.
- **53,3–57,8:** Verdade/Desculpa.
- **57,8–61,3:** passageirodáumaestrela/nota3,0;“Eleligoudomesmojeito.”

Fontes: [EP4roteiro](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep04/roteiro.md), [EP4falas](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep04/falas.js).

**Leitura cruzada:** metade dopúblicorestaaprox12s conformeJoão; pela tabela, isso coincidecomfimdeumaretomadapredominantementesilenciosa, antesdotítuloe daprimeirafala. **Não concluir quesilêncio causa saída**: aquietude pode ser clara/emocionante. O problema a testar é seo entrantenovoidentificaconflito, protagonista e promessa atual duranteprimeiros3s; o caderno/papelpedemconhecimentoprévio. Outrahipóteseédesacoplardeclaradamente a história dacorrida deumrecaplongosobreoutrodia.

### EP5 — Dá Tempo?

- **0–12,8:** pagaVerdade: elefugiu porcheiro;ela“Podia ter avisado”;“Fedendoquanto?”/“OFiscalmudoudecalçada”;risada.
- **12,8–13,8:** título.
- **13,8–29,6:** seiscaixas,piacheia, elepromete“Àsoitotáentregue”22,1–23,8 semleragenda18h30;negociamR$20;amostraecartões.
- **29,6–40,1:** cheirodocenaumelogiodoperfume;passageirorecebecartão;Letícia“pertinho”35–36,2→38km;extratoganhos142/gasolina58/diária0.
- **40,1–44,6:** inscriçãoPortoAlegresóparaopúblico;elaenviaefechanotebook.
- **44,6–55,1:** Lua“Vocêchegaatéasoito?”45,5–49,2;mapa19h40/34min49,2–50,6;eleapaga“tôchegando”emandaaviso honesto; Lua lê19h41epensa.
- **55,1–60,1:** Confia/OutroMotorista.
- **60,1–65,1:**“Descansaramassa”élevadoaopédaletra com pote nacama/cobertor,elaem pé.

Fontes: [EP5roteiro](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep05/roteiro.md), [EP5falas](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep05/falas.js).

**Leitura cruzada:** metade dopúblicorestaaprox10s conformeJoão, duranteopayoff deumconflitoanterior eantesdapromessadesteepisódio. A taxadepulos23,2% contra32,2% doEP4 sugere umprimeirocontatomenosrejeitado nascoletas, masjanelasdiferentes/métricadiferente impedemcausalidade. O retorno final nãoéovoto: votaçãoé55,1–60,1, depois há5s gag decama. Retenção de25% entre35–60 e5% aoencerramento podecoincidircomcartões, gag, sensação decréditos ououtrofator;semcurvabruta e arquivoexacto, não separar qualcausou.

### Inferences

- Hipótese comum: o novo espectador está pagando uma entrada de10–14s de continuidade para sódepois receber omotor doepisódio. Recap reduzido integradoàação pode ajudar mais que acrescentar umchoque semrelação.
- CTA/placa de voto longa pode sinalizar“acabou”; no remakehistórico, pergunta retrospectiva curta pode ficar sobreação/final, preservando uma entrega concreta.
- Médias entre18e33s não autorizam“todos devemter20s”nem“maisfalas retémmais”. A história precisa caber no tempo e sercompreensível para quem chegaagora.

### Gaps

- Semcurvas deEP1–3, nenhum segundo específico deabandono dessesepisódios foimedido.
- A inspeção atual é de roteiro/código, não reprodução audiovisual nem acesso aoalgoritmo; risco editorial precisa ser validado em remakesnovos.

## Quais problemas existem nas alternativas TikTok já presentes?

### Takeaway

As versõesTikTok reduzemduração nominal, mas algumas eliminam eloscausais, invertemcrono e alteram a memória da história. Há materialbom paracortar, porémnão são modelos de continuidade prontos para Shorts/TikTok.

### Cited Findings

- **EP1:** ordemlinearmelhora emrelaçãoao“Duas horas antes”, mas a trocadebolo/consertotemmenosponte. Regras/pneu/bolonumacompressãoprecisamdeixar a conta quitada visível, não pular deborracheiroaceitarparanovamotoemfuncionamento. — [EP1TikTok](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep01/roteiro_tiktok.md).
- **EP2:** gancho0–2s contémLua“Reuniãoamanhã,àsoito.Aempresapagapeloapp.”eTico“Mototáxieufaço.”:12palavras em2s, orçamentoimprovávelnoritmo documentado de2,96palavras/s. Áudio18palavras agradecimentotambémcomprimidojuntoàreação em6s. Ela confia mototáxi antesdeaparecerrespostadopreviousVerdade, quefoicortada. — [EP2TikTok](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep02/roteiro_tiktok.md), [ritmoEP2](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep02/roteiro.md).
- **EP3:** abre emperfumeantesderecuarparaareunião; cria varal e café escolhidohorário, enquanto produzido tem nove papéis e conviteparalanche. Isso nãoémesmorecorte:éoutraencenaçãocommudançasdeevento/cronologia. — [EP3TikTok](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep03/roteiro_tiktok.md), [EP3produzido](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep03/roteiro.md).
- **EP4:** abreperfumecintocomLua, depois retoma ventilador/GPS; painel3,0 surgeantesdavaliaçãoposteriorexplicativa; fecho“corridatermina/avaliação5estrelas”nãoéofechoproduzido(passagema1estrela e pergunta noar). — [EP4TikTok](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep04/roteiro_tiktok.md), [EP4produzido](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep04/roteiro.md).
- **EP5:** começaLuaescura/interrogação“Elaescondealgodemim.Issopodemudartudo”, genérico e sugereconhecimentodoTicoqueeledesconhece. Falassobreseiscaixasaparecemnocarrotrânsito. Depois usa7h58, enquantoprazodocespúblicaé19h40/19h41para20h. Tambémdeixa“tôchegando”semaviso“34min”completo, que éoaprendizadofundamental. — [EP5TikTok](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep05/roteiro_tiktok.md), [EP5produzido](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep05/roteiro.md).

### Inferences

- Converterplataforma nãoésótrocargancho,cortarsegundosemanter“votação”. Precisarecontruir unidadedramática com promessa local paga,causalidade e gancho serialhonesto.
- Não aplicar título/mistério de“segredo” que implique traiçãoquandonaprópriahistóriaéo sonho/curso: a curiosidade precisa corresponderàentrega.

### Gaps

- Não encontreiaceitedoJoão ourender dessas5alternativas com nomesTikTok. Rótulos“versão2”não dizemseforampublicadasoumedidas.

## O que é prioritário para o episódio 6 de hoje?

### Takeaway

EP6 deve usar **OutroMotorista**, mostrar que avisar permiteàLuaresolver, e pagar a evolução doTico ao conferirantesdeprometer. O segredo daviagem é novaassimetriadeLua, não“recompensa romântica” pelaentrega. Beijoé gesto e não comprova namoro.

### Cited Findings

- **0–12s pré-roteiro:** parte daLuaàs19h41; seOutroMotorista, caixas saem19h45 eTicochega20h14 àcozinhavazia; falas“Obrigadaporavisar”/“Nãofiznada”/“Fez.Euconseguiresolver”. Não há locutor identificado formalmente nessaslinhas, masencenaçãosugereLua/Tico/Lua. — [EP6retomada](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep06/pre_roteiro.md).
- **12–26s:** diasdepois,Lua toma iniciativa“Sexta tem sessãoàsoito.Vocêtádeturno?”; elequase“Eudesmarcotudo”, paraeconfereapp;“Àsoitoeuposso”. — [EP6convite](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep06/pre_roteiro.md).
- **26–34s:** sozinha, Luarecebe“Aprovada!CursoConfeitaria.PortoAlegre,RS.Inícioem30dias”, guardacelular; Ticonãosabe. — [EP6notícia](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep06/pre_roteiro.md).
- **34–50s:** tela decinemasóluz/reações. Docedela, Tico“Eute...”→“...lamboosdedoscomessedocegostoso”, Lua“Osseus,né?”. A piada foi marcada peloautorpara testar naturalidade, não deve ser tratadacomofala final aprovada. — [EP6sessão](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep06/pre_roteiro.md).
- **50–55s:** notificação“Confirmesuavagaatéamanhã”;Luaseaproxima. **55–60s:** Beija/NãoBeija com“Obeijonãodecidenamoro”. **60–63s:**“Temporada2—30dias”. — [EP6fecho](C:/Users/joaot/Projetos/se-vira-tico/episodios/ep06/pre_roteiro.md), [T2](C:/Users/joaot/Projetos/se-vira-tico/docs/estrategia/T2.md).

### Inferences

- O orçamento deabertura pode ser comprimido para que“perdeuentrega,ganhouconfiança”sejaumapromessalocalcomconsequênciavisível em poucossegundos. Nãoinventarcliente cancelando ouTico conseguindopagarcontas; osfatospropostos nãoincluemisso.
- O curso temaltapotência deperguntanova“ela vai contar?”queopúblicoentende semtervistobicos anteriores. Pode serplantadocomclarezaemumobjetoqueoleitorconsiga ler, semtrocacronológica ou vozdenarrador.
- Para18h, separar **revisãodoEP6atual** de **remakeYT/TikTok**. Nãoalterarvotaçãoativa ouproduçãoatualàscegas. Oencontro atual precisaseraceitopeloJoão; pesquisadoresnãooaprovaram.
- Se forusadovotoativo multiplataforma depois, definiruma votação fonte de verdade; o remakehistoricodeEP1–5temperguntasretrospectivas e não pode gerar5resultadosnovos contraditórios.

### Gaps

- SemáudioEP6, nenhuma duração de fala émedida. Tabelas novas devem ser chamadas deestimativas e incluir leitura das telas/pausas; 10falasnão garantem63s.
- Não sabemoshorário da produção atual, outras versões noutrochat ou agenda definida;18hé meta doautor, não publicação agendada por ferramenta.

