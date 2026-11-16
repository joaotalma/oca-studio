"""Efeitos originais do Dia 4, sintetizados (sem amostras externas). Uso: python efeitos.py <saida.wav>
Cópia adaptada de ../../dia03/hq/efeitos.py (16/11/2026): helpers iguais; eventos novos do Dia 4, alinhados a ../falas.js (alinhamento por palavra) e às cenas de final.js."""
import sys, wave, json, re
from pathlib import Path
import numpy as np
SR=48000; DUR=93.2
AQUI=Path(__file__).resolve().parent
FALAS=json.loads(re.search(r'const FALAS = (\[.*?\]);',(AQUI/'../falas.js').read_text(encoding='utf8'),re.S).group(1))
def W(n,pal):
    f=next(x for x in FALAS if x['n']==n)
    al=json.loads((AQUI/f'../../../audio/demitido-gta6-dia04/alinhamento/{n}.json').read_text(encoding='utf8'))
    norm=lambda s:re.sub(r'[.,:!?]','',s.lower())
    return f['ini']+next(p['ini'] for p in al['palavras'] if norm(p['palavra'])==norm(pal))
mix=np.zeros(round(DUR*SR)); rng=np.random.default_rng(20261116)
def add(t,s,g=1.0):
    i=round(t*SR)
    if i<0 or i>=len(mix): return
    s=s[:len(mix)-i]; mix[i:i+len(s)]+=g*s
def S(*a):
    n=max(len(v) for v in a); o=np.zeros(n)
    for v in a: o[:len(v)]+=v
    return o
def X(d): return np.arange(round(d*SR))/SR
def lp(x,k): return np.convolve(x,np.ones(k)/k,mode='same')
def hp(x,k): return x-lp(x,k)
def tone(hz,d,amp=.1,dec=18,att=.004):
    x=X(d); return amp*np.sin(2*np.pi*hz*x)*np.minimum(1,x/att)*np.exp(-x*dec)
def sweep(f0,f1,d,amp=.1,dec=0,att=.01):
    x=X(d); f=f0+(f1-f0)*(x/d); ph=2*np.pi*np.cumsum(f)/SR
    return amp*np.sin(ph)*np.minimum(1,x/att)*np.exp(-x*dec)*np.minimum(1,(d-x)/.02)
def noise(d,amp=.1,dec=10,k=1,high=False):
    x=X(d); n=rng.normal(size=len(x)); n=hp(n,max(k,3)) if high else (lp(n,k) if k>1 else n)
    n=n/(np.abs(n).max()+1e-9); return amp*n*np.exp(-x*dec)*np.minimum(1,x/.003)
def inharm(hzs,d,amp=.08,dec=9): return sum(tone(h,d,amp/len(hzs),dec) for h in hzs)
def ping(t,amp=.07): add(t,tone(880,.2,amp,14)); add(t+.09,tone(1174,.3,amp,12))
def pop(t,amp=.09): add(t,sweep(300,900,.07,amp,40))
def whoosh(t,d=.35,amp=.07): x=X(d); add(t,noise(d,amp,0,12)*np.sin(np.pi*x/d)**2)
def thud(t,amp=.2,f=70): add(t,S(tone(f,.5,amp,9),noise(.12,amp*.3,40,6)))
def click(t,amp=.06,f=2400): add(t,tone(f,.025,amp,120,.001))
def caixa(t,amp=.12):          # caixa registradora: clique, gaveta e sino
    click(t,.1,1800); add(t+.03,noise(.12,.08,25,3)); add(t+.12,inharm([2637,3520,4186],.7,amp,6)); add(t+.12,inharm([1760,2349],.5,amp*.6,8))
def mordida(t,amp=.16):        # crocante: estalo seco e farelo
    add(t,noise(.09,amp,40,2,True)); add(t+.03,tone(180,.1,amp*.8,35)); add(t+.1,noise(.07,amp*.7,45,2,True)); add(t+.16,noise(.12,amp*.35,22,3,True))
def erro(t,amp=.13):           # Pix que falha: dois tons descendo
    add(t,tone(330,.22,amp,5,.003)); add(t+.2,tone(220,.45,amp,4,.003)); add(t+.2,tone(222,.45,amp*.7,4,.003))
def buzina(t,amp=.13,f=420): add(t,S(tone(f,.18,amp,6,.006),tone(f*1.26,.18,amp*.8,6,.006)))

