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
  for(const lado of[-1,1]){const ang=lado*(38+swing*lado*28+abre*14);s+=`<g transform="translate(${540+lado*205} 1270) rotate(${F(ang)})"><path d="M0 0V230" stroke="${INK}" stroke-width="100" stroke-linecap="round"/><path d="M0 0V230" stroke="#ffcf5a" stroke-width="76" stroke-linecap="round"/><circle cx="0" cy="250" r="56" fill="#fff" ${ink(7)}/></g>`;}
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
 const DA={...D,amassado:true};
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
 const ator=(d,p,x,y,sc)=>`<g transform="translate(${F(x)} ${F(y+(p.y||0))}) scale(${F(sc/(p.q||1))} ${F(sc*(p.q||1))})" filter="url(#cutout)">${drawChar(d,{...POSE0,...p})}</g>`;

 // ----- Hambúrguer Louco (HQ), mesmo enquadramento do mascote: pés em y=1712, centro em x=540 -----
 function hamburguer(t,o={}){
  const danca=o.danca??1, bat=Math.sin(t*Math.PI*2*2.2), bob=Math.abs(bat)*20*danca, moon=o.moon||0, look=o.look||0;
  const lean=-moon*5, sh=Math.sin(t*14)*30*moon;
  let s=`<ellipse cx="540" cy="1712" rx="${F(300-bob*2)}" ry="34" fill="#192c45" opacity=".32"/><g transform="translate(0 ${F(-bob)})">`;
  for(const lado of[-1,1]){const sl=moon?Math.sin(t*14+(lado>0?Math.PI:0))*34:Math.sin(t*Math.PI*2*1.1+(lado>0?Math.PI:0))*10*danca;
   s+=`<g transform="translate(${540+lado*108} 1520)"><path d="M0 0V150" stroke="${INK}" stroke-width="92" stroke-linecap="round"/><path d="M0 0V150" stroke="#fff0b8" stroke-width="70" stroke-linecap="round"/><path d="M-34 40H34M-34 92H34" stroke="#e8453c" stroke-width="10"/><ellipse cx="${F(lado*8+sl)}" cy="178" rx="84" ry="40" fill="#6b3a22" ${ink(7)}/></g>`;}
  const swing=danca*Math.sin(t*Math.PI*2*2.2);
  for(const lado of[-1,1]){const ang=lado*(38+swing*lado*28+moon*40);s+=`<g transform="translate(${540+lado*205} 1270) rotate(${F(ang)})"><path d="M0 0V230" stroke="${INK}" stroke-width="100" stroke-linecap="round"/><path d="M0 0V230" stroke="#e8453c" stroke-width="76" stroke-linecap="round"/><circle cx="0" cy="250" r="56" fill="#fff" ${ink(7)}/></g>`;}
  s+=`<g transform="rotate(${F(lean)} 540 1190)"><rect x="330" y="1180" width="420" height="380" rx="150" fill="#e8453c" ${ink(9)}/><rect x="330" y="1180" width="420" height="380" rx="150" fill="url(#dots)" opacity=".10"/><ellipse cx="540" cy="1400" rx="125" ry="150" fill="#ffe58a" ${ink(6)}/><ellipse cx="540" cy="1196" rx="190" ry="48" fill="#ffe58a" ${ink(8)}/>`;
  // cabeça: pãozinho com camadas
  let hh='';
  hh+=`<g transform="rotate(${F(Math.sin(t*Math.PI*2*1.1+1)*3.5*danca)} 540 1190)" filter="url(#ink-shadow)">`;
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
