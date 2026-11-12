# Biblioteca de cenários e objetos do template ilustrado. Gera SVGs para series/misterios-do-brasil/roteiros/<slug>/cenas/.
# Uso: from cenas_lib import ... (ver motor/cenas/desenhar-lote.py). Paleta e luz seguem series/misterios-do-brasil/canal/canal.md.
OUT = '#050c0f'
L = f'stroke="{OUT}" stroke-width="7" stroke-linejoin="round"'
DEFS = '''
<linearGradient id="noite" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#071318"/><stop offset=".6" stop-color="#123840"/><stop offset="1" stop-color="#1f5a60"/></linearGradient>
<linearGradient id="chao" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14262b"/><stop offset="1" stop-color="#04080a"/></linearGradient>
<linearGradient id="cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd9a0" stop-opacity=".65"/><stop offset="1" stop-color="#ffb25d" stop-opacity="0"/></linearGradient>
<linearGradient id="met" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#17404e"/><stop offset=".5" stop-color="#6fa0a4"/><stop offset="1" stop-color="#d9c79c"/></linearGradient>
<linearGradient id="caixa" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#17404e"/><stop offset=".55" stop-color="#8a6a4a"/><stop offset="1" stop-color="#e0a35c"/></linearGradient>
<linearGradient id="luzP" x1="0" y1="0" x2="1" y2="0"><stop offset=".02" stop-color="#17404e"/><stop offset=".52" stop-color="#d4bfae"/><stop offset=".95" stop-color="#fff"/></linearGradient>
<linearGradient id="bordaP" x1="0" y1="0" x2="1" y2="0"><stop offset=".82" stop-color="#000"/><stop offset=".95" stop-color="#ffb25d"/></linearGradient>
'''

def bokeh(*c):
    s = '<g filter="url(#b12)">'
    for x, y, r, cor, o in c:
        s += f'<circle cx="{x}" cy="{y}" r="{r}" fill="{cor}" opacity="{o}"/>'
    return s + '</g>'

