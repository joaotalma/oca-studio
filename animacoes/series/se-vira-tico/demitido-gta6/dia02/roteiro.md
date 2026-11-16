# Dia 2: Celular Feliz vs. Hambúrguer Louco

**Revisão vigente solicitada pelo João em 14/11/2026:** montagem de 107,116 s, com entrada de batalha, nova identificação do Pedrão e CTA gravados. Sem selfie de Léo/Rafa, sem cena da mãe, sem classificados e sem repetição após o voto. Uma única tela “O que o Kauã vende?”. As cenas e tempos da v4 abaixo são a base histórica; a revisão executável está em `revisao-joao/preparar.mjs`, com decisões em `revisao-joao/DECISOES.md`.

**Estado:** vídeo final aprovado automaticamente, por autorização do João em 12/11/2026.
**Voto vencedor do Dia 1:** **FANTASIA**. Sem contagem de votos, então não há placar (a regra pede 10 votos ou mais). Se o João trouxer os números, entra logo depois do gancho.
**Duração (linha do tempo real, 14/11/2026):** **117,8 s (1:58)**, com cerca de 96 s de fala, já com as pausas apertadas e a fala 2 encurtada. Faixa do QA: 105 a 140 s.
**Direitos:** SÓ COMENTÁRIO. O jogo só é citado; os HUDs e o "Hambúrguer Louco" são nossos, sem marcas reais.
**Visual (decisão do João em 14/11/2026):** **HQ V10 no episódio todo, menos a luta de dança, que é em 3D** (só o trecho de 24 a 40 s). Ponto de partida do HQ: `../dia01/estudos/hq-v10-15s-v2/direcao-hq.js`, copiado para esta pasta com a origem anotada. A entrada e a saída do 3D precisam de corte limpo (a tela de luta de arcade é um "jogo" dentro da história, o que justifica a troca de estilo).

## O que mudou da v1 e por quê

Dados do Dia 1: **95% homens**; 23% de 13 a 17, 32% de 18 a 24 e 31,6% de 25 a 35; **78% aos 3 s, 53% aos 10 s e caindo**. Ou seja, a faixa é de gamers que riem de si mesmos e do grupo de amigos, e quem sai, sai cedo.

- **Antes:** o dia era "o bico rende pouco" e termina em tristeza (pizza, Pedrão pedindo emprego, "fica comigo"). Sem conflito, sem piada, sem vilão.
- **Agora:** o dia tem um **rival** (o mascote do Hambúrguer Louco) e uma **luta de dança numa tela de luta de arcade** (barras de vida, ROUND, FIGHT!, K.O.). A reviravolta é uma **piada de revelação**: o Hambúrguer é o **Pedrão**, o do "✅ garantido". Os dois juram segredo.
- **Gancho:** o quadro 0 já é cômico (cabeça gigante de celular, suando, e a voz abafada de dentro). Uma virada nova a cada ~8 s, não a cada 15, para segurar a queda dos 10 s.
- **Tom:** gíria de gamer leve ("chefão", "nerfaram meu salário"), autodefesa e exagero, sem pena. O Kauã perde dinheiro, mas ganha o ponto da escada e um pacto absurdo.
- **Saiu:** o "fica comigo" triste. O pedido de seguir virou "o Hambúrguer quer revanche" (um pedido só, antes do voto).
- **Mantidos da bíblia:** o Kauã carrega a fantasia e o calor; os amigos o veem de mascote sem saber; o Pedrão também está apertado; pizza de R$ 40; a regra nº 2; voto CADEIRA ou CAMISA.

## Contrato

