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
 const oldHair=hairFront,oldEye=eyeSVG,oldHead=headSVG,oldTorso=torsoSVG,oldHand=handSVG;
 handSVG=(d,side,w,a,prop)=>{
  if(d.key!=='kaua'||side!==1||clock<=3.1||clock>=5.11)return oldHand(d,side,w,a,prop);
  const open=fit(clock,3.1,3.35);
  const palm=shape('M-9 -7L8 -7Q13 -13 20 -11L31 -6Q38 -3 37 3Q35 10 23 12L7 11Q-4 10 -9 4Z',d.skin)+stroke('M12 3Q23 6 31 1M2 -1L8 4',d.shade,1.3);
  return `<g opacity="${F(1-open)}">${oldHand(d,side,w,a,prop)}</g><g transform="translate(${F(w[0])} ${F(w[1])})" opacity="${F(open)}">${palm}</g>`;
 };
 hairFront=d=>{
  const drive=Math.max(-4.5,Math.min(4.5,headLag));
  if(d.key==='kaua'){
   // Raiz firme; cada cacho responde com atraso e frequência próprios.
   let s=shape('M-45 -39Q-51 -71 -37 -84Q0 -98 38 -83Q51 -67 45 -39Q30 -61 0 -61Q-31 -61 -45 -39Z',d.hair);
   const curls=[[-36,-78,13],[-27,-94,17],[-7,-104,18],[15,-100,18],[33,-85,15]];
   for(let i=0;i<curls.length;i++){
    const [x,y,r]=curls[i],delay=i*.06;
    const spring=drive*Math.sin((clock-delay)*5+i*.8)*.48;
    const dx=Math.sin(clock*2.1-delay)*1.1+spring,dy=Math.sin(clock*2.5-i*.7)*.85+drive*(i%2?.2:-.15);
    s+=`<ellipse cx="${F(x+dx)}" cy="${F(y+dy)}" rx="${F(r+Math.sin(clock*2.2+i)*.6)}" ry="${F(r+dy*.23)}" fill="${d.hair}" stroke="${d.hair}" stroke-width="3"/>`;
    if(i>0)s+=`<path d="M${F(x-r*.56+dx)} ${F(y-r*.30+dy)}q${F(r*.4)} ${F(-r*.45+dy*.3)} ${F(r*.85)} ${F(-r*.1)}" fill="none" stroke="${d.hairHi}" stroke-width="2.1" stroke-linecap="round"/>`;
   }
   return s;
  }
  if(d.key==='junior'){
   const a=drive*.6+Math.sin(clock*2.2)*1.8,b=Math.sin(clock*2.5-.4)*1.6;
   return shape(`M-45 -38Q-52 -84 -16 -98Q${F(-4+a)} ${F(-126+b)} ${F(30+a)} ${F(-122+b)}Q${F(52+a)} ${F(-118+b)} ${F(50+a*.6)} ${F(-100+b)}Q40 -106 28 -102Q50 -86 47 -38Q30 -66 0 -68Q-26 -66 -45 -38Z`,d.hair)+stroke(`M-32 -70Q-12 -88 18 -92M-20 -60Q4 -78 34 -80M4 -106Q${F(22+a)} ${F(-118+b)} ${F(42+a*.6)} ${F(-112+b)}`,d.hairHi,2.7);
  }
  return oldHair(d);
 };
 eyeSVG=(d,side,e,blink)=>`<g transform="translate(${side*21} -20) scale(1.20 1.26) translate(${-side*21} 20)">${oldEye(d,side,e,blink)}</g>`;
 headSVG=(d,e,p)=>oldHead(d,{...e,browY:(e.browY||0)*1.25,browIn:(e.browIn||0)*1.18},p);
 torsoSVG=(d,sy,bag)=>oldTorso(d,sy,bag)+`<clipPath id="hqshirt-${d.key}"><path d="M12 ${sy+5}Q${d.sw+9} ${sy-1} ${d.sw-1} ${sy+35}L${d.hem} 9H15Z"/></clipPath><g clip-path="url(#hqshirt-${d.key})"><path d="M38 ${sy-12}Q67 ${sy+65} 39 28H90V${sy-12}Z" fill="url(#dots)" opacity=".66"/></g>`;
 const defs=t=>`<defs>
 <pattern id="dots" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(18)"><circle cx="2" cy="2" r="1.35" fill="#181a32"/></pattern>
 <pattern id="paper" width="73" height="67" patternUnits="userSpaceOnUse"><path d="M5 9h4M31 36h3M62 17h2M17 59h3" stroke="#f9e6b8" opacity=".28" stroke-width="2"/></pattern>
 <pattern id="grain" width="39" height="43" patternUnits="userSpaceOnUse"><path d="M0 9Q19 3 39 9M0 17Q22 12 39 18M0 31Q20 25 39 31" stroke="#432a39" fill="none" stroke-width="1" opacity=".18"/></pattern>
 <linearGradient id="wall" x2=".85" y2="1"><stop stop-color="#4fc3bd"/><stop offset=".55" stop-color="#75cab6"/><stop offset="1" stop-color="#38596f"/></linearGradient>
 <linearGradient id="side" x2="1" y2=".5"><stop stop-color="#163b61"/><stop offset="1" stop-color="#467c91"/></linearGradient>
 <linearGradient id="floor" x2="0" y2="1"><stop stop-color="#ebcc86"/><stop offset="1" stop-color="#b98460"/></linearGradient>
 <linearGradient id="beam"><stop stop-color="#ffe7ab" stop-opacity=".4"/><stop offset="1" stop-color="#ffe7ab" stop-opacity="0"/></linearGradient>
 <linearGradient id="vice-sunset" x1="0" y1="0" x2=".2" y2="1"><stop stop-color="#ffe1b1"/><stop offset=".42" stop-color="#ff9dba"/><stop offset="1" stop-color="#a481d9"/></linearGradient>
 <linearGradient id="vice-rim" x2="1" y2="1"><stop stop-color="#dd7eaf"/><stop offset="1" stop-color="#715aab"/></linearGradient>
 <filter id="cutout" x="-20%" y="-15%" width="140%" height="140%" color-interpolation-filters="sRGB"><feMorphology in="SourceAlpha" operator="dilate" radius="3.2" result="edge"/><feFlood flood-color="#fffbea"/><feComposite in2="edge" operator="in"/><feDropShadow dx="5" dy="7" stdDeviation=".6" flood-color="#19213c" flood-opacity=".65"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
 <filter id="white"><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/></filter>
 <filter id="ink-shadow"><feDropShadow dx="8" dy="10" stdDeviation="0" flood-color="#19213c" flood-opacity=".68"/></filter>
 </defs>`;
 function star(cx,cy,r,t,text,label=''){
  const u=t,scale=out(u/.17)*(1+.09*Math.sin(Math.max(0,u-.17)*20)*Math.exp(-Math.max(0,u-.17)*6));
  const pts=Array.from({length:20},(_,i)=>{const a=i*Math.PI/10,r0=r*(i%2?.55:1+(i%3)*.055);return F(Math.cos(a)*r0)+','+F(Math.sin(a)*r0);}).join(' ');
  return `<g transform="translate(${F(cx)} ${F(cy)}) rotate(-8) scale(${F(scale)})" filter="url(#ink-shadow)"><polygon points="${pts}" fill="url(#vice-rim)" stroke="#fff6df" stroke-width="19" stroke-linejoin="round"/><polygon points="${pts}" fill="none" stroke="#32233e" stroke-width="9"/><polygon points="${pts}" transform="scale(.77) rotate(7)" fill="url(#vice-sunset)" stroke="#382742" stroke-width="7"/><text x="0" y="100" text-anchor="middle" font-family="Impact,Arial Black" font-size="430" fill="#fff9e7" stroke="#35233e" stroke-width="14" paint-order="stroke fill">${text}</text><g transform="rotate(8)"><rect x="-170" y="144" width="340" height="116" rx="9" fill="#30233f" stroke="#ffe7c2" stroke-width="7"/><text y="234" text-anchor="middle" font-family="Impact,Arial Black" font-size="101" letter-spacing="7" fill="#fff1ce">${label}</text></g></g>`;
 }
 const SUSTO=()=>`<g><circle cx="410" cy="720" r="60" fill="#fff" ${ink(7)}/><circle cx="410" cy="730" r="22" fill="#3a1f4a"/><circle cx="670" cy="720" r="60" fill="#fff" ${ink(7)}/><circle cx="670" cy="730" r="22" fill="#3a1f4a"/><ellipse cx="540" cy="900" rx="52" ry="70" fill="#3a1f4a" ${ink(6)}/><path d="M350 620L470 650M730 620L610 650" stroke="#3a1f4a" stroke-width="16" stroke-linecap="round"/></g>`;
 // ===== peças comuns do Dia 2 em HQ V10 (gancho, parte 1) =====
 // DADOS.falas vem de dados.js (gerado por preparar.mjs a partir de falas.js e do alinhamento por palavra).
 const FALAS2=DADOS.falas, T_ABRE=DADOS.tAbre;
 const falando=t=>FALAS2.some(f=>f.palavras.some(([,a,b])=>t>=a&&t<=b));
