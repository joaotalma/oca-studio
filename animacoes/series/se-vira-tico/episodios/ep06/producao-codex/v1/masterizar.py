from pathlib import Path
import subprocess,json,re
ROOT=Path('C:/Users/joaot/Projetos/se-vira-tico');A=ROOT/'audio/ep06'
duration=61.233333333
pre='acompressor=threshold=-26dB:ratio=3:attack=6:release=140:makeup=6dB,alimiter=limit=0.8:level=false'
cmd=['ffmpeg','-hide_banner','-nostats','-t',str(duration),'-i',str(A/'mix.wav'),'-af',pre+',loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json','-f','null','-']
r=subprocess.run(cmd,capture_output=True,text=True,check=True);m=json.loads(re.search(r'\{[^{}]*"input_i"[^{}]*\}',r.stderr)[0])
af=pre+f",loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
subprocess.run(['ffmpeg','-y','-v','error','-t',str(duration),'-i',str(A/'mix.wav'),'-af',af,'-ar','48000','-ac','2',str(A/'master.wav')],check=True)
(A/'masterizacao.json').write_text(json.dumps(m,indent=2),encoding='utf8')
print('Master de áudio normalizado em duas passadas:',duration,'s')