| Item | Neste episódio |
|---|---|
| **Gancho fixo (0–5 s)** | "Faltam cinco dias pro GTA 6. Eu tenho três e vinte. E tô vestido de celular." |
| **Situação reconhecível** | O bico que você aceita e vira uma guerra boba com um colega, e o amigo que também está quebrado e mente |
| **O que está em jogo** | O ponto da fonte (quem ganha é visto) e a pizza da noite do lançamento (quem não racha não senta) |
| **Segredo** | Ninguém sabe da demissão. O Pedrão também mentiu, e agora os dois se calam |
| **Relógio** | "GTA 6 EM 5 DIAS" |
| **Barra** | Começa em **"R$ 3,20 DE R$ 449,90"**; no pagamento, sobe para "R$ 53,20"; depois da pizza, "R$ 13,20" |
| **Regra do grupo nº 2** | "Quem não racha, não senta." |
| **Plantar para pagar depois** | A cabeça do Celular Feliz no canto do quarto; o cabelo amassado e o rosto vermelho; o Hambúrguer Louco (revanche); a mãe com a "sacola de servidor" (Dia 6); o Pedrão no pacto (Dia 7) |
| **Voto** | **CADEIRA** (vende a cadeira gamer e joga no chão) / **CAMISA**, R$ 150 cada (ficção, ajustável). Finais na `BIBLIA.md` |

## Continuidade

- Saldo: **R$ 3,20 de manhã**. Mais R$ 80 do bico e menos R$ 30 de lavagem da fantasia, **R$ 53,20** à noite. Depois da pizza: **R$ 13,20**.
- Meta: faltam R$ 396,70 para R$ 449,90, ou quase R$ 80 por dia. Ele ganha R$ 50 líquidos por dia no mascote, então não fecha.
- O Kauã carrega o calor e a fantasia: cabelo amassado (precisa da avaliação artística do João), rosto vermelho, a cabeça sorridente no canto do quarto.

## O que os dados do Instagram mudaram (14/11/2026)

Leitura da conta: metade do público sai entre 6 e 13 s e só 5% a 16% chegam ao fim; 98% das views vêm de quem não segue; só 4% visitam o perfil; o bloco de votação perde público e quase ninguém chega a ele. No spin-off, quem passa dos ~20 s fica (44% aos 28 s) e o público é quase só homens jovens. O EP6 errou ao prometer um conflito no gancho e mudar para logística nos segundos seguintes. Poucos episódios, então isto orienta o que testar e não prova nada.

| Dado | O que fiz neste episódio |
|---|---|
| Os segundos 3–10 perdem metade do público | O gancho (0–7 s) é a premissa; o **rival aparece em 17 s** e a luta começa em 24 s. O recap ("Ontem vocês votaram…") foi cortado para uma frase de 4,7 s. O calor, o horário e o termômetro viram imagem, não fala. A única fala logística (a mãe, a sacola) foi para o **fim do dia**. |
| Quem passa de ~20 s fica | O trecho de 7 a 39 s é o mais forte do episódio: o rival, a luta e o K.O. Tudo o que é preparação saiu dali. |
| 90% da audiência é fria | A primeira frase explica tudo sozinha: GTA 6, três e vinte e "vestido de celular". Nada depende de ter visto o Dia 1; "Ontem vocês votaram" só premia quem viu. |
| Só 4% visitam o perfil; falta motivo para seguir | O pedido de seguir sobe de 106 s para **64 s**, logo depois da revelação do Pedrão (o pico de graça), com um motivo concreto: "o Hambúrguer quer revanche". Um pedido só. |
| O bloco de votação perde público | A votação dura 6 s e vem depois de 110 s. Como poucos chegam até ela, o que dá retorno (a piada, a revelação, o pedido de seguir) fica antes. A fala 18 foi regravada em 5,7 s. |

## Viradas (com a linha do tempo real, áudio já com as pausas apertadas)

| s | Virada |
|---|---|
| 0 | Vestido de celular, suando, com R$ 3,20 |
| 7 | "Hoje eu sou o Celular Feliz!" (a escolha do público) |
| 12 | O calor era o chefão... "Não era." |
| 17 | Aparece o rival: o Hambúrguer Louco |
| 24 | Luta de dança pelo ponto da fonte |
| 39 | Os amigos abraçam o mascote e falam do Kauã |
| 46 | A cabeça do Hambúrguer cai: é o Pedrão |
| 56 | O pacto de segredo e o pedido de seguir (64 s) |
| 69 | O gerente desconta R$ 30: "nerfaram meu salário" |
| 79 | A pizza: R$ 40, regra nº 2 |
| 88 | Ele paga: sobram R$ 13,20 |
| 99 | A mãe vê a sacola: "Servidor, mãe." |
| 104 | Duas coisas de valor: a cadeira gamer e a camisa |

