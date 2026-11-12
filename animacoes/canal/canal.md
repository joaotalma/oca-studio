# Canal

Tudo que depende do nicho fica aqui, e só aqui. Em branco de propósito. A skill `configurar-canal` preenche com você.

**Estado:** em preenchimento. Voz original ElevenLabs e licença comercial definidas em 2026-11-08; faltam palavras proibidas e confirmação final das demais preferências.
**Última revisão:** 2026-11-09

## 1. Tema e ângulo

- **Nicho:** Brasil inacreditável: fatos brasileiros levados adiante com o gancho "Imagine...", separando o que aconteceu do que é hipótese. Primeiros candidatos: Plano Collor (1990), Apagão (2001), greve dos caminhoneiros (2018) e ET de Varginha (1996).
- **Fontes de história:**
  - Fatos: acervos de jornais, documentos oficiais, livros, pesquisas, reportagens e documentários (estes só para checar).
  - Pautas: contos em sites, blogs, revistas, Reddit e Twitter. Usa-se a situação, nunca o texto. Relato sem comprovação só entra dito como relato ou lenda, reescrito com texto próprio.
- **Público:** as duas gerações: quem viveu o caso e quem não viveu. Hipótese, ainda sem medição.
- **Ângulo próprio:** todo vídeo mostra uma consequência para a vida de quem assiste.
- **Feedback editorial do piloto, 2026-11-08:** o apagão v2 pareceu pouco interessante ao João, pela pouca lembrança e pelo impacto percebido da pauta. Priorizar assunto que desperte curiosidade ou tenha consequência reconhecível hoje; não depender da memória do evento histórico. Reavaliar a ordem das 28 pautas antes de produzir em lote. É preferência editorial, não resultado medido de audiência.

## 2. Tom

- **Tom de voz:** tenso, sóbrio e direto. Recusa: sensacionalista. O "e se" na tela evita que a hipótese soe como alerta real.
- **Palavras e bordões proibidos:**
  - *O que soa falso na sua boca?*

## 3. Personagem

- **Vai ter personagem fixo?** Sim: a figura "você", que vive cada "Imagine...".
- **Rosto:** a expressão muda de cena para cena; a identidade continua a mesma.
- **Personagem expressivo aprovado em 2026-11-09:** João aprovou o comparativo v4, com contornos arredondados, roupa com caimento, boca/arcada expressivas e olhos de pupila preta sem íris colorida, variando foco, tamanho e brilho por emoção. Referência em `personagens/voce-v4.md` e `experimentos/ator-organico-v4/`. Preservar esse desenho. O próximo teste, pedido para depois, é combiná-lo com fundo 3D estilizado e conferir luz, sombra, perspectiva e oclusão sem perder cor/legibilidade. A integração no template continua pendente; não renderizar novo teste só por registrar esta aprovação.
- **Estética atual (evolução aprovada em 2026-11-08, exemplo de Varginha e apagão):** personagem 2D em cenário 3D estilizado, com volume, perspectiva, sombra de contato e movimentos de câmera intencionais. Enquadramentos preenchidos, sem excesso de chão vazio ou movimento solto de objetos. Preservar respiração, balanço leve, piscada, identidade do personagem, reação nas falas longas, olho de cinema e cor de passado nos trechos "ACONTECEU".
  - **Céu:** estrelas discretas nas cenas externas noturnas; nuvens com movimento lento nas externas de dia. Céu fica atrás do cenário, nunca sobre personagem, edifícios, texto ou interiores.
  - **Luz:** personagem um pouco mais claro que no exemplo, com preenchimento neutro suave. As fontes dinâmicas continuam dominando direção, cor e instante do acendimento. Janela à direita ilumina a direita; fonte à esquerda ilumina a esquerda. Sombras seguem a direção oposta. Não acumular iluminação fixa da imagem com a dinâmica.
  - **Próxima revisão visual, pedida em 2026-11-08:** o piloto do apagão v2 ficou escuro demais. Preparar opções mais luminosas e coloridas, com variedade de cores em cenários e objetos, como nas referências enviadas. Preservar profundidade, luz direcional e legibilidade; comparar âncoras antes de novo render completo. A execução geral do vídeo agradou ao João.
  - **Montagem:** o template ilustrado usa o motor 3D por padrão. O exemplo e os vídeos anteriores não foram renderizados novamente nesta atualização. A próxima montagem prepara a base neutra do personagem e os dados 3D; imagens e vídeo final continuam passando pelos pontos de aprovação.
- **Descrição imutável:** `personagens/voce.md`, aprovada em 2026-11-07.
- **Ficha aprovada:** `personagens/voce-ficha.png`.
- **Estilo visual fixo:** traço e proporções parecidos com o Se Vira Tico, com luz mais trabalhada: lado quente e lado frio no rosto, contorno de luz, reflexo nos olhos, sombra de contato, fundo desfocado e granulação leve. A referência de luz é um vídeo enviado pelo João em 2026-11-07; dele vêm só as técnicas, nunca personagens, cenários ou cores. Sem fotorrealismo.
  - Paletas de cena: seis, alternadas entre vídeos: petróleo, esmeralda, roxo, elétrico, dia e vinho (`templates/ilustrado/paletas.js`). O personagem não muda de cor.
  - Fonte: Barlow Condensed ExtraBold (SIL OFL 1.1).

