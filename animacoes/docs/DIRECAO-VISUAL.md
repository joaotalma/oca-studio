# Direção visual e narrativa — v2

Solicitada por João após a análise de 13 referências locais em 2026-11-08. São hipóteses editoriais, não padrões comprovados por retenção. Usar somente técnicas gerais; nunca copiar personagens, cenas ou textos.

## Antes de desenhar

**Aprovação de 2026-11-09:** a referência de desenho/atuação agora é `series/misterios-do-brasil/personagens/voce-v4.md`, aprovada pelo João no comparativo de `estudos/ator-organico-v4/`. Olhos com pupila preta sem íris colorida, contornos arredondados e boca expressiva. O teste desse ator com fundo 3D foi pedido para depois e continua pendente; não confundir referência aprovada com integração já realizada.

**Evolução proposta em 2026-11-09:** consultar `estudos/MOTOR-EXPRESSIVO-V3.md`. O estudo em `estudos/_arquivo/ator-expressivo-v3/` não substitui o renderer nem a ficha aprovada. Para verbos como abrir, pegar, entregar ou desligar, conferir alvo, gesto, contato e consequência visível. Trocar para outra imagem do objeto não comprova execução da ação pelo personagem.

Cada estrutura.json define pergunta, mecanismo, pista, virada e resposta. Cada fala registra função, ação visível, informação nova, ligação causal, enquadramento e motivo do corte. O compilador motor/gerar-roteiro.mjs produz roteiro.md, falas.js e direcao.json. Ele valida o contrato; a seleção e a escrita continuam sendo trabalho editorial humano/assistido, não uma fórmula que garante audiência.

Escolha uma progressão: tentativa/consequência; cadeia de dependências; vantagem/custo; interpretação/revelação; dilema. Contexto histórico permanece apenas quando estabelece risco, regra ou pista. A mudança de fato para hipótese não conta sozinha como virada. Cada fato precisa de fonte conferida. Tempos ficam em falas.js, sem segunda linha do tempo.

## Plano com propósito

| Função | Enquadramento/movimento possível | Conferência |
|---|---|---|
| Consequência pessoal | médio ou próximo; aproximação discreta | entende-se a reação? |
| Pista | detalhe; câmera parada para leitura | objeto e informação aparecem juntos? |
| Causa → efeito | corte entre ação e consequência | a relação fica clara sem a fala? |
| Sistema/escala | aberto; afastamento ou acompanhamento | relações espaciais continuam legíveis? |
| Dilema | composição com duas opções; câmera estável | cada opção tem um custo real? |
| Virada | retornar à pista com outro enquadramento | a nova informação muda o começo? |

Não há regra de cortar a cada X segundos. Não alternar zoom/direções por número da fala. Plano estável é válido: animação de rosto, gesto, objeto ou dado deve ter função. O motor aceita movimento parado e trajetórias de câmera explícitas de/para/alvo em cena3d.camera. Mais detalhe e movimento não são sinônimos de beleza.

## Acabamento

- Identidade imutável do personagem; expressão e gesto coerentes com a fala. Não aplicar a mesma expressão ao filme inteiro.
- Cenários com profundidade, primeiro/meio/fundo, perspectiva, sombra de contato e detalhe ligado à história. Objetos apoiados, sem flutuação automática.
- Luz motivada por janela/poste/aparelho, com preenchimento que preserve pele e olhos. O objeto citado deve continuar visível em cenas escuras.
- Paleta consistente; contraste quente/frio com função. Não usar cor para fingir fato histórico ou urgência real.
- Primeiro quadro compreensível, gancho inteiro, selo de hipótese. Legendas curtas; não sobrepor olho, mão, pista ou dado decisivo.
- Nenhum movimento durante leitura crítica que impeça compreender a informação. Reduzir efeitos e partículas quando competirem com o foco.
- Pista e plano final planejados juntos. Repetir um lugar ou objeto pode ser mais expressivo que trocar de cenário.

## Aceitação

Antes do render completo, verificar quadro de abertura, prova, reação, virada e fecho em resolução de entrega, mais sequências curtas dos movimentos. Conferir corte associado à fala real e evitar reutilizar imagens antigas depois de alterar a narração. Validar determinismo, ausência de erros, legibilidade, duração, áudio e loudness; registrar limites do QA. A voz e a avaliação artística final pertencem ao João.

O detector de movimento contínuo pode sinalizar uma pausa legítima de leitura. Não criar movimento artificial para satisfazê-lo nem dispensar o filme inteiro. Conferir os trechos sinalizados, preservar o relatório bruto e registrar só as sustentações justificadas em `pausas-visuais.json` com `ini`, `fim` e `motivo`. Rodar `motor/qa-video.mjs ... --leitura <arquivo>` apenas depois da conferência à vista. A declaração identifica uma escolha de direção; não comprova retenção nem substitui a inspeção.

## Radar

Usar docs/PROMPT-PESQUISA.md no início de uma nova rodada de pauta. Referência atual deve ajudar a história e funcionar sem reconhecimento do meme. Interesse observado não é retenção medida. Não transformar um post bem-sucedido em regra do canal.
