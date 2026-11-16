"""Som original por síntese: acentos do arcade e notificações. Sem amostras externas."""
import sys, wave
from pathlib import Path
import numpy as np
SR=48000
mix=np.zeros(round(117.8*SR),dtype=np.float64)
rng=np.random.default_rng(20261114)
def add(t,s):
    i=round(t*SR); mix[i:i+len(s)]+=s[:len(mix)-i]
def note(t,hz,d=.16,amp=.045):
    x=np.arange(round(d*SR))/SR
    add(t,amp*np.sin(2*np.pi*hz*x)*np.minimum(1,x/.006)*np.exp(-x*22))
def hit(t,amp=.12):
    x=np.arange(round(.22*SR))/SR
    tone=np.sin(2*np.pi*(100*x+80*.025*(1-np.exp(-x/.025))))
    noise=rng.normal(size=len(x))
    add(t,amp*(.8*tone*np.exp(-x*28)+.2*noise*np.exp(-x*48))*np.minimum(1,x/.004))
# Pulso de dança somente no jogo dentro da história, sem competir com narração.
for t in np.arange(25.6,38,.5):
    hit(float(t),.026)
for t in [28.35,30.6,31.9,32.3,32.7,34.8,38.2]: hit(t)
note(38.9,659,.3,.08);note(39.06,988,.45,.07)
hit(50.5,.08)
for t in [80.4,81.7,82.7,83.8]: note(t,880);note(t+.09,1174)
note(95.6,659);note(95.7,988);note(98.1,1174)
dest=Path(sys.argv[1]);dest.parent.mkdir(parents=True,exist_ok=True)
pcm=np.clip(mix,-.8,.8)
with wave.open(str(dest),'wb') as f:
    f.setparams((1,2,SR,0,'NONE','not compressed'));f.writeframes((pcm*32767).astype('<i2').tobytes())
print(dest)
