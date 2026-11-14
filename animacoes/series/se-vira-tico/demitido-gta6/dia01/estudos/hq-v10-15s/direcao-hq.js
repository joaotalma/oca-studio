'use strict';
// Estudo isolado: composição e atuação HQ inspiradas no V10 fornecido pelo João.
// Arte do elenco Oca, cenário e efeitos próprios; áudio e texto da abertura preservados.
const HQ=(()=>{
 const C=document.getElementById('c'),ctx=C.getContext('2d');C.width=innerWidth;C.height=innerHeight;
 const cl=x=>Math.max(0,Math.min(1,x)),sm=x=>{x=cl(x);return x*x*(3-2*x)},out=x=>1-(1-cl(x))**3;
 const mix=(a,b,p)=>a+(b-a)*p,F=n=>Number(n).toFixed(2);
 const bell=(t,a,b)=>t<=a||t>=b?0:Math.sin(Math.PI*(t-a)/(b-a));
 const fit=(v,a,b)=>sm((v-a)/(b-a));
 const key=(t,ks)=>{let a=ks[0],b=ks.at(-1);for(let i=1;i<ks.length;i++)if(t<=ks[i][0]){a=ks[i-1];b=ks[i];break;}return a.slice(1).map((v,i)=>mix(v,b[i+1],sm((t-a[0])/(b[0]-a[0]||1))));};
 const D={...CHARS.kaua,hs:1.60,torso:150,sw:70,waist:58,hem:60,hw:47,thigh:102,shin:98,armU:88,armF:83,cloth:'#258c6d',clothD:'#145a59',clothHi:'#72d4a6',pants:'#414d64',pantsD:'#26344c',lid:.08};
 const J={...CHARS.junior,hs:1.42,thigh:104,shin:100,torso:147};
 let clock=0,headLag=0;
 const oldHair=hairFront,oldEye=eyeSVG,oldHead=headSVG,oldTorso=torsoSVG;
 hairFront=d=>`<g transform="rotate(${F(headLag)} 0 -43) skewX(${F(headLag*.32)})">${oldHair(d)}</g>`;
 eyeSVG=(d,side,e,blink)=>`<g transform="translate(${side*21} -20) scale(1.20 1.26) translate(${-side*21} 20)">${oldEye(d,side,e,blink)}</g>`;
 headSVG=(d,e,p)=>oldHead(d,{...e,browY:(e.browY||0)*1.25,browIn:(e.browIn||0)*1.18},p)+`<path d="M23 4Q43 -3 43 17Q40 39 23 43L17 32Z" fill="url(#dots)" opacity=".7"/>`;
 torsoSVG=(d,sy,bag)=>oldTorso(d,sy,bag)+`<clipPath id="hqshirt-${d.key}"><path d="M12 ${sy+5}Q${d.sw+9} ${sy-1} ${d.sw-1} ${sy+35}L${d.hem} 9H15Z"/></clipPath><g clip-path="url(#hqshirt-${d.key})"><path d="M38 ${sy-12}Q67 ${sy+65} 39 28H90V${sy-12}Z" fill="url(#dots)" opacity=".66"/></g>`;
 const defs=t=>`<defs>
 <pattern id="dots" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(18)"><circle cx="2" cy="2" r="1.35" fill="#181a32"/></pattern>
 <pattern id="paper" width="73" height="67" patternUnits="userSpaceOnUse"><path d="M5 9h4M31 36h3M62 17h2M17 59h3" stroke="#f9e6b8" opacity=".28" stroke-width="2"/></pattern>
 <pattern id="grain" width="39" height="43" patternUnits="userSpaceOnUse"><path d="M0 9Q19 3 39 9M0 17Q22 12 39 18M0 31Q20 25 39 31" stroke="#432a39" fill="none" stroke-width="1" opacity=".18"/></pattern>
 <linearGradient id="wall" x2=".85" y2="1"><stop stop-color="#4fc3bd"/><stop offset=".55" stop-color="#75cab6"/><stop offset="1" stop-color="#38596f"/></linearGradient>
 <linearGradient id="side" x2="1" y2=".5"><stop stop-color="#163b61"/><stop offset="1" stop-color="#467c91"/></linearGradient>
 <linearGradient id="floor" x2="0" y2="1"><stop stop-color="#ebcc86"/><stop offset="1" stop-color="#b98460"/></linearGradient>
 <linearGradient id="beam"><stop stop-color="#ffe7ab" stop-opacity=".4"/><stop offset="1" stop-color="#ffe7ab" stop-opacity="0"/></linearGradient>
 <filter id="cutout" x="-20%" y="-15%" width="140%" height="140%" color-interpolation-filters="sRGB"><feMorphology in="SourceAlpha" operator="dilate" radius="3.2" result="edge"/><feFlood flood-color="#fffbea"/><feComposite in2="edge" operator="in"/><feDropShadow dx="5" dy="7" stdDeviation=".6" flood-color="#19213c" flood-opacity=".65"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
 <filter id="white"><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/></filter>
 <filter id="ink-shadow"><feDropShadow dx="8" dy="10" stdDeviation="0" flood-color="#19213c" flood-opacity=".68"/></filter>
 </defs>`;
 function star(cx,cy,r,t,text,label=''){
  const u=t,scale=out(u/.17)*(1+.09*Math.sin(Math.max(0,u-.17)*20)*Math.exp(-Math.max(0,u-.17)*6));
  const pts=Array.from({length:20},(_,i)=>{const a=i*Math.PI/10,r0=r*(i%2?.55:1+(i%3)*.055);return F(Math.cos(a)*r0)+','+F(Math.sin(a)*r0);}).join(' ');
  return `<g transform="translate(${F(cx)} ${F(cy)}) rotate(-8) scale(${F(scale)})" filter="url(#ink-shadow)"><polygon points="${pts}" fill="#ff0058" stroke="#fff9df" stroke-width="19" stroke-linejoin="round"/><polygon points="${pts}" fill="none" stroke="#161827" stroke-width="9"/><polygon points="${pts}" transform="scale(.77) rotate(7)" fill="#ffce17" stroke="#171728" stroke-width="7"/><text x="0" y="${label?100:115}" text-anchor="middle" font-family="Impact,Arial Black" font-size="${text.length===1?430:245}" fill="#fffdf0" stroke="#121525" stroke-width="14" paint-order="stroke fill">${text}</text>${label?`<text y="200" text-anchor="middle" font-family="Impact,Arial Black" font-size="80" fill="#171728">${label}</text>`:''}</g>`;
 }
 function room(t){
  const far=Math.sin(t*.55)*5;
  let s=`<rect width="1080" height="1920" fill="url(#wall)"/><path d="M0 0L150 115V1540L0 1720Z" fill="url(#side)"/><path d="M150 115V1540" stroke="#1c3248" stroke-width="7"/><g transform="translate(${F(far)} 0)"><rect x="175" y="150" width="270" height="420" rx="4" fill="#263b60" stroke="#111a2c" stroke-width="10"/><rect x="191" y="166" width="238" height="387" fill="#a3dece"/><path d="M310 163V555M187 350H433" stroke="#20435c" stroke-width="14"/><path d="M185 180L880 1510H520L185 480Z" fill="url(#beam)"/><path d="M750 250h200v300H750Z" fill="#f3d574" stroke="#151a2c" stroke-width="7"/><path d="M785 290l70 8-50 53 85 20-70 55" fill="none" stroke="#ee4c6e" stroke-width="27"/></g>`;
  s+=`<path d="M0 1710L150 1540H1080V1920H0Z" fill="url(#floor)"/><path d="M0 1710L150 1540H1080" fill="none" stroke="#181a29" stroke-width="8"/>`;
  for(let i=-2;i<9;i++)s+=`<path d="M${150+i*135} 1540L${150+i*230} 1920" stroke="#73536a" stroke-width="3" opacity=".4"/>`;
  s+=`<path d="M0 1780H1080M0 1870H1080" stroke="#795364" stroke-width="3" opacity=".4"/><path d="M900 260H1080V1540H900Z" fill="url(#dots)" opacity=".14"/>`;
  // Diorama gamer: tela e mesa como planos de papel, não superfícies chapadas sobrepostas ao corpo.
  s+=`<g transform="translate(690 1175) rotate(2)"><path d="M-70 130L310 90L375 145L-40 184Z" fill="#d6b07d" stroke="#151828" stroke-width="9"/><path d="M-40 184L375 145V330L-40 357Z" fill="#ac795a" stroke="#151828" stroke-width="9"/><path d="M160 170L375 145V330L160 344Z" fill="url(#dots)" opacity=".28"/><path d="M-10 352V495M335 330V465" stroke="#171a2c" stroke-width="24"/><path d="M-40 184L375 145V330L-40 357Z" fill="url(#grain)"/><rect x="-30" y="-118" width="320" height="215" rx="12" fill="#18384a" stroke="#151825" stroke-width="12"/><rect x="-12" y="-101" width="284" height="175" fill="#61cbb4"/><path d="M-12 23H272V74H-12Z" fill="#3e807a"/><path d="M30 52H230M44 51V-40H78V52" stroke="#214b62" stroke-width="8" fill="none"/><path d="M127 98V135M80 138H180" stroke="#151825" stroke-width="12"/>${controle(110,167,.55,t,{rot:-8})}</g>`;
  return s;
 }
 function pose(t){
  const [y,q,lean,head,l0,l1,r0,r1]=key(t,[[0,0,1,-2,-4,-12,-25,18,28],[.48,0,1,0,7,-10,-22,16,20],[.65,24,.91,8,12,-20,-50,24,50],[.83,-90,1.12,-9,-14,-145,-100,140,95],[1.12,-125,1.06,-6,-10,-115,-80,120,78],[1.5,0,.9,6,12,-52,-30,50,35],[1.78,0,1.03,-3,-8,-68,-55,64,52],[2.4,0,1,0,-4,-45,-60,45,60],[2.9,0,.98,5,9,-12,-10,54,-58],[3.22,0,1,-5,-12,-36,-70,60,-75],[4.5,0,1,-1,8,-24,-45,65,-68],[5.1,0,1,0,5,-15,-20,35,75],[5.75,0,.92,10,12,-25,-50,42,80],[6.18,-65,1.07,-12,-20,-130,-85,125,95],[6.5,0,.9,7,13,-75,-55,80,45],[6.8,0,1,-5,-8,-42,-28,52,40],[8.1,0,1,6,16,-60,-55,45,70],[8.5,0,.96,10,12,-40,-25,40,25],[9.75,0,.97,9,15,-9,-5,9,5],[10.42,0,1,0,0,-15,-10,15,10],[12.8,0,1,-3,-5,-25,-55,30,-45],[15,0,1,0,8,-15,-15,20,10]]);
  const speaking=FALAS.find(f=>toReal(f.ini)<=t&&t<toReal(f.fim));let mouth=null;
  if(speaking){const st=toScript(t),env=TEMPOS.env[speaking.n];const v=env?.[Math.min(env.length-1,Math.floor((st-speaking.ini)/(speaking.fim-speaking.ini)*env.length))]||0;mouth=v<.12?'closed':v<.38?'small':v<.7?'open':'wide';}
  const expr=t<.7?'neutro':t<2?'surpreso':t<5.1?'preocupado':t<6.1?'neutro':t<8?'surpreso':t<10.42?'cansado':'neutro';
  const blink=bell(t,2.66,2.8)+bell(t,4.75,4.89)+bell(t,7.38,7.52)+bell(t,9.2,9.34)+bell(t,11.4,11.54);
  return {y,q,lean,head,armL:[l0,l1],armR:[r0,r1],legL:t>.78&&t<1.5?[-13,-5]:[-5,-2],legR:t>.78&&t<1.5?[14,5]:[5,2],expr,mouth,blink:blink>.1?1:0,look:t<.7?[4,-4]:t<2?[5,-9]:t<5.1?[5,4]:t<10.42?[5,-4]:[6,0],breath:.5+Math.sin(t*2)*.5};
 }
 function toReal(t){const n=TEMPOS.nos;for(let i=1;i<n.length;i++)if(t<=n[i][0])return mix(n[i-1][1],n[i][1],(t-n[i-1][0])/(n[i][0]-n[i-1][0]));return n.at(-1)[1];}
 function toScript(t){const n=TEMPOS.nos;for(let i=1;i<n.length;i++)if(t<=n[i][1])return mix(n[i-1][0],n[i][0],(t-n[i-1][1])/(n[i][1]-n[i-1][1]));return n.at(-1)[0];}
 function actor(d,p,x,y,scale,t){
  const lag=pose(Math.max(0,t-.075));headLag=(p.head-lag.head)*-.55+Math.sin(t*3)*.6;
  let draw=drawChar(d,p);
  const white=bell(t,.72,1.08)*.92+bell(t,6.1,6.46)*.92;
  if(white)draw=`<g opacity="${F(1-white)}">${draw}</g><g opacity="${F(white)}" filter="url(#white)">${draw}</g>`;
  return `<g transform="translate(${F(x)} ${F(y+p.y)}) scale(${F(scale/p.q)} ${F(scale*p.q)})" filter="url(#cutout)">${draw}</g>`;
 }
 function streaks(t,at,cx,cy){const a=bell(t,at,at+.55);if(!a)return '';let s='';for(let i=0;i<14;i++){const ang=i*Math.PI/7+.13;const r=300+80*(i%3);s+=`<path d="M${F(cx+Math.cos(ang)*r)} ${F(cy+Math.sin(ang)*r)}l${F(Math.cos(ang)*100*a)} ${F(Math.sin(ang)*100*a)}" stroke="${i%2?'#fff2c5':'#151629'}" stroke-width="${i%3+5}" stroke-linecap="round"/>`;}return s;}
 function office(t){
  let s=`<rect width="1080" height="1920" fill="#e9dcb2"/><path d="M0 0L180 180H1080V0Z" fill="#fff1c8"/><path d="M0 0L180 180V1530L0 1710Z" fill="#76a7a5"/><path d="M0 1710L180 1530H1080V1920H0Z" fill="#739899" stroke="#172a3b" stroke-width="6"/>`;
  for(let i=0;i<8;i++)s+=`<path d="M${i*170} 1530L${-200+i*240} 1920" stroke="#33596e" opacity=".4" stroke-width="3"/>`;
  s+=`<rect x="235" y="300" width="600" height="460" fill="#81c9c7" stroke="#172b3e" stroke-width="12"/><path d="M435 300V760M635 300V760M235 530H835" stroke="#3a6b7d" stroke-width="12"/><path d="M238 306L1080 1320H650L238 650Z" fill="url(#beam)"/><path d="M1030 180H1080V1510H1030Z" fill="url(#dots)" opacity=".3"/>`;
  s+=`<g transform="translate(118 175) rotate(-4)"><path d="M0 0H610V112H0Z" fill="#ffcc24" stroke="#151728" stroke-width="8"/><text x="305" y="77" text-anchor="middle" font-family="Impact" font-size="65" fill="#171728">ONTEM · 16H</text></g>`;
  const p=pose(t);s+=actor(D,{...p,y:0,q:1},330,1640,1.72,t);
  const jp={...p,y:0,q:1,lean:-3,head:-10,expr:'pensando',look:[-7,3],armL:[-75,-60],armR:[12,6],mouth:t>13.38?'open':null};
  s+=actor(J,jp,805,1640,1.65,t);
  s+=`<path d="M90 1480L900 1390L1080 1500L170 1630Z" fill="#ddb47b" stroke="#181b2a" stroke-width="10"/><path d="M170 1630L1080 1500V1920H170Z" fill="#a8785b" stroke="#181b2a" stroke-width="10"/><path d="M600 1570L1080 1500V1920H600Z" fill="url(#dots)" opacity=".32"/><g transform="translate(465 1140) rotate(-4)"><rect width="330" height="250" rx="14" fill="#24364e" stroke="#141927" stroke-width="10"/><rect x="16" y="16" width="298" height="216" fill="#9ed4cc"/><path d="M150 250V300M90 300H235" stroke="#141927" stroke-width="12"/><path d="M100 35H210L250 75V205H100Z" fill="#fff2c3" stroke="#182033" stroke-width="6"/><path d="M210 35V75H250" fill="none" stroke="#182033" stroke-width="5"/><rect x="75" y="110" width="160" height="55" fill="#f23865"/><text x="155" y="152" text-anchor="middle" font-family="Impact" font-size="44" fill="#fff">PDF</text></g>`;
  return s;
 }
 function scene(t){
  let s=defs(t);const p=pose(t);
  if(t>=10.41)return s+office(t)+`<rect width="1080" height="1920" fill="url(#paper)" opacity=".35"/>`;
  const shake=bell(t,.72,1.22)*5+bell(t,6.12,6.48)*4;
  s+=`<g transform="translate(${F(Math.sin(t*36)*shake)} ${F(Math.cos(t*31)*shake)})">${room(t)}`;
  if(t<3.1){
   s+=`<text x="105" y="195" font-family="Impact" font-size="110" fill="#152337" stroke="#fff5d5" stroke-width="6" paint-order="stroke fill">FALTAM</text>`;
   if(t>=.72)s+=star(700,350,350,t-.72,'6','DIAS')+streaks(t,.72,620,550);
   if(t>1.35)s+=`<g opacity="${F(fit(t,1.35,1.55))}" transform="translate(630 760) rotate(5)"><path d="M-15 -90H385V10H-15Z" fill="#16253d" stroke="#fff4c9" stroke-width="6"/><text x="185" y="-17" font-family="Impact" font-size="69" text-anchor="middle" fill="#fff5d7">PRO GTA 6</text></g>`;
  }else if(t<5.11){s+=star(650,280,310,t-3.1,'3,20','REAIS')+`<text x="90" y="130" font-family="Impact" font-size="75" fill="#152337">EU TENHO…</text>`;}
  if(t>=5.11){
   const a=out((t-5.11)/.3),rot=-7*(1-a);s+=`<g transform="translate(${F(210+980*(1-a))} 110) rotate(${F(rot)}) scale(.85 .5)" filter="url(#ink-shadow)"><path d="M0 0H820V620H0Z" fill="#fff2cd" stroke="#fffdf0" stroke-width="20"/><path d="M0 0H820V620H0Z" fill="none" stroke="#15192b" stroke-width="8"/><path d="M0 0L410 280L820 0" fill="#e5c487" stroke="#15192b" stroke-width="7"/><text x="410" y="360" text-anchor="middle" font-family="Impact" font-size="82" fill="#172539">AJUSTE DE ESTRUTURA</text><g transform="rotate(-8 410 450)"><rect x="60" y="385" width="700" height="125" fill="#f53161" stroke="#161b2c" stroke-width="8"/><text x="410" y="479" text-anchor="middle" font-family="Impact" font-size="112" fill="#fff7df">DEMITIDO</text></g></g>`;
   if(t>=8){const a=out((t-8)/.2),r=90*a;s+=`<g transform="translate(840 780) rotate(${F(-18+Math.sin((t-8)*10)*8*Math.exp(-(t-8)*2))})"><circle r="${F(r+8)}" fill="#fff6db" stroke="#182338" stroke-width="8"/><circle r="${F(r)}" fill="#ffcc23"/><path d="M-45 -10Q-30 -40 -15 -10M15 -10Q30 -40 45 -10M-48 25Q0 76 48 25" fill="none" stroke="#382239" stroke-width="8" stroke-linecap="round"/></g>`;}
   s+=streaks(t,6.12,570,960);
  }
  const sc=1.78;const x=t<5.11?430+bell(t,.65,1.78)*65:480;
  s+=`<ellipse cx="${x}" cy="1759" rx="${F(165*(1+p.y/380))}" ry="30" fill="#192c45" opacity=".35"/>`;
  s+=actor(D,p,x,1750,sc,t);
  if(t>3.1&&t<5.11){
   // Moedas presas ao gesto, usando o mesmo cálculo de punho do rig orgânico.
   const L=legs(D,{...p,liftL:0,liftR:0}),rootY=-(Math.max(L.L.A[1],L.R.A[1])+SHOE_H[D.shoe]);
   const S=[D.sw-D.ru*.62,-D.torso+D.ru*1.05],E0=P2(...S,p.armR[0],D.armU),W=P2(...E0,p.armR[1],D.armF);
   s+=`<g transform="translate(${x} ${F(1750+p.y)}) scale(${F(sc/p.q)} ${F(sc*p.q)}) translate(0 ${F(rootY)}) rotate(${F(p.lean)}) translate(0 ${F(-p.breath)}) translate(${F(W[0])} ${F(W[1])})">`;
   for(let i=0;i<4;i++)s+=`<circle cx="${i*9-14}" cy="${-17-i%2*5}" r="7" fill="${i===3?'#dee1d9':'#ffd342'}" stroke="#33253c" stroke-width="1.7"/>`;
   s+='</g>';
  }
  return s+'</g>'+`<rect width="1080" height="1920" fill="url(#paper)" opacity=".42"/>`;
 }
 function captions(t){
  const f=FALAS.find(f=>toReal(f.ini)<=t&&t<toReal(f.fim));if(!f)return;
  const words=f.texto.split(/\s+/),progress=cl((t-toReal(f.ini))/(toReal(f.fim)-toReal(f.ini)));
  const word=Math.min(words.length-1,Math.floor(progress*words.length));
  let start=Math.floor(word/5)*5,end=start+5;
  if(f.n===1){start=word<6?0:6;end=word<6?6:words.length;}
  const part=words.slice(start,end);
  ctx.save();ctx.scale(C.width/1080,C.height/1920);ctx.font='900 49px Arial';ctx.textAlign='center';ctx.textBaseline='middle';
  const text=part.join(' '),begin=toReal(f.ini),finish=toReal(f.fim);
  ctx.globalAlpha=Math.min(fit(t,begin,begin+.32),1-fit(t,finish-.32,finish));
  ctx.fillStyle='#151a2a';ctx.strokeStyle='#fff3d3';ctx.lineWidth=3;
  ctx.beginPath();ctx.roundRect(48,1790,984,82,8);ctx.fill();ctx.stroke();
  const switchAt=begin+(finish-begin)*start/words.length;
  const weight=start===0?1:fit(t,switchAt,switchAt+.14);
  ctx.fillStyle='#fff7df';const alpha=ctx.globalAlpha;
  if(start>0&&weight<1){const oldStart=f.n===1?0:Math.max(0,start-5);ctx.globalAlpha=alpha*(1-weight);ctx.fillText(words.slice(oldStart,start).join(' '),540,1832);}
  ctx.globalAlpha=alpha*weight;ctx.fillText(text,540,1832);ctx.restore();
 }
 async function renderFrame(t){clock=t;await document.fonts.ready;const s=`<svg xmlns="http://www.w3.org/2000/svg" width="${C.width}" height="${C.height}" viewBox="0 0 1080 1920">${scene(t)}</svg>`;const im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s);await im.decode();ctx.clearRect(0,0,C.width,C.height);ctx.drawImage(im,0,0,C.width,C.height);captions(t);}
 return {renderFrame,scene,pose};
})();
window.renderFrame=HQ.renderFrame;window.FILM_DURATION=15;
// Troca gráfica do valor no fim da primeira oração, e duas mudanças de cena.
window.CUTS=[3.1,5.11,10.41];window.READY=true;
window.renderFrame(0);
