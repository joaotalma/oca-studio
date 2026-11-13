# Se Vira, Tico

Comédia romântica animada em 2D. A primeira temporada terminou no episódio 6; os vídeos oficiais estão em [entregas/se-vira-tico](../../entregas/se-vira-tico). O spin-off atual é [Demitido Antes do GTA](demitido-gta6/BIBLIA.md).

| Pasta | Conteúdo |
|---|---|
| episodios/ | Fontes oficiais dos seis episódios da T1 |
| demitido-gta6/ | Bíblia, guia de capas e episódios do spin-off |
| audio/ | Vozes, alinhamentos e fontes sonoras preservadas |
| docs/ | Produção, história, elenco, vozes e aprendizados da série |
| scripts/ | Comandos específicos da série; motor compartilhado em ../../motor/ |
| personagens/ | Folhas e estudo de poses do elenco |
| reconstrucao/ | Propostas de roteiro para Shorts/TikTok; não substituem os publicados |
| resultados/ | Métricas reais dos vídeos |

As dependências são instaladas uma única vez em `animacoes/`. Não rodar npm install nesta pasta. As chaves locais continuam em `.env.local`, fora do Git.

```bash
bash scripts/preparar-film.sh episodios/ep06
# Recupera o som original do pacote final sem API, custo ou reconversão:
node ../../motor/audio/restaurar-fontes.mjs audio/ep06/fontes.json render/ep06-restaurado
```

A restauração preserva os caminhos do pacote, incluindo `audio/master.wav`. Versões anteriores podem ser recuperadas pelo nome do pacote no catálogo. Todos os 53 áudios únicos foram preservados; WAVs estão comprimidos sem perda e MP3s mantêm os bytes originais.

Só João publica. Finalização e QA: [../../motor/FLUXO-RAPIDO.md](../../motor/FLUXO-RAPIDO.md). Capas do spin-off: [demitido-gta6/GUIA-CAPAS.md](demitido-gta6/GUIA-CAPAS.md).
