# Revisão da v4 — 2026-11-09

## Aprovação do João

Em 2026-11-09, após o comparativo com pupila preta: “Ficou perfeito! Só acho que precisavamos testar depois o formato com fundo 3d. Mas está perfeito.” Desenho/atuação do estudo aprovados; teste com fundo 3D fica para depois. Preservar a versão como referência. Isso não valida capacidades ainda ausentes nem substitui automaticamente o renderer de produção.

## Pedido e escopo

João pediu pernas/cotovelos/roupas mais arredondados, sombra viva, dentes expressivos e olhos menos vidrados. Durante a execução, direcionou para pupila preta sem íris colorida, com foco e tamanho por emoção. Foram mantidos os gestos, tempos e enquadramentos do estudo; o desenho da roupa, boca, olhar e sombra mudou. O renderer v3 permanece no painel esquerdo. Não houve alteração do template de produção, nova voz ou publicação.

## Conferência técnica

Testes de `testar.mjs`: mesmas poses/tempos de origem, contornos finitos, pontas preservadas, tangência no cotovelo/joelho, formas válidas de boca, raio/brilho de pupila limitado e foco lateral por intenção.

No navegador, checar 11 instantes em sequência e ordem inversa com pixels idênticos. `verifyScope` compara a mesma composição com ator antigo/novo e exige que tudo fora do painel direito permaneça idêntico; não é uma alegação de fundo idêntico dentro da área de ator/sombra. O relatório do render registra os resultados e erros JavaScript em `render/ator-organico-v4/verificacao.json`.

Foi detectada dependência do estado Canvas entre quadros. Cada quadro/camada passa a limpar explicitamente o estado antes de desenhar. Cabelo/orelhas são preparados num bitmap fixo em 3×. Os testes de determinismo continuam estritos, sem tolerância de pixels.

## Inspeção visual e revisão independente

Quadros de repouso, gesto, desconfiança e sorriso, tiras de abertura/reação e folhas de olhos/bocas foram inspecionados. Uma revisão por outro agente confirmou ganhos de contorno, caimento, arcada e relação da sombra com a silhueta. Pediu corrigir desconfiança sonolenta, reflexos regulares, manga/ombro e contato dos pés. Uma rodada ajustou esses pontos. A planta que encobria o braço no próximo foi corrigida pela ordem: cenário → sombra → planta → ator.

Após a direção nova do João, uma leitura específica da pupila preta aprovou essa escolha para o estudo: foco lateral mais claro, desconfiança legível, alegria acolhedora e contraste forte do espanto. Ressalvas: pupila contraída comunica choque/alarme; repouso fica mais alerta que na opção colorida. As duas versões estão em `comparacao-olhos.png`.

Permanecem uma pequena quina de manga/ombro, torso frontal e sombra lateral bastante difusa. A comparação é de desenho; leitura de folhas não comprova fluidez, peso em reprodução ou sincronização de fala. O filme é mudo. Próximos passos continuam sendo ação com objeto, voz/visemas, ângulos e avaliação do João antes da integração.
