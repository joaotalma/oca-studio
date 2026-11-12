# Prompt para colar no Se Vira, Tico

Quero adaptar ao Se Vira, Tico as evoluções visuais 2D que desenvolvi e aprovei no Plotline. A direção está aprovada como referência; preserve a identidade, o elenco, a história, as vozes e o humor do Tico. Esta tarefa autoriza preparar e implementar a adaptação visual num estudo isolado, além do papel habitual de revisão. Apresente o teste antes de aplicar nos episódios.

O pacote está em `C:/Users/joaot/Projetos/se-vira-tico/render/referencias-plotline-2d/`. Comece pelo `LEIA-ME.md` e por `GUIA-DE-ADAPTACAO.md`. Veja o painel direito de `exemplos/comparacao-organica.mp4` e as imagens de olhos, bocas, sorrisos e atuação. Os códigos e testes completos estão em `estudo/`. Se a cópia local não estiver disponível, a origem é `C:/Users/joaot/Projetos/plotline/render/transferencias/se-vira-tico-visual-2d/`.

Leve estes avanços:

1. **Desenho orgânico:** membros com contornos curvos contínuos e espessura variável; cotovelos/joelhos arredondados, ombros integrados, roupa com volume/caimento/dobras e tênis/punhos menos geométricos. Preservar articulações, apoio dos pés e silhuetas de cada personagem.
2. **Olhos vivos:** opção sem íris colorida, com pupila preta, foco coerente para ambos os lados, pequeno brilho e tamanho variável por emoção. Integrar pálpebras, sobrancelhas e bochechas. Evitar olhar vidrado, reflexos excessivos e desconfiança que pareça sono. Diferenciar surpresa leve de choque.
3. **Boca expressiva:** arcada curva, poucas divisões de dentes, lábios/cantos, língua, bochechas e queixo atuando juntos. Distinguir sorriso sincero, riso e o sorriso forçado característico do Tico. Preservar fala/áudio existentes; o estudo do Plotline é mudo e não comprova lip sync.
4. **Atuação:** intenção, antecipação, ação e acomodação; cabeça/braços/corpo independentes, pés apoiados e contato coerente com objetos. Cadência do ator pode ser em dois, mantendo câmera e legendas independentes. Não criar movimento contínuo sem função.
5. **Sombra:** projeção acompanhando a silhueta e a direção da luz, com contato curto/mais denso sob as solas e penumbra à distância. Conferir oclusão de objetos e mãos tanto no aberto quanto no próximo.
6. **Cenários 2D mais ricos:** evoluir a rua, o prédio e os ambientes de bico que já existem na série. Usar planos, sobreposição/paralaxe, perspectiva/escala, materiais, cores claras e vivas, luz motivada e objetos que participem da ação. Reservar foco para rosto/mãos/piada e espaço de legenda. Preservar o acabamento do Tico já aprovado; não importar o cenário ou o personagem do Plotline como identidade.

Leia as instruções e o estado atual do projeto. Trabalhe sobre `personagens/chars.js`, `personagens/cenarios.js`, `personagens/acabamento.js` e `personagens/motor.js`, respeitando `MONTAGEM_DO_RIG.md` e as APIs existentes. Faça uma adaptação local independente: sem imports, links simbólicos ou dependência de execução do Plotline. Não edite as cópias dos episódios nem regenere vídeos publicados.

Primeiro confira o que já existe e proponha a mudança concreta. Depois produza um comparativo de 10–15 segundos, em 9:16, com Tico e Lua no universo visual da série. Mostre corpo inteiro e rosto próximo, olhares, reações, sorriso sincero/forçado, sombra e um cenário 2D mais rico. Use teste mudo ou áudio já aprovado; não gere novas vozes nesta etapa. Confira determinismo, recortes, anatomia, oclusão e leitura em celular, e mostre a prova antes da integração em lote.

O teste com fundo 3D fica para depois. Agora o escopo é **personagem 2D + cenário 2D**. Não altere roteiros, arcos, vozes ou votação e não publique nada. Depois do meu aceite do estudo, siga as regras de Git do projeto. Registre a origem das técnicas e diga com clareza o que foi implementado, o que foi verificado e o que ainda falta.
