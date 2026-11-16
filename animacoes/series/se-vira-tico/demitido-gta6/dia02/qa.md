# Dia 2 — registro de produção e revisão

## Revisão vigente do João, 14/11/2026

Entrega substituída pela revisão de **107,1 s**, 1080×1920/30 fps, **66.812.771 bytes**, áudio medido em −16,0 LUFS. Gate do rascunho 7/7; QA final aprovado. Inspeção de oito amostras em alta e seis quadros críticos; parecer independente em `revisao/critica-revisao-joao.md`. Cenas de selfie e mãe retiradas; cabeça do Hambúrguer apoiada na gola, barba e queixo externos, cabelo restaurado, patrão com rosto. Uma tela de voto, assinatura fictícia legível e CTA pedido pelo João. Três falas novas geradas com **133 créditos autorizados**. Novo projeto reproduzível em `revisao-joao/preparar.mjs`. O término foi alinhado ao último quadro do master (107,1 s); planejamento com áudio media 107,116 s. Resultados abaixo documentam a versão anterior.

## Direção preservada

Roteiro v4 aprovado, 117,8 s. HQ V10, com luta em 3D somente de 24,0 a 39,9 s. Gravações existentes de Kauã (`kaua2`), Dona Rose e anunciador reutilizadas; nenhum crédito de geração consumido nesta retomada. Léo, Rafa e Pedrão aprovados explicitamente pelo João nesta conversa em 14/11/2026.

Decisões de acabamento: legendas por alinhamento real, em grupos de até três palavras, fonte fixa de 64 px; sem frase comprimida para caber. Corte limpo na saída da luta. Luvas conectadas às mangas no pacto. Dona Rose fala inteiramente fora de quadro. Cabelo amassado mantido depois do bico. A narração conduz os planos; a pausa do voto permanece silenciosa. Efeitos originais sintetizados acentuam dança e notificações, com voz em primeiro plano.

## Evidências

- Revisão independente inicial: `revisao/critica-inicial.md`, cinco bloqueios.
- Rechecagem independente: `revisao/critica-corrigida.md`, cinco bloqueios resolvidos.
- Gate inicial bruto preservado em `animacoes/render/demitido-gta6/dia02-final/qa-resultados/gate-inicial.log`. Não foi tratado como aprovação.
- Pausas legítimas de leitura enumeradas em `hq/pausas-visuais.json`; não dispensam os trechos de atuação.
- Fontes do filme integrado: `hq/preparar-final.mjs`, `hq/controle-final.js`, HQ em `hq/final-parte1.js` e `hq/final-parte2.js`, luta em `3d/luta/film.html`. Cópias preparadas não são fonte de edição.
- Som reproduzível: `hq/efeitos.py` e `hq/audio-final.mjs`. Masterização em duas passadas, alvo −16 LUFS e −1,5 dBTP.

## Fatos externos conferidos em 14/11/2026

O lançamento em 19/11/2026 permanece indicado pela [Rockstar](https://www.rockstargames.com/VI). A edição Standard digital aparece por R$ 449,90 na [PlayStation Store Brasil](https://store.playstation.com/pt-br/product/EP1004-PPSA01547_00-GTAVISTANDARD001). O relógio de cinco dias corresponde ao dia 14/11/2026 dentro da história. Salário, desconto, pizza e anúncios são ficção do roteiro aprovado, não alegações de preços reais.

## Resultado final medido

Master concluído em 14/11/2026: 117,8 s, 1080×1920, 30 fps, H.264/AAC, 70.569.164 bytes (70,6 MB). Áudio no MP4: −16,02 LUFS, pico real −3,26 dBTP. Gate completo do rascunho: 7/7; QA leve do master aprovado com os hashes de fonte, áudio e rascunho conferidos. Oito amostras do master e oito quadros críticos inspecionados; braços, celular, luvas, cartão e voto sem novos bloqueios. As 18 gravações foram medidas, sem sobreposição com a fala seguinte. Arquivo oficial e hash em `entregas/demitido-antes-do-gta/dia02/aprovacao.json`.

## Limites da revisão final

A revisão visual usa quadros, sequências de quadros e medições do arquivo. Não equivale a julgamento auditivo humano da interpretação. A pose sentada na suspensão final de um segundo é o ponto mais fraco; a consequência de jogar no chão está explícita no cartão da cadeira. Nenhuma publicação ou agendamento é executado. A aprovação final deve ser a delegada pelo João em 12/11/2026 e exige QA válido do arquivo final.
