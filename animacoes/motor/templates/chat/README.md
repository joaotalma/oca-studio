# Template: chat

Conversa em mensageiro genérico, sem marca de nenhum aplicativo. A tela quase não muda: a retenção vem do texto aparecendo no ritmo da voz.

## O que o roteiro entrega

Na pasta `series/misterios-do-brasil/roteiros/<slug>/`:

- **`video.js`:** `const VIDEO = { template: 'chat', contato: { nome: '...', status: 'online' } };`
- **`falas.js`:** uma fala por linha, em JSON válido.

| Campo | Obrigatório | O que faz |
|---|---|---|
| `n` | sim | Número da fala, a partir de 1 |
| `quem` | sim | Quem fala na história, para leitura do roteiro |
| `lado` | sim | `esq` (o outro), `dir` (o protagonista) ou `centro` (aviso, gancho, "Parte 2") |
| `texto` | sim | O que aparece e o que você lê |
| `pausa` | não | Segundos de silêncio antes da fala. Padrão: 0,25 |
| `ini`, `fim` | sim | Tempo no roteiro. Preenchidos por `motor/audio/estimar-tempos.mjs` |
| `destaque` | não | Lista de palavras em destaque |
| `inteiro` | não | `true` mostra a fala completa desde o primeiro quadro. Use no gancho |
| `fx` | não | Efeito curto: `notificacao`, `clique`, `passagem`, `ziper`, `baque`, `sopro`, `grave` |

## Como funciona

- **Revelação:** cada palavra aparece em uma parte da fala proporcional às suas letras. É uma aproximação da fala real, sem transcrição.
- **Digitando:** mensagens de `esq` com pausa suficiente antes ganham o balão "digitando" e o aviso no cabeçalho.
- **Reação no canto:** desligada por padrão. Para ligar, use `reacao: { imagem: 'assets/reacao.png' }` em `video.js`. As mensagens começam mais abaixo para não ficarem cobertas.
- **QA:** este template declara `window.HOLDS` no filme inteiro, então o gate não cobra tela parada. O limite passa a ser o tempo sem texto novo, de 2,5 s, medido por `motor/qa/qa-video.mjs`.

## Montar

```bash
node motor/audio/estimar-tempos.mjs series/misterios-do-brasil/roteiros/<slug>/falas.js
bash motor/montar.sh series/misterios-do-brasil/roteiros/<slug>
```
