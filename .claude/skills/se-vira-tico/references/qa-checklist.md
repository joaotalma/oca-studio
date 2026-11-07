# Checklist de QA

"Automático" significa medido por `scripts/qa-episodio.mjs`. "Visual" significa conferir em quadros extraídos ou assistindo.

| Item | Critério | Como conferir |
|---|---|---|
| Duração | 85 a 95 s nos eps. 1 e 2; 61 a 68 s do ep. 3 em diante | Automático (ffprobe) |
| Resolução | 1080x1920; rascunho 540x960 | Automático (ffprobe) |
| Quadros por segundo | 30; rascunho 15 | Automático (ffprobe) |
| Loudness | -16 LUFS, ±1 LU; não cobrado no rascunho | Automático (ffmpeg loudnorm) |
| Gate do Take One | Todos os itens passam | Automático (gate.mjs) |
| Imagem parada | Nada parado por mais de 1 s | Gate acusa janelas de 0,5 s com pouca mudança; confira também assistindo |
| Membros conectados | Sem fresta ou peça solta, sobretudo com braço levantado | Visual: amplie mangas, cotovelos e tornozelos |
| Boca | Segue o volume da fala de quem fala; boca fechada em quem está calado | Visual |
| Legenda | Alinhada à voz real; 1 a 3 palavras; nada cortado | Visual: compare com `timeline.json` |
| Voto A/B | Duas opções claras no clímax, levando ao mesmo próximo marco | Visual |
| Sincronia de gesto | Termina 0,1 a 0,2 s antes da palavra-chave; o objeto-informação aparece na palavra | Visual, com folha de contato |
| Expressão | Troca a cada 2 a 3 s, dentro de uma piscada | Visual |
| Ritmo de imagem | Muda a cada 2 a 3 s, com close sem fala de 3 a 4 s no "riso que engasga" | Visual |
| Cenário | Pelo menos 5 objetos, 3 camadas, 1 piada visual; nada de chão vazio | Visual |
| Quatro problemas | Personagem atravessando objeto, pé deslizando, expressão atrasada, câmera fora do que importa | Visual, com um quadro a cada 2 s |
| Tela | Sem tela preta, legenda cortada ou rosto coberto | Visual, com um quadro a cada 2 s |
| Espectador | Sem ter visto nada antes, dá para entender; o autor assiste inteiro no celular | Autor |

O gate é mais rígido que o limite de 1 s: uma janela de meio segundo com menos de 0,5% de mudança já reprova. Corrija com movimento real. Use `HOLDS` só em pausa intencional.

**Pernas:** nas folhas de quadros, ninguém pode aparecer cortado na cintura. Quem usa `semPernas` precisa estar enquadrado de modo que a cintura fique fora da tela ou coberta por algo em primeiro plano (`cobrePernas`).
