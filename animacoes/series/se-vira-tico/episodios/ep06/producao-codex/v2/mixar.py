from pathlib import Path
import importlib.util,json,wave,math,subprocess,re
import numpy as np
R=Path('C:/Users/joaot/Projetos/se-vira-tico');E=R/'episodios/ep06/v2';A=R/'audio/ep06-v2';SR=48000
spec=importlib.util.spec_from_file_location('mx',R/'scripts/mixar.py');mx=importlib.util.module_from_spec(spec);spec.loader.exec_module(mx)
spec=importlib.util.spec_from_file_location('config',E/'mixagem.py');cfg=importlib.util.module_from_spec(spec);spec.loader.exec_module(cfg)
tl=json.loads((E/'timeline.json').read_text(encoding='utf8'));by={f['n']:f for f in tl['falas']};b=tl['beats'];c=cfg.config(mx,lambda n:by[n]['ini'],lambda n:by[n]['fim']);N=math.ceil(tl['duracao']*30)/30;size=round(N*SR)
voice=np.zeros((size,2));fx=np.zeros(size);music=np.zeros(size);presence=np.zeros(size)
for f in tl['falas']:
 a=mx.le_wav(A/'limpas'/f"{f['n']:02}.wav");a=a/max(float(np.sqrt(np.mean(a*a))),1e-5)*.085;i=round(f['ini']*SR);stop=min(size,i+len(a));a=a[:stop-i]
 pan=[.45,1] if f['n']==14 else [1,.45] if f['n']==15 else [1,1]
 voice[i:stop]+=a[:,None]*np.array(pan)[None,:];presence[i:stop]=1
def put(x,t,g):
 i=round(t*SR);last=min(size,i+len(x));fx[i:last]+=x[:last-i]*g
for t,fn,g in c['EFEITOS']:put(fn(),t,g)
for a,z,g in c['MOTORES']:put(mx.fx_motor(z-a),a,g)
tracks=mx.musicas();report={}
for name in set(x[2] for x in c['CUES']):
 x,bpm,_=tracks[name];ok,med=mx.mede_emenda(x,bpm);report[name]=dict(aprovado=bool(ok),**med)
 for start,end,n,g in c['CUES']:
  if n!=name or not ok:continue
  i=round(start*SR);j=min(size,round(end*SR));part=x[np.arange(j-i)%len(x)]*g;fade=min(round(.12*SR),len(part)//3);part[:fade]*=np.linspace(0,1,fade);part[-fade:]*=np.linspace(1,0,fade);music[i:j]+=part
# Média móvel O(N), equivalente ao ducking do motor, sem convolução longa.
k=round(.14*SR);padded=np.pad(presence,(k//2,k-1-k//2));acc=np.concatenate([[0.],np.cumsum(padded)]);duck=(acc[k:]-acc[:-k])/k
music*=.15-.085*duck
mix=voice+(fx+music)[:,None];peak=float(np.max(np.abs(mix)));mix*=min(1,.95/max(peak,1e-9))
sil=mix[round((b['silencio']+.03)*SR):round((by[16]['ini']-.03)*SR)];silence_peak=float(np.max(np.abs(sil)))
assert silence_peak==0,('Silêncio dramático invadido',silence_peak)
with wave.open(str(A/'mix.wav'),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((np.clip(mix,-1,1)*32767).astype(np.int16).tobytes())
(A/'trilha.json').write_text(json.dumps(dict(loops=report,silencio=dict(inicio=b['silencio'],fim=by[16]['ini'],pico=silence_peak),vozes_simultaneas=dict(lua_pan=[.45,1],tico_pan=[1,.45]),duracao=N),indent=2),encoding='utf8')
pre='acompressor=threshold=-26dB:ratio=3:attack=6:release=140:makeup=6dB,alimiter=limit=0.8:level=false'
r=subprocess.run(['ffmpeg','-hide_banner','-nostats','-i',str(A/'mix.wav'),'-af',pre+',loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json','-f','null','-'],capture_output=True,text=True,check=True);med=json.loads(re.search(r'\{[^{}]*"input_i"[^{}]*\}',r.stderr)[0])
af=pre+f",loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={med['input_i']}:measured_TP={med['input_tp']}:measured_LRA={med['input_lra']}:measured_thresh={med['input_thresh']}:offset={med['target_offset']}:linear=true"
subprocess.run(['ffmpeg','-y','-v','error','-i',str(A/'mix.wav'),'-af',af,'-ar','48000','-ac','2',str(A/'master.wav')],check=True)
print('Mix/master:',N,'s; silêncio real:',round(by[16]['ini']-b['silencio'],3),'s; panning leve nas falas simultâneas. Loops:',report)
