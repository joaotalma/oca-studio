# Kit de postagem

Todo episódio termina com `episodios/epNN/postagem.md` e a pasta `Se Vira, Tico/epNN_instagram/` no Drive. Para montar a pasta, rode `bash scripts/kit-instagram.sh episodios/epNN`. Só o autor publica: nunca poste nem agende.

O canal principal é o **Instagram (Reels)**. TikTok e YouTube estão pausados até nova decisão do autor.

## Legenda

Monte a legenda nesta ordem, com emojis e linhas curtas. Ela precisa chamar atenção no feed:

1. **Resultado do voto anterior:** 🗳️ e a escolha em CAIXA ALTA. No ep. 1, essa linha não existe.
2. **Gancho do episódio:** 1 ou 2 linhas com emojis do tema, por exemplo 🛵 ⭐ 🤢 ☕ 🍰.
3. **Piada-título:** uma linha que repete a da capa.
4. **Chamada para o voto:** 👇 "VOCÊS DECIDEM:", com uma opção por linha. Cada opção tem um emoji próprio, a palavra do voto em CAIXA ALTA e meia frase dizendo o que acontece.
5. **Promessa:** "A escolha de vocês abre o próximo episódio! 🔥" Sem "comente", "a mais comentada", "mande" nem "marque": é isca de engajamento, e a Meta derruba o alcance.
6. **Crédito das vozes:** "🎙️ Vozes geradas com ElevenLabs." a partir do ep. 3. Nos eps. 1 e 2, "🎙️ Vozes geradas com OmniVoice.", exigência da licença; não remova.
7. **Hashtags:** no máximo 5, sempre com #SeViraTico, #Animação, #Comédia e #Humor. A quinta varia conforme o tema do episódio.

Use no máximo 2 emojis por linha. As palavras do voto precisam ser exatamente as da tela final do vídeo.

## Story

Cada episódio ganha `render/epNN_story.png` (de `episodios/epNN/story.html`, com `node scripts/renderizar-capa.mjs epNN render/epNN_story.png story.html`). Deixe os textos entre y 260 e 1660, longe das barras do Instagram. O autor acrescenta a figurinha de link para o Reel. Não use enquete: os votos que contam são os dos comentários.

## Comentário fixado

Uma linha só: 🗳️ "Vocês decidem:", as duas opções com os mesmos emojis da legenda e "O ep. N+1 sai daqui 👇". Não anuncie que vale um voto por perfil, porque as pessoas comentam menos, mas conte assim.

## Na hora de postar

- **Capa:** use "Adicionar da galeria" com `epNN_capa.png`. A grade do perfil corta a imagem em 3:4, então o título deve estar dentro da faixa central.
- **Rótulo de IA:** ligado, porque as vozes são sintéticas.
- **Horário:** por volta das 19h, sempre no mesmo horário.
- **Primeira hora:** responda aos comentários.
- **Contagem:** depois de 48 h, conte os votos e registre o resultado em `episodios/continuidade.md`. Um voto por perfil, por mais que a pessoa comente. Vale número, palavra ou frase. O placar só entra no episódio seguinte com 10 votos ou mais, e nunca se inventa um número.
- **Status da conta:** confira o status da conta profissional depois de cada post. Amarelo ou vermelho indica isca ou violação; pare e reveja.

## Redes (quando o autor reativar TikTok e YouTube)

- **Uma pasta por rede,** com o mesmo vídeo e capa, legenda, comentário fixado e chamada próprios.
- **Instagram:** conta profissional de criador.
- **TikTok:** conta pessoal, nunca empresarial.
- **YouTube:** marque sempre "não é para crianças"; senão os comentários somem e não há voto. Uma playlist por série, em ordem.

## Comunidade

- **Responda à mão** os primeiros comentários, escolhendo os diferentes, não os genéricos.
- **Destaque:** no episódio seguinte, mostre na tela quem comentou muito (@), sem pedir nada.
- **Envios dentro da história:** um personagem pode transformar envios reais em ação ("300 pessoas mandaram isso..."), nunca com o pedido "mande para um amigo". Só números reais, tirados dos insights.
- **Nada de automação de mensagens** (ManyChat ou parecido): o autor do método Temporada Viral teve todas as contas travadas por isso.

Fonte: `animacoes/referencias/videos-analisados/temporada-viral-metodo.md`.

## Exemplo (ep. 2)

Ver `episodios/ep02/postagem.md`.

## Spin-off Demitido Antes do GTA — capas

Para este spin-off, seguir `demitido-gta6/GUIA-CAPAS.md`, a partir da raiz da série. Padrão do Dia 1 aprovado explicitamente pelo João em 12/11/2026: GTA 6 grande, numeral 6 em degradê de pôr do sol e palmeira autoral, Kauã no próprio rig, fundo luminoso e uma dificuldade concreta. Não aplicar automaticamente essa identidade às capas da comédia romântica do Tico.
