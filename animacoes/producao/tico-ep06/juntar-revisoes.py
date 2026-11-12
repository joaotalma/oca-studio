from pathlib import Path
import subprocess
ROOT=Path('C:/Users/joaot/Projetos/se-vira-tico');R=ROOT/'render'
spans=[(99,144,'ep06_ajuste_mao.mp4'),(666,696,'ep06_ajuste_inclinacao.mp4'),(795,941,'ep06_ajuste_ingressos.mp4'),(1275,1408,'ep06_ajuste_cabeca.mp4')]
args=['ffmpeg','-y','-v','error','-i',str(R/'ep06_mudo.mp4')]
for a,b,file in spans:args+=['-i',str(R/file)]
filters=[];labels=[];pos=0;part=0
for i,(a,b,file) in enumerate(spans,1):
 if a>pos:
  label='v'+str(part);filters.append(f'[0:v]trim=start_frame={pos}:end_frame={a},setpts=PTS-STARTPTS[{label}]');labels.append(f'[{label}]');part+=1
 label='v'+str(part);filters.append(f'[{i}:v]setpts=PTS-STARTPTS[{label}]');labels.append(f'[{label}]');part+=1;pos=b
label='v'+str(part);filters.append(f'[0:v]trim=start_frame={pos}:end_frame=1837,setpts=PTS-STARTPTS[{label}]');labels.append(f'[{label}]')
filters.append(''.join(labels)+f'concat=n={len(labels)}:v=1:a=0[v]')
subprocess.run(args+['-filter_complex',';'.join(filters),'-map','[v]','-c:v','libx264','-preset','fast','-crf','17','-pix_fmt','yuv420p','-movflags','+faststart',str(R/'ep06_imagem_revisada.mp4')],check=True)
subprocess.run(['ffmpeg','-y','-v','error','-i',str(R/'ep06_imagem_revisada.mp4'),'-i',str(ROOT/'audio/ep06/master.wav'),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-t','61.233333','-movflags','+faststart',str(R/'ep06_final.mp4')],check=True)
print('Quatro trechos corrigidos; sequência e duração final preservadas.')
