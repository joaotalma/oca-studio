# Escreve as cenas SVG dos vídeos do canal de filmes (template filmes).
# Uso: python -I motor/desenhar-filmes.py <slug>   (depois: node motor/desenhar-cenas.mjs series/misterios-do-brasil/roteiros/<slug>)
# Cada filme é uma função que devolve a lista de cenas, na ordem de cena01, cena02...
# Estética pedida pelo João em 2026-11-07: câmera perto, rosto mudando de corte em corte e tela cheia.
import importlib.util, os, sys

pasta = os.path.dirname(os.path.abspath(__file__))
def carregar(nome, arq):
    spec = importlib.util.spec_from_file_location(nome, os.path.join(pasta, arq))
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m
c = carregar('lib', 'cenas-lib.py')
f = carregar('filmes', 'cenas-filmes.py')
L, P = c.L, c.pessoa
FONTE = 'font-family="Arial Narrow,Arial" font-weight="700"'

# Enquadramentos do "você" (x, y, escala). Olhos do personagem em (220, 244) no desenho original.
enquadra = lambda cx, olho_y, e: (cx - 220 * e, olho_y - 244 * e, e)
ROSTO_PERTO = enquadra(540, 950, 4.6)   # o rosto enche a tela
ROSTO = enquadra(540, 1030, 2.6)        # rosto e ombros
MEIO = enquadra(540, 1000, 2.0)         # da cintura para cima
CANTO = enquadra(800, 1330, 1.9)        # embaixo à direita, deixa o alto esquerdo livre para o painel
OLHO = enquadra(540 + 32 * 9, 900, 9)   # close extremo no olho

def voce(q, rosto, pid='p', flip=False):
    '''O personagem com a expressão da cena. desenhar-cenas.mjs lê o comentário e troca o rosto.'''
    tx, ty, e = q
    # O pivô (os pés) é onde o boneco respira e balança no template filmes.
    return f'<!--rosto:{rosto}--><!--pivo:{tx + 220 * e:.0f},{ty + 900 * e:.0f}-->' + P(*q, qual='frente', pid=pid, flip=flip)

FRENTE = '<!--F-->'  # sem personagem: o que vem depois flutua na frente do fundo

# --- Ícones e peças genéricas --------------------------------------------
def icone_avancar(x, y, s=1, cor='#ffb347'):
    return f'<g transform="translate({x} {y}) scale({s})" fill="{cor}"><path d="M-60 -45 L0 0 L-60 45 Z M0 -45 L60 0 L0 45 Z"/></g>'
def icone_pausa(x, y, s=1, cor='#7fd8ff'):
    return f'<g transform="translate({x} {y}) scale({s})" fill="{cor}"><rect x="-45" y="-50" width="30" height="100" rx="6"/><rect x="15" y="-50" width="30" height="100" rx="6"/></g>'
def brilho(x, y, s=1, cor='#fff6d8'):
    return f'<path transform="translate({x} {y}) scale({s})" d="M0 -40 Q6 -6 40 0 Q6 6 0 40 Q-6 6 -40 0 Q-6 -6 0 -40 Z" fill="{cor}"/>'
def brilhos(*pontos, cor='#fff6d8'):
    return '<g filter="url(#brilho)">' + ''.join(brilho(x, y, s, cor) for x, y, s in pontos) + '</g>'
def balao(x, y, texto, cor='#fff6d8', tinta='#c0392b', e=1, r=0):
    return (f'<g transform="translate({x} {y}) rotate({r}) scale({e})"><path d="M-170 -90 Q-170 -130 -130 -130 H130 Q170 -130 170 -90 V40 Q170 80 130 80 H-20 L-80 140 L-60 80 H-130 Q-170 80 -170 40 Z" fill="{cor}" {L}/>'
            f'<text x="0" y="15" text-anchor="middle" {FONTE} font-size="110" fill="{tinta}">{texto}</text></g>')
def raiva(x, y, s=1):
    return f'<g transform="translate({x} {y}) scale({s})" stroke="#ff4d4d" stroke-width="14" stroke-linecap="round" fill="none"><path d="M-40 -10 Q-20 -10 -10 -40 M10 -40 Q20 -10 40 -10 M40 10 Q20 10 10 40 M-10 40 Q-20 10 -40 10"/></g>'
