#!/usr/bin/env python3
"""Mixa o áudio de um episódio: falas, efeitos e trilha sintetizados em código.

Uso: python scripts/mixar.py audio/ep01 render/ep01_mix.wav [episodios/ep02]
Com a pasta do episódio, músicas e efeitos vêm do mixagem.py dela. Sem ela, valem os do ep. 1.
Antes: python scripts/sincronizar.py. Os tempos abaixo estão no tempo do roteiro.

Regra da trilha: cada música é um loop circular com número inteiro de compassos, em que as notas que
passam do fim voltam para o começo. O loop só entra na mixagem se passar nas medições de emenda; se
reprovar, a cena fica sem música e o relatório diz qual caiu.
"""
import importlib.util, json, sys, wave
from pathlib import Path
import numpy as np

SR = 48000
rng = np.random.default_rng(7)

# ---------- utilidades de síntese ----------

def env(n, ataque=.005, queda=.3):
    t = np.arange(n) / SR
    return np.minimum(t / max(ataque, 1e-4), 1) * np.exp(-t / queda)

def hz(m):
    return 440 * 2 ** ((m - 69) / 12)

def nota(m, dur, tipo):
    a = _nota(m, dur, tipo)
    q = int(.012 * SR)
    a[-q:] *= np.linspace(1, 0, q)  # a nota nunca termina em degrau
    return a

def _nota(m, dur, tipo):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = hz(m)
    if tipo == 'marimba':
        return (np.sin(2 * np.pi * f * t) + .35 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t / .05)) * env(n, .002, .28)
    if tipo == 'baixo':
        return (np.sin(2 * np.pi * f * t) + .3 * np.sin(2 * np.pi * f * 2 * t)) * env(n, .006, .35)
    if tipo == 'pizz':
        return (np.sin(2 * np.pi * f * t) + .5 * np.sin(2 * np.pi * f * 2 * t) + .25 * np.sin(2 * np.pi * f * 3 * t)) * env(n, .002, .14)
    if tipo == 'eletrico':
        return (np.sin(2 * np.pi * f * t + 1.2 * np.sin(2 * np.pi * f * t) * np.exp(-t / .5))) * env(n, .012, .9)
    if tipo == 'caixinha':
        return (np.sin(2 * np.pi * f * t) + .4 * np.sin(2 * np.pi * f * 3 * t) * np.exp(-t / .3)) * env(n, .002, .8)
    raise ValueError(tipo)

def bumbo(dur=.2):
    n = int(dur * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * (48 * t + 40 * (1 - np.exp(-t / .03)) * .03)) * env(n, .001, .07)

def chiado(dur=.05, queda=.015):
    n = int(dur * SR)
    r = rng.standard_normal(n)
    return np.diff(r, prepend=0) * env(n, .0005, queda) * .5

def filtro_grave(a, corte):
    alfa = 1 - np.exp(-2 * np.pi * corte / SR)
    b = np.empty_like(a); y = 0.0
    for i, x in enumerate(a):
        y += alfa * (x - y); b[i] = y
    return b

# ---------- trilha: loops circulares ----------

def loop(bpm, compassos, eventos, tempos=4, nome=''):
    """eventos: (tempo, som, ganho). Tudo que passa do fim volta para o início."""
    N = round(compassos * tempos * 60 / bpm * SR)
    x = np.zeros(N)
    for tempo, som, ganho in eventos:
        i = round(tempo * 60 / bpm * SR) % N
        idx = (i + np.arange(len(som))) % N
        np.add.at(x, idx, som * ganho)
    return x / max(np.abs(x).max(), 1e-6)

