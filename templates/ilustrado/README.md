# Template: ilustrado

**Estado:** especificado, ainda sem código.

## Ideia

Imagens estáticas com Ken Burns leve, voz em off e palavras-chave na tela.

## Requisitos

- **Entrada:** `falas.js`, `video.js` e `assets/` com as imagens aprovadas. Cada fala aponta para uma imagem.
- **Plano:** um enquadramento e no máximo um movimento por imagem. Zoom ou deslocamento leve, nunca os dois.
- **Troca:** a cada 2 a 4 s como ponto de partida. Mais rápida na informação, mais lenta na virada.
- **Palavras-chave:** uma por frase, dentro da área segura, entrando com a voz.
- **Primeiro quadro:** a imagem mais forte, já com o gancho na tela.
- **Personagem:** a descrição imutável de `personagens/`, colada igual em todo prompt.
- **QA:** sem `HOLDS` no filme inteiro, porque o Ken Burns mantém a imagem em movimento. As trocas de imagem entram em `window.CUTS`.

## Regra de ouro

Se a imagem não ajuda a entender a frase naquele segundo, troque ou corte.
