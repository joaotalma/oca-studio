# Erros já cometidos e como evitar

Registro permanente pedido pelo autor em 10/11/2026. **Releia antes de escrever, produzir ou revisar qualquer episódio.** Todo erro novo, apontado pelo autor ou achado na conferência, entra aqui na hora, com a causa e a regra que o evita.

Formato de cada entrada: o que aconteceu, a causa e a regra.

## Corpo, braços e mãos

1. **Braço cruzando o peito ao segurar o celular** (ep. 4, Tico na janela). **Causa:** `bracoAte` dobra o cotovelo para dentro. **Regra:** para segurar algo na frente do corpo, use `bracoFora` (cotovelo para fora) ou uma pose com o antebraço quase vertical. Confira em quadro ampliado.
2. **Celular deitado e atravessado no braço** (ep. 4, Jão). **Causa:** o `propL`/`propR` 'phone' gira junto com o antebraço. **Regra:** para mostrar o celular de pé, o antebraço precisa apontar para cima (cerca de -150° a -170° no braço esquerdo e 150° a 170° no direito). Com o antebraço deitado, o celular deita junto.
3. **Mão do volante sem alcançar o aro** (ep. 4). **Regra:** mãos no volante com `bracoFora` até pontos no alto do aro, conferidos em cada plano de direção.
4. **Mão que parecia uma cabeça careca** (ep. 4, a chave). **Regra:** objeto pequeno em close fica pendurado num dedo ou apoiado, nunca preso dentro de um punho grande e sem detalhe.
5. **Pé flutuando** (estudo visual, Tico). **Causa:** a barra da calça curva terminava antes do tornozelo, e um degrau passava por baixo dos pés. **Regra:** a barra termina pela distância real até o tornozelo, com a canela entre a barra e o calçado. Nenhum objeto do cenário passa sob os pés. Confira os pés em recorte ampliado em todo plano de corpo inteiro.
6. **Personagem sem pernas ou pés à mostra** (risco recorrente em carro e mesa). **Regra:** `semPernas` só vale quando algo na frente esconde o corte (`cobrePernas` ou o corte fora do quadro). Sentado em cadeira ou banco visível, use `sentado: true` com as pernas dobradas e os pés no chão. Confira cada plano com gente sentada.

## Cenário e objetos

7. **Rua do GPS cortada no meio do chão** (ep. 4). **Causa:** um traço reto e grosso terminava antes do horizonte. **Regra:** rua em perspectiva sempre vai até o horizonte ou sai do quadro.
8. **Cinto de segurança solto como uma alça sobre o braço** (ep. 4). **Regra:** o cinto sai do alto do ombro (lado da porta), cruza o peito até o quadril oposto e tem fivela. Fica em todos os planos do passageiro, não só num.
9. **Cenário sem luz e sem detalhe na regressão** (ep. 4 com o rig novo). O estudo tinha lâmpadas, luz motivada e mais objetos, e os cenários antigos não. **Regra:** todo cenário novo ou reaproveitado no estilo orgânico tem luz motivada (janela, lâmpada, poste ou sol), uma fonte de luz visível no quadro quando fizer sentido, materiais, camadas de profundidade e objetos ligados à ação.
10. **Balão de mensagem vazando a tela** (ep. 4). **Regra:** largura do balão calculada pelo texto (cerca de 23 px por caractere a 40 px de fonte) e quebra em até 18 caracteres por linha.

## Texto e roteiro

11. **Texto antigo sobrando depois de trocar uma cena** (ep. 4, avaliação "Não deixou ligar o ventilador"). **Regra:** ao trocar personagem ou cena, procure no `ep.js`, no `mixagem.py`, no roteiro e na postagem todos os textos e nomes da versão anterior.
12. **Abertura fraca** (eps. 3 e 4: recapitulação muda, tela de leitura, primeira fala aos 13,8 s). O ep. 4 perdeu 65% do público em 8 s. **Regra:** primeira fala até 0,5 s e nada de título ou tela de leitura antes dos 15 s. O voto anterior entra como causa do problema novo (`docs/estrategia/FORMATO.md`).
13. **Gancho que depende de ter visto a série** ("por que você sumiu naquele dia?"). **Regra:** a primeira frase precisa fazer sentido para quem nunca viu um episódio.

## Produção e entrega

