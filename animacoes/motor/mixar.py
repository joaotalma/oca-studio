#!/usr/bin/env python3
"""Mixa um vídeo narrado: uma voz, efeitos curtos e, se houver, música baixa com licença.

Uso: python motor/mixar.py audio/<slug> render/<slug>/mix.wav [--musica faixa.wav]
Antes: python motor/sincronizar.py. Um efeito entra pelo campo "fx" da fala em falas.js.
A música precisa de licença comercial anotada em postagem.md. Sem --musica, não há música.
"""
import json, subprocess, sys, wave
from pathlib import Path
import numpy as np

SR = 48000
ALVO_VOZ = .16
GANHO_FX = .22
rng = np.random.default_rng(7)

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

def fx_passagem(d=.45):
    n = int(d * SR)
    a = filtro_grave(rng.standard_normal(n), 2500)
    return a * np.sin(np.pi * np.arange(n) / n) ** 2

def fx_notificacao():
    return np.concatenate([nota(83, .11, 'caixinha'), nota(88, .3, 'caixinha')])

def fx_baque():
    n = int(.25 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 85 * t) + .25 * filtro_grave(rng.standard_normal(n), 900)) * np.exp(-t / .06)

def fx_ziper(d=.3):
    n = int(d * SR); t = np.arange(n) / SR
    return rng.standard_normal(n) * (.5 + .5 * np.sign(np.sin(2 * np.pi * 60 * t))) * np.sin(np.pi * t / d)

def fx_clique():
    n = int(.05 * SR)
    return rng.standard_normal(n) * np.exp(-np.arange(n) / SR / .006)

def fx_grave():
    n = int(1.1 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * (55 * t - 6 * t * t)) * np.minimum(t / .02, 1) * np.exp(-t / .4)

def fx_sopro():
    n = int(.4 * SR)
    return filtro_grave(rng.standard_normal(n), 1600) * np.sin(np.pi * np.arange(n) / n)

def le_wav(p):
    with wave.open(str(p)) as w:
        return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768


FX = {'notificacao': fx_notificacao, 'clique': fx_clique, 'passagem': fx_passagem, 'ziper': fx_ziper,
      'baque': fx_baque, 'sopro': fx_sopro, 'grave': fx_grave}


def le_musica(caminho):
    bruto = subprocess.run(['ffmpeg', '-v', 'error', '-i', caminho, '-ar', str(SR), '-ac', '1', '-f', 's16le', '-'],
                           capture_output=True, check=True).stdout
    return np.frombuffer(bruto, dtype=np.int16).astype(np.float64) / 32768


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    audio, saida = Path(sys.argv[1]), Path(sys.argv[2])
    musica = sys.argv[sys.argv.index('--musica') + 1] if '--musica' in sys.argv else None
    tempos = json.loads((audio / 'tempos.json').read_text(encoding='utf8'))
    N = int((tempos['duracao'] + .5) * SR)
    voz, fx, presenca = np.zeros(N), np.zeros(N), np.zeros(N)

    def poe(faixa, a, seg, ganho=1.0):
        i = max(0, int(seg * SR)); f = min(N, i + len(a))
        if i < N:
            faixa[i:f] += a[:f - i] * ganho

    for f in tempos['falas']:
        a = le_wav(audio / 'limpas' / f"{f['n']:02}.wav")
        poe(voz, a / max(np.sqrt(np.mean(a ** 2)), 1e-5) * ALVO_VOZ, f['ini'])
        presenca[int(f['ini'] * SR):int(f['fim'] * SR)] = 1
        if f.get('fx'):
            if f['fx'] not in FX:
                sys.exit(f"fala {f['n']}: efeito desconhecido {f['fx']!r}. Opções: {', '.join(FX)}")
            poe(fx, FX[f['fx']](), f['ini'] - .04, GANHO_FX)

    mus = np.zeros(N)
    if musica:
        x = le_musica(musica)
        # A música abaixa sob a fala, com subida e descida suaves
        j = int(.14 * SR)
        mus = x[np.arange(N) % len(x)] * (.15 - .085 * np.convolve(presenca, np.ones(j) / j, 'same'))

    mix = voz + fx + mus
    pico = np.abs(mix).max()
    if pico > .95:
        mix *= .95 / pico
    with wave.open(str(saida), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes())
    print(f"mix: {N / SR:.2f} s, {len(tempos['falas'])} falas, música: {musica or 'nenhuma'}")


if __name__ == '__main__':
    main()
