# Peças de cena do canal de filmes (template filmes). Completa motor/cenas/cenas-lib.py, sem mudá-lo.
# Técnicas tiradas da referência de 2026-11-07: céu em degradê de fim de tarde, sol estourado,
# silhuetas desfocadas em primeiro plano, contorno de luz, poeira no ar e efeitos com brilho frio.
# Nada de personagem, cenário ou figurino de filme: os bonecos são arquétipos (ver motor/templates/ilustrado/FILMES.md).
#
# Uso: junte DEFS_FILMES às DEFS da cena e monte o corpo com as funções abaixo.

DEFS_FILMES = '''
<linearGradient id="ceuTarde" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b1650"/><stop offset=".45" stop-color="#8a3a6a"/><stop offset=".75" stop-color="#ff7a4a"/><stop offset="1" stop-color="#ffc06a"/></linearGradient>
<linearGradient id="ceuNoite" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b1f"/><stop offset=".7" stop-color="#16224f"/><stop offset="1" stop-color="#2f3f86"/></linearGradient>
<radialGradient id="sol" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff6d8"/><stop offset=".25" stop-color="#ffd27a" stop-opacity=".9"/><stop offset="1" stop-color="#ff8a3d" stop-opacity="0"/></radialGradient>
<linearGradient id="contorno" x1="0" y1="0" x2="1" y2="0"><stop offset=".7" stop-color="#ffb347" stop-opacity="0"/><stop offset="1" stop-color="#ffd9a0" stop-opacity=".9"/></linearGradient>
<filter id="desfoco" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="18"/></filter>
<filter id="desfocoLeve" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="7"/></filter>
<filter id="brilho" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
'''

def ceu(tipo='tarde'):
    '''Fundo inteiro de céu: "tarde" (roxo para laranja) ou "noite".'''
    return f'<rect width="1080" height="1920" fill="url(#{"ceuTarde" if tipo == "tarde" else "ceuNoite"})"/>'

def sol(x=820, y=980, r=420):
    '''Sol baixo e estourado, atrás do personagem: cria o contorno de luz.'''
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="url(#sol)"/><circle cx="{x}" cy="{y}" r="{r * .18}" fill="#fff6d8" filter="url(#desfocoLeve)"/>'

def fundo_desfocado(conteudo):
    '''Tudo que fica longe da câmera passa por aqui: plateia, árvores, casas.'''
    return f'<g filter="url(#desfocoLeve)" opacity=".9">{conteudo}</g>'

def silhuetas_frente(*cabecas):
    '''Cabeças escuras e muito desfocadas em primeiro plano, como na referência. Cada item: (x, y, r).'''
    cabecas = cabecas or ((150, 1900, 260), (980, 1960, 300))
    s = '<g filter="url(#desfoco)" fill="#0b0712">'
    for x, y, r in cabecas:
        s += f'<circle cx="{x}" cy="{y}" r="{r}"/><rect x="{x - r * 1.3}" y="{y + r * .6}" width="{r * 2.6}" height="{r * 2}" rx="{r * .6}"/>'
    return s + '</g>'

def contorno_luz(d):
    '''Faixa de luz na borda de uma forma (passe o mesmo path do corpo): o lado de trás acende.'''
    return f'<path d="{d}" fill="url(#contorno)" style="mix-blend-mode:screen"/>'

def sombra_contato(x=540, y=1500, rx=230):
    return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{rx * .14}" fill="#000" opacity=".45" filter="url(#desfocoLeve)"/>'

def holograma(textos, cor='#7fe9ff'):
    '''Letras ou símbolos flutuando com brilho frio. Cada item: (texto, x, y, tamanho).'''
    s = f'<g filter="url(#brilho)" fill="{cor}" font-family="Arial Narrow,Arial" font-weight="700" text-anchor="middle">'
    for t, x, y, tam in textos:
        s += f'<text x="{x}" y="{y}" font-size="{tam}">{t}</text>'
    return s + '</g>'

def reflexo(conteudo):
    '''O que o personagem está vendo, refletido na íris (precisa de olhos: 'cinema' em video.js).
    Desenhe o conteúdo num quadro de 100 x 100.'''
    return f'<defs><symbol id="reflexo" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">{conteudo}</symbol></defs>'

def tela_tv(conteudo='', x=540, y=820, w=620, h=420):
    '''Televisão genérica com brilho na sala: útil para filmes sobre mídia e vigilância.'''
    return (f'<rect x="{x - w / 2 - 30}" y="{y - h / 2 - 30}" width="{w + 60}" height="{h + 60}" rx="30" fill="#14101c" stroke="#050c0f" stroke-width="8"/>'
            f'<rect x="{x - w / 2}" y="{y - h / 2}" width="{w}" height="{h}" fill="#7fe9ff" opacity=".25"/>{conteudo}'
            f'<rect x="{x - w / 2}" y="{y - h / 2}" width="{w}" height="{h}" fill="#7fe9ff" opacity=".18" filter="url(#desfoco)"/>')
