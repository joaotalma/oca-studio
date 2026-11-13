# Organização enxuta — 12/11/2026

Limpeza autorizada pelo João: menos pastas e cópias, preservando fontes úteis e entregas aprovadas.

## Estrutura de trabalho

```text
oca-studio/
  animacoes/
    series/     roteiros, episódios, vozes e resultados por série
    entregas/   vídeos finais, capas e postagens aprovados
    motor/      render, templates, personagens, áudio, QA e testes
    docs/       método, plano, referências e estudo visual aprovado
```

`.agents/` e `.claude/` são apenas entradas de descoberta dos agentes. `node_modules/`, `render/` e `.tmp/` são dependências/saídas locais ignoradas; não são novas áreas de trabalho. Não retirar estes diretórios enquanto houver render ou instalação em andamento.

## Resultado na árvore versionável

| Medida | Antes | Depois |
|---|---:|---:|
| Arquivos | 3414 | 2815 |
| Pastas | 291 | 246 |
| Tamanho dos arquivos | 780.2 MB | 638.9 MB |

Redução aproximada de **141.4 MB** na árvore de trabalho versionável. Este número não representa redução do histórico Git ou do download: o histórico permanece intacto e blobs idênticos já são compartilhados pelo Git.

## O que mudou

- Templates ilustrado e filmes compartilham pasta, HTML, fonte e licença em `motor/templates/ilustrado/`. Os dois renderers conservam a estética aprovada. Chat permanece um template separado; caixa de texto é proposta em docs.
- Testes reunidos em `motor/testes/`, executados por `npm test` em animacoes/. Dependências instaladas uma vez em animacoes/.
- Regras canônicas em `docs/FLUXOS.md` e `series/se-vira-tico/docs/PRODUCAO.md`. `npm run instrucoes` gera entradas iguais para Claude e Codex. Não editar os atalhos.
- Referências achatadas em `docs/referencias/`: artigos, transcrições, análise visual e pesquisa do Tico. Reconstrução de roteiros sem a camada redundante de pasta por data.
- Estudo orgânico v4 aprovado em `docs/visual/`, autocontido. Protótipos promovidos/substituídos, scripts pontuais do EP6 e variantes encerradas saíram da árvore ativa.
- 268 camadas de imagem idênticas removidas, cerca de 90,7 MB; manifests apontam para um exemplar por projeto. Identidades de planos, falas, poses e composição não foram alteradas. A deduplicação entrou no gerador para evitar novo acúmulo.
- Um PNG do Click não referenciado pelo manifesto foi retirado. SVGs e versões de roteiro ainda relevantes foram preservados.
- Sete pacotes antigos do EP6 foram substituídos por um catálogo de **53 áudios únicos** em `series/se-vira-tico/audio/ep06/`. WAVs comprimidos sem perda; MP3s intactos. Restauração byte a byte, verificada por SHA-256, sem API ou geração de voz.
- `render/` não é segunda entrega oficial. Capas/stories aprovados continuam em entregas; provas e pacotes históricos saíram da árvore versionada. Masters locais e vozes fora do Git foram preservados.
- Pastas vazias de frentes futuras foram retiradas; automações/trading continuam no planejamento do estúdio.

## Recuperação

O estado integral anterior está no commit **4b2fae3**. Também foi criado e verificado um backup fora do repositório: `C:/Users/joaot/Projetos/oca-studio-backups/antes-limpeza-4b2fae3.zip`. Ele contém inclusive os sete pacotes originais. Não é necessário guardar novamente esses históricos no caminho de produção.

Para recuperar o pacote sonoro final do EP6, a partir de animacoes/series/se-vira-tico/:

```bash
node ../../motor/audio/restaurar-fontes.mjs audio/ep06/fontes.json render/ep06-restaurado
```

O catálogo também permite restaurar as variantes anteriores. Arquivos diferentes já existentes no destino não são sobrescritos.

## Verificações

- **34 testes automatizados passaram**, incluindo restauração, deduplicação, instruções e contratos editoriais.
- Testes específicos do visual orgânico passaram.
- **66/66 quadros idênticos**: Tico EP1–6 e Dia 1 (6 por filme), Click, chat e apagão v2 (8 por template), antes/depois da preparação na estrutura nova.
- Todos os vídeos, capas e stories aprovados mantêm os hashes anteriores.
- Os 53 áudios únicos foram conferidos; os 45 arquivos do pacote final foram restaurados e comparados aos originais.
- SDKs de Chrome e ElevenLabs resolvem a instalação compartilhada a partir da série.

A comparação de quadros é amostrada; não foi feito um novo render integral de cada episódio. A limpeza não publicou, agendou nem gastou créditos em voz.