def predios(y=1120):
    s = '<g filter="url(#b6)">'
    for x, h, w in [(0, 620, 170), (170, 500, 130), (300, 700, 120), (640, 560, 130), (770, 760, 150), (920, 520, 160)]:
        s += f'<rect x="{x}" y="{y-h}" width="{w}" height="{h}" fill="#0c232a"/>'
        for r in range(1, h // 80):
            for c in range(w // 50):
                if (x + r * 7 + c * 5) % 3 == 0:
                    s += f'<rect x="{x+14+c*46}" y="{y-h+r*70}" width="22" height="30" fill="#ffb25d" opacity=".5"/>'
    return s + '</g>'

# Fundos
def f_palco():
    return '<rect width="1080" height="1920" fill="#071318"/><path d="M380 0 H700 L1030 1320 H50 Z" fill="url(#cone)" opacity=".6"/><ellipse cx="540" cy="1240" rx="470" ry="74" fill="#123840" stroke="#050c0f" stroke-width="8"/>' + bokeh((90, 420, 50, '#58c3c9', .35), (1000, 340, 66, '#ffb25d', .45))
def f_noite():
    return '<rect width="1080" height="1920" fill="url(#noite)"/>' + predios(1180) + bokeh((920, 420, 80, '#ffb25d', .55), (130, 620, 46, '#58c3c9', .4)) + '<rect y="1180" width="1080" height="740" fill="url(#chao)"/>'
def f_sala():
    s = '<rect width="1080" height="1920" fill="#0d2a31"/><rect x="90" y="300" width="340" height="430" fill="#071318" stroke="#050c0f" stroke-width="12"/><path d="M260 300 V730 M90 515 H430" stroke="#050c0f" stroke-width="10"/>'
    s += bokeh((200, 420, 46, '#ffb25d', .55), (340, 610, 30, '#58c3c9', .45), (950, 460, 90, '#ffb25d', .3))
    return s + '<rect y="1320" width="1080" height="600" fill="#1a1512"/><rect y="1320" width="1080" height="16" fill="#050c0f"/>'
def f_escuro():
    return '<rect width="1080" height="1920" fill="#050f13"/>' + bokeh((960, 1000, 150, '#ffb25d', .5), (220, 340, 80, '#58c3c9', .3))
def f_colonial():
    s = '<rect width="1080" height="1920" fill="url(#noite)"/>' + bokeh((880, 300, 90, '#ffd9a0', .6))
    for x, h, c in [(-20, 620, '#5a3a2c'), (190, 720, '#3f5a5c'), (400, 580, '#6b4630'), (610, 760, '#2f4c50'), (820, 640, '#5a3a2c')]:
        y = 1250 - h
        s += f'<path d="M{x} 1250 V{y+80} L{x+60} {y+40} L{x+100} {y} L{x+140} {y+40} L{x+200} {y+80} V1250 Z" fill="{c}" {L}/>'
        for r in range(1, h // 140):
            for k in [50, 120]:
                s += f'<rect x="{x+k}" y="{y+r*130}" width="34" height="60" fill="#ffb25d" opacity=".65" {L}/>'
    return s + '<rect y="1250" width="1080" height="670" fill="url(#chao)"/>'
FUNDOS = dict(palco=f_palco, noite=f_noite, sala=f_sala, escuro=f_escuro, colonial=f_colonial)

def texto(t, y=700, tam=250, cor='#ffb25d'):
    return f'<text x="540" y="{y}" text-anchor="middle" font-family="Arial Narrow,Arial" font-weight="700" font-size="{tam}" fill="{cor}" stroke="#04090c" stroke-width="10" paint-order="stroke">{t}</text>'
def X(cx=540, cy=800, r=300):
    return f'<path d="M{cx-r} {cy-r} L{cx+r} {cy+r} M{cx+r} {cy-r} L{cx-r} {cy+r}" stroke="#d9402a" stroke-width="30" stroke-linecap="round"/>'

def nota(x=540, y=800, r=0, e=1):
    return f'<g transform="translate({x} {y}) rotate({r}) scale({e})"><rect x="-140" y="-66" width="280" height="132" rx="8" fill="#6d9a78" {L}/><circle r="40" fill="#d7e4cf" {L}/><path d="M-110 -40 v18 M110 22 v18" stroke="#2f4c3a" stroke-width="10"/></g>'
def notas(n=7):
    pos = [(250, 1100, -14), (540, 1140, 8), (820, 1090, -8), (360, 960, 12), (710, 940, -16), (540, 800, 4), (220, 780, 20), (860, 760, -20)]
    return ''.join(nota(x, y, r) for x, y, r in pos[:n])
def cadeado(x=540, y=820, e=1.6):
    return f'<g transform="translate({x} {y}) scale({e})"><path d="M-90 -40 V-110 Q-90 -200 0 -200 Q90 -200 90 -110 V-40" fill="none" stroke="#a9b6b5" stroke-width="34"/><rect x="-140" y="-40" width="280" height="220" rx="24" fill="#e8b23f" {L}/><circle cy="50" r="26" fill="#1f1519"/><rect x="-10" y="55" width="20" height="60" fill="#1f1519"/></g>'
def cartao():
    return f'<g transform="translate(540 820) rotate(-8)"><rect x="-290" y="-180" width="580" height="360" rx="30" fill="url(#met)" {L}/><rect x="-290" y="-110" width="580" height="70" fill="#0a1a20"/><rect x="-240" y="0" width="90" height="70" rx="10" fill="#e8b23f" {L}/><path d="M-120 30 H230 M-240 120 H100" stroke="#0a1a20" stroke-width="16"/></g>' + X(540, 820, 240)
def celular(dentro='', x=540, y=800, e=1):
    return f'<g transform="translate({x} {y}) scale({e})"><rect x="-210" y="-420" width="420" height="840" rx="46" fill="#10181c" {L}/><rect x="-186" y="-380" width="372" height="760" rx="16" fill="#123840"/>{dentro}</g>'
def tela_saldo(num='R$ ---', trava=True):
    s = f'<text y="-200" text-anchor="middle" font-family="Arial Narrow,Arial" font-weight="700" font-size="50" fill="#a9c7c9">SALDO</text><text y="-110" text-anchor="middle" font-family="Arial Narrow,Arial" font-weight="700" font-size="88" fill="#fff">{num}</text><path d="M-140 -40 H140 M-140 40 H140 M-140 120 H60" stroke="#2a6d74" stroke-width="20"/>'
    return s + (cadeado(0, 240, .55) if trava else '')
def tela_bateria():
    return f'<rect x="-110" y="-170" width="220" height="350" rx="24" fill="none" stroke="#e9f3f2" stroke-width="16"/><rect x="-40" y="-205" width="80" height="34" fill="#e9f3f2"/><rect x="-82" y="110" width="164" height="42" fill="#d9402a"/>'
def tela_carrinho():
    return '<g transform="translate(0 -90) scale(.55)">' + carrinho(0, 0, 1) + '</g><text y="170" text-anchor="middle" font-family="Arial Narrow,Arial" font-weight="700" font-size="84" fill="#ffb25d">R$ ???</text>'
def banco():
    s = f'<g {L}><rect x="120" y="520" width="840" height="720" fill="#17404e"/><path d="M80 520 L540 260 L1000 520 Z" fill="#2a6d74"/><rect x="460" y="880" width="160" height="360" fill="#0a1a20"/></g>'
    for x in [190, 330, 690, 830]:
        s += f'<rect x="{x}" y="560" width="60" height="680" fill="url(#met)" {L}/>'
    return s + cadeado(540, 1010, .75)
def predio_gov():
    s = f'<g {L}><rect x="100" y="700" width="880" height="500" fill="#17404e"/><rect x="60" y="640" width="960" height="70" fill="#d9c79c"/><path d="M430 640 V240 H510 V640 M570 640 V240 H650 V640" fill="url(#met)"/></g>'
    for x in range(170, 960, 120):
        s += f'<rect x="{x}" y="710" width="40" height="490" fill="#d9c79c" {L}/>'
    return s + '<g filter="url(#b12)"><rect x="160" y="1230" width="760" height="70" fill="#ffd9a0" opacity=".35"/></g>'
def fabrica():
    s = f'<g {L}><path d="M90 1200 V760 L290 620 V760 L490 620 V760 L690 620 V1200 Z" fill="#17404e"/><rect x="690" y="420" width="130" height="780" fill="#2a4c52"/><rect x="820" y="880" width="170" height="320" fill="#0d2a31"/></g>'
    for x in [150, 310, 470]:
        s += f'<rect x="{x}" y="880" width="110" height="140" fill="#071318" {L}/>'
    return s + f'<g {L}><rect x="340" y="1050" width="170" height="150" fill="#3a3f42"/></g>'
def casa(x=540, y=1200, e=1.4, luz=True):
    j = '#ffcf8a' if luz else '#071318'
    return f'<g transform="translate({x} {y}) scale({e})"><path d="M-210 0 V-250 L0 -420 L210 -250 V0 Z" fill="#17404e" {L}/><path d="M-250 -240 L0 -450 L250 -240 Z" fill="#7a3f2a" {L}/><rect x="-150" y="-210" width="110" height="110" fill="{j}" {L}/><rect x="40" y="-170" width="100" height="170" fill="#0a1a20" {L}/></g>'
def casas(acesa=None):
    s = ''
    for i, (x, y, e) in enumerate([(190, 1150, .8), (540, 1190, 1), (890, 1150, .8)]):
        s += casa(x, y, e, i == acesa)
    return s
def doc(linhas=5, x=540, y=800, r=-4, e=1, carimbo=''):
    s = f'<g transform="translate({x} {y}) rotate({r}) scale({e})"><rect x="-260" y="-340" width="520" height="680" fill="#ead9b4" {L}/>'
    for k in range(linhas):
        s += f'<path d="M-200 {-240+k*90} H{200-(k%3)*70}" stroke="#123840" stroke-width="16"/>'
    if carimbo:
        s += f'<text transform="rotate(-14)" y="240" text-anchor="middle" font-family="Arial Narrow,Arial" font-weight="700" font-size="90" fill="#c8402c">{carimbo}</text>'
    return s + '</g>'
def pilha():
    s = ''
    for k in range(9):
        s += f'<rect x="{240+(k%3)*12}" y="{1180-k*62}" width="600" height="62" fill="{"#ead9b4" if k%2 else "#d9c79c"}" {L}/>'
    return s + doc(4, 540, 480, -6, .62)
def viatura(x=540, y=1100, e=1.6):
    return f'<g transform="translate({x} {y}) scale({e})" {L}><rect x="-280" y="-200" width="340" height="200" fill="#3e4f3b"/><path d="M60 -130 H180 L250 -60 V0 H60 Z" fill="#2f3f2d"/><path d="M90 -112 H170 L215 -62 H90 Z" fill="#0a1a20"/><circle cx="-180" cy="16" r="52" fill="#04080a"/><circle cx="170" cy="16" r="52" fill="#04080a"/><path d="M-280 -200 Q-110 -270 60 -200" fill="#3e4f3b"/></g>'
def terreno(figura=''):
    s = '<rect width="1080" height="1920" fill="url(#noite)"/><g filter="url(#b6)"><rect x="0" y="560" width="1080" height="400" fill="#0c232a"/></g>'
    for x in range(0, 1080, 170):
        s += f'<rect x="{x}" y="760" width="166" height="430" fill="#2a4c52" {L}/>'
    s += '<rect y="1180" width="1080" height="740" fill="#1a1a14"/><g fill="#3f6b3f">'
    for k in range(38):
        x, y = (k * 137) % 1080, 1200 + (k * 79) % 640
        s += f'<path d="M{x} {y} l18 -80 l18 80 Z"/>'
    return s + '</g>' + figura
def criatura(cor='#0c1016', olhos=True):
    s = f'<g transform="translate(600 1030)" fill="{cor}" {L}><ellipse cx="0" cy="-200" rx="110" ry="130"/><ellipse cx="-70" cy="-300" rx="26" ry="52" transform="rotate(-20 -70 -300)"/><ellipse cx="70" cy="-300" rx="26" ry="52" transform="rotate(20 70 -300)"/><path d="M-110 -80 Q-150 120 -60 200 H60 Q150 120 110 -80 Z"/></g>'
    if olhos:
        s += '<g fill="#d9402a"><ellipse cx="555" cy="825" rx="30" ry="22"/><ellipse cx="645" cy="825" rx="30" ry="22"/></g><g filter="url(#b6)" fill="#d9402a" opacity=".7"><circle cx="555" cy="825" r="44"/><circle cx="645" cy="825" r="44"/></g>'
    return s
def agachado():
    return f'<g transform="translate(600 1180)" fill="#10181c" {L}><ellipse cx="-20" cy="-250" rx="70" ry="78"/><path d="M-90 -180 Q-170 -60 -100 0 H110 Q150 -70 70 -120 Q30 -170 -30 -180 Z"/></g>'
def interrogacao():
    return texto('?', 720, 460, '#ffb25d')
def planeta():
    return f'<circle cx="540" cy="780" r="350" fill="#1f5a60" {L}/><path d="M300 600 Q420 520 520 620 Q470 720 360 720 Z M600 760 Q740 700 820 820 Q720 980 620 900 Z M360 920 Q450 880 500 980 Q440 1060 380 1020 Z" fill="#3f8c47" {L}/><path d="M700 480 A350 350 0 0 1 870 780" stroke="#ffd9a0" stroke-width="14" fill="none"/>'
def camera(x, y, r=0, e=1):
    return f'<g transform="translate({x} {y}) rotate({r}) scale({e})" {L}><rect x="-120" y="-60" width="240" height="120" rx="14" fill="url(#met)"/><circle cx="120" r="46" fill="#0a1a20"/><circle cx="120" r="16" fill="#d9402a"/><rect x="-20" y="60" width="40" height="70" fill="#22323a"/></g>'
def cameras():
    return camera(250, 500, 20) + camera(820, 560, 160) + camera(280, 900, -15, 1.1) + camera(800, 950, 195, 1.1) + f'<circle cx="540" cy="740" r="70" fill="#d9402a" opacity=".3"/>'
def carros():
    s = '<path d="M480 1180 H600 L1080 1920 H0 Z" fill="#17272c"/>'
    for x, y, e, c in [(540, 1210, .28, '#1f5a60'), (555, 1260, .42, '#b5532f'), (530, 1340, .62, '#2a6d74'), (570, 1490, 1, '#8a8f90')]:
        s += f'<g transform="translate({x} {y}) scale({e})" {L}><path d="M-200 -40 Q-200 -110 -150 -120 L-110 -200 Q-100 -220 -70 -220 H70 Q100 -220 110 -200 L150 -120 Q200 -110 200 -40 V10 H-200 Z" fill="{c}"/><path d="M-92 -125 L-65 -190 H65 L92 -125 Z" fill="#0a1a20"/><rect x="-180" y="-80" width="60" height="30" fill="#ff5a3c"/><rect x="120" y="-80" width="60" height="30" fill="#ff5a3c"/></g>'
    return s
def cerca_placa():
    s = ''
    for x in range(40, 1080, 130):
        s += f'<path d="M{x} 1190 V880 L{x+30} 840 L{x+60} 880 V1190 Z" fill="#17404e" {L}/>'
    return s + f'<rect x="300" y="480" width="480" height="300" fill="#ead9b4" {L}/><path d="M500 780 V1200 M580 780 V1200" stroke="#2a2228" stroke-width="28"/>' + texto('R$ ???', 680, 130, '#123840').replace('stroke-width="10"', 'stroke-width="0"')
def livro():
    return f'<g {L}><path d="M540 560 Q330 460 110 540 V1140 Q330 1060 540 1160 Z" fill="#ead9b4"/><path d="M540 560 Q750 460 970 540 V1140 Q750 1060 540 1160 Z" fill="#d9c79c"/></g><path d="M180 660 Q330 620 470 680 M180 780 Q330 740 470 800 M610 680 Q750 620 900 660 M610 800 Q750 740 900 780" stroke="#123840" stroke-width="14" fill="none"/>' + X(760, 870, 110)
def lampada():
    return f'<g {L}><path d="M540 360 Q300 360 300 620 Q300 750 430 860 V960 H650 V860 Q780 750 780 620 Q780 360 540 360 Z" fill="#253a40"/><rect x="430" y="960" width="220" height="130" fill="url(#met)"/></g><path d="M470 860 L510 660 H570 L610 860" stroke="#0a1a20" stroke-width="10" fill="none"/>'
def medidor():
    return f'<g {L}><rect x="190" y="360" width="700" height="880" rx="40" fill="url(#met)"/><circle cx="540" cy="730" r="280" fill="#ead9b4"/></g><path d="M540 730 L700 560" stroke="#d9402a" stroke-width="20" stroke-linecap="round"/><circle cx="540" cy="730" r="26" fill="#1f1519"/>' + texto('20%', 900, 110, '#123840').replace('stroke-width="10"', 'stroke-width="0"')
def poste():
    return f'<path d="M540 1200 V300 M340 340 H740" stroke="#10181c" stroke-width="30"/><g {L}><path d="M270 340 H410 L440 440 H240 Z" fill="#253a40"/><path d="M670 340 H810 L840 440 H640 Z" fill="#253a40"/></g>' + X(540, 640, 170)
def ar():
    s = f'<g {L}><rect x="120" y="520" width="840" height="340" rx="30" fill="#d7e4e4"/><rect x="170" y="760" width="740" height="60" fill="#0a1a20"/></g><rect x="720" y="610" width="130" height="60" fill="#0a1a20"/>'
    return s + nota(240, 1100, -10) + nota(520, 1150, 8) + nota(820, 1090, -14)
def chuveiro():
    s = f'<path d="M260 300 H540 V490" fill="none" stroke="url(#met)" stroke-width="40"/><path d="M360 500 H720 L650 650 H430 Z" fill="url(#met)" {L}/>'
    for x in range(450, 650, 50):
        s += f'<path d="M{x} 690 v110" stroke="#58c3c9" stroke-width="10" opacity=".7"/>'
    return s + f'<g transform="translate(540 1040)"><circle r="170" fill="#ead9b4" {L}/><path d="M0 0 V-120 M0 0 L80 60" stroke="#123840" stroke-width="18" stroke-linecap="round"/></g>'
def geladeira():
    return f'<g {L}><rect x="260" y="360" width="560" height="880" rx="22" fill="#d7e4e4"/><path d="M260 660 H820" /></g><rect x="300" y="500" width="30" height="110" fill="#6fa0a4"/><rect x="300" y="710" width="30" height="170" fill="#6fa0a4"/>' + f'<g transform="translate(790 620)">{"".join([])}</g>'
def loja(nome='PADARIA'):
    s = f'<g {L}><rect x="90" y="520" width="900" height="720" fill="#0d2a31"/><rect x="90" y="410" width="900" height="170" fill="#b5532f"/></g>' + texto(nome, 530, 112, '#ead9b4').replace('stroke-width="10"', 'stroke-width="6"')
    s += '<rect x="170" y="680" width="740" height="560" fill="#071318"/>'
    for y in range(690, 1240, 45):
        s += f'<path d="M170 {y} H910" stroke="#22323a" stroke-width="8"/>'
    return s
def elevador():
    return f'<g {L}><rect x="210" y="300" width="660" height="940" fill="url(#met)"/><rect x="270" y="440" width="260" height="800" fill="#17404e"/><rect x="550" y="440" width="260" height="800" fill="#123840"/></g><path d="M540 340 v70" stroke="#d9402a" stroke-width="18"/>' + f'<g transform="translate(540 370)"><circle r="44" fill="#ead9b4" {L}/><path d="M0 0 V-30 M0 0 L22 16" stroke="#123840" stroke-width="10"/></g>'
def tomada():
    return f'<g {L}><rect x="230" y="420" width="620" height="760" rx="44" fill="#d7e4e4"/></g><g fill="#0a1a20"><circle cx="540" cy="680" r="160" fill="#b9c8c9"/><circle cx="480" cy="680" r="28"/><circle cx="600" cy="680" r="28"/><circle cx="540" cy="760" r="28"/></g><path d="M540 1000 C480 1070 620 1120 540 1420" stroke="#10181c" stroke-width="26" fill="none"/>'
def navio(x, y, e, c='#5a3a2c'):
    return f'<g transform="translate({x} {y}) scale({e})" {L}><path d="M-220 0 H220 L160 110 H-160 Z" fill="{c}"/><path d="M-30 0 V-340 M90 0 V-260" stroke-width="16"/><path d="M-30 -330 Q130 -250 -30 -110 Z" fill="#ead9b4"/><path d="M90 -250 Q200 -180 90 -80 Z" fill="#d9c79c"/><path d="M-30 -340 h-70 v30 h70" fill="#d9602b"/></g>'
def mar(y=1050):
    s = f'<rect y="{y}" width="1080" height="{1920-y}" fill="#0c2c35"/>'
    for k in range(12):
        s += f'<path d="M{(k*230)%1000} {y+60+k*60} q60 -26 120 0 t120 0" stroke="#2a6d74" stroke-width="10" fill="none"/>'
    return s
def navios():
    return mar() + navio(250, 980, .9) + navio(760, 1010, 1.15) + navio(500, 880, .55) + navio(960, 830, .42)
def mapa(fronteira=False):
    s = f'<rect x="130" y="320" width="820" height="980" fill="#d9c79c" {L}/><path d="M640 320 Q560 500 650 660 Q760 760 730 930 Q680 1160 600 1300 H950 V320 Z" fill="#1f5a60"/>'
    s += '<circle cx="620" cy="760" r="24" fill="#c8402c"/><circle cx="650" cy="680" r="24" fill="#123840"/>'
    if fronteira:
        s += '<path d="M130 820 Q320 760 480 860 Q560 920 640 880" stroke="#c8402c" stroke-width="16" stroke-dasharray="34 24" fill="none"/>'
    else:
        s += '<path d="M650 660 Q720 700 640 740" stroke="#c8402c" stroke-width="12" fill="none"/>'
    return s
def palacio():
    s = f'<g {L}><rect x="140" y="720" width="800" height="480" fill="#6b4630"/><path d="M100 720 L540 500 L980 720 Z" fill="#3f5a5c"/><rect x="440" y="360" width="200" height="280" fill="#6b4630"/><path d="M440 360 L540 240 L640 360 Z" fill="#3f5a5c"/></g>'
    for x in range(200, 900, 130):
        s += f'<rect x="{x}" y="820" width="70" height="120" fill="#ffcf8a" {L}/>'
    return s
def ponte():
    s = mar(1000) + f'<path d="M0 760 Q540 620 1080 760 V880 H0 Z" fill="#6b4630" {L}/>'
    for x in [200, 540, 880]:
        s += f'<path d="M{x-90} 880 V1150 M{x+90} 880 V1150" stroke="#3a2a22" stroke-width="44"/>'
    return s
def muralha():
    s = f'<rect x="0" y="620" width="1080" height="560" fill="#5a4a3c" {L}/>'
    for x in range(0, 1080, 180):
        s += f'<rect x="{x}" y="520" width="110" height="110" fill="#5a4a3c" {L}/>'
    s += f'<g transform="translate(540 1110)" {L}><rect x="-210" y="-58" width="420" height="96" rx="40" fill="#22323a" transform="rotate(-18)"/><circle cx="-120" cy="44" r="70" fill="#3a2a22"/></g>'
    return s + bokeh((780, 500, 60, '#ff8a3d', .75), (280, 470, 50, '#ff8a3d', .6))
def passaporte():
    return f'<g transform="rotate(-6 540 800)" {L}><rect x="260" y="400" width="560" height="800" rx="26" fill="#123840"/></g><g transform="rotate(-6 540 800)"><circle cx="540" cy="720" r="130" fill="none" stroke="#e8b23f" stroke-width="12"/><path d="M410 720 H670 M540 590 V850" stroke="#e8b23f" stroke-width="8"/><path d="M380 960 H700 M430 1040 H650" stroke="#e8b23f" stroke-width="14"/></g>'
def placa(t='KANAALSTRAAT'):
    return f'<path d="M540 760 V1240" stroke="#22323a" stroke-width="44"/><rect x="60" y="480" width="960" height="280" rx="16" fill="#1f5a60" {L}/>' + texto(t, 665, 120, '#fff')
def boneco():
    return f'<g {L}><path d="M350 1240 Q300 800 430 700 H650 Q780 800 730 1240 Z" fill="#b5532f"/><circle cx="540" cy="520" r="190" fill="#d9a176"/><path d="M350 520 Q540 220 730 520 Z" fill="#20161c"/></g><circle cx="470" cy="520" r="24" fill="#20161c"/><circle cx="610" cy="520" r="24" fill="#20161c"/>' + X(540, 780, 330) + ''.join(f'<rect x="{(k*97)%1040}" y="{240+(k*71)%900}" width="20" height="20" fill="{["#e8b23f","#58c3c9","#d9602b"][k%3]}"/>' for k in range(24))
def cracha():
    return f'<rect x="170" y="520" width="740" height="540" rx="30" fill="#ead9b4" {L}/><rect x="170" y="520" width="740" height="130" fill="#b5532f" {L}/>' + texto('JAN', 930, 240, '#123840').replace('stroke-width="10"', 'stroke-width="0"')
def bola():
    s = f'<circle cx="540" cy="780" r="340" fill="#f4f4ef" {L}/>'
    s += '<path d="M540 660 L640 730 L600 850 H480 L440 730 Z" fill="#10181c"/>'
    for a, b in [(540, 660), (640, 730), (600, 850), (480, 850), (440, 730)]:
        s += f'<path d="M{a} {b} L{540+(a-540)*2.6:.0f} {780+(b-780)*2.6:.0f}" stroke="#10181c" stroke-width="12"/>'
    return s
def estadio():
    s = '<ellipse cx="540" cy="1160" rx="620" ry="190" fill="#3f8c47" stroke="#050c0f" stroke-width="10"/><path d="M0 1000 Q540 620 1080 1000 V1100 Q540 920 0 1100 Z" fill="#17404e" stroke="#050c0f" stroke-width="8"/>'
    for k in range(50):
        s += f'<circle cx="{40+(k*61)%1000}" cy="{800+(k*43)%190}" r="11" fill="{["#ffb25d","#d7e4e4","#58c3c9"][k%3]}"/>'
    return s + texto('BRA x NH', 590, 170, '#ffb25d')
def familia():
    s = ''
    for x, h, c in [(250, 460, '#1b4752'), (440, 540, '#17404e'), (640, 380, '#1f5a60'), (810, 300, '#2a6d74')]:
        y = 1240 - h
        s += f'<g fill="{c}" {L}><circle cx="{x}" cy="{y}" r="{h*.17:.0f}"/><path d="M{x-h*.21:.0f} 1240 Q{x-h*.23:.0f} {y+h*.3:.0f} {x} {y+h*.2:.0f} Q{x+h*.23:.0f} {y+h*.3:.0f} {x+h*.21:.0f} 1240 Z"/></g>'
    return s
def cerca():
    s = ''
    for x in range(0, 1080, 90):
        s += f'<path d="M{x+45} 1250 V600" stroke="#22323a" stroke-width="16"/>'
    for y in [680, 820, 960, 1100]:
        s += f'<path d="M0 {y} H1080" stroke="#a9b6b5" stroke-width="10"/>'
    return s
def etiqueta_maquina():
    return f'<g transform="rotate(-12 540 760)" {L}><path d="M290 560 H740 L820 720 V900 H360 Z" fill="#c8402c"/><rect x="430" y="610" width="280" height="110" fill="#0a1a20"/><path d="M360 900 L250 1200 H390 L470 900 Z" fill="#2a2228"/></g>' + f'<g transform="translate(840 1040) rotate(14)"><path d="M-120 -80 H120 V60 L0 110 L-120 60 Z" fill="#ead9b4" {L}/></g>' + texto('R$ +', 1090, 76, '#c8402c').replace('x="540"', 'x="840"').replace('stroke-width="10"', 'stroke-width="0"')
def moedas4():
    pos = [(310, 500, '#6d9a78'), (760, 500, '#b98a9a'), (310, 960, '#c9a267'), (760, 960, '#7f9fc0')]
    s = ''
    for k, (x, y, c) in enumerate(pos):
        s += f'<g transform="translate({x} {y}) rotate({-6+k*5})"><rect x="-200" y="-110" width="400" height="220" rx="10" fill="{c}" {L}/><circle r="62" fill="#ead9b4" {L}/></g>'
    return s
def carrinho(x=540, y=1000, e=1.6):
    return f'<g transform="translate({x} {y}) scale({e})" fill="none" stroke="#a9b6b5" stroke-width="16" stroke-linejoin="round"><path d="M-260 -210 H-190 L-120 90 H180 L230 -130 H-165"/><path d="M-90 -80 H200 M-70 10 H190 M-60 -130 L-30 90 M50 -130 V90 M140 -130 L120 90"/><circle cx="-90" cy="150" r="30" fill="#04080a"/><circle cx="160" cy="150" r="30" fill="#04080a"/></g>'
def pao():
    return f'<g {L}><ellipse cx="540" cy="880" rx="340" ry="190" fill="#c8843f"/></g><path d="M340 760 Q400 830 380 930 M500 720 Q570 800 540 960 M660 740 Q720 810 700 930" stroke="#7a4a20" stroke-width="20" fill="none"/>' + texto('R$ ?', 590, 180, '#ffb25d')
def cafe(dobro=False):
    s = f'<g {L}><path d="M300 620 H740 L690 1100 Q680 1200 520 1200 Q360 1200 350 1100 Z" fill="#f4f4ef"/><path d="M730 720 Q910 720 880 900 Q850 1000 700 1000" fill="none" stroke-width="40" stroke="#f4f4ef"/></g><ellipse cx="520" cy="640" rx="210" ry="30" fill="#3a2316"/>'
    s += '<g stroke="#d7e4e4" stroke-width="12" fill="none" opacity=".55"><path d="M450 560 q-40 -70 0 -140 t0 -130"/><path d="M590 560 q-40 -70 0 -140 t0 -130"/></g>'
    return s + (texto('x2', 960, 220, '#ffb25d') if dobro else '')
def mesa():
    return f'<rect x="60" y="1060" width="960" height="60" fill="#5a3a2c" {L}/><path d="M160 1120 V1300 M920 1120 V1300" stroke="#3a2a22" stroke-width="36"/>' + doc(4, 540, 760, -4, .7, carimbo='DÍVIDA')

def pessoa(tx, ty, e, qual='frente', pid='p', flip=False):
    tr = f'translate({tx} {ty}) scale({-e if flip else e} {e})'
    x0 = tx - 440 * e if flip else tx
    return (f'<!--pivo:{x0+220*e:.0f},{min(1920, ty+900*e):.0f}--><!--P--><mask id="{pid}" maskUnits="userSpaceOnUse" x="0" y="0" width="1080" height="1920"><use href="#{qual}" transform="{tr}" filter="url(#branco)"/></mask>'
            f'<ellipse cx="{x0+220*e}" cy="{ty+890*e}" rx="{190*e}" ry="{20*e}" fill="#000" opacity=".5" filter="url(#b6)"/>'
            f'<g mask="url(#{pid})"><use href="#{qual}" transform="{tr}"/>'
            f'<rect x="{x0}" y="{ty}" width="{440*e}" height="{960*e}" fill="url(#luzP)" style="mix-blend-mode:multiply"/>'
            f'<rect x="{x0}" y="{ty}" width="{440*e}" height="{960*e}" fill="url(#bordaP)" style="mix-blend-mode:screen"/></g><!--/P-->')
GANCHO = (30, 800, 2.3)
ROSTO = (-10, 260, 2.5)
FECHO = (40, 420, 2.3)
EM_PE = (300, 700, 1.0)
LADO = (-20, 800, 1.05)

# --- Lote 2: novos fundos e objetos ---
def arvores(y=1180, n=9):
    s = ''
    for k in range(n):
        x = (k * 127 + 40) % 1080; h = 300 + (k * 83) % 380; e = 1 + (k % 3) * .25
        s += f'<path d="M{x-14} {y} V{y-h} H{x+14} V{y} Z" fill="#2c1d15" {L}/><ellipse cx="{x}" cy="{y-h}" rx="{110*e:.0f}" ry="{130*e:.0f}" fill="{["#1f5a60","#2a6d74","#1b4752"][k%3]}" {L}/>'
    return s
def f_floresta():
    return '<rect width="1080" height="1920" fill="url(#noite)"/>' + bokeh((860, 300, 90, '#ffd9a0', .6), (160, 520, 50, '#58c3c9', .4)) + arvores() + '<rect y="1180" width="1080" height="740" fill="url(#chao)"/>'
def f_ceu():
    s = '<rect width="1080" height="1920" fill="url(#noite)"/>' + bokeh((860, 280, 110, '#ffd9a0', .75))
    for x, y, e in [(230, 420, 1), (690, 620, .8), (180, 860, .7)]:
        s += f'<g transform="translate({x} {y}) scale({e})" fill="#d7e4e4" opacity=".55"><ellipse rx="130" ry="46"/><ellipse cx="-70" cy="-26" rx="70" ry="44"/><ellipse cx="60" cy="-36" rx="84" ry="54"/></g>'
    return s + '<rect y="1200" width="1080" height="720" fill="url(#chao)"/>'
def f_mar():
    return '<rect width="1080" height="1920" fill="url(#noite)"/>' + bokeh((860, 300, 100, '#ffd9a0', .7)) + mar(1020)
def f_estrada():
    return '<rect width="1080" height="1920" fill="url(#noite)"/>' + arvores(1100, 6) + bokeh((540, 1020, 110, '#ffcf8a', .6)) + '<rect y="1100" width="1080" height="820" fill="url(#chao)"/><path d="M470 1100 H610 L1080 1920 H0 Z" fill="#3a2a22"/>'
def f_oficina():
    s = '<rect width="1080" height="1920" fill="#0d2a31"/><rect y="1320" width="1080" height="600" fill="#14262b"/>'
    for x in range(60, 1040, 190):
        s += f'<rect x="{x}" y="320" width="130" height="24" fill="#22323a"/><path d="M{x+30} 344 v90 M{x+90} 344 v60" stroke="#a9b6b5" stroke-width="10"/>'
    return s + bokeh((540, 180, 180, '#ffe2b0', .45))
def f_interior():
    return '<rect width="1080" height="1920" fill="#17404e"/><rect y="1280" width="1080" height="640" fill="#2c1d15"/><rect y="1270" width="1080" height="20" fill="#050c0f"/>' + bokeh((180, 300, 90, '#ffe2b0', .5), (920, 460, 70, '#ffb25d', .4))
FUNDOS.update(floresta=f_floresta, ceu=f_ceu, mar=f_mar, estrada=f_estrada, oficina=f_oficina, interior=f_interior, terreno=lambda: terreno())

def seringueira():
    return f'<path d="M500 1240 Q470 800 520 420 H620 Q650 800 620 1240 Z" fill="#5a3a2c" {L}/><path d="M520 760 L610 820 M520 860 L610 920" stroke="#d9c79c" stroke-width="12"/><path d="M600 960 H690 V1040 H600 Z" fill="#ead9b4" {L}/><ellipse cx="560" cy="360" rx="330" ry="240" fill="#1f5a60" {L}/>'
def seringueira_morta():
    return f'<path d="M500 1240 Q470 800 520 420 H620 Q650 800 620 1240 Z" fill="#3a2a22" {L}/><path d="M540 440 L360 260 M600 440 L780 240 M560 420 L560 180" stroke="#3a2a22" stroke-width="34" stroke-linecap="round"/>' + ''.join(f'<circle cx="{500+(k*37)%150}" cy="{560+(k*91)%600}" r="{12+k%3*6}" fill="#c9d2a0"/>' for k in range(14))
def sirene_fabrica():
    return fabrica() + f'<g {L}><path d="M710 410 h90 l30 -80 h-150 Z" fill="#c8402c"/></g>' + bokeh((750, 310, 90, '#ff8a3d', .6))
def caminhao_mudanca():
    return f'<g transform="translate(540 1150) scale(1.3)" {L}><rect x="-300" y="-260" width="400" height="260" fill="#b5532f"/><path d="M100 -180 H230 L290 -100 V0 H100 Z" fill="#123840"/><circle cx="-190" cy="20" r="56" fill="#04080a"/><circle cx="190" cy="20" r="56" fill="#04080a"/></g>'
def sol_lua():
    return f'<circle cx="540" cy="720" r="290" fill="#ffd9a0" opacity=".85"/><g filter="url(#b12)"><circle cx="540" cy="720" r="320" fill="#ffd9a0" opacity=".7"/></g><circle cx="540" cy="720" r="250" fill="#04080a"/>' + ''.join(f'<circle cx="{x}" cy="{y}" r="9" fill="#fff"/>' for x, y in [(140, 360), (920, 320), (210, 1040), (880, 980), (120, 720), (970, 680)])
def desvio():
    return sol_lua() + '<path d="M60 300 Q540 420 1020 960" stroke="#ffb25d" stroke-width="10" stroke-dasharray="30 18" fill="none"/>'
def camera_antiga(x=540, y=860, e=1.5):
    return f'<g transform="translate({x} {y}) scale({e})" {L}><rect x="-180" y="-130" width="360" height="240" fill="#3a2a22"/><circle r="84" cy="-10" fill="#0a1a20"/><circle r="40" cy="-10" fill="#17404e"/><path d="M-100 110 L-160 360 M100 110 L160 360 M0 110 V360" stroke-width="14"/></g>'
def placa_vidro():
    s = f'<rect x="210" y="360" width="660" height="820" fill="#d7e4e4" opacity=".85" {L}/>'
    for k in range(12):
        s += f'<circle cx="{270+(k*137)%540}" cy="{420+(k*197)%700}" r="10" fill="#10181c"/>'
    return s
def nuvem_grande():
    return '<g fill="#a9b6b5"><ellipse cx="540" cy="640" rx="430" ry="170"/><ellipse cx="320" cy="560" rx="210" ry="170"/><ellipse cx="760" cy="540" rx="240" ry="190"/></g>' + ''.join(f'<path d="M{170+k*90} 820 l-20 90" stroke="#58c3c9" stroke-width="10"/>' for k in range(9))
def roleta():
    s = f'<circle cx="540" cy="780" r="350" fill="#3a2316" {L}/>'
    for k in range(12):
        s += f'<path d="M540 780 L{540+330*__import__("math").cos(k*.5236):.0f} {780+330*__import__("math").sin(k*.5236):.0f} L{540+330*__import__("math").cos((k+1)*.5236):.0f} {780+330*__import__("math").sin((k+1)*.5236):.0f} Z" fill="{"#c8402c" if k%2 else "#10181c"}"/>'
    return s + f'<circle cx="540" cy="780" r="90" fill="#d9c79c" {L}/><circle cx="760" cy="600" r="24" fill="#fff"/>'
def fichas():
    s = ''
    for k, (x, y) in enumerate([(300, 1100), (520, 1120), (760, 1090), (410, 960), (650, 950), (530, 800)]):
        s += f'<g transform="translate({x} {y})"><ellipse rx="110" ry="42" fill="{["#c8402c","#ead9b4","#1f5a60"][k%3]}" {L}/><ellipse rx="66" ry="24" fill="none" stroke="#ead9b4" stroke-width="8"/></g>'
    return s
def porta_fechada(t='FECHADO'):
    return f'<rect x="210" y="360" width="660" height="880" fill="#3a2a22" {L}/><circle cx="790" cy="820" r="26" fill="#d9c79c"/><rect x="310" y="600" width="460" height="170" fill="#ead9b4" {L}/>' + texto(t, 720, min(100, int(700 / max(len(t), 1))), '#c8402c').replace('stroke-width="10"', 'stroke-width="0"')
def caca(x=540, y=720, e=1.4, r=-12):
    return f'<g transform="translate({x} {y}) rotate({r}) scale({e})" {L}><path d="M-260 0 L180 -40 L300 0 L180 40 Z" fill="url(#met)"/><path d="M-20 -30 L-130 -190 H-60 L90 -30 Z M-20 30 L-130 190 H-60 L90 30 Z" fill="#6fa0a4"/><path d="M-250 -10 L-310 -110 H-250 L-190 -20 Z" fill="#17404e"/><path d="M90 -22 Q150 -30 190 -6" stroke="#0a1a20" stroke-width="16" fill="none"/></g><g filter="url(#b6)"><ellipse cx="{x-340*e:.0f}" cy="{y+70*e:.0f}" rx="90" ry="24" fill="#ff8a3d" opacity=".85"/></g>'
def luzes_ceu():
    s = ''
    for k, (x, y, r) in enumerate([(220, 340, 36), (530, 260, 50), (830, 400, 34), (390, 580, 44), (720, 660, 56), (170, 780, 30), (930, 820, 40)]):
        s += f'<g filter="url(#b6)"><circle cx="{x}" cy="{y}" r="{r+40}" fill="#ffd9a0" opacity=".65"/></g><circle cx="{x}" cy="{y}" r="{r}" fill="#fff"/>'
    return s
def computador():
    return f'<g {L}><rect x="190" y="400" width="700" height="520" rx="30" fill="#d9c79c"/><rect x="250" y="460" width="580" height="400" fill="#071318"/><rect x="170" y="980" width="740" height="150" rx="18" fill="#c9b98a"/></g><path d="M300 540 H620 M300 620 H480" stroke="#7ff0ee" stroke-width="20"/><rect x="500" y="610" width="26" height="28" fill="#7ff0ee"/>'
def mala():
    return f'<g {L}><rect x="210" y="620" width="660" height="520" rx="30" fill="#5a3a2c"/><path d="M420 620 V520 H660 V620" fill="none" stroke-width="26"/></g>' + celular('', 540, 860, .42)
def cachoeira():
    s = f'<path d="M0 620 H1080 V880 L800 780 L620 880 L420 780 L240 880 L0 780 Z" fill="#3a2a22" {L}/>'
    for x in range(40, 1060, 70):
        s += f'<path d="M{x} {760+(x%3)*30} V1240" stroke="#d7e4e4" stroke-width="{26-(x%4)*4}" opacity=".85"/>'
    return s + '<g filter="url(#b12)"><rect y="1160" width="1080" height="150" fill="#fff" opacity=".6"/></g>'
def usina():
    s = f'<path d="M0 880 L1080 760 V1240 H0 Z" fill="#a9b6b5" {L}/>'
    for x in range(120, 1000, 150):
        s += f'<rect x="{x}" y="{920-(x/1080*120):.0f}" width="62" height="320" fill="#17404e" {L}/>'
    return s + mar(1240)
def lago():
    return mar(760) + f'<path d="M0 760 Q280 620 560 720 T1080 700 V770 H0 Z" fill="#14262b"/>'
def bomba_alcool(t='ÁLCOOL'):
    return f'<g {L}><rect x="290" y="360" width="500" height="880" rx="26" fill="url(#met)"/><rect x="340" y="420" width="400" height="260" fill="#091418"/></g><text x="540" y="540" text-anchor="middle" font-family="monospace" font-weight="700" font-size="84" fill="#e8493a">- - -</text>' + texto(t, 830, 92, '#123840').replace('stroke-width="10"', 'stroke-width="0"')
def cana():
    s = ''
    for k in range(13):
        x = 40 + k * 82
        s += f'<path d="M{x} 1240 V{540+(k*67)%220}" stroke="#3f8c47" stroke-width="26"/><path d="M{x} {620+(k*53)%180} q70 -60 120 -20 M{x} {700+(k*41)%200} q-70 -60 -120 -20" stroke="#6dbb5b" stroke-width="14" fill="none"/>'
    return s
def carro_lado(x=540, y=1130, e=1.5, c='#2a8087'):
    return f'<g transform="translate({x} {y}) scale({e})" {L}><path d="M-280 -20 Q-270 -100 -170 -110 L-90 -190 H110 L190 -110 Q290 -100 290 -20 V30 H-280 Z" fill="{c}"/><path d="M-70 -110 L-50 -170 H95 L140 -110 Z" fill="#071318"/><circle cx="-160" cy="36" r="56" fill="#04080a"/><circle cx="170" cy="36" r="56" fill="#04080a"/></g>'
def bicicleta():
    return f'<g transform="translate(540 1050)" fill="none" stroke="#a9b6b5" stroke-width="18"><circle cx="-240" cy="60" r="130"/><circle cx="240" cy="60" r="130"/><path d="M-240 60 L-60 -150 H130 L240 60 M-60 -150 L20 60 L-240 60 M20 60 L130 -150"/></g>'
def lagosta():
    return f'<g transform="translate(540 800)" {L}><ellipse rx="120" ry="290" fill="#c8402c"/><path d="M-110 -180 Q-300 -280 -280 -440 M110 -180 Q300 -280 280 -440" fill="none" stroke="#c8402c" stroke-width="40"/><ellipse cx="-290" cy="-470" rx="66" ry="96" fill="#c8402c"/><ellipse cx="290" cy="-470" rx="66" ry="96" fill="#c8402c"/><path d="M-100 -60 H100 M-112 40 H112 M-100 140 H100" stroke-width="8"/></g>'
def navio_guerra(x=540, y=1000, e=1.3):
    return f'<g transform="translate({x} {y}) scale({e})" {L}><path d="M-340 0 H340 L270 90 H-270 Z" fill="#3a4a4e"/><rect x="-130" y="-120" width="230" height="120" fill="#4f6166"/><rect x="-40" y="-210" width="70" height="90" fill="#3a4a4e"/><path d="M130 -20 L280 -60" stroke-width="22"/></g>'
def canguru():
    return f'<g transform="translate(540 800)" {L} fill="#8a6a4a"><ellipse cx="0" cy="60" rx="150" ry="220"/><ellipse cx="90" cy="-210" rx="84" ry="74"/><path d="M60 -270 L40 -390 L100 -280 Z M130 -270 L150 -390 L170 -270 Z"/><path d="M-110 200 Q-340 280 -420 180" fill="none" stroke="#8a6a4a" stroke-width="52"/></g>' + texto('AVE?', 1270, 150)
def boi():
    return f'<g transform="translate(540 980)" {L} fill="#5a3a2c"><rect x="-300" y="-180" width="560" height="280" rx="90"/><rect x="-250" y="90" width="70" height="170"/><rect x="170" y="90" width="70" height="170"/><ellipse cx="310" cy="-170" rx="110" ry="84"/><path d="M270 -240 L220 -310 M350 -240 L400 -310" stroke-width="22" fill="none"/></g>' + cerca_baixa()
def cerca_baixa():
    return ''.join(f'<path d="M{x} 1240 V1040" stroke="#3a2a22" stroke-width="20"/>' for x in range(30, 1080, 130)) + '<path d="M0 1090 H1080 M0 1160 H1080" stroke="#3a2a22" stroke-width="14"/>'
def geladeira_aberta():
    return f'<rect x="240" y="320" width="600" height="940" fill="#d7e4e4" {L}/><rect x="280" y="370" width="520" height="840" fill="#fff5dd"/>' + ''.join(f'<rect x="280" y="{y}" width="520" height="14" fill="#9fb5b6"/>' for y in [610, 850, 1070])
def carne():
    return f'<g transform="translate(540 820)" {L}><path d="M-320 -60 Q-260 -280 40 -240 Q340 -200 330 60 Q300 280 0 240 Q-300 220 -320 -60 Z" fill="#b5332f"/><path d="M-210 -60 Q-20 -180 190 -40" stroke="#ead9b4" stroke-width="30" fill="none"/></g>'
def etiqueta(t='R$'):
    return f'<g transform="translate(540 800) rotate(-6)"><path d="M-320 -160 H320 V160 H-320 Z" fill="#ead9b4" {L}/><circle cx="-270" cy="-115" r="20" fill="#071318"/></g>' + texto(t, 850, min(150, int(1000 / max(len(t), 1))), '#123840').replace('stroke-width="10"', 'stroke-width="0"')
def ilha():
    return mar(980) + f'<path d="M0 1040 Q200 620 460 660 Q740 500 1080 900 V1080 H0 Z" fill="#1f5a60" {L}/>' + ''.join(f'<ellipse cx="{120+k*130}" cy="{840-(k%3)*70}" rx="80" ry="70" fill="#17404e" {L}/>' for k in range(7))
def cobra(x=540, y=860, e=1.5):
    return f'<g transform="translate({x} {y}) scale({e})"><path d="M-260 180 C-140 40 -280 -70 -120 -130 C40 -190 60 -20 170 -70 C260 -120 240 -220 170 -220" fill="none" stroke="#050c0f" stroke-width="76" stroke-linecap="round"/><path d="M-260 180 C-140 40 -280 -70 -120 -130 C40 -190 60 -20 170 -70 C260 -120 240 -220 170 -220" fill="none" stroke="#c9a267" stroke-width="58" stroke-linecap="round"/><ellipse cx="170" cy="-226" rx="62" ry="42" fill="#c9a267" {L}/><circle cx="194" cy="-238" r="9" fill="#10181c"/><path d="M225 -224 l50 -8 M225 -224 l50 10" stroke="#c8402c" stroke-width="7"/></g>'
def barco(x=540, y=1010, e=1.4):
    return f'<g transform="translate({x} {y}) scale({e})" {L}><path d="M-300 0 H300 L220 100 H-220 Z" fill="#d7e4e4"/><rect x="-90" y="-100" width="190" height="100" fill="#17404e"/></g>'
def placa_perigo():
    return f'<path d="M540 870 V1240" stroke="#22323a" stroke-width="44"/><path d="M540 310 L900 900 H180 Z" fill="#e8b23f" {L}/>' + texto('!', 800, 390, '#10181c').replace('stroke-width="10"', 'stroke-width="0"')
def soro():
    return f'<rect x="370" y="340" width="340" height="660" rx="44" fill="#d7e4e4" {L}/><rect x="370" y="560" width="340" height="440" rx="10" fill="#6fa0a4" opacity=".6"/><path d="M540 1000 V1240" stroke="#a9b6b5" stroke-width="18"/><path d="M500 640 H580 M540 600 V680" stroke="#c8402c" stroke-width="20"/>'
def transformador():
    s = f'<rect x="240" y="580" width="600" height="600" rx="24" fill="#3a4a4e" {L}/>'
    s += ''.join(f'<rect x="{x}" y="420" width="50" height="170" fill="#a9b6b5" {L}/>' for x in [340, 515, 690])
    return s + '<g filter="url(#b12)"><ellipse cx="540" cy="420" rx="230" ry="240" fill="#ff8a3d" opacity=".9"/></g><path d="M430 560 Q440 330 540 240 Q640 340 650 560 Z" fill="#ffd166"/>'
def garrafoes():
    return ''.join(f'<g transform="translate({x} 1180)"><path d="M-90 0 V-260 Q-90 -300 -40 -310 V-370 H40 V-310 Q90 -300 90 -260 V0 Z" fill="#58c3c9" opacity=".65" {L}/></g>' for x in [190, 420, 650, 880])
def vela(x=540, y=1200, e=1.6):
    return f'<g transform="translate({x} {y}) scale({e})"><rect x="-44" y="-260" width="88" height="260" fill="#ead9b4" {L}/><path d="M0 -340 Q-40 -290 0 -262 Q40 -290 0 -340 Z" fill="#ffd166"/></g><g filter="url(#b12)"><circle cx="{x}" cy="{y-300*e:.0f}" r="130" fill="#ffb25d" opacity=".65"/></g>'
def gerador():
    return f'<g {L}><rect x="190" y="660" width="700" height="500" rx="24" fill="#c8402c"/><rect x="260" y="730" width="280" height="180" fill="#0a1a20"/><circle cx="720" cy="880" r="110" fill="#22323a"/></g><path d="M890 1000 H1080" stroke="#10181c" stroke-width="22"/><g filter="url(#b12)"><circle cx="980" cy="560" r="100" fill="#ffd9a0" opacity=".6"/></g>'
def forte():
    return mar(1120) + f'<path d="M100 1120 V720 H250 V640 H390 V720 H690 V640 H830 V720 H980 V1120 Z" fill="#6b5a4a" {L}/><rect x="480" y="880" width="130" height="240" fill="#2a2228"/>' + c_bandeira(540, 340)
def c_bandeira(x, y):
    return f'<path d="M{x} {y} V720" stroke="#22323a" stroke-width="14"/><path d="M{x} {y} H{x+230} V{y+150} H{x} Z" fill="#d7e4e4" {L}/>'
def telefone():
    return f'<g transform="translate(540 870)" {L}><path d="M-300 180 L-200 -90 H200 L300 180 Z" fill="#10181c"/><path d="M-340 -180 Q0 -300 340 -180 V-70 H180 V-130 H-180 V-70 H-340 Z" fill="#22323a"/><circle cy="60" r="120" fill="#d7e4e4"/></g>' + ''.join(f'<circle cx="{540+84*__import__("math").cos(k*.63):.0f}" cy="{930+84*__import__("math").sin(k*.63):.0f}" r="15" fill="#10181c"/>' for k in range(10))
def lista_telefonica():
    return f'<g transform="rotate(-6 540 780)"><rect x="240" y="340" width="600" height="860" fill="#e8b23f" {L}/></g>' + texto('LISTA', 720, 140, '#10181c').replace('stroke-width="10"', 'stroke-width="0"')
def mapa_br(recorte=False):
    s = f'<path d="M430 300 L520 340 L600 310 L680 350 L760 360 L830 440 L960 520 L990 590 L930 700 L880 800 L850 920 L770 1010 L700 1090 L640 1180 L590 1280 L530 1210 L580 1120 L500 1030 L460 940 L400 900 L330 880 L300 790 L210 760 L130 700 L120 630 L170 560 L230 520 L300 500 L320 420 L390 420 Z" fill="#1f5a60" {L}/>'
    if recorte:
        s += '<path d="M120 630 L235 615 L262 720 L210 760 L130 700 Z" fill="#c8402c" stroke="#050c0f" stroke-width="6"/>'
    return s
def garagem():
    return f'<rect x="130" y="470" width="820" height="770" fill="#22323a" {L}/><path d="M90 480 L540 280 L990 480 Z" fill="#3a2a22" {L}/>' + ''.join(f'<path d="M130 {y} H950" stroke="#14262b" stroke-width="10"/>' for y in range(540, 1240, 70))
def carro_classico(x=540, y=1140, e=1.7, c='#b5332f'):
    return f'<g transform="translate({x} {y}) scale({e})" {L}><path d="M-290 -10 Q-280 -80 -180 -90 Q-110 -180 40 -180 Q150 -180 200 -90 Q290 -80 290 -10 V30 H-290 Z" fill="{c}"/><path d="M-120 -90 Q-70 -150 30 -150 Q110 -150 150 -90 Z" fill="#d7e4e4"/><circle cx="-170" cy="36" r="54" fill="#04080a"/><circle cx="170" cy="36" r="54" fill="#04080a"/></g>'
def macaco_chave():
    return f'<path d="M260 1180 L800 440" stroke="#a9b6b5" stroke-width="60" stroke-linecap="round"/><circle cx="830" cy="400" r="110" fill="none" stroke="#a9b6b5" stroke-width="56"/>' + f'<g transform="translate(340 620)"><circle r="150" fill="#22323a" {L}/><circle r="60" fill="#14262b"/></g>'
def acude(ruina=True):
    s = '<rect y="1000" width="1080" height="920" fill="#5a4a3c"/>' + mar(1180)
    if ruina:
        s += f'<g {L}><path d="M340 1180 V720 L450 620 L560 720 V1180 Z" fill="#a9a08a"/><rect x="600" y="940" width="240" height="240" fill="#a9a08a"/><path d="M430 860 h60 v120 h-60 Z" fill="#14262b"/></g>'
    return s
def rio_baixo():
    return acude(True) + ''.join(f'<ellipse cx="{(k*173)%1000}" cy="{1250+k*70}" rx="120" ry="24" fill="#3a2a22"/>' for k in range(6))
def objeto_antigo():
    return f'<rect x="300" y="480" width="480" height="620" rx="10" fill="#a9a08a" {L}/><rect x="360" y="540" width="360" height="360" fill="#d9c79c"/><circle cx="540" cy="680" r="90" fill="#6b5a4a"/><path d="M430 860 q110 -130 220 0" fill="#6b5a4a"/>'
def cafezal(queimado=False):
    s = ''
    for r, y in enumerate([820, 950, 1100, 1270]):
        e = .55 + r * .28
        for x in range(30 + r * 20, 1080, int(190 * e)):
            s += f'<g transform="translate({x} {y}) scale({e})">'
            if queimado:
                s += '<path d="M0 0 V-190 M0 -70 L-80 -160 M0 -110 L80 -190 M0 -150 L-46 -220" stroke="#2c1d15" stroke-width="16" fill="none" stroke-linecap="round"/>' + ''.join(f'<ellipse cx="{dx}" cy="{dy}" rx="16" ry="9" fill="#5a4a3c"/>' for dx, dy in [(-80, -165), (80, -195), (-46, -225), (0, -195)])
            else:
                s += f'<path d="M0 0 V-90" stroke="#3a2a22" stroke-width="16"/>' + ''.join(f'<circle cx="{dx}" cy="{dy}" r="{rr}" fill="{cor}" {L}/>' for dx, dy, rr, cor in [(-52, -120, 54, '#2f6b38'), (52, -130, 56, '#3f8c47'), (0, -180, 60, '#3f8c47')]) + '<circle cx="-24" cy="-130" r="10" fill="#c8402c"/><circle cx="30" cy="-180" r="10" fill="#c8402c"/>'
            s += '</g>'
    return s
def sacas():
    return ''.join(f'<g transform="translate({x} {y})"><path d="M-130 110 Q-170 -80 -80 -120 H80 Q170 -80 130 110 Z" fill="#c9a267" {L}/></g>' for x, y in [(250, 1150), (540, 1170), (830, 1150), (400, 960), (680, 960), (540, 780)])
def atoleiro():
    return carro_lado(540, 1090, 1.4, '#3f6b5c') + '<path d="M90 1180 Q540 1110 990 1180 V1400 H90 Z" fill="#5a3a2c" stroke="#050c0f" stroke-width="8"/>' + ''.join(f'<ellipse cx="{200+k*140}" cy="{1260+(k%2)*50}" rx="50" ry="14" fill="#3a2a22"/>' for k in range(6))
def trator():
    return f'<g transform="translate(540 1000) scale(1.3)" {L}><rect x="-120" y="-180" width="240" height="180" fill="#e8b23f"/><rect x="-60" y="-300" width="150" height="120" fill="#0a1a20"/><circle cx="-140" cy="50" r="100" fill="#04080a"/><circle cx="170" cy="70" r="66" fill="#04080a"/></g>'
def ponte_caida():
    return f'<path d="M0 760 H380 L470 880 M1080 760 H720 L620 880" stroke="#22323a" stroke-width="64" fill="none"/>' + mar(1040)
def cupulas():
    return f'<g {L}><rect x="60" y="960" width="960" height="60" fill="#d9c79c"/><path d="M180 960 A130 110 0 0 1 440 960 Z" fill="#d7e4e4"/><path d="M640 800 Q770 960 900 800 Z" fill="#d7e4e4"/><path d="M730 960 L770 840 L810 960 Z" fill="#d7e4e4"/><path d="M500 960 V520 H540 V960 M570 960 V520 H610 V960" fill="#d9c79c"/></g>'
def guindaste():
    return f'<path d="M260 1240 V380 M260 380 H900 M260 380 L120 480 H260 M900 380 V640" stroke="#e8b23f" stroke-width="28" fill="none"/><rect x="800" y="640" width="200" height="120" fill="#6b5a4a" {L}/><path d="M300 1240 L220 1240" stroke="#050c0f" stroke-width="4"/>'
def operarios():
    s = ''
    for x, e in [(190, .9), (420, 1.05), (650, .9), (880, 1)]:
        s += f'<g transform="translate({x} 1240) scale({e})" {L}><ellipse cy="-420" rx="62" ry="28" fill="#e8b23f"/><circle cy="-380" r="50" fill="#a86f4f"/><path d="M-90 0 Q-100 -270 0 -320 Q100 -270 90 0 Z" fill="#17404e"/></g>'
    return s
def conteiner():
    return ''.join(f'<rect x="{x}" y="{y}" width="360" height="190" fill="{c}" {L}/>' for x, y, c in [(150, 1040, '#b5532f'), (540, 1040, '#1f5a60'), (340, 840, '#e8b23f')]) + placa('MINISTÉRIO').replace('y="480"', 'y="360"').replace('y="665"', 'y="520"').replace('M540 760 V1240', 'M540 620 V840').replace('height="280"', 'height="220"').replace('font-size="120"', 'font-size="96"')
def coroa(x=540, y=800, e=1.7):
    return f'<g transform="translate({x} {y}) scale({e})" {L}><path d="M-200 130 L-250 -120 L-100 0 L0 -180 L100 0 L250 -120 L200 130 Z" fill="#e8b23f"/><rect x="-200" y="130" width="400" height="60" fill="#c8402c"/></g>'
def nau(x, y, e):
    return navio(x, y, e)
def parede():
    s = ''
    for r in range(8):
        for k in range(6):
            s += f'<rect x="{-60+k*210+(r%2)*100}" y="{340+r*110}" width="200" height="100" fill="#a9a08a" {L}/>'
    return s
def pedra(x=540, y=860, e=1.6):
    return f'<g transform="translate({x} {y}) scale({e})" {L}><path d="M-260 110 Q-310 -60 -180 -150 Q-60 -240 110 -190 Q290 -140 280 30 Q260 180 60 180 Q-170 210 -260 110 Z" fill="#3a3f42"/><ellipse cx="-90" cy="-50" rx="40" ry="26" fill="#22282b"/><ellipse cx="110" cy="50" rx="56" ry="34" fill="#22282b"/><path d="M-200 -130 Q-120 -190 -40 -190" stroke="#a9b6b5" stroke-width="10" fill="none"/></g>'
def bois_carroca():
    return f'<g transform="translate(320 1020)" {L}><rect x="-210" y="-100" width="420" height="120" fill="#5a3a2c"/><circle cx="-130" cy="50" r="60" fill="#3a2a22"/><circle cx="130" cy="50" r="60" fill="#3a2a22"/></g>' + pedra(320, 800, .85) + f'<g transform="translate(790 980) scale(.6)" {L} fill="#6b4630"><rect x="-300" y="-180" width="560" height="280" rx="90"/><ellipse cx="310" cy="-170" rx="110" ry="84"/><rect x="-250" y="90" width="70" height="170"/><rect x="170" y="90" width="70" height="170"/></g>'
def carroca_quebrada():
    return f'<g transform="translate(400 1090) rotate(16)" {L}><rect x="-210" y="-60" width="420" height="80" fill="#5a3a2c"/><circle cx="-130" cy="60" r="60" fill="#3a2a22"/></g>' + pedra(650, 980, .8) + '<path d="M0 1240 L1080 980" stroke="#2c1d15" stroke-width="12"/>'
def meteoro_rua():
    return '<path d="M0 0 L620 720" stroke="#ff8a3d" stroke-width="58" opacity=".55"/>' + casas(None).replace('translate(540 1190)', 'translate(1500 1190)') + pedra(620, 1040, 1.1)
def advogados():
    return ''.join(doc(3, x, y, r, .55) for x, y, r in [(280, 620, -12), (780, 640, 12), (540, 900, 3)]) + pedra(540, 1160, .6)
