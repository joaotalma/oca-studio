# Produção com rascunho e aprovação final automática

Decisão do João em 12/11/2026. Mantêm-se os aceites de roteiro, voz e imagens-âncora. A aprovação do vídeo final foi delegada ao fluxo; não se pede outro aceite no fim. Só João publica.

1. Preparar o filme autocontido e a mixagem uma vez.
2. Renderizar em **540×960, 15 fps** e executar o gate completo. Conferir visual, conteúdo e direitos no rascunho; corrigir bloqueios antes do master. Não inventar holds/cortes para contornar falhas.
3. Passou? Renderizar **1080×1920, 30 fps** uma vez. O QA final verifica resolução, duração, áudio/loudness, fontes estáveis e decodifica oito amostras em resolução original. O agente olha essas amostras para detectar defeitos visíveis apenas em alta.
4. A reutilização do gate exige hashes iguais de código/assets, áudio de origem, política de QA e MP4 do rascunho. Mudou algum? Volta ao rascunho. O gate completo no master continua disponível sem `--final-leve` quando houver suspeita de defeito entre amostras.
5. Sem bloqueios editoriais, capa e postagem prontas, a finalização copia o MP4 e grava `aprovacao.json` e `STATUS.md` na entrega. Registra **aprovação automática autorizada**, não “João assistiu”. Rascunho, vídeo mudo ou QA reprovado nunca são aprovados como final. Mudou o MP4 aprovado? O hash anterior deixa de valer.

## Filme preparado (todas as séries)

A partir de `animacoes/`, para gerar rascunho e master (sem gerar nova voz ou arte):

```bash
node motor/produzir.mjs <pasta-do-filme> --audio <master.wav> --duracao 105,140 --sem-texto
```

Após olhar as amostras e concluir a revisão, o agente registra `qa-resultados/revisao-final.json` com `fonte` e `videoHash` copiados do QA final, `visual: true`, `conteudoDireitos: true`, `bloqueios: []` e `responsavel`. São evidências da revisão do agente, sem solicitar novo aceite do João. Então roda `finalizar.mjs` (abaixo). `--entrega` só finaliza se essa revisão já existir para o mesmo master; nunca a inventa.

Antes, deixar `instagram/capa.png` e `instagram/postagem.md` (ou a rede ativada) na pasta de entrega. `--rascunho` encerra depois da primeira etapa, sem aprovação final. `--origem <pasta-do-roteiro>` atualiza também o estado do roteiro ao finalizar (se o filme já está na pasta do roteiro, ela é usada como origem). Na chamada direta a `finalizar.mjs`, a origem pode ser o quinto argumento. `--saida <arquivo.mp4>` preserva o caminho habitual de saída. Para aceitar explicitamente uma revisão artística já feita, registrar em `qa.md`; não confundir isso com as medições automáticas.

O comando começa pelo rascunho a cada execução. Se ele já foi aprovado e conferido, os comandos separados permitem reutilizá-lo sem repetir trabalho:

```bash
node motor/qa/qa-video.mjs <filme> <rascunho.mp4> --rascunho --audio-origem <master.wav> --duracao 105,140 --sem-texto --relatorio <filme>/qa-resultados/qa-rascunho.json
# Renderizar o master uma vez com o export.mjs da pasta preparada, W=1080 H=1920, 30 fps, e muxar o mesmo master.wav.
node motor/qa/qa-video.mjs <filme> <final.mp4> --final-leve --qa-rascunho <filme>/qa-resultados/qa-rascunho.json --audio-origem <master.wav> --duracao 105,140 --sem-texto --relatorio <filme>/qa-resultados/qa-final.json
node motor/finalizar.mjs <filme> <final.mp4> <filme>/qa-resultados/qa-final.json entregas/<serie>/<episodio>
```

As opções editoriais e a duração devem ser iguais nas duas verificações. O registro de revisão deve ser preenchido pelo agente após a inspeção, não pela rotina de medição.

## Montagem de roteiro/template

`bash motor/montar.sh <roteiro>` usa a sequência rascunho → gate → master → QA leve. Acrescente `--entrega entregas/<serie>/<ep>` para finalizar e registrar a aprovação automática. Sem narração, gera apenas rascunho mudo. A mixagem/masterização ocorre uma vez.

## Custo e limites

O rascunho tem metade dos quadros e um quarto dos pixels por quadro: **1/8 do trabalho em pixels**, não promessa de tempo oito vezes menor. O gate existente já decodifica em cerca de 270 px. A economia principal é evitar renders completos em 1080 para descobrir erros que o rascunho encontra.

Render paralelo continua como experimento: o projeto não possuía `render-parallel.sh`. Não foi ativado sem medir memória, determinismo e ganho real no Windows. Nunca iniciar dois renders integrais concorrentes por padrão.

Amostras não garantem ausência de falhas entre quadros em 30 fps. Suspeitas exigem trecho em alta ou gate completo. A aprovação automática não substitui revisão artística, factual ou de direitos, nem publica/agende conteúdo.

## Validação desta implementação

Em 12/11/2026: 23 testes passaram; um filme sintético de 2 s percorreu render do rascunho, gate completo, render do master e QA leve (áudio −16,1 LUFS). A finalização automática, atualização do roteiro e bloqueios por falta de revisão/capa, áudio alterado e versão obsoleta têm testes próprios. No Dia 1 aprovado, quatro quadros distribuídos foram comparados antes/depois da preparação com o exportador atualizado: 4/4 idênticos. O MP4 aprovado permaneceu intacto. Não foi feito benchmark de velocidade de um episódio inteiro.
