# Dia 1 — visual híbrido

Visual aprovado pelo João em 13/11/2026: “ficou bom, pode renderizar tudo”. Roteiro, vozes, duração e acontecimentos permanecem iguais ao Dia 1 aprovado.

Executar `node preparar.mjs` nesta pasta para reconstruir a preparação em `animacoes/render/demitido-gta6/dia01-hibrido`. O episódio original não é sobrescrito.

Render: na pasta preparada, usar `W=1080 H=1920 PARTES=2 node export.mjs 30 dia01-hibrido-mudo.mp4` (definir as variáveis conforme o shell). A trilha AAC do `entregas/demitido-antes-do-gta/dia01/video.mp4` é copiada sem recodificar para o novo vídeo; não gerar nova voz.

Conceitos e limites em `motor/personagem/EXPRESSAO-HIBRIDA.md`. A aprovação do visual permite renderizar; a entrega integral exige revisão e QA.


## Revisão atual: duas falas corrigidas

Entrega atual em `entregas/demitido-antes-do-gta/dia01-hibrido-r2/video.mp4`. Reconstruir com `node preparar.mjs dia01-hibrido-r2`; usar o master ativo corrigido, nunca copiar a trilha do MP4 anterior. Ver `CORRECOES-FALAS.md`.
