# Template: caixa de texto

**Estado:** especificado, ainda sem código. Referência: o relato de 77 s que o João enviou.

## Ideia

Uma caixa de texto em tela cheia revela a história aos poucos, no ritmo da fala. A tela quase não muda.

## Requisitos

- **Entrada:** os mesmos `falas.js` e `video.js` do chat, sem o campo `lado`.
- **Revelação:** palavra por palavra, com a mesma regra do chat. Quando a caixa enche, o texto sobe ou a caixa troca, a definir no teste.
- **Gancho:** fala com `inteiro: true`, visível desde o primeiro quadro.
- **Destaque:** palavras-chave coloridas, pelo campo `destaque`.
- **Corte final:** aviso de "Parte 2", quando houver.
- **QA:** declara `window.HOLDS` como o chat e respeita a área segura de `docs/METODO.md`.

## Para implementar

Copie `motor/templates/chat/` e reaproveite `medir()` e `rolagem()` de `chat.js`. Valide com um roteiro de 15 a 20 s antes de usar em vídeo real.
