import json,subprocess,pathlib,io,concurrent.futures,re
from PIL import Image,ImageDraw,ImageFont
root=pathlib.Path('.tmp/referencias-13')
items=json.loads((root/'manifest.json').read_text(encoding='utf-8'))
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',18)
def frame(item,t,w=240):
    raw=subprocess.check_output(['ffmpeg','-v','error','-threads','1','-ss',str(t),'-i',item['path'],'-frames:v','1','-vf',f'scale={w}:-1','-threads','1','-f','image2pipe','-vcodec','mjpeg','-'])
    return Image.open(io.BytesIO(raw)).convert('RGB')
def sheet(item,times,name,cols=4,w=240):
    h=round(w*item['height']/item['width']); cell=h+26
    canvas=Image.new('RGB',(cols*w,((len(times)+cols-1)//cols)*cell),'#161616'); d=ImageDraw.Draw(canvas)
    for i,t in enumerate(times):
        pic=frame(item,t,w); x=(i%cols)*w;y=(i//cols)*cell
        canvas.paste(pic,(x,y+26)); d.text((x+5,y+3),f"{item['id']}  {t:.1f}s",font=font,fill='white')
    canvas.save(root/f"{item['id']}-{name}.jpg",quality=88)
def work(item):
    if (root/f"{item['id']}-movimento.jpg").exists(): return
    duration=item['duration']
    times=[0,1.5,3,6]+[round((duration-0.3)*i/15,1) for i in range(2,16)]
    times=sorted(set(times))
    sheet(item,times,'panorama')
    times=[]
    for start in [0,min(15,duration*.22),duration*.65]: times += [round(start+i*.4,2) for i in range(5)]
    sheet(item,times,'movimento',cols=5,w=216)
    scan=subprocess.run(['ffmpeg','-hide_banner','-threads','1','-i',item['path'],'-vf',"scale=160:-1,select='gt(scene,0.25)',showinfo",'-an','-f','null','-'],capture_output=True,text=True,encoding='utf-8',errors='replace')
    candidates=[float(x) for x in re.findall(r'pts_time:([\d.]+)',scan.stderr)]
    (root/f"{item['id']}-cortes.json").write_text(json.dumps(candidates),encoding='utf-8')
    print(item['id'],'pronto;',len(candidates),'mudancas candidatas',flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as ex:list(ex.map(work,items))
