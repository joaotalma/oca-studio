from pathlib import Path
import subprocess
R=Path('C:/Users/joaot/Projetos/se-vira-tico');V=R/'render'
names=['ep06_v2_mudo.mp4','ep06_v2_intro_nomes.mp4','ep06_v2_abertura.mp4','ep06_v2_doce.mp4'];args=['ffmpeg','-y','-v','error']
for n in names:args+=['-i',str(V/n)]
fc='[1:v]setpts=PTS-STARTPTS[a];[2:v]trim=start_frame=90:end_frame=228,setpts=PTS-STARTPTS[b];[0:v]trim=start_frame=228:end_frame=1263,setpts=PTS-STARTPTS[c];[3:v]setpts=PTS-STARTPTS[d];[0:v]trim=start_frame=1335:end_frame=1923,setpts=PTS-STARTPTS[e];[a][b][c][d][e]concat=n=5:v=1:a=0[v]'
subprocess.run(args+['-filter_complex',fc,'-map','[v]','-c:v','libx264','-threads','2','-preset','fast','-crf','17','-pix_fmt','yuv420p','-movflags','+faststart',str(V/'ep06_v2_imagem_revisada.mp4')],check=True)
subprocess.run(['ffmpeg','-y','-v','error','-i',str(V/'ep06_v2_imagem_revisada.mp4'),'-i',str(R/'audio/ep06-v2/master.wav'),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-t','64.1','-movflags','+faststart',str(V/'ep06_v2_final.mp4')],check=True)
print('Master v2 montado: apresentação de Tico/Lua, áudio remoto e doce corrigidos.')
