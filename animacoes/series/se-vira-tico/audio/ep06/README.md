# Fontes sonoras preservadas do EP6

`fontes.json` cataloga os 53 áudios únicos dos sete pacotes antigos. Cada arquivo é armazenado uma vez. Os WAVs usam gzip, sem reconversão de áudio; os MP3s mantêm seus bytes. Todos possuem SHA-256 do original. Os pacotes ZIP foram retirados da árvore ativa após esta preservação.

Na raiz da série:

```bash
node ../../motor/audio/restaurar-fontes.mjs audio/ep06/fontes.json render/ep06-restaurado
```

O pacote padrão é `ep06_fontes.zip`, cujo roteiro corresponde ao EP6 final. Para recuperar uma variante, passe o nome do pacote como terceiro argumento. Os diretórios originais são preservados dentro do destino, incluindo `audio/master.wav`. Não há API, gasto ou geração de voz nesta recuperação.

A cópia integral anterior à limpeza está fora do repositório em `C:/Users/joaot/Projetos/oca-studio-backups/antes-limpeza-4b2fae3.zip`; o mesmo estado está no histórico Git em `4b2fae3`.
