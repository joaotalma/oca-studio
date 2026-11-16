# Revisão independente — Dia 2

14/11/2026. Parecer: **REPROVAR a montagem atual para entrega**. Há correções localizadas; a premissa, a rivalidade e a revelação funcionam nos quadros e devem ser preservadas.

Arquivo conferido: `animacoes/render/demitido-gta6/dia02-master/dia02-master.mp4` (117,8 s, 1080×1920, 30 fps; H.264/AAC). Revisão feita por agente que não participou da construção. Foram vistos a folha geral e 17 quadros extraídos, mais o quadro de 58 s em resolução original; confronto com o roteiro v4 e as fontes de cena. Não assisti à reprodução contínua nem ouvi a mixagem. Ritmo fino, qualidade de atuação vocal e sincronismo labial não estão certificados por este parecer. Loudness e ausência de falhas entre os quadros inspecionados exigem QA separado.

## Leitura sem som

Kauã tem R$ 3,20 para comprar GTA 6 em cinco dias. Aceitou trabalhar de mascote, disputa espaço com um hambúrguer, descobre que o rival também é um amigo passando aperto e combina segredo. Recebe pouco, paga a pizza do grupo e termina entre vender a cadeira ou a camisa. Os saldos visíveis seguem R$ 3,20 → R$ 53,20 → R$ 13,20. As opções finais são compreensíveis.

## Bloqueios, em ordem

1. **Legendas cortadas, particularmente 56,1–63,1 s e 64,5–68,6 s.** Em 58 s a legenda de F12 contém a frase inteira e vaza para fora das duas bordas do vídeo. Em 66 s a legenda de F17 também ultrapassa a caixa e as margens. A redução até cerca de 31 px não resolve a largura; a expressão regular na fonte busca `s+`, não espaço. A frase longa e a posição inferior também prejudicam leitura em celular. Alvo: blocos curtos vinculados aos tempos das palavras, contidos na caixa e com tamanho estável. Evidência: `revisao-independente/t58-full.png`, `t66.png` na pasta do master.

2. **Aperto de mãos sem braços — 63,6 s.** O pacto aparece como duas bolinhas brancas flutuando entre os rostos. Não há conexão visível das luvas aos ombros/mangas. Falha diretamente na exigência de membros conectados e no gesto prometido pelo roteiro. Alvo: plano dos dois mascotes com braços conectados até o contato, ou outro gesto claro que preserve o acordo e seja registrado como ajuste. Evitar ampliar as bolinhas como falsa solução. Evidência: `t63.6.png`.

3. **Branco total na saída do 3D — 39,867 e 39,9 s.** Os dois quadros extraídos são brancos; em 40,1 s a selfie ainda está lavada pela transição. O roteiro pede corte limpo entre jogo e história. Alvo: último quadro da luta e primeiro da selfie com composição inteira, sem quadro de transição vazio. Conferir a emenda em sequência de quadros, não apenas uma miniatura. Evidências: `t39.867.png`, `t39.9.png`, `t40.1.png`.

4. **Dona Rose aparece como parte inferior de corpo isolada — 101 s.** Avental e pernas começam abruptamente no meio da porta, com a parede visível acima e nenhuma oclusão que justifique o corte do tronco. A indicação “só da cintura para baixo” deve ser realizada por enquadramento/oclusão, não amputação visível. Alvo: enquadrar a cintura fora do quadro, ocultar o tronco por elemento do cenário ou mostrar figura coerente. Evidência: `t101.png`.

5. **Cartão “VOCÊS VOTARAM” fora das bordas — 8,5 s.** As letras dos dois extremos são cortadas. Como é informação de leitura, o estado assentado precisa caber. Alvo: medir largura incluindo inclinação e contorno, manter margem. Evidência: `t8.5.png`.

## Pendências de fidelidade e acabamento

- **Final 116,8–117,8 s:** o quadro de 117 s mostra cadeira, camisa e botão, mas não o Kauã sentado no chão ao lado da cadeira conforme o roteiro. O “polegar” é uma elipse simples sobre o botão sem unha nem conexão visível à mão. Restaurar a consequência visual prevista ou registrar a divergência; evitar detalhe ambíguo.
- **Continuidade do cabelo:** o cabelo amassado é visível no pagamento, mas em 94 e 101 s o Kauã voltou ao cabelo alto regular. O roteiro pede carregar o efeito do calor/fantasia. Manter o cabelo amassado no restante do dia ou justificar uma mudança.
- **Pix e saldo:** em 94 s a legenda já diz “Paguei”; a confirmação visual surge depois e o saldo ainda mostra R$ 53,20. Há uma defasagem planejada na fonte entre o áudio e o cartão; avaliar mover o ato de enviar para a palavra e reservar 98,1 s para sustentação/registro. Não atesto sincronismo por áudio nesta revisão.
- **Chat 84,5 s:** todas as mensagens existem e o pedido de R$ 40 é legível. O avatar do Rafa é branco com letra branca, pouco identificável, e “(cansado)” extrapola a largura da bolha. Melhorar contraste e acomodação sem mudar o conteúdo.
- **Selfie:** o abraço é sugerido pela proximidade, mas o celular parece entre os dois amigos. Conferir a conexão da mão ao aparelho em alta; não vi membro ausente nos quadros de corpo inteiro dessa cena.
- **Voto 113 s:** duas opções e “Vocês decidem” estão inteiros e grandes; os subtítulos são menores, mas visíveis na extração a 540 px. A camisa está sem autógrafo no voto e no quadro final, embora ele esteja presente no anúncio de 106 s. Preservar a identidade do objeto.
- A mudança HQ → 3D é justificada pela tela de luta e o estilo dos mascotes permanece reconhecível. As cores são coerentes entre as partes; não recomendo redesenho geral.

## Evidências e rechecagem

Quadros extraídos em `animacoes/render/demitido-gta6/dia02-master/revisao-independente/`: 5,8; 8,5; 23,967; 24; 39,867; 39,9; 40,1; 52,8; 58; 63,6; 66; 84,5; 94; 101; 106; 113; 117 s. O quadro adicional `t58-full.png` está em 1080×1920.

Após as correções, rever as cinco ocorrências bloqueadoras, o gesto em tiras e as duas emendas do 3D. O teste numérico não substitui os quadros: a frase cortada e os braços desconectados podem passar em medições gerais de movimento.