def velocidade(y0, n=6, cor='#fff6d8'):
    return '<g stroke-linecap="round" opacity=".7">' + ''.join(f'<path d="M{(k * 173) % 900} {y0 + k * 70} h{180 + (k * 61) % 220}" stroke="{cor}" stroke-width="{10 - k % 3 * 3}"/>' for k in range(n)) + '</g>'
def suor(x, y, s=1):
    return f'<path transform="translate({x} {y}) scale({s})" d="M0 -40 Q30 0 0 30 Q-30 0 0 -40 Z" fill="#9fd8ff" {L}/>'
def coracao(x, y, s=1, cor='#ff5a7a'):
    return f'<path transform="translate({x} {y}) scale({s})" d="M0 30 C-60 -10 -40 -60 0 -30 C40 -60 60 -10 0 30 Z" fill="{cor}" {L}/>'
def estrela(x, y, s=1, cor='#ffd27a'):
    return f'<path transform="translate({x} {y}) scale({s})" d="M0 -50 L14 -16 L50 -14 L22 8 L32 44 L0 24 L-32 44 L-22 8 L-50 -14 L-14 -16 Z" fill="{cor}" {L}/>'

def controle(x=540, y=960, e=1, rot=-12, luz=True, quebrado=False):
    '''Controle remoto universal genérico: corpo escuro, botões e um botão de avançar que acende.'''
    s = f'<g transform="translate({x} {y}) rotate({rot}) scale({e})">'
    if luz:
        s += '<ellipse cx="0" cy="-60" rx="170" ry="260" fill="#ffb347" opacity=".3" filter="url(#desfoco)"/>'
    s += f'<rect x="-80" y="-250" width="160" height="500" rx="46" fill="#1a1424" {L}/>'
    s += '<rect x="-80" y="-250" width="30" height="500" rx="15" fill="#ffd9a0" opacity=".25"/>'
    s += '<circle cx="0" cy="-205" r="12" fill="#ff4d4d"/>'
    for i in range(3):
        for j in range(3):
            s += f'<circle cx="{-42 + j * 42}" cy="{70 + i * 46}" r="15" fill="#3a2f4a" stroke="#0b0712" stroke-width="4"/>'
    cor = '#7a6a8a' if quebrado else '#ffb347'
    s += f'<circle cx="0" cy="-80" r="56" fill="{cor}" stroke="#0b0712" stroke-width="6"/>' + icone_avancar(0, -80, .55, '#2a1424')
    if quebrado:
        s += '<path d="M-80 -20 L-20 10 L-40 40 L30 70 L10 110 L80 140" stroke="#0b0712" stroke-width="10" fill="none"/>'
        s += '<g filter="url(#brilho)">' + brilho(70, -10, .7, '#ffd27a') + brilho(-70, 100, .5, '#7fd8ff') + '</g>'
    elif luz:
        s += '<circle cx="0" cy="-80" r="80" fill="#ffb347" opacity=".4" filter="url(#desfocoLeve)"/>'
    return s + '</g>'

def presente(x=780, y=1180, e=1, aberto=False):
    tampa = '<g transform="translate(-60 -60) rotate(-25)">' if aberto else '<g>'
    return (f'<g transform="translate({x} {y}) scale({e})"><ellipse cx="0" cy="-60" rx="220" ry="180" fill="#ffb347" opacity=".35" filter="url(#desfoco)"/>'
            f'<rect x="-120" y="-120" width="240" height="180" fill="#c0566a" {L}/><rect x="-20" y="-120" width="40" height="180" fill="#ffd27a" {L}/>'
            f'{tampa}<rect x="-140" y="-170" width="280" height="60" fill="#d9707f" {L}/><rect x="-20" y="-170" width="40" height="60" fill="#ffd27a" {L}/>'
            f'<path d="M0 -170 Q-90 -260 -70 -190 Q-60 -170 0 -170 Q60 -170 70 -190 Q90 -260 0 -170 Z" fill="#ffd27a" {L}/></g></g>')

def calendario(x, y, r, n, e=1, desfoco=False):
    filtro = ' filter="url(#desfocoLeve)"' if desfoco else ''
    return (f'<g transform="translate({x} {y}) rotate({r}) scale({e})"{filtro}><rect x="-110" y="-130" width="220" height="260" rx="10" fill="#f3e6cf" {L}/>'
            f'<rect x="-110" y="-130" width="220" height="70" rx="10" fill="#c0566a" {L}/>'
            f'<text x="0" y="80" text-anchor="middle" {FONTE} font-size="120" fill="#2a1424">{n}</text></g>')

