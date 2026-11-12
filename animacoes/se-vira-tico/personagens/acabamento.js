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
