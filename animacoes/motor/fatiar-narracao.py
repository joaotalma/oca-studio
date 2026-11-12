#!/usr/bin/env python3
"""Divide a narração gravada de uma vez em um arquivo por fala, cortando nas pausas.

Uso: python motor/fatiar-narracao.py audio/<slug>/narracao.wav series/misterios-do-brasil/roteiros/<slug>/falas.js audio/<slug>

Escolhe as N-1 pausas mais longas, para N falas. Para com erro se houver menos pausas que o necessário
e, no fim, marca os trechos com ritmo estranho, que costumam indicar corte no lugar errado.
Ao gravar: leia na ordem do roteiro e faça uma pausa clara, de meio segundo, entre as falas.
"""
import json, re, subprocess, sys, wave
from pathlib import Path
import numpy as np

SR = 48000
JANELA = .02           # segundos por medida de volume
PAUSA_MIN = .18        # abaixo disto não conta como pausa
PPM_ESTRANHO = (70, 280)  # palavras por minuto fora desta faixa merecem conferência


def carrega(caminho):
    bruto = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(caminho), '-ar', str(SR), '-ac', '1', '-f', 's16le', '-'],
                           capture_output=True, check=True).stdout
    return np.frombuffer(bruto, dtype=np.int16).astype(np.float32) / 32768


def pausas(a):
    """Devolve (inicio, fim) em amostras de cada silêncio entre trechos de voz."""
    p = int(JANELA * SR)
    rms = np.array([np.sqrt(np.mean(a[i:i + p] ** 2)) for i in range(0, len(a) - p, p)])
    limiar = max(.006, np.percentile(rms, 95) * .07)
    voz = rms > limiar
    if not voz.any():
        sys.exit('Erro: não encontrei voz no arquivo. Confira a gravação.')
    prim, ult = np.where(voz)[0][[0, -1]]
    achadas, i = [], prim
    while i <= ult:
        if voz[i]:
            i += 1
            continue
        j = i
        while j <= ult and not voz[j]:
            j += 1
        if (j - i) * JANELA >= PAUSA_MIN:
            achadas.append((i * p, j * p))
        i = j
    return achadas, prim * p, (ult + 1) * p


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    narracao, arq_falas, saida = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
    fonte = arq_falas.read_text(encoding='utf8')
    falas = json.loads(re.search(r'const FALAS = (\[.*\]);?', fonte, re.S).group(1))
    a = carrega(narracao)
    achadas, ini, fim = pausas(a)
    faltam = len(falas) - 1
    if len(achadas) < faltam:
        sys.exit(f'Erro: o roteiro tem {len(falas)} falas e precisa de {faltam} pausas, mas achei {len(achadas)}. '
                 'Grave de novo com uma pausa clara entre as falas.')
    if len(achadas) > faltam:
        print(f'Aviso: achei {len(achadas)} pausas e usei as {faltam} mais longas. Confira os trechos abaixo.')
    cortes = sorted(sorted(achadas, key=lambda x: x[1] - x[0], reverse=True)[:faltam])
    bordas = [(ini, cortes[0][0] if cortes else fim)]
    for k, (_, f) in enumerate(cortes):
        bordas.append((f, cortes[k + 1][0] if k + 1 < len(cortes) else fim))
    estranhos = 0
    for fala, (i, f) in zip(falas, bordas):
        trecho = a[i:f]
        with wave.open(str(saida / f"{fala['n']:02}.wav"), 'wb') as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
            w.writeframes((np.clip(trecho, -1, 1) * 32767).astype(np.int16).tobytes())
        dur = len(trecho) / SR
        palavras = len(fala['texto'].split())
        ppm = palavras / dur * 60
        alerta = palavras >= 3 and not PPM_ESTRANHO[0] <= ppm <= PPM_ESTRANHO[1]
        estranhos += alerta
        print(f"{fala['n']:>2}  {dur:5.2f} s  {palavras:>2} palavras  {ppm:4.0f} ppm{'  CONFERIR' if alerta else ''}  {fala['texto'][:42]}")
    if estranhos:
        print(f'Aviso: {estranhos} trecho(s) com ritmo estranho. O corte pode ter caído no lugar errado.')


if __name__ == '__main__':
    main()