# ---- abertura: notas e moedas no "treze reais" ----
tT=W(1,'treze'); add(tT,inharm([3300,4700],.12,.06,30)); add(tT+.1,inharm([3300,4700],.12,.06,30)); add(tT+.2,inharm([3300,4700],.12,.06,30))
# ---- mercadinho: paga, caixa registradora, barra cai ----
tG=W(2,'gastei')+.5; caixa(tG); whoosh(tG+.4,.4,.07); add(tG+.4,sweep(900,120,.6,.05,2))
mordida(W(2,'como')+.15); mordida(W(2,'como')+1.0)
# ---- onze paçocas ----
pop(17.7,.1); pop(W(3,'saldo'),.1); thud(W(3,'saldo')+.1,.1,80)
# ---- as vendas: ching a cada R$ 3 ----
vendas=[W(4,'vendi')+.5,35.6,36.7,37.8,38.9]
for v in vendas: add(v,inharm([2093,3136],.35,.1,7)); add(v+.05,tone(1568,.2,.06,10))
mordidas=[W(4,'comi'),W(5,'provei'),36.15,37.25,38.35]
for m in mordidas: mordida(m+.05)
pop(25.5,.07); pop(W(5,'provei')-.1,.08)
# ---- Pix que falha ----
tP=W(6,'pix')+1.4; pop(tP,.08); erro(tP+.05); whoosh(W(6,'desenho')+.2,.5,.05)
# ---- montagem ----
pop(35.1,.08); pop(35.15,.08)
# ---- em casa: passos, bilhete e gasolina ----
for tt in np.arange(41.2,42.4,.38): thud(float(tt),.1,75)
pop(W(8,'acelerador')-.5,.08); add(W(8,'cheira'),sweep(260,120,.9,.04,1.5,.05))
# ---- acelerador do controle: motor que acelera e vibra ----
u0=49.5
x=X(2.0); f=70+260*(x/2.0)**1.5; ph=2*np.pi*np.cumsum(f)/SR
motor=(np.sign(np.sin(ph*.5))*.5+.5)*np.sin(ph)+.4*np.sin(ph*2); motor=lp(motor+.25*rng.normal(size=len(x)),5)
add(u0+1.0,.12*motor/(np.abs(motor).max())*np.minimum(1,x/.1)*np.minimum(1,(2.0-x)/.25))
for tt in np.arange(u0+1.0,u0+3.0,.04): click(float(tt),.012,300)           # vibração do plástico
add(u0+2.0,noise(1.2,.05,2.5,6))                                              # fumaça
pop(u0+2.2,.1); whoosh(u0+2.0,.7,.08); add(u0+2.2,sweep(200,1400,.9,.07,1,.1))   # jogador sai do campo
buzina(u0+2.7,.11,520); buzina(u0+2.95,.11,520)                              # buzininha
ping(u0+3.9,.06)
# ---- conta das moedas ----
for i in range(8):
    tt=57.0+i*.7+.2; add(tt,inharm([3300,4900,6200],.14,.06,30)); click(tt+.02,.03,2800)
ping(W(9,'lucro'),.09); add(W(9,'lucro')+.1,inharm([1568,2093],.4,.07,8))
pop(W(9,'arredondando'),.08)
# ---- pedido ----
for n,pal in [(10,'curtida'),(10,'seguidor'),(10,'compartilhamento')]: pop(W(n,pal)-.2,.09); add(W(n,pal)-.18,inharm([1318,1760],.25,.06,12))
# ---- placar zerado ----
whoosh(77.2,.4,.08); ping(77.7,.07); ping(78.3,.05); ping(78.9,.05)
# ---- vocês decidem ----
cm=W(12,'comentário')-.2; whoosh(cm,.3,.07); pop(cm+.1,.09)
mordida(90.9+.05,.18); pop(92.1,.1); add(92.15,inharm([880,1318],.3,.06,12))
dest=Path(sys.argv[1]); dest.parent.mkdir(parents=True,exist_ok=True)
pcm=np.clip(mix,-.85,.85)
with wave.open(str(dest),'wb') as f:
    f.setparams((1,2,SR,0,'NONE','not compressed')); f.writeframes((pcm*32767).astype('<i2').tobytes())
print(dest, 'pico', round(float(np.abs(mix).max()),2))
