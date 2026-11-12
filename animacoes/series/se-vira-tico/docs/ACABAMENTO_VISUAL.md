# Acabamento visual da série

Recursos aprovados no estudo do EP2, incorporados para produções futuras. Não executar a preparação novamente no EP2 publicado. As cópias antigas e o vídeo foram preservados.

## Uso

Execute scripts/preparar-film.sh para o novo episódio: acabamento.js é empacotado antes de motor.js, sem alterar a ordem dos scripts no film.html. A fonte permanece em personagens/.

No EPISODIO, defina visual: { ambiente: 'claro', lado: 'direita' }. Cada plano pode substituir com visual: { ambiente: 'noite', lado: 'esquerda' }, conforme o poste, janela ou sol da cena. visual: false conserva o desenho sem acabamento. Episódios sem a propriedade permanecem compatíveis. A sombra é menor de dia; a luz é um recorte fino nas bordas, sem uma camada amarela sobre o rosto inteiro.

- Fundo de rua: fundo: t => SerieVisual.rua(t, { ambiente: 'claro' }). Inclui fachadas, toldos, árvores, fios, juntas de calçada, drenagem, asfalto e tráfego. Não sobrepor estradaSVG junto com este fundo.
- Abertura: fundo: () => SerieVisual.abertura({ linha1: 'TÍTULO DO EPISÓDIO', linha2: 'SUBTÍTULO' }). O nome da série permanece fixo; título do episódio é dado. Reservar 2–3 s após o spoiler e antes da retomada, ajustando a linha do tempo explicitamente.
- Live: propR: { tipo: 'phone', live: { audiencia: 11 } }. Para contagem variável, usar dyn(t) retornando esse objeto. O indicador pertence ao aparelho, sem chip solto. propR: 'phone' continua válido e não mostra live. A palma fica atrás do aparelho e o polegar apenas na moldura.
- GPS: SerieVisual.gps({ pontos: [[0,1],[0,.35],[.2,.2],[1,.2]], progresso: .4, hora: '07:20', prazo: '40 min até o encontro' }). Rua e mapa usam os mesmos pontos normalizados; progresso vai de 0 a 1. Horário e prazo devem vir da história.
- Votação: em desenha(p,s,u), chamar SerieVisual.seta(u.g,52,390,s) e SerieVisual.seta(u.g,52,670,s). Movimento de 9 px, período de 1,8 s, mesma fase para as duas opções. As coordenadas seguem os cartões da ficha; mudar junto com o layout. Nada pulsa nos textos.

## Direção e verificação

Preservar a identidade do rig. Enquadrar personagens mais próximos quando a ação pedir, conferir a proporção de muros/moto/portas e reservar pausas de reação nos diálogos. Câmera e ritmo continuam decisões de cada plano, não são alterados automaticamente pelo acabamento.

Testar legibilidade do celular, mãos, direção da luz, escala em profundidade e setas sem cobrir os cartões antes de renderizar. Não corrigir retroativamente minúcias do EP2.

Referência de princípios de iluminação: Practical Lighting on Toy Story 4, Pixar/SIGGRAPH 2019 — fontes de luz ligadas ao ambiente e resposta coerente em dia/noite. A implementação é uma adaptação 2D, não simulação física 3D.
https://history.siggraph.org/wp-content/uploads/2022/09/2019-Talks-Tu_Practical-Lighting-on-Toy-Story-4.pdf
