# Verificação do estudo — 2026-11-09

## Medido

- Render final de 12 s, 1280 × 900, H.264, 30 fps, sem faixa de áudio, conferido por FFprobe.
- Sem erros JavaScript no navegador; mesmos pixels ao renderizar o mesmo tempo antes e depois de outro quadro.
- Testes em `testar.mjs`: estados finitos, determinismo em ordem inversa, cadência opcional do ator, boca em repouso no início/fim, área local da cabeça, comprimento das pernas e poses discretas de mão.
- Quadros de abertura, folha de atuação, tira de 2,5–3,6 s e biblioteca de boca inspecionados. Essas verificações não comprovam beleza, fluidez em reprodução ou retenção.

## Revisão independente

Primeira leitura por outro agente, sem contexto da construção: diferença de capacidade visível; pediu correção de mãos/punhos, postura em losango, sorriso ambíguo, enquadramento que cortava o gesto e título excessivamente amplo.

Uma rodada de acabamento foi renderizada e reavaliada. Veredito: pode ser apresentado como **estudo experimental**. Reconheceu mãos mais legíveis, repouso mais natural, melhor preservação do gesto, bocas distintas, identidade/cor consistentes e título mais preciso. Não avaliou reprodução do MP4: peso, fluidez e fala não foram aprovados.

Restaram: sorriso em 6,2 s ainda pode parecer apreensão; torso pouco deformável; FV não comprova contato labial; transição de mão em 3,0–3,2 s parecia sem intenção. Esse último achado revelou um erro técnico: o identificador numérico de mão era interpolado de 3 a 1 passando pela pose 2. Passou a ser um estado discreto; teste de regressão adicionado e tira re-renderizada. Também se limitou a altura da boca arredondada para preservar espaço até o queixo. A correção técnica não equivale a nova aprovação artística de todos os pontos.

## Pendências para produção

Refinar desenho de ombros/peito/quadril, mãos e mandíbula; trabalhar alegria menos ambígua; provar ação com objeto; sincronizar boca com áudio real; testar 3/4/perfil e plano 9:16 com legenda. Sem contexto visual de um acontecimento, o estudo demonstra repertório, não uma cena dramática completa.

O controle à esquerda é simplificado. O estudo não prova superioridade sobre o renderer completo, os vídeos enviados ou o mercado. Não houve alteração do template de produção, nova voz ou commit.