def relogio(x, y, e=1, h=-60, m=120):
    return (f'<g transform="translate({x} {y}) scale({e})"><circle r="120" fill="#f3e6cf" {L}/><circle r="95" fill="none" stroke="#c0566a" stroke-width="6"/>'
            f'<path d="M0 0 L0 -60" transform="rotate({h})" stroke="#2a1424" stroke-width="14" stroke-linecap="round"/><path d="M0 0 L0 -88" transform="rotate({m})" stroke="#2a1424" stroke-width="8" stroke-linecap="round"/>'
            '<circle r="10" fill="#2a1424"/></g>')

def papeis(x, y, n=6, e=1):
    s = f'<g transform="translate({x} {y}) scale({e})">'
    for k in range(n):
        s += f'<g transform="translate({(k % 2) * 14 - 7} {-k * 34}) rotate({(k * 7) % 11 - 5})"><rect x="-150" y="-26" width="300" height="40" fill="#f3e6cf" {L}/></g>'
    return s + '</g>'

def caneca(x, y, e=1):
    return (f'<g transform="translate({x} {y}) scale({e})"><path d="M60 -60 Q120 -60 120 0 Q120 50 60 50" stroke="#0b0712" stroke-width="20" fill="none"/>'
            f'<rect x="-70" y="-90" width="140" height="170" rx="18" fill="#7fd8ff" {L}/><path d="M-30 -120 Q-10 -150 -30 -180 M20 -120 Q40 -150 20 -180" stroke="#fff6d8" stroke-width="8" fill="none" opacity=".7"/></g>')

def laptop(x, y, e=1):
    return (f'<g transform="translate({x} {y}) scale({e})"><rect x="-200" y="-260" width="400" height="260" rx="16" fill="#1a1424" {L}/><rect x="-175" y="-235" width="350" height="210" fill="#7fd8ff" opacity=".55"/>'
            f'<path d="M-140 -190 H100 M-140 -150 H60 M-140 -110 H120 M-140 -70 H20" stroke="#16224f" stroke-width="12"/><path d="M-250 0 H250 L220 40 H-220 Z" fill="#3a2f4a" {L}/></g>')

def claquete(x, y, e=1, r=-10):
    listras = ''.join(f'<path d="M{-180 + k * 80} -150 l50 0 l-40 60 l-50 0 Z" fill="#f3e6cf"/>' for k in range(5))
    return (f'<g transform="translate({x} {y}) rotate({r}) scale({e})"><rect x="-200" y="-90" width="400" height="260" rx="10" fill="#1a1424" {L}/>'
            f'<g transform="rotate(-14 -200 -90)"><rect x="-200" y="-150" width="400" height="60" fill="#1a1424" {L}/>{listras}</g>'
            f'<path d="M-170 0 H170 M-170 70 H170" stroke="#f3e6cf" stroke-width="6" opacity=".7"/></g>')

def rolo_filme(y, r=-8):
    furos = ''.join(f'<rect x="{-40 + k * 90}" y="-60" width="40" height="22" rx="4" fill="#0b0712"/><rect x="{-40 + k * 90}" y="40" width="40" height="22" rx="4" fill="#0b0712"/>' for k in range(14))
    quadros = ''.join(f'<rect x="{-20 + k * 180}" y="-30" width="150" height="62" fill="#5a2a5e" opacity=".8"/>' for k in range(7))
    return f'<g transform="translate(-60 {y}) rotate({r})"><rect x="-80" y="-75" width="1400" height="150" fill="#1a1424" {L}/>{quadros}{furos}</g>'

def holofotes():
    return ('<path d="M120 1920 L380 0 H560 Z" fill="url(#cone)" opacity=".45"/><path d="M960 1920 L700 0 H520 Z" fill="url(#cone)" opacity=".45"/>')

def pipoca(x, y, e=1):
    listras = ''.join(f'<path d="M{-90 + k * 45} -100 L{-70 + k * 35} 130" stroke="#f3e6cf" stroke-width="22"/>' for k in range(5))
    milhos = ''.join(f'<circle cx="{-90 + (k * 37) % 180}" cy="{-120 - (k * 23) % 60}" r="{26 + k % 3 * 6}" fill="#fff4dc" {L}/>' for k in range(9))
    return (f'<g transform="translate({x} {y}) scale({e})">{milhos}<path d="M-120 -110 H120 L90 140 H-90 Z" fill="#c0392b" {L}/>{listras}'
            f'<path d="M-120 -110 H120 L90 140 H-90 Z" fill="none" {L}/></g>')

