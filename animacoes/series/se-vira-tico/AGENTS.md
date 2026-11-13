# Se Vira, Tico — instruções

Responda em português do Brasil. Use o motor único em `../../motor/` e as dependências de `animacoes/node_modules/`.

- Fluxo canônico: `docs/PRODUCAO.md`. Elenco, roteiro, erros, regras, postagem e checklist também ficam em `docs/`. `.agents` e `.claude` são atalhos gerados por `npm run instrucoes`, a partir de animacoes/.
- História em `docs/BIBLIA.md`; nomes atuais no README. Dados reais em `resultados/`; propostas para Shorts/TikTok em `reconstrucao/`. Próximos passos em `../../docs/PLANO.md`.
- T1 encerrada no EP6. Fontes oficiais em `episodios/ep01` a `ep06`. Versões anteriores e scripts específicos de produção ficam no histórico do Git, não no caminho ativo.
- Spin-off em `demitido-gta6/`, com bíblia, episódios e `GUIA-CAPAS.md` aprovado. Não aplicar automaticamente sua identidade à série romântica.
- Rig em `../../motor/personagem/`. Episódios antigos fixam o clássico; novos usam orgânico salvo decisão do autor. Ao alterar desenho, comparar quadros dos episódios prontos. Cópias preparadas não são fonte para editar.
- Preparação: `bash scripts/preparar-film.sh episodios/epNN`. QA da série: `node scripts/qa-episodio.mjs <filme> <video>`. Fluxo rápido em `../../motor/FLUXO-RAPIDO.md`.
- Roteiro e âncoras mantêm aceite explícito. Finalização automática autorizada em 12/11/2026, após revisão e QA, sem pedir novo aceite final. Só João publica; não publicar nem agendar.
- Commit e push somente a pedido; usar branch de trabalho. Não fazer merge na main sem pedido.
- Vídeos finais em `../../entregas/`. `render/` é saída local ignorada, não segunda entrega oficial. As fontes únicas dos pacotes do EP6 estão catalogadas em `audio/ep06/fontes.json`, com restauração byte a byte por `../../motor/audio/restaurar-fontes.mjs`.
- Preservar vozes e configurações. Os episódios 1 e 2 usam OmniVoice com licença não comercial; manter os créditos e não monetizar esses dois. ElevenLabs segue as autorizações e licenças em `docs/VOZES.md`. Não gerar voz nem gastar créditos sem autorização.
- Não copiar personagens, músicas, cenas ou assets de terceiros. Não inventar votos ou mudar acontecimentos já publicados ao reconstruir episódios.
- Um render por vez. Respeitar alterações em andamento de outros agentes e nunca incluir trabalho alheio no commit sem conferir.
