# Motor

Motor único das animações da Oca Studio. Ele é usado por todas as séries: Se Vira, Tico, Mistérios do Brasil e Filmes. A origem de cada arquivo está em [`ORIGEM.md`](ORIGEM.md).

| Pasta | O que faz |
|---|---|
| raiz | `montar.sh` (do roteiro ao vídeo), `preparar-film.sh` (monta `render/<slug>/`), `reprocessar.sh` e `tempo.js` (mapa de tempo dos templates) |
| [`personagem/`](personagem) | Personagem com rig: `chars.js` (rig e elenco), `cenarios.js`, `motor.js` (cena, câmera e falas) e `acabamento.js`. Tem dois estilos, escolhidos por `ESTILO_RIG`: `'organico'` (padrão) e `'classico'` |
| [`cenas/`](cenas) | Cenas ilustradas: desenho em Python (`cenas-lib.py`, `cenas-filmes.py`, `desenhar-*.py`), camadas e fundo 3D (`ambiente3d.js`, `preparar-cenas3d.mjs`) |
| [`audio/`](audio) | Voz ElevenLabs, fatiar a narração, `sincronizar.py`, `mixar.py` (modo episódio com trilha sintetizada, ou `--narrado`) e `masterizar.sh` |
| [`roteiro/`](roteiro) | Gerador de roteiro, rubrica editorial e revisão do catálogo |
| [`qa/`](qa) | `qa-video.mjs` (QA de qualquer vídeo) e `quadros.mjs` (quadros de referência para provar que uma mudança não alterou o vídeo) |
| [`take-one/`](take-one) | Exportador e gate do Take One (MIT) e licenças |
| [`testes/`](testes) | `node --test motor/testes/*.test.mjs` |

## Como cada série usa o motor

- **Mistérios do Brasil e Filmes:** `bash motor/montar.sh series/<serie>/roteiros/<slug>`, rodado a partir de `animacoes/`. Os templates ficam em `../motor/templates/`.
- **Se Vira, Tico:** `bash scripts/preparar-film.sh episodios/epNN`, rodado a partir de `series/se-vira-tico/`. Ele copia `personagem/` e `take-one/` para a pasta do episódio. A mixagem é `python ../../motor/audio/mixar.py audio/epNN render/epNN_mix.wav episodios/epNN`.

## Mudou o motor? Prove que nada quebrou

```bash
# antes da mudança, dentro da pasta preparada do filme (render/<slug>/ ou episodios/epNN/)
node <motor>/qa/quadros.mjs gravar /tmp/ref-epNN 24
# depois da mudança, prepare a pasta de novo e compare
node <motor>/qa/quadros.mjs comparar /tmp/ref-epNN 24
```

Em 2026-11-12, na unificação, os 6 episódios do Tico, o ep05 orgânico da branch `tico/ep05-v2` e os templates ilustrado e chat ficaram com todos os quadros iguais aos de antes. A mixagem e a sincronia do Tico (ep05) e do apagão v2 também ficaram iguais byte a byte.

## Produção rápida e aprovação delegada

Ver [FLUXO-RAPIDO.md](FLUXO-RAPIDO.md). `produzir.mjs` executa rascunho/gate, master/QA leve e, com `--entrega`, a finalização automática autorizada. `finalizar.mjs` registra o aceite com hash. Nenhuma mudança no rig, cenários ou desenho.
