#!/usr/bin/env python3
"""Mede os trechos da narração e gera os tempos reais do vídeo.

Uso: python motor/audio/sincronizar.py series/misterios-do-brasil/roteiros/<slug> audio/<slug> [duracao_do_roteiro]
     python motor/audio/sincronizar.py episodios/ep01 audio/ep01   (de dentro de series/se-vira-tico)
Antes, no vídeo narrado: python motor/audio/fatiar-narracao.py (um arquivo NN.wav por fala em audio/<slug>).
No Tico, as falas já vêm uma por arquivo (NN_personagem.mp3).
Origem: o sincronizar do Tico e o do Plotline eram quase iguais e viraram este.

Escreve:
  <roteiro>/tempos.js      mapa de tempo do roteiro para o tempo real e volume de cada fala
  <audio>/limpas/NN.wav     falas sem o silêncio das pontas, usadas na mixagem
  <audio>/tempos.json       início e fim reais de cada fala, usados na mixagem

As falas seguem na ordem do roteiro. Cada fala ganha a duração do áudio e cada intervalo entre falas
mantém a duração do roteiro, limitado por MAX_INTERVALO. O filme inteiro é reamostrado por esse mapa,
então poses, cortes e legendas continuam presos às falas.
"""
import glob, json, os, re, subprocess, sys, wave
from pathlib import Path
import numpy as np

SR = 48000
LIMIAR = .012          # abaixo disto é silêncio de ponta
FOLGA = .03            # segundos preservados em cada ponta
MIN_INTERVALO = .12    # respiro mínimo entre duas falas
MAX_INTERVALO = None   # sem limite: pausas do roteiro são escolha de direção


def carrega(caminho):
    bruto = subprocess.run(['ffmpeg', '-v', 'error', '-i', caminho, '-ar', str(SR), '-ac', '1', '-f', 's16le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(bruto, dtype=np.int16).astype(np.float32) / 32768


def apara(a):
    janela = int(.01 * SR)
    rms = np.sqrt(np.convolve(a * a, np.ones(janela) / janela, 'same'))
    teto = max(LIMIAR, rms.max() * .05)
    voz = np.where(rms > teto)[0]
    i = max(0, voz[0] - int(FOLGA * SR))
    f = min(len(a), voz[-1] + int(FOLGA * SR))
    b = a[i:f].copy()
    borda = int(.008 * SR)
    b[:borda] *= np.linspace(0, 1, borda)
    b[-borda:] *= np.linspace(1, 0, borda)
    return b


def envelope(a, fps=30):
    passo = SR // fps
    v = np.array([np.sqrt(np.mean(a[i:i + passo] ** 2)) for i in range(0, len(a), passo)])
    return [round(float(x), 2) for x in np.clip(v / max(v.max(), 1e-4), 0, 1)]


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    pasta, audio = Path(sys.argv[1]), Path(sys.argv[2])
    limpas = audio / 'limpas'
    limpas.mkdir(exist_ok=True)
    fonte = (pasta / 'falas.js').read_text(encoding='utf8')
    falas = json.loads(re.search(r'const FALAS = (\[.*\]);?', fonte, re.S).group(1))
    # Episódio com elenco (Se Vira, Tico): a pasta tem ep.js e as falas se chamam NN_personagem.mp3.
    # Vídeo narrado: a pasta tem video.js e os trechos se chamam NN.wav (ou mp3, m4a, flac).
    episodio = (pasta / 'ep.js').exists()
    arquivos = {int(os.path.basename(f)[:2]): f for f in glob.glob(str(audio / '*'))
                if re.match(r'\d{2}(_[a-z0-9-]+)?\.(wav|mp3|m4a|flac)$', os.path.basename(f))}
    nos, envs, reais, T, fim_ant = [[0.0, 0.0]], {}, [], 0.0, 0.0
    for f in falas:
        a = apara(carrega(arquivos[f['n']]))
        with wave.open(str(limpas / f"{f['n']:02}.wav"), 'wb') as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
            w.writeframes((np.clip(a, -1, 1) * 32767).astype(np.int16).tobytes())
        dur = len(a) / SR
        vao = max(MIN_INTERVALO, f['ini'] - fim_ant)
        if MAX_INTERVALO:
            vao = min(vao, MAX_INTERVALO)
        ini = T + vao
        fim = ini + dur
        nos += [[max(f['ini'], fim_ant + .01), round(ini, 3)], [f['fim'], round(fim, 3)]]
        envs[f['n']] = envelope(a)
        real = {'n': f['n'], 'quem': f['quem'], 'fx': f.get('fx'), 'roteiro': [f['ini'], f['fim']], 'ini': round(ini, 3), 'fim': round(fim, 3)}
        if episodio:
            del real['fx']  # o Tico define os efeitos no mixagem.py do episódio, não por fala
        reais.append(real)
        T, fim_ant = fim, f['fim']
    # Padrão do Tico: 87 s, a duração do roteiro do ep. 1, que gerou os tempos.js dos episódios já feitos.
    padrao = 87.0 if episodio else fim_ant + .8
    duracao_roteiro = float(sys.argv[3]) if len(sys.argv) > 3 else padrao
    total = T + (duracao_roteiro - fim_ant)
    nos.append([duracao_roteiro, round(total, 3)])
    for a, b in zip(nos, nos[1:]):
        assert b[0] > a[0] and b[1] > a[1], ('mapa de tempo não crescente', a, b)
    (pasta / 'tempos.js').write_text('// Gerado por motor/audio/sincronizar.py. Não edite.\nconst TEMPOS = ' + json.dumps({'nos': nos, 'env': envs, 'duracao': round(total, 3)}, ensure_ascii=False) + ';\n', encoding='utf8')
    (audio / 'tempos.json').write_text(json.dumps({'nos': nos, 'falas': reais, 'duracao': round(total, 3)}, ensure_ascii=False, indent=1), encoding='utf8')
    fala = sum(r['fim'] - r['ini'] for r in reais)
    print(f'{len(reais)} falas; {fala:.1f} s de fala; filme de {total:.1f} s; {sum(len(r) for r in [f["texto"].split() for f in falas]) / total:.2f} palavras/s')
    for r in reais:
        a, b = r['roteiro']
        print(f"{r['n']:>2} {r['quem']:11} roteiro {a:5.1f}-{b:5.1f} ({b - a:.1f}s)  real {r['ini']:6.2f}-{r['fim']:6.2f} ({r['fim'] - r['ini']:.1f}s)")


if __name__ == '__main__':
    main()
