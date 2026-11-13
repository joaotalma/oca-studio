# Oca Studio

Projeto privado do João. A frente em produção é **Animações**. Automações e trading ficam como possibilidades futuras, sem pastas vazias na estrutura atual.

## Onde trabalhar

Tudo de produção fica em `animacoes/`, com quatro áreas:

| Pasta | Uso |
|---|---|
| [series/](animacoes/series/) | Escolher a série, escrever e editar seus episódios |
| [entregas/](animacoes/entregas/) | Vídeos, capas e textos prontos para publicar |
| [motor/](animacoes/motor/) | Render, templates, áudio, personagens, QA e testes compartilhados |
| [docs/](animacoes/docs/) | Método, aprendizados, referências, visual e plano de trabalho |

Comece por [animacoes/docs/PLANO.md](animacoes/docs/PLANO.md). O agente deve ler [AGENTS.md](AGENTS.md) e as instruções da área.

## Continuar em outro computador

1. Clone este repositório privado e selecione a branch com o trabalho desejado.
2. Instale Node.js 20+, Python 3 com NumPy, FFmpeg, Chrome e Git Bash no Windows.
3. Rode `npm ci` **somente em animacoes/**. As séries usam essas dependências compartilhadas.
4. Configure as chaves localmente; nenhum arquivo de ambiente entra no Git. A configuração existente do Tico pode continuar em `animacoes/series/se-vira-tico/.env.local`.
5. Rode `npm test` em `animacoes/`. `npm run instrucoes` atualiza os atalhos de Claude e Codex a partir das fontes únicas em docs.

Somente João publica. Vídeos finais ficam em entregas/, até 100 MB cada. Renders de trabalho ficam fora do Git. Veja [a organização e o histórico da limpeza](animacoes/docs/ORGANIZACAO.md).
