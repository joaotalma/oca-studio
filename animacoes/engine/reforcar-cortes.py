# Aplica a estética de mais cortes (a mesma do canal de filmes) a um vídeo do template ilustrado.
# - Cada cena sai em camadas (fundo, objetos e personagem, com as marcas de engine/desenhar-cenas.mjs) para o template animar.
# - Fala longa ganha uma segunda imagem: o "você" reagindo, perto da câmera, com uma expressão por corte.
# - Cenas com o personagem ganham rosto próprio e enquadramento mais fechado.
# - O que é fato ("foi") ganha o filtro de passado; o que é hipótese fica com a cor viva.
# As cenas aprovadas antes ficam guardadas em cenas-v1/. Uso: python -I engine/reforcar-cortes.py <slug> [...]
import importlib.util, json, os, re, shutil, sys
pasta = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('lib', os.path.join(pasta, 'cenas-lib.py'))
c = importlib.util.module_from_spec(spec); spec.loader.exec_module(c)

LONGA = 2.6
CLOSE = (-384, -188, 4.2)      # rosto enchendo a tela
EXTREMO = (-964, -1092, 8.0)   # close no olho
MEIO = (-32, 380, 2.6)         # meio corpo
GANCHO = (30, 800, 2.3)
ENQ = {'translate(-10 260) scale(2.5)': CLOSE, 'translate(40 420) scale(2.3)': MEIO}

def cor(x):
    return x
def deco(rosto):
    d = {
        'surpreso': '<g fill="#fff">' + ''.join(f'<path d="M{x} {y} l12 -40 l12 40 l40 12 l-40 12 l-12 40 l-12 -40 l-40 -12 Z" opacity=".9"/>' for x, y in [(160, 420), (860, 360), (930, 980)]) + '</g>',
        'assustado': '<path d="M820 360 q-30 60 0 90 q30 -30 0 -90 Z" fill="#7ff0ee" stroke="#050c0f" stroke-width="5"/>' + ''.join(f'<path d="M{x} 1500 L{x+90} 1180" stroke="#ffffff" stroke-width="8" opacity=".35"/>' for x in range(60, 1040, 150)),
        'bravo': '<g stroke="#ff4d4d" stroke-width="18" stroke-linecap="round" fill="none"><path d="M820 300 q30 30 0 60 M860 300 q-30 30 0 60 M800 340 q30 -30 60 0 M800 320 q30 30 60 0"/></g>',
        'desconfiado': c.texto('?', 520, 220, '#ffb25d').replace('x="540"', 'x="900"'),
        'curioso': c.texto('?', 480, 160, '#ffb25d').replace('x="540"', 'x="880"') + c.texto('!', 380, 120, '#ffb25d').replace('x="540"', 'x="170"'),
        'triste': ''.join(f'<path d="M{x} {y} v70" stroke="#7ff0ee" stroke-width="6" opacity=".55"/>' for x, y in [(120, 300), (300, 420), (760, 280), (940, 520), (210, 760), (880, 860)]),
        'sorriso': ''.join(f'<path d="M{x} {y} c-30 -40 -90 -10 -60 40 l60 60 l60 -60 c30 -50 -30 -80 -60 -40 Z" fill="#ff6b8a" stroke="#050c0f" stroke-width="5"/>' for x, y in [(190, 420), (880, 360)]),
    }
    return d.get(rosto, '')

def fundo_retrato():
    return ('<defs><radialGradient id="sol" cx=".72" cy=".55" r=".6"><stop offset="0" stop-color="#ffd9a0" stop-opacity=".95"/><stop offset=".35" stop-color="#ffb25d" stop-opacity=".55"/><stop offset="1" stop-color="#ffb25d" stop-opacity="0"/></radialGradient></defs>'
            '<rect width="1080" height="1920" fill="url(#noite)"/><rect width="1080" height="1920" fill="url(#sol)"/>'
            + c.bokeh((140, 360, 50, '#58c3c9', .45), (930, 300, 60, '#ffb25d', .6), (980, 1200, 90, '#ffb25d', .5), (90, 1100, 40, '#58c3c9', .4)))

def pessoa(enq, pid):
    return c.pessoa(*enq, pid=pid)