def carro(x, y, e=1, cor='#c0566a'):
    return (f'<g transform="translate({x} {y}) scale({e})" {L}><path d="M-200 -40 Q-200 -110 -150 -120 L-110 -200 Q-100 -220 -70 -220 H70 Q100 -220 110 -200 L150 -120 Q200 -110 200 -40 V10 H-200 Z" fill="{cor}"/>'
            '<path d="M-92 -125 L-65 -190 H65 L92 -125 Z" fill="#16224f"/><circle cx="-120" cy="10" r="44" fill="#14101c"/><circle cx="120" cy="10" r="44" fill="#14101c"/>'
            '<rect x="-190" y="-80" width="50" height="30" fill="#fff6d8"/><rect x="140" y="-80" width="50" height="30" fill="#fff6d8"/></g>')

def sala(tv=True):
    s = f.ceu('noite') + '<rect width="1080" height="1920" fill="#1d1033" opacity=".6"/>'
    if tv:  # sem TV, o alto esquerdo fica livre para o painel de notas
        s += f'<rect x="60" y="260" width="300" height="420" fill="#2b1650" {L}/><rect x="90" y="290" width="240" height="360" fill="#5a2a5e"/>' + estrela(210, 470, 1.6)
    s += f'<g transform="translate(980 1130)"><path d="M0 0 V-420" stroke="#14101c" stroke-width="14"/><path d="M-90 -420 H90 L60 -540 H-60 Z" fill="#ffd27a" {L}/><ellipse cy="-380" rx="200" ry="240" fill="#ffd27a" opacity=".3" filter="url(#desfoco)"/></g>'
    s += f'<g transform="translate(110 1240)">' + ''.join(f'<ellipse cx="{dx}" cy="{dy}" rx="40" ry="90" transform="rotate({r} {dx} {dy})" fill="#2f6b38" {L}/>' for dx, dy, r in [(-30, -150, -25), (30, -160, 20), (0, -200, 0)]) + f'<path d="M-60 -60 H60 L45 60 H-45 Z" fill="#b5532f" {L}/></g>'
    if tv:
        s += f.tela_tv(icone_avancar(540, 760, 1.1, '#fff6d8'), 540, 760, 620, 400)
    return s

def sofa(y=1560):
    return (f'<rect x="-40" y="{y}" width="1160" height="200" rx="60" fill="#5a2a5e" {L}/><rect x="-40" y="{y + 140}" width="1160" height="400" fill="#2b1650" {L}/>'
            f'<rect x="80" y="{y - 30}" width="220" height="150" rx="40" fill="#c0566a" {L}/>')

def placar(x, y, w, h):
    '''Moldura de painel vazia: o número vem do template (hud), esta peça só dá o lugar dele na cena.'''
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="28" fill="#0b0712" opacity=".55" stroke="#7fd8ff" stroke-width="6"/>'
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="28" fill="none" stroke="#7fd8ff" stroke-width="18" opacity=".25" filter="url(#desfocoLeve)"/>')

REFLEXO_AVANCAR = f.reflexo('<rect width="100" height="100" fill="#1d1033"/><circle cx="50" cy="55" r="40" fill="#ffb347" opacity=".35"/>'
                            '<path d="M22 32 L48 55 L22 78 Z M48 32 L74 55 L48 78 Z" fill="#ffd27a"/>')
REFLEXO_SOL = f.reflexo('<rect width="100" height="100" fill="#5a2a5e"/><rect y="55" width="100" height="45" fill="#ff7a4a"/><circle cx="70" cy="58" r="16" fill="#fff6d8"/>')
REFLEXO_TV = f.reflexo('<rect width="100" height="100" fill="#16224f"/><rect x="18" y="28" width="64" height="44" fill="#7fd8ff"/>')
ESCURECE = '<rect width="1080" height="1920" fill="#0b0712" opacity=".3"/>'

