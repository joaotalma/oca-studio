# QA do Dia 4 (16/11/2026)

Rascunho 540×960 15 fps e final 1080×1920 30 fps, 93,0 s, áudio −16,1 LUFS. Gate do rascunho 7/7; QA final leve aprovado nos itens medidos. Relatórios em `render/demitido-gta6/dia04-hq/qa-resultados/` (fora do Git).

## Decisões registradas

- **Duração:** o alvo é ~92 s, abaixo da faixa 105–140 s do Dia 3, por decisão de manter o ritmo (ver `PRODUCAO.md`). QA rodado com `--duracao 85,140`.
- **Exceção autorizada (isca de engajamento):** o pedido de curtida/seguidor/compartilhamento e o "comentário mais criativo" contrariam o item 19 de `docs/APRENDIZADOS.md`. Autorizado pelo João em 16/11/2026, com a conferência da política do Instagram dispensada. O QA automático não acusou isca porque roda com `--sem-texto` e só lê o texto do vídeo, não a fala; a exceção vale mesmo assim. Registrada como exceção, não como falha.
- **Pausas de leitura declaradas** (`hq/pausas-visuais.json`): caderninho da conta, os três valores, placar zerado e cartão final. Exigem conferência à vista.
- **Cortes declarados** (`window.CUTS`): trocas de cena e os saltos do saldo da barra. Os pops de 44,47 s e 88,3 s foram corrigidos com easing, não declarados.

## Conferência à vista (feita por mim, sem ouvir o áudio)

- Quadro 0 já tem o relógio e a barra (R$ 13,20); premissa e primeira piada cabem em ~10 s (a F1 ficou com 9,2 s, a F2 entra aos 9,9 s).
- Placar começa em zero e nenhum número é inventado; saldo e contagem de paçocas fecham (11 = 5 vendidas + 5 comidas + 1 sobra).
- Sem "Ep. 4", sem "ontem vocês votaram", sem tela de votação separada.
- Pontos fracos: o gesto de comer usa o braço à frente do rosto do rig e a paçoca cobre parte da bochecha; os braços cruzam o peito nesse gesto (APRENDIZADOS 12). O "ok" final é um emoji dentro de balão.
- Tipografia: Impact não existe neste Linux; os títulos caíram em Nimbus Sans Narrow bold, parecida mas não igual à dos Dias 1 a 3 (feitos no Windows).

## Revisão do João (16/11/2026, segunda rodada)

Pedidos e feitos:
- **Risadas removidas** da mixagem (ficaram ruins; o João traz as dele do Windows depois). `hq/audio-final.mjs` agora mistura só voz, música e efeitos.
- **Volume reduzido** de −16 para **−16,6 LUFS** (o João achou alto). Escolhido dentro da tolerância de ±1 LU do QA. Um teste a −17 LUFS foi reprovado pelo QA (limite exato de 1 LU).
- **Tons das falas 9 e 10** regerados (kaua2, 293 caracteres; `--refazer 9,10 --confirmar`): F9 com `[tired]`, `[resigned]`, `[deadpan]`; F10 com `[defeated]`, `[dry]`. Tempos de `falas.js` atualizados (F9 55,3–65,4 s; F10 65,9–76,3 s).
- **"3" chamativo** no começo: "3" creme com contorno escuro, no canto superior direito, de 0 a 2,7 s, com a pílula do HUD mantida. Conferido no quadro de 1 s do rascunho.

Não alterados a pedido: gancho, gesto de comer, tipografia (Nimbus Sans Narrow), contas, capa e postagem.

QA:
- Rascunho 540×960, 15 fps, gate 7/7 aprovado (`qa-resultados/qa-rascunho.json`).
- Final 1080×1920, 30 fps, 93,0 s, −16,6 LUFS, aprovado nos itens medidos (`qa-resultados/qa-final.json`, modo `--final-leve`).
- Revisão registrada em `qa-resultados/revisao-final.json` com o SHA-256 atual do MP4; `motor/finalizar.mjs` rodou e copiou o `video.mp4` para `entregas/demitido-antes-do-gta/dia04/`.

Sem conferência auditiva humana: voz nova (tom das falas 9 e 10), mixagem e música. O João confere ao ouvir.
Publicação: só o João, manualmente.