FOI = ['surpreso', 'assustado', 'desconfiado', 'surpreso', 'curioso']
SERIA = ['assustado', 'surpreso', 'bravo', 'triste', 'desconfiado', 'curioso', 'sorriso']
TRISTE = ('perd', 'acab', 'fech', 'sem ', 'nunca', 'caiu', 'quebr', 'sum', 'escur', 'fome', 'falt')
BRAVO = ('proib', 'decret', 'crime', 'multa', 'corte', 'ningu')

def escolher(f, usados, ultimo, base):
    t = f['texto'].lower()
    pref = []
    if '?' in t: pref += ['desconfiado', 'curioso']
    if any(k in t for k in TRISTE): pref += ['triste', 'assustado']
    if any(k in t for k in BRAVO): pref += ['bravo']
    pref += base
    for r in pref:
        if r != ultimo and usados.count(r) <= min(usados.count(x) for x in set(base)):
            return r
    return next(r for r in pref if r != ultimo)

def processar(slug):
    r = os.path.join(pasta, '..', 'roteiros', slug)
    cen, v1 = os.path.join(r, 'cenas'), os.path.join(r, 'cenas-v1')
    if not os.path.isdir(v1):
        shutil.copytree(cen, v1)
    for n in os.listdir(cen):
        os.remove(os.path.join(cen, n))
    ass = os.path.join(r, 'assets')
    if os.path.isdir(ass):
        for n in os.listdir(ass):
            os.remove(os.path.join(ass, n))
    s = open(os.path.join(r, 'falas.js'), encoding='utf8').read()
    F = json.loads(re.search(r'\[.*\]', s, re.S).group(0))
    usados, ultimo, total = [], None, 0
    for i, f in enumerate(F, 1):
        orig = open(os.path.join(v1, f'cena{i:02d}.svg'), encoding='utf8').read()
        base = FOI if f.get('camada') == 'foi' else SERIA
        temP = '<!--P-->' in orig
        a = orig
        if temP:
            rosto = 'tenso' if f.get('inteiro') else escolher(f, usados, ultimo, base)
            if rosto != 'tenso':
                a = a.replace('<svg ', f'<svg ', 1).replace('</svg>', f'<!--rosto:{rosto}--></svg>')
                usados.append(rosto); ultimo = rosto
            for velho, novo in ENQ.items():
                a = a.replace(velho, 'translate({} {}) scale({})'.format(*novo))
            if rosto != 'tenso':
                a = a.replace('</svg>', deco(rosto) + '</svg>')
        open(os.path.join(cen, f'c{i:02d}a.svg'), 'w', encoding='utf8').write(a)
        imgs = [f'assets/c{i:02d}a.png']
        if not f.get('inteiro') and f['fim'] - f['ini'] > LONGA:
            rosto = escolher(f, usados, ultimo, base); usados.append(rosto); ultimo = rosto
            enq = [CLOSE, MEIO, EXTREMO][(i + len(usados)) % 3] if rosto in ('assustado', 'surpreso') else [CLOSE, MEIO][i % 2]
            ambiente = re.search(r'<!--ambiente(?:3d)?:.*?-->', orig, re.S)
            marcador = ambiente.group(0) if ambiente else '<!--ambiente:retrato-->'
            b = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920"><defs>{c.DEFS}</defs>{marcador}{fundo_retrato()}<!--F-->{pessoa(enq, "pr")}{deco(rosto)}<!--rosto:{rosto}-->{"<!--sempisca-->" if enq == EXTREMO else ""}</svg>\n'
            open(os.path.join(cen, f'c{i:02d}b.svg'), 'w', encoding='utf8').write(b)
            imgs.append(f'assets/c{i:02d}b.png')
        f.pop('imagem', None)
        f['imagens'] = imgs
        if f.get('camada') == 'foi':
            f['filtro'] = 'flashback'
        total += len(imgs)
    open(os.path.join(r, 'falas.js'), 'w', encoding='utf8').write('const FALAS = [\n' + ',\n'.join('  ' + json.dumps(x, ensure_ascii=False) for x in F) + '\n];\n')
    vj = os.path.join(r, 'video.js')
    t = open(vj, encoding='utf8').read()
    t = re.sub(r", planoMax: [\d.]+", '', t)
    if 'olhos:' not in t:
        t = t.replace(' };', ", olhos: 'cinema' };")
    open(vj, 'w', encoding='utf8').write(t)
    print(slug, len(F), 'falas', total, 'imagens')

for slug in sys.argv[1:]:
    processar(slug)
