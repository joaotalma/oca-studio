// ===== Dia 4 (Paçoca) em HQ V10. t é o tempo GLOBAL (ver ../falas.js). =====
// Fontes: Impact não existe no Linux; cai em Nimbus Sans Narrow bold (condensada) para manter o peso visual dos Dias 1 a 3, feitos no Windows com Impact.
// Origem: ../../dia03/hq/final.js (helpers lerp/pop/FN, balão, quarto, rosto, controle e renderFrame copiados em 16/11/2026); cenas novas do Dia 4.

 const lerp=(a,b,p)=>a+(b-a)*cl(p);
 const pop=(t,t0,d=.22)=>out((t-t0)/d);
 const FONTEH='font-family="Impact,Nimbus Sans Narrow,Arial Narrow,Arial Black,sans-serif" font-weight="bold"', FA='font-family="Arial Black,Impact" font-weight="900"';
 const reais=v=>'R$ '+v.toFixed(2).replace('.',',');
 const FN=n=>DADOS.falas.find(f=>f.n===n);
 const DK=D;
 const marc=(p,x,y,sc,lx=1.85,ly=1.12)=>`<g transform="translate(${x} ${y}) scale(${lx} ${ly}) translate(${-x} ${-y})">${ator(MARC,p,x,y,sc)}</g>`;                                   // cachos (identidade aprovada)
 const MOEDA=(x,y,r=34,c='#ffd23f')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" ${ink(6)}/><circle cx="${x}" cy="${y}" r="${r*.62}" fill="none" stroke="${INK}" stroke-width="3" opacity=".5"/>`;
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
 const rosto=(expr,o={},sc=2.7)=>ator(DK,{expr,...o},540,2160,sc);   // cabeça grande (centro do rosto em y≈810)
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

 // ===== Dia 4: elenco novo, objetos, HUD =====
 const SEM_AD={capuz:false,bags:false,headset:undefined,gravata:undefined};
 const SENHORA={...CHARS.kaua,...SEM_AD,key:'senhora',name:'Senhora',skin:'#d9a47f',shade:'#b07f60',hair:'#e6e1dc',hairHi:'#ffffff',iris:'#4a3a2e',cloth:'#9c5f8a',clothD:'#74436a',clothHi:'#d595c2',pants:'#5a4a6a',pantsD:'#3f334d',shoe:'tenis',meia:'#ffffff',hs:1.38,torso:132,sw:50,waist:50,hem:62,hw:48,thigh:90,shin:86,armU:78,armF:74};
 const CRIANCA={...CHARS.kaua,...SEM_AD,key:'crianca',name:'Criança',skin:'#c68b62',shade:'#9d6944',hair:'#241a15',hairHi:'#46362d',iris:'#35261c',cloth:'#f4c542',clothD:'#c79a22',clothHi:'#ffe590',pants:'#3a6fb5',pantsD:'#2a4d85',shoe:'tenis',meia:'#ffffff',hs:2.0,torso:92,sw:40,waist:34,hem:38,hw:30,thigh:60,shin:58,armU:55,armF:52,ru:9,re:8};
 const MAE={...CHARS.kaua,...SEM_AD,key:'mae',name:'Mãe',skin:'#b57f5c',shade:'#8f6145',hair:'#1e1b1e',hairHi:'#3a2f2c',iris:'#2a2521',cloth:'#4a8fd0',clothD:'#2f6a9e',clothHi:'#8fc4ee',pants:'#4d4d57',pantsD:'#35353d',shoe:'tenis',meia:'#ffffff',hs:1.5,torso:146,sw:50,waist:42,hem:52,hw:42,thigh:100,shin:96};
 const CLIENTE={...CHARS.kaua,...SEM_AD,key:'cliente',name:'Cliente',skin:'#e2b08a',shade:'#be8a66',hair:'#4a2f22',hairHi:'#7a5642',iris:'#4a3426',cloth:'#e8a838',clothD:'#b9802a',clothHi:'#ffd27a',pants:'#2f4b7a',pantsD:'#213557',shoe:'tenis',meia:'#ffffff',hs:1.52,torso:156,sw:64,waist:52,hem:56,hw:44,thigh:108,shin:102};
 const hf4=hairFront;
 hairFront=d=>{
  if(d.key==='senhora'||d.key==='mae')return shape('M-46 -38Q-52 -84 -16 -96Q20 -104 46 -80Q54 -60 46 -38Q30 -62 0 -64Q-30 -62 -46 -38Z',d.hair)+`<circle cx="0" cy="-104" r="17" fill="${d.hair}"/>`+stroke('M-28 -86Q-8 -98 14 -94',d.hairHi,2.4);
  if(d.key==='crianca'||d.key==='cliente')return shape('M-46 -38Q-50 -78 -14 -88Q22 -94 46 -66Q52 -52 46 -38Q30 -58 0 -60Q-30 -58 -46 -38Z',d.hair)+stroke('M-26 -74Q-8 -84 14 -80',d.hairHi,2.4);
  return hf4(d);
 };
 const boca=t=>falando(t)&&Math.sin(t*16)>0?'open':null;
 const kau=(t,p,x,y,sc)=>ator(DK,{mouth:boca(t),...p},x,y,sc);
 const NORM=x=>x.toLowerCase().replace(/[.,:!?]/g,'');
 const WI=(n,pal,k=0)=>{const l=FN(n).palavras.filter(p=>NORM(p[0])===NORM(pal));if(!l.length)throw new Error('WI: palavra não encontrada na fala '+n+': '+pal);return (l[k]||FN(n).palavras[0])[1];};
 const NOTA=(x,y,r=0,sc=1,v='10')=>`<g transform="translate(${x} ${y}) rotate(${r}) scale(${sc})"><rect x="-90" y="-44" width="180" height="88" rx="8" fill="#9fd9a4" ${ink(6)}/><circle r="26" fill="#d8f2d4" ${ink(4)}/><text y="12" text-anchor="middle" ${FONTEH} font-size="34" fill="${INK}">${v}</text></g>`;

 // paçoca (sem marca): tablete com faixa vermelha; mord>0 mostra a mordida
 const PACOCA=(x,y,sc=1,rot=0,mord=0)=>`<g transform="translate(${F(x)} ${F(y)}) rotate(${F(rot)}) scale(${F(sc)})"><path d="${mord>0?'M-70 -26Q-70 -34 -60 -34H34Q46 -22 34 -12Q48 0 34 12Q46 24 34 34H-60Q-70 34 -70 26Z':'M-70 -26Q-70 -34 -60 -34H50Q70 -34 70 -26V26Q70 34 60 34H-60Q-70 34 -70 26Z'}" fill="#d9a35f" ${ink(7)}/><rect x="-14" y="-34" width="28" height="68" fill="#e8453c" ${ink(5)}/><path d="M-52 -14H-30M-52 8H-34M20 -12H38M22 10H34" stroke="#a5702f" stroke-width="5" stroke-linecap="round"/></g>`;
 // caixa de papelão com n paçocas em pé (a contagem é visível)
 const CAIXA=(x,y,sc,n)=>{
  let s=`<g transform="translate(${F(x)} ${F(y)}) scale(${F(sc)})" filter="url(#ink-shadow)">`;
  for(let i=Math.min(n,11)-1;i>=0;i--){const row=i<6?0:1,col=i<6?i:i-6,px=-200+col*80+(row?40:0),py=row?-96:-132,sh=row?'#d9a35f':'#c58f4d';s+=`<g transform="translate(${px} ${py})"><rect x="-28" y="-60" width="56" height="130" rx="10" fill="${sh}" ${ink(6)}/><rect x="-28" y="-16" width="56" height="26" fill="#e8453c" ${ink(4)}/></g>`;}
  s+=`<path d="M-270 -60H270L240 70H-240Z" fill="#c9955a" ${ink(9)}/><path d="M-270 -60H270L262 -34H-262Z" fill="#dcae78"/><text y="30" text-anchor="middle" ${FA} font-size="46" fill="#5a3a1c">PAÇOCA  R$ 3</text></g>`;
  return s;
 };
 const QRDESENHO=(x,y,sc,rot=0)=>{
  let s=`<g transform="translate(${F(x)} ${F(y)}) rotate(${F(rot)}) scale(${F(sc)})" filter="url(#ink-shadow)"><rect x="-210" y="-250" width="420" height="500" rx="10" fill="#c9955a" ${ink(8)}/><rect x="-170" y="-210" width="340" height="340" fill="#f1e4c8" ${ink(5)}/>`;
  const cell=(i,j)=>(i*7+j*13+i*j)%5<2;
  for(let i=0;i<9;i++)for(let j=0;j<9;j++)if(cell(i,j)||(i<3&&j<3)||(i>5&&j<3)||(i<3&&j>5))s+=`<rect x="${-160+i*36+((j*3)%5-2)}" y="${-200+j*36+((i*5)%5-2)}" width="31" height="31" fill="#26263a" opacity=".9"/>`;
  s+=`<text y="215" text-anchor="middle" ${FONTEH} font-size="66" letter-spacing="4" fill="#30233f">PIX</text><path d="M-120 168Q0 154 120 170" stroke="#30233f" stroke-width="5" fill="none"/></g>`;
  return s;
 };
 const CORACAO=(x,y,sc,c='#e8453c')=>`<g transform="translate(${x} ${y}) scale(${sc})"><path d="M0 34C-72 -12 -50 -58 0 -26C50 -58 72 -12 0 34Z" fill="${c}" ${ink(6)}/></g>`;
 const PESSOA=(x,y,sc)=>`<g transform="translate(${x} ${y}) scale(${sc})"><circle cy="-22" r="22" fill="#7ec8e3" ${ink(6)}/><path d="M-40 40Q-38 0 0 0Q38 0 40 40Z" fill="#7ec8e3" ${ink(6)}/><path d="M58 -20V20M38 0H78" stroke="${INK}" stroke-width="10" stroke-linecap="round"/></g>`;
 const COMPART=(x,y,sc)=>`<g transform="translate(${x} ${y}) scale(${sc})"><path d="M-40 10L40 -30V-12L10 10 40 32V50Z" fill="#c79bf2" ${ink(6)}/></g>`;
 function cartao(cx,cy,w,h,txt,tam,rot,t0,t,cor='#30233f',tc=CREAM,ic=null){
  const a=pop(t,t0,.28); if(a<=0)return '';
  return `<g transform="translate(${cx} ${cy}) rotate(${rot}) scale(${F(a)})" filter="url(#ink-shadow)"><rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" rx="16" fill="${cor}" stroke="#ffe7c2" stroke-width="6"/>${ic?ic(-w/2+95,0):''}<text x="${ic?60:0}" y="${tam*.36}" text-anchor="middle" ${FONTEH} font-size="${tam}" letter-spacing="2" fill="${tc}" ${txt.length*tam*.62>w-(ic?260:80)?`textLength="${w-(ic?260:80)}" lengthAdjust="spacingAndGlyphs"`:''}>${txt}</text></g>`;
 }

 // ----- saldo e HUD -----
 const T_GASTA=WI(2,'gastei')+.9;
 const VENDAS=[WI(4,'vendi')+.5,35.6,36.7,37.8,38.9];       // R$ 3 cada
 const MORDIDAS=[WI(4,'comi'),WI(5,'provei'),36.15,37.25,38.35];
 const saldo=t=>13.2*(1-fit(t,T_GASTA,T_GASTA+.6))+VENDAS.reduce((s,v)=>s+3*fit(t,v,v+.3),0);
 const pacocas=t=>11-VENDAS.filter(v=>t>=v).length-MORDIDAS.filter(v=>t>=v+.25).length;
 function hud4(t){
  const v=saldo(t), w=Math.max(10,792*v/449.9), flash=Math.max(bell(t,T_GASTA,T_GASTA+.9),...VENDAS.map(x=>bell(t,x,x+.6)));
  let s=`<g transform="translate(250 56)"><rect x="0" y="0" width="580" height="96" rx="12" fill="#30233f" stroke="#ffe7c2" stroke-width="5"/><text x="290" y="66" text-anchor="middle" ${FONTEH} font-size="54" letter-spacing="5" fill="${CREAM}">GTA 6 EM 3 DIAS</text></g>`;
  s+=`<g transform="translate(540 1655) scale(${F(1+flash*.06)}) translate(-540 -1655)"><g transform="translate(100 1580)"><rect x="0" y="0" width="880" height="150" rx="12" fill="#30233f" stroke="${flash>.05?'#ffd23f':'#ffe7c2'}" stroke-width="5"/><text x="440" y="70" text-anchor="middle" ${FONTEH} font-size="58" letter-spacing="3" fill="${flash>.05?'#ffd23f':CREAM}">${reais(v)} DE R$ 449,90</text><rect x="44" y="100" width="792" height="22" rx="11" fill="#fff3d3" opacity=".22"/><rect x="44" y="100" width="${F(w)}" height="22" rx="11" fill="#ff8fb3"/></g></g>`;
  return s;
 }

 // ----- cenários -----
 function mercadinho(t){
  let s=`<rect width="1080" height="1920" fill="#8fc7b5"/><rect width="1080" height="1920" fill="url(#dots)" opacity=".10"/><rect width="1080" height="1920" fill="url(#paper)" opacity=".35"/>`;
  s+=`<rect x="60" y="250" width="960" height="150" rx="14" fill="#e8453c" ${ink(8)}/><text x="540" y="356" text-anchor="middle" ${FONTEH} font-size="104" letter-spacing="8" fill="#fff3d3">MERCADINHO</text>`;
  for(let r=0;r<3;r++)for(let c=0;c<6;c++){const cols=['#ffd23f','#7ec8e3','#ff8fb3','#9fd9a4','#c79bf2','#ffb872'];s+=`<rect x="${100+c*150}" y="${470+r*190}" width="110" height="${130+((r+c)%3)*20}" rx="10" fill="${cols[(r*2+c)%6]}" ${ink(6)}/>`;}
  s+=`<rect x="60" y="640" width="960" height="14" fill="#6a5238" ${ink(5)}/><rect x="60" y="830" width="960" height="14" fill="#6a5238" ${ink(5)}/><rect x="60" y="1020" width="960" height="14" fill="#6a5238" ${ink(5)}/>`;
  s+=`<path d="M0 1450H1080V1920H0Z" fill="#d8c4a8" ${ink(8)}/>`;
  // balcão e caixa registradora
  s+=`<rect x="440" y="1230" width="640" height="300" fill="#a8744a" ${ink(9)}/><rect x="440" y="1210" width="640" height="40" fill="#c99565" ${ink(8)}/>`;
  s+=`<g transform="translate(900 1120)"><rect x="-90" y="-20" width="180" height="90" rx="10" fill="#4a4a5e" ${ink(8)}/><rect x="-70" y="-90" width="140" height="70" rx="8" fill="#9fd9a4" ${ink(7)}/><text y="-36" text-anchor="middle" ${FONTEH} font-size="40" fill="${INK}">13,20</text></g>`;
  return s;
 }
 function rua(t){
  let s=`<rect width="1080" height="1920" fill="url(#vice-sunset)"/><rect width="1080" height="1920" fill="url(#dots)" opacity=".10"/><rect width="1080" height="1920" fill="url(#paper)" opacity=".35"/>`;
  s+=`<g opacity=".95"><rect x="-30" y="420" width="470" height="1080" fill="#cdbbf3" ${ink(8)}/><rect x="460" y="560" width="380" height="940" fill="#f0c7d6" ${ink(8)}/><rect x="860" y="380" width="260" height="1120" fill="#bfd7f2" ${ink(8)}/>`;
  for(let r=0;r<4;r++){for(const x of[80,250])s+=`<rect x="${x}" y="${500+r*220}" width="110" height="140" fill="#fff3d3" ${ink(6)}/>`;s+=`<rect x="${520+(r%2)*130}" y="${640+r*190}" width="110" height="130" fill="#fff3d3" ${ink(6)}/>`;}
  s+=`</g><path d="M0 1450H1080V1920H0Z" fill="#d9c7b5" ${ink(8)}/>`;
  for(let i=-3;i<10;i++)s+=`<path d="M${i*150} 1450L${i*260-340} 1920" stroke="#a48ab8" stroke-width="3" opacity=".45"/>`;
  return s;
 }
 function cama(x,y,w=900){return `<g transform="translate(${x} ${y})"><rect x="${-w/2}" y="40" width="${w}" height="90" fill="#6a5238" ${ink(8)}/><rect x="${-w/2}" y="-30" width="${w}" height="90" rx="30" fill="#7a6aa8" ${ink(9)}/><path d="M${-w/2+60} -10H${w/2-60}" stroke="#9a8ac8" stroke-width="10" stroke-linecap="round"/><rect x="${-w/2+20}" y="-80" width="190" height="60" rx="26" fill="#fff3d3" ${ink(7)}/></g>`;}
 // controle tunado pelo Jão: acelerador de moto no lugar do analógico, chamas, espelhinho e buzininha
 function controleTunado(x,y,sc,rot,o={}){
  const g=o.giro||0, vib=o.vib?Math.sin(clock*80)*3:0;
  let s=`<g transform="translate(${F(+x+vib)} ${F(y)}) rotate(${F(rot)}) scale(${F(sc)})" filter="url(#ink-shadow)">`;
  s+=`<path d="M-190 -50Q-200 -120 -130 -126H130Q200 -120 190 -50L206 96Q214 170 148 160Q104 150 84 96H-84Q-104 150 -148 160Q-214 170 -206 96Z" fill="#e6e6f0" ${ink(9)}/>`;
  s+=`<path d="M-200 60Q-150 20 -170 -40Q-120 -10 -130 -70Q-90 -40 -80 -100Q-60 -50 -30 -40L-60 100Q-150 130 -200 60Z" fill="#ff7a2a" ${ink(5)}/><path d="M-170 70Q-140 30 -150 -10Q-110 20 -110 50Z" fill="#ffd23f"/>`;
  s+=`<path d="M130 -126L196 -126L196 -90" fill="none" stroke="#ff7a2a" stroke-width="10"/><path d="M110 -40Q150 -90 190 -40Q150 -14 110 -40Z" fill="#ffd23f" ${ink(5)}/>`;
  for(const [bx,by] of[[110,-70],[150,-40],[70,-40],[110,-10]])s+=`<circle cx="${bx}" cy="${by}" r="17" fill="#bfc1d6" ${ink(4)}/>`;
  s+=`<circle cx="62" cy="52" r="34" fill="#5a5f7a" ${ink(7)}/>`;
  // acelerador de moto no lugar do analógico esquerdo (cabo preto com manopla, gira)
  s+=`<g transform="translate(-62 52) rotate(${F(g)})"><rect x="-70" y="-17" width="140" height="34" rx="17" fill="#25252f" ${ink(6)}/><rect x="-6" y="-17" width="64" height="34" rx="14" fill="#ff7a2a" ${ink(5)}/><path d="M16 -14V14M30 -14V14M44 -14V14" stroke="#25252f" stroke-width="4"/></g>`;
  // espelhinho e buzininha
  s+=`<path d="M-150 -126V-176" stroke="${INK}" stroke-width="10"/><ellipse cx="-150" cy="-196" rx="36" ry="26" fill="#bfe6f2" ${ink(7)}/><path d="M-165 -204Q-150 -214 -134 -204" stroke="#fff" stroke-width="5" fill="none"/>`;
  s+=`<path d="M130 -126V-150" stroke="${INK}" stroke-width="10"/><path d="M110 -150H190L170 -196H130Z" fill="#ffd23f" ${ink(6)}/><circle cx="196" cy="-170" r="10" fill="#ffd23f" ${ink(5)}/>`;
  return s+'</g>';
 }
 function bilhete(x,y,sc,rot){return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${sc})" filter="url(#ink-shadow)"><rect x="-150" y="-80" width="300" height="160" rx="6" fill="#fff6c8" ${ink(7)}/><text y="-12" text-anchor="middle" ${FONTEH} font-size="52" fill="#c93a3a">TÁ TUNADO.</text><text y="52" text-anchor="middle" ${FONTEH} font-size="48" fill="${INK}">— JÃO</text></g>`;}
 function fumaca(x,y,t,k=1){let s='';for(let i=0;i<6;i++){const u=((t*1.2+i*.17)%1),r=(26+u*60)*k;s+=`<circle cx="${F(x+Math.sin(i*2+u*5)*30*k)}" cy="${F(y-u*260*k)}" r="${F(r)}" fill="#cfcfda" opacity="${F((1-u)*.7)}"/>`;}return s;}
 function tv4(x,y,sc,u){          // jogo de futebol genérico (nosso): o jogador do Kauã corre para a direita e sai do campo
  const run=fit(u,.9,2.3);
  let s=`<g transform="translate(${x} ${y}) scale(${sc})"><rect x="-400" y="-230" width="800" height="460" rx="20" fill="#232338" ${ink(10)}/><rect x="-370" y="-200" width="740" height="400" fill="#4caf63"/>`;
  for(let i=0;i<6;i++)s+=`<rect x="${-370+i*123}" y="-200" width="62" height="400" fill="#58c070" opacity=".6"/>`;
  s+=`<rect x="-370" y="-200" width="740" height="400" fill="none" stroke="#fff" stroke-width="5"/><path d="M0 -200V200" stroke="#fff" stroke-width="5"/><circle r="60" fill="none" stroke="#fff" stroke-width="5"/>`;
  for(const [px,py,c] of [[-160,-100,'#e8453c'],[-60,60,'#e8453c'],[140,-40,'#4a7cd8'],[200,100,'#4a7cd8']])s+=`<circle cx="${px}" cy="${py}" r="16" fill="${c}" ${ink(4)}/>`;
  const jx=-80+run*520, jy=10+Math.sin(u*9)*5;
  s+=`<circle cx="${F(jx)}" cy="${F(jy)}" r="18" fill="#ffd23f" ${ink(5)}/><circle cx="${F(jx+22)}" cy="${F(jy+4)}" r="9" fill="#fff" ${ink(3)}/>`;
  return s+'</g>';
 }
 const celular=(x,y,sc,rot=0)=>`<g transform="translate(${x} ${y}) rotate(${rot}) scale(${sc})" filter="url(#ink-shadow)"><rect x="-210" y="-380" width="420" height="760" rx="52" fill="#25252f" ${ink(10)}/><rect x="-182" y="-340" width="364" height="680" rx="30" fill="#f5efe4"/>`;

 // ===== cenas =====
 const rosa=t=>`<rect width="1080" height="1920" fill="url(#vice-rim)"/><rect width="1080" height="1920" fill="url(#dots)" opacity=".16"/>`;
 function abertura(t){            // 0–9,7: já com a barra e o relógio; a caixa com uma paçoca mordida; no "treze reais" mostra as notas
  const f1=FN(1).palavras, tTreze=(f1.find(p=>p[0].startsWith('treze'))||f1.at(-2))[1]-.1, tJogo=WI(1,'jogo.');
  const ab=fit(t,tTreze,tTreze+.4);
  let s=rosa(t)+`<g transform="translate(540 600) scale(2.2)"><polygon points="${Array.from({length:22},(_,i)=>{const a=i*Math.PI/11,r0=i%2?200:360;return F(Math.cos(a)*r0)+','+F(Math.sin(a)*r0);}).join(' ')}" fill="url(#vice-sunset)" opacity=".5"/></g>`;
  s+=rosto(t<tJogo?'cansado':(t<tTreze?'preocupado':'envergonhado'),{look:[0,3],mouth:boca(t)});
  s+=CAIXA(330,1400,.95,11)+PACOCA(150,1210,.9,-24,1);
  const big=pop(t,0.0,.25), bigOut=fit(t,2.2,2.7);   // "3" grande de abertura, encolhe e some (o HUD do topo fica)
  if(t<2.7) s+=`<g opacity="${F(big*(1-bigOut))}" transform="translate(860 470) scale(${F(.6+.4*big)})"><text x="0" y="0" text-anchor="middle" ${FONTEH} font-size="420" fill="#ffe7c2" stroke="#30233f" stroke-width="18" paint-order="stroke">3</text></g>`;
  s+=`<g transform="translate(790 1300) rotate(10) scale(${F(.3+.7*ab)})" opacity="${F(ab)}"><path d="M-130 20Q-140 -40 -80 -60Q-20 -80 60 -60Q140 -40 140 20Q150 90 90 120Q10 140 -80 110Q-130 90 -130 20Z" fill="${DK.skin}" ${ink(9)}/>${NOTA(-20,-30,-8,.55,'10')}${NOTA(40,0,10,.5,'2')}${MOEDA(-70,50,24)}${MOEDA(-20,66,22)}${MOEDA(30,62,22)}</g>`;
  return s;
 }
 function mercado(t){             // 9,7–17,5: paga tudo, leva a caixa e começa a comer
  const tPaga=T_GASTA-.4, tSai=WI(2,'vender'), tComo=WI(2,'como'), caixaPos=fit(t,T_GASTA+.1,T_GASTA+.7);
  const bite=bell(t,tComo,tComo+.5)+bell(t,tComo+1.0,tComo+1.5);
  let s=mercadinho(t);
  const nx=F(300+360*(1-fit(t,tPaga,tPaga+.5))), ny=F(1190-60*(1-fit(t,tPaga,tPaga+.5)));
  if(t>=tPaga-.3&&t<T_GASTA+.4)s+=NOTA(nx,ny,-6,.9,'10')+(t>tPaga+.3?NOTA(F(+nx+60),F(+ny+30),8,.7,'2'):'');
  s+=CAIXA(F(760-460*caixaPos),F(1180+120*caixaPos),1.0*(1+.15*caixaPos),11);
  s+=kau(t,{expr:t<tSai?'feliz':(t<tComo?'neutro':'rindo'),look:[6,0],head:-2+bite*5,armR:t>=tComo?[-60,-95]:[30,40],frente:t>=tComo?'R':null},260,1650,1.25);
  if(t>=tComo)s+=PACOCA(F(330),F(1010+bite*20),.8,-20,t>tComo+.4?1:0);
  return s;
 }
 function onze(t){                // 17,5–21,8: onze paçocas, saldo zero
  const a=pop(t,WI(3,'onze'),.3), z=pop(t,WI(3,'saldo:'),.3);
  let s=rua(t)+cartao(540,430,520,200,'11 PAÇOCAS',90,-2,17.7,t,'#2f7f8a');
  s+=cartao(540,700,520,150,'SALDO: ZERO',78,2,WI(3,'saldo:'),t,'#e86a5c');
  s+=CAIXA(720,1330,1.1,11);
  s+=kau(t,{expr:t<WI(3,'saldo:')?'feliz':'cansado',look:[6,0],head:Math.sin(t*3)*2,armR:[40,40]},260,1650,1.25);
  return s;
 }
 function venda1(t){              // 21,8–25,2: a senhora paga R$ 3; assim que vira as costas, ele come uma
  const tPaga=VENDAS[0]-.35, tComi=MORDIDAS[0], saiu=fit(t,tPaga+.9,tPaga+2.4);
  let s=rua(t)+CAIXA(530,1330,1.0,t<VENDAS[0]?11:10);
  s+=ator(SENHORA,{expr:'feliz',look:[-6,0],head:2,armL:[-9,-5],armR:[t<tPaga+.5?[40,40][0]:20,t<tPaga+.5?40:50]},F(850+saiu*520),1650,1.2);
  if(t>tPaga&&t<VENDAS[0]+.3)s+=MOEDA(F(760-230*fit(t,tPaga,VENDAS[0])),F(1250),30)+NOTA(F(780-250*fit(t,tPaga,VENDAS[0])),1330,-8,.55,'3');
  const comendo=t>=tComi;
  s+=kau(t,{expr:comendo?'rindo':'feliz',look:[comendo?0:8,0],head:comendo?Math.sin(t*20)*2:0,armR:comendo?[-60,-95]:[30,40],frente:comendo?'R':null},260,1650,1.25);
  if(comendo)s+=PACOCA(330,1010,.8,-20,t>tComi+.3?1:0);
  s+=cartao(540,420,640,150,'VENDI UMA.',84,-2,WI(4,'vendi'),t,'#2f7f8a')+(t>=tComi?cartao(540,630,640,150,'COMI UMA.',84,2,tComi,t,'#e86a5c'):'');
  return s;
 }
 function crianca(t){             // 25,2–29,3: a criança quer provar; ele olha para a mãe, que nega; então "prova por ela"
  const tProv=WI(5,'provar.'), tProvei=WI(5,'provei'), comendo=t>=tProvei;
  let s=rua(t)+CAIXA(530,1330,1.0,t<tProvei+.3?9:8);
  const nega=Math.sin(t*14)*10*bell(t,tProv+.3,tProvei-.2);
  s+=ator(MAE,{expr:t<tProvei?'bravo':'forcado',look:[-6,0],head:nega,armL:[-9,-5],armR:[9,5]},F(950),1650,1.2);
  s+=ator(CRIANCA,{expr:comendo?'triste':'feliz',look:[-6,0],head:2,armL:[-30,-100],armR:[9,5]},F(760),1650,1.15);
  s+=kau(t,{expr:comendo?'rindo':'neutro',look:[comendo?0:(t>tProv?8:4),0],head:comendo?Math.sin(t*20)*2:0,armR:comendo?[-60,-95]:[30,40],frente:comendo?'R':null},260,1650,1.25);
  if(comendo)s+=PACOCA(330,1010,.8,-20,t>tProvei+.3?1:0);
  s+=cartao(540,420,760,150,'PROVEI POR ELA.',78,-2,tProvei,t,'#2f7f8a');
  return s;
 }
 function pix(t){                 // 29,3–35,0: o QR code é um desenho a caneta num papelão
  const tPix=WI(6,'pix.'), tDes=WI(6,'desenho.'), falha=t>=tPix+1.4, sai=fit(t,tDes+.2,tDes+1.6);
  let s=rua(t)+CAIXA(560,1360,.8,8);
  s+=QRDESENHO(520,1090,.95,-3);
  s+=ator(CLIENTE,{expr:t<tDes?'neutro':'bravo',look:[-8,0],head:2,propR:'phone',armR:[-62,-70],armL:[-9,-5]},F(860+sai*480),1650,1.2);
  if(falha&&t<tDes+.6)s+=`<g transform="translate(700 800) scale(${F(pop(t,tPix+1.4,.2))})"><circle r="70" fill="#e8453c" ${ink(8)}/><path d="M-30 -30L30 30M30 -30L-30 30" stroke="#fff" stroke-width="16" stroke-linecap="round"/></g>`;
  s+=kau(t,{expr:t<tDes?'forcado':'envergonhado',look:[8,0],head:-2,armL:[-9,-5],armR:[30,40]},260,1650,1.25);
  s+=cartao(540,400,700,150,'QR CODE DE DESENHO',64,-2,tDes-.7,t,'#e86a5c');
  return s;
 }
 function montagem(t){            // 35,0–41,0: cinco vendidas, cinco comidas, a barra pula até R$ 15
  const v=VENDAS.filter(x=>t>=x).length, m=MORDIDAS.filter(x=>t>=x+.25).length, ult=Math.max(...VENDAS.filter(x=>t>=x),-9), ultM=Math.max(...MORDIDAS.filter(x=>t>=x),-9);
  let s=rua(t)+CAIXA(740,1330,1.0,Math.max(1,pacocas(t)));
  const contador=(cx,rot,rot0,lab,num,cor,pulso)=>`<g transform="translate(${cx} 450) rotate(${rot})" filter="url(#ink-shadow)"><rect x="-210" y="-150" width="420" height="300" rx="16" fill="${cor}" stroke="#ffe7c2" stroke-width="6"/><text y="-70" text-anchor="middle" ${FONTEH} font-size="56" letter-spacing="3" fill="${CREAM}">${lab}</text><text y="90" text-anchor="middle" ${FONTEH} font-size="170" fill="#fff3d3" stroke="${INK}" stroke-width="10" paint-order="stroke fill" transform="scale(${F(1+pulso*.25)})">${num}</text></g>`;
  s+=contador(290,-3,0,'VENDIDAS',v,'#2f7f8a',bell(t,ult,ult+.3))+contador(790,3,0,'COMIDAS',m,'#e86a5c',bell(t,ultM+.25,ultM+.55));
  const comendo=MORDIDAS.some(x=>t>=x&&t<x+.6);
  s+=kau(t,{expr:comendo?'rindo':'feliz',look:[0,2],head:comendo?Math.sin(t*20)*2:0,armR:comendo?[-60,-95]:[30,40],frente:comendo?'R':null},300,1650,1.25);
  if(comendo)s+=PACOCA(370,1010,.8,-20,1);
  for(let i=0;i<VENDAS.length;i++){const u=t-VENDAS[i];if(i&&u>0&&u<.7)s+=`<g transform="translate(${F(820-u*200)} ${F(1250-u*500)})" opacity="${F(1-u/.7)}">${MOEDA(0,0,34)}<text y="12" text-anchor="middle" ${FONTEH} font-size="34" fill="${INK}">3</text></g>`;}
  return s;
 }
 function casa(t){                // 41,0–49,5: em casa, a caixa quase vazia e o controle tunado pelo Jão
  const tJ=WI(8,'jão'), tAc=WI(8,'acelerador'), tGas=WI(8,'cheira'), olha=fit(t,tJ,tJ+.6);
  let s=quarto(t,true)+cama(640,1400,860);
  s+=controleTunado(F(600),F(1330),.95,-6,{giro:Math.sin(t*3)*14*fit(t,tAc,tAc+.5)});
  if(t>=tAc-.5)s+=bilhete(860,1080,.8*fit(t,tAc-.5,tAc),7);
  if(t>=tGas){for(let i=0;i<3;i++){const u=((t-tGas)*.9+i*.33)%1;s+=`<path d="M${F(560+i*70)} ${F(1180-u*160)}q20 -30 0 -60t0 -60" stroke="#b8d84a" stroke-width="10" fill="none" stroke-linecap="round" opacity="${F(1-u)}"/>`;}}
  s+=CAIXA(930,1310,.5,1);
  const en=fit(t,41.2,42.4);
  s+=kau(t,{expr:t<tAc?'cansado':'surpreso',look:[8,2],head:-3,armL:[-9,-5],armR:[30,40]},F(-100+en*350),1650,1.25);
  return s;
 }
 function acelerador(t){          // 49,5–55,3: gira o acelerador; o controle vibra e solta fumaça; o jogador sai do campo
  const u=t-49.5, gira=fit(u,.9,1.6), vibra=u>1.0&&u<3.0, fim=fit(u,3.6,4.2);
  let s=quarto(t,true)+tv4(540,640,.85,u)+cama(540,1450,1000);
  s+=kau(t,{expr:u<3.5?'surpreso':'feliz',sentado:true,look:[u<2.5?0:-6,-4],head:2,armL:[-40,-10],armR:[40,-10]},F(300),1660,1.15);
  s+=controleTunado(F(560),F(1390),.8,-8,{giro:gira*-70+Math.sin(u*40)*8*(vibra?1:0),vib:vibra});
  if(u>1.0&&u<4.5)s+=fumaca(600,1280,t);
  if(u>2.2&&u<3.1)s+=`<g transform="translate(540 380) rotate(-6) scale(${F(pop(t,51.7,.2))})"><polygon points="0,-110 30,-44 100,-60 58,0 104,54 32,46 0,112 -32,46 -104,54 -58,0 -100,-60 -30,-44" fill="#ffd23f" ${ink(8)}/><text y="20" text-anchor="middle" ${FONTEH} font-size="52" fill="#e8453c" stroke="${INK}" stroke-width="5" paint-order="stroke fill">VRUUM!</text></g>`;
  return s;
 }
 function conta(t){               // 55,3–65,5: conta as moedas; lucro de R$ 1,80
  const tQ=WI(9,'quinze'), tM=WI(9,'menos'), tL=WI(9,'lucro:'), tA=WI(9,'arredondando,');
  let s=quarto(t,true)+cama(540,1450,1000);
  s+=`<g transform="translate(540 640) rotate(-2)" filter="url(#ink-shadow)"><rect x="-400" y="-260" width="800" height="520" rx="16" fill="#fff6c8" ${ink(10)}/><path d="M-360 -150H360M-360 -30H360M-360 100H360" stroke="#c9b97a" stroke-width="4"/>`;
  s+=`<text x="-300" y="-80" ${FONTEH} font-size="90" fill="${INK}" opacity="${F(pop(t,tQ,.2))}">  15,00</text><text x="-300" y="40" ${FONTEH} font-size="90" fill="#c93a3a" opacity="${F(pop(t,tM,.2))}">− 13,20</text>`;
  s+=`<text x="-340" y="190" ${FONTEH} font-size="74" textLength="640" lengthAdjust="spacingAndGlyphs" fill="#2f7f8a" opacity="${F(pop(t,tL,.25))}">LUCRO: R$ 1,80</text>`;
  if(t>=tA)s+=`<g transform="translate(300 -250) rotate(-6) scale(${F(pop(t,tA,.2))})"><ellipse rx="130" ry="64" fill="none" stroke="#e8453c" stroke-width="10"/><text y="22" text-anchor="middle" ${FONTEH} font-size="60" fill="#e8453c">≈ R$ 2</text></g>`;
  s+=`</g>`;
  // moedas e notas na cama, contadas uma por uma
  for(let i=0;i<8;i++){const u=fit(t,57.0+i*.7,57.4+i*.7);s+=MOEDA(F(120+i*95),F(1385-Math.sin(u*Math.PI)*60),34*(.9+.1*u));}
  s+=NOTA(780,1340,-6,.8,'10')+NOTA(880,1370,8,.7,'5');
  s+=kau(t,{expr:t<tL?'cansado':(t<tA?'neutro':'feliz'),sentado:true,look:[0,5],head:-3,armL:[-40,-10],armR:[40,-10]},F(260),1660,1.15);
  return s;
 }
 function pedido(t){              // 65,5–77,0: Kauã olha para a câmera; os três valores, um por vez, cada um com seu ícone
  const t1=WI(10,'curtida'), t2=WI(10,'seguidor,'), t3=WI(10,'compartilhamento.');
  let s=rosa(t);
  s+=ator(DK,{expr:t<t1?'neutro':'feliz',look:[0,2],head:Math.sin(t*2.4)*2,mouth:boca(t)},540,2110,2.0);
  s+=cartao(540,270,860,170,'CURTIDA = R$ 1',80,-2,t1-.2,t,'#e86a5c',(x,y)=>CORACAO(x,y,1.3));
  s+=cartao(540,470,860,170,'SEGUIDOR = R$ 5',80,2,t2-.2,t,'#2f7f8a',(x,y)=>PESSOA(x,y+10,1.3));
  s+=cartao(540,670,860,170,'COMPARTILHAR = R$ 15',66,-2,t3-.9,t,'#7a5ab8',(x,y)=>COMPART(x,y,1.4));
  return s;
 }
 function placar(t){              // 77,0–84,0: o celular com o placar de ajuda zerado
  const a=out((t-77.2)/.4);
  let s=`<rect width="1080" height="1920" fill="#2a2140"/><rect width="1080" height="1920" fill="url(#dots)" opacity=".10"/>`;
  s+=`<g transform="translate(${F(540+(1-a)*1200)} 800) scale(1.6)">`+celular(0,0,1,0).replace('</g>','')+`<rect x="-182" y="-340" width="364" height="110" rx="30" fill="#5a43a0"/><text y="-266" text-anchor="middle" ${FONTEH} font-size="40" letter-spacing="1" fill="${CREAM}" textLength="320" lengthAdjust="spacingAndGlyphs">PLACAR DE AJUDA</text>`;
  s+=CORACAO(-110,-150,1.1)+`<text x="10" y="-130" ${FONTEH} font-size="86" fill="${INK}">0</text>`;
  s+=PESSOA(-110,10,1.0)+`<text x="10" y="42" ${FONTEH} font-size="86" fill="${INK}">0</text>`;
  s+=COMPART(-110,160,1.2)+`<text x="10" y="190" ${FONTEH} font-size="86" fill="${INK}">0</text>`;
  s+=`<rect x="-150" y="250" width="300" height="76" rx="14" fill="#30233f"/><text y="306" text-anchor="middle" ${FONTEH} font-size="62" fill="#ffd23f">R$ 0</text></g></g>`;
  return s;
 }
 function vocesDecidem(t){        // 84,0–93,0: deitado com a última paçoca e o controle tunado ao lado
  const tFim=90.9, come=t>=tFim, ok=t>=92.1;
  let s=quarto(t,true)+cama(540,1450,1000);
  s+=controleTunado(790,1370,.8,6,{});
  s+=kau(t,{expr:come?'rindo':'cansado',sentado:true,lean:-12,look:[0,3],head:come?Math.sin(t*20)*2:-3,armL:[-40,-10],armR:come?[-60,-95]:[40,-10],frente:come?'R':null},F(300),1660,1.15);
  s+=PACOCA(come?370:230,come?1130:1380,.85,come?-20:-10,come?1:0);
  if(ok)s+=balao(560,780,['👌'],400,1010,92.1,t,120);
  s+=`<g transform="translate(540 560) rotate(-2) scale(${F(fit(t,WI(12,'comentário')-.2,WI(12,'comentário')+.4))})" filter="url(#ink-shadow)"><rect x="-470" y="-130" width="940" height="260" rx="16" fill="#30233f" stroke="#ffe7c2" stroke-width="6"/><text y="-20" text-anchor="middle" ${FONTEH} font-size="74" fill="${CREAM}" textLength="860" lengthAdjust="spacingAndGlyphs">COMENTÁRIO MAIS CRIATIVO</text><text y="72" text-anchor="middle" ${FONTEH} font-size="74" fill="#ffd23f" textLength="860" lengthAdjust="spacingAndGlyphs">= O QUE O KAUÃ FAZ AMANHÃ</text></g>`;
  return s;
 }

 const PLANOS=[[0,9.7,'c'],[9.7,17.5,'c'],[17.5,21.8,'c'],[21.8,25.2,'c'],[25.2,29.3,'c'],[29.3,35.0,'c'],[35.0,41.0,'c'],[41.0,49.5,'c'],[49.5,55.3,'c'],[55.3,65.5,'ui'],[65.5,77.0,'ui'],[77.0,84.0,'ui'],[84.0,93.0,'c']];
 window.CUTS=[9.7,17.5,21.8,25.2,29.3,35.0,41.0,49.5,55.3,65.5,77.0,84.0,T_GASTA,...VENDAS,...MORDIDAS];
 window.HOLDS=[[55.3,65.5],[65.5,77.0],[77.0,84.0],[84.0,93.0]];
 function scene(t){
  let body;
  if(t<9.7)body=abertura(t);
  else if(t<17.5)body=mercado(t);
  else if(t<21.8)body=onze(t);
  else if(t<25.2)body=venda1(t);
  else if(t<29.3)body=crianca(t);
  else if(t<35.0)body=pix(t);
  else if(t<41.0)body=montagem(t);
  else if(t<49.5)body=casa(t);
  else if(t<55.3)body=acelerador(t);
  else if(t<65.5)body=conta(t);
  else if(t<77.0)body=pedido(t);
  else if(t<84.0)body=placar(t);
  else body=vocesDecidem(t);
  const pl=PLANOS.find(([a,b])=>t>=a&&t<b);
  if(pl&&pl[2]==='c'){const z=1.03+cl((t-pl[0])/(pl[1]-pl[0]))*.10, px=Math.sin(t*.9)*9, py=Math.cos(t*.7)*7;body=`<g transform="translate(${(540+px).toFixed(2)} ${(1000+py).toFixed(2)}) scale(${z.toFixed(5)}) translate(-540 -1000)">${body}</g>`;}
  return defs(t)+body+hud4(t);
 }

 async function renderFrame(t){clock=t;await document.fonts.ready;const s=`<svg xmlns="http://www.w3.org/2000/svg" width="${C.width}" height="${C.height}" viewBox="0 0 1080 1920">${scene(t)}</svg>`;const im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s);await im.decode();ctx.clearRect(0,0,C.width,C.height);ctx.drawImage(im,0,0,C.width,C.height);
  const suav=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
  const fala=DADOS.faixas.find(f=>t>=f.ini&&t<f.fim), l=DADOS.legendas.find(l=>t>=l.ini&&t<l.fim);
  if(fala){ctx.save();ctx.scale(C.width/1080,C.height/1920);ctx.globalAlpha=Math.min(suav((t-fala.ini)/.3),suav((fala.fim-t)/.3));ctx.fillStyle='#151a2a';ctx.strokeStyle='#fff3d3';ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(56,1458,968,102,12);ctx.fill();ctx.stroke();ctx.restore();}
  if(l){ctx.save();ctx.scale(C.width/1080,C.height/1920);ctx.font='900 64px Arial';ctx.textAlign='center';ctx.textBaseline='middle';if(ctx.measureText(l.texto).width>928)throw new Error('Legenda excede caixa: '+l.texto);ctx.globalAlpha=Math.min(suav((t-l.ini)/.12),suav((l.fim-t)/.12));ctx.fillStyle='#fff7df';ctx.fillText(l.texto,540,1509);ctx.restore();}
 }
 return {renderFrame,scene};
})();
window.HQ=HQ;window.renderFrame=HQ.renderFrame;window.FILM_DURATION=93.0;window.READY=true;
window.renderFrame(1);
