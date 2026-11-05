# Se Vira, Tico

Série de animação 2D romântica-cômica para TikTok. Episódios verticais de 90 s, com votação A/B nos comentários no clímax: a opção vencedora define o episódio seguinte.

## Elenco

- **Tico**
- **Lua**
- **Jão**
- **Bia**
- **Fiscal**, o cachorro
- **Dona Neide**, só voz

## Como rodar

Requisitos: Node.js 20 ou superior, ffmpeg e Google Chrome.

Para regenerar as folhas de personagens em `personagens/assets/`:

```bash
cd personagens
node gen-assets.js
```

O rig está em `personagens/chars.js`, e as regras de montagem em `personagens/MONTAGEM_DO_RIG.md`. Os episódios ficam em `episodios/`.

Vídeos e áudios finais não vão para o git: guarde-os no Drive.