const INK='#19213c', CREAM='#fff3d3';
 const ink=(w=8)=>`stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

 // cenário: fachada da loja (planos de papel, retícula só no ambiente), piso e raios atrás da cabeça
 function fundo(t){
  const pulse=1+Math.sin(t*9)*.015;
  let s=`<rect width="1080" height="1920" fill="url(#vice-sunset)"/><rect width="1080" height="1920" fill="url(#dots)" opacity=".10"/>`;
  s+=`<rect width="1080" height="1920" fill="url(#paper)" opacity=".35"/>`;
  // loja ao fundo
  s+=`<g opacity=".95"><rect x="40" y="330" width="1000" height="1180" fill="#cdbbf3" ${ink(8)}/><rect x="40" y="330" width="1000" height="1180" fill="url(#dots)" opacity=".08"/>
   <rect x="40" y="330" width="1000" height="130" fill="#5a43a0" ${ink(8)}/><rect x="440" y="352" width="200" height="86" rx="43" fill="#ffd98a" ${ink(5)}/>
   <g transform="translate(540 395)"><rect x="-26" y="-34" width="52" height="68" rx="9" fill="#ff9cc2" ${ink(4)}/><path d="M-12 -4Q-8 -12 -2 -4M4 -4Q8 -12 14 -4M-10 8Q0 20 12 8" fill="none" ${ink(3.5)}/></g>
   <rect x="90" y="520" width="410" height="640" fill="#ffe3f0" ${ink(8)}/><rect x="580" y="520" width="410" height="640" fill="#ffe3f0" ${ink(8)}/>
   <path d="M90 520L330 520L90 800ZM580 520L800 520L580 790Z" fill="#fff" opacity=".35"/>
   <rect x="120" y="980" width="120" height="180" rx="14" fill="#8a6fd6" opacity=".35"/><rect x="270" y="1040" width="100" height="120" rx="14" fill="#ff8fb3" opacity=".4"/><rect x="620" y="1000" width="130" height="160" rx="14" fill="#6fcf6a" opacity=".35"/><rect x="790" y="960" width="150" height="200" rx="14" fill="#ffd23f" opacity=".4"/></g>`;
  s+=`<path d="M0 1500H1080V1920H0Z" fill="#f0e2d6" ${ink(8)}/>`;
  for(let i=-3;i<10;i++)s+=`<path d="M${i*150} 1500L${i*260-340} 1920" stroke="#a48ab8" stroke-width="3" opacity=".45"/>`;
  s+=`<path d="M0 1600H1080M0 1720H1080M0 1850H1080" stroke="#a48ab8" stroke-width="3" opacity=".45"/>`;
  // explosão pêssego/rosa/lilás atrás da cabeça
  const pts=Array.from({length:22},(_,i)=>{const a=i*Math.PI/11,r0=(i%2?330:560)*pulse*(1+(i%3)*.04);return F(540+Math.cos(a)*r0)+','+F(790+Math.sin(a)*r0*1.02);}).join(' ');
  s+=`<polygon points="${pts}" fill="url(#vice-rim)" stroke="${CREAM}" stroke-width="16" stroke-linejoin="round" opacity=".92"/><polygon points="${pts}" fill="none" stroke="#32233e" stroke-width="8"/><polygon points="${pts}" transform="translate(540 790) scale(.74) translate(-540 -790)" fill="url(#vice-sunset)" stroke="#382742" stroke-width="6" opacity=".9"/>`;
  return s;
 }

 function gota(x,y,r=1){return `<path d="M${F(x)} ${F(y-30*r)}Q${F(x+20*r)} ${F(y)} ${F(x)} ${F(y+20*r)}Q${F(x-20*r)} ${F(y)} ${F(x)} ${F(y-30*r)}Z" fill="#9ed8ff" ${ink(4)}/><path d="M${F(x-6*r)} ${F(y-4*r)}Q${F(x-4*r)} ${F(y+8*r)} ${F(x+2*r)} ${F(y+10*r)}" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`;}

 // personagem do rig dentro do buraco da carcaça: só a cabeça aparece (recorte)
 function kauaNoBuraco(t,abre){
  const p={y:0,q:1,lean:0,head:Math.sin(t*2.2)*2.5-3,armL:[-5,-8],armR:[5,8],legL:[-5,-2],legR:[5,2],expr:'cansado',mouth:falando(t)&&abre>.6?(Math.sin(t*14)>0?'open':null):null,blink:bell(t,6.35,6.6),look:[abre>.5?0:0,abre>.5?3*fit(t,6.8,7.1):0]};
  headLag=Math.sin(t*3)*1.2;
  const draw=drawChar(D,p);
  const sc=KS, x=540, y=KY;
  const rosto=`<g opacity="${F(fit(t,T_ABRE+.2,T_ABRE+.5))}"><ellipse cx="440" cy="842" rx="62" ry="20" fill="#6b3d63" opacity=".38"/><ellipse cx="590" cy="826" rx="62" ry="20" fill="#6b3d63" opacity=".38"/><ellipse cx="405" cy="900" rx="46" ry="30" fill="#e6554f" opacity=".42"/><ellipse cx="625" cy="880" rx="46" ry="30" fill="#e6554f" opacity=".42"/>${gota(380,640,.8)}${gota(660,700,.7)}${gota(545+Math.sin(t*3)*4,(560+((t*140)%220)),.7)}</g>`;
  return `<g transform="translate(${x} ${y}) scale(${sc})" filter="url(#cutout)">${draw}</g>`+rosto;
 }
 let KS=2.4, KY=2010;

 function mascote(t,o={}){
  const abre=o.abre??out((t-T_ABRE)/.3), dança=o.danca??(1-fit(t,T_ABRE-.2,T_ABRE+.5)*.85);
  const bat=Math.sin(t*Math.PI*2*2.2), bob=Math.abs(bat)*26*dança, roll=Math.sin(t*Math.PI*2*1.1)*4.2*dança-2*abre;
  let s=`<ellipse cx="540" cy="1712" rx="${F(300-bob*2)}" ry="34" fill="#192c45" opacity=".32"/>`;
  s+=`<g transform="translate(0 ${F(-bob)})">`;
  // pernas
  for(const lado of[-1,1]){const sw=Math.sin(t*Math.PI*2*1.1+(lado>0?Math.PI:0))*10*dança;s+=`<g transform="translate(${540+lado*108} 1520) rotate(${F(sw)})"><path d="M0 0V150" stroke="${INK}" stroke-width="92" stroke-linecap="round"/><path d="M0 0V150" stroke="#414d64" stroke-width="70" stroke-linecap="round"/><ellipse cx="${lado*8}" cy="178" rx="74" ry="40" fill="#ff8fb3" ${ink(7)}/></g>`;}
  // braços (atrás do tronco)
  const swing=dança*Math.sin(t*Math.PI*2*2.2);
  for(const lado of[-1,1]){if(o.aperto&&lado===1)continue;const ang=lado*(38+swing*lado*28+abre*14);s+=`<g transform="translate(${540+lado*205} 1270) rotate(${F(ang)})"><path d="M0 0V230" stroke="${INK}" stroke-width="100" stroke-linecap="round"/><path d="M0 0V230" stroke="#ffcf5a" stroke-width="76" stroke-linecap="round"/><circle cx="0" cy="250" r="56" fill="#fff" ${ink(7)}/></g>`;}
  // tronco
  s+=`<rect x="330" y="1180" width="420" height="380" rx="150" fill="#ffcf5a" ${ink(9)}/><rect x="330" y="1180" width="420" height="380" rx="150" fill="url(#dots)" opacity=".10"/><ellipse cx="540" cy="1400" rx="130" ry="150" fill="#fff2c9" ${ink(6)}/>`;
  s+=`<ellipse cx="540" cy="1196" rx="190" ry="48" fill="#ff8fb3" ${ink(8)}/>`;
  // cabeça (carcaça), rola em torno do pescoço
  if(!o.semCabeca){s+=`<g transform="rotate(${F(roll)} 540 1180)">`;
  s+=`<g filter="url(#ink-shadow)"><rect x="220" y="420" width="640" height="800" rx="130" fill="#8a6fd6" ${ink(10)}/></g><rect x="220" y="420" width="640" height="800" rx="130" fill="url(#dots)" opacity=".10"/>`;
  s+=`<rect x="266" y="470" width="548" height="700" rx="96" fill="#5a43a0" ${ink(8)}/>`;
  s+=`<path d="M300 440Q540 400 780 440" stroke="#d7c8ff" stroke-width="10" fill="none" stroke-linecap="round" opacity=".55"/>`;
  s+=`<path d="M335 420V362" stroke="${INK}" stroke-width="30" stroke-linecap="round"/><path d="M335 420V362" stroke="#ffa98f" stroke-width="16" stroke-linecap="round"/>`;
  s+=`<rect x="852" y="590" width="26" height="110" rx="10" fill="#ffa98f" ${ink(6)}/><rect x="852" y="740" width="26" height="110" rx="10" fill="#ffa98f" ${ink(6)}/>`;
  // Kauã dentro (recortado ao buraco), só visível com a tela aberta
  s+=`<clipPath id="buraco"><rect x="270" y="474" width="540" height="692" rx="92"/></clipPath>`;
  if(abre>0)s+=`<g clip-path="url(#buraco)"><rect x="270" y="474" width="540" height="692" fill="#4a357f"/>${kauaNoBuraco(t,abre)}</g>`;
  // tela articulada pelo topo: dobra para cima ao abrir
  const lid=Math.max(.0,1-abre);
  s+=`<g transform="translate(540 474) scale(1 ${F(Math.max(lid,.001))}) translate(-540 -474)">`;
  s+=`<rect x="270" y="474" width="540" height="692" rx="92" fill="url(#vice-sunset)" ${ink(8)}/>`;
  const happy=o.abre!==undefined?1:1-fit(t,T_ABRE-.1,T_ABRE+.1);
  s+=`${o.cara==='susto'?SUSTO():''}<g opacity="${F(o.cara==='susto'?0:happy)}"><path d="M385 700Q430 640 480 700M600 700Q650 640 700 700" fill="none" stroke="#3a1f4a" stroke-width="22" stroke-linecap="round"/><path d="M365 810Q540 1010 715 810Q540 850 365 810Z" fill="#3a1f4a" ${ink(6)}/><ellipse cx="540" cy="930" rx="70" ry="32" fill="#ffd1d9"/><ellipse cx="320" cy="830" rx="44" ry="26" fill="#fff" opacity=".55"/><ellipse cx="760" cy="830" rx="44" ry="26" fill="#fff" opacity=".55"/></g>`;
  s+=`<path d="M270 474H520L270 760Z" fill="#fff" opacity=".22"/><rect x="480" y="494" width="120" height="16" rx="8" fill="#3a1f4a"/></g>`;
  if(abre>.7)s+=`<rect x="270" y="440" width="540" height="${F(34*fit(abre,.7,1))}" rx="14" fill="#ff9cc2" ${ink(6)}/>`;
  s+=`</g>`;}
  s+=`</g>`;
  // gotas de suor
  for(let i=0;i<12;i++){const ciclo=(t*.8+i*.113)%1.2,x=i%2?260+(i*53)%90:790+(i*47)%90,y=520+ciclo*ciclo*880+(i%3)*30;if(ciclo<1.1&&y<1560)s+=gota(x,y-bob,1);}
  return s;
 }

 function hud(t){
  let s=`<g transform="translate(250 56)"><rect x="0" y="0" width="580" height="96" rx="12" fill="#30233f" stroke="#ffe7c2" stroke-width="5"/><text x="290" y="66" text-anchor="middle" font-family="Impact,Arial Black" font-size="54" letter-spacing="5" fill="${CREAM}">GTA 6 EM 5 DIAS</text></g>`;
  const tr=Math.sin(t*38)*2.2;
  s+=`<g transform="translate(${F(70+tr)} 56)"><rect x="0" y="0" width="150" height="96" rx="12" fill="#30233f" stroke="#ffe7c2" stroke-width="5"/><rect x="26" y="14" width="18" height="52" rx="9" fill="${CREAM}"/><circle cx="35" cy="72" r="17" fill="#ff5e6c"/><rect x="29" y="${F(52-Math.min(26,t*5))}" width="12" height="${F(26+Math.min(26,t*5))}" fill="#ff5e6c"/><text x="102" y="66" text-anchor="middle" font-family="Impact,Arial Black" font-size="42" fill="#ff9a8a">34°</text></g>`;
  s+=`<g transform="translate(100 1580)"><rect x="0" y="0" width="880" height="150" rx="12" fill="#30233f" stroke="#ffe7c2" stroke-width="5"/><text x="440" y="70" text-anchor="middle" font-family="Impact,Arial Black" font-size="62" letter-spacing="4" fill="${CREAM}">R$ 3,20 DE R$ 449,90</text><rect x="44" y="100" width="792" height="22" rx="11" fill="#fff3d3" opacity=".22"/><rect x="44" y="100" width="22" height="22" rx="11" fill="#ff8fb3"/></g>`;
  return s;
 }

 // ===== Elenco novo do Dia 2 (Léo, Rafa, Pedrão): cópias do rig do Kauã com corpo, roupa e cabelo próprios =====
 // O rig compartilhado (motor/personagem/chars.js) não é alterado: o cabelo/barba/óculos entram por esta camada de HQ.
 const SEM_ADEREÇOS={capuz:false,bags:false,headset:undefined,gravata:undefined};
 const LEO={...CHARS.kaua,...SEM_ADEREÇOS,key:'leo',name:'Léo',skin:'#e2b08a',shade:'#be8a66',hair:'#4a2f22',hairHi:'#7a5642',iris:'#4a3426',cloth:'#e8843a',clothD:'#b9632a',clothHi:'#ffb872',pants:'#2f4b7a',pantsD:'#213557',shoe:'tenis',meia:'#ffffff',hs:1.52,torso:156,sw:64,waist:52,hem:56,hw:44,thigh:108,shin:102};
 const RAFA={...CHARS.kaua,...SEM_ADEREÇOS,key:'rafa',name:'Rafa',skin:'#6f4631',shade:'#4f2f21',hair:'#15110f',hairHi:'#33261f',iris:'#241810',cloth:'#f3efe4',clothD:'#cbc4b1',clothHi:'#ffffff',pants:'#33465e',pantsD:'#243346',shoe:'tenis',meia:'#ffffff',hs:1.5,torso:168,sw:54,waist:44,hem:46,hw:40,thigh:114,shin:108,armU:92,armF:88};
 const PEDRAO={...CHARS.kaua,...SEM_ADEREÇOS,key:'pedrao',name:'Pedrão',skin:'#c68b62',shade:'#9d6944',hair:'#241a15',hairHi:'#46362d',iris:'#35261c',cloth:'#c93a3a',clothD:'#8f2626',clothHi:'#ee7a6d',pants:'#4d4d57',pantsD:'#35353d',shoe:'tenis',meia:'#ffffff',hs:1.66,torso:142,sw:88,waist:80,hem:82,hw:62,thigh:94,shin:90,armU:84,armF:80,ru:15,re:13};
 const DA={...D,amassado:false};
 const hairBase=hairFront;
 hairFront=d=>{
  if(d.key==='kaua'&&d.amassado)return shape('M-46 -38Q-52 -62 -34 -72Q0 -80 34 -72Q52 -62 46 -38Q30 -52 0 -54Q-30 -52 -46 -38Z',d.hair)+`<ellipse cx="-52" cy="-58" rx="14" ry="7" transform="rotate(-25 -52 -58)" fill="${d.hair}"/><ellipse cx="54" cy="-54" rx="14" ry="7" transform="rotate(22 54 -54)" fill="${d.hair}"/><path d="M-8 -78Q4 -92 18 -77" fill="none" stroke="${d.hair}" stroke-width="7" stroke-linecap="round"/>`;
  if(d.key==='leo')return shape('M-45 -40Q-52 -88 -14 -100Q22 -112 46 -84Q55 -62 45 -40Q36 -66 10 -70Q-22 -66 -45 -40Z',d.hair)+shape('M-4 -98Q12 -130 40 -108Q24 -104 16 -94Z',d.hair)+stroke('M-30 -86Q-14 -98 6 -96',d.hairHi,2.4);
  if(d.key==='rafa'){
   const arm='M-45 -42Q-50 -80 -20 -90Q0 -96 20 -90Q50 -80 45 -42Q36 -64 0 -66Q-36 -64 -45 -42Z';
   return shape(arm,d.hair)+`<g fill="none" stroke="#1e1a1a" stroke-width="3.6" stroke-linecap="round"><circle cx="-21" cy="-20" r="17"/><circle cx="21" cy="-20" r="17"/><path d="M-4 -22Q0 -26 4 -22M-38 -22L-47 -26M38 -22L47 -26"/></g>`;
  }
  if(d.key==='pedrao')return shape('M-47 -38Q-56 -84 -24 -98Q4 -108 34 -96Q58 -82 47 -38Q38 -62 0 -64Q-36 -62 -47 -38Z',d.hair)+`<circle cx="-30" cy="-82" r="9" fill="${d.hair}"/><circle cx="-14" cy="-95" r="10" fill="${d.hair}"/><circle cx="6" cy="-99" r="10" fill="${d.hair}"/><circle cx="26" cy="-92" r="10" fill="${d.hair}"/><circle cx="40" cy="-76" r="9" fill="${d.hair}"/>`+shape('M-45 -4Q-48 40 0 54Q48 40 45 -4Q34 24 0 28Q-34 24 -45 -4Z',d.hair)+stroke('M-30 -28Q-22 -32 -14 -28M14 -28Q22 -32 30 -28',d.hairHi,0);
  return hairBase(d);
 };
 // ator genérico do elenco (sem o "branco" de impacto do Kauã)
 const POSE0={y:0,q:1,lean:0,head:0,armL:[-6,-8],armR:[6,8],legL:[-5,-2],legR:[5,2],expr:'neutro',mouth:null,blink:0,look:[0,0]};
 const ator=(d,p,x,y,sc)=>`<g transform="translate(${F(x)} ${F(y+(p.y||0))}) scale(${F(sc/(p.q||1))} ${F(sc*(p.q||1))})" filter="url(#cutout)">${drawChar(d,{...POSE0,...p,blink:bell(clock%4.3,3.9,4.15),breath:4+4*Math.sin(clock*2),head:(p.head||0)+Math.sin(clock*2.5)*1.5})}</g>`;

 // ----- Hambúrguer Louco (HQ), mesmo enquadramento do mascote: pés em y=1712, centro em x=540 -----
 function hamburguer(t,o={}){
  const danca=o.danca??1, bat=Math.sin(t*Math.PI*2*2.2), bob=Math.abs(bat)*20*danca, moon=o.moon||0, look=o.look||0;
  const lean=-moon*5, sh=Math.sin(t*14)*30*moon;
  let s=`<ellipse cx="540" cy="1712" rx="${F(300-bob*2)}" ry="34" fill="#192c45" opacity=".32"/><g transform="translate(0 ${F(-bob)})">`;
  for(const lado of[-1,1]){const sl=moon?Math.sin(t*14+(lado>0?Math.PI:0))*34:Math.sin(t*Math.PI*2*1.1+(lado>0?Math.PI:0))*10*danca;
   s+=`<g transform="translate(${540+lado*108} 1520)"><path d="M0 0V150" stroke="${INK}" stroke-width="92" stroke-linecap="round"/><path d="M0 0V150" stroke="#fff0b8" stroke-width="70" stroke-linecap="round"/><path d="M-34 40H34M-34 92H34" stroke="#e8453c" stroke-width="10"/><ellipse cx="${F(lado*8+sl)}" cy="178" rx="84" ry="40" fill="#6b3a22" ${ink(7)}/></g>`;}
  const swing=danca*Math.sin(t*Math.PI*2*2.2);
  for(const lado of[-1,1]){if(o.aperto&&lado===1)continue;const ang=lado*(38+swing*lado*28+moon*40);s+=`<g transform="translate(${540+lado*205} 1270) rotate(${F(ang)})"><path d="M0 0V230" stroke="${INK}" stroke-width="100" stroke-linecap="round"/><path d="M0 0V230" stroke="#e8453c" stroke-width="76" stroke-linecap="round"/><circle cx="0" cy="250" r="56" fill="#fff" ${ink(7)}/></g>`;}
  s+=`<g transform="rotate(${F(lean)} 540 1190)"><rect x="330" y="1180" width="420" height="380" rx="150" fill="#e8453c" ${ink(9)}/><rect x="330" y="1180" width="420" height="380" rx="150" fill="url(#dots)" opacity=".10"/><ellipse cx="540" cy="1400" rx="125" ry="150" fill="#ffe58a" ${ink(6)}/><ellipse cx="540" cy="1196" rx="190" ry="48" fill="#ffe58a" ${ink(8)}/>`;
  // cabeça: pãozinho com camadas
  let hh='';
  hh+=`<g transform="translate(0 150) rotate(${F(Math.sin(t*Math.PI*2*1.1+1)*3.5*danca)} 540 1190)" filter="url(#ink-shadow)">`;
  hh+=`<path d="M250 930Q250 1010 330 1030H750Q830 1010 830 930Z" fill="#d98a35" ${ink(9)}/>`;
  hh+=`<rect x="235" y="850" width="610" height="88" rx="40" fill="#6b3a22" ${ink(9)}/><path d="M330 870V918M430 870V918M540 870V918M650 870V918M750 870V918" stroke="#3d2113" stroke-width="7" stroke-linecap="round"/>`;
  hh+=`<rect x="225" y="792" width="630" height="56" rx="10" fill="#ffd23f" ${ink(8)}/><path d="M320 846L350 846L335 912Z M690 846L728 846L706 924Z" fill="#ffd23f" ${ink(7)}/>`;
  hh+=`<rect x="240" y="744" width="600" height="54" rx="27" fill="#e8453c" ${ink(8)}/>`;
  hh+=`<path d="M222 744Q256 700 292 744T362 744T432 744T502 744T572 744T642 744T712 744T782 744T858 744V774H222Z" fill="#6fcf6a" ${ink(8)}/>`;
  hh+=`<path d="M240 712Q240 446 540 424Q840 446 840 712Q540 764 240 712Z" fill="#e9a24a" ${ink(10)}/><path d="M290 560Q330 470 450 450" fill="none" stroke="#ffd9a0" stroke-width="14" stroke-linecap="round" opacity=".7"/>`;
  for(const [x,y,r] of[[330,500,-30],[420,470,-12],[540,458,0],[650,470,14],[740,505,32],[360,560,-20],[720,568,24]])hh+=`<ellipse cx="${x}" cy="${y}" rx="17" ry="8" transform="rotate(${r} ${x} ${y})" fill="#fff1d0" ${ink(3)}/>`;
  // rosto no pão: olhos grandes, sobrancelhas bravas, sorriso de dentes
  const px=look*10;
  for(const [x,flip] of[[455,1],[625,-1]]){hh+=`<circle cx="${x}" cy="598" r="52" fill="#fff" ${ink(7)}/><circle cx="${x+px}" cy="${604}" r="21" fill="#120c0c"/><circle cx="${x+px+7}" cy="596" r="6" fill="#fff"/><path d="M${x-flip*58} ${548-flip*0}L${x+flip*52} ${528+flip*38}" stroke="${INK}" stroke-width="20" stroke-linecap="round"/>`;}
  hh+=`<path d="M410 668Q540 758 670 668Q540 702 410 668Z" fill="#2a1118" ${ink(7)}/><path d="M440 676Q540 712 640 676" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-dasharray="26 8"/>`;
  if(o.soCabeca)return hh+'</g>';
  s+=o.semCabeca?`</g></g>`:hh+`</g></g></g>`;
  return s;
 }

 // ----- cenários extras -----
 function fundoCorredor(t,sh=0){
  let s=`<rect width="1080" height="1920" fill="url(#vice-sunset)"/><rect width="1080" height="1920" fill="url(#dots)" opacity=".10"/>`;
  s+=`<path d="M0 0H1080V330L760 540H320L0 330Z" fill="#cdbbf3" ${ink(8)}/>`;
  for(let i=0;i<5;i++)s+=`<circle cx="${180+i*180}" cy="${120+Math.abs(i-2)*40}" r="44" fill="#fff6d6" ${ink(5)}/>`;
  s+=`<path d="M0 330L320 540V1360L0 1540Z" fill="#8a6fd6" ${ink(8)}/><path d="M1080 330L760 540V1360L1080 1540Z" fill="#ffb08c" ${ink(8)}/>`;
  s+=`<rect x="320" y="540" width="440" height="820" fill="#fbe3ee" ${ink(8)}/>`;
  s+=`<path d="M90 520L260 640V1140L90 1260Z" fill="#fff" opacity=".35"/><path d="M990 520L820 640V1140L990 1260Z" fill="#fff" opacity=".35"/>`;
  s+=`<path d="M0 1540L320 1360H760L1080 1540V1920H0Z" fill="#f0e2d6" ${ink(8)}/>`;
  for(let i=-3;i<8;i++)s+=`<path d="M${540+i*55} 1360L${540+i*230} 1920" stroke="#a48ab8" stroke-width="3" opacity=".5"/>`;
  s+=`<path d="M200 1450H880M120 1580H960M0 1740H1080" stroke="#a48ab8" stroke-width="3" opacity=".5"/>`;
  return s;
 }

 // ===== Dia 3 (A Cadeira) em HQ V10. t é o tempo GLOBAL (ver ../falas.js). =====
 // Peças auxiliares (balão, cadeira, quarto) copiadas de ../../dia02/hq/final-parte2.js (origem anotada, 15/11/2026).
 const lerp=(a,b,p)=>a+(b-a)*cl(p);
 const pop=(t,t0,d=.22)=>out((t-t0)/d);
 const FONTEH='font-family="Impact,Arial Black"', FA='font-family="Arial Black,Impact" font-weight="900"';
 const reais=v=>'R$ '+v.toFixed(2).replace('.',',');
 const FN=n=>DADOS.falas.find(f=>f.n===n);
 const DK=D;
 const marc=(p,x,y,sc,lx=1.85,ly=1.12)=>`<g transform="translate(${x} ${y}) scale(${lx} ${ly}) translate(${-x} ${-y})">${ator(MARC,p,x,y,sc)}</g>`;                                   // cachos (identidade aprovada)
 const MARC={...PEDRAO,name:'Marcos',skin:'#d9a07a',shade:'#b87d58',cloth:'#3d6fb5',clothD:'#2a4d85',clothHi:'#7aa7e0',pants:'#3a3a48',pantsD:'#2a2a36',hs:1.6,torso:150,sw:128,waist:118,hem:120,hw:84,thigh:96,shin:90};
 const NOTA=(x,y,r=0,sc=1)=>`<g transform="translate(${x} ${y}) rotate(${r}) scale(${sc})"><rect x="-90" y="-44" width="180" height="88" rx="8" fill="#9fd9a4" ${ink(6)}/><circle r="26" fill="#d8f2d4" ${ink(4)}/><text y="12" text-anchor="middle" ${FONTEH} font-size="34" fill="${INK}">50</text></g>`;
 const MOEDA=(x,y,r=34,c='#ffd23f')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" ${ink(6)}/><circle cx="${x}" cy="${y}" r="${r*.62}" fill="none" stroke="${INK}" stroke-width="3" opacity=".5"/>`;

 // ----- HUD: relógio + barra (a meta estica de 449,90 para 879,90 em 74,5–77,6 s) -----
 const SALDO3=13.2;
 const META=t=>449.9+430*fit(t,74.5,77.6);
 function hud3(t){
  const m=META(t), w=Math.max(10,792*SALDO3/m), esticando=t>=74.5&&t<80, mudou=bell(t,74.5,77.6);
  let s=`<g transform="translate(250 56)"><rect x="0" y="0" width="580" height="96" rx="12" fill="#30233f" stroke="#ffe7c2" stroke-width="5"/><text x="290" y="66" text-anchor="middle" ${FONTEH} font-size="54" letter-spacing="5" fill="${CREAM}">GTA 6 EM 4 DIAS</text></g>`;
  const k=1+mudou*.07, estica=1+fit(t,74.5,77.6)*.0;
  s+=`<g transform="translate(540 1655) scale(${F(k)}) translate(-540 -1655)"><g transform="translate(100 1580)"><rect x="0" y="0" width="880" height="150" rx="12" fill="#30233f" stroke="${esticando?'#ffd23f':'#ffe7c2'}" stroke-width="5"/><text x="440" y="70" text-anchor="middle" ${FONTEH} font-size="58" letter-spacing="3" fill="${esticando?'#ffd23f':CREAM}">${reais(SALDO3)} DE ${reais(m)}</text><rect x="44" y="100" width="792" height="22" rx="11" fill="#fff3d3" opacity=".22"/><rect x="44" y="100" width="${F(w)}" height="22" rx="11" fill="#ff8fb3"/></g></g>`;
  return s;
 }
 // ----- balão de fala em HQ (copiado do Dia 2) -----
 function balao(cx,y,linhas,tx,ty,t0,t,tam=46){
  const _w=Math.max(...linhas.map(l=>l.length))*tam*.55+60,_h=linhas.length*tam*1.15+30,_x=cx-_w/2;
  const bx=Math.min(_x+_w-70,Math.max(_x+70,tx)),by=y+_h,dx=tx-bx,dy=ty-by,dd=Math.hypot(dx,dy)||1,len=Math.min(dd,120);tx=bx+dx/dd*len;ty=by+dy/dd*len;
  const a=pop(t,t0,.35); if(a<=0)return '';
  const w=_w, h=_h, x=cx-w/2;
  let s=`<g transform="translate(${F(cx)} ${F(y+h/2)}) scale(${F(a)}) translate(${F(-cx)} ${F(-y-h/2)})" filter="url(#ink-shadow)">`;
  s+=`<path d="M${F(bx-30)} ${F(y+h-6)}L${F(tx)} ${F(ty)}L${F(bx+30)} ${F(y+h-6)}Z" fill="#fffaf0" ${ink(7)}/>`;
  s+=`<rect x="${F(x)}" y="${F(y)}" width="${F(w)}" height="${F(h)}" rx="34" fill="#fffaf0" ${ink(8)}/><rect x="${F(bx-24)}" y="${F(y+h-12)}" width="48" height="16" fill="#fffaf0"/>`;
  linhas.forEach((l,i)=>{s+=`<text x="${F(cx)}" y="${F(y+tam*1.0+i*tam*1.15+8)}" text-anchor="middle" ${FA} font-size="${tam}" fill="${INK}">${l}</text>`;});
  return s+'</g>';
 }
 // ----- cenário -----
 function quarto(t,noite=true){
  let s=`<rect width="1080" height="1920" fill="${noite?'#4a4278':'#8fb8c8'}"/><rect width="1080" height="1920" fill="url(#dots)" opacity=".10"/><rect width="1080" height="1920" fill="url(#paper)" opacity=".35"/>`;
  s+=`<rect x="90" y="260" width="360" height="420" fill="${noite?'#1c2438':'#bfe6f2'}" ${ink(8)}/><path d="M270 260V680M90 470H450" stroke="${INK}" stroke-width="8"/>`;
  if(noite)for(const [x,y] of[[150,330],[360,560],[200,620],[400,300]])s+=`<circle cx="${x}" cy="${y}" r="5" fill="#fff6d6"/>`;
  s+=`<g transform="translate(700 420)"><rect width="300" height="400" fill="#7a6aa8" ${ink(8)}/><rect x="20" y="20" width="260" height="360" fill="#9a8ac8"/><path d="M30 300L110 200L170 280L220 220L270 310" stroke="#ffd23f" stroke-width="10" fill="none"/></g>`;
  s+=`<path d="M0 1450H1080V1920H0Z" fill="#a8845f" ${ink(8)}/>`;
  for(let i=0;i<8;i++)s+=`<path d="M${i*150} 1450L${i*190-60} 1920" stroke="#6e5238" stroke-width="3" opacity=".5"/>`;
  return s;
 }
 // cadeira gamer (frente); o limite é a etiqueta do encosto (ver etiqueta120)
 function cadeira(x,y,sc,a=1){
  return `<g transform="translate(${x} ${y}) scale(${sc})" opacity="${F(a)}"><path d="M-120 -420Q-130 -140 -90 -80H90Q130 -140 120 -420Q0 -470 -120 -420Z" fill="#e8453c" ${ink(10)}/><path d="M-70 -300L40 -360M-30 -200L90 -240" stroke="#ffe58a" stroke-width="14" stroke-linecap="round"/><rect x="-150" y="-80" width="300" height="70" rx="26" fill="#3a3a4a" ${ink(10)}/><path d="M-40 -10V120M40 -10V120M-150 160L0 110L150 160" stroke="${INK}" stroke-width="16" stroke-linecap="round" fill="none"/><circle cx="-150" cy="170" r="22" fill="${INK}"/><circle cx="150" cy="170" r="22" fill="${INK}"/><rect x="60" y="-70" width="70" height="40" rx="8" fill="#c9c2a8" ${ink(5)} transform="rotate(-8 95 -50)"/></g>`;
 }
 const cadeiraCosta=(x,y,sc)=>`<g transform="translate(${x} ${y}) scale(${sc})"><path d="M-120 -420Q-130 -140 -90 -80H90Q130 -140 120 -420Q0 -470 -120 -420Z" fill="#e8453c" ${ink(10)}/><path d="M-70 -300L40 -360M-30 -200L90 -240" stroke="#ffe58a" stroke-width="14" stroke-linecap="round"/></g>`;
 const cadeiraBase=(x,y,sc,afunda=0)=>`<g transform="translate(${x} ${y}) scale(${sc})"><path d="M-40 -10V120M40 -10V120M-150 160L0 110L150 160" stroke="${INK}" stroke-width="16" stroke-linecap="round" fill="none"/><circle cx="-150" cy="170" r="22" fill="${INK}"/><circle cx="150" cy="170" r="22" fill="${INK}"/><rect x="-150" y="${-80+afunda}" width="300" height="70" rx="26" fill="#3a3a4a" ${ink(10)}/></g>`;
 const rosto=(expr,o={},sc=2.7)=>ator(DK,{expr,...o},540,2160,sc);   // cabeça grande (centro do rosto em y≈810)

 // ----- controle remendado (fita isolante, X de chiclete, analógico esquerdo) -----
 function controle(x,y,sc,rot,o={}){
  const luz=o.luz??0, stick=o.stick??0;           // stick: 0 no lugar, >0 sai voando
  let s=`<g transform="translate(${F(x)} ${F(y)}) rotate(${F(rot)}) scale(${F(sc)})" filter="url(#ink-shadow)">`;
  s+=`<path d="M-190 -50Q-200 -120 -130 -126H130Q200 -120 190 -50L206 96Q214 170 148 160Q104 150 84 96H-84Q-104 150 -148 160Q-214 170 -206 96Z" fill="#e6e6f0" ${ink(9)}/>`;
  s+=`<path d="M-120 -126H120Q150 -124 170 -110L100 -86H-100L-170 -110Q-150 -124 -120 -126Z" fill="#cfd0de"/>`;
  s+=`<rect x="-70" y="-122" width="140" height="16" rx="8" fill="${luz>0?'#ff8fb3':'#555a72'}" ${luz>0?'':'opacity=".9"'}/>`;
  if(luz>0)s+=`<rect x="-86" y="-130" width="172" height="32" rx="16" fill="#ff8fb3" opacity="${F(.35*luz)}"/>`;
  s+=`<path d="M-130 -40h40M-110 -60v40" stroke="${INK}" stroke-width="16" stroke-linecap="round"/>`;
  for(const [bx,by,c] of[[110,-70,'#7ec8e3'],[150,-40,'#ff7a8a'],[70,-40,'#c79bf2'],[110,-10,'#9fd9a4']])s+=`<circle cx="${bx}" cy="${by}" r="17" fill="#bfc1d6" ${ink(4)}/>`;
  s+=`<ellipse cx="110" cy="-8" rx="30" ry="22" fill="#ff8fb3" ${ink(5)}/><path d="M92 -10Q110 -22 128 -8" stroke="#fff" stroke-width="4" fill="none" opacity=".7"/>`;   // chiclete no X
  s+=`<circle cx="62" cy="52" r="34" fill="#5a5f7a" ${ink(7)}/>`;                                   // direito
  if(stick<=0)s+=`<circle cx="-62" cy="52" r="34" fill="#5a5f7a" ${ink(7)}/><circle cx="-62" cy="52" r="18" fill="#454a62"/>`;
  else s+=`<circle cx="-62" cy="52" r="30" fill="#2c2f40" ${ink(5)}/>`;
  s+=`<path d="M-200 30L-120 -40M-170 100L-60 -10" stroke="#25252f" stroke-width="22" stroke-linecap="butt" opacity=".92"/><path d="M-200 30L-120 -40M-170 100L-60 -10" stroke="#4a4a58" stroke-width="3" stroke-dasharray="14 12"/>`; // fita isolante
  s+=`<path d="M150 70L196 -10" stroke="#25252f" stroke-width="20" opacity=".92"/>`;
  return s+'</g>';
 }
 function stickSolto(x,y,sc,rot){return `<g transform="translate(${F(x)} ${F(y)}) rotate(${F(rot)}) scale(${F(sc)})"><circle r="34" fill="#5a5f7a" ${ink(7)}/><circle r="18" fill="#454a62"/></g>`;}

 // Fonte da capa do Dia 3: Kauã de susto com o controle remendado e o analógico voando (mesma composição do Dia 1, 488/1810/2.15).
 function scene(t){
  const pose={armL:[-50,70],armR:[50,-70],expr:'surpreso',look:[5,1],head:-3,mouth:'o',blink:0,breath:0};
  return defs(t)+ator(DK,pose,488,1810,2.15)+controle(490,1080,1.0,-8,{luz:0,stick:1})+stickSolto(700,800,1.1,25);
 }
 async function renderFrame(t){const im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920">${scene(t)}</svg>`);await im.decode();ctx.clearRect(0,0,C.width,C.height);ctx.drawImage(im,0,0,C.width,C.height);}
 return {renderFrame,scene};
})();
window.HQ=HQ;window.renderFrame=HQ.renderFrame;window.FILM_DURATION=1;window.READY=true;
