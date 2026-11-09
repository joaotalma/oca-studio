# Escreve as cenas do lote 1 em roteiros/<slug>/cenas/ e aponta falas.js para elas.
# Uso: python -I engine/desenhar-lote.py
import importlib.util, json, os, re
pasta = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('lib', os.path.join(pasta, 'cenas-lib.py'))
c = importlib.util.module_from_spec(spec); spec.loader.exec_module(c)
T = c.texto
num = lambda g, s='': T(g, 760, 300) + (T(s, 930, 110, '#fff') if s else '')
cal = lambda m, a: f'<g transform="rotate(-3 540 760)"><rect x="170" y="360" width="740" height="820" rx="20" fill="url(#caixa)" {c.L}/><rect x="170" y="360" width="740" height="210" rx="20" fill="#123840" {c.L}/></g>' + T(m, 530, 130, '#ead9b4') + T(a, 930, 250, '#ffb25d')
P = c.pessoa
LOTE = {
 'confisco-1990': [('sala', P(*c.GANCHO)), ('palco', cal('MARÇO', '1990')), ('noite', c.predio_gov()), ('noite', c.banco()), ('palco', c.notas(5) + T('50 MIL', 620, 230)),
   ('palco', cal('PRESO', '18 MESES').replace('font-size="250"', 'font-size="170"')), ('palco', num('80%', 'AO MÊS')), ('noite', c.fabrica() + c.X(430, 880, 200)), ('sala', P(*c.ROSTO)), ('palco', c.cartao()),
   ('escuro', c.celular(c.tela_saldo())), ('noite', c.casa() + c.doc(3, 820, 620, 8, .45, 'VENCIDO')), ('palco', c.doc(5, 540, 780, -4, .95, 'SEM SALÁRIO')), ('noite', c.carrinho() ), ('palco', c.nota(540, 840, -8, 2.2)),
   ('noite', P(*c.LADO) + c.doc(3, 760, 760, 6, .8, 'VENDE-SE')), ('sala', P(*c.LADO) + c.celular(c.tela_saldo('R$ 0', False), 780, 760, .8)), ('escuro', c.celular(c.tela_saldo('CONGELADO', True))), ('escuro', P(*c.FECHO))],
 'et-de-varginha': [('terreno', P(*c.GANCHO)), ('palco', cal('JANEIRO', '1996')), ('terreno', c.criatura('#10181c', False) + T('?', 560, 280)), ('noite', c.viatura() + T('?', 620, 300)), ('palco', cal('1997', 'INQUÉRITO').replace('font-size="250"', 'font-size="130"')),
   ('palco', c.pilha() + T('600', 340, 200)), ('noite', c.viatura() + c.X(540, 960, 270)), ('terreno', c.agachado()), ('sala', P(*c.ROSTO)), ('escuro', c.planeta() + T('PROVA?', 1260, 150)),
   ('noite', c.cameras()), ('noite', c.carros()), ('terreno', c.cerca_placa()), ('escuro', c.planeta() + T('?', 480, 200)), ('palco', c.livro()),
   ('terreno', P(*c.EM_PE) + c.criatura().replace('translate(600 1030)', 'translate(900 980) scale(.6)').replace('cx="555" cy="825"', 'cx="873" cy="855"').replace('cx="645" cy="825"', 'cx="927" cy="855"').replace('cx="555" cy="825" r', 'cx="873" cy="855" r')), ('sala', P(*c.EM_PE) + T('?', 560, 300)), ('escuro', P(*c.FECHO))],
 'apagao-2001': [('sala', P(*c.GANCHO)), ('palco', c.lampada() + T('2001', 330, 150)), ('palco', c.medidor()), ('noite', c.casa(540, 1200, 1.4, False) + c.X(540, 800, 220)), ('noite', c.predio_gov()),
   ('palco', c.doc(5, 540, 800, -3, .95, 'REVOGAR')), ('noite', c.fabrica() + c.X(430, 880, 200)), ('sala', P(*c.ROSTO)), ('palco', c.doc(5, 540, 800, 5, .95, 'META 20%')), ('sala', c.ar()),
   ('sala', c.chuveiro()), ('noite', c.casas(1)), ('noite', c.poste()), ('noite', c.fabrica()), ('palco', c.geladeira() + T('OU', 1160, 90)), ('noite', c.loja()), ('sala', c.elevador()), ('escuro', c.celular(c.tela_bateria())), ('sala', c.tomada()),
   ('sala', P(*c.EM_PE)), ('escuro', P(*c.FECHO))],
 'holandeses-recife': [('colonial', P(*c.GANCHO)), ('noite', c.navios()), ('noite', c.navios() + T('7 MIL', 560, 230)), ('palco', c.mapa()), ('colonial', ''),
   ('colonial', T('380', 620, 300)), ('noite', c.ponte()), ('noite', c.muralha()), ('colonial', P(*c.ROSTO)), ('palco', c.mapa(True)),
   ('palco', c.passaporte()), ('colonial', c.placa()), ('palco', c.livro().replace(c.X(760, 870, 110), '') + T('NEDERLANDS', 1240, 96)), ('colonial', c.boneco()), ('palco', c.cracha()),
   ('palco', c.bola() + T('RECIFE', 1260, 140)), ('noite', c.estadio()), ('sala', c.familia()), ('noite', c.cerca()), ('escuro', P(*c.FECHO))],
 'hiperinflacao': [('sala', P(*c.GANCHO)), ('prateleira', ''), ('palco', c.etiqueta_maquina()), ('palco', c.moedas4()), ('palco', num('2.500%', 'AO ANO').replace('font-size="300"', 'font-size="230"')),
   ('palco', num('82%', 'EM UM MÊS')), ('palco', num('47,5%', 'JUNHO DE 1994').replace('font-size="300"', 'font-size="240"')), ('palco', num('6,8%', 'JULHO DE 1994')), ('sala', P(*c.ROSTO)), ('escuro', c.celular(c.tela_carrinho())),
   ('palco', c.nota(540, 840, -6, 2) + c.X(540, 840, 280)), ('noite', P(*c.LADO) + c.carrinho(760, 1180, .9)), ('noite', c.casa() + c.doc(3, 820, 620, 8, .45, '+ 40%')), ('palco', c.pao()), ('palco', c.notas(5) + c.X(540, 950, 300)),
   ('sala', c.mesa()), ('palco', c.nota(540, 720, 0, 2) + T('NOVA', 1120, 170)), ('palco', c.cafe()), ('palco', c.cafe(True)), ('escuro', P(*c.FECHO))],
}
MOV = ['zoom-in', 'zoom-out', 'esq', 'zoom-in', 'dir', 'cima', 'zoom-in', 'baixo', 'zoom-out']
for slug, cenas in LOTE.items():
    r = os.path.join(pasta, '..', 'roteiros', slug)
    d = os.path.join(r, 'cenas'); os.makedirs(d, exist_ok=True)
    s = open(os.path.join(r, 'falas.js'), encoding='utf8').read()
    F = json.loads(re.search(r'\[.*\]', s, re.S).group(0))
    assert len(F) == len(cenas), (slug, len(F), len(cenas))
    for i, (fundo, corpo) in enumerate(cenas, 1):
        if fundo == 'terreno': base = c.terreno()
        elif fundo == 'prateleira':
            base = '<rect width="1080" height="1920" fill="#0d2a31"/>' + c.bokeh((540, 180, 200, '#ffe2b0', .5))
            for y in [420, 720, 1020, 1320, 1620]:
                base += f'<rect y="{y}" width="1080" height="34" fill="#ffcf8a" {c.L}/><rect y="{y+34}" width="1080" height="50" fill="#000" opacity=".35"/>'
                for x in range(60, 1040, 240):
                    base += f'<path d="M{x} {y} v-120 h130 v120 Z" fill="#b5532f" {c.L}/><path d="M{x+15} {y+40} h100 v50 h-100 Z" fill="#ead9b4" {c.L}/>'
        elif fundo == 'colonial' and not corpo:
            base = c.f_noite(); corpo = c.palacio()
        else: base = c.FUNDOS[fundo]()
        if fundo == 'colonial' and corpo.startswith('<text'): base = c.f_colonial()
        open(os.path.join(d, f'cena{i:02d}.svg'), 'w', encoding='utf8').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920"><defs>{c.DEFS}</defs><!--ambiente:{fundo}-->{base}<!--F-->{corpo}</svg>\n')
    for i, f in enumerate(F):
        f['imagem'] = f'assets/cena{i+1:02d}.png'
        if not f.get('inteiro'): f['movimento'] = MOV[i % len(MOV)]
    open(os.path.join(r, 'falas.js'), 'w', encoding='utf8').write('const FALAS = [\n' + ',\n'.join('  ' + json.dumps(x, ensure_ascii=False) for x in F) + '\n];\n')
    t = open(os.path.join(r, 'roteiro.md'), encoding='utf8').read().replace('- Roteiro: pendente', '- Roteiro aprovado por João em 2026-11-07')
    open(os.path.join(r, 'roteiro.md'), 'w', encoding='utf8').write(t)
    print(slug, len(cenas))