def musicas():
    m = {}
    # Alegre: o Tico achando que vai dar certo. Dó maior, marimba e baixo saltitante
    bpm = 112; ev = []
    acordes = [(48, [64, 67, 72]), (53, [65, 69, 72]), (55, [62, 67, 71]), (48, [64, 67, 72])]
    tema = [72, 74, 76, 79, 77, 76, 74, 72, 74, 76, 77, 74, 72, 71, 72, 67]
    for c, (b, tri) in enumerate(acordes):
        ini = c * 4
        ev += [(ini, nota(b, 1, 'baixo'), .7), (ini + 2, nota(b + 7, 1, 'baixo'), .55)]
        for k in (1, 3):
            for p in tri:
                ev.append((ini + k, nota(p, .7, 'marimba'), .22))
        for k in range(4):
            ev.append((ini + k + .5, chiado(), .10))
            ev.append((ini + k, chiado(.03, .008), .07))
    for i, p in enumerate(tema):
        if i % 2 == 0 or i > 7:
            ev.append((i, nota(p, .8, 'marimba'), .42))
    m['alegre'] = (loop(bpm, 4, ev), bpm, 4)
    # Lembrança: piano elétrico lento, abafado
    bpm = 76; ev = []
    for c, (b, tri) in enumerate([(45, [60, 64, 69]), (41, [60, 65, 69]), (43, [59, 62, 67]), (40, [59, 64, 67])]):
        ini = c * 4
        ev.append((ini, nota(b, 3, 'baixo'), .45))
        for k, p in enumerate(tri):
            ev.append((ini + k * .5, nota(p, 3, 'eletrico'), .3))
        ev.append((ini + 2.5, nota(tri[-1] + 5 if c % 2 else tri[-1] + 3, 2, 'eletrico'), .18))
    m['lembranca'] = (loop(bpm, 4, ev), bpm, 4)
    # Apuro: pizzicato em menor, de quem anda na ponta dos pés
    bpm = 104; ev = []
    linha = [57, 60, 64, 60, 57, 60, 65, 60, 56, 59, 64, 59, 57, 60, 64, 60]
    for i, p in enumerate(linha):
        ev.append((i, nota(p - 12, .5, 'pizz'), .6))
        if i % 4 == 1:
            ev.append((i + .5, nota(p + 12, .4, 'pizz'), .3))
    for c, b in enumerate([45, 41, 40, 45]):
        ev.append((c * 4, nota(b, 1.2, 'baixo'), .5))
    m['apuro'] = (loop(bpm, 4, ev), bpm, 4)
    # Romance: bossa suave, para o reencontro
    bpm = 88; ev = []
    for c, (b, tri) in enumerate([(50, [65, 69, 72, 76]), (43, [65, 71, 74]), (48, [64, 67, 71, 74]), (45, [61, 67, 69, 72])]):
        ini = c * 4
        ev += [(ini, nota(b, 1.4, 'baixo'), .55), (ini + 1.5, nota(b + 7, 1.2, 'baixo'), .35), (ini + 2, nota(b + 7, 1.2, 'baixo'), .45), (ini + 3.5, nota(b, 1.2, 'baixo'), .35)]
        for k in (0, 1.5, 3):
            for p in tri:
                ev.append((ini + k, nota(p, 1.6, 'eletrico'), .13))
        for k in range(8):
            ev.append((ini + k * .5, chiado(.03, .008), .05))
    m['romance'] = (loop(bpm, 4, ev), bpm, 4)
    # Votação: relógio de indecisão
    bpm = 120; ev = []
    for i in range(16):
        ev.append((i * .5 + 0, nota(69 if i % 2 == 0 else 72, .25, 'pizz'), .4))
    for c, b in enumerate([45, 45, 44, 44]):
        ev.append((c * 2, nota(b, 1.5, 'baixo'), .6))
        ev.append((c * 2, bumbo(), .5))
    m['voto'] = (loop(bpm, 2, ev), bpm, 4)
    # Sozinha: caixinha lenta e triste
    bpm = 60; ev = []
    for i, p in enumerate([72, 69, 76, 72, 74, 71, 67, 71]):
        ev.append((i * 1, nota(p, 2.4, 'caixinha'), .5))
    for c, b in enumerate([57, 55]):
        ev.append((c * 4 + .5, nota(b, 3.2, 'eletrico'), .3))
    m['sozinha'] = (loop(bpm, 2, ev), bpm, 4)
    return m

