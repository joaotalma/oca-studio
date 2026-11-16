"""Cópia adaptada de ../../dia03/hq/risadas.py (16/11/2026). Risadas de plateia sintetizadas (sem amostras externas) nos momentos de piada. Uso: python risadas.py <saida.wav>
Cada risada é um grupo de vozes: bursts de "rá" (harmônicos moldados por formantes de /a/), com ar e leve glissando."""
import sys, wave
from pathlib import Path
import numpy as np
SR=48000; DUR=93.2
mix=np.zeros(round(DUR*SR)); rng=np.random.default_rng(20261117)
def X(d): return np.arange(round(d*SR))/SR
def env(f,formantes=((800,150,1.0),(1250,200,.7),(2600,300,.3),(3500,350,.15))):
    return sum(a*np.exp(-((f-c)/w)**2) for c,w,a in formantes)
def ha(f0,d,amp):
    x=X(d); glide=f0*(1+.18*np.exp(-x*9)-.12*x/d); ph=2*np.pi*np.cumsum(glide)/SR
    s=np.zeros_like(x)
    for k in range(1,26):
        a=env(f0*k)/k**.8
        if a>.01: s+=a*np.sin(k*ph+rng.uniform(0,6.28))
    ar=rng.normal(size=len(x)); ar=ar-np.convolve(ar,np.ones(8)/8,mode='same')
    s+=.18*ar*np.exp(-x*14)
    return amp*s*np.sin(np.pi*np.minimum(1,x/d))**.7*np.exp(-x*3.2)
def voz(t,tipo,amp,n):
    f0=rng.choice([150,175,210,240,280,310]) if tipo=='plateia' else 200
    atraso=rng.uniform(0,.12); d=.11+rng.uniform(0,.03); t=t+atraso
    for k in range(n):
        gap=.13+k*.012+rng.uniform(-.015,.015)
        s=ha(f0*(1-.015*k)*rng.uniform(.98,1.02),d,amp*(1-.11*k))
        i=round((t+k*gap)*SR)
        if i+len(s)<len(mix): mix[i:i+len(s)]+=s
def risada(t,tam):
    vozes,bursts,amp={'pequena':(3,3,.05),'media':(5,5,.05),'grande':(7,7,.055)}[tam]
    for _ in range(vozes): voz(t,'plateia',amp,bursts+int(rng.integers(0,2)))
# momentos de piada (tempo global), todos em lacunas sem fala; tempos reais de ../falas.js
for t,tam in [(9.5,'pequena'),(17.3,'pequena'),(21.3,'media'),(24.65,'media'),(28.7,'media'),(34.1,'grande'),(38.9,'pequena'),(48.15,'pequena'),(52.4,'grande'),(65.0,'pequena'),(91.4,'media')]: risada(t,tam)
mix=mix/(np.abs(mix).max()+1e-9)*.55
dest=Path(sys.argv[1]); dest.parent.mkdir(parents=True,exist_ok=True)
with wave.open(str(dest),'wb') as f:
    f.setparams((1,2,SR,0,'NONE','not compressed')); f.writeframes((mix*32767).astype('<i2').tobytes())
print(dest,'pico',round(float(np.abs(mix).max()),2))
