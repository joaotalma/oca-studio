"""Divide a geração ElevenLabs pelo alinhamento real, sem adivinhar as pausas."""
import json, re, pathlib, subprocess, sys
folder=pathlib.Path(sys.argv[1]); audio=pathlib.Path(sys.argv[2])
falas=json.loads(re.search(r'const FALAS = (\[.*\]);?',(folder/'falas.js').read_text(encoding='utf-8'),re.S).group(1))
data=json.loads((audio/'alinhamento-completo.json').read_text(encoding='utf-8')); al=data['alignment']
text='\n'.join(f['texto'] for f in falas)
if text!=data['texto'] or ''.join(al['characters'])!=text:raise ValueError('Alinhamento não corresponde literalmente ao roteiro. Conferir antes de cortar.')
offset=0
for f in falas:
    size=len(f['texto']);start=max(0,al['character_start_times_seconds'][offset]-.025)
    end=al['character_end_times_seconds'][offset+size-1]+.035
    subprocess.run(['ffmpeg','-v','error','-y','-ss',str(start),'-i',str(audio/'narracao.mp3'),'-t',str(end-start),'-ar','48000','-ac','1',str(audio/f"{f['n']:02}.wav")],check=True)
    offset+=size+1
print(f'{len(falas)} falas divididas com alinhamento real.')
