from pathlib import Path
import subprocess,importlib.util,json,re,wave,math
import numpy as np
R=Path('C:/Users/joaot/Projetos/se-vira-tico');A=R/'audio/ep06-v2';D=A/'abertura-narrada';V=R/'render';E=R/'episodios/ep06/v2'
spec=importlib.util.spec_from_file_location('sync',R/'scripts/sincronizar.py');sync=importlib.util.module_from_spec(spec);spec.loader.exec_module(sync)
raw=sync.apara(sync.carrega(str(D/'narracao.mp3')));duration=len(raw)/48000;speed=max(1,duration/2.90)
with wave.open(str(D/'aparada.wav'),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(48000);w.writeframes((raw*32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg','-y','-v','error','-i',str(D/'aparada.wav'),'-af',f'atempo={speed}','-ar','48000','-ac','1',str(D/'pronta.wav')],check=True)
speech=sync.carrega(str(D/'pronta.wav'));speech=speech[:round(2.9*48000)];dur=len(speech)/48000
speech=speech/max(float(np.sqrt(np.mean(speech**2))),1e-6)*.15
with wave.open(str(A/'master.wav')) as w:sr=w.getframerate();channels=w.getnchannels();audio=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float64).reshape(-1,channels)/32768
start=round(.03*sr);end=start+len(speech);duck=np.ones(len(audio));duck[:end]=.32
recovery=round(.13*sr);duck[end:end+recovery]=np.linspace(.32,1,recovery);audio[:end+recovery]*=duck[:end+recovery,None]
audio[start:end]+=speech[:,None];peak=float(np.abs(audio[:end]).max())
if peak>.93:audio[:end]*=.93/peak
with wave.open(str(D/'master-com-abertura.wav'),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((np.clip(audio,-1,1)*32767).astype(np.int16).tobytes())
# Somente o áudio é codificado: a imagem é copiada sem alterações.
subprocess.run(['ffmpeg','-y','-v','error','-i',str(V/'ep06_v2_final.mp4'),'-i',str(D/'master-com-abertura.wav'),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-t','64.1','-movflags','+faststart',str(V/'ep06_v3_final.mp4')],check=True)
def vhash(file):return subprocess.run(['ffmpeg','-v','error','-i',str(file),'-map','0:v:0','-c','copy','-f','hash','-hash','sha256','-'],capture_output=True,text=True,check=True).stdout.strip()
assert vhash(V/'ep06_v2_final.mp4')==vhash(V/'ep06_v3_final.mp4'),'Imagem alterada'
al=json.loads((D/'alinhamento.json').read_text(encoding='utf8'));alignment=al['alignment'];chars=alignment['characters'];beg=alignment['character_start_times_seconds'];ends=alignment['character_end_times_seconds'];words=[];cur=None
for c,a,b in zip(chars,beg,ends):
 if c.isspace():cur=None;continue
 if cur is None:cur=dict(palavra='',ini=a,fim=b);words.append(cur)
 cur['palavra']+=c;cur['fim']=b
lo=words[0]['ini'];hi=words[-1]['fim']
for wd in words:wd['ini']=round(.03+(wd['ini']-lo)/(hi-lo)*dur,4);wd['fim']=round(.03+(wd['fim']-lo)/(hi-lo)*dur,4)
f=dict(n=0,ini=.03,fim=round(.03+dur,4),quem='Narrador',texto=al['texto'],semLegenda=True,palavras=words)
for ep in [E,R/'episodios/ep06']:
 p=ep/'falas.js';s=p.read_text(encoding='utf8');fs=json.loads(re.search(r'const FALAS = (\[.*\]);',s,re.S)[1]);fs=[x for x in fs if x['n']!=0];fs.insert(0,f);p.write_text('const FALAS = '+json.dumps(fs,ensure_ascii=False)+';\n',encoding='utf8')
 p=ep/'timeline.json';data=json.loads(p.read_text(encoding='utf8'));data['falas']=[f]+[x for x in data['falas'] if x['n']!=0];data['narracao_abertura']=dict(texto=al['texto'],voz='Plotline — narrador jovem',voiceId=al['voiceId'],ini=.03,fim=f['fim'],origem='Cópia independente da voz original já configurada no Blink, autorizada pelo pedido de narração desta abertura.',imagem_inalterada=True);p.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf8')
 p=ep/'roteiro.md';s=p.read_text(encoding='utf8');s=s.replace('· sem narrador','· narração somente na abertura');s+='\n\n### Narração acrescentada à abertura\n'+f"00:00.03–00:{f['fim']:05.2f} — Narrador: **{al['texto']}**\n\nVoz original jovem do Blink. A imagem e as falas do elenco foram preservadas.\n";p.write_text(s,encoding='utf8')
 for name in ['postagem.md','LEIA-ME.md','qa.md']:
  p=ep/name;s=p.read_text(encoding='utf8');s+='\n\nAtualização: narração de abertura “'+al['texto']+'”, com o narrador jovem original do Blink. Imagem preservada integralmente. 40 novos caracteres, 585 acumulados sob o limite aprovado de 1.000.\n';p.write_text(s,encoding='utf8')
 p=ep/'legendas.srt';s=p.read_text(encoding='utf8');blocks=s.strip().split('\n\n');blocks=[re.sub(r'^\d+',str(i+2),b) for i,b in enumerate(blocks)];last=round(f['fim']*1000);first=f'1\n00:00:00,030 --> 00:00:{last//1000:02},{last%1000:03}\n{al["texto"]}';p.write_text(first+'\n\n'+'\n\n'.join(blocks)+'\n',encoding='utf8')
(D/'qa-abertura.json').write_text(json.dumps(dict(ini=.03,fim=f['fim'],duracao_original=duration,atempo=speed,pico=peak,imagem_identica=True,restante_pcm_inalterado_a_partir_s=round((end+recovery)/sr,3),total_caracteres=585),indent=2),encoding='utf8')
print('Abertura inserida:',al['texto'],'| voz termina em',f['fim'],'s; Lua começa3,10s. Imagem idêntica.')