def mede_emenda(x, bpm):
    """Toca o loop duas vezes e compara a emenda com as outras entradas de tempo da mesma música.

    Três testes: salto de amostra na emenda, degrau de nível e clique de alta frequência. A emenda cai
    sobre um tempo forte, então o degrau é comparado com o dos outros tempos, onde também nascem notas.
    """
    N = len(x)
    dobro = np.concatenate([x, x])
    salto = abs(float(x[0] - x[-1]))
    derivada = np.abs(np.diff(dobro))
    tipico = float(np.percentile(derivada, 99.5))
    j, k = int(.03 * SR), int(.004 * SR)
    alta = np.diff(np.diff(dobro))

    def db(a):
        return 10 * np.log10(np.mean(a ** 2) + 1e-7)

    def degrau(i):
        return abs(db(dobro[i - j:i]) - db(dobro[i:i + j]))

    def clique(i):
        return float(np.sqrt(np.mean(alta[i - k:i + k] ** 2)))

    passo = 60 / bpm * SR
    tempos = [int(round(b * passo)) for b in range(1, int(N / passo)) if j < round(b * passo) < N - j]
    d, c = degrau(N), clique(N)
    d_lim, c_lim = max(degrau(i) for i in tempos) + 1, max(clique(i) for i in tempos) * 1.05
    ok = salto <= tipico and d <= d_lim and c <= c_lim
    return bool(ok), {'salto': round(salto, 4), 'salto_limite': round(tipico, 4), 'degrau_dB': round(float(d), 2), 'degrau_limite_dB': round(float(d_lim), 2), 'clique': round(c, 5), 'clique_limite': round(float(c_lim), 5)}

# ---------- efeitos ----------

def fx_estouro():
    n = int(.5 * SR); t = np.arange(n) / SR
    return rng.standard_normal(n) * np.exp(-t / .05) + np.sin(2 * np.pi * 70 * t) * np.exp(-t / .12)

def fx_chiado_pneu(d=1.3):
    n = int(d * SR)
    return np.diff(rng.standard_normal(n), prepend=0) * np.linspace(.45, .03, n)

def fx_galo():
    n = int(.9 * SR); t = np.arange(n) / SR
    f = 620 + 260 * np.sin(np.pi * np.minimum(t / .9, 1)) ** .5
    return np.tanh(2.5 * np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.minimum(t / .04, 1) * np.minimum((.9 - t) / .2, 1) * .5

def fx_gps():
    n = int(.34 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 880 * t) * (t < .13) + np.sin(2 * np.pi * 660 * t) * (t >= .17)) * .5 * env(n, .004, .3)

def fx_tosse_motor():
    s = np.zeros(int(1.0 * SR))
    for i, (ini, g) in enumerate([(0, 1), (.28, .8), (.6, .5)]):
        a = fx_motor(.16 + .04 * i) * g
        c = int(ini * SR); s[c:c + len(a)] += a * np.hanning(len(a))
    return s

def fx_fungada():
    n = int(.5 * SR); t = np.arange(n) / SR
    return filtro_grave(rng.standard_normal(n), 2600) * np.sin(np.pi * t / .5) ** 2 * (t / .5) * 2

def fx_motor(d):
    n = int(d * SR); t = np.arange(n) / SR
    f = 62 + 5 * np.sin(2 * np.pi * .7 * t)
    fase = 2 * np.pi * np.cumsum(f) / SR
    s = np.sign(np.sin(fase)) * .35 + np.sin(2 * fase) * .4 + .15 * rng.standard_normal(n)
    return filtro_grave(s, 420)

def fx_apito(d):
    n = int(d * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * 1000 * t)
    s[:240] *= np.linspace(0, 1, 240); s[-240:] *= np.linspace(1, 0, 240)
    return s

def fx_passagem(d=.45):
    n = int(d * SR)
    a = filtro_grave(rng.standard_normal(n), 2500)
    return a * np.sin(np.pi * np.arange(n) / n) ** 2

def fx_notificacao():
    return np.concatenate([nota(83, .11, 'caixinha'), nota(88, .3, 'caixinha')])

def fx_queda():
    n = int(.5 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * (300 * t - 170 * t * t)) * np.exp(-t / .22)

