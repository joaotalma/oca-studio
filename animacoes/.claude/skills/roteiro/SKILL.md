---
name: roteiro
description: Escreve ou ajusta o roteiro de um vídeo narrado, com gancho, prova, virada e fecho, e gera a marcação de tempo para a engine (falas.js e video.js). Use depois da pesquisa, ou quando o João trouxer um texto para formatar. Termina na aprovação do roteiro.
---

# roteiro

O roteiro é do João. Você rascunha a partir do ângulo dele, ou formata o texto que ele trouxer, e ele decide a versão final.

## Entradas

- `series/misterios-do-brasil/roteiros/<slug>/fontes.md`, o ângulo escolhido e a etiqueta de direitos
- `series/misterios-do-brasil/canal/canal.md`, `series/misterios-do-brasil/canal/regras.md` e `docs/METODO.md`

## Passos

Antes de escrever, leia `docs/DIRECAO-VISUAL.md`. Defina pergunta, mecanismo, pista, virada e resposta em `estrutura.json`; cada fala inclui função, ação visível, informação nova e ligação com a anterior. Compile com `node motor/roteiro/gerar-roteiro.mjs series/misterios-do-brasil/roteiros/<slug>/estrutura.json`. O programa valida e produz `roteiro.md`, `falas.js`, `video.js` e `direcao.json`; não substitui a escrita editorial. Fontes conferidas são obrigatórias para fatos. Radar e referências atuais: `docs/PROMPT-PESQUISA.md`. Não preencher duração com generalidades nem prometer viralização.

1. **Escreva por blocos:** gancho (0 a 3 s), prova (3 a 10 s), desenvolvimento com uma virada, e fecho. Se `series/misterios-do-brasil/canal/canal.md` definir uma estrutura própria, siga a dele. Para a hipótese, use "seria" e marque a fala como `camada: 'seria'` ou `'voce'`; só o que está em `fontes.md` pode ser dito como "foi".
2. **Escreva para o ouvido:** frases de até 15 palavras. Leia em voz alta mentalmente e corte o que trava.
3. **Confira contra as fontes:** nenhum fato fora de `fontes.md`. Em SÓ COMENTÁRIO, nada de trecho, personagem ou cena da obra.
4. **Gere os dados da engine** no formato de `templates/<template>/README.md`. Em `falas.js`, a primeira fala é o gancho, com `inteiro: true`, e cada fala fica em uma linha de JSON válido.
5. **Estime os tempos:**

```bash
node motor/audio/estimar-tempos.mjs series/misterios-do-brasil/roteiros/<slug>/falas.js --ppm <ritmo do canal.md>
```

6. **Confira a duração** contra `series/misterios-do-brasil/canal/canal.md`. Corte texto em vez de acelerar.

## Saídas

- `roteiro.md`: bloco de direitos, duração estimada, tabela de falas por bloco, instrução de gravação e registro de aprovações
- `falas.js` e `video.js`

Os segundos ficam só em `falas.js`, para não existirem duas versões.

## Critério de pronto

- Gancho nos primeiros 3 s, sem apresentação
- Uma virada identificada
- Duração dentro da faixa, com a contagem de palavras
- Cada fato ligado a uma fonte
- `node motor/audio/estimar-tempos.mjs` roda sem erro

## Aprovação

**PARE.** Mostre o texto completo, a etiqueta, as fontes e a duração. Nenhuma imagem antes do sim. Registre em `roteiro.md`: `Roteiro aprovado por João em AAAA-MM-DD`.
