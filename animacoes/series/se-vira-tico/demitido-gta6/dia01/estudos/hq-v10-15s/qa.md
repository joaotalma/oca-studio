# QA — amostra HQ V10 de 15 segundos

Amostra isolada para comparação visual solicitada pelo João. Texto e faixa AAC dos primeiros 15 segundos da revisão atual preservados; igualdade da faixa verificada por SHA-256. Sem nova geração de voz ou gasto.

- Duração: APROVADO — 15.02 s (esperado 14.9-15.1 s)
- Resolução: APROVADO — 1080x1920 (esperado 1080x1920)
- Quadros por segundo: APROVADO — 30.00 (esperado 30)
- Loudness: APROVADO — -16.3 LUFS (esperado -16 ±1)
- Sem isca de engajamento: APROVADO — nenhum pedido de comentário, envio ou marcação
- Gate: APROVADO — 7 de 7 itens
- Fonte estável: APROVADO — nenhuma alteração durante o QA

Conferência visual: prova de 11 âncoras e quadros em resolução original; explosão do 6, corpo inteiro no quarto, retícula, contorno branco, branco para cor, moedas junto ao punho, e-mail legível, escritório e último quadro. Ajustada a mão junto à borda; legendas suavizadas após detectar saltos. Crítica independente sem bloqueios.

O QA rápido de amostras tentou buscar um quadro além do último PTS do vídeo por causa dos 23 ms extras do AAC copiado. Foi substituído por gate completo no master (7/7) e extração manual do último quadro a 14,95 s. Sem alterar políticas do motor.

Limites: inspeção visual por amostragem e medições; não afirma escuta subjetiva nem aprovação deste visual para o episódio inteiro.

Arquivos em C:/Users/joaot/Projetos/oca-studio/animacoes/render/demitido-gta6/estudo-hq-v10-15s: amostra-hq-v10-15s.mp4 e comparativo-atual-vs-hq-v10.mp4. Comparativo: atual à esquerda, HQ à direita, mesmo áudio e recorte temporal. Publicação somente pelo João. Sem commit.
