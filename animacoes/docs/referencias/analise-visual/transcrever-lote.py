import os, json, pathlib, time
os.environ['HF_HUB_OFFLINE']='1'
from faster_whisper import WhisperModel
root=pathlib.Path('.tmp/referencias-13')
items=json.loads((root/'manifest.json').read_text(encoding='utf-8'))
model=WhisperModel(r'C:/Users/joaot/.cache/huggingface/hub/models--Systran--faster-whisper-small/snapshots/536b0662742c02347bc0e980a01041f333bce120',device='cpu',compute_type='int8',cpu_threads=8)
for item in items:
    target=root/(item['id']+'.json')
    if target.exists(): continue
    print('INICIO',item['id'],flush=True)
    segments,info=model.transcribe(item['path'],language='pt',beam_size=1,vad_filter=True)
    result=[]
    with (root/(item['id']+'.txt')).open('w',encoding='utf-8') as out:
        for seg in segments:
            result.append(dict(start=round(seg.start,2),end=round(seg.end,2),text=seg.text.strip()))
            out.write(f'[{int(seg.start)//60:02}:{int(seg.start)%60:02}] {seg.text.strip()}\n');out.flush()
    target.write_text(json.dumps(dict(id=item['id'],segments=result,words=sum(len(x['text'].split()) for x in result)),ensure_ascii=False,indent=2),encoding='utf-8')
    print('FIM',item['id'],flush=True)