## Cenas

A ordem das falas mudou em relação à v3 (os números dos arquivos de áudio são os mesmos). O vetor `FALAS` e a lista `MARCOS` de `falas.js` têm os tempos exatos.

### Abertura: o celular (0,2–7,2 s)

- **Imagem (HQ V10):** já no quadro 0, close da cabeça gigante de celular sorridente, balançando, com gotas de suor, o termômetro "34°" e a voz saindo do furinho. Relógio e barra: "R$ 3,20 DE R$ 449,90". **Gag da tela:** em "E tô vestido de celular" a tela do celular abre como uma tampa, para cima, e aparece o rosto do Kauã (olheira, cabelo amassado, sobrancelhas caídas, bochechas vermelhas). Aproximação lenta até o rosto.
- **F1 · Kauã (voz abafada, de dentro da cabeça), 0,2–7,2 s:** "Faltam cinco dias pro GTA 6. Eu tenho três e vinte. E tô vestido de celular."

### 1. A escolha (7,5–12,5 s)

- **Imagem:** corte rápido para o cartão do voto, **FANTASIA** vencendo (sem números), e depois ele de corpo inteiro na porta da loja "Celular Feliz", com o termômetro marcando 34 °C e o mercúrio estourando.
- **F2 · Kauã, 7,5–12,2 s:** "Ontem vocês votaram. Hoje eu sou o Celular Feliz!"

### 2. O chefão (12,5–23,7 s)

- **Imagem:** ele dança, a cabeça balança, a criança chora. Corte: do outro lado do corredor, o **Hambúrguer Louco** (pão sorridente de bochecha de queijo). Os dois se encaram, e o Hambúrguer faz moonwalk.
- **F5 · Kauã, 12,5–16,9 s:** "Hora quatro. Eu achei que o calor era o chefão. Não era."
- **F6 · Kauã, 17,2–23,7 s:** "Do outro lado do corredor: o Hambúrguer Louco. Ele me encarou. Eu encarei. Ele fez moonwalk."

### 3. A luta de dança (24,0–39,9 s)

- **Imagem:** tela de luta de arcade, **única cena em 3D, câmera lateral** (o resto é HQ V10): duas barras de vida (CELULAR FELIZ × HAMBÚRGUER LOUCO), cronômetro "99", **"ROUND 1" e "FIGHT!" (24,0–25,5 s)** em letreiro nosso, a fonte ao fundo, a tiazinha com sacola de plateia. Os golpes são passos de dança, com faíscas. Nada de logotipo, fonte, sprite, personagem, locutor ou música de jogo de luta existente. O Celular perde a barra quase toda e vence no giro de cabeça.
- **F7 · Kauã, 25,6–32,6 s:** "Disputa pelo ponto da fonte. Quem ganha, é visto. Quem perde, é esquecido. Igual meu currículo."
- **F8 · Kauã, 32,9–38,6 s:** "Dancei como se o GTA dependesse disso. Dependia. Ganhei por um giro de cabeça."
- **K.O. (38,9–39,9 s):** letreiro "K.O.", o Hambúrguer escorrega.

### 4. A selfie (40,1–46,1 s)

- **Imagem:** o Léo e o Rafa chegam ao ponto com sacolas. Selfie. Balões, sem voz: **Rafa:** "Cadê o Kauã? Sumiu hoje." **Léo:** "Tá trabalhando. Estagiário de TI, vai longe." O Léo abraça o mascote, e as mãos de pelúcia do Kauã ficam penduradas.
- **F9 · Kauã, 40,1–46,1 s:** "Aí o Léo e o Rafa passaram. Abraçaram o mascote e falaram que o Kauã ia longe. Eu estava a dois palmos."

