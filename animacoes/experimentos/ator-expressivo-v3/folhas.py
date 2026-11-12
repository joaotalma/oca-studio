from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
root = Path(__file__).resolve().parents[2] / 'render' / 'ator-expressivo-v3'
font = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 22)
def sheet(name, files, columns, crop=None, times=None):
    w,h=480,360
    out=Image.new('RGB',(w*columns,(h+34)*((len(files)+columns-1)//columns)), '#f5eedf')
    d=ImageDraw.Draw(out)
    for i,file in enumerate(files):
        im=Image.open(file).convert('RGB')
        if crop: im=im.crop(crop)
        im.thumbnail((w,h))
        x,y=(i%columns)*w,(i//columns)*(h+34)
        out.paste(im,(x+(w-im.width)//2,y))
        d.text((x+12,y+h+3), f'{times[i]:.2f} s' if times else file.stem,fill='#251d27',font=font)
    out.save(root/name,quality=93)
sheet('hook_sheet.jpg',sorted(root.glob('hook-*.png')),3,times=[i*.3 for i in range(6)])
sheet('gesto_sheet.jpg',sorted(root.glob('gesto-*.png')),4,crop=(648,105,1268,809),times=[2.5+i*.1 for i in range(12)])
marks=[0,.8,1.2,1.7,2.65,2.9,3.2,4.4,5.2,6.2,7.2,8.8,10.5,11.8]
sheet('atuacao_sheet.jpg',sorted(root.glob('quadro-*.png')),4,crop=(648,105,1268,809),times=marks)
print('Folhas de abertura, gesto e atuação geradas.')
