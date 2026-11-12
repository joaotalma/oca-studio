---
name: postagem
description: Prepara a ficha de publicação manual de um vídeo aprovado (títulos, descrições, rótulo de conteúdo sintético, créditos e registro). Use depois da aprovação do vídeo final. Esta skill nunca publica nem agenda.
---

# postagem

Só o João publica, nas contas dele. Não use ferramenta que poste, agende ou envie vídeo, mesmo que ela esteja disponível.

## Entradas

- Vídeo com aprovação 3
- `roteiro.md`, `fontes.md` e `qa.md`
- Seção 6 de `series/misterios-do-brasil/canal/canal.md`

## Passos

1. Escreva título e descrição por plataforma. Sem promessa de renda e sem isca que o vídeo não cumpre.
2. Para cada plataforma, indique se o rótulo de conteúdo sintético se aplica. Se a regra não foi conferida na página oficial, confira ou escreva "a conferir".
3. Liste as licenças: voz, música, imagens.
4. Anote a variável que este vídeo testa, conforme a regra de corte.
5. Monte a ficha para ele preencher depois de publicar.
6. **Sem isca de engajamento** no título, na descrição e no comentário fixado: nada de "comente", "envie", "marque" ou "a mais comentada". A pergunta final é aberta. A Meta reduz a distribuição dessa isca.
7. **Uma linha por rede** com o que muda: Instagram em conta profissional de criador; TikTok em conta pessoal; YouTube marcado como "não é para crianças". Uma playlist por série no YouTube.
8. Lembre o João de **responder à mão** os primeiros comentários e de **não usar automação de mensagens** (ManyChat ou parecido). Fonte: `referencias/videos-analisados/temporada-viral-metodo.md`.

## Saída

`series/misterios-do-brasil/roteiros/<slug>/postagem.md`:

```markdown
# Postagem: <slug>
Arquivo: render/<slug>/<slug>.mp4
Gancho: | Tema: | Variável testada:
Voz: João | Música e licença: | Imagens e licença:

| Plataforma | Título | Descrição | Rótulo sintético | Regra conferida em | Publicado em | Link |

Checklist: gancho em 3 s | fatos com fonte | licenças | área segura | celular com e sem som | rótulo decidido | sem isca de engajamento | "não é para crianças" no YouTube
```

## Critério de pronto

Ficha completa, exceto os campos que só existem depois de publicar. Vídeos marcados como teste não recebem ficha.

## Aprovação

A publicação é o ato de aprovação do João. Depois de publicar, ele passa os links para a skill `aprender`.