## 4. Voz

- **Narrador:** voz original jovem, empolgante e clara, criada no ElevenLabs por autorização explícita do João em 2026-11-08. Não é clone nem imitação do João. Perfil em `canal/voz-elevenlabs.json`; plano Starter ativo conferido pela API e licença comercial incluída em https://elevenlabs.io/pricing. João gostou da narração do apagão v2 em 2026-11-08; manter esse caminho nas próximas versões.
- **Ritmo medido (palavras por minuto):**
  - Piloto apagão v2: 187 palavras em 71,57 s, aproximadamente 157 palavras/minuto incluindo pausas. Os 150 das estimativas anteriores continuam como referência inicial, sem substituir a sincronização de cada áudio real.
- **Equipamento e local de gravação:**
  - *O mesmo microfone e o mesmo lugar em todo vídeo?*

## 5. Formato

- **Abertura fixa:** o vídeo começa pelo pior momento da hipótese, em até 3 s e sem apresentação. A frase já está na tela no primeiro quadro, sobre a imagem mais forte, com o selo "E SE...".
- **Abertura aprovada pelo João em 2026-11-07.**
- **Fórmulas de gancho (hipótese, a testar uma por vez):**
  - E se + perda: "E se os caminhões nunca voltassem?"
  - Imagine + cena: "Imagine acordar e seu dinheiro estar preso no banco."
  - Desafio: "Quantos dias sua casa aguentaria sem luz?"
  - Já aconteceu: "O Brasil já passou por isso. Só durou pouco."
  - Até 8 palavras, sem apresentação e sem nome de pessoa.
- **Depois do gancho, três camadas:**
  1. O que aconteceu, com fonte ("foi").
  2. E se fosse mais longe, como hipótese declarada ("seria"), com "e se" na tela durante toda a parte imaginada.
  3. O que mudaria para quem assiste.
- **Templates em uso:** ilustrado.
- **Duração-alvo:** 65 a 75 s.
- **Série ou vídeos soltos?** Soltos, com formato fixo.

## 6. Plataformas

| Plataforma | Conta | Vai postar? | Regras conferidas na página oficial em |
|---|---|---|---|
| Instagram | | Sim | 2026-11-07: parcial. A página confirma a ferramenta de rótulo de IA; não confirmei quando é obrigatório |
| YouTube Shorts | | Sim | 2026-11-07: monetização e declaração de IA |
| TikTok | | Sim | 2026-11-07: Creator Rewards (Brasil listado, vídeo acima de 1 minuto) e rótulo de IA para imagem, áudio e vídeo realistas |

- **A conta é separada de outros projetos?** Sim: contas novas, a criar pelo João.

## 7. Direitos do nicho

- **Fontes LIVRES preferidas (padrão proposto, a confirmar):** fatos históricos, leis e decretos. O texto de quem narrou o fato não entra.
- **Obras em alta que só entram como SÓ COMENTÁRIO (padrão proposto, a confirmar):** nenhuma por enquanto.
- **Temas ou fontes marcados como EVITAR (padrão proposto, a confirmar):** copiar texto de contos e posts, e usar trechos ou imagens de reportagens e documentários sem licença.

## 8. O que evitar

- **Temas que você não vai tocar:** por enquanto, tragédias com mortos (como TAM e PCC). Podem voltar bem mais à frente, com os riscos reavaliados.
- **Formatos que não quer repetir:**
- **Limites éticos:**
  - Não inventar falas, atitudes ou culpa de pessoas ou empresas reais.
  - Não publicar um cenário enquanto houver crise parecida em andamento.
  - Não orientar tratamento, saque ou investimento.
  - Política partidária não foi marcada como limite; não há restrição específica por enquanto.

## 9. Regra de corte

Escreva ANTES de publicar o primeiro vídeo. Os números abaixo são hipótese do guia; troque se quiser.

- **Padrão testado:** gancho "Imagine..." com as três camadas.
- **Variável que muda de cada vez (padrão proposto, a confirmar):** a frase do gancho.
- **Tamanho do teste:** de 6 a 15 vídeos
- **Revisar o gancho:** com 15 a 20 vídeos, se a retenção em 3 s não superar a mediana dos 5 primeiros vídeos.
- **Abandonar o padrão:** por volta de 30 vídeos, se a retenção em 3 s, a retenção em 20 s e os compartilhamentos por visualização não superarem a mediana dos 5 primeiros vídeos.
- **Ritmo de publicação planejado:** TikTok, 2 por dia; Instagram e YouTube Shorts, 1 por dia. Áudio definido depois; nada é publicado mudo por padrão. Pauta em `radar/pauta-30-videos.md`.