def fx_baque():
    n = int(.25 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 85 * t) + .25 * filtro_grave(rng.standard_normal(n), 900)) * np.exp(-t / .06)

def fx_ziper(d=.3):
    n = int(d * SR); t = np.arange(n) / SR
    return rng.standard_normal(n) * (.5 + .5 * np.sign(np.sin(2 * np.pi * 60 * t))) * np.sin(np.pi * t / d)

def fx_lampada():
    return nota(91, .7, 'caixinha') + np.pad(nota(96, .6, 'caixinha'), (0, int(.1 * SR)))[:int(.7 * SR)] * .6

def fx_moeda():
    a = nota(88, .12, 'caixinha'); b = nota(93, .45, 'caixinha')
    return np.concatenate([a, b])

def fx_metal():
    n = int(.5 * SR); t = np.arange(n) / SR
    return sum(np.sin(2 * np.pi * f * t) * np.exp(-t / d) for f, d in [(1420, .16), (2310, .1), (3580, .06)]) / 2

def fx_interfone():
    n = int(.42 * SR); t = np.arange(n) / SR
    return np.sign(np.sin(2 * np.pi * 440 * t)) * .5 * (np.sin(2 * np.pi * 32 * t) > 0) * np.minimum(1, (n - np.arange(n)) / 400)

def fx_clique():
    n = int(.05 * SR)
    return rng.standard_normal(n) * np.exp(-np.arange(n) / SR / .006)

def fx_latido():
    n = int(.3 * SR); t = np.arange(n) / SR
    f = 620 - 900 * t + 160 * np.exp(-t / .03)
    fase = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(fase) + .6 * np.sin(2 * fase) + .4 * np.sin(3 * fase) + .35 * rng.standard_normal(n)
    return filtro_grave(s, 3200) * np.minimum(t / .008, 1) * np.exp(-t / .1)

def fx_porta():
    n = int(.6 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * (180 + 90 * t) * t) * .4 * (1 + .6 * np.sin(2 * np.pi * 23 * t)) * np.sin(np.pi * t / .6) + np.pad(fx_baque()[:int(.2 * SR)], (int(.4 * SR), 0))[:n] * .6

def fx_grave():
    n = int(1.1 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * (55 * t - 6 * t * t)) * np.minimum(t / .02, 1) * np.exp(-t / .4)

def fx_sopro():
    n = int(.4 * SR)
    return filtro_grave(rng.standard_normal(n), 1600) * np.sin(np.pi * np.arange(n) / n)

def fx_silencio_tinido():
    n = int(1.2 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * 2200 * t) * np.exp(-t / .5) * np.minimum(t / .05, 1)

def interfone_voz(a):
    """Banda estreita de interfone, sem depender de arquivo externo."""
    b = filtro_grave(a, 3200)
    b = b - filtro_grave(b, 420)
    return np.tanh(b * 2.4) * .8

# ---------- montagem ----------

CUES = [  # (ini e fim no roteiro, música, ganho)
    (0, 2.7, 'alegre', .9), (4.6, 13.4, 'lembranca', .8), (13.4, 26, 'apuro', .8),
    (26, 43.5, 'alegre', .75), (43.5, 46, 'alegre', .8), (46, 62, 'apuro', .7), (62, 64, 'alegre', .9),
    (64, 74, 'romance', .85), (75.5, 82, 'voto', .9), (82, 87, 'sozinha', .95),
]
EFEITOS = [  # (tempo no roteiro, efeito, ganho)
    (2.7, fx_estouro, .55), (2.75, fx_chiado_pneu, .28), (4.5, fx_passagem, .3), (13.3, fx_passagem, .3), (15.85, fx_notificacao, .45),
    (17.2, fx_queda, .4), (19.15, fx_baque, .6), (19.8, fx_ziper, .3), (24.3, fx_moeda, .35), (25.0, fx_lampada, .4), (26.0, fx_metal, .22), (29.0, fx_metal, .16),
    (41.5, fx_sopro, .2), (44.0, fx_moeda, .3), (46.0, fx_interfone, .3), (61.85, fx_clique, .55), (64.0, fx_porta, .45), (65.2, fx_notificacao, .4), (72.0, fx_grave, .6),
    (74.0, fx_silencio_tinido, .1), (75.4, fx_passagem, .25), (84.9, fx_sopro, .3),
]
LATIDOS = [61.2, 78.6]
VOZ_INTERFONE = {23, 25, 27, 29}
APITO = {2}
MOTORES = [(0, 2.7, .16)]
ALVO_VOZ = .085  # RMS de cada fala antes da normalização final


