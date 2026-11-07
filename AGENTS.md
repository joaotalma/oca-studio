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
- **Licença das vozes:** as vozes do OmniVoice têm licença não comercial. Sem monetização, e com crédito na legenda.
- **Git:** não faça merge nem push sem o autor pedir.
- **Arquivos fora do git:** vídeos e áudios finais ficam fora do git, com cópia no Drive. Referências de voz ficam em `audio/vozes/`; não as apague.
- **Rig:** edite `personagens/chars.js`, nunca as cópias nas pastas de episódio.
- **Obras de terceiros:** não copie personagens, músicas ou cenas de outras obras.

## Dois agentes ao mesmo tempo

- **Uma frente por agente:** antes de começar, combine com o autor qual pasta ou episódio é seu. Nunca edite um arquivo que o outro agente está editando.
- **Arquivos que afetam tudo:** só um agente por vez mexe em `personagens/` e `scripts/`.
- **Render:** um por vez, porque os dois disputam o Chrome e a mesma pasta `render/`.
- **Antes de editar:** rode `git status`. Se houver alteração que não é sua, não reverta nem inclua no seu commit.
- **Worktree:** áudios, `node_modules/` e as cópias geradas nas pastas de episódio não vão para um worktree novo. Copie ou gere esses arquivos antes de renderizar nele.
