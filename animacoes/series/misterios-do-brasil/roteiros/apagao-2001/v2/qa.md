# QA — apagão v2

Autorização: João solicitou revisão do motor, vídeo completo e criação de voz original jovem nesta conversa em 2026-11-08. Não corresponde a uma avaliação artística final feita por ele.

## Conferências anteriores ao vídeo

- Fonte histórica localizada no Senado em 2026-11-08: racionamento de 2001, meta de 20% e possibilidade de corte. Os demais eventos são hipótese, com selo E SE.
- Narração: voz original criada no ElevenLabs, perfil independente em series/misterios-do-brasil/canal/voz-elevenlabs.json. Não usa áudio ou voz do elenco do Se Vira, Tico e não se apresenta como clone do João.
- Licença: plano Starter ativo pela API; licença comercial listada em https://elevenlabs.io/pricing, conferida em 2026-11-08.
- Alinhamento: texto completo conferido literalmente contra os caracteres retornados pelo ElevenLabs; 18 trechos cortados pelos tempos do serviço, não por pausas adivinhadas.
- Sincronização real: 71,574 s. Primeiro gancho termina antes de 3 s. Esta medição substitui a estimativa editorial de 77,2 s.
- Mixagem: narração e som discreto de geladeira sintetizado originalmente no Plotline, na abertura e na retomada. Sem música de terceiros.
- Master: -16,0 LUFS, pico verdadeiro -4,5 dBTP, LRA 1,6 LU.
- Prévia real do template: sem erros de página. Quadros examinados em 0, 7, 20, 30, 45, 58 e 68 s. Corrigidos: legenda cruzada sobreposta; expressões inválidas que recaíam em rosto neutro; cenário vazio; escolha inicial sem os dois objetos visíveis.
- Motor: 14 testes passaram, incluindo iluminação, recorte 3D, direção determinística, câmera estática e bloqueio de fato sem fonte.

## Arquivo final conferido

- Arquivo: `render/apagao-2001-v2/apagao-2001-v2.mp4`.
- Duração: 71,57 s; 1080 x 1920; 30 fps; H.264 e áudio AAC.
- Volume final: -16,1 LUFS. Intervalo máximo sem texto novo: 0,45 s.
- Gate: 7 de 7 itens aprovados após identificação das pausas visuais justificadas. Não foi desativada a checagem para o filme inteiro.
- O relatório bruto sinalizou 11 regiões com pouco movimento, geralmente de aproximadamente meio segundo, e um quadro idêntico no respiro entre falas. Elas foram examinadas na folha `leitura-sinalizada.jpg`: texto em leitura, retenção da última palavra ou transição de raciocínio, sem ação nova que precisasse acontecer. Justificativas e intervalos ficam em `pausas-visuais.json`. O relatório bruto permanece em `render/apagao-2001-v2/qa-bruto-antes-leitura.log`.
- Folha do MP4 final examinada: 0, 7, 13, 20, 29, 35, 40, 45, 52, 58, 64 e 70 s. Abertura, distinção entre história e hipótese, objetos, retomada e última pergunta estão presentes; não houve erro de página na prévia.

Resultado: aprovado nos itens técnicos medidos, com sustentações curtas de leitura documentadas. Pronúncia, timbre, graça, gosto visual e aprovação artística final dependem da avaliação do João; não foram marcados como aprovados. A hipótese de retenção só poderá ser avaliada com resultados publicados.

## Feedback do João — 2026-11-08

Gostou da narração e da execução do vídeo. A ideia pareceu chata, pouco lembrada e sem impacto percebido suficiente; não priorizar essa pauta por causa de sua execução técnica. O visual ficou escuro e precisa de mais cores e luminosidade, como nas referências. Próximas tarefas em `docs/PLANO.md`. Este feedback não significa aprovação de publicação nem validação de retenção.

## Publicação

Não publicado nem agendado. Reavaliar contexto real antes de publicação: o canal evita cenários que possam ser confundidos com crise parecida em andamento. Qualquer rótulo de IA e ficha de postagem serão definidos para a plataforma escolhida.
