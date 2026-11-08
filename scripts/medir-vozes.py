#!/usr/bin/env python3
"""Mede a altura (F0 mediana, em Hz) de cada fala para detectar voz trocada.

Uso: python scripts/medir-vozes.py audio/ep01
Faixas por personagem em FAIXA; a emoção sobe a voz, então olhe também a dispersão por personagem.
Requer numpy e ffmpeg.
"""
import glob, os, statistics, subprocess, sys
import numpy as np

SR = 16000
FAIXA = {'tico': (85, 195), 'jao': (70, 165), 'borracheiro': (85, 195), 'lua': (180, 340), 'leticia': (170, 380), 'vendedor': (85, 195), 'marlene': (150, 300), 'ceo': (100, 210), 'junior': (120, 260)}


def f0_mediana(caminho):
    bruto = subprocess.run(['ffmpeg', '-v', 'error', '-i', caminho, '-ar', str(SR), '-ac', '1', '-f', 's16le', '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(bruto, dtype=np.int16).astype(np.float32) / 32768
    tam, passo, res = int(.04 * SR), int(.01 * SR), []
    limiar = max(.02, np.abs(a).max() * .12)
    for i in range(0, len(a) - tam, passo):
        q = a[i:i + tam] - a[i:i + tam].mean()
        if np.sqrt((q * q).mean()) < limiar:
            continue
        c = np.correlate(q, q, 'full')[tam - 1:]
        lo, hi = SR // 400, SR // 60
        k = lo + int(np.argmax(c[lo:hi]))
        if c[k] > .45 * c[0]:
            res.append(SR / k)
    return (statistics.median(res) if len(res) >= 5 else None), len(res)


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    por = {}
    erros = 0
    for f in sorted(glob.glob(os.path.join(sys.argv[1], '*.mp3'))):
        nome = os.path.basename(f)[:-4]
        voz = nome.split('_', 1)[1]
        f0, n = f0_mediana(f)
        lo, hi = FAIXA.get(voz, (0, 999))
        ok = f0 is not None and lo <= f0 <= hi
        erros += not ok
        por.setdefault(voz, []).append(f0 or 0)
        print(f"{nome:18} {('%.0f Hz' % f0) if f0 else 'sem medida':>10} {'ok' if ok else 'FORA DA FAIXA'}")
    print('---')
    for voz, xs in por.items():
        v = [x for x in xs if x]
        print(f"{voz:12} falas={len(xs)} mediana={statistics.median(v):.0f} Hz min={min(v):.0f} max={max(v):.0f}")
    print('falas fora da faixa:', erros)
    return 1 if erros else 0


if __name__ == '__main__':
    sys.exit(main())
