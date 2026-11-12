# Como o vídeo "Na Vila do Mérito #1" foi feito

Tudo o que foi usado, em ordem, para você reproduzir ou fazer os próximos episódios.

## 1. Resultado

| Item | Valor |
|---|---|
| Título | Na Vila do Mérito #1 |
| Formato | vertical 1080×1920, 30 fps, H.264 + AAC |
| Duração | 1:42 (101,7 s), 249 palavras, 27 falas |
| Estilo | animação 2D sem rosto real, personagens de traço simples, legendas dinâmicas (1 a 3 palavras por vez, destaque em amarelo) |
| Personagens fixos | **Léo** (padeiro, camisa azul) e **Seu Armando** (dono da Casa de Pães, terno) |
| Tese | O resultado mede as condições de partida, não só o mérito |
| Narração | **não incluída** (a ser feita no ElevenLabs) |
| Versões | v1 (primeira) e v2 (corrige andar, palmas e cores) |

## 2. Ferramentas e skills

| Ferramenta | Papel | Usada? |
|---|---|---|
| **Take One** (`talsiach/take-one`) | Motor do vídeo: cada quadro é desenhado em código e renderizado em lote. Também fornece o teste de qualidade (`gate.mjs`) | **Sim, foi o motor escolhido** |
| **huashu-art-motion** (`alchaincyf/huashu-art-motion`) | Animação a partir de quadros gerados por IA | Não. Precisa do Chromium do Playwright (bloqueado no meu ambiente) e exige gerador de imagens para personagens com rosto |
| **reanimate** (`NiazMorshed2007/reanimate`) | Clona animações de sites ou vídeos para código | Não. Serve para copiar animação web, não para criar uma história |
| Google Chrome + `playwright-core` | Abre o `film.html` e captura cada quadro | Sim |
| Node.js 22 | Roda os scripts de render | Sim |
| ffmpeg | Junta as peças, codifica H.264, mistura o áudio, mede volume | Sim |
| Python 3 + numpy + scipy | Gera a trilha e os efeitos sonoros por código | Sim |
| Fonte Poppins Bold | Legendas | Sim |

Observação: as skills foram instaladas no meu ambiente de nuvem, não no seu computador.

## 3. Estrutura do projeto (`projeto_render.zip`)

| Arquivo | O que faz |
|---|---|
| `film.html` | O filme inteiro: roteiro, tempo de cada palavra, 13 cenas, câmera, legendas, cores. Expõe `FILM_DURATION`, `renderFrame(t)` e `READY` (contrato do Take One) |
| `engine.js` | Biblioteca de desenho: personagens (Léo, Armando, figurantes), caminhada, rostos, prédios, carros, plaquinha de nota, sacolas, lupa, vinheta |
| `springs.js` | Molas de animação (movimentos com "peso") |
| `audio.py` | Gera `bed.wav` (música e efeitos) a partir do `timeline.json` |
| `dump.mjs` | Gera o `timeline.json` (tempos de falas, palavras, cenas e eventos sonoros) |
| `frames.mjs` | Renderiza quadros avulsos para revisão |
| `export.mjs` / `serve.mjs` | Renderizam o vídeo |
| `timeline.json` | Tempos de cada palavra, cena e efeito |

## 4. Como cada parte foi feita

### Estilo e roteiro (copiados da referência)
- Analisei os quadros e as legendas do vídeo que você mandou. Não consegui transcrever o áudio (o download do modelo de transcrição foi bloqueado).
- Copiei a **gramática**, sem copiar personagens nem texto: cenas curtas, câmera com zoom e travelling, legenda grande na altura do peito, destaque amarelo nas palavras-chave, "virada" no final com pergunta ao espectador.
- Estrutura do roteiro: promessa de uma regra, quebra da regra com um caso concreto, prova numérica (12 pessoas por hora contra 300; aluguel zero), epílogo e pergunta final.

