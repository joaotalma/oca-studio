#!/usr/bin/env python3
"""Gera as falas de um episódio com o VoiceStudio local (motor OmniVoice).

Uso: python scripts/gerar-vozes.py episodios/ep01 audio/ep01 [--refazer 12,14 | --refazer todas]

Cada fala é clonada do clipe de referência do personagem, em audio/vozes/. É isso que mantém a
mesma voz: descrição em texto e semente não bastam. Depois de gerar, confira com scripts/medir-vozes.py.
Licença do motor: CC-BY-NC, só para publicação sem monetização (ver docs/VOZES.md).
"""
import json, re, subprocess, sys, time, urllib.error, urllib.request, uuid
from pathlib import Path

API = 'http://127.0.0.1:3900'
RAIZ = Path(__file__).resolve().parent.parent
VOZES = {
    'tico': ('male, young adult, moderate pitch', 'Olha, eu vou te falar uma coisa: hoje é o meu primeiro dia, a moto é emprestada, mas já já eu resolvo tudo isso.'),
    'jao': ('male, middle-aged, very low pitch', 'Pode pegar a moto, meu irmão. Eu confio em você, mas qualquer prejuízo fica na tua conta, combinado?'),
    'lua': ('female, young adult, moderate pitch', 'Hoje eu saí mais cedo do trabalho, e está tudo ótimo comigo, de verdade. Você não mudou nada, sabia?'),
    'borracheiro': ('male, elderly, low pitch', 'O conserto do pneu custa cento e vinte reais, e eu já estou nessa borracharia faz mais de trinta anos.'),
}


def formulario(campos, arquivo):
    fronteira = uuid.uuid4().hex
    corpo = b''
    for chave, valor in campos.items():
        corpo += f'--{fronteira}\r\nContent-Disposition: form-data; name="{chave}"\r\n\r\n{valor}\r\n'.encode()
    corpo += f'--{fronteira}\r\nContent-Disposition: form-data; name="ref_audio"; filename="{arquivo.name}"\r\nContent-Type: audio/wav\r\n\r\n'.encode() + arquivo.read_bytes() + b'\r\n'
    return corpo + f'--{fronteira}--\r\n'.encode(), f'multipart/form-data; boundary={fronteira}'


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    pasta, saida = Path(sys.argv[1]), Path(sys.argv[2])
    refazer = set(sys.argv[sys.argv.index('--refazer') + 1].split(',')) if '--refazer' in sys.argv else set()
    saida.mkdir(parents=True, exist_ok=True)
    falas = re.findall(r'^\| `((\d+)_(\w+))\.mp3` \| [^|]+ \| ([^|]+?) \|', (pasta / 'falas.md').read_text(encoding='utf8'), re.M)
    for base, numero, voz, texto in falas:
        mp3 = saida / f'{base}.mp3'
        if mp3.exists() and 'todas' not in refazer and str(int(numero)) not in refazer:
            continue
        instruct, ref_texto = VOZES[voz]
        corpo, tipo = formulario({'text': texto, 'language': 'Portuguese', 'ref_text': ref_texto, 'instruct': instruct, 'seed': '7'}, RAIZ / 'audio' / 'vozes' / f'{voz}.wav')
        inicio = time.time()
        try:
            wav = urllib.request.urlopen(urllib.request.Request(API + '/generate', corpo, {'Content-Type': tipo}), timeout=1500).read()
        except urllib.error.HTTPError as erro:
            print('ERRO', base, erro.code, erro.read()[:400], flush=True)
            continue
        temporario = saida / f'{base}.wav'
        temporario.write_bytes(wav)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(temporario), '-b:a', '192k', str(mp3)], check=True)
        temporario.unlink()
        print(f'{base}: {time.time() - inicio:.1f}s', flush=True)
    print('fim', flush=True)


if __name__ == '__main__':
    main()
