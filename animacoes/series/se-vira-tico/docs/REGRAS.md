# Regras em números

Extraídas da aba "Plano de produção" da bíblia. São valores iniciais: calibre nos testes de 4 s e 20 s.

| Regra | Valor | Como conferir |
|---|---|---|
| Forma | Proporção adulta, cabeça cerca de 29% da altura, olhar cansado, contorno de espessura fixa, silhueta própria | Em preto chapado, dá para dizer quem é quem |
| Cenário | Pelo menos 5 objetos, 3 camadas com paralaxe leve, 1 piada visual de fundo, paleta quente | Nenhuma cena com chão vazio |
| Informação vira objeto | Notificação, nota de app, boleto ou placar entram na palavra, em até 6 quadros. Telas sem voz são livres, desde que cada uma traga informação nova | O objeto aparece na palavra, nunca depois; a tela se lê no celular sem pausar |
| Rostos | 12 expressões + 4 detalhes; troca a cada 2 a 3 s, dentro de uma piscada; 4 bocas pelo volume | A boca abre quando o som sobe |
| Movimentos | Gesto de 5 a 6 quadros que termina 0,1 a 0,2 s antes da palavra-chave | Nenhum gesto chega depois da fala |
| Câmera | Corte quando muda a informação ou chega uma reação, com rostos grandes e cenários simples; close sem fala de 3 a 4 s no "riso que engasga". Os 2 a 3 s por plano dos eps. 1 e 2 são referência de ritmo, não meta | A câmera mostra o que importa; nenhum corte sem motivo |
| Som | Um efeito por acontecimento, um som de objeto por cena, trilha sempre abaixo da voz, grave só no impacto, silêncio antes de cada revelação | A fala se entende em fone barato |

## Kit do piloto

| Item | No piloto | Total da temporada 1 |
|---|---|---|
| Personagens | Tico, Lua, Jão, Fiscal | + Letícia; Dona Marlene só como voz (áudio de WhatsApp) |
| Gestos | 8: andar, correr, apontar, dar de ombros, esconder o celular, cruzar braços, pegar ou empurrar objeto, acenar | 12 |
| Cenários | 3: rua, porta do conjunto, kitnet | 6: + padaria, escritório, ponto de moto |
| Objetos | 3: moto Companheira, bag de entrega, celular com app | 5: + boleto, caixa de lembranças |
| Vozes | 4 | 5, uma voz fixa por personagem |
| Sons | 8: latido do Fiscal, notificação, buzina de moto, áudio de WhatsApp, passos, porta, impacto, silêncio | Cerca de 20 + 1 trilha curta em loop |
| Legenda | 1 a 3 palavras, destaque amarelo; nome do personagem quando fala, só nos primeiros episódios | Igual |

Construa só o que o episódio da vez usa.

## Fases e testes de aceite

Cada fase só libera a seguinte se passar no teste.

| Fase | Entrega | Teste de aceite |
|---|---|---|
| 1. Regras e kit | Regras, Tico, Lua, Fiscal, 12 expressões, 4 bocas | Silhuetas distintas; proporção da cabeça igual em todas as poses |
| 2. Teste de 4 s | Tico diz uma frase, com voz provisória | Gesto antes da palavra, expressão troca na piscada, boca acompanha o som, câmera em movimento |
| 3. Teste de 20 s | Tico e Lua conversam, com close sem fala de 3 a 4 s | O autor assiste e o close emociona sem constranger; o mesmo quadro renderizado duas vezes sai igual |
| 4. Piloto | Episódio 1 de 90 s com votação A/B e abertura trocável | Compreensível sem ter visto nada antes; a abertura de 12 s encaixa sem salto; gate sem falhas além das intencionais |
| 5. Modelo | Episódio como arquivo de dados + continuidade; episódios 2 e 3 | Episódio 2 sai só trocando o roteiro, em cerca de 30 min do autor |
| 6. Estoque | 3 a 5 episódios prontos | Corpos prontos e aberturas à espera da votação |
| 7. Estreia | Contas, nome e enquete funcionando | Primeiro ciclo de 48 h cumprido |

## Divisão do trabalho

Uma correção mexe só nos arquivos do dono do problema. Ninguém declara concluído antes de renderizar o próprio trabalho e assistir como espectador.

| Papel | Dono de |
|---|---|
| Personagens e rostos | `../../motor/personagem/chars.js` |
| Cenários e objetos | Cenários e objetos do episódio |
| Animação e câmera | Modelo do episódio, gestos, planos |
| Áudio e legenda | Áudio, `timeline.json`, legendas |
| Conferência | Gate e folha de contato; não produz, só audita |
