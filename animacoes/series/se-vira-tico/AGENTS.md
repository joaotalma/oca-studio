# Se Vira, Tico: instruções para agentes

Este arquivo vale para o Claude Code e para o Codex. Responda ao autor em português do Brasil.

## Onde está cada coisa

- **Fluxo de produção:** `.claude/skills/se-vira-tico/SKILL.md` e a pasta `references/` ao lado dele. Leia antes de escrever roteiro, montar cena, renderizar ou revisar um episódio.
- **História:** `docs/BIBLIA.md`. Ela ainda traz nomes antigos: valem os do `README.md`.
- **Decisões pendentes:** `episodios/BACKLOG.md`.
- **Vozes:** `docs/VOZES.md`.
- **Render no Windows:** `docs/NOTAS_WINDOWS.md`. Use o Git Bash. Os scripts de render ficam em `~/.claude/skills/take-one/scripts/`.

## Regras do projeto

- **Publicação:** só o autor publica. Não poste nem agende nada.
- **Licença das vozes:** os eps. 1 e 2 usam OmniVoice, de licença não comercial: não monetize esses dois e mantenha o crédito na legenda. Do ep. 3 em diante as vozes são do ElevenLabs (`docs/VOZES.md`). Antes de monetizar, confirme na página oficial que o plano do autor permite uso comercial.
- **Git:** depois que o autor aceitar uma alteração, faça o commit e o push na branch de trabalho sem perguntar de novo. Inclua só os arquivos dessa alteração e nunca envie direto para a `main`. Merge só a pedido do autor.
- **Arquivos fora do git:** vídeos e áudios finais ficam fora do git, com cópia no Drive. Referências de voz ficam em `audio/vozes/`; não as apague.
- **Rig:** edite `personagens/chars.js`, nunca as cópias nas pastas de episódio.
- **Obras de terceiros:** não copie personagens, músicas ou cenas de outras obras.

## Quem faz o quê

O autor pode trocar estes papéis a qualquer momento. Um pedido dele na conversa vale mais que esta lista. Fora do seu papel, pergunte antes de agir.

- **Claude Code gera:** escreve o roteiro, monta as cenas, renderiza, mixa e roda o QA. Fica com o render porque os scripts estão fora do projeto e o sandbox do Codex pode bloqueá-los.
- **Codex revisa:** lê o que foi entregue e aponta problemas. Só escreve em `episodios/epNN/revisao.md`, sem alterar o trabalho revisado. Pode propor uma fala ou correção, mas quem aplica é o gerador, depois da decisão do autor.
- **O autor decide:** escolhe o que entra, resolve discordâncias e assiste ao vídeo antes de publicar. Só ele julga som e graça.

A análise de vídeos do YouTube é feita pelo autor no Cowork. Se houver um resumo em arquivo, leia só quando o autor pedir: as ideias entram na série pela decisão dele.

### O que revisar em cada etapa

| Etapa | O gerador entrega | O revisor confere |
|---|---|---|
| Roteiro | Roteiro a partir do pré-roteiro vencedor | Bíblia e regras: tom, personagens, piadas, duração e votação |
| Cenas | Poses, câmera e cenários em código | Alterações do commit: bugs e regras quebradas |
| Vídeo | Render, mixagem e relatório de QA | Relatório e folhas de quadros: membros, boca, legenda e cortes |

### Ciclo

1. **Entrega:** o gerador conclui uma etapa e, quando o autor aceitar, faz o commit e o push na branch do episódio.
2. **Revisão:** a pedido do autor, o revisor analisa esse commit e escreve em `episodios/epNN/revisao.md`.
3. **Classificação:** cada item aponta o arquivo ou o momento do vídeo e vem marcado como **bloqueia** ou **sugestão**.
4. **Correção:** o autor escolhe o que entra, e o gerador corrige.
5. **Limite:** no máximo duas rodadas por etapa. Depois disso, o autor decide.

## Dois agentes ao mesmo tempo

- **Em turnos:** o revisor só começa depois da entrega, e o gerador só volta a editar depois da revisão. Nunca edite um arquivo que o outro agente está editando.
- **Arquivos que afetam tudo:** só um agente por vez mexe em `personagens/` e `scripts/`.
- **Render:** um por vez, porque os dois disputam o Chrome e a mesma pasta `render/`.
- **Antes de editar:** rode `git status`. Se houver alteração que não é sua, não reverta nem inclua no seu commit.
- **Worktree:** áudios, `node_modules/` e as cópias geradas nas pastas de episódio não vão para um worktree novo. Copie ou gere esses arquivos antes de renderizar nele.
