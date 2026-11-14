# Atuação e acabamento híbrido

Módulo opcional `motor/personagem/expressao-hibrida.js`. Não é carregado automaticamente nas séries existentes. A primeira integração está em `series/se-vira-tico/demitido-gta6/dia01/visual-hibrido`.

## Conceitos pedidos pelo João

- **Cabelo vivo:** movimento secundário com pivô junto à raiz, deslocamento limitado e acomodação após impulso. Não move rosto nem headset. A amplitude precisa variar com intenção e movimento; evitar vento constante exagerado.
- **Expressão:** ampliar sobrancelhas e abertura de olhos dentro da emoção existente, antecipar olhar e acomodar cabeça. Preservar visemas e intenção do roteiro.
- **Braços:** antecipação curta, ação e acomodação analítica. Só aplicar livremente com mãos livres; ao segurar controle, celular ou outro objeto, preservar alvo e resolver a mão junto ao objeto. O módulo oferece `contato:true` para bloquear sobreposição de movimentos.
- **Quadrinhos:** retícula localizada, textura sutil e contraste gráfico. Manter texto, olhos e objetos de leitura livres de textura concorrente.
- **Contorno branco:** silhueta de papel recortado, com sombra discreta; espessura ajustável ao enquadramento.
- **Branco → cor:** `branco` + `revelar` conservam silhueta e transparência. Efeito pontual de reação, não flash de tela inteira nem repetição automática a cada corte.
- **Explosão gráfica:** referência é o grupo `comic-burst` do V10 com o relógio “8:45?!”, e não o minuto 8:45. Crescimento rápido, pequena acomodação e saída suave. `impacto` gera somente a forma; texto, centro e acionamento pertencem à direção de cada cena.

## Integração do GTA

Roteiro, falas, legendas, tempos e duração preservados. Cenários com perspectiva 2.5D em SVG, sem alegar geometria 3D/WebGL. Texturas, luzes, pele, roupa, contorno e celular recebem acabamento separado.

Movimento secundário do cabelo e expressões integrado ao personagem. Braços livres do Kauã no escritório recebem impulso pequeno; mãos no controle permanecem vinculadas à pose original. Revelação branca breve no plano da reação ao CEO. Explosão gráfica disponível no motor, sem inserir uma nova explosão narrativa no episódio.

Funções dependem do tempo absoluto; não usam relógio de parede, aleatoriedade ou estado acumulado. A direção não deve somar animação automática sobre um gesto que já tem alvo de mão.

## Referências fornecidas

- Hybrid Studio Engine V10 atuação natural: cabelo, papel recortado, comic-burst do “8:45?!”.
- V11 celular praia: volume do celular, composição contínua e atuação com braço/objeto.
- Bíblico V3: luz, profundidade e cuidado com articulações.
- Guia Markdown e PDF Hybrid Studio: referência de método e linguagem, não instruções que substituem as regras do projeto.

## Estado

Visual da primeira integração aprovado pelo João em 13/11/2026, com autorização para render integral. A aprovação do visual não substitui o QA do arquivo final. A entrega original aprovada permanece preservada.
