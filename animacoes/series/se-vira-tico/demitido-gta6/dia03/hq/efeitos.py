"""Efeitos originais do Dia 3, sintetizados (sem amostras externas). Uso: python efeitos.py <saida.wav>
Tempos globais, alinhados a ../falas.js e aos marcos de final.js (15/11/2026)."""
import sys, wave
from pathlib import Path
import numpy as np
SR=48000; DUR=107.2
mix=np.zeros(round(DUR*SR)); rng=np.random.default_rng(20261115)
def add(t,s,g=1.0):
    i=round(t*SR)
    if i<0 or i>=len(mix): return
    s=s[:len(mix)-i]; mix[i:i+len(s)]+=g*s
def S(*a):
    n=max(len(v) for v in a); o=np.zeros(n)
    for v in a: o[:len(v)]+=v
    return o
def X(d): return np.arange(round(d*SR))/SR
def lp(x,k):  # passa-baixa simples (média móvel)
    return np.convolve(x,np.ones(k)/k,mode='same')
def hp(x,k): return x-lp(x,k)
def tone(hz,d,amp=.1,dec=18,att=.004):
    x=X(d); return amp*np.sin(2*np.pi*hz*x)*np.minimum(1,x/att)*np.exp(-x*dec)
def sweep(f0,f1,d,amp=.1,dec=0,att=.01):
    x=X(d); f=f0+(f1-f0)*(x/d); ph=2*np.pi*np.cumsum(f)/SR
    return amp*np.sin(ph)*np.minimum(1,x/att)*np.exp(-x*dec)*np.minimum(1,(d-x)/.02)
def noise(d,amp=.1,dec=10,k=1,high=False):
    x=X(d); n=rng.normal(size=len(x)); n=hp(n,max(k,3)) if high else (lp(n,k) if k>1 else n)
    n=n/(np.abs(n).max()+1e-9); return amp*n*np.exp(-x*dec)*np.minimum(1,x/.003)
def inharm(hzs,d,amp=.08,dec=9):
    return sum(tone(h,d,amp/len(hzs),dec) for h in hzs)
def ping(t,amp=.07): add(t,tone(880,.2,amp,14)); add(t+.09,tone(1174,.3,amp,12))
def pop(t,amp=.09): add(t,sweep(300,900,.07,amp,40))
def whoosh(t,d=.35,amp=.07): x=X(d); add(t,noise(d,amp,0,12)*np.sin(np.pi*x/d)**2)
def thud(t,amp=.2,f=70): add(t,S(tone(f,.5,amp,9),noise(.12,amp*.3,40,6)))
def click(t,amp=.06,f=2400): add(t,tone(f,.025,amp,120,.001))

# ---- gancho e plano ----
for i,tt in enumerate([4.7,4.8,4.9,5.0,5.12]): add(tt,inharm([3300,4700],.12,.06,30),1)   # moedas
whoosh(6.0,.4,.08); whoosh(6.25,.4,.08); add(6.9,sweep(500,1400,.18,.09,6))
click(10.5,.12,1800); add(10.52,noise(.1,.08,30,3))                                       # foto
ping(13.2); ping(14.0,.06)
# ---- a venda ----
add(15.8,tone(659,.55,.12,5)); add(16.35,tone(523,.8,.12,4))                              # ding-dong
pop(22.0); thud(23.8,.18,90)
add(24.0,sweep(120,260,3.3,.035,0,.8))                                                   # tensão leve
for tt in np.arange(31.55,32.55,.13):                                                    # cadeira rangendo, cada vez mais
    g=.035+.05*(tt-31.55); add(float(tt),sweep(900+rng.integers(0,500),1500+rng.integers(0,600),.12,g,8))