### 5. A revelação (46,4–55,8 s)

- **Imagem:** o Hambúrguer volta correndo para a revanche, derrapa, e a cabeça cai e rola até a fonte (51,3–52,1 s). É o **Pedrão**. Os dois congelam.
- **F10 · Kauã, 46,4–51,0 s:** "O Hambúrguer pediu revanche. E a cabeça dele caiu."
- **F11 · Kauã, 52,2–55,8 s:** "Era o Pedrão. O Pedrão! O do garantido."

### 6. O pacto e o pedido de seguir (56,1–68,6 s)

- **Imagem:** balões: **Pedrão:** "você não me viu." **Kauã:** "nem você a mim." Câmera lenta, o aperto de mão de pelúcia (63,4–64,4 s). Depois o Kauã olha para a câmera, com o Hambúrguer fazendo moonwalk ao fundo.
- **F12 · Kauã, 56,1–63,1 s:** "Fechamos o pacto mais constrangedor da história: dois mascotes, apertando a mão de pelúcia."
- **F17 · Kauã, o pedido para seguir, uma vez só (64,5–68,6 s):** "Segue aí, que faltam cinco dias e o Hambúrguer quer revanche."

### 7. O pagamento (68,9–79,4 s)

- **Imagem:** a sala dos fundos. O gerente, de costas, entrega duas notas. Balão: "R$ 80 − R$ 30 (lavagem da fantasia)". A barra sobe de R$ 3,20 para R$ 53,20. Ele tira a cabeça: cabelo amassado, rosto vermelho.
- **F13 · Kauã, 68,9–75,1 s:** "Seis da tarde. Oitenta reais. Menos trinta de lavagem da fantasia. Nerfaram meu salário."
- **F14 · Kauã, 75,4–79,4 s:** "Três e vinte mais cinquenta. Cinquenta e três e vinte."

### 8. A pizza (79,7–99,6 s)

- **Imagem:** o celular apita. Grupo "RESENHA 19/11 🎮", uma bolha por segundo:
  - **Léo:** "pizza da noite do lançamento 🍕 R$ 40 cada"
  - **Rafa:** "✅"
  - **Pedrão:** "✅ (cansado)"
  - **Léo:** "@Kauã e tu?"
- **F15 · Kauã, 79,7–86,4 s:** "Aí o grupo apitou. Pizza do lançamento. Quarenta cada. Regra número dois: quem não racha, não senta."
- **Cartão da regra (86,7–88,2 s):** **REGRA DO GRUPO Nº 2: "QUEM NÃO RACHA, NÃO SENTA."** A cadeira gamer rasgada ao fundo, com o salgadinho do Dia 1.
- **F16 · Kauã, 88,4–97,8 s:** "Eu já fui o salgadinho. Não ia sentar no chão. Ainda. Paguei. Sobraram treze e vinte e uma dignidade fatiada."
- **Pix (98,1–99,6 s):** o Pix de R$ 40 sai e a barra cai para "R$ 13,20 DE R$ 449,90".

### 9. Em casa (99,8–104,3 s)

- **Imagem:** o quarto, de noite. Ele entra com a sacola enorme. A Dona Rose, só da cintura para baixo, na porta.
- **F3 · Dona Rose (fora de quadro), 99,8–102,3 s:** "Filho, o que tem nessa sacola?"
- **F4 · Kauã, 102,6–104,3 s:** "Servidor, mãe."

### 10. As duas coisas (104,6–110,3 s)

- **Imagem:** o app de classificados do bairro, dois anúncios de rascunho: "CADEIRA GAMER (RASGADA, MAS CONFORTÁVEL). R$ 150. Quem me vê sentado nela sabe que eu sofro." e "CAMISA AUTOGRAFADA DO TIME. R$ 150. Nunca vestida."
- **F18 · Kauã, 104,6–110,3 s (regravada mais curta em 14/11/2026, 5,7 s):** "Sobraram duas coisas de valor: a cadeira gamer ou a camisa autografada." (O "jogar no chão" e o "nunca vesti" ficam nos anúncios e na tela do voto.)

