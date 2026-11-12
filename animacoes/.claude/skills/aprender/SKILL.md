---
name: aprender
description: Registra o resultado dos vídeos publicados em series/misterios-do-brasil/canal/resultados.csv, aplica a regra de corte e propõe promover padrões a regras em series/misterios-do-brasil/canal/regras.md. Use quando o João trouxer números de um post, pedir uma leitura dos resultados ou quiser decidir se segue um padrão.
---

# aprender

## Entradas

- Números que o João trouxer, ou lidos das contas dele com a permissão dele
- `series/misterios-do-brasil/canal/resultados.csv`, `series/misterios-do-brasil/canal/regras.md`, seção 9 de `series/misterios-do-brasil/canal/canal.md`
- `series/misterios-do-brasil/roteiros/<slug>/postagem.md`

## Passos

1. **Registre** uma linha por vídeo e plataforma, com `lido_em`. Campo sem dado fica vazio, nunca estimado.
2. **Compare** vídeos com tempo de publicação parecido, na ordem do método: retenção em 3 s e 20 s, visualização completa, compartilhamentos e salvamentos, seguidores.
3. **Separe** o que foi medido do que é interpretação. Diga o tamanho da amostra. Com poucos vídeos, a resposta pode ser "ainda não dá para concluir".
4. **Aplique a regra de corte:** seguir, ajustar o gancho ou mudar de formato.
5. **Proponha** a próxima variável a testar, uma só.

## Promover um padrão a regra

Só entra em `series/misterios-do-brasil/canal/regras.md` se:

- Apareceu em mais de um vídeo da própria conta, com a variável isolada
- Tem métrica e vídeos citados
- O João aprovou

Uma regra que os dados novos contradizem é revista, com o motivo anotado. Marcas do guia, como [relato] e [hipótese], só mudam com dados da conta.

## Saídas

- `series/misterios-do-brasil/canal/resultados.csv` atualizado
- Leitura curta na conversa, com a decisão da regra de corte
- Se aprovada, uma nova linha em `series/misterios-do-brasil/canal/regras.md`

## Critério de pronto

Nenhum número sem origem, nenhuma previsão de ganho ou de viralização, e a próxima decisão está clara.

## Aprovação

Abandonar um padrão e promover uma regra são decisões do João.
