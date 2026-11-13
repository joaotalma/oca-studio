# Animações — Oca Studio

Responda ao João em português do Brasil. Produção organizada em quatro áreas: `series/`, `entregas/`, `motor/` e `docs/`.

- Leia `docs/APRENDIZADOS.md` antes de escrever, produzir ou revisar. Método em `docs/METODO.md`, direitos em `docs/DIREITOS.md`, direção em `docs/DIRECAO-VISUAL.md` e pendências em `docs/PLANO.md`.
- Motor único em `motor/`; templates em `motor/templates/`. Mistérios e Filmes usam `bash motor/montar.sh series/<serie>/roteiros/<slug>`, a partir de animacoes/. Escolher explicitamente a versão aprovada do roteiro.
- Se Vira, Tico tem instruções próprias em `series/se-vira-tico/AGENTS.md`. A T1 termina no EP6. O spin-off está em `series/se-vira-tico/demitido-gta6/`.
- Instruções canônicas em `docs/FLUXOS.md` e `series/se-vira-tico/docs/PRODUCAO.md`. `.agents` e `.claude` contêm apenas entradas geradas. Edite a fonte e rode `npm run instrucoes`; nunca mantenha duas versões manuais.
- O canal e os dados específicos pertencem à série. Não mover vozes, resultados ou decisões de uma série para outra.
- Aprovação explícita de roteiro e âncoras continua necessária. A aprovação final foi delegada pelo João em 12/11/2026: revisão editorial/visual, QA e entrega completos permitem finalizar automaticamente, sem novo aceite. Ver `motor/FLUXO-RAPIDO.md`. Só João publica; não publicar nem agendar.
- Fatos precisam de fontes. Não prometer viralização nem tratar um post como prova de desempenho. Confirmar regras de plataforma em fonte oficial antes de usá-las numa decisão.
- A voz original jovem do ElevenLabs dos Mistérios foi autorizada em 08/11/2026; perfil em `series/misterios-do-brasil/canal/voz-elevenlabs.json`. Não é clone do João. Outras vozes ou gastos exigem a autorização correspondente.
- Mudou desenho/render? Comparar quadros com `motor/qa/quadros.mjs`. Fontes de desenho em `motor/personagem/`; não editar cópias preparadas de episódios.
- Commit somente a pedido. Chaves nunca no Git. Vídeos aprovados em `entregas/<serie>/<ep>/video.mp4`, com capa/postagem por rede. Renders e intermediários fora do Git. Exceções de áudio: falas do spin-off e fontes únicas do EP6 preservadas sem perda na limpeza autorizada de 12/11/2026.
- Referências de terceiros em `docs/referencias/` são para estudo, não assets licenciados de produção. Manter o repositório privado.
