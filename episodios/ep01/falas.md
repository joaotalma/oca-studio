# Falas do episódio 1 para o ElevenLabs

Gere um arquivo por fala, com a voz fixa de cada personagem, e salve em `audio/ep01/` com o nome da coluna "Arquivo". O formato é MP3. A coluna "Direção" serve para escolher a interpretação e não entra no texto gerado.

## Vozes

| Personagem | Falas | Caracteres | Procure por |
|---|---|---|---|
| Tico | 21 | 695 | Homem, cerca de 30 anos, voz cansada e irônica, com humor seco |
| Lua | 8 | 199 | Mulher, cerca de 30 anos, voz calorosa, com risada fácil e impaciência controlada |
| Jão | 2 | 88 | Homem, cerca de 33 anos, voz grave e firme, mas afetuosa |
| Borracheiro | 4 | 100 | Homem, cerca de 50 anos, voz rouca e resignada |

**Total:** 35 arquivos e 1082 caracteres, sem contar novas tentativas.

## Falas

| Arquivo | Quem | Texto | Direção |
|---|---|---|---|
| `01_tico.mp3` | Tico | Primeiro dia, primeira entrega. Hoje muda tudo. | Empolgado de verdade, para a câmera |
| `02_tico.mp3` | Tico | Aaah! Mas que porcaria de pneu! | Grito de raiva, curto. Será coberto pelo apito |
| `03_tico.mp3` | Tico | Por favorzinho, Jão! Três meses parado! Me empresta a Companheira? | Pedinte, meio sem graça, querendo parecer leve |
| `04_jao.mp3` | Jão | Pega. Mas qualquer prejuízo, a conta é tua. | Tranquilo de amigo; firme só em "a conta é tua" |
| `05_tico.mp3` | Tico | Fechado. | Rápido e aliviado |
| `06_jao.mp3` | Jão | Ah, e cliente é folgado: entregador não sobe. | Conselho de veterano, com carinho |
| `07_tico.mp3` | Tico | Valeu pela dica. | Distraído, já indo embora |
| `08_tico.mp3` | Tico | Como é que eu resolvo isso? | Falando sozinho, começando a se desesperar |
| `09_tico.mp3` | Tico | Perdi a entrega? Eu nem tenho nota e ela caiu. | Lendo, incrédulo; a segunda frase sai rindo de nervoso |
| `10_tico.mp3` | Tico | E o que eu faço com esse tanto de bolo? | Desanimado, olhando para o bolo |
| `11_tico.mp3` | Tico | Ah! Já sei! | Curto, com a alegria repentina da ideia |
| `12_tico.mp3` | Tico | Parabéns, meu amigo, hoje é seu grande dia! | Cantado de propósito desafinado, com animação profissional |
| `13_borracheiro.mp3` | Borracheiro | Hoje não é meu aniversário. | Confuso, sem hostilidade |
| `14_tico.mp3` | Tico | É um recado cantado. Cento e vinte reais. | Seco e formal, de quem presta um serviço |
| `15_borracheiro.mp3` | Borracheiro | Eu não pedi! E não tenho cento e vinte! | Indignado, subindo a voz |
| `16_tico.mp3` | Tico | A gente pode acertar de outro jeito. | Lento, insinuando |
| `17_borracheiro.mp3` | Borracheiro | Teu pneu furou, né? | Cansado; já entendeu tudo |
| `18_tico.mp3` | Tico | Feliz aniversário. | Sorriso amarelo, em tom de cerimônia |
| `19_borracheiro.mp3` | Borracheiro | Quem é Marlene? | De boca cheia, curioso |
| `20_tico.mp3` | Tico | Você, até o pneu ficar pronto. | Simpático, como se fosse óbvio |
| `21_tico.mp3` | Tico | Jantar no Esperança. Segunda chance. | Animado, renovado |
| `22_tico.mp3` | Tico | Boa noite, seu jantar chegou. | Educado e animado |
| `23_lua.mp3` | Lua | Sobe, por favor. | Cansada, sem paciência |
| `24_tico.mp3` | Tico | Não posso, senhora. Entregador não sobe. | Formal, orgulhoso de cumprir o aviso |
| `25_lua.mp3` | Lua | Senhora?! O elevador funciona, moço! | Ofendida com o "senhora", subindo a voz |
| `26_tico.mp3` | Tico | Meu amigo falou pra eu não subir. | Hesitante, encolhendo |
| `27_lua.mp3` | Lua | Teu amigo vai pagar meu jantar? | Irônica, afiada |
| `28_tico.mp3` | Tico | Ele falou que você ia dizer isso. | Triunfante, como se ganhasse a discussão |
| `29_lua.mp3` | Lua | Desço em dois minutos! | No limite; corta a frase e bate o interfone |
| `30_lua.mp3` | Lua | Escuta aqui, seu... | Gritando, interrompida no "seu..." |
| `31_lua.mp3` | Lua | Tico? Tico do bloco quatro? | Da fúria à surpresa, com a voz amolecendo |
| `32_tico.mp3` | Tico | Boa noite, minha senhora. | Envergonhado, tentando brincar |
| `33_lua.mp3` | Lua | Você não mudou nada. | Depois da risada, com carinho |
| `34_lua.mp3` | Lua | Espera... você é entregador? | Mais baixo, percebendo aos poucos |
| `35_tico.mp3` | Tico | Não tô pedindo ajuda. Mas... o que eu falo? | Sussurrado, olhando para os lados |

## Cuidados

- **Fala 2:** o texto só serve para dar a emoção, porque o apito de censura cobre a voz.
- **Fala 12:** é cantada. Se o ElevenLabs não entregar um canto engraçado, gere falada e com ritmo; a musiquinha entra por baixo. Se preferir, grave você mesmo.
- **Falas 23, 25, 27 e 29:** gere sem efeito. O som de interfone é aplicado depois.
- **Latidos e sons:** não gere. São sintetizados em código.
- **Pronúncia:** se errar "Jão", escreva "João" apenas no texto gerado, sem mudar o nome do arquivo.