for tt in [32.1,32.3,32.45]: add(tt,noise(.08,.05,30,2,True))                             # estalos
# CRAAC (32,6)
t0=32.6
add(t0,noise(.7,.38,6,2,True)); add(t0,tone(55,.9,.5,5)); add(t0,tone(110,.5,.35,9))
for tt in rng.uniform(0,.3,9): add(t0+float(tt),noise(.05,.3,50,2,True))                  # lascas de madeira
add(t0+.02,inharm([1250,1930,2710,3350],.9,.25,6))                                        # metal da base
for i,tt in enumerate([32.85,33.05,33.28,33.5]): add(tt,inharm([520,780,1400],.2,.1,16))  # rodinhas batendo
x=X(1.5); add(32.9,noise(1.5,.12,1.6,40)*(1+.5*np.sin(x*60)))                            # rolando
for tt in np.arange(33.0,34.3,.09): click(float(tt),.03*(1-(tt-33)/1.4)+.005,900)
thud(33.0,.25,60); thud(33.2,.12,80)
pop(34.6); pop(37.1); pop(41.8)
# Marcos indo embora (passos pesados)
for tt in np.arange(43.9,46.3,.5): thud(float(tt),.12,65)
# ---- controle ----
add(48.7,sweep(2700,2900,.45,.05,0))                                                      # apito
x=X(3.4); add(48.8,noise(3.4,.05,0,60)*(.6+.4*np.sin(x*2.2)))                             # torcida
add(52.0,S(tone(150,.7,.22,2.5),sweep(500,180,.7,.1,2)))                                    # gol contra: buzina que cai
add(55.0,sweep(900,90,.9,.12,2,.02))                                                      # desliga
add(56.2,S(noise(.05,.3,60,2,True),sweep(300,1500,.35,.15,9)))                               # pop + mola
for i,(tt,g) in enumerate([(56.55,.14),(56.8,.09),(57.0,.05),(57.15,.03)]): add(tt,inharm([700,1100],.08,g,40))
# ---- grupo e regra ----
for tt in [61.7,62.5,63.1,63.6]: ping(tt,.07)
for tt in [63.98,64.06,64.14]: click(tt,.05,1400)
pop(64.25,.07); thud(65.55,.3,60); add(65.55,inharm([900,1450],.4,.08,10))
pop(70.6,.1)
# ---- loja e barra ----
ping(73.5,.06); add(74.0,inharm([1568,2093,2637],.5,.1,7))
add(74.5,sweep(180,1400,3.1,.07,0,.4)); add(74.5,noise(3.1,.06,0,20)*np.linspace(0,1,round(3.1*SR)))
thud(77.8,.3,55); add(77.8,inharm([440,660],.5,.1,5)); add(78.5,tone(300,.1,.1,30))
# ---- Jão ----
ping(80.0,.07); add(84.3,tone(1000,.03,.08,90))
for a,b,g in [(84.4,88.6,.05),(91.5,96.3,.035)]:                                          # moto de fundo
    n=round((b-a)*SR); x=np.arange(n)/SR
    m=(np.sign(np.sin(2*np.pi*13*x))*.5+.5)*np.sin(2*np.pi*58*x)+.4*np.sin(2*np.pi*29*x)
    m=lp(m+.3*rng.normal(size=n),6)*np.minimum(1,x/.2)*np.minimum(1,(b-a-x)/.3); add(a,g*m/ (np.abs(m).max()+1e-9)*3)
for k,tt in enumerate(np.linspace(88.55,91.2,18)): click(float(tt),.05,1300+60*k)         # arrastando a barra
add(91.3,tone(1320,.35,.1,8))
add(96.7,inharm([700,1180,1790,2430],.9,.3,6)); thud(96.7,.18,100); add(96.95,inharm([700,1180,1790],.5,.12,9))
# ---- voto ----
whoosh(103.1,.4,.08); whoosh(103.35,.4,.08); thud(104.5,.22,70)
dest=Path(sys.argv[1]); dest.parent.mkdir(parents=True,exist_ok=True)
pcm=np.clip(mix,-.85,.85)
with wave.open(str(dest),'wb') as f:
    f.setparams((1,2,SR,0,'NONE','not compressed')); f.writeframes((pcm*32767).astype('<i2').tobytes())
print(dest, 'pico', round(float(np.abs(mix).max()),2))
