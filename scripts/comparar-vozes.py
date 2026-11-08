#!/usr/bin/env python3
"""Compara as prévias do ElevenLabs com o clipe de referência de cada personagem e indica a mais parecida.

Uso: python scripts/comparar-vozes.py
Mede a altura (F0 mediana) e o timbre médio (energia em 24 faixas de 150 a 5000 Hz, em dB).
Distância = 3 x |log2(F0 prévia / F0 referência)| + distância de timbre (média das diferenças, em dB / 10).
A escolha por medida é um ponto de partida: quem julga o som é o autor.
"""
import glob, json, os, subprocess, sys
import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
from importlib import import_module
f0_mediana = import_module('medir-vozes').f0_mediana

SR = 16000
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REF = {'tico': 'tico', 'lua': 'lua', 'jao': 'jao', 'leticia': 'leticia', 'ceo': 'borracheiro', 'junior': 'vendedor'}


def timbre(caminho):
    bruto = subprocess.run(['ffmpeg', '-v', 'error', '-i', caminho, '-ar', str(SR), '-ac', '1', '-f', 's16le', '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(bruto, dtype=np.int16).astype(np.float32) / 32768
    n, passo = 1024, 256
    jan = np.hanning(n)
    quadros = [a[i:i + n] * jan for i in range(0, len(a) - n, passo)]
    esp = np.abs(np.fft.rfft(np.array(quadros), axis=1)) ** 2
    energia = esp.sum(1)
    esp = esp[energia > energia.max() * .02]
    freqs = np.fft.rfftfreq(n, 1 / SR)
    bordas = np.geomspace(150, 5000, 25)
    bandas = np.array([esp[:, (freqs >= bordas[i]) & (freqs < bordas[i + 1])].mean() for i in range(24)])
    db = 10 * np.log10(bandas + 1e-12)
    return db - db.mean()


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    escolha = {}
    for nome, ref in REF.items():
        r = os.path.join(RAIZ, 'audio', 'vozes', f'{ref}.wav')
        f0r, tr = f0_mediana(r)[0], timbre(r)
        linhas = []
        for p in sorted(glob.glob(os.path.join(RAIZ, 'audio', 'elevenlabs', 'previas', f'{nome}_*.mp3'))):
            f0p, tp = f0_mediana(p)[0], timbre(p)
            d = (3 * abs(np.log2(f0p / f0r)) if f0p and f0r else 9) + float(np.abs(tp - tr).mean()) / 10
            linhas.append((d, os.path.basename(p)[:-4].split('_')[1], f0p))
        linhas.sort()
        escolha[nome] = int(linhas[0][1])
        print(f'{nome:8} ref {ref:11} F0 {f0r or 0:5.0f} Hz | ' + '  '.join(f'#{i}: F0 {f or 0:4.0f} d={d:.2f}' for d, i, f in linhas))
    print(json.dumps(escolha))


if __name__ == '__main__':
    main()
