from pathlib import Path
import subprocess,json,wave,re,shutil,zipfile,hashlib
import numpy as np
R=Path('C:/Users/joaot/Projetos/se-vira-tico');E=R/'episodios/ep06/v2';A=R/'audio/ep06-v2';D=A/'abertura-enfatica';V=R/'render';G=Path('G:/Meu Drive/Se Vira, Tico/ep06_instagram');speed=1.67
subprocess.run(['ffmpeg','-y','-v','error','-i',str(D/'interpretacao.wav'),'-af',f'atempo={speed}','-ar','48000','-ac','1',str(D/'interpretacao-3s.wav')],check=True)
def read(p):
 with wave.open(str(p)) as w:return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float64).reshape(-1,w.getnchannels())/32768
voice=read(D/'interpretacao-3s.wav')[:,0];ratio=len(voice)/len(read(D/'interpretacao.wav'));SR=48000;finish=.03+len(voice)/SR;assert finish<3,finish
base=read(A/'master.wav');mix=base.copy();start=round(.03*SR);end=start+len(voice);restore=min(round(.13*SR),3*SR-end);duck=np.ones(end+restore)*.28;duck[end:]=np.linspace(.28,1,restore);mix[:len(duck)]*=duck[:,None];mix[start:end]+=voice[:,None]
assert np.array_equal(mix[3*SR:],base[3*SR:])
with wave.open(str(D/'master-3s.wav'),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((np.clip(mix,-1,1)*32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg','-y','-v','error','-i',str(V/'ep06_v2_final.mp4'),'-i',str(D/'master-3s.wav'),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-t','64.1','-movflags','+faststart',str(V/'ep06_v5_final.mp4')],check=True)
def vhash(p):return subprocess.run(['ffmpeg','-v','error','-i',str(p),'-map','0:v:0','-c','copy','-f','hash','-hash','sha256','-'],capture_output=True,text=True,check=True).stdout.strip()
assert vhash(V/'ep06_v5_final.mp4')==vhash(V/'ep06_v2_final.mp4')
cfg=json.loads((D/'alinhamento.json').read_text(encoding='utf8'))
for ep in [E,R/'episodios/ep06']:
 p=ep/'timeline.json';tl=json.loads(p.read_text(encoding='utf8'));oldintro=tl['abertura_enfatica']['intro'];delta=oldintro-3;f0=next(f for f in tl['falas'] if f['n']==0)
 for word in f0['palavras']:
  word['ini']=round(.03+(word['ini']-.03)*ratio,4);word['fim']=round(.03+(word['fim']-.03)*ratio,4)
 f0['ini']=.03;f0['fim']=round(finish,4)
 for f in tl['falas']:
  if f['n']==0:continue
  f['ini']=round(f['ini']-delta,4);f['fim']=round(f['fim']-delta,4)
  for word in f['palavras']:word['ini']=round(word['ini']-delta,4);word['fim']=round(word['fim']-delta,4)
 for k,v in tl['beats'].items():
  if k!='abertura':tl['beats'][k]=round(v-delta,4)
 tl['duracao']=64.072;tl['abertura_enfatica'].update(intro=3,shift_restante=0,velocidade_audio=speed,fim_frase=f0['fim'],voz_sem_aceleracao=False);tl['narracao_abertura'].update(ini=.03,fim=f0['fim']);p.write_text(json.dumps(tl,ensure_ascii=False,indent=2),encoding='utf8')
 p=ep/'falas.js';fs=json.loads(re.search(r'const FALAS = (\[.*\]);',p.read_text(encoding='utf8'),re.S)[1]);fs=[f0]+[f for f in fs if f['n']!=0];p.write_text('const FALAS = '+json.dumps(fs,ensure_ascii=False)+';\n',encoding='utf8')
 p=ep/'tempos.js';tp=json.loads(re.search(r'const TEMPOS = (\{.*\});',p.read_text(encoding='utf8'),re.S)[1]);tp['nos']=[[0,0],[64.072,64.072]];tp['duracao']=64.072;p.write_text('const TEMPOS = '+json.dumps(tp)+';\n',encoding='utf8')
 def movetime(m):
  t=int(m[1])*60+float(m[2]);t=t-delta if t>=oldintro-.001 else t;return f'{int(t)//60:02}:{t%60:05.2f}'
 for name in ['roteiro.md','cenas.md']:
  p=ep/name;s=p.read_text(encoding='utf8');s=re.sub(r'(\d{2}):(\d{2}\.\d{2})',movetime,s);s=s.replace('65.972s','64.072s').replace('65.972 s','64.072 s');s+='\n\nAtualização de ritmo: a mesma interpretação enfática foi ajustada para a frase terminar em '+f'{finish:.2f}'+'s, antes dos3s. A abertura voltou a3s e o restante do episódio voltou aos tempos originais.\n';s=s.replace('antes dos3s','antes dos 3 s').replace('voltou a3s','voltou a 3 s');p.write_text(s,encoding='utf8')
 for name in ['postagem.md','LEIA-ME.md']:
  p=ep/name;s=p.read_text(encoding='utf8').split('Abertura regravada com ênfase')[0];s=s.replace('66 s','64,1 s');s+='\n\nAbertura com a interpretação enfática aprovada, agora com a frase completa antes de3s. Imagem integralmente preservada. Sem nova geração ou gasto de créditos.\n';p.write_text(s.replace('antes de3s','antes de 3 s'),encoding='utf8')
 def stamp(t):
  n=round(t*1000);return f'{n//3600000:02}:{n//60000%60:02}:{n//1000%60:02},{n%1000:03}'
 cues=[(.03,finish,cfg['texto'])]
 for f in tl['falas']:
  if f['n']==0 or f['n']==15:continue
  if f['n']==14:cues.append((tl['beats']['juntos'],tl['beats']['silencio']+.8,'Lua: Eu vou pra outro estado.\nTico: Eu te amo.'));continue
  ws=f['palavras']
  for i in range(0,len(ws),3):w=ws[i:i+3];cues.append((w[0]['ini'],w[-1]['fim'],' '.join(x['palavra'] for x in w)))
 cues.sort();(ep/'legendas.srt').write_text('\n\n'.join(f'{i}\n{stamp(a)} --> {stamp(b)}\n{t}' for i,(a,b,t) in enumerate(cues,1))+'\n',encoding='utf8')
(D/'qa-3s.json').write_text(json.dumps(dict(fim_frase=finish,abertura_s=3,duracao_final_s=64.1,imagem_identica=True,restante_pcm_identico=True,atempo=speed,novos_creditos=0),indent=2),encoding='utf8')
print('Frase termina em',round(finish,3),'s; imagem inteira idêntica; restante do áudio preservado; nenhum crédito consumido.')
