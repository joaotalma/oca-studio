# Episódio 3: cenas

Tempos do roteiro, **PROVISÓRIOS**: ainda sem voz medida. Rascunho em `render/ep03_rascunho.mp4` (540x960, 15 fps, 67,1 s). Visual da ficha do ep. 2: luz de recorte por ambiente (`visual`), noite azulada com estrelas e silhueta de prédios, abertura da série e setas na votação.

## Horas

| Cena | Hora |
|---|---|
| Abertura e dia da Lua | 7h58 até 8h20, uma manhã contínua |
| Jão e janelas | 20h, uma noite contínua |

Dois saltos, dentro da regra de três tempos.

## Planos

| Tempo | Cenário | Quem | Pose e expressão | Notas |
|---|---|---|---|---|
| 0,0–1,0 | porta do conjunto, dia | Lua, Fiscal | feliz, com brilho | Filtro de lembrança do ep. 2 (saturação 0,1 e bordas escuras). Cartão "7h58" |
| 1,0–4,4 | porta do conjunto | Lua | celular na boca, feliz | Fala 37 do ep. 2, com o áudio original |
| 4,4–7,2 | tela do áudio | | | Filtro de lembrança |
| 7,2–8,2 | rua | Tico suado, moto | envergonhado, depois cheira a axila, depois surpreso | A cor volta em 0,45 s. Painel |
| 8,2–8,8 | rua | Tico | correndo para a direita, inclinado | Passo no lugar, deslocamento por xF |
| 8,8–10,0 | kitnet, dia | Tico suado | triste, encostado; pega o celular | Fedor |
| 10,0–11,5 | abertura | | | `SerieVisual.abertura`, "O DIA ERRADO" |
| 11,5–12,3 | kitnet, dia | Tico suado | triste, celular | |
| 12,3–13,5 | tela | | | Mensagem já enviada, sem digitar |
| 13,5–14,7 | porta do conjunto | Lua | surpresa, depois triste | |
| 14,7–15,6 | rua | Lua, ônibus | correndo, preocupada | O ônibus vai embora |
| 15,6–16,5 | escritório | Lua | correndo para a porta, ao fundo | |
| 16,5–17,4 | escritório | Lua | preocupada, depois surpresa | A porta de vidro fecha na frente dela |
| 17,4–18,6 | sala de reunião | CEO, Júnior | rindo; feliz | Aperto de mão direita com direita, braço do CEO cruzando o corpo. Telão "Metas do trimestre" |
| 18,6–20,5 | escritório | Lua, Júnior | surpresa, depois preocupada; feliz | Júnior segura a porta |
| 20,5–21,4 | escritório | Lua | forçado | "Mando." |
| 21,4–22,9 | tela | | | "Cheguei atrasada." |
| 22,9–23,8 | kitnet | Tico suado | triste | |
| 23,8–25,0 | casa do Jão, noite | Tico, Jão, moto estacionada | Tico triste, com a chave | Cartão "20h". Painel. Sem animação da moto |
| 25,0–27,9 | casa do Jão | Tico, Jão | triste; entrega a chave | |
| 27,9–30,9 | casa do Jão | Jão | de lado; bate no tanque | "TOC" |
| 30,9–33,2 | casa do Jão | Tico | triste | |
| 33,2–36,0 | casa do Jão | Tico, Jão | o perfume passa de mão; Tico borrifa e tosse | Nuvem de perfume |
| 36,0–37,6 | casa do Jão | Jão | rindo, abanando | |
| 37,6–38,4 | casa do Jão | Tico | envergonhado | |
| 38,4–39,7 | casa do Jão | Tico, Jão | Jão bate no peito dele | |
| 39,7–40,5 | tela | | | "Olha pra janela." |
| 40,5–41,2 | janela do Tico | Tico | preocupado, celular | Papel e canetão no parapeito |
| 41,2–42,5 | janelas, aberto | Tico, Lua | Lua vira para a janela | Bloco 4 e Bloco 5 |
| 42,5–57,3 | janela do Tico e da Lua, alternadas | Tico, Lua | uma expressão por papel | Nove papéis: escreve, letras aparecem no traço, levanta em 0,4 s. Uma mão visível de cada lado; o braço do rig termina atrás do papel |
| 57,3–59,1 | janela da Lua | Lua | pensando, canetão no queixo | Foco na Lua. Corte seco |
| 59,1–64,1 | janela da Lua, preto e branco | Lua | pensando | Votação com setas |
| 64,1–67,1 | sala de reunião | CEO (escala 1,5), Júnior | o Júnior se inclina; a mão do CEO no alto da cabeça dele; o gel desmancha | O braço do CEO passa atrás da cabeça do Júnior. Canto "Aceita ou agora não?" |

## Rig e cenários novos

- **Personagens:** `ceo` (cabelo grisalho, óculos, terno, gravata vermelha e crachá "CEO") e `junior` (topete com gel, camisa azul e gravata, mais baixo que o pai). A variação `despenteado: true` do Júnior desmancha o gel.
- **Cenários em `personagens/cenarios.js`:** `box` (fora do episódio), `kitnet`, `kitnetNoite`, `escritorio`, `salaReuniao`, `casaJao`, `janelas`, `janelaTico` e `janelaLua`.
- **Objetos:** `onibusSVG`, `perfumeSVG` e `nuvemPerfumeSVG`. Papel, canetão, vidro e telas ficam no `ep.js`. Fundo das janelas: bandeira preta e branca genérica para o Tico, sem escudo de time, e estante de livros para a Lua.
