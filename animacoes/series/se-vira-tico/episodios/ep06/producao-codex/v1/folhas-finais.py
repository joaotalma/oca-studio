from pathlib import Path
from PIL import Image,ImageDraw
import subprocess,io
R=Path('C:/Users/joaot/Projetos/se-vira-tico/render');O=Path(__file__).parent
times=[0,2.5,4.2,7,8.7,11.2,13.5,16,19,22,24.5,26.8,28.7,30.5,32.5,36.3,38.1,40.5,43,45,47.6,51.5,55.3,59,61.2]
def frame(t,w=270,h=480):
 b=subprocess.run(['ffmpeg','-v','error','-ss',str(t),'-i',str(R/'ep06_final.mp4'),'-vf',f'scale={w}:{h}','-frames:v','1','-f','image2pipe','-vcodec','png','-'],capture_output=True,check=True).stdout
 return Image.open(io.BytesIO(b)).convert('RGB')
sheet=Image.new('RGB',(5*270,5*510),'#f5ead5');d=ImageDraw.Draw(sheet)
for i,t in enumerate(times):
 x=i%5*270;y=i//5*510;im=frame(t);sheet.paste(im,(x,y));d.text((x+10,y+484),f'{t:.2f}s',fill='black')
sheet.save(O/'folha-final.jpg',quality=93)
for name,ts in [('gancho',[0,.8,1.7,2.5]),('aproximacao',[54.3,54.6,55,55.3,55.6,56]),('votacao',[56.3,58.5,61.2]),('gestos',[3.6,4,4.2,22.4,22.55,22.7,28.5,28.7,28.9,46.5,46.65,46.8])]:
 width=180;h=320;cols=min(6,len(ts));rows=(len(ts)+cols-1)//cols;sh=Image.new('RGB',(cols*width,rows*(h+25)),'#f5ead5');dr=ImageDraw.Draw(sh)
 for i,t in enumerate(ts):x=i%cols*width;y=i//cols*(h+25);sh.paste(frame(t,width,h),(x,y));dr.text((x+5,y+h+3),f'{t:.2f}s',fill='black')
 sh.save(O/(name+'-final.jpg'),quality=94)
print('Folhas do master final, incluindo último quadro 61.2 s, extraídas.')
