# Plotline: instruções para agentes

Kit que, a partir de um tema, gera tudo o necessário para vídeos verticais narrados de 30 a 90 s. Responda ao João em português do Brasil, de forma direta.

## Onde está cada coisa

- **Tudo que depende do nicho:** `canal/canal.md`. Se estiver em branco, rode a skill `configurar-canal` antes de produzir.
- **Fluxo:** a skill `novo-video` roda a cadeia e para em três pontos de aprovação.
- **Método e direitos:** `docs/METODO.md` e `docs/DIREITOS.md`. O guia completo está em `docs/GUIA.md`.
- **Engine:** `engine/`, com a origem em `engine/ORIGEM.md`. Render: `bash engine/montar.sh roteiros/<slug>` no Git Bash.
- **Templates:** `templates/`. Só o `chat` está funcional.

## Regras

- **Publicação:** só o João publica, nas contas dele. Não poste nem agende, mesmo que uma ferramenta permita.
- **Voz:** a narração é a do João. Não use voz sintética sem licença comercial verificada.
- **Humano no meio:** roteiro, ângulo e voz são dele. Agentes rascunham e checam, e ele decide. Nada de cadeia automática de roteiro, voz, imagem e vídeo.
- **Aprovações:** pare no roteiro, nas imagens-âncora e no vídeo final. Não avance sem um sim explícito.
- **Fatos:** todo roteiro tem fontes anotadas. Sem fonte, o fato sai do texto.
- **Ganhos:** não invente números nem prometa viralização. Dados de um post isolado são hipótese.
- **Regras de plataforma:** as do guia vêm de terceiros. Confirme na página oficial antes de decidir.
- **Decisões:** pergunte antes do que não dá para desfazer. No resto, escolha o padrão razoável e diga qual foi.
- **Git:** commit só a pedido. Vídeos e áudios ficam fora do git, e chaves ficam em variáveis de ambiente.
- **Se Vira, Tico:** não acople os projetos. Trazer algo de lá é uma cópia nova, anotada em `engine/ORIGEM.md`.
