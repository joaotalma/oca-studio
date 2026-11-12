import {sample,stage,knee,DURATION,mouthNames,mouthPose} from './atuacao.mjs';
const canvas=document.querySelector('canvas'),g=canvas.getContext('2d');
const ink='#251d27',skin='#c68b64';
const images={};
await Promise.all(['base','tronco','cabeca'].map(async k=>{const img=new Image();img.src=`./assets/${k}.svg`;await img.decode();images[k]=img;}));
function path(d,fill,stroke=ink,width=4){g.beginPath();const p=new Path2D(d);if(fill){g.fillStyle=fill;g.fill(p);}if(stroke){g.strokeStyle=stroke;g.lineWidth=width;g.stroke(p);}}
function ellipse(x,y,rx,ry,fill,stroke=null,w=3){g.beginPath();g.ellipse(x,y,rx,Math.max(.01,ry),0,0,Math.PI*2);g.fillStyle=fill;g.fill();if(stroke){g.strokeStyle=stroke;g.lineWidth=w;g.stroke();}}
function line(points,color,width){g.beginPath();g.moveTo(...points[0]);for(const p of points.slice(1))g.lineTo(...p);g.strokeStyle=color;g.lineWidth=width;g.stroke();}
function text(txt,x,y,size,color=ink,align='left',weight=600){g.fillStyle=color;g.font=`${weight} ${size}px Arial`;g.textAlign=align;g.fillText(txt,x,y);}
function hand(x,y,angle,mode,mirror=false){
  g.save();g.translate(x,y);g.rotate(angle);g.lineJoin='round';g.lineCap='round';
  if(mirror)g.scale(-1,1);
  const open=mode>.4;
  if(open){
    // Silhueta de mão com dedos separados; punho é a origem.
    if(mode>1.5 && mode<2.5){
      path('M-15 0 H14 L18 14 Q25 18 21 27 L12 39 L-11 40 Q-23 34 -21 21 L-19 11 Z',skin,ink,3.5);
      path('M-14 19 Q-2 12 12 20 M-13 27 H8 M-10 34 H5',null,'#955d45',2.5);
    }else if(mode>2.5){
      path('M-14 0 H14 L18 13 L31 25 Q35 30 29 33 L17 28 L25 45 Q27 51 22 52 L10 36 L15 55 Q15 62 10 60 L1 39 L2 59 Q0 65 -5 61 L-10 38 L-15 55 Q-19 60 -22 55 L-21 29 L-20 14 Z',skin,ink,3.5);
      path('M-12 22 Q1 15 14 25',null,'#955d45',2.5);
    }else{
      path('M-14 0 H14 L18 14 L31 20 Q39 25 34 30 Q31 34 25 30 L16 27 L22 49 Q22 57 17 56 L7 36 L10 61 Q10 68 4 67 L0 40 L-3 65 Q-5 71 -10 66 L-12 40 L-19 58 Q-23 64 -27 59 L-22 29 L-20 13 Z',skin,ink,3.5);
      path('M-14 26 Q0 19 13 28',null,'#955d45',2.5);
    }
  }else{path('M-19 0 L19 0 L20 29 Q15 49 -1 47 Q-23 47 -20 20 Z',skin,ink,4);path('M-13 22 L-12 34 M-3 24 L-2 37 M7 24 L7 35',null,'#9e6248',2);}
  g.restore();
}
function arm(x,y,upper,fore,mode,patch=false){
  const a=upper*Math.PI/180,b=fore*Math.PI/180;
  const elbow=[x+Math.cos(a)*112,y+Math.sin(a)*112],wrist=[elbow[0]+Math.cos(b)*112,elbow[1]+Math.sin(b)*112];
  line([[x,y],elbow,wrist],ink,48);line([[x,y],elbow],'#b45433',40);line([elbow,wrist],'#c3663d',36);
  const cuff=[wrist[0]-Math.cos(b)*9,wrist[1]-Math.sin(b)*9];
  line([cuff,wrist],ink,42);line([cuff,wrist],'#3d3036',34);
  if(patch){const px=x+(elbow[0]-x)*.7,py=y+(elbow[1]-y)*.7;ellipse(px,py,16,16,'#e8b23f',ink,2);text('★',px,py+7,21,ink,'center');}
  path(`M${elbow[0]-8} ${elbow[1]} q10 8 20 -1`,null,'#8e402d',2.5);
  hand(wrist[0]+Math.cos(b)*11,wrist[1]+Math.sin(b)*11,b-Math.PI/2,mode,!patch);
}
function face(p,t){
  const look=p.gaze,up=p.gazeY;
  for(const [cx,offset] of [[188,-1],[252,1]]){
    const h=Math.max(.7,24*p.lid);
    g.save();g.beginPath();g.ellipse(cx,244,22,h,0,0,Math.PI*2);g.clip();
    g.fillStyle='#fff9e9';g.fillRect(cx-23,210,46,70);
    ellipse(cx+look+2,246+up,11,12,'#68432c');ellipse(cx+look+2,246+up,6.5,8,'#221619');ellipse(cx+look+5,241+up,3.4,3.4,'white');
    g.restore();
    if(h<2)path(`M${cx-22} 244 Q${cx} 250 ${cx+22} 244`,null,ink,4);
    else {g.beginPath();g.ellipse(cx,244,22,h,0,0,Math.PI*2);g.strokeStyle=ink;g.lineWidth=4;g.stroke();}
  }
  for(const [x,dy,tilt,scar] of [[188,p.browL,p.tiltL,false],[252,p.browR,p.tiltR,true]]){
    g.save();g.translate(x,213+dy);g.rotate(tilt);path(scar?'M-20 3 Q-13 -5 -5 -5 M7 -5 Q15 -5 21 2':'M-21 2 Q0 -13 21 4',null,ink,8);g.restore();
  }
  path(`M${222+look*.15} 258 Q${212+look*.2} 282 ${216+look*.2} 288 Q224 292 232 288`,null,'#87523b',4);
  const smile=p.smile,jaw=p.jaw;
  const w=24+smile*10-p.round*11,h=Math.min(p.round>.5?15:32,2+jaw*25+smile*4);
  const y=311-smile*3;
  if(jaw<.055 && smile<.3){path(`M${220-w} ${y} Q220 ${y-5} ${220+w} ${y}`,null,ink,4.5);if(p.viseme==='MBP')path('M201 318 Q220 323 239 318',null,'#94563e',2.8);return;}
  const d=p.round>.5?`M${220-w} ${y+h*.5} C${220-w} ${y-h} ${220+w} ${y-h} ${220+w} ${y+h*.5} C${220+w} ${y+h*2} ${220-w} ${y+h*2} ${220-w} ${y+h*.5} Z`:`M${220-w} ${y} Q220 ${y-6-smile*9} ${220+w} ${y} Q${220+w-3} ${y+h*1.8} 220 ${y+h} Q${220-w+3} ${y+h*1.8} ${220-w} ${y} Z`;
  const mouth=new Path2D(d);g.save();g.clip(mouth);g.fillStyle='#4d2432';g.fillRect(175,y-20,90,80);
  if(smile>.25 || (jaw>.65 && p.round<.5)){g.fillStyle='#fff7df';g.fillRect(175,y-10,90,18+smile*4);path(`M199 ${y+7} V${y+12} M214 ${y+7} V${y+13} M230 ${y+7} V${y+12} M244 ${y+6} V${y+11}`,null,'#d2bca1',1.2);}
  if(jaw>.2)ellipse(222,y+h+(smile>.4?9:4),w*.65,smile>.4?6:9,'#e7818e');
  if(p.viseme==='FV'){g.fillStyle=skin;g.fillRect(175,y+5,90,30);path(`M196 ${y+5} Q220 ${y+10} 244 ${y+5}`,null,'#92583e',2);}
  g.restore();path(d,null,ink,3.5);
  if(smile>.4){path('M181 299 Q176 303 178 309 M259 299 Q265 302 263 308',null,'#965e45',2.5);}
}
function actor(p,t){
  const hip=[220+p.hip,667+p.dy];
  // Pieds immobiles; les genoux absorbent le déplacement du bassin.
  for(const [x,side]of [[175,-1],[265,1]]){
    const top=[hip[0]+side*36,hip[1]],foot=[x,913],k=knee(top,foot,125,125,-side);
    line([top,k,foot],ink,59);line([top,k,foot],'#30466b',49);line([[k[0]-12,k[1]+8],[k[0]+12,k[1]+9]],'#5b7394',2.5);
    g.save();g.translate(x-175,0);path('M136 905 H203 L210 945 H118 Q116 918 136 905 Z','#f5edda',ink,4);path('M147 918 L191 914 V925 L147 932 Z','#d9602b',null);path('M116 938 H212 V950 H116 Z',ink,null);g.restore();
  }
  g.save();g.translate(hip[0],hip[1]);g.rotate(p.lean*Math.PI/180);g.translate(-220,-667);
  arm(132,410,p.armL,p.foreL,p.handL);
  arm(308,410,p.armR,p.foreR,p.handR,true);
  g.drawImage(images.tronco,0,0,440,1000);
  // Tête articulée au cou; squash local avec aire conservée, sans étirer le torse.
  g.save();g.translate(220,334+p.headY);g.rotate(p.head*Math.PI/180);g.scale(1/p.squash,p.squash);g.translate(-220,-334);
  g.drawImage(images.cabeca,0,0,440,1000);face(p,t);g.restore();g.restore();
}

export {actor as drawAnterior, face as faceAnterior};
