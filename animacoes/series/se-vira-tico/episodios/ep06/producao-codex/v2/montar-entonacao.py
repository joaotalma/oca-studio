from pathlib import Path
import subprocess
R=Path('C:/Users/joaot/Projetos/se-vira-tico');V=R/'render';D=R/'audio/ep06-v2/abertura-enfatica'
playlist=D/'montagem.txt';playlist.write_text("file '"+(V/'ep06_v4_intro.mp4').as_posix()+"'\nfile '"+(V/'ep06_v2_final.mp4').as_posix()+"'\ninpoint 3.0\noutpoint 64.1\n",encoding='utf8')
subprocess.run(['ffmpeg','-y','-v','error','-f','concat','-safe','0','-i',str(playlist),'-i',str(D/'master-enfatico.wav'),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-t','66','-movflags','+faststart',str(V/'ep06_v4_final.mp4')],check=True)
def hashes(file,start):
 r=subprocess.run(['ffmpeg','-v','error','-ss',str(start),'-i',str(file),'-map','0:v:0','-an','-f','framemd5','-'],capture_output=True,text=True,check=True)
 return [x.rsplit(',',1)[-1].strip() for x in r.stdout.splitlines() if x and not x.startswith('#')]
old=hashes(V/'ep06_v2_final.mp4',3);new=hashes(V/'ep06_v4_final.mp4',4.9);assert old==new,('Diferença no corpo do vídeo',len(old),len(new));print('Master66s. Todos os',len(old),'quadros após a abertura são idênticos à versão anterior.')
