# Kit de postagem

Todo episódio termina com `episodios/epNN/postagem.md` e a pasta `Se Vira, Tico/epNN_instagram/` no Drive. Para montar a pasta, rode `bash scripts/kit-instagram.sh episodios/epNN`. Só o autor publica: nunca poste nem agende.

O canal principal é o **Instagram (Reels)**. TikTok e YouTube estão pausados até nova decisão do autor.

## Legenda

Monte a legenda nesta ordem, com emojis e linhas curtas. Ela precisa chamar atenção no feed:

1. **Resultado do voto anterior:** 🗳️ e a escolha em CAIXA ALTA. No ep. 1, essa linha não existe.
2. **Gancho do episódio:** 1 ou 2 linhas com emojis do tema, por exemplo 🛵 ⭐ 🤢 ☕ 🍰.
3. **Piada-título:** uma linha que repete a da capa.
4. **Chamada para o voto:** 👇 "COMENTA SUA ESCOLHA:", com uma opção por linha. Cada opção tem um emoji próprio, a palavra do voto em CAIXA ALTA e meia frase dizendo o que acontece.
5. **Promessa:** "A mais comentada abre o próximo episódio! 🔥"
6. **Crédito das vozes:** "🎙️ Vozes geradas com ElevenLabs." a partir do ep. 3. Nos eps. 1 e 2, "🎙️ Vozes geradas com OmniVoice.", exigência da licença; não remova.
7. **Hashtags:** no máximo 5, sempre com #SeViraTico, #Animação, #Comédia e #Humor. A quinta varia conforme o tema do episódio.

Use no máximo 2 emojis por linha. As palavras do voto precisam ser exatamente as da tela final do vídeo.

## Story

Cada episódio ganha `render/epNN_story.png` (de `episodios/epNN/story.html`, com `node scripts/renderizar-capa.mjs epNN render/epNN_story.png story.html`). Deixe os textos entre y 260 e 1660, longe das barras do Instagram. O autor acrescenta a figurinha de link para o Reel. Não use enquete: os votos que contam são os dos comentários.

## Comentário fixado

Uma linha só: 🗳️ "Vale UMA resposta só:", as duas opções com os mesmos emojis da legenda e "A mais comentada vira o ep. N+1! 👇".

## Na hora de postar

- **Capa:** use "Adicionar da galeria" com `epNN_capa.png`. A grade do perfil corta a imagem em 3:4, então o título deve estar dentro da faixa central.
- **Rótulo de IA:** ligado, porque as vozes são sintéticas.
- **Horário:** por volta das 19h, sempre no mesmo horário.
- **Primeira hora:** responda aos comentários.
- **Contagem:** depois de 48 h, conte os votos e registre o resultado em `episodios/continuidade.md`.

## Exemplo (ep. 2)

Ver `episodios/ep02/postagem.md`.
