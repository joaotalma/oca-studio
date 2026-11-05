# Checklist de QA

"Automático" significa medido por `scripts/qa-episodio.mjs`. "Visual" significa conferir em quadros extraídos ou assistindo.

| Item | Critério | Como conferir |
|---|---|---|
| Duração | 85 a 95 s | Automático (ffprobe) |
| Resolução | 1080x1920; rascunho 540x960 | Automático (ffprobe) |
| Quadros por segundo | 30; rascunho 15 | Automático (ffprobe) |
| Loudness | -16 LUFS, ±1 LU; não cobrado no rascunho | Automático (ffmpeg loudnorm) |
| Gate do Take One | Todos os itens passam | Automático (gate.mjs) |
| Imagem parada | Nada parado por mais de 1 s | Gate acusa janelas de 0,5 s com pouca mudança; confira também assistindo |
| Membros conectados | Sem fresta ou peça solta, sobretudo com braço levantado | Visual: amplie mangas, cotovelos e tornozelos |
| Boca | Segue o volume da fala de quem fala; boca fechada em quem está calado | Visual |
| Legenda | Alinhada à voz real; 1 a 3 palavras; nada cortado | Visual: compare com `timeline.json` |
| Voto A/B | Duas opções claras no clímax; última fala curta | Visual |

O gate é mais rígido que o limite de 1 s: uma janela de meio segundo com menos de 0,5% de mudança já reprova. Corrija com movimento real. Use `HOLDS` só em pausa intencional.
