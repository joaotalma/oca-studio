from pathlib import Path
import json,importlib.util,subprocess,wave,re,shutil
import numpy as np
R=Path('C:/Users/joaot/Projetos/se-vira-tico');A=R/'audio/ep06-v2';D=A/'abertura-enfatica';E=R/'episodios/ep06/v2';SR=48000;INTRO=4.9;SHIFT=1.9
spec=importlib.util.spec_from_file_location('sync',R/'scripts/sincronizar.py');sync=importlib.util.module_from_spec(spec);spec.loader.exec_module(sync)
cfg=json.loads((D/'alinhamento.json').read_text(encoding='utf8'));a=sync.carrega(str(D/'narracao.mp3')).astype(np.float64)
# Interpretação nova do modelo expressivo; reforço suave dos pronomes, sem acelerar a voz.
gain=np.ones(len(a))
for lo,hi in [(.144,.760),(2.786,3.846)]:
 lo,hi=round(lo*SR),min(len(a),round(hi*SR));r=min(round(.02*SR),(hi-lo)//3);g=np.ones(hi-lo)*10**(2.2/20);g[:r]=np.linspace(1,g[0],r);g[-r:]=np.linspace(g[-1],1,r);gain[lo:hi]*=g
a*=gain
inserts=[(.795,.12),(3.866,.12)]
for where,length in reversed(inserts):i=round(where*SR);a=np.concatenate([a[:i],np.zeros(round(length*SR)),a[i:]])
a=a/max(float(np.sqrt(np.mean(a*a))),1e-6)*.15;a*=min(1,.86/max(float(np.abs(a).max()),1e-9))
with wave.open(str(D/'interpretacao.wav'),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((np.clip(a,-1,1)*32767).astype(np.int16).tobytes())
with wave.open(str(A/'master.wav')) as w:base=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float64).reshape(-1,2)/32768
subprocess.run(['ffmpeg','-y','-v','error','-t','3','-i',str(A/'master.wav'),'-af',f'atempo={3/INTRO}','-ar',str(SR),'-ac','2',str(D/'trilha-abertura.wav')],check=True)
with wave.open(str(D/'trilha-abertura.wav')) as w:bed=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float64).reshape(-1,2)/32768
intro=np.zeros((round(INTRO*SR),2));intro[:min(len(bed),len(intro))]=bed[:len(intro)];duck=np.ones(len(intro))*.28;restore=round(.12*SR);duck[-restore:]=np.linspace(.28,1,restore);intro*=duck[:,None]
# Restaura continuidade musical na borda do corte. O restante do PCM é copiado literalmente.
tail=round(.06*SR);fade=np.linspace(0,1,tail)[:,None];intro[-tail:]=intro[-tail:]*(1-fade)+base[3*SR-tail:3*SR]*fade
start=round(.03*SR);assert start+len(a)<len(intro);intro[start:start+len(a)]+=a[:,None];mix=np.concatenate([intro,base[3*SR:]])
with wave.open(str(D/'master-enfatico.wav'),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((np.clip(mix,-1,1)*32767).astype(np.int16).tobytes())
assert np.array_equal(mix[len(intro):],base[3*SR:])
al=cfg['alignment'];words=[];cur=None
for c,t,z in zip(al['characters'],al['character_start_times_seconds'],al['character_end_times_seconds']):
 if c.isspace():cur=None;continue
 if cur is None:cur=dict(palavra='',ini=t,fim=z);words.append(cur)
 cur['palavra']+=c;cur['fim']=z
words=[w for w in words if not w['palavra'].startswith('[')]
for wd in words:
 for key in ['ini','fim']:v=wd[key];wd[key]=round(.03+v+sum(dt for cut,dt in inserts if v>=cut),4)
f_real=dict(n=0,ini=.03,fim=round(.03+len(a)/SR,4),quem='Narrador',texto=cfg['texto'],semLegenda=True,palavras=words)
for ep in [E,R/'episodios/ep06']:
 backup=ep/'abertura-anterior';backup.mkdir(exist_ok=True)
 for name in ['tempos.js','falas.js','timeline.json','roteiro.md','cenas.md','legendas.srt']:
  if not (backup/name).exists():shutil.copyfile(ep/name,backup/name)
 p=ep/'tempos.js';s=p.read_text(encoding='utf8');tp=json.loads(re.search(r'const TEMPOS = (\{.*\});',s,re.S)[1]);tp['nos']=[[0,0],[3,INTRO],[64.072,65.972]];tp['duracao']=65.972;p.write_text('const TEMPOS = '+json.dumps(tp)+';\n',encoding='utf8')
 p=ep/'falas.js';fs=json.loads(re.search(r'const FALAS = (\[.*\]);',p.read_text(encoding='utf8'),re.S)[1]);f_dir=json.loads(json.dumps(f_real));f_dir['ini']*=3/INTRO;f_dir['fim']*=3/INTRO
 for word in f_dir['palavras']:word['ini']*=3/INTRO;word['fim']*=3/INTRO
 fs=[f_dir]+[f for f in fs if f['n']!=0];p.write_text('const FALAS = '+json.dumps(fs,ensure_ascii=False)+';\n',encoding='utf8')
 p=ep/'timeline.json';tl=json.loads(p.read_text(encoding='utf8'))
 if not tl.get('abertura_enfatica'):
  tl['duracao']+=SHIFT
  for f in tl['falas']:
   if f['n']==0:continue
   f['ini']+=SHIFT;f['fim']+=SHIFT
   for word in f['palavras']:word['ini']+=SHIFT;word['fim']+=SHIFT
  for key,value in tl['beats'].items():
   if key!='abertura':tl['beats'][key]=value+SHIFT
 tl['falas']=[f_real]+[f for f in tl['falas'] if f['n']!=0];tl['abertura_enfatica']=dict(intro=INTRO,shift_restante=SHIFT,modelo=cfg['modelo'],palavras_fortes=['ELE','MAS ELA'],pausas_adicionais_s=[.12,.12],voz_sem_aceleracao=True);tl['narracao_abertura'].update(texto=cfg['texto'],ini=.03,fim=f_real['fim']);p.write_text(json.dumps(tl,ensure_ascii=False,indent=2),encoding='utf8')
 def shift_times(match):
  minutes,seconds=int(match[1]),float(match[2]);t=minutes*60+seconds;t=t+SHIFT if t>=3 else t;return f'{int(t)//60:02}:{t%60:05.2f}'
 for name in ['roteiro.md','cenas.md']:
  p=ep/name;s=p.read_text(encoding='utf8').split('### Narração acrescentada à abertura')[0];s=re.sub(r'(\d{2}):(\d{2}\.\d{2})',shift_times,s);s=s.replace('64.072s','65.972s').replace('64.072 s','65.972 s');s+='\n\nAbertura com interpretação contrastante: **ELE… vai se declarar. MAS ELA… vai embora.** Pronomes destacados, pausas curtas, sem acelerar a voz. A abertura dura4,9s; demais cenas e falas foram preservadas, deslocadas1,9s.\n';s=s.replace('dura4,9s','dura 4,9 s').replace('deslocadas1,9s','deslocadas 1,9 s');p.write_text(s,encoding='utf8')
 p=ep/'legendas.srt';blocks=p.read_text(encoding='utf8').strip().split('\n\n');blocks=blocks[1:]
 def move_srt(m):
  t=int(m[1])*3600000+int(m[2])*60000+int(m[3])*1000+int(m[4])+1900;return f'{t//3600000:02}:{t//60000%60:02}:{t//1000%60:02},{t%1000:03}'
 blocks=[re.sub(r'(\d{2}):(\d{2}):(\d{2}),(\d{3})',move_srt,b) for b in blocks];last=round(f_real['fim']*1000);first=f'1\n00:00:00,030 --> 00:00:{last//1000:02},{last%1000:03}\n{cfg["texto"]}';p.write_text(first+'\n\n'+'\n\n'.join(blocks)+'\n',encoding='utf8')
 p=ep/'falas.md';s=p.read_text(encoding='utf8');s=re.sub(r'(?m)^(\| `00_[^`]+` \| Narrador \| )[^|]+( \|)$',lambda m:m[1]+cfg['texto']+m[2],s);p.write_text(s,encoding='utf8')
(D/'qa-entonacao.json').write_text(json.dumps(dict(intro_s=INTRO,fim_voz=f_real['fim'],duracao_final_s=66,restante_pcm_identico=True,modelo=cfg['modelo'],pausas_ms=[120,120],reforco_pronomes_db=2.2,acumulado=cfg['acumulado']),indent=2),encoding='utf8')
print('Interpretação enfática pronta; abertura4,9s, final66s, restante do PCM preservado.')