def le_wav(p):
    with wave.open(str(p)) as w:
        return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    audio, saida = Path(sys.argv[1]), Path(sys.argv[2])
    tempos = json.loads((audio / 'tempos.json').read_text(encoding='utf8'))
    xp, fp = zip(*tempos['nos'])
    if len(sys.argv) > 3:
        caminho = Path(sys.argv[3]) / 'mixagem.py'
        spec = importlib.util.spec_from_file_location('mixagem', caminho)
        mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
        por_n = {f['n']: f['roteiro'] for f in tempos['falas']}
        globals().update(mod.config(sys.modules[__name__], lambda n: por_n[n][0], lambda n: por_n[n][1]))
    real = lambda t: float(np.interp(t, xp, fp))
    N = int((tempos['duracao'] + .5) * SR)
    voz, fx, mus, presenca = np.zeros(N), np.zeros(N), np.zeros(N), np.zeros(N)

    def poe(faixa, a, seg, ganho=1.0):
        i = int(seg * SR); f = min(N, i + len(a))
        if i < N:
            faixa[i:f] += a[:f - i] * ganho

    for f in tempos['falas']:
        a = le_wav(audio / 'limpas' / f"{f['n']:02}.wav")
        a = a / max(np.sqrt(np.mean(a ** 2)), 1e-5) * ALVO_VOZ
        if f['n'] in VOZ_INTERFONE:
            a = interfone_voz(a / ALVO_VOZ * .25) * ALVO_VOZ * 2.6
        if f['n'] in APITO:   # palavrão coberto pelo apito
            fx_ap = fx_apito(f['fim'] - f['ini'])
            poe(fx, fx_ap, f['ini'], .16)
            a = a * .05
        poe(voz, a, f['ini'])
        presenca[int(f['ini'] * SR):int(f['fim'] * SR)] = 1

    for ini, fim, g in MOTORES:
        poe(fx, fx_motor(real(fim) - real(ini)), real(ini), g)
    for t, ef, g in EFEITOS:
        poe(fx, ef(), real(t), g)
    for t in LATIDOS:
        poe(fx, fx_latido(), real(t), .55)

    relatorio, mus_ok = {}, {}
    for nome, (x, bpm, tempos_c) in musicas().items():
        ok, med = mede_emenda(x, bpm)
        relatorio[nome] = {'aprovado': bool(ok), 'bpm': bpm, 'duracao_loop_s': round(len(x) / SR, 3), **med}
        if ok:
            mus_ok[nome] = x
    caiu = 0
    for ini, fim, nome, g in CUES:
        if nome not in mus_ok:
            caiu += 1
            continue
        x = mus_ok[nome]
        a, b = int(real(ini) * SR), int(real(fim) * SR)
        trecho = x[np.arange(b - a) % len(x)] * g
        n = min(int(.08 * SR), len(trecho) // 3)
        trecho[:n] *= np.linspace(0, 1, n); trecho[-n:] *= np.linspace(1, 0, n)
        mus[a:b] += trecho

    # A música abaixa sob as falas, com subida e descida suaves
    j = int(.14 * SR)
    duck = np.convolve(presenca, np.ones(j) / j, 'same')
    mus *= (.15 - .085 * duck)
    mix = voz + fx + mus
    pico = np.abs(mix).max()
    if pico > .95:
        mix *= .95 / pico
    with wave.open(str(saida), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes())
    (audio / 'trilha.json').write_text(json.dumps(relatorio, ensure_ascii=False, indent=1), encoding='utf8')
    for nome, r in relatorio.items():
        print(nome, r)
    print('blocos sem música por reprovação:', caiu, '| duração', round(N / SR, 2), 's')


if __name__ == '__main__':
    main()
