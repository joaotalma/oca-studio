from pathlib import Path
import importlib.util,json,wave,math,subprocess
import numpy as np
S=Path(__file__).parent;R=Path('C:/Users/joaot/Projetos/se-vira-tico');E=R/'episodios/ep06/v2';A=R/'audio/ep06-v2';(A/'limpas').mkdir(exist_ok=True)
spec=importlib.util.spec_from_file_location('sync',R/'scripts/sincronizar.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
raw=json.loads((S/'falas.json').read_text(encoding='utf8'));by={f['n']:f for f in raw};dur={};env={};wordraw={}
for f in raw:
 n=f['n'];source=A/f"{n:02}_{f['voz']}.mp3"
 if n>=12:
  (A/'ritmo').mkdir(exist_ok=True);slow=A/'ritmo'/f'{n:02}.wav'
  if not slow.exists():subprocess.run(['ffmpeg','-y','-v','error','-i',str(source),'-af','atempo=0.85','-ar','48000','-ac','1',str(slow)],check=True)
  source=slow
 a=m.apara(m.carrega(str(source)));dur[n]=len(a)/m.SR;env[n]=m.envelope(a)
 with wave.open(str(A/'limpas'/f'{n:02}.wav'),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(m.SR);w.writeframes((np.clip(a,-1,1)*32767).astype(np.int16).tobytes())
 wordraw[n]=json.loads((A/'alinhamento'/f'{n:02}.json').read_text(encoding='utf8'))['palavras']
falas=[];B={};ends={};starts={}
def add(n,t):
 f=by[n];t=round(t,3);end=round(t+dur[n],3);al=wordraw[n];lo=al[0]['ini'];hi=al[-1]['fim'];ws=[dict(palavra=w['palavra'],ini=round(t+(w['ini']-lo)/(hi-lo)*dur[n],4),fim=round(t+(w['fim']-lo)/(hi-lo)*dur[n],4)) for w in al]
 out=dict(n=n,ini=t,fim=end,quem=f['quem'],texto=f['texto'],palavras=ws)
 if n>=12:out['legendaY']=1490
 if n in (14,15):out['semLegenda']=True
 falas.append(out);starts[n]=t;ends[n]=end;return end
B['abertura']=0;add(1,3.1);add(2,ends[1]+.5);B['turbo']=ends[2]+.12;B['traseira']=B['turbo']+.38;add(3,B['traseira']+.5)
B['chegada']=ends[3]+1.1;add(4,B['chegada']+.35);add(5,ends[4]+.55);add(6,ends[5]+.8);add(7,ends[6]+.7);add(8,ends[7]+.6)
B['dias']=ends[8]+3.1;add(9,B['dias']+.4);add(10,ends[9]+.4);B['agenda']=ends[10]+.12;add(11,ends[10]+1.4)
B['cinema']=ends[11]+1.3;add(12,B['cinema']+3.7);add(13,ends[12]+.7);B['juntos']=ends[13]+1.6;add(14,B['juntos']);add(15,B['juntos']+.06)
B['silencio']=max(ends[14],ends[15]);add(16,B['silencio']+1.15);B['doce']=starts[16]+.18;add(17,ends[16]+1.35);add(18,ends[17]+1.1);add(19,ends[18]+1.05);add(20,ends[19]+1.6)
B['encerramento']=ends[20]+3;total=round(B['encerramento']+4.3,3);B['fim']=total
falas.sort(key=lambda f:(f['ini'],f['n']))
(E/'falas.js').write_text('const FALAS = '+json.dumps(falas,ensure_ascii=False)+';\n',encoding='utf8')
(E/'tempos.js').write_text('const TEMPOS = '+json.dumps(dict(nos=[[0,0],[total,total]],env=env,duracao=total))+';\n',encoding='utf8')
(E/'beats.js').write_text('const B = '+json.dumps(B)+';\n',encoding='utf8')
tempos=dict(nos=[[0,0],[total,total]],falas=[dict(n=f['n'],quem=f['quem'],roteiro=[f['ini'],f['fim']],ini=f['ini'],fim=f['fim']) for f in falas],duracao=total)
(A/'tempos.json').write_text(json.dumps(tempos,ensure_ascii=False,indent=1),encoding='utf8')
(E/'timeline.json').write_text(json.dumps(dict(duracao=total,beats=B,falas=falas,decisoes=['Entrega preservada como motivação do convite.','Farol com carro de costas, sem humanos visíveis.','Sem compra de ingressos.','Cinema sentado com pernas completas.','Declaração e mudança simultâneas, legendadas separadamente.','Silêncio real de 1,15 segundo antes do disfarce.','Tico recebe a notícia do curso neste episódio.','Sem votação; última cartela TEMPORADA 2 — EM BREVE, sem data.']),ensure_ascii=False,indent=2),encoding='utf8')
html=(E/'film.html').read_text(encoding='utf8')
if 'beats.js' not in html:html=html.replace('<script src="ep.js">','<script src="beats.js"></script><script src="ep.js">')
(E/'film.html').write_text(html,encoding='utf8')
print('TIMELINE REAL:',total,'s;',sum(dur.values()),'s de falas; simultâneas:',B['juntos'],'; silêncio:',B['silencio'],'até',starts[16]);print(json.dumps(B,ensure_ascii=False))
