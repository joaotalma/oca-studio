# Rig

`chars.js` é a cópia intacta do rig do Se Vira, Tico. A API (`drawChar`, `drawDog`, poses e expressões) é engine. O objeto `CHARS` e alguns ajustes por `d.key` ainda trazem o elenco da série, e esse elenco não entra em nenhum vídeo do Plotline.

Quando `series/misterios-do-brasil/canal/canal.md` definir um personagem fixo, troque `CHARS` pela ficha dele e remova os casos por `d.key`. Nenhum template funcional usa o rig hoje.

Um template passa a usar motor e rig quando tem um arquivo `.usa-rig` na pasta dele.
