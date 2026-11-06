# Se Vira, Tico

Comédia romântica animada em 2D para TikTok. Episódios verticais de 90 s, com votação A/B no clímax: o desfecho vencedor abre o episódio seguinte. A história está em `docs/BIBLIA.md`.

## Elenco

- **Tico**, 31, vive de bicos: prefere inventar a confessar
- **Lua**, 30, vizinha de infância e primeiro crush, analista: "tá tudo ótimo"
- **Jão**, 33, motoboy: pavio curto e coração mole
- **Letícia**, 29, coach de mindset: "Gratidão!"
- **Fiscal**, vira-lata do prédio: late quando alguém mente
- **Dona Marlene**, mãe do Tico, só voz

## Como rodar

Requisitos: Node.js 20 ou superior, ffmpeg e Google Chrome.

Para regenerar as folhas de personagens em `personagens/assets/`:

```bash
cd personagens
node gen-assets.js
```

O rig está em `personagens/chars.js`, e as regras de montagem em `personagens/MONTAGEM_DO_RIG.md`. Para experimentar poses e expressões, abra `personagens/estudio.html` no navegador. Os episódios ficam em `episodios/`.

Vídeos e áudios finais não vão para o git: guarde-os no Drive.
