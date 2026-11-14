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
 function saldo(t){
  const a=fit(t,3.17,3.45),dy=(1-a)*30;
  return `<g opacity="${F(a)}" transform="translate(780 ${F(1020+dy)}) rotate(4)"><path d="M-170 -68H170V55L150 65L130 55L110 65L90 55L70 65L50 55L30 65L10 55L-10 65L-30 55L-50 65L-70 55L-90 65L-110 55L-130 65L-150 55L-170 65Z" fill="#fff0ca" stroke="#32263c" stroke-width="5"/><text y="14" text-anchor="middle" font-family="Arial Black,Arial" font-weight="900" font-size="66" fill="#3d2a46">R$ 3,20</text><path d="M-178 28Q-230 40 -244 124" fill="none" stroke="#fff2ce" stroke-width="6" stroke-linecap="round"/><path d="M-255 109L-244 130L-231 114" fill="none" stroke="#fff2ce" stroke-width="6" stroke-linecap="round"/></g>`;
 }
 function room(t){
  const far=Math.sin(t*.55)*5;
  let s=`<rect width="1080" height="1920" fill="url(#wall)"/><path d="M0 0L150 115V1540L0 1720Z" fill="url(#side)"/><path d="M150 115V1540" stroke="#1c3248" stroke-width="7"/><g transform="translate(${F(far)} 0)"><rect x="175" y="150" width="270" height="420" rx="4" fill="#263b60" stroke="#111a2c" stroke-width="10"/><rect x="191" y="166" width="238" height="387" fill="#a3dece"/><path d="M310 163V555M187 350H433" stroke="#20435c" stroke-width="14"/><path d="M185 180L880 1510H520L185 480Z" fill="url(#beam)"/><path d="M750 250h200v300H750Z" fill="#f3d574" stroke="#151a2c" stroke-width="7"/><path d="M785 290l70 8-50 53 85 20-70 55" fill="none" stroke="#ee4c6e" stroke-width="27"/></g>`;
  s+=`<path d="M0 1710L150 1540H1080V1920H0Z" fill="url(#floor)"/><path d="M0 1710L150 1540H1080" fill="none" stroke="#181a29" stroke-width="8"/>`;
  for(let i=-2;i<9;i++)s+=`<path d="M${150+i*135} 1540L${150+i*230} 1920" stroke="#73536a" stroke-width="3" opacity=".4"/>`;
  s+=`<path d="M0 1780H1080M0 1870H1080" stroke="#795364" stroke-width="3" opacity=".4"/><path d="M900 260H1080V1540H900Z" fill="url(#dots)" opacity=".14"/>`;
  // Diorama gamer: tela e mesa como planos de papel, não superfícies chapadas sobrepostas ao corpo.
  s+=`<g transform="translate(690 1175) rotate(2)"><path d="M-70 130L310 90L375 145L-40 184Z" fill="#d6b07d" stroke="#151828" stroke-width="9"/><path d="M-40 184L375 145V330L-40 357Z" fill="#ac795a" stroke="#151828" stroke-width="9"/><path d="M160 170L375 145V330L160 344Z" fill="url(#dots)" opacity=".28"/><path d="M-10 352V495M335 330V465" stroke="#171a2c" stroke-width="24"/><path d="M-40 184L375 145V330L-40 357Z" fill="url(#grain)"/><rect x="-30" y="-118" width="320" height="215" rx="12" fill="#18384a" stroke="#151825" stroke-width="12"/><rect x="-12" y="-101" width="284" height="175" fill="#61cbb4"/><path d="M-12 23H272V74H-12Z" fill="#3e807a"/><path d="M30 52H230M44 51V-40H78V52" stroke="#214b62" stroke-width="8" fill="none"/><path d="M127 98V135M80 138H180" stroke="#151825" stroke-width="12"/>${controle(110,167,.55,t,{rot:-8})}</g>`;
  // Detalhes funcionais do quarto, atrás da atuação e dos efeitos de leitura.
  s+=`<g opacity=".8"><path d="M198 505V399H240V505M250 505V430H291V505M327 505V367H370V505M382 505V415H419V505" fill="#68a8ad"/><path d="M210 420h10m-10 28h10m50 0h10m58-56h12m-12 30h12m53 16h10" stroke="#d8ead2" stroke-width="7"/></g>`;
  s+=`<g transform="translate(735 675)"><path d="M-35 112H320L340 137H-18Z" fill="#bd8d6e" stroke="#25364b" stroke-width="7"/><path d="M-10 130V160M300 135V164" stroke="#25364b" stroke-width="11"/><rect x="5" y="5" width="47" height="107" rx="3" fill="#c56b87" stroke="#263147" stroke-width="5"/><rect x="55" y="19" width="40" height="93" fill="#f0d5a7" stroke="#263147" stroke-width="5"/><path d="M101 16L144 6L169 104L127 115Z" fill="#8977ad" stroke="#263147" stroke-width="5"/><rect x="183" y="67" width="105" height="44" rx="4" fill="#446c7d" stroke="#263147" stroke-width="5"/><circle cx="207" cy="89" r="9" fill="#f9deac"/><path d="M233 88H272" stroke="#93b7b8" stroke-width="5"/></g>`;
  s+=`<g transform="translate(138 1210)"><path d="M0 0Q10 -36 58 -30H139Q170 -24 176 12L160 239H21Z" fill="#5c4f71" stroke="#213047" stroke-width="8"/><path d="M35 13L45 168M142 13L126 168" stroke="#be829d" stroke-width="17"/><path d="M20 220H159L194 260H-10Z" fill="#67617c" stroke="#213047" stroke-width="7"/><path d="M89 261V365M89 365L3 391M89 365L175 389" fill="none" stroke="#253149" stroke-width="14"/><circle cx="0" cy="397" r="14" fill="#273047"/><circle cx="180" cy="396" r="14" fill="#273047"/><path d="M65 64l17 10-13 15m32 21l-11 9 14 7" fill="none" stroke="#d9c29e" stroke-width="4"/></g>`;
  s+=`<path d="M973 1271Q1064 1350 1016 1440T1030 1580Q1050 1670 945 1687Q830 1692 907 1734" fill="none" stroke="#283447" stroke-width="7"/><rect x="982" y="1460" width="57" height="97" rx="7" fill="#d5d6c7" stroke="#425563" stroke-width="5"/><circle cx="1009" cy="1489" r="10" fill="#738787"/><circle cx="1009" cy="1524" r="10" fill="#738787"/><path d="M1006 1488H1013M1006 1523H1013" stroke="#27354a" stroke-width="4"/>`;
  s+=`<g transform="translate(1015 1195) rotate(2)"><path d="M0 0Q16 -12 35 0L47 139Q25 147 0 139Z" fill="#e9e6d6" stroke="#25354c" stroke-width="6"/><path d="M13 14L24 131" stroke="#33455e" stroke-width="9"/><circle cx="26" cy="119" r="3" fill="#a282c6"/></g><g transform="translate(658 1250)"><rect x="-22" y="-40" width="42" height="59" rx="8" fill="#bc7b90" stroke="#28354a" stroke-width="5"/><path d="M21 -29Q49 -29 45 -7Q43 8 22 5" fill="none" stroke="#28354a" stroke-width="7"/></g><path d="M801 1736L922 1714L958 1770L834 1793Z" fill="#8579a5" stroke="#344156" stroke-width="5"/><path d="M819 1738L909 1723" stroke="#efc99f" stroke-width="7"/>`;
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
  s+=`<g transform="translate(26 465)"><rect width="138" height="270" rx="5" fill="#bc9271" stroke="#486470" stroke-width="6"/><path d="M15 24H115V86H15Z" fill="#f3dfad"/><path d="M31 109H128V176H31Z" fill="#d2a1ba"/><path d="M12 194H103V252H12Z" fill="#f5e7ca"/><path d="M31 46H95M43 133H111M24 215H82" stroke="#8f7b7c" stroke-width="4"/></g><g transform="translate(962 238)"><circle r="66" fill="#fbebc7" stroke="#3b566b" stroke-width="9"/><path d="M0 -48V0L31 20" fill="none" stroke="#3b566b" stroke-width="7" stroke-linecap="round"/><circle r="6" fill="#bd7d9d"/></g>`;
  s+=`<g transform="translate(118 175) rotate(-4)"><path d="M0 0H610V112H0Z" fill="#ffcc24" stroke="#151728" stroke-width="8"/><text x="305" y="77" text-anchor="middle" font-family="Impact" font-size="65" fill="#171728">ONTEM · 16H</text></g>`;
  s+=`<rect width="1080" height="1920" fill="url(#paper)" opacity=".35"/>`;
  const p=pose(t);s+=actor(D,{...p,y:0,q:1},330,1640,1.72,t);
  const jp={...p,y:0,q:1,lean:-3,head:-10,expr:'pensando',look:[-7,3],armL:[-75,-60],armR:[12,6],mouth:t>13.38?'open':null};
  s+=actor(J,jp,805,1640,1.65,t);
  s+=`<path d="M90 1480L900 1390L1080 1500L170 1630Z" fill="#ddb47b" stroke="#181b2a" stroke-width="10"/><path d="M170 1630L1080 1500V1920H170Z" fill="#a8785b" stroke="#181b2a" stroke-width="10"/><path d="M600 1570L1080 1500V1920H600Z" fill="url(#dots)" opacity=".32"/><g transform="translate(465 1140) rotate(-4)"><rect width="330" height="250" rx="14" fill="#24364e" stroke="#141927" stroke-width="10"/><rect x="16" y="16" width="298" height="216" fill="#9ed4cc"/><path d="M150 250V300M90 300H235" stroke="#141927" stroke-width="12"/><path d="M100 35H210L250 75V205H100Z" fill="#fff2c3" stroke="#182033" stroke-width="6"/><path d="M210 35V75H250" fill="none" stroke="#182033" stroke-width="5"/><rect x="75" y="110" width="160" height="55" fill="#f23865"/><text x="155" y="152" text-anchor="middle" font-family="Impact" font-size="44" fill="#fff">PDF</text></g>`;
  return s;
 }
 function scene(t){
  let s=defs(t);const p=pose(t);
  if(t>=10.41)return s+office(t);
  const shake=bell(t,.72,1.22)*5+bell(t,6.12,6.48)*4;
  s+=`<g transform="translate(${F(Math.sin(t*36)*shake)} ${F(Math.cos(t*31)*shake)})">${room(t)}<rect width="1080" height="1920" fill="url(#paper)" opacity=".42"/>`;
  if(t<3.1){
   s+=`<text x="105" y="195" font-family="Impact" font-size="110" fill="#152337" stroke="#fff5d5" stroke-width="6" paint-order="stroke fill">FALTAM</text>`;
   if(t>=.72)s+=star(700,350,350,t-.72,'6','DIAS')+streaks(t,.72,620,550);
   if(t>1.35)s+=`<g opacity="${F(fit(t,1.35,1.55))}" transform="translate(630 760) rotate(5)"><path d="M-15 -90H385V10H-15Z" fill="#16253d" stroke="#fff4c9" stroke-width="6"/><text x="185" y="-17" font-family="Impact" font-size="69" text-anchor="middle" fill="#fff5d7">PRO GTA 6</text></g>`;
  }else if(t<5.11){s+=saldo(t);}
  if(t>=5.11){
   const a=out((t-5.11)/.3),rot=-5*(1-a);s+=`<g transform="translate(${F(100+980*(1-a))} 95) rotate(${F(rot)}) scale(.97)" filter="url(#ink-shadow)"><path d="M0 0H860V440H0Z" fill="#fff2cd" stroke="#fffdf0" stroke-width="17"/><path d="M0 0H860V440H0Z" fill="none" stroke="#34263e" stroke-width="7"/><path d="M0 0L430 155L860 0" fill="#e8cda6" stroke="#34263e" stroke-width="6"/><rect x="74" y="120" width="712" height="94" rx="4" fill="#fff0d3"/><text x="430" y="187" text-anchor="middle" font-family="Impact" font-size="64" fill="#35283f">AJUSTE DE ESTRUTURA</text><g transform="rotate(-5 430 292)"><rect x="70" y="242" width="720" height="116" fill="#d96e99" stroke="#35283f" stroke-width="7"/><text x="430" y="329" text-anchor="middle" font-family="Impact" font-size="99" letter-spacing="5" fill="#fff4df">DEMITIDO</text></g><path d="M75 395H785" stroke="#c7a999" stroke-width="3" stroke-dasharray="10 9"/></g>`;
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
   for(let i=0;i<4;i++)s+=`<circle cx="${i*8+3}" cy="${-4-i%2*2}" r="6.5" fill="${i===3?'#dee1d9':'#ffd342'}" stroke="#33253c" stroke-width="1.7" opacity="${F(fit(t,3.2,3.45))}"/>`;
   s+='</g>';
  }
  return s+'</g>';
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
