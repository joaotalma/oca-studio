# Diagnóstico visual e motor expressivo

2026-11-09 · Pedido do João · Proposta em avaliação, com estudo executável. Não substitui a estética aprovada nem comprova superioridade de mercado.

## Conclusão

O gargalo principal do Plotline é o ator: uma imagem inteira com expressão já desenhada. Mover essa imagem, iluminar melhor e aproximar a câmera não permite interpretar uma frase. A evolução deve controlar intenção, pose, rosto, gesto e contato com objetos. Cada movimento precisa mudar a leitura; quantidade de movimento não é uma meta.

Há outro gargalo: cenários repetidos em forma de caixa, objetos pouco específicos, grande área vazia e sombras que apagam cores locais. Um rig mais complexo não resolve sozinho a direção de arte. O motor autoral exige desenho e encenação, além de programação.

## Evidência e limites

Base: transcrições, panoramas e sequências de movimento dos 13 arquivos enviados, em `.tmp/referencias-13/`, com nova inspeção de planos representativos. A revisão própria usa o piloto final `render/apagao-2001-v2/` e a implementação compartilhada pelas prévias. Não foi feita nova inspeção integral quadro a quadro dos 28 vídeos antigos. Tempos abaixo localizam exemplos aproximados; não representam curvas de retenção.

Likes e views foram informados pelo João. Sem analytics privados ou teste controlado, não podemos atribuir desempenho à animação. O tutorial inicial sobre Claude é uma explicação de processo, não evidência de que uma ferramenta causou o resultado. As oito imagens novas ilustram princípios, com uma imagem repetida de antecipação/timing. Delas vêm conceitos, nunca personagens ou cenas copiadas.

## Referências: conservar e superar

| Referência / pontos de inspeção | Força | Limitação observada e oportunidade |
|---|---|---|
| Lucas/moto · 0–6, 22–45 e 67–100 s | Mundo reconhecível, cores claras, continuidade da dívida | Poses frontais semelhantes; placas/contadores fazem parte do trabalho do corpo. Mostrar reações e gestos específicos. Não tratar os valores ficcionais de engajamento como renda real. |
| QI · início, faixa de 15 s e sequência de poder | Progressão de escala legível | Efeitos e gráficos trabalham mais que postura/peso. Mostrar o efeito do poder no comportamento, em vez de acrescentar outra aura. |
| Gênios · 9–24 e 29–39 s | Quantidades e comparação claras | Multidões clonadas, personagens pequenos, texto concorrente. Usar distância corporal, olhar e pausa na discussão; preservar clareza de infográfico. |
| Biel · 0–6, 24–55 e 79–110 s | Paleta viva e escolhas compreensíveis | Frente recorrente e gesto limitado; longa seção de cartões. Transformar parte das explicações em acontecimentos. |
| Preço na testa · 0–6, 21–35 e 63–83 s | Pista junto do rosto, detalhes bem escolhidos | Corpos retos e expressões discretas; vinheta recorrente. Distinguir status por postura e espaço entre pessoas. |
| Último homem · 0–6, 24–32 e 63–71 s | Inserts de telefone/mapa e profundidade | Há gestos úteis; vários personagens continuam frontais. HUD e legenda disputam o rosto. Variar ângulo/atuação por intenção. |
| SaveClip/Caio · abertura, 15–17 s e fogo | Luz quente/fria, close de olho e mão em ação | Referência mais forte de direção. Em partes, tronco sustentado enquanto boca/efeito carregam a cena; não generalizar a todos os planos. |
| Cartão da Família · 0–6, 29–48 s e final | Atuação humana: sobrancelha, inclinação, antecipação da piada | Chat denso e sobreposição do ator. Referência de interpretação, não modelo de composição a copiar. |
| AQM/Tinder · 0–26 e 41–72 s | Expressão humana e continuidade de fala | Grande área preta sem função e texto pequeno acumulado. Audiência e acabamento são dimensões diferentes. |
| Snap/Cleiton · 0–6, 26–35 e 44–62 s | Rosto com personalidade, dentes e inserts ligados à história | Cabeça/frente repetida e muitos cartões. Um desenho expressivo ainda pode ter pouca transformação no tempo. |
| Foto do futuro · abertura, faixa de 15 s e sequência da foto | Pista visual clara e revelação | Parte da intensidade vem de zoom sobre poses sustentadas. Mais reação entre pessoas e contato com a foto. |
| Cidade · 0–6, 24–60 e 83–143 s | Construção por etapas e câmera mostrando relações | Módulos/materiais de maquete, repetição de objetos; ator secundário. Aprender causalidade espacial, sem aplicar a mesma maquete a toda pauta. |
| Dia mais feliz · abertura e sequências de juventude/velhice | Cor acolhedora e contraste emocional | Trocas de expressão/enquadramento fazem boa parte do trabalho; corpos sustentados e vinheta repetida. Afeto pede atuação contida, não susto permanente. |

