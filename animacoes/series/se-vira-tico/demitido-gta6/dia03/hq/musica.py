"""Musiquinha de fundo original do Dia 3, sintetizada (sem amostras externas). Uso: python musica.py <saida.wav>
C maior, 120 bpm, 4/4: baixo saltitante, ukulele nos contratempos, percussão leve e melodia pentatônica."""
import sys, wave
from pathlib import Path
import numpy as np
SR=48000; DUR=107.2; BPM=120; B=60/BPM
mix=np.zeros(round(DUR*SR)); rng=np.random.default_rng(20261115)
def hz(n): return 440*2**((n-69)/12)
def add(t,s,g=1.0):
    i=round(t*SR)
    if i<0 or i>=len(mix): return
    s=s[:len(mix)-i]; mix[i:i+len(s)]+=g*s
def X(d): return np.arange(round(d*SR))/SR
def pluck(f,d,amp,dec=7,bright=.5):                       # corda pinçada: harmônicos decaindo
    x=X(d); s=np.zeros_like(x)
    for k in range(1,7): s+=np.sin(2*np.pi*f*k*x)*(bright**(k-1))/k
    return amp*s*np.exp(-x*dec)*np.minimum(1,x/.004)
def pulse(f,d,amp,duty=.25,dec=9):
    x=X(d); ph=(f*x)%1; s=np.where(ph<duty,1.0,-1.0)
    s=np.convolve(s,np.ones(5)/5,mode='same')
    return amp*s*np.exp(-x*dec)*np.minimum(1,x/.004)
def kick(t,amp=.5):
    x=X(.22); f=50+90*np.exp(-x*30); add(t,amp*np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-x*16))
def hat(t,amp=.06,d=.05):
    x=X(d); n=rng.normal(size=len(x)); n=n-np.convolve(n,np.ones(6)/6,mode='same'); add(t,amp*n*np.exp(-x*70))
def clap(t,amp=.16):
    x=X(.14); n=rng.normal(size=len(x)); n=n-np.convolve(n,np.ones(12)/12,mode='same'); add(t,amp*n*np.exp(-x*28))
# progressão (1 compasso cada): C G Am F | C G F G
acordes=[(48,[60,64,67]),(43,[59,62,67]),(45,[60,64,69]),(41,[60,65,69]),(48,[60,64,67]),(43,[59,62,67]),(41,[60,65,69]),(43,[59,62,67])]
# melodia pentatônica (notas MIDI ou None), 8 colcheias por compasso, 2 compassos por frase
fr=[[76,None,79,76,74,None,72,None],[74,None,76,74,72,None,67,None],[72,None,76,72,69,None,72,None],[74,None,72,69,72,None,None,None],
    [76,79,81,79,76,None,74,None],[79,None,76,74,72,None,74,None],[77,None,76,72,69,None,72,74],[74,None,76,None,79,None,None,None]]
T=DUR
n_bars=int(T/(4*B))+1
for bar in range(n_bars):
    t0=bar*4*B; raiz,ac=acordes[bar%8]
    # entrada suave nos 2 primeiros compassos
    g=min(1,.35+bar*.33)
    for b in range(4):
        tb=t0+b*B
        kick(tb,.42*g) if b in (0,2) else clap(tb,.14*g)
        hat(tb,.05*g); hat(tb+B/2,.035*g)
        # baixo: raiz no tempo forte, quinta/oitava saltitando
        nb=raiz if b in (0,2) else raiz+(12 if b==1 else 7)
        add(tb,pluck(hz(nb),.34,.3*g,6,.45))
        add(tb+B/2,pluck(hz(raiz+12 if b%2==0 else raiz+7),.2,.16*g,9,.4))
        # ukulele nos contratempos (palheta curta)
        if b%2==1:
            for k,n in enumerate(ac): add(tb+k*.012,pluck(hz(n+12),.16,.1*g,16,.55))
    # melodia (a partir do compasso 3), com uma variação de oitava nas repetições
    if bar>=2:
        for i,n in enumerate(fr[bar%8]):
            if n is not None: add(t0+i*B/2,pulse(hz(n+(12 if (bar//8)%2 else 0)),.22,.13*g,.25,12))
# fade de entrada e saída
fi=np.minimum(1,np.arange(len(mix))/(SR*1.2)); fo=np.minimum(1,(len(mix)-np.arange(len(mix)))/(SR*1.5))
mix*=fi*fo
mix=mix/np.abs(mix).max()*.7
dest=Path(sys.argv[1]); dest.parent.mkdir(parents=True,exist_ok=True)
with wave.open(str(dest),'wb') as f:
    f.setparams((1,2,SR,0,'NONE','not compressed')); f.writeframes((mix*32767).astype('<i2').tobytes())
print(dest)