### Imagem
- Tudo desenhado em Canvas 2D, quadro a quadro, sem imagens prontas.
- Personagens de cabeça redonda com contorno escuro e membros por cinemática direta.
- Câmera com leve tremor de mão (zoom de 1,02 ± 0,007) e fusões de 0,16 s entre cenas.
- Legendas: tempo de cada palavra = 0,14 s + 0,038 s por letra + pausas nas pontuações. É um **modelo de ritmo de fala**, não áudio real.
- Cada quadro é uma função só do tempo (aleatoriedade com semente fixa), por isso o render é reproduzível.

### Som
- Música (acordes, baixo, arpejo) e efeitos (whoosh de cena, tique-taque, ding, trovão, chuva, batida, palmas) sintetizados em Python, sem amostras.
- Na v2, as 62 palmas caem nos instantes exatos em que cada figurante bate palma.
- Volume final: cerca de −24 LUFS, pico −5 dBFS.

### Render
```bash
npm install playwright-core
W=1080 H=1920 bash ~/.claude/skills/take-one/scripts/render-parallel.sh 30 101.7 picture.mp4 3 12
python3 audio.py
ffmpeg -i picture.mp4 -i bed.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k final.mp4
```
Rode **um render por vez**: dois renders na mesma pasta corrompem as peças.

### Teste de qualidade (`gate.mjs`)
Verifica determinismo, console sem erros, chamadas proibidas, aleatoriedade com semente, quadros idênticos e saltos entre quadros. Resultado final: 5 de 7 passam. Os 2 restantes são o quadro preto final do fade e os cortes secos entre cenas, que são intencionais.

## 5. Problemas encontrados e como foram resolvidos

| Problema | Solução |
|---|---|
| Playwright Chromium e download de modelos bloqueados (403) | Uso do Chrome do sistema; legendas conferidas por quadros |
| Quadros idênticos por muitos segundos (cena parada) | Balanço sutil dos personagens, nuvens, carros, ponteiro de segundos, zoom de mão |
| Saltos de cor em 42 s e 44 s | Escurecimento da cena noturna suavizado |
| Textos cortados e áreas vazias | Sacola maior, fontes menores, janela, prateleira e relógio nas cenas E1–E2 |
| Personagem andando para trás (v1) | Passo calculado pela distância percorrida, corpo espelhado ao andar para a esquerda |
| Palmas sem sentido (v1) | Mãos juntas na frente do peito, faíscas no toque, som sincronizado por pessoa, sem carros na plateia |
| Cores apagadas (v1) | Correção geral por pixel (saturação ×1,32, contraste ×1,07, brilho ×1,04), cena de chuva mais clara. O `ctx.filter` foi trocado porque o gate o proíbe |

## 6. Limitações atuais

- Sem narração. As legendas seguem um modelo de ritmo e vão desalinhar da voz real.
- Duração de 1:42 contra 2:00 da referência.
- O projeto foi testado só no meu ambiente Linux; não foi rodado no seu computador.
- Revisão feita por quadros amostrados e pelo gate, não assistindo ao vídeo inteiro.

## 7. Próximos passos para os episódios seguintes

1. Gerar a narração no ElevenLabs com `roteiro_narracao.txt`, preferencialmente com os tempos de cada palavra.
2. Trocar os tempos das palavras no `film.html` (`LW`/`WORDS`) pelos tempos reais, rodar `dump.mjs`, depois `audio.py` e o render.
3. Para um novo episódio, manter Léo e Armando e trocar `SCRIPT` e as cenas em `film.html`.
4. Se quiser uma versão mais favorável ao mérito, ajustar a tese antes de escrever o roteiro.

## 8. Arquivos entregues

- `na_vila_do_merito_1.mp4` (v1)
- `na_vila_do_merito_1_v2.mp4` (v2, versão atual)
- `roteiro_narracao.txt`
- `legendas.srt`
- `projeto_render.zip`
- `como_o_video_foi_feito.md` (este arquivo)
