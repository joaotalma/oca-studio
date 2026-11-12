---
name: montar
description: Transforma roteiro aprovado e a narração do João em vídeo, usando a engine e os templates. Gera imagens-âncora ou folha de quadros, render mudo, rascunho e versão final. Use depois da aprovação do roteiro, ou quando ele entregar uma gravação.
---

# montar

## Entradas

Leia `docs/DIRECAO-VISUAL.md` e o `direcao.json` do roteiro quando houver. Não escolher câmera por alternância nem reutilizar automaticamente a arte de um roteiro reescrito. Voice Design ElevenLabs só com autorização explícita do João; configuração independente em `canal/voz-elevenlabs.json`, licença verificada e chave em ambiente. Fluxo local: `node engine/voz-elevenlabs.mjs criar` uma vez; `narrar <pasta>` para um texto autorizado. A autorização de criar uma voz original não implica que ela seja clone do João. A exceção de produção integral desta conversa está registrada no apagão v2; não eliminar os pontos de aprovação dos próximos vídeos.

- `roteiros/<slug>/` com roteiro aprovado, `falas.js` e `video.js`
- Na fase final, `audio/<slug>/narracao.wav` (ou `.m4a`, `.mp3`, `.flac`) gravada pelo João ou gerada por ele com o clone da própria voz

## Fase 1: âncoras

```bash
bash engine/montar.sh roteiros/<slug> --rascunho
```

- **Chat e caixa de texto:** gere uma folha com o primeiro quadro, a virada e o último quadro.
- **Ilustrado:** gere as imagens-âncora com a descrição imutável de `personagens/`, um enquadramento e no máximo um movimento por plano, sem fotorrealismo. Guarde os prompts em `roteiros/<slug>/assets/`.

**PARE: aprovação 2.** Mostre as âncoras e espere o sim. Depois, peça a gravação.

## Fase 2: final

```bash
bash engine/montar.sh roteiros/<slug>
```

O script corta a narração nas pausas, sincroniza, mixa, masteriza a -16 LUFS, renderiza e roda o QA. Para testes curtos, adicione `--sem-duracao`. Para música com licença anotada, adicione `--musica faixa.wav`.

## Se o corte falhar

- **Poucas pausas:** o script para e diz quantas achou. Peça uma regravação, com pausa clara entre as falas.
- **"CONFERIR" no relatório:** um corte pode ter caído no lugar errado. Ouça o trecho antes de seguir.
- **Pausas:** o ritmo entre as falas vem de `pausa` em `falas.js`, não da gravação. Para mudar uma pausa, edite o campo e remonte.

## Saídas

- `render/<slug>/<slug>.mp4`
- `roteiros/<slug>/tempos.js`

## Critério de pronto

`engine/qa-video.mjs` aprova os itens medidos, e o vídeo vai para a skill `qa`.

## Nunca

- Gerar voz sem autorização explícita e licença verificada. Quando autorizado, usar o perfil independente do Plotline e registrar o uso; fora disso, entregar render mudo identificado.
- Usar template só especificado sem antes implementar e validar com um teste curto.
