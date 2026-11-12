'use strict';
// Recursos reutilizáveis aprovados na ficha visual; arquivo fonte, sem dados do EP2.
const SerieVisual = (() => {
let noiteAtiva=false,aberturaTexto=['',''],introStudy;
const studyDefs = `<defs>
<linearGradient id="sky" gradientUnits="userSpaceOnUse" x1="0" y1="-200" x2="0" y2="1200"><stop stop-color="#172540"/><stop offset="1" stop-color="#816579"/></linearGradient>
<linearGradient id="dawn" gradientUnits="userSpaceOnUse" x1="0" y1="-200" x2="0" y2="1200"><stop stop-color="#596e96"/><stop offset="1" stop-color="#f5b57e"/></linearGradient>
<radialGradient id="lamp"><stop stop-color="#ffe8a4" stop-opacity=".5"/><stop offset="1" stop-color="#ffc766" stop-opacity="0"/></radialGradient>
<linearGradient id="beam" x2="0" y2="1"><stop stop-color="#ffe4a0" stop-opacity=".23"/><stop offset="1" stop-color="#ffe4a0" stop-opacity="0"/></linearGradient>
</defs>`;
const sh = (x,y,rx=90,ry=18) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#181e2b" opacity=".28"/>`;
function skyStudy(night=true){
 let s=studyDefs+`<rect x="-800" y="-600" width="2700" height="2800" fill="url(#${night?'sky':'dawn'})"/>`;
 for(let i=0;i<45;i++){let x=(i*173)%1500-200,y=(i*97)%620-120;s+=`<circle cx="${x}" cy="${y}" r="${1+i%3}" fill="#ffefd2" opacity="${night?.65:.26}"/>`;}
 s+=`<path d="M-100 320 Q40 265 200 305 T580 280 M640 185 Q750 145 890 180 T1250 150" fill="none" stroke="#b4aac1" stroke-opacity=".15" stroke-width="22" stroke-linecap="round"/>`;
 return s;
}
function skylineStudy(){let s='';for(let i=0;i<16;i++){let x=-300+i*115,h=100+(i*61)%190;s+=ret(x,770-h,110,h,'#39435b',0,0);for(let j=0;j<3;j++)s+=ret(x+17+j*29,800-h,11,20,(i+j)%3?'#667080':'#e5bf75',0,0);}return s;}
function lampStudy(x,y){return stroke(`M${x} 1610 V${y+25} Q${x} ${y} ${x+95} ${y}`, '#38414a',12)+`<ellipse cx="${x+95}" cy="${y+5}" rx="135" ry="125" fill="url(#lamp)"/><path d="M${x+65} ${y+12} L${x-160} 1620 L${x+380} 1620 L${x+120} ${y+12}Z" fill="url(#beam)"/>`+ell(x+95,y+5,35,12,'#ffe5a0',OUT,3);}
function blockStudy(x,w,h,color,label){let y=1180-h,s=ret(x,y,w,h,color,0,3);s+=ret(x+w-24,y,24,h,'#3b3446',0,0);for(let r=0;r<3;r++)for(let c=0;c<3;c++){let xx=x+22+c*(w-35)/3,yy=y+28+r*105;s+=ret(xx,yy,32,54,(r+c)%3?'#544a54':'#f4cf89',2,2);s+=ret(xx-4,yy+55,40,5,'#302e3d',0,0);}s+=ret(x+18,1020,w-36,160,'#3c3742',2,2);s+=ret(x+8,970,w-16,50,'#547e78',3,2)+txt(x+w/2,1004,label,21,'#fff1ce');s+=stroke(`M${x+30} 1050 H${x+w-30} M${x+30} 1090 H${x+w-30} M${x+30} 1130 H${x+w-30}`, '#665b63',3);return s;}
function roadStudy(t){
 let s=skyStudy(noiteAtiva)+skylineStudy();
 s+=`<rect x="-600" y="900" width="2300" height="1600" fill="#77707a"/><path d="M510 900 L570 900 L1500 2200 L-420 2200Z" fill="#454955"/>`;
 s+=`<path d="M500 905 L-350 2200 M580 905 L1430 2200" stroke="#c7b4a1" stroke-width="24"/>`;
 for(let i=0;i<8;i++){let p=(i/8+t*.08)%1,a=p*p,b=Math.min(1,p+.045)**2;s+=`<path d="M${540-18*a} ${900+1300*a} L${540+18*a} ${900+1300*a} L${540+18*b} ${900+1300*b} L${540-18*b} ${900+1300*b}Z" fill="#e0bf7d"/>`;}
 // Fachadas apoiadas nas duas calçadas, em três distâncias.
 for(const side of [-1,1])for(let i=0;i<3;i++){let k=.38+i*.35,x=540+side*(130+i*260),y=930+i*170;s+=`<g transform="translate(${x} ${y}) scale(${k}) translate(-140 -1180)">`+blockStudy(0,280,600+i*70,i%2?'#c58c62':'#b67c63',i===2?'MERCEARIA':'OFICINA')+'</g>';}
 s+=carStudy(480,1035,.23,'#7999ac')+carStudy(735,1230,.47,'#b1b5ab');
 s+=`<g transform="translate(-280 -90)">`+lampStudy(430,680)+'</g>';
 return s;
}
function carStudy(x,y,k,color){return `<g transform="translate(${x} ${y}) scale(${k})">`+sh(0,0,135,18)+ret(-110,-95,220,85,color,18)+shape('M-85 -95 L-60 -155 L60 -155 L85 -95Z',color)+ret(-52,-144,104,43,'#26384a',8,2)+ret(-95,-55,38,20,'#fff1bb',4,1)+ret(57,-55,38,20,'#fff1bb',4,1)+ret(-92,-16,32,30,'#22232b',3,0)+ret(60,-16,32,30,'#22232b',3,0)+'</g>';}
function arvoreBairro(x,y,k=1){return `<g transform="translate(${x} ${y}) scale(${k})">`+sh(0,0,80,12)+ret(-12,-170,24,170,'#70503e',3,2)+ell(-35,-200,55,65,'#52634d',OUT,3)+ell(22,-225,68,73,'#637351',OUT,3)+ell(50,-180,48,53,'#738058',OUT,3)+stroke('M0 -70 V-190 M0 -140 L-35 -180','#5b493c',7)+'</g>';}
const blocoSemDetalhes=blockStudy;
blockStudy=function(x,w,h,color,label){let s=blocoSemDetalhes(x,w,h,color,label),y=1180-h;
 s+=ret(x+14,y+125,65,36,'#a5a5a0',3,2);for(let j=0;j<4;j++)s+=stroke(`M${x+21} ${y+134+j*6} H${x+70}`,'#656c73',2);
 s+=stroke(`M${x+w-10} ${y+15} V1178`,'#795e50',5)+ret(x+24,1050,55,126,'#a99d88',2,2)+ret(x+31,1058,41,50,'#677d86',1,1)+ell(x+68,1120,3,3,'#f3d58c','none',0);
 s+=shape(`M${x+5} 1019 L${x+w-5} 1019 L${x+w+10} 1055 L${x-10} 1055Z`,'#b96d53',2);
 for(let j=0;j<6;j++)s+=shape(`M${x+8+j*(w-12)/6} 1020 l18 0 l10 34 l-24 0Z`,'#edcf9c',0);
 s+=ret(x+w-66,1080,42,28,'#f1dfb6',2,1)+txt(x+w-45,1100,String(120+Math.round(h/10)),13,'#4c4a4c');
 s+=stroke(`M${x-5} ${y+2} Q${x+w/2} ${y+32} ${x+w+5} ${y+10}`,'#333847',2);
 return s;
};
function ruaDetalhes(){let s='';
 // Juntas transversais da calçada seguem a mesma fuga da estrada.
 for(let i=1;i<8;i++){let q=i/8,y=920+1100*q*q,edge=540-900*q*q;s+=stroke(`M${edge-280*q} ${y} L${edge-12} ${y+12}`,'#5e5d65',2+q*2);s+=stroke(`M${1080-edge+12} ${y+12} L${1080-edge+280*q} ${y}`,'#5e5d65',2+q*2);}
 s+=`<g transform="translate(880 1545) skewX(-25)">`+ell(0,0,62,18,'#39414a','#707680',3)+ell(0,0,43,11,'none','#69717b',2)+stroke('M-30 0 H30','#69717b',3)+'</g>';
 s+=`<path d="M168 1590 l34 -23 l-13 -26 l28 -23 M937 1730 l-26 -22 l15 -26" fill="none" stroke="#353d49" stroke-width="3" opacity=".6"/>`;
 for(let side of [-1,1]){let x=540+side*400;s+=`<g transform="translate(${x} 1440) scale(.55)">`+ret(-42,-9,84,18,'#303b44',1,2)+[0,1,2,3,4].map(j=>stroke(`M${-32+j*16} -6 V6`,'#879096',4)).join('')+'</g>';}
 s+=arvoreBairro(130,1240,.62)+arvoreBairro(1010,1340,.8);
 s+=`<path d="M-150 610 Q490 780 1250 580 M-150 638 Q510 810 1250 605" stroke="#343646" stroke-width="3" fill="none"/>`;
 s+=carStudy(965,1490,.56,'#777f92');
 return s;
}
const estradaSemDetalhes=roadStudy;
roadStudy=function(t){return estradaSemDetalhes(t).replace('translate(-280 -90)','translate(470 -90)')+ruaDetalhes();};
introStudy=function(){
 let s=skyStudy()+skylineStudy();
 s+=`<path d="M-180 240 Q500 385 1260 210 M-180 267 Q500 410 1260 239" fill="none" stroke="#343543" stroke-width="5"/>`;
 s+=`<g opacity=".8" transform="translate(-185 1350) scale(.7) translate(0 -1180)">`+blockStudy(0,360,620,'#956d67','MERCEARIA')+'</g>';
 s+=`<g opacity=".8" transform="translate(900 1350) scale(.72) translate(0 -1180)">`+blockStudy(0,370,680,'#97795d','OFICINA')+'</g>';
 s+=ret(-300,1345,1700,700,'#595b68',0,0)+ret(-300,1345,1700,32,'#b8a090',0,0)+stroke('M-300 1378 H1400','#343845',6);
 for(let i=0;i<8;i++)s+=stroke(`M${-100+i*175} 1345 l-70 210`,'#88828a',2);
 s+=arvoreBairro(930,1370,.8)+arvoreBairro(60,1380,.66)+lampStudy(960,1040);
 s+=`<path d="M820 1215 L1130 1120 L1130 1490Z" fill="url(#beam)"/>`+sh(540,1600,380,35)+motoSVG(540,1600,1.6);
 s+=`<ellipse cx="815" cy="1228" rx="98" ry="78" fill="url(#lamp)"/>`;
 s+=`<path d="M-100 1780 H220 M350 1780 H700 M830 1780 H1180" stroke="#d6bd7f" stroke-width="13"/>`;
 s+=ell(175,1710,65,18,'#414651','#777884',3);
 // O título continua com espaço de leitura e contraste, detalhes ficam na periferia.
 s+=txt(544,616,'SE VIRA,',130,'#282638')+txt(544,818,'TICO',205,'#282638')+txt(540,610,'SE VIRA,',130,'#fff3d9')+txt(540,810,'TICO',205,'#f2d36b');
 s+=txt(540,1000,aberturaTexto[0],44,'#fff3d9')+txt(540,1060,aberturaTexto[1],44,'#fff3d9');return s;
};

function personagem(base,o={},id='ator') {
 if(o===false)return base;
 id='svt-'+String(id).replace(/[^a-zA-Z0-9_-]/g,'_');
 const noite=o.ambiente==='noite',sombra=o.sombra??(noite?.23:.12),luz=o.luz??(noite?.72:.56),lado=o.lado==='esquerda'?-1:1;
 return `<defs>
 <filter id="${id}white" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/></filter>
 <mask id="${id}mask" maskUnits="userSpaceOnUse" x="-450" y="-1100" width="900" height="1250"><g filter="url(#${id}white)">${base}</g></mask>
 <linearGradient id="${id}shade" gradientUnits="userSpaceOnUse" x1="${-145*lado}" y1="0" x2="${-15*lado}" y2="0"><stop stop-color="#263246" stop-opacity="${sombra}"/><stop offset=".36" stop-color="#263246" stop-opacity="${sombra*.65}"/><stop offset=".64" stop-color="#263246" stop-opacity="${sombra*.25}"/><stop offset="1" stop-color="#263246" stop-opacity="0"/></linearGradient>
 <filter id="${id}rim" x="-20%" y="-10%" width="140%" height="120%" color-interpolation-filters="sRGB"><feOffset in="SourceAlpha" dx="${-2.6*lado}" dy=".55" result="inside"/><feComposite in="SourceAlpha" in2="inside" operator="out" result="edge"/><feFlood flood-color="#ffe4ad" flood-opacity="${luz}"/><feComposite in2="edge" operator="in"/></filter>
 <filter id="${id}contact" x="-20%" y="-10%" width="140%" height="120%" color-interpolation-filters="sRGB"><feOffset in="SourceAlpha" dx="${7*lado}" dy="-2" result="shift"/><feComposite in="SourceAlpha" in2="shift" operator="out" result="edge"/><feGaussianBlur in="edge" stdDeviation="2.2" result="soft"/><feComposite in="soft" in2="SourceAlpha" operator="in" result="clip"/><feFlood flood-color="#253449" flood-opacity="${noite?.25:.12}"/><feComposite in2="clip" operator="in"/></filter>
 </defs>${base}<g mask="url(#${id}mask)"><rect x="-450" y="-1100" width="900" height="1250" fill="url(#${id}shade)"/></g><g filter="url(#${id}contact)">${base}</g><g filter="url(#${id}rim)">${base}</g>`;
}
function seta(g,x,y,t,o={}){const d=(o.amplitude??9)*Math.sin(t*Math.PI*2/(o.periodo??1.8));g.save();g.translate(x+d,y);g.strokeStyle=o.cor||'#fff3d9';g.lineWidth=o.espessura||16;g.lineCap='round';g.lineJoin='round';g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(8,78,93,80);g.moveTo(66,52);g.lineTo(98,80);g.lineTo(66,108);g.stroke();g.restore();}
function gps(o={}){
 const pts=o.pontos||[[0,1],[0,.35],[.2,.2],[1,.2]],p=Math.max(0,Math.min(1,o.progresso||0));
 if(pts.length<2||pts.some(v=>v.length!==2||!v.every(Number.isFinite)))throw Error('GPS: pontos inválidos');
 const line=pts.map(([x,y],i)=>(i?'L':'M')+(500+x*700)+' '+(950+y*1000)).join(' ');
 const mini=pts.map(([x,y],i)=>(i?'L':'M')+(300+x*270)+' '+(1400+y*340)).join(' ');
 const k=p*(pts.length-1),i=Math.min(pts.length-2,Math.floor(k)),q=k-i,x=pts[i][0]*(1-q)+pts[i+1][0]*q,y=pts[i][1]*(1-q)+pts[i+1][1]*q;
 return skyStudy(false)+skylineStudy()+ret(-200,900,1600,1300,'#a29282',0,0)+`<path d="${line}" fill="none" stroke="#464b57" stroke-width="420" stroke-linejoin="round"/><path d="${line}" fill="none" stroke="#e4c27d" stroke-width="9" stroke-dasharray="65 50"/>`+ret(100,1180,570,680,'#222632',45,5)+ret(123,1210,524,620,'#e7e4d9',28,0)+ret(123,1210,524,100,'#314b57',20,0)+txt(385,1274,o.hora||'',30,'#fff4d6')+`<path d="${mini}" fill="none" stroke="#3989c7" stroke-width="24" stroke-linejoin="round"/>`+ell(300+x*270,1400+y*340,14,14,'#fff3d9','#3989c7',5)+txt(385,1800,o.prazo||'',26,'#314b57');
}
return Object.freeze({personagem,seta,gps,rua:(t,o={})=>{noiteAtiva=o.ambiente==='noite';try{return roadStudy(t)}finally{noiteAtiva=false}},abertura:(o={})=>{aberturaTexto=[o.linha1||'',o.linha2||''];return introStudy()},arvore:arvoreBairro,lampada:lampStudy});
})();
'use strict';
// Se Vira, Tico: motor de episódio. Carregar depois de chars.js, cenarios.js e dos dados do episódio.
// O episódio define EPISODIO = { duracao, falas, planos, destaques, telas }. Tudo é função do tempo t.
const motor = (() => {
  const W = window.innerWidth, H = window.innerHeight, K = W / 1080;
  const canvas = document.getElementById('c'); canvas.width = W; canvas.height = H;
  const g = canvas.getContext('2d');
  const suave = (p) => { p = Math.max(0, Math.min(1, p)); return p * p * (3 - 2 * p); };
  const sai = (p) => { p = Math.max(0, Math.min(1, p)); return 1 - (1 - p) * (1 - p); };
  const hash = (n) => { const s = Math.sin(n * 127.1) * 43758.5453; return s - Math.floor(s); };
  const TRANS = .22;
  const QUEM = { 'Tico': 'tico', 'Jão': 'jao', 'Lua': 'lua', 'Borracheiro': 'borracheiro', 'Letícia': 'leticia', 'Vendedor': 'vendedor', 'CEO': 'ceo', 'Júnior': 'junior' };
  const NOME_COR = { tico: '#a8b94c', jao: '#e3c04a', lua: '#f0a48c', borracheiro: '#7fd6ee', leticia: '#f2c14e', vendedor: '#e9e4d8', ceo: '#9fb4d8', junior: '#cfe3ef' };
  const FASE = { tico: .3, lua: 1.4, jao: 2.2, borracheiro: 2.9, marlene: .9, fiscal: 1.7, leticia: 2.5, vendedor: .6, ceo: 1.1, junior: 2.0 };

  function poseEm(chaves, t) {
    const p = {}; let trocaExpr = -9;
    for (const [tk, parcial] of chaves) {
      for (const [campo, v] of Object.entries(parcial)) {
        if (Array.isArray(v)) {
          const de = p[campo];
          if (t >= tk) p[campo] = v;
          else if (t >= tk - TRANS && de) { const q = suave((t - tk + TRANS) / TRANS); p[campo] = v.map((x, i) => x + (de[i] - x) * (1 - q)); }
        } else if (typeof v === 'number' && campo !== 'blink') {
          const de = p[campo] == null ? (EPISODIO.graphicEyes && ['head','lean','liftL','liftR','breath'].includes(campo) ? 0 : v) : p[campo];
          if (t >= tk) p[campo] = v;
          else if (t >= tk - TRANS) p[campo] = de + (v - de) * suave((t - tk + TRANS) / TRANS);
        } else if (t >= tk) {
          if (campo === 'expr' && p.expr !== v) trocaExpr = tk;
          p[campo] = v;
        }
      }
    }
    if (Math.abs(t - trocaExpr) < (EPISODIO.graphicEyes ? .12 : .07)) p.blink = EPISODIO.graphicEyes ? 1-Math.abs(t-trocaExpr)/.12 : 1;
    return p;
  }
  function falaAtiva(id, t) { return EPISODIO.falas.find((f) => QUEM[f.quem] === id && t >= f.ini && t < f.fim); }
  // Tempo real do áudio para o tempo do roteiro, e o inverso (tempos.js, gerado por scripts/sincronizar.py)
  const TP = typeof TEMPOS !== 'undefined' ? TEMPOS : null;
  const interpola = (x, de, para) => {
    const n = TP.nos; if (x <= n[0][de]) return n[0][para];
    for (let i = 1; i < n.length; i++) if (x <= n[i][de]) return n[i - 1][para] + (n[i][para] - n[i - 1][para]) * (x - n[i - 1][de]) / (n[i][de] - n[i - 1][de]);
    return n[n.length - 1][para];
  };
  const paraRoteiro = (T) => TP ? interpola(T, 1, 0) : T;
  const paraReal = (t) => TP ? interpola(t, 0, 1) : t;
  function boca(id, t) {
    const f = falaAtiva(id, t);
    if (!f) return null;
    const env = TP && TP.env[f.n];
    if (env) {
      const v = env[Math.min(env.length - 1, Math.floor((t - f.ini) / (f.fim - f.ini) * env.length))];
      return v < .12 ? 'closed' : v < .38 ? 'small' : v < .7 ? 'open' : 'wide';
    }
    const v = hash(Math.floor(t * 11) + FASE[id] * 9);
    return v < .2 ? 'closed' : v < .5 ? 'small' : v < .85 ? 'open' : 'wide';
  }
  const avisados = new Set();
  function atorSVG(a, t, pl, cy, z, indice) {
    const pz = { ...poseEm(a.poses, t), ...(a.dyn ? a.dyn(t) : {}) }, f = FASE[a.id] || 0;
    const s = a.sF ? a.sF(t) : (a.s || 1.32), sx = a.flip ? -s : s;
    let x = a.x, y = a.y == null ? CHAO : a.y;
    if (a.xF) x = a.xF(t);
    if (a.yF) y = a.yF(t);
    if (a.movX) { const [t0, t1, x0, x1] = a.movX; x = x0 + (x1 - x0) * suave((t - t0) / (t1 - t0)); }
    const bp = (t + f * 1.31) % 3.7;
    const blink = pz.blink || (EPISODIO.graphicEyes ? (bp < .26 ? Math.sin(Math.PI * bp / .26) ** 2 : 0) : (bp < .13 ? 1 : 0));
    const breath = 1.5 + Math.sin(t * 1.9 + f) * 1.5;
    if (a.id === 'fiscal') {
      const lat = (EPISODIO.latidos || []).some((b) => t >= b && t < b + .32);
      const po = { ...pz, blink, breath: pz.breath != null ? pz.breath : breath, tail: (pz.tail == null ? 18 : pz.tail) + Math.sin(t * 7 + f) * 7, head: (pz.head || 0) + Math.sin(t * 1.3) * 1.5 };
      if (lat) { po.mouth = 1; po.head -= 9; po.expr = po.expr || 'bravo'; }
      return `<g transform="translate(${x} ${y}) scale(${sx * .9} ${s * .9})">${drawDog(po)}</g>`;
    }
    const po = { armL: [-9, -5], armR: [9, 5], graphicEyes: EPISODIO.graphicEyes || false, ...pz, blink, breath };
    const bal = Math.sin(t * 1.5 + f) * 1.3, fala = falaAtiva(a.id, t);
    po.armL = [po.armL[0] + bal, po.armL[1] + bal * 1.6]; po.armR = [po.armR[0] + bal * .8, po.armR[1] - bal * 1.4];
    // O balanço de cabeça entra e sai aos poucos: nunca salta no início ou no fim da fala
    const peso = fala ? Math.min(1, (t - fala.ini) / .12, (fala.fim - t) / .12) : 0;
    po.head = (po.head || 0) + Math.sin(t * .9 + f) * 1.2 + Math.sin(t * 5.3 + f) * 2.4 * peso;
    po.lean = (po.lean || 0) + Math.sin(t * .7 + f) * .5;
    const m = boca(a.id, t); if (m) po.mouth = m;
    const desenho = a.char ? a.char(t) : CHARS[a.id];
    // Regra das pernas: semPernas só vale se o corte da cintura ficar fora da tela ou o plano declarar cobrePernas,
    // quando algo desenhado na frente esconde o corte. Fora disso, as pernas voltam.
    if (po.semPernas && !pl.cobrePernas) {
      const cintura = y - s * (10 + desenho.thigh + desenho.shin + SHOE_H[desenho.shoe]);
      if (960 + z * (cintura - cy) < 1920) {
        po.semPernas = false;
        if (!avisados.has(pl.ini)) { avisados.add(pl.ini); console.warn(`semPernas ignorado em ${a.id}, plano de ${pl.ini}: o corte ficaria à vista`); }
      }
    }
    const visual = pl.visual ?? EPISODIO.visual ?? false;
    const luz = { ...(visual || {}) };
    if (a.flip) luz.lado = luz.lado === 'esquerda' ? 'direita' : 'esquerda';
    return `<g transform="translate(${x} ${y}) scale(${sx} ${s})">${typeof SerieVisual !== 'undefined' && visual !== false ? SerieVisual.personagem(drawChar(desenho, po), luz, a.id + '-' + indice) : drawChar(desenho, po)}</g>`;
  }
  function camEm(cam, t) {
    let a = cam[0];
    for (let i = 0; i < cam.length; i++) {
      const c = cam[i];
      if (t >= c[0]) { a = c; const n = cam[i + 1]; if (n && t < n[0] && t > n[0] - (n[4] || .9)) { const q = suave((t - n[0] + (n[4] || .9)) / (n[4] || .9)); return [a[1] + (n[1] - a[1]) * q, a[2] + (n[2] - a[2]) * q, a[3] + (n[3] - a[3]) * q]; } }
    }
    return [a[1], a[2], a[3]];
  }
  function quadroSVG(pl, t) {
    let [cx, cy, z] = camEm(pl.cam, t);
    // respiração de câmera: nunca para por completo
    cx += Math.sin(t * .6) * 3; cy += Math.sin(t * .45) * 3; z *= 1 + Math.sin(t * .35) * .006;
    const tf = (f) => `translate(${540} ${960}) scale(${z}) translate(${-540 - (cx - 540) * f} ${-960 - (cy - 960) * f})`;
    let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 1080 1920">`;
    const nome = typeof pl.cena === 'function' ? pl.cena(t) : pl.cena;
    // Plano em preto e branco: pl.cor(t) vai de 1 (colorido) a 0 (cinza)
    const cor = pl.cor ? pl.cor(t) : 1;
    if (cor < 1) s += `<defs><filter id="pb" filterUnits="userSpaceOnUse" x="0" y="0" width="1080" height="1920" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="${cor.toFixed(3)}"/></filter></defs><g filter="url(#pb)">`;
    for (const c of CENARIOS[nome]()) s += `<g transform="${tf(c.f)}">${c.svg}</g>`;
    s += `<g transform="${tf(1)}">`;
    if (pl.fundo) s += pl.fundo(t);
    for (const [indice, a] of (pl.atores || []).entries()) s += atorSVG(a, t, pl, cy, z, indice);
    if (pl.frente) s += pl.frente(t);
    s += '</g>';
    if (cor < 1) s += '</g>';
    return s + '</svg>';
  }
  const FADE = .13;
  function blocosDe(f) {
    if (f.palavras && f.palavras.length) {
      const out = [];
      for (let i=0;i<f.palavras.length;i+=3) { const ws=f.palavras.slice(i,i+3); out.push({b:ws.map(w=>w.palavra),ini:ws[0].ini,fim:ws[ws.length-1].fim}); }
      return out;
    }
    const blocos = []; let atual = [];
    for (const w of f.texto.split(' ')) { atual.push(w); if (atual.length === 3 || /[.!?,:]$/.test(w)) { blocos.push(atual); atual = []; } }
    if (atual.length) blocos.push(atual);
    const letras = blocos.map((b) => b.join(' ').length), tot = letras.reduce((a, b) => a + b, 0), d = f.fim - f.ini;
    let acum = 0; return blocos.map((b, i) => { const ini = f.ini + acum / tot * d; acum += letras[i]; return { b, ini, fim: f.ini + acum / tot * d }; });
  }
  function desenhaBloco(pal, f, alfa) {
    const y = f.legendaY ?? EPISODIO.legendaY ?? 1360, destaque = (EPISODIO.destaques || {})[f.n];
    g.save(); g.globalAlpha = alfa; g.textAlign = 'left'; g.textBaseline = 'middle'; g.lineJoin = 'round';
    g.font = '900 60px Arial Black, Arial, sans-serif';
    let total = g.measureText(pal.join(' ')).width;
    const tam = total > 960 ? 60 * 960 / total : 60;
    g.font = `900 ${tam}px Arial Black, Arial, sans-serif`;
    total = g.measureText(pal.join(' ')).width;
    let x = 540 - total / 2;
    for (const w of pal) {
      g.lineWidth = 12; g.strokeStyle = '#1b100b'; g.strokeText(w, x, y);
      g.fillStyle = destaque && w.toLowerCase().replace(/[^a-zà-ú0-9]/g, '') === destaque ? '#ffd83a' : '#ffffff'; g.fillText(w, x, y);
      x += g.measureText(w + ' ').width;
    }
    if (EPISODIO.nomes !== false) { const id = QUEM[f.quem]; g.font = '900 30px Arial Black, Arial, sans-serif'; g.textAlign = 'center'; g.lineWidth = 8; g.strokeText(f.quem, 540, y - 66); g.fillStyle = NOME_COR[id] || '#fff'; g.fillText(f.quem, 540, y - 66); }
    g.restore();
  }
  function legenda(t) {
    for (const f of EPISODIO.falas) {
      if (f.semLegenda || t < f.ini || t > f.fim + FADE) continue;
      for (const { b, ini, fim } of blocosDe(f)) {
        if (t < ini || t > fim + FADE) continue;
        const alfa = Math.min(1, (t - ini) / FADE, t > fim ? 1 - (t - fim) / FADE : 1);
        if (alfa > 0) desenhaBloco(b, f, alfa);
      }
    }
  }
  function cartao(x, y, w, h, cor) { g.beginPath(); g.roundRect(x, y, w, h, 22); g.fillStyle = cor; g.fill(); g.lineWidth = 5; g.strokeStyle = '#1b100b'; g.stroke(); }
  const texto = (s, x, y, tam, cor = '#fff', alinha = 'center') => { g.font = `900 ${tam}px Arial Black, Arial, sans-serif`; g.textAlign = alinha; g.textBaseline = 'middle'; g.fillStyle = cor; g.fillText(s, x, y); };
  function telas(t) { for (const e of EPISODIO.telas || []) if (t >= e.ini && t < e.fim) { g.save(); if(EPISODIO.suavizarTelas && e.fim < EPISODIO.duracao) g.globalAlpha=Math.min(1,e.ini===0?1:(t-e.ini)/.18,(e.fim-t)/.18); e.desenha((t - e.ini) / (e.fim - e.ini), t - e.ini, { g, cartao, texto, sai, suave }); g.restore(); } }

  window.FILM_DURATION = TP ? TP.duracao : EPISODIO.duracao;
  window.CUTS = EPISODIO.planos.filter((p) => !p.continua).map((p) => p.ini).filter((t) => t > 0).concat(EPISODIO.impactos || []).map(paraReal);
  window.renderFrame = async (real) => {
    const t = paraRoteiro(real);
    const pl = EPISODIO.planos.find((p) => t >= p.ini && t < p.fim) || EPISODIO.planos[EPISODIO.planos.length - 1];
    const img = new Image();
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(quadroSVG(pl, t));
    await img.decode();
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none';
    g.fillStyle = '#111'; g.fillRect(0, 0, W, H);
    g.drawImage(img, 0, 0);
    g.setTransform(K, 0, 0, K, 0, 0);
    telas(t); legenda(t);
  };
  return { quadroSVG };
})();
document.fonts.ready.then(() => { window.READY = true; });
