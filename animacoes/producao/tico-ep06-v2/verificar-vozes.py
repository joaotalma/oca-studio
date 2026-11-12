from pathlib import Path
from faster_whisper import WhisperModel
import json,sys
sys.stdout.reconfigure(encoding='utf8')
A=Path('C:/Users/joaot/Projetos/se-vira-tico/audio/ep06-v2');m=WhisperModel('C:/Users/joaot/.cache/huggingface/hub/models--Systran--faster-whisper-small/snapshots/536b0662742c02347bc0e980a01041f333bce120',device='cpu',compute_type='int8',cpu_threads=2)
out=[]
for n in [1,12,13,14,15,16,17,18,19,20]:
 f=A/'limpas'/f'{n:02}.wav';segs,info=m.transcribe(str(f),language='pt',beam_size=3,vad_filter=False,initial_prompt='Tico. Lua. Doces da Lua. Porto Alegre. Curso de confeitaria.')
 text=' '.join(s.text.strip() for s in segs);out.append(dict(n=n,arquivo=f.name,transcricao=text));print(n,text,flush=True)
(A/'verificacao-asr.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf8')
