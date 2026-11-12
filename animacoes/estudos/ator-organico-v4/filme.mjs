import {sample,stage,knee,DURATION,mouthNames,mouthPose} from './atuacao.mjs';
import {ribbon,roundMouth} from './formas.mjs';
import {pupil,eyeFocus} from './olhos.mjs';
import {drawAnterior,faceAnterior} from './anterior.mjs';
const canvas=document.querySelector('canvas'),main=canvas.getContext('2d');let g=main;
const ink='#30222b',skin='#ca916b';
const hairSvg=new Image();hairSvg.src='./assets/cabelo-orelhas.svg';await hairSvg.decode();
// SVG em transformações variáveis muda o cache de rasterização do Chrome.
// Raster fixo em 3× preserva os mesmos pixels em qualquer ordem de quadros.
const hair=document.createElement('canvas');hair.width=780;hair.height=990;
hair.getContext('2d').drawImage(hairSvg,-300,-150,1320,3000);
const layer=document.createElement('canvas');layer.width=1600;layer.height=2200;
const mask=document.createElement('canvas');mask.width=1600;mask.height=2200;
let cacheTime=-1;
function path(d,fill,stroke=ink,width=4){const p=new Path2D(d);if(fill){g.fillStyle=fill;g.fill(p);}if(stroke){g.strokeStyle=stroke;g.lineWidth=width;g.stroke(p);}return p;}
function ellipse(x,y,rx,ry,fill,stroke=null,w=3){g.beginPath();g.ellipse(x,y,rx,Math.max(.01,ry),0,0,Math.PI*2);g.fillStyle=fill;g.fill();if(stroke){g.strokeStyle=stroke;g.lineWidth=w;g.stroke();}}
function text(s,x,y,size,color=ink,align='left',weight=600){g.fillStyle=color;g.font=`${weight} ${size}px Arial`;g.textAlign=align;g.fillText(s,x,y);}
function gradient(x0,y0,x1,y1,stops){const c=g.createLinearGradient(x0,y0,x1,y1);stops.forEach(([at,color])=>c.addColorStop(at,color));return c;}
function clipped(shape,draw){g.save();g.clip(new Path2D(shape));draw();g.restore();}
function hand(x,y,angle,mode,mirror){
  g.save();g.translate(x,y);g.rotate(angle);if(mirror)g.scale(-1,1);
  const shapes=[
    'M-16 0 Q0 -3 16 0 Q22 12 20 29 Q17 47 0 48 Q-20 47 -21 28 Q-21 12 -16 0 Z',
    'M-14 0 Q0 -3 14 0 L18 14 L31 20 Q39 25 34 30 Q31 34 25 30 L16 27 L22 49 Q22 57 17 56 L7 36 L10 61 Q10 68 4 67 L0 40 L-3 65 Q-5 71 -10 66 L-12 40 L-19 58 Q-23 64 -27 59 L-22 29 Q-23 13 -14 0 Z',
    'M-15 0 Q0 -3 14 0 L18 14 Q25 18 21 27 L12 39 Q0 44 -11 40 Q-23 34 -21 21 Q-22 8 -15 0 Z',
    'M-14 0 Q0 -3 14 0 L18 13 L31 25 Q35 30 29 33 L17 28 L25 45 Q27 51 22 52 L10 36 L15 55 Q15 62 10 60 L1 39 L2 59 Q0 65 -5 61 L-10 38 L-15 55 Q-19 60 -22 55 L-21 29 Q-23 12 -14 0 Z',
  ];
  path(shapes[mode],gradient(-20,0,20,20,[[0,'#dfa880'],[1,'#bd805e']]),ink,3.6);
  path(mode===2?'M-14 19 Q-2 12 12 20 M-13 27 Q-2 24 8 27 M-10 34 Q-3 32 5 34':mode===0?'M-13 22 Q-8 29 -12 34 M-3 24 Q2 30 -2 37':'M-14 26 Q0 19 13 28',null,'#9d654b',2.2);
  g.restore();
}
function sleeve(x,y,upper,fore,mode,patch){
  const a=upper*Math.PI/180,b=fore*Math.PI/180;
  const joint=[x+Math.cos(a)*112,y+Math.sin(a)*112],wrist=[joint[0]+Math.cos(b)*112,joint[1]+Math.sin(b)*112];
  const band=ribbon([x,y],joint,wrist,[55,46,34]);
  path(band.outline,gradient(x-25,y,x+45,y+200,[[0,'#db8351'],[.5,'#c66a3f'],[1,'#a94c32']]),ink,4.2);
  clipped(band.outline,()=>{
    const shift=8;
    path(`M${x+10} ${y-30} Q${joint[0]+shift} ${joint[1]-4} ${wrist[0]+12} ${wrist[1]+35} L${wrist[0]+70} ${wrist[1]+20} Q${joint[0]+55} ${joint[1]} ${x+55} ${y-20} Z`,'#9c482e',null);
    path(`M${x-13} ${y+20} Q${joint[0]-18} ${joint[1]-14} ${joint[0]-10} ${joint[1]+8}`,null,'#ecaa6d',3);
  });
  g.save();g.translate(...joint);g.rotate((a+b)*.5);
  path('M-8 -12 Q0 -3 7 2 M-7 1 Q1 4 8 1',null,'#8f482f',2.2);g.restore();
  g.save();g.translate(...wrist);g.rotate(b-Math.PI/2);
  path('M-19 -13 Q0 -17 19 -13 L18 7 Q0 14 -18 7 Z','#47333a',ink,3.5);
  path('M-10 -10 Q-11 -2 -9 7 M0 -11 Q-1 -2 0 9 M10 -10 Q11 -2 9 7',null,'#765455',2);g.restore();
  if(patch){const px=x+(joint[0]-x)*.69,py=y+(joint[1]-y)*.69;ellipse(px,py,16,16,'#f0bb48',ink,2);text('★',px,py+7,21,ink,'center');}
  hand(wrist[0]+Math.cos(b)*11,wrist[1]+Math.sin(b)*11,b-Math.PI/2,mode,!patch);
}
function trouser(top,joint,foot,side){
  const band=ribbon(top,joint,foot,[62,51,42]);
  path(band.outline,gradient(top[0]-30,top[1],top[0]+35,top[1]+250,[[0,'#425779'],[.5,'#34496c'],[1,'#263954']]),ink,4.2);
  clipped(band.outline,()=>{
    path(`M${top[0]+21} ${top[1]-20} Q${joint[0]+22} ${joint[1]} ${foot[0]+16} ${foot[1]+25} L${foot[0]+45} ${foot[1]+25} Q${joint[0]+52} ${joint[1]} ${top[0]+45} ${top[1]-20} Z`,'#24344f',null);
    path(`M${top[0]-18} ${top[1]+20} Q${joint[0]-20} ${joint[1]-7} ${foot[0]-13} ${foot[1]-28}`,null,'#647b99',2.3);
  });
  path(`M${joint[0]-12} ${joint[1]+4} Q${joint[0]+1} ${joint[1]+9} ${joint[0]+13} ${joint[1]+3} M${foot[0]-15} ${foot[1]-17} Q${foot[0]} ${foot[1]-10} ${foot[0]+14} ${foot[1]-15}`,null,'#7d8ba3',2);
  g.save();g.translate(foot[0],0);if(side>0)g.scale(-1,1);
  path('M-26 909 Q-7 900 23 908 Q32 918 28 942 Q10 954 -42 947 Q-46 923 -26 909 Z','#f6ecda',ink,4);
  path('M-42 938 Q-8 944 28 936 Q32 943 27 949 Q-12 956 -42 949 Z','#3c2c34',null);
  path('M-23 919 Q-3 914 17 916 L16 927 Q-3 925 -24 932 Z','#db713d',null);
  path('M-11 911 Q-7 915 -7 920 M0 909 Q4 914 4 919',null,'#c4b79f',2);g.restore();
}
function torso(p){
  const lag=(sample(Math.max(0,p.time-.13)).lean-p.lean)*1.25;
  const breath=Math.sin(p.time*2.1)*1.4;
  const lift=-p.jaw*5-p.smile*2;
  const d=`M128 ${408+lift} C122 388 162 371 193 373 Q220 ${363-breath} 255 375 C287 371 320 390 314 ${419+lift} C304 464 307 519 ${315+lag} 560 C323 605 318 647 304 669 Q221 694 136 671 C124 651 123 609 ${130+lag} 572 Q136 514 128 ${408+lift} Z`;
  path(d,gradient(120,400,328,520,[[0,'#d57a49'],[.52,'#bc5a36'],[1,'#a54c32']]),ink,4.5);
  clipped(d,()=>{
    path(`M288 407 Q282 468 ${292+lag} 538 Q307 621 288 677 L340 699 V400 Z`,'#9a472f',null);
    path('M143 431 Q155 482 146 525',null,'#eb9b63',3);
    path('M145 561 Q164 550 177 560 M289 566 Q276 553 261 563 M139 617 Q159 606 176 610 M298 617 Q280 607 267 611',null,'#8e412e',2.5);
  });
  path('M184 373 Q220 361 256 373 L233 439 Q221 446 207 438 Z','#f4e6c9',ink,3.5);
  path(`M128 ${408+lift} Q151 376 189 374 Q183 408 169 425 Q138 430 117 ${414+lift} Z`,'#f1dfb9',ink,4);
  path(`M314 ${419+lift} Q289 430 269 423 Q257 404 254 375 Q293 375 323 ${406+lift} Z`,'#e5cfa8',ink,4);
  path('M139 429 Q153 437 169 433 M276 434 Q292 439 310 430',null,'#f6d9b1',2.4);
  path('M137 487 Q173 481 211 487 L212 510 Q173 504 135 512 Z',gradient(135,487,211,510,[[0,'#b0b9bc'],[.5,'#f7f1dc'],[1,'#a1adb1']]),ink,2.8);
  path('M229 488 Q268 482 309 488 L310 511 Q270 506 228 511 Z',gradient(228,488,310,510,[[0,'#c6cccb'],[.5,'#f7f1dc'],[1,'#96a5aa']]),ink,2.8);
  path('M242 526 Q267 520 292 526 L292 545 Q269 561 242 546 Z','#b05434',ink,2.8);ellipse(268,541,3,3,'#e2dcd2');
  path('M150 529 Q168 525 186 529 L187 543 Q170 548 150 544 Z','#eddbb3',ink,2.5);
  path('M151 575 Q169 561 187 562 Q191 586 184 607 M290 575 Q271 563 253 563 Q249 585 256 606',null,ink,3);
  path('M220 439 Q226 534 220 653',null,ink,8);
  g.save();g.setLineDash([4,4]);path('M220 440 Q226 534 220 650',null,'#c6cccb',3);g.restore();
  path('M216 452 Q222 449 227 452 L227 469 Q221 475 216 469 Z','#dce0d9',ink,2.5);
  path('M135 646 Q221 663 307 646 L304 673 Q221 695 137 673 Z','#4b343c',ink,4);
  for(let x=155;x<=285;x+=20)path(`M${x} 657 Q${x-2} 667 ${x} 677`,null,'#765555',2);
  path('M192 323 Q220 330 248 323 L247 373 Q221 391 193 373 Z',gradient(190,330,251,350,[[0,'#c38a64'],[1,'#a66a4d']]),ink,3.5);
  path('M194 337 Q222 356 246 337 L246 351 Q219 365 194 352 Z','#9d644a',null);
  path('M169 354 Q180 341 195 341 Q205 376 214 417 Q195 419 180 407 Z','#edb640',ink,3.8);
  path('M271 354 Q258 341 246 341 Q237 376 226 417 Q247 420 261 407 Z','#dba333',ink,3.8);
}
function headBase(p){
  const chin=344+p.jaw*7-p.smile*2;
  const cheek=p.smile*3;
  path(`M144 192 Q144 130 220 130 Q296 130 296 192 L${296+cheek} 261 C${302+cheek} 302 279 ${chin} 220 ${chin} C160 ${chin} ${137-cheek} 303 ${144-cheek} 262 Z`,gradient(137,230,301,260,[[0,'#dfa57b'],[.55,'#cd936b'],[1,'#b77d59']]),ink,4.5);
  g.drawImage(hair,100,50,260,330);
  ellipse(266+p.smile,300-p.smile,3.6,3.6,'#49301f');
}
function face(p){
  const focus=eyeFocus(p);
  const happy=p.smile>.45 && p.round<.3,cheek=happy?p.smile:0;
  const alert=p.round>.45&&!p.viseme?p.jaw:0;
  const skeptic=Math.min(1,Math.max(0,p.tiltL/.16))*Math.min(1,Math.max(0,-p.tiltR/.13));
  for(const [cx,side] of [[188,-1],[252,1]]){
    const cy=246+(side>0?.4:-.3),w=22+alert*1.5+(side>0?-.4:.2);
    const asym=1+side*(.04+p.gaze*.0015+(p.browR-p.browL)*.001)-side*skeptic*.22;
    const h=Math.max(.6,(18+alert*5-cheek*2)*p.lid*asym),bottom=cy+Math.max(2,h*.7-cheek*2-skeptic*1.5);
    if(h<2){path(`M${cx-w} ${cy} Q${cx} ${cy+(happy?-7:3)} ${cx+w} ${cy}`,null,ink,4);continue;}
    const top=`M${cx-w} ${cy} C${cx-w} ${cy-h*1.33} ${cx+w} ${cy-h*1.33} ${cx+w} ${cy}`;
    const lower=`C${cx+w*.65} ${bottom+4} ${cx-w*.65} ${bottom+4} ${cx-w} ${cy}`;
    const eye=top+' '+lower+' Z';
    const irisX=cx+focus.x-side*.7,irisY=cy-2+focus.y-cheek*1.4;
    clipped(eye,()=>{
      g.fillStyle='#f5e9d4';g.fillRect(cx-27,210,54,70);
      if(p.eyeStyle==='iris'){
        ellipse(irisX,irisY,14.7+alert,16+alert,gradient(irisX-10,irisY-12,irisX+7,irisY+15,[[0,'#493023'],[.5,'#79502f'],[1,'#966b40']]),'#573b29',1);
        ellipse(irisX+.3,irisY,8+alert*1.5,10+alert,'#24191b');
        g.fillStyle=gradient(cx,cy-h,cx,cy-h+9,[[0,'#5d3d2855'],[1,'#5d3d2800']]);g.fillRect(cx-27,cy-h-3,54,13);
        ellipse(irisX-4.2,irisY-6.5,2.3,2.6,'#fff9e8');
      }else{
        const q=pupil(p);
        ellipse(irisX,irisY,q.radius,q.height,'#211c22');
        ellipse(irisX-q.radius*.27,irisY-q.height*.34,q.shine,q.shine*1.08,'#fffbed');
      }
    });
    path(eye,null,'#53382b',2.5);path(top,null,ink,4.3);
  }
  for(const [x,dy,tilt,scar] of [[188,p.browL,p.tiltL,false],[252,p.browR,p.tiltR,true]]){g.save();g.translate(x,213+dy+(happy?4:0));g.rotate(tilt);path(scar?`M-20 3 Q-13 ${-5-skeptic*4} -5 ${-5-skeptic*5} M7 ${-5-skeptic*5} Q15 ${-5-skeptic*4} 21 ${2-skeptic*6}`:`M-21 ${2-skeptic*5} Q0 ${-13+skeptic*7} 21 ${4+skeptic*5}`,null,ink,7.5);g.restore();}
  path(`M${222+p.gaze*.15} 258 Q${212+p.gaze*.2} 282 ${216+p.gaze*.2} 288 Q224 292 232 288`,null,'#935d42',3.5);
  const m=roundMouth(p),{w,cy,open}=m;
  if(p.jaw<.055){path(`M${220-w} ${cy} Q220 ${cy+2+p.smile*13} ${220+w} ${cy}`,null,ink,3.8);if(p.viseme==='MBP')path('M204 318 Q220 323 236 318',null,'#9d654b',2);return;}
  clipped(m.d,()=>{
    g.fillStyle='#4c2231';g.fillRect(165,280,110,85);
    if((p.smile>.25||p.jaw>.65||p.viseme==='FV') && p.round<.5){
      // Arcada curva inteira: poucos sulcos curtos, sem grade de dentes.
      const lower=cy+6+p.jaw*3;
      path(`M${218-w} ${cy-13} Q220 ${cy-18} ${222+w} ${cy-13} L${222+w} ${lower-3} Q220 ${lower+7} ${218-w} ${lower-3} Z`,gradient(220,cy-5,220,lower+5,[[0,'#fff9e7'],[1,'#e8d9bb']]),null);
      if(p.smile>.65){path(`M218 ${lower+3} Q219 ${lower} 219 ${lower-1} M233 ${lower+2} Q232 ${lower} 232 ${lower-1}`,null,'#cbbd9f',1.2);}
    }
    if(p.jaw>.22){const ty=cy+open+2;ellipse(221,ty,w*.58,5+p.jaw*3,'#df7d8a');path(`M222 ${ty-3} Q220 ${ty} 220 ${ty+2}`,null,'#b85971',1.4);}
    if(p.viseme==='FV'){path(`M180 ${cy+7} Q220 ${cy+1} 260 ${cy+7} V350 H180 Z`,skin,null);path(`M197 ${cy+6} Q220 ${cy+10} 243 ${cy+6}`,null,'#92583e',2);}
  });
  path(m.d,null,ink,3.5);
  if(p.smile>.4){path('M180 298 Q174 302 178 307 M260 298 Q266 302 262 307',null,'#9c664b',2.3);}
}
function paintActor(p){
  const hip=[220+p.hip,667+p.dy];
  for(const [x,side]of [[175,-1],[265,1]]){const top=[hip[0]+side*36,hip[1]],foot=[x,913];trouser(top,knee(top,foot,125,125,-side),foot,side);}
  g.save();g.translate(...hip);g.rotate(p.lean*Math.PI/180);g.translate(-220,-667);
  const lift=-p.jaw*5-p.smile*2;
  sleeve(143,410+lift,p.armL,p.foreL,p.handL,false);sleeve(297,410+lift,p.armR,p.foreR,p.handR,true);torso(p);
  g.save();g.translate(220,334+p.headY);g.rotate(p.head*Math.PI/180);g.scale(1/p.squash,p.squash);g.translate(-220,-334);
  headBase(p);face(p);g.restore();g.restore();
}
function prepareActor(p){
  if(cacheTime===p.time)return;
  const prev=g;g=layer.getContext('2d');g.reset();g.setTransform(2,0,0,2,360,80);g.lineCap='round';g.lineJoin='round';paintActor(p);g=prev;
  const m=mask.getContext('2d');m.reset();m.drawImage(layer,0,0);m.globalCompositeOperation='source-in';m.fillStyle='#674355';m.fillRect(0,0,mask.width,mask.height);m.globalCompositeOperation='source-over';cacheTime=p.time;
}
function shadow(p){
  // Projeção afim da silhueta atual, com luz da janela à esquerda.
  for(const [opacity,blur]of [[.18,4],[.07,1.5]]){g.save();g.globalAlpha=opacity;g.filter=`blur(${blur}px)`;g.transform(.60,0,-.34,.15,411,807.5);g.drawImage(mask,-180,-40,800,1100);g.restore();}
  for(const x of [175,265]){
    g.save();g.globalAlpha=.22;g.filter='blur(3px)';ellipse(x,952,40,7,'#6e4250');g.restore();
    g.save();g.globalAlpha=.54;g.filter='blur(1px)';ellipse(x,951,33,4.5,'#61414b');g.restore();
  }
}
function background(x,width,old){
  g.save();g.translate(x,0);g.beginPath();g.rect(0,100,width,711);g.clip();g.fillStyle='#fae8c4';g.fillRect(0,100,width,711);
  path('M0 540 L620 495 V815 H0 Z','#e8a67c',null);
  path('M55 550 V255 Q55 155 145 155 Q235 155 235 255 V550 Z','#65b7bd',null);path('M70 538 V258 Q70 172 145 172 Q220 172 220 258 V538 Z','#a5dce0',null);path('M70 395 L220 267 V304 L70 432 Z','#e2f1dc',null);path('M70 258 H220 M145 172 V538 M70 397 H220',null,'#fbf1d7',9);path('M400 100 V400 L585 335 V100 Z','#f6cb62',null);path('M470 100 V323 L620 270 V100 Z','#ffe6a1',null);path('M0 668 L620 610',null,'#cf856c',2);
  if(old)ellipse(310,766,162,18,'#bd775c');
  if(old)plant();g.restore();
}
function plant(){path('M540 700 L550 764 H595 L603 700 Z','#2b7880','#251d27',2);path('M572 706 Q542 653 535 624 Q573 632 575 684 M574 700 Q599 643 613 634 Q616 675 578 706','#4d9576',null);}
function actorSpace(x,close){g.save();g.beginPath();g.rect(x,105,620,704);g.clip();g.translate(x+310,close?680:778);g.scale(close?1.55:.70,close?1.55:.70);g.translate(-220,close?-410:-950);}
window.renderFrame=function(t,useNew=true){
  t=Math.max(0,Math.min(DURATION,t));g=main;g.reset();g.lineCap='round';g.lineJoin='round';g.fillStyle='#f5eedf';g.fillRect(0,0,1280,900);
  text('PLOTLINE / CORPO, BOCA E OLHAR',34,36,19,'#6b5b52');text('Mais curvas, volume e expressão.',34,76,31);
  background(12,620,true);background(648,620,false);
  const close=t>=4&&t<8.1,p=sample(t);prepareActor(p);
  for(const [x,newSide]of [[12,false],[648,true]]){
    if(newSide&&useNew){actorSpace(x,close);shadow(p);g.restore();}
    if(newSide){g.save();g.translate(x,0);plant();g.restore();}
    actorSpace(x,close);if(newSide&&useNew)g.drawImage(layer,-180,-40,800,1100);else drawAnterior(p,t);g.restore();
    g.fillStyle=newSide?'#226e77':'#68554e';g.fillRect(x+18,119,newSide?289:267,36);text(newSide?'REVISÃO / FORMAS ORGÂNICAS':'ANTES / VERSÃO ARTICULADA',x+31,144,16,'#fff8e6');
  }
  text(stage(t),36,851,25);text('Mesmos gestos e enquadramentos · sem áudio · pupila preta · sombra da silhueta',36,882,17,'#76665b');
};
window.verifyScope=function(){
  renderFrame(6.2,false);const a=main.getImageData(0,0,1280,900).data;renderFrame(6.2,true);const b=main.getImageData(0,0,1280,900).data;
  for(let y=0;y<900;y++)for(let x=0;x<1280;x++){if(x>=648&&x<1268&&y>=100&&y<811)continue;const i=(y*1280+x)*4;for(let k=0;k<4;k++)if(a[i+k]!==b[i+k])return false;}
  return true;
};
window.renderVisemes=function(){
  g=main;g.setTransform(1,0,0,1,0,0);g.fillStyle='#f5eedf';g.fillRect(0,0,1280,900);text('Bocas curvas / arcada, lábios e bochechas trabalham juntos',30,38,26);
  mouthNames.forEach((name,i)=>{const x=(i%4)*320,y=Math.floor(i/4)*418+60;g.save();g.translate(x+160,y+70);g.scale(1.12,1.12);g.translate(-220,-100);const p={...sample(0),...mouthPose(name)};headBase(p);face(p);g.restore();text(name,x+160,y+390,23,ink,'center');});
};
window.renderSmiles=function(){
  g=main;g.setTransform(1,0,0,1,0,0);g.fillStyle='#f5eedf';g.fillRect(0,0,1280,900);text('Sorriso / repouso, simpatia, alegria e riso',30,40,28);
  const variants=[{name:'Sorriso fechado',jaw:0,smile:.65,lid:.85},{name:'Sorriso aberto',jaw:.28,smile:1,lid:.8},{name:'Alegria',jaw:.50,smile:1,lid:.64},{name:'Riso',jaw:.88,smile:1,lid:.08}];
  for(let i=0;i<4;i++){const x=(i%2)*640,y=Math.floor(i/2)*410;g.save();g.translate(x+320,y+85);g.scale(1.15,1.15);g.translate(-220,-100);const p={...sample(0),browL:0,browR:-2,...variants[i]};headBase(p);face(p);g.restore();text(variants[i].name,x+320,y+398,24,ink,'center');}
};
window.renderEyes=function(){
  g=main;g.reset();g.fillStyle='#f5eedf';g.fillRect(0,0,1280,900);text('Olhar / foco, intenção e forma — além de piscar',30,40,27);
  const times=[0,1.2,4.7,6.5],labels=['Repouso atento','Curiosidade','Desconfiança','Alegria'];
  times.forEach((t,i)=>{const x=(i%2)*640,y=Math.floor(i/2)*410,p=sample(t);g.save();g.translate(x+320,y+85);g.scale(1.15,1.15);g.translate(-220,-100);headBase(p);face(p);g.restore();text(labels[i],x+320,y+398,24,ink,'center');});
};
window.renderEyeStyles=function(){
  g=main;g.reset();g.fillStyle='#f5eedf';g.fillRect(0,0,1280,900);text('Mesmo rosto e expressão / íris colorida × pupila preta',30,38,26);
  const poses=[{...sample(1.2),label:'Foco lateral'},{...sample(2.9),label:'Espanto'},{...sample(6.5),label:'Alegria'}];
  poses.forEach((p,i)=>{for(let j=0;j<2;j++){const x=j*640,y=i*276+55;g.save();g.translate(x+320,y+12);g.scale(.80,.80);g.translate(-220,-60);headBase(p);face({...p,eyeStyle:j?'preto':'iris'});g.restore();text(`${p.label} · ${j?'pupila preta':'íris colorida'}`,x+320,y+259,21,ink,'center');}});
};
window.FILM_DURATION=DURATION;window.READY=true;renderFrame(0);
if(!new URLSearchParams(location.search).has('render')){const start=performance.now();const play=now=>{renderFrame(((now-start)/1000)%DURATION);requestAnimationFrame(play);};requestAnimationFrame(play);}