def click():
    tarde = lambda sx=820, sy=1150, sr=520: f.ceu('tarde') + f.sol(sx, sy, sr)
    return [
        # 01 gancho: rosto bem perto, surpreso, com o controle aceso refletido nos olhos.
        tarde(860, 1350) + voce(enquadra(540, 1240, 2.6), 'surpreso') + controle(850, 1640, 1.25, -18) + brilhos((200, 760, 1.2), (930, 980, .8), (130, 1300, .6))
        + f.silhuetas_frente((60, 1990, 220)) + REFLEXO_AVANCAR,
        # 02 briga: bravo, com balão de palavrão e o ícone de pausar congelando a cena.
        f.ceu('noite') + '<rect width="1080" height="1920" fill="#5a2a5e" opacity=".5"/>' + voce(ROSTO, 'bravo') + raiva(860, 700, 1.4)
        + balao(300, 560, '#@%!', e=1.1, r=-6) + f'<g filter="url(#brilho)">{icone_pausa(760, 420, 1.8)}</g>' + '<rect width="1080" height="1920" fill="#7fd8ff" opacity=".12"/>',
        # 03 trânsito: sorriso, carros parados e linhas de velocidade do avanço.
        tarde(540, 1100, 460) + f.fundo_desfocado(carro(250, 1300, 1.3, '#2f3f86') + carro(860, 1250, 1.2, '#c0566a') + carro(560, 1150, .8, '#ffb347'))
        + voce(MEIO, 'sorriso') + velocidade(380) + f'<g filter="url(#brilho)">{icone_avancar(780, 520, 1.7)}</g>',
        # 04 "parece perfeito": sorriso de perto, brilhos e o sol batendo de lado.
        tarde(900, 900, 700) + voce(ROSTO_PERTO, 'sorriso') + brilhos((170, 520, 1.6), (900, 420, 1.1), (950, 1500, .9), (120, 1350, .7)) + REFLEXO_SOL,
        # 05 o controle dispara: luz vermelha, rastro de avanço e suor.
        f.ceu('noite') + '<rect width="1080" height="1920" fill="#c0392b" opacity=".18"/>' + FRENTE + controle(540, 1000, 2.3, -10)
        + f.holograma([('▶▶', 230, 500, 150), ('▶▶', 820, 420, 120), ('▶▶', 880, 1500, 100), ('▶▶', 200, 1450, 90)], '#ff8a6a') + f.silhuetas_frente((980, 1990, 280)),
        # 06 close extremo no olho assustado, com o avançar refletido.
        '<rect width="1080" height="1920" fill="#c58a63"/>' + '<!--sempisca-->' + voce(OLHO, 'assustado') + REFLEXO_AVANCAR + suor(880, 520, 2.2)
        + f'<g filter="url(#brilho)" opacity=".7">{icone_avancar(170, 1560, .9, "#ff8a6a")}{icone_avancar(900, 1650, .7, "#ff8a6a")}</g>',
        # 07 título: claquete, rolo de filme, holofotes, pipoca e o nome do filme em texto (sem logo nem pôster).
        f.ceu('noite') + holofotes() + FRENTE + rolo_filme(1500, -8) + claquete(300, 1240, 1.1, -12) + pipoca(820, 1260, 1.2)
        + c.texto('CLICK', 720, 300, '#fff6d8') + c.texto('2006', 880, 130, '#ffb347') + brilhos((140, 420, 1), (950, 380, 1.2), (900, 960, .7)),
        # 08 sem tempo: cansado na mesa, papelada, café e relógio.
        f.ceu('noite') + f'<rect x="620" y="260" width="380" height="520" fill="#16224f" stroke="#0b0712" stroke-width="16"/><circle cx="900" cy="400" r="40" fill="#fff6d8"/>'
        + relogio(250, 520, 1.1, 40, 300) + voce(MEIO, 'triste') + f'<rect x="-20" y="1460" width="1120" height="500" fill="#5a3a2c" {L}/>'
        + papeis(250, 1450, 7, 1.1) + caneca(860, 1440, 1) + laptop(560, 1470, .9) + suor(720, 760, 1.3),
        # 09 o presente: surpreso, a caixa abrindo e o controle saindo com luz.
        tarde(540, 1300, 600) + voce(ROSTO, 'surpreso') + presente(540, 1640, 1.6, aberto=True) + controle(560, 1250, .9, 12)
        + brilhos((250, 1150, 1.2), (850, 1100, 1), (540, 900, .7), (180, 700, .6)),
        # 10 o controle aprende: AUTO e os atalhos em brilho frio.
        f.ceu('noite') + f.holograma([('▶▶', 300, 520, 140), ('▶▶', 760, 420, 110), ('▶▶', 860, 760, 90), ('▶▶', 210, 900, 80), ('AUTO', 540, 300, 130)])
        + FRENTE + controle(540, 1100, 2.1, -6) + f.silhuetas_frente((960, 2000, 300)),
        # 11 desconfiado de perto, com os atalhos girando em volta do rosto.
        f.ceu('noite') + f.sol(540, 900, 600).replace('url(#sol)', 'url(#sol)" opacity=".4') + voce(ROSTO_PERTO, 'desconfiado')
        + f.holograma([('▶▶', 140, 520, 100), ('▶▶', 950, 640, 90), ('▶▶', 120, 1500, 80), ('?', 940, 1420, 160)]),
        # 12 a vida pulando: calendários voando contra o sol (sépia vem de falas.js).
        tarde(540, 1150, 700) + voce(enquadra(540, 1150, 1.1), 'assustado')
        + ''.join(calendario(x, y, r, n, e, d) for x, y, r, n, e, d in [(200, 520, -18, 12, 1.1, False), (840, 380, 14, 3, 1.3, False), (660, 760, -6, 27, .7, True), (140, 1150, 22, 8, .9, True), (920, 1180, -20, 19, 1, False), (380, 300, 8, 31, .6, True), (880, 1650, 12, 25, 1.2, False)])
        + f.silhuetas_frente((120, 2000, 260)),
        # 13 o tempo passando: rosto triste de perto, relógios girando.
        tarde(200, 800, 600) + voce(ROSTO_PERTO, 'triste') + relogio(170, 480, .9, 200, 20) + relogio(930, 1350, .8, 90, 330) + relogio(880, 380, .5, 10, 150),
        # 14 notas: o "você" com pipoca no canto, olhando o painel; o número vem do template.
        sala(tv=False) + placar(40, 280, 600, 720) + voce(CANTO, 'desconfiado') + pipoca(560, 1640, 1.1) + sofa(1700),
        # 15 Nota Plotline: mesmo canto, agora sério, com estrelas apagadas.
        sala(tv=False) + placar(40, 280, 600, 280) + voce(CANTO, 'triste')
        + ''.join(estrela(110 + k * 110, 680, .9, '#ffd27a' if k < 3 else '#3a2f4a') for k in range(5)) + sofa(1700),
        # 16 veredito: bravo, controle quebrado; o carimbo NÃO VALE vem do template.
        f.ceu('noite') + f.sol(980, 1500, 380) + voce(ROSTO, 'bravo') + controle(820, 1560, 1.2, 25, luz=False, quebrado=True) + raiva(180, 640, 1.2) + ESCURECE,
        # 17 "mas se você gosta de comédia que emociona": sorriso, corações e pipoca.
        tarde(540, 1200, 600) + voce(ROSTO, 'sorriso') + pipoca(860, 1600, 1.1)
        + coracao(170, 620, 1.6) + coracao(920, 520, 1.2) + coracao(230, 1350, 1) + brilhos((540, 420, 1), (980, 1050, .7)),
        # 18 onde assistir: sala com TV, abajur, planta, sofá e pipoca.
        sala() + voce(enquadra(540, 1380, 1.35), 'sorriso') + sofa(1580) + pipoca(860, 1560, .9) + controle(250, 1640, .6, -70, luz=False) + REFLEXO_TV,
        # 19 fecho: aponta o controle para quem assiste, desconfiado.
        tarde(200, 1100, 560) + voce(ROSTO, 'desconfiado') + controle(760, 1520, 2.4, 22) + REFLEXO_AVANCAR
        + f'<g filter="url(#brilho)">{icone_avancar(200, 620, 1.2)}{icone_avancar(930, 1100, .8)}</g>',
    ]

FILMES = {'click': click}

if __name__ == '__main__':
    slug = sys.argv[1] if len(sys.argv) > 1 else ''
    if slug not in FILMES: sys.exit(f'uso: python -I motor/desenhar-filmes.py <{"|".join(FILMES)}>')
    d = os.path.join(pasta, '..', 'series', 'misterios-do-brasil', 'roteiros', slug, 'cenas'); os.makedirs(d, exist_ok=True)
    for velho in os.listdir(d):
        if velho.endswith('.svg'): os.remove(os.path.join(d, velho))
    for i, corpo in enumerate(FILMES[slug](), 1):
        open(os.path.join(d, f'cena{i:02d}.svg'), 'w', encoding='utf8').write(
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920"><defs>{c.DEFS}{f.DEFS_FILMES}</defs>{corpo}</svg>\n')
    print(slug, i, 'cenas')
