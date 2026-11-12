---
name: pesquisa
description: Reúne e confere os fatos de um tema aprovado e mede vídeos de referência, gravando fontes em roteiros/<slug>/fontes.md. Use depois da etiqueta de direitos e antes de escrever o roteiro, ou quando o João pedir para checar um fato ou medir uma referência.
---

# pesquisa

## Entradas

- Tema, ângulo e etiqueta de direitos
- `canal/canal.md`

## Passos

1. **Fatos:** para cada data, número, lugar e nome, abra a fonte. Prefira fonte primária. Fato sem fonte vira "não confirmado" e não entra no roteiro.
2. **Conflitos:** quando as fontes discordarem, registre as duas e diga qual escolheu e por quê.
3. **Referências, quando úteis:** meça duração, palavras por minuto, segundo do primeiro corte, número de cortes, tipo de gancho, onde está a virada e como termina. Confira três valores à mão.
4. **Só estrutura:** referência ensina estrutura. Não copie texto, ordem nem imagem.
5. **Ângulo:** liste duas ou três opções. A escolha é do João.

## Saída

`roteiros/<slug>/fontes.md`:

```markdown
# Fontes: <tema>
Direitos: <bloco da skill direitos>

## Fatos
| Afirmação | Fonte (link) | Conferido em | Situação |

## Não confirmados (fora do roteiro)

## Referências medidas
| Vídeo | Duração | ppm | 1º corte | Gancho | Virada | Fim |

## Ângulos possíveis
```

## Critério de pronto

Cada afirmação que o roteiro vai usar tem link e data. Nenhum número de ganho ou de alcance apresentado como certo.

## Aprovação

Sem parada própria. Vai para o João junto com o roteiro. Pare antes se a pesquisa derrubar a premissa.