## Falhas do nosso piloto, em prioridade

| Problema | Evidência | Correção |
|---|---|---|
| Ator como recorte | `motor/cenas/ambiente3d.js`, função `actor`: imagem completa, rotação e escala globais pequenas | Partes articuladas e pose por intenção. Rosto separado da textura corporal. |
| Piscar como único gesto facial | Alternância entre albedos normal/fechado, fase local por plano | Pálpebras independentes, olhar antecipando cabeça e piscadas no tempo absoluto. |
| Boca congelada | `desenhar-cenas.mjs` escolhe um rosto de `rostos.json` e gera a imagem inteira | Boca, mandíbula e bochechas controláveis. Fala alinhada ao áudio real: volume não identifica fonemas. |
| Verbo sem execução | Abrir/desligar/compartilhar aparecem como troca de estado ou insert; falta mão + objeto + contato | Ação com alvo, alcance, contato e consequência. Se faltar capacidade, avisar; não fingir execução. |
| Espaço genérico | Recinto em caixa, câmera repetida, chuveiro junto da geladeira como atalho | Ambiente próprio da situação, planta consistente, materiais/objetos específicos. Cortar entre ambientes quando necessário. |
| Escuro e pouco variado | Folha final, sobretudo trecho histórico por volta de 7 s; grandes áreas sem informação | Preenchimento e valores planejados, cores locais legíveis. Não resolver só com brilho global. |
| Prova fraca | Medidor por volta de 45 s depende da fala; compartilhar geladeira não envolve duas pessoas agindo | Desenhar o dado e seu efeito humano. Legenda não substitui prova. |
| Escala e legenda | Abertos com rosto pequeno; legenda cruza corpo/objeto | Reservar espaço antes do render; próximo para reação, aberto para ação. |

`motor/rig/chars.js` tem articulação, mas não é usado pelo template funcional e contém elenco de outro projeto. Sua presença não dá essas capacidades ao personagem atual. O estudo v3 é local, derivado da ficha do Plotline, sem usar aquele elenco.

## Avaliação das sugestões enviadas

| Recurso | Decisão |
|---|---|
| Pose-to-pose | Prioridade: poses com intenção/silhueta, depois espaçamento e intermediárias. Colocar `steps()` sobre movimento linear não basta. |
| Em dois | A 30 fps: 15 poses/s. A 24 fps: 12. Cadência por camada; câmera e texto com seus próprios relógios. Não reduzir o vídeo inteiro para 12 fps. |
| Smear/linhas | Pontuais, no membro/objeto que acelera, com duração/direção escolhidas. Velocidade sinaliza candidato, não dispara efeito em todo zoom. Evitar fantasmas transparentes do corpo inteiro. |
| Arte híbrida | Contraste planejado: ator com contorno/sombras gráficas, ambiente com bordas/pincelada mais suaves e pista nítida. Compartilhar paleta, luz e perspectiva. Mistura aleatória não cria autoria. |
| ControlNet/LoRA/fluxo temporal | Experimento futuro de acabamento/poses. Condicionamento espacial não garante atuação, mãos, identidade ou continuidade. Não é dependência para o rig funcionar. Avaliar licença/custo antes de incorporar modelos. |
| Grão/line boil | Opcional, discreto e determinístico. Preservar olhos, dentes, texto e contatos. Ruído novo e forte a cada frame vira cintilação. |
| Aberração cromática | Fora do estilo-base. Só num impacto em que melhore a leitura; não sobre rosto e legenda permanentemente. |