14. **Nome de boca inválido** (`'open'` como expressão). **Regra:** bocas válidas: flat, frown, laugh, o, sad, side, small, smallsmile, smile, teeth. Visemas: closed, small, open, wide (só em `pose.mouth`).
15. **Duração fora da faixa** (60,9 s e 70 s no ep. 4). **Regra:** meça pelo áudio real antes de renderizar. A faixa é de 61 a 68 s.
16. **Vídeo antigo copiado para o Drive** (estudo visual: uma parte do render falhou por timeout e a cópia velha foi entregue). **Regra:** antes de copiar, confira no log que o arquivo foi escrito e que a data é posterior à última edição. Nunca rode dois renders ao mesmo tempo na mesma pasta.
17. **Heredoc do bash quebrando com aspas de JS.** **Regra:** patches de código em scripts Python escritos com Write, executados depois.
18. **Página de render sem `window.READY`.** O `frames.mjs` e o `export.mjs` esperam `READY === true`. **Regra:** toda página nova marca READY depois do primeiro quadro.
19. **Dedo e polegar desenhados como palito com bola** (ep. 5, primeira versão das telas). **Regra:** dedo ou polegar sobre uma tela é uma forma só, com a ponta arredondada e a unha. No notebook, use o cursor do mouse. Confira em quadro ampliado.
20. **Notebook com a tela virada para a câmera no close de quem olha para ele** (ep. 5). **Regra:** quando o personagem olha a tela, o público vê a tampa (`notebookCostas`). O conteúdo da tela vai num plano próprio.
21. **Câmera de tela cheia descendo e cortando o topo do celular** (ep. 5). **Regra:** telas de celular ficam com a câmera parada ou com aproximação leve centrada (zoom até 1,06), nunca com deslocamento vertical.
22. **Sobreposição de interface sobre a tela do celular** (ep. 5: relógio da entrega cobrindo o cabeçalho). **Regra:** sobreposições fixas (relógio, painel) somem nos planos `cheia`, e todo cartão mede o texto (`measureText`) antes de definir a largura.
23. **Objeto do banco de trás flutuando sobre o teto do carro no plano aberto** (ep. 5, ring light da Letícia). **Regra:** objeto do passageiro é posicionado para o plano em que aparece. Em plano aberto do carro, só o que cabe dentro da cabine.
24. **Comentários e textos da tela embaixo da legenda** (ep. 5, live). **Regra:** a faixa da legenda, de y = 1250 a 1450 no quadro, fica livre de texto da tela.
25. **Tela cheia parada por mais de meio segundo** (ep. 5: GPS, mapa, mensagens, caderno; o gate reprovou). **Regra:** todo plano de tela cheia tem aproximação lenta da câmera do começo ao fim do plano (de 1 a cerca de 1,05) ou um elemento animado contínuo.
26. **Zoom arredondado a duas casas, andando em degraus** (ep. 5, notebook: um salto a cada 0,5 s e quadros idênticos). **Regra:** escalas e posições animadas usam `toFixed(4)` ou mais, nunca `r2()`.
27. **Tela que acende de uma vez** (ep. 5, celular no bolso: de preto para branco num quadro). **Regra:** mudança grande de cor ou luz entra com opacidade animada, em pelo menos 0,2 s.
28. **Aperto de mão ilegível** (ep. 5, 0:30, "Entrega combinada"; o autor viu como algo obsceno). Dois braços em forma de salsicha, sem manga, e uma bola no meio com uma mancha clara, sem dedos nem polegar. Repete o erro 4. **Correção:** o plano virou os dois conversando atrás da bancada. **Regra:** evite close de mãos se encostando. Para mostrar um acordo, use o plano dos personagens com as expressões. Se um close de mão for indispensável, ele mostra dedos separados, polegar por cima e a manga de cada personagem, conferido ampliado e sem desfoque.
29. **Gesto de braço saindo do quadro ou encostando no outro personagem** (ep. 5, primeira tentativa da correção do 28). **Regra:** num plano de dois, gesto de braço fica entre o ombro e o rosto do próprio personagem. Se não couber, a conversa vai na cabeça e na expressão. Confira o quadro antes de renderizar.
30. **Voto pedindo comentário** (eps. 1 a 5: "Comente CONFIA ou OUTRO MOTORISTA"; legenda "COMENTA SUA ESCOLHA"). A Meta trata isso como isca de engajamento e reduz a distribuição. **Regra:** opções só na tela e "Vocês decidem"; nada de "comente", "envie" ou "marque" em tela, fala, legenda ou comentário fixado. O QA reprova (`motor/qa/qa-video.mjs`).
