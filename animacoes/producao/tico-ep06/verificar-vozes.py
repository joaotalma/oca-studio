from faster_whisper import WhisperModel
from pathlib import Path
import json
p=Path('C:/Users/joaot/Projetos/se-vira-tico/audio/ep06')
m=WhisperModel('C:/Users/joaot/.cache/huggingface/hub/models--Systran--faster-whisper-small/snapshots/536b0662742c02347bc0e980a01041f333bce120',device='cpu',compute_type='int8',cpu_threads=4)
out=[]
for f in sorted((p/'limpas').glob('*.wav')):
 seg,info=m.transcribe(str(f),language='pt',beam_size=3,vad_filter=False,initial_prompt='Tico, Lua, Letícia. Português brasileiro. Trinta e quatro minutos. Cinema às oito.')
 text=' '.join(s.text.strip() for s in seg);out.append({'arquivo':f.name,'transcricao':text});print(f.name,text,flush=True)
(p/'verificacao-asr.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf8')