### Votação (110,6–116,6 s)

- **Tela:** "O QUE O KAUÃ VENDE?" **CADEIRA** (azul-petróleo): "R$ 150. Joga no chão até o dia 19." **CAMISA** (coral): "R$ 150. O maior tesouro dele." Fecha com **"VOCÊS DECIDEM."** Sem fala e sem legenda nessa tela. O relógio continua: "GTA 6 EM 5 DIAS".

### Fim (116,8–117,8 s)

- Plano dividido: a cadeira gamer rasgada com o Kauã já sentado no chão ao lado, e a moldura da camisa na parede. O polegar do Kauã fica a um centímetro de "Anunciar". Corte seco um segundo antes.

## Mapa de tom (a voz muda de tom dentro da própria fala)

Pedido do João em 14/11/2026: a interpretação precisa **trocar de tom no meio da frase**. O gancho é o modelo: "Faltam cinco dias pro GTA 6" **animado**, "mas eu só tenho três e vinte" **desanimado**, "e tô vestido de celular" **abafado e sarcástico**. A regra do episódio: **subida animada, queda seca, e a piada vem no tom oposto ao da frase anterior** (o humor está no contraste). As marcas de tom ficam no campo `tts` de `falas.js` (a legenda usa o `texto`, sem marcas).

| # | Tom por trecho |
|---|---|
| 1 | animado → desanimado (suspiro) → abafado e sarcástico |
| 2 | maroto → orgulhoso ("Celular Feliz!") → seco e exausto |
| 3 | curiosa (Dona Rose) |
| 4 | nervoso e rápido |
| 5 | seco → confiante → sombrio ("Não era.") |
| 6 | dramático de locutor de luta → desconfiado → pasmo |
| 7 | empolgado → triste ("Quem perde, é esquecido.") → seco ("Igual meu currículo.") |
| 8 | empolgado → seco ("Dependia.") → triunfante |
| 9 | casual → rápido → seco |
| 10 | dramático → pausa → sem energia |
| 11 | chocado → sarcástico |
| 12 | solene → rindo |
| 13 | neutro → irritado → sarcástico |
| 14 | chapado → aliviado miúdo |
| 15 | casual → falsamente sério |
| 16 | resignado → sarcástico ("Ainda.") → derrotado (suspiro) → seco e poético |
| 17 | amigável e animado (o único pedido de seguir) |
| 18 | sério → ritmado → melancólico ("A que eu nunca vesti.") |

**Risco técnico:** as marcas só funcionam se o modelo de voz as interpretar (o `eleven_v4` do projeto ainda não foi testado com elas). Antes de gravar tudo, gerar **uma fala de teste** (a 1) com a voz escolhida e conferir se as marcas mudam o tom e não são lidas em voz alta. O script `gerar-vozes-elevenlabs.mjs` lê a coluna da tabela de `falas.md`; para usar o `tts`, ele precisa de um pequeno ajuste (e o alinhamento por palavra deve ignorar o que está entre colchetes, senão a sincronia de legenda quebra). Só mexo nisso com o OK do João.

## Conferência

- [x] Fala no quadro 0, e a primeira frase faz sentido para quem não viu o Dia 1.
- [x] Uma virada a cada ~8 s, e imagem nova a cada 3 a 5 s.
- [x] Conflito claro (o rival) e piada de revelação (o Pedrão), com a luta de dança no meio do episódio.
- [x] Corrente de causa e consequência: o voto vence → mascote → rival → o ponto → os amigos passam → o Pedrão se revela → o pacto → o gerente desconta → a pizza → sobram R$ 13,20 → duas coisas de valor → o voto.
- [x] Ironia dramática: os amigos falam do Kauã dentro da fantasia; o público sabe.
- [x] O personagem decide (dança, paga a pizza, faz o pacto). Nada se resolve por sorte.
- [x] Sem isca: nenhum "comente", "envie", "marque" ou "compartilhe" na fala ou na tela. Pedido de seguir, um só.
- [x] Nenhuma imagem, fonte ou som do jogo. "Dia 2" só na capa.
- [x] Duração medida pelo áudio real: 117,8 s (faixa de 105 a 140 s).
- [x] "Ontem vocês votaram" mantida no roteiro aprovado e na voz existente; resultado FANTASIA sem placar inventado.

