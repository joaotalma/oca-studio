#!/usr/bin/env python3
"""Gera as falas de um episódio com o VoiceStudio local (motor OmniVoice).

Uso: python scripts/gerar-vozes.py episodios/ep01 audio/ep01 [--refazer 12,14]

Lê falas.md, usa uma voz e uma semente fixas por personagem e pula arquivos que já existem.
Licença do motor: CC-BY-NC, só para publicação sem monetização (ver docs/VOZES.md).
"""
import json, re, subprocess, sys, time, urllib.error, urllib.request
from pathlib import Path

API = 'http://127.0.0.1:3900'
VOZES = {
    'tico': ('homem brasileiro de 31 anos, voz cansada e irônica, humor seco', 3101),
    'lua': ('mulher brasileira de 30 anos, voz calorosa e expressiva, fala rápida', 3002),
    'jao': ('homem brasileiro de 33 anos, voz grave e firme, afetuosa', 3303),
    'borracheiro': ('homem brasileiro de 55 anos, voz rouca e resignada', 5504),
}


def chamar(caminho, corpo=None):
    dados = json.dumps(corpo).encode() if corpo is not None else None
    pedido = urllib.request.Request(API + caminho, data=dados, headers={'Content-Type': 'application/json'})
    return urllib.request.urlopen(pedido, timeout=1500).read()


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    pasta, saida = Path(sys.argv[1]), Path(sys.argv[2])
    refazer = set(sys.argv[sys.argv.index('--refazer') + 1].split(',')) if '--refazer' in sys.argv else set()
    saida.mkdir(parents=True, exist_ok=True)
    ativo = json.loads(chamar('/engines'))['tts']['active']
    if ativo != 'omnivoice':
        chamar('/engines/select', {'family': 'tts', 'backend_id': 'omnivoice'})
        print('motor ativo trocado de', ativo, 'para omnivoice', flush=True)
    falas = re.findall(r'^\| `((\d+)_(\w+))\.mp3` \| [^|]+ \| ([^|]+?) \|', (pasta / 'falas.md').read_text(encoding='utf8'), re.M)
    for base, numero, voz, texto in falas:
        mp3 = saida / f'{base}.mp3'
        if mp3.exists() and str(int(numero)) not in refazer:
            continue
        descricao, semente = VOZES[voz]
        inicio = time.time()
        try:
            wav = chamar('/v1/audio/speech', {'model': 'tts-1', 'input': texto, 'voice': 'alloy', 'language': 'pt-BR', 'description': descricao, 'seed': semente, 'response_format': 'wav'})
        except urllib.error.HTTPError as erro:
            print('ERRO', base, erro.code, erro.read()[:300], flush=True)
            continue
        temporario = saida / f'{base}.wav'
        temporario.write_bytes(wav)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(temporario), '-b:a', '192k', str(mp3)], check=True)
        temporario.unlink()
        print(f'{base}: {time.time() - inicio:.1f}s', flush=True)
    print('fim', flush=True)


if __name__ == '__main__':
    main()