Base técnica: [exposição/timing — Toon Boom](https://learn.toonboom.com/modules/basic-concepts/topic/exposure-sheet-timeline-and-timing), [pose-to-pose — Toon Boom](https://learn.toonboom.com/modules/animation-principles/topic/straight-ahead-and-pose-to-pose-principle), [ControlNet oficial](https://github.com/lllyasviel/ControlNet). Intensidade, estilo e prioridades acima são propostas do Plotline, não conclusões desses fornecedores.

## Arquitetura

1. **Direção:** intenção, ação, mudança emocional, objeto-alvo, informação visível e motivo do corte. Referência cultural entra como gesto/objeto contextual, sem sticker obrigatório.
2. **Biblioteca autoral:** frente/3/4/perfil, mãos, poses extremas, mandíbula/bochechas e regras de contorno. Reutilizar identidade sem repetir a mesma pose para todo verbo.
3. **Ator:** hierarquia de partes/ossos, limites, olhar, sobrancelhas assimétricas, pálpebras e silhuetas. Permitir desenhos substitutos nas poses extremas: matemática não resolve toda perspectiva.
4. **Fala:** áudio final → alinhamento de fonemas/trechos → visemas → antecipação/coarticulação → mandíbula e pausas. Emoção não pode ser apagada por abrir/fechar uniforme.
5. **Corpo/mundo:** antecipação, arcos, ultrapassagem e acomodação; pés plantados, alcance, mão conduzindo objeto e sombra de contato. Caminhada é um módulo, não balanço vertical.
6. **Cena/câmera:** profundidade, oclusão e enquadramento por função. Câmera revela ação sem substituí-la. Compor rosto, legenda e pista ao mesmo tempo.
7. **Acabamento:** relógios por camada, render determinístico, luz compartilhada, textura e efeitos selecionados. Teste curto antes de render completo.
8. **Revisão:** quadros-chave, tiras densas, celular, leitura sem som e comparação cega. Separar testes técnicos, julgamento artístico e audiência.

Fluxo: **intenção → pose/ação → voz/visemas → contato/câmera → luz/acabamento → inspeção**. O motor deve rejeitar ações desconhecidas e declarar o que falta. Metadado de ação não é ação animada.

## Assinatura visual proposta

- Ator reconhecível pela silhueta, assimetria e maneira de reagir, além de cabelo/jaqueta.
- Lugares brasileiros específicos da pauta, objetos usados e materiais desenhados; evitar o quarto que só muda de cor.
- Cor clara/viva com foco: base acolhedora, contraponto frio e acento na pista. Cena tensa também pode ter cor; não impor filtro escuro a todo passado.
- Alternar pose forte sustentada e ação rápida. Repouso faz parte da interpretação.
- Metáfora transformada diante do público. Autoria vem da invenção da cena e do desenho, não da coleção de filtros.

## Entregue e pendente

Estudo v3 (removido na limpeza de 12/11/2026; recuperável no commit `4b2fae3`): olhar dirigido, piscadas planejadas, sobrancelhas separadas com risco, cabeça articulada, squash local moderado, oito bocas com dentes/língua, braços de dois segmentos, mãos simplificadas, peso e pés plantados. Comparação muda de 12 s em cenário mais claro/colorido.

Sem lip sync entregue. Faltam mandíbula com contorno independente, mãos refinadas, contato com objetos, caminhada, 3/4/perfil, integração com luz 3D e decisão artística final. A esquerda é um controle simplificado de imagem única; não simula integralmente o renderer atual. Membros foram redesenhados para articular: preserva o personagem, não cada linha original.

Próxima prova: ação curta com a voz aprovada, em 9:16. Ver algo → reagir → alcançar objeto → mudar seu estado com contato. Comparar atuação contida/expressiva com mesma fala, tempo e composição. Aprovar desenho/âncoras antes de episódio completo; não reprocessar catálogo agora.

## Critério de sucesso

“Melhor que tudo na internet” não é testável nesta etapa. Alvo: superar estas referências em atuação, clareza, originalidade e consistência, mantendo produção viável.

- Intenção e ação compreensíveis sem legenda/som; distinguir curiosidade, suspeita, surpresa e alegria.
- Mãos/pés/volumes/objetos coerentes no movimento; identidade estável em poses extremas e outros ângulos.
- Abertura, pista e reação legíveis em celular, com interface e legendas.
- Comparação cega de clareza, personalidade e acabamento, registrando críticas abertas. Nota automática não aprova arte sozinha.
- Após publicação manual: retenção inicial e por trecho, conclusão, replays e compartilhamentos por view, em contexto comparável. Melhoria técnica não prova audiência; post isolado não estabelece regra.
