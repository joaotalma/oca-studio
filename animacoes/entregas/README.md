# Entregas

Os vídeos prontos para publicar, organizados como **série / episódio / plataforma**, como no método Temporada Viral: um **vídeo principal** por episódio e **uma pasta por rede**, com a capa, a legenda e o comentário fixado daquela rede.

```
entregas/
└── <série>/
    └── <episódio>/
        ├── video.mp4          o vídeo principal (o mesmo para todas as redes)
        ├── instagram/         capa.png, story.png (se houver) e postagem.md (legenda, comentário fixado, checklist)
        ├── tiktok/            (quando a rede for ativada)
        └── youtube/           (quando a rede for ativada; marcar "não é para crianças")
```

| Série | Episódios |
|---|---|
| `se-vira-tico/` | ep01 a ep06 (T1, versões oficiais iguais às do Google Drive) |
| `demitido-antes-do-gta/` | dia01 |

## Regras

- Entra aqui **só a versão aprovada** pelo João ou pelo fluxo automático que ele autorizou em 12/11/2026. Rascunhos, renders mudos e intermediários ficam em `series/*/render/`, fora do git.
- **Arquivo de até 100 MB** (limite do GitHub). Acima disso o vídeo fica fora do git, no Google Drive, e o README do episódio diz onde está. Foi o caso do piloto do apagão v2 dos Mistérios, com 263 MB.
- O `postagem.md` de cada rede é uma cópia da ficha do episódio. Se mudar uma, atualize a outra.
- Só o João publica.

Decisão do João em 2026-11-12: os vídeos finais passam a ficar no GitHub, para ele continuar de qualquer lugar.

Cada nova finalização registra `aprovacao.json` com o hash do MP4 e a origem do aceite (manual ou automático autorizado). Dia 1 teve aprovação manual explícita em 12/11/2026. Ver `../motor/FLUXO-RAPIDO.md`.
