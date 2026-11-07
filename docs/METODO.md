# Método

Princípios do `docs/GUIA.md` transformados em regras de produção. Nenhum foi testado em experimento controlado: valem até os dados do canal dizerem outra coisa, e a skill `aprender` registra quando isso acontecer.

Marcas: **[relato]** vem de criador ou fórum; **[hipótese]** é inferência a testar.

## Ordem de trabalho

1. **Roteiro e conceito antes de qualquer imagem.** O erro mais citado é polir o visual antes de ter a história. [relato]
2. **Meça a referência.** Duração, palavras por minuto, segundo do primeiro corte, tipo de gancho, onde está a virada. "Faz igual" não é instrução. Copie a estrutura, nunca o texto. [relato]
3. **Humano no meio.** Roteiro, ângulo e voz são do João. As fontes ligam a desmonetização ao empilhamento de roteiro, voz, imagem e vídeo em IA no automático, não ao uso de IA em si. [relato]
4. **Aprove em três pontos:** roteiro, imagens-âncora e vídeo final. Refazer depois da montagem custa mais.

## Roteiro

| Bloco | Tempo | Função |
|---|---|---|
| Gancho | 0 a 3 s | Contradição ou melhor momento, sem apresentação |
| Prova | 3 a 10 s | Fato, número ou cena que mostra que a promessa será cumprida |
| Desenvolvimento | até o fecho | Frases curtas, uma ideia por frase, uma virada no meio |
| Fecho | fim | Conclusão ou pergunta que convida a comentar, ou "Parte 2" |

- **Tamanho:** 120 a 170 palavras para 45 a 60 s, e 25 a 60 para menos de 30 s. Vem de blog de fornecedor; meça no seu ritmo. [hipótese]
- **Escrita:** frases de até 15 palavras, para o ouvido, sem parêntese nem sigla solta. Se dá para apagar uma frase sem perder nada, apague.
- **Pausas:** 0,3 a 0,6 s de silêncio antes da frase mais importante. [relato]
- **Fatos:** data, número e lugar conferidos, com a fonte anotada em `fontes.md`.

## Visual

- **Personagem fixo:** uma descrição imutável, colada igual em todo prompt, guardada em `personagens/` e versionada.
- **Plano:** um enquadramento e no máximo um movimento de câmera.
- **Estilo:** sem fotorrealismo.
- **Primeiro quadro:** forte e já com o gancho. [relato]
- **Regra de ouro:** se a imagem não ajuda a entender a frase naquele segundo, troque ou corte.

## Templates

| Template | Quando usar | Estado |
|---|---|---|
| `chat` | Conversa rolando, com texto no ritmo da fala | Funcional |
| `caixa-texto` | Relato revelado aos poucos em uma caixa de texto | Especificado |
| `ilustrado` | Imagens estáticas, Ken Burns leve e palavras-chave | Especificado |

Nos dois primeiros, a tela quase não muda: quem segura a atenção é o texto aparecendo com a voz. Por isso o QA mede o tempo sem texto novo em vez de cobrar movimento.

## Som e entrega

- **Voz:** em primeiro plano, a -16 LUFS, medida por `engine/masterizar.sh`.
- **Música:** baixa, opcional e com licença comercial anotada. Efeitos curtos valem mais que trilha contínua. [relato]
- **Arquivo:** 1080 x 1920, H.264, 30 fps, áudio AAC.
- **Área segura:** o template de chat mantém o essencial entre y = 250 e y = 1490, e entre x = 60 e x = 950. São valores de partida, sem fonte oficial. Confirme na página de cada plataforma.
- **Teste final:** no celular, uma vez com som e outra sem som.

## Teste e corte

- **Teste pequeno antes de escalar:** valide o ritmo em 15 s antes do vídeo inteiro.
- **Regra de corte escrita ANTES de publicar**, em `canal/canal.md`. Ponto de partida: 6 a 15 vídeos por padrão, revisar o gancho com 15 a 20, abandonar por volta de 30 sem sinal. Os números vêm de criadores e são hipótese a ajustar. [hipótese]
- **Uma variável por vez:** gancho, tema ou duração.
- **Métricas, em ordem:** retenção em 3 s e 20 s, visualização completa, compartilhamentos e salvamentos, seguidores por vídeo.
- **Receita:** planeje como se fosse zero no primeiro ano. Nenhum número de ganho foi verificado.

## A pesquisa do vidIQ (pt-BR, nov/2026)

Posts isolados, sem dados de retenção. Tudo aqui é hipótese.

| Referência | Formato | Números vistos |
|---|---|---|
| @cronicasdesticks (Instagram) | Mistério animado e narrado em série, com cliffhanger | 1,5 mi de views, 589x a mediana |
| @trechosempoesias (Instagram) | Ilustrações estáticas, voz em off e palavras-chave | 1,2 mi de views |
| YouTube Shorts | Drama narrado de 1 a 3 min em canais pequenos, com "Parte 1" no corte | Sem número anotado |

**Padrão a evitar:** Reddit com voz de IA sobre gameplay e recaps de filme com trecho de terceiros, por risco de conteúdo reaproveitado e de direitos.

## A confirmar nas páginas oficiais

Monetização e conteúdo alterado ou sintético no YouTube; conteúdo gerado por IA e Creator Rewards no TikTok; rótulo de IA no Instagram. O guia não conseguiu abrir nenhuma dessas páginas. Anote a data da conferência em `canal/canal.md`.