## Produção (depois do sim do João)

**Histórico da preparação, concluída em 14/11/2026.** As pendências e hipóteses técnicas abaixo registram a v4, antes da execução. Voz `kaua2` escolhida pelo João, gravações reutilizadas, elenco aprovado nesta retomada e vídeo final entregue. Para reproduzir a versão concluída, seguir `PRODUCAO.md`; medições e limites em `qa.md`.

- **Voz nova do Kauã (decisão do João em 14/11/2026):** a `kauanarra` sai de cena neste episódio. Antes de criar a voz, o João precisa dar o OK de uso de crédito (o Voice Design gera prévias pagas). **Brief da voz, pra aprovar:** homem de 18 a 22 anos, brasileiro, paulista ou carioca leve, **energia alta e fala rápida**, sarcástico, de quem conta fofoca para os amigos, com risada na garganta; evitar voz de locutor. Texto de amostra: o gancho e uma fala de piada do Dia 2. Gerar de 3 a 4 prévias, e o João escolhe de ouvido. Dona Rose segue com a voz `rose`. **Atenção:** o Dia 1 publicado tem a voz antiga do Kauã; a mudança vai ser perceptível para quem viu os dois. Estimativa de créditos de gravação: cerca de 1.400 caracteres, mais as prévias e as regravações.
- **3D só na luta (a validar com amostra antes do master):** a luta de dança (24 a 40 s) é em 3D estilizado (formas simples, cor chapada, contorno e sombra tipo desenho), renderizada em código com Three.js no mesmo pipeline Playwright do motor. Three.js 0.160.0 já está em `3d/vendor/three/` (MIT, origem anotada; não entrou no `package.json` do repositório). Os personagens 3D são só o **Celular Feliz** e o **Hambúrguer Louco** (o Kauã e o Pedrão aparecem dentro das fantasias, então não precisam de modelo 3D). Há um protótipo do Celular Feliz em 3D em `3d/amostra/film.html`, feito antes da decisão de limitar o 3D à luta (ele testou o gancho; o gancho final é em HQ V10).
- **Arte nova em HQ V10:** a cabeça do Celular Feliz, o Kauã no buraco da tela, o cenário do shopping e da fonte, o termômetro, o gerente de costas, a sala dos fundos, o Pix e a barra, o app de classificados, a cadeira e a moldura, o cartão da regra nº 2, o HUD "GTA 6 EM 5 DIAS", o chat e os balões. **Arte nova em 3D:** só a luta (Celular Feliz, Hambúrguer Louco, arena com a fonte, barras de vida, ROUND, FIGHT!, K.O.). Planos sem precedente (a luta em 3D e a transição de ida e volta, o chat e o voto em V10): amostra curta ao João antes do master.
- **Retomadas do Dia 3:** renderizar CADEIRA e CAMISA antes das 18h de 15/11.
- **QA:** `node scripts/qa-episodio.mjs <filme> <video>`, de `series/se-vira-tico/`.
- **Postagem:** capa "DIA 2" seguindo o `GUIA-CAPAS.md`; sem "comente".

<!-- aprovacao-final-automatica -->
## Aprovação final

Vídeo final aprovado pelo fluxo autorizado pelo João em 12/11/2026. Registro: C:\Users\joaot\Projetos\oca-studio\animacoes\entregas\demitido-antes-do-gta\dia02\aprovacao.json. SHA-256: 5dc6ad111c30b9765c39376c5c506ba59faa310c46abb697fb46ee18664b80d6. Publicação manual pelo João.
<!-- /aprovacao-final-automatica -->
