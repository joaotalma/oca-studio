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

 // ===== cenas =====
 function rosa(t,tituloCor=0){return `<rect width="1080" height="1920" fill="url(#vice-rim)"/><rect width="1080" height="1920" fill="url(#dots)" opacity=".16"/>`;}
 function gancho(t){
  const f1=FN(1).palavras, t0=f1.find(p=>p[0]==='quatro')[1]-.03, t1=f1.find(p=>p[0]==='E')[1]-.05, tv=f1.find(p=>p[0]==='vinte.')[1]-.45;
  let s=`<rect width="1080" height="1920" fill="url(#vice-rim)"/><rect width="1080" height="1920" fill="url(#dots)" opacity=".16"/>`;
  s+=`<g transform="translate(540 560) scale(2.2)"><polygon points="${Array.from({length:22},(_,i)=>{const a=i*Math.PI/11,r0=i%2?200:360;return F(Math.cos(a)*r0)+','+F(Math.sin(a)*r0);}).join(' ')}" fill="url(#vice-sunset)" opacity=".5"/></g>`;
  const ab=fit(t,tv,tv+.4);
  s+=rosto(t<tv?'cansado':'preocupado',{look:[t<tv?0:0,3]});
  s+=controle(300,1290,.95,-14,{luz:0});
  // mão aberta com as moedas
  const mx=760,my=1250;
  s+=`<g transform="translate(${mx} ${my}) rotate(10) scale(${F(.3+.7*ab)})" opacity="${F(ab)}"><path d="M-130 20Q-140 -40 -80 -60Q-20 -80 60 -60Q140 -40 140 20Q150 90 90 120Q10 140 -80 110Q-130 90 -130 20Z" fill="${DK.skin}" ${ink(9)}/><g transform="translate(-10 0)">${NOTA(-20,-30,-8,.55)}${MOEDA(-70,40,24)}${MOEDA(-20,56,24)}${MOEDA(30,40,24)}${MOEDA(70,10,16,'#e6c35c')}${MOEDA(86,48,16,'#e6c35c')}</g></g>`;
  if(t>t0&&t<t1+.3){const u=t-t0, saida=1-fit(t,t1,t1+.3), pulso=1+Math.sin(u*34)*.035;
   s+=`<g opacity="${F(saida)}"><g transform="translate(800 400) scale(${F(pulso*.78)}) translate(-800 -400)">${star(800,400,320,u,'4','DIAS')}</g></g>`;}
  return s;
 }
 function cartaoVoto(t){          // 6,0–8,6 s: o voto de ontem (sem número de votos, não há contagem)
  const a=out((t-6.0)/.3), b=out((t-6.25)/.3), pp=out((t-6.9)/.2);
  let s=rosa(t);
  s+=`<g transform="translate(${F(-1200*(1-a))} 0)"><g transform="translate(540 380) rotate(-3)"><rect x="-440" y="-120" width="880" height="240" rx="14" fill="#30233f" stroke="#ffe7c2" stroke-width="6"/><text y="60" text-anchor="middle" ${FONTEH} font-size="78" letter-spacing="2" fill="${CREAM}">ONTEM VOCÊS ESCOLHERAM</text></g></g>`;
  s+=`<g transform="translate(${F(1300*(1-b))} 0)"><g transform="translate(540 940) rotate(2)" filter="url(#ink-shadow)"><rect x="-450" y="-270" width="900" height="540" rx="26" fill="#2f7f8a" ${ink(12)}/><text y="40" text-anchor="middle" ${FONTEH} font-size="190" fill="#fff9e7" stroke="#183c44" stroke-width="14" paint-order="stroke fill">CADEIRA</text><g transform="translate(0 220) scale(.3)">${cadeira(0,0,1)}</g><text y="-190" text-anchor="middle" ${FONTEH} font-size="62" letter-spacing="8" fill="#eaffff">VENDER A</text></g></g>`;
  s+=`<g transform="translate(850 700) rotate(14) scale(${F(pp)})"><polygon points="0,-130 36,-52 120,-70 70,0 124,64 38,56 0,134 -38,56 -124,64 -70,0 -120,-70 -36,-52" fill="#ffd23f" ${ink(9)}/><text y="20" text-anchor="middle" ${FONTEH} font-size="60" fill="#e8453c" stroke="${INK}" stroke-width="6" paint-order="stroke fill">VENCEU!</text></g>`;
  return s;
 }
 function fotoCadeira(t){         // 8,6–12,2: ele fotografa a cadeira
  const fl=bell(t,10.5,10.75);
  let s=quarto(t,false)+cadeira(700,1580,1.55);
  s+=ator(DK,{expr:'forcado',look:[8,0],propR:'phone',armR:[-62,-70],armL:[-9,-5],head:-3},300,1640,1.2);
  if(fl>0)s+=`<rect width="1080" height="1920" fill="#fff" opacity="${F(fl*.8)}"/>`;
  return s;
 }
 function celularAnuncio(t){      // 12,2–15,7: anúncio e a resposta do Marcos
  const a=out((t-12.3)/.35), b=out((t-13.2)/.3), c=out((t-14.0)/.35);
  let s=`<rect width="1080" height="1920" fill="#2a2140"/><rect width="1080" height="1920" fill="url(#dots)" opacity=".10"/>`;
  s+=`<g transform="translate(60 190)"><rect width="960" height="1190" rx="46" fill="#f5efe4" ${ink(10)}/><rect width="960" height="130" rx="46" fill="#5a43a0" ${ink(10)}/><text x="480" y="88" text-anchor="middle" ${FONTEH} font-size="56" letter-spacing="3" fill="${CREAM}">ANUNCIAR</text></g>`;
  s+=`<g transform="translate(${F(540-(1-a)*1200)} 560)"><rect x="-410" y="-190" width="820" height="380" rx="28" fill="#cfe9ee" ${ink(9)}/><g transform="translate(-250 130)">${cadeira(0,0,.55)}</g><text x="-60" y="-84" ${FA} font-size="38" fill="${INK}">CADEIRA GAMER</text><text x="-60" y="-36" ${FA} font-size="22" fill="#6a5f80">Quem me vê sentado</text><text x="-60" y="-8" ${FA} font-size="22" fill="#6a5f80">sabe que eu sofro</text><text x="-60" y="96" ${FONTEH} font-size="110" fill="#c93a3a">R$ 150</text></g>`;
  s+=`<g transform="translate(${F(540+(1-b)*1200)} 1010)"><circle cx="-340" cy="0" r="52" fill="#3d6fb5" ${ink(6)}/><text x="-340" y="16" text-anchor="middle" ${FONTEH} font-size="48" fill="#fff">M</text><rect x="-270" y="-80" width="660" height="160" rx="30" fill="#ffd9b8" ${ink(7)}/><text x="-240" y="-20" ${FA} font-size="34" fill="#6a5f80">Marcos</text><text x="-240" y="36" ${FA} font-size="40" fill="${INK}">Tenho interesse!</text></g>`;
  s+=`<g transform="translate(${F(540+(1-c)*1200)} 1190)"><rect x="-270" y="-70" width="660" height="140" rx="30" fill="#ffd9b8" ${ink(7)}/><text x="-240" y="14" ${FA} font-size="40" fill="${INK}">Passo aí em 10 min.</text></g>`;
  return s;
 }
 const porta=(x,y,w,h)=>`<g transform="translate(${x} ${y})"><rect x="${-w/2-20}" y="${-h-20}" width="${w+40}" height="${h+20}" fill="#6a5238" ${ink(9)}/><rect x="${-w/2}" y="${-h}" width="${w}" height="${h}" fill="#fff0cf" ${ink(7)}/><circle cx="${w/2-30}" cy="${-h/2}" r="14" fill="#c9a94a" ${ink(4)}/></g>`;
 function campainha(t){           // 15,7–18,4
  const u=t-15.8, dd=out(u/.2), shake=Math.sin(t*70)*bell(t,15.8,16.6)*6;
  let s=quarto(t,false)+porta(850,1450,330,980);
  s+=ator(DK,{expr:'surpreso',look:[8,0]},380,1640,1.25);
  s+=`<g transform="translate(${F(700+shake)} 640) rotate(-10) scale(${F(dd)})"><polygon points="0,-130 36,-52 120,-70 70,0 124,64 38,56 0,134 -38,56 -124,64 -70,0 -120,-70 -36,-52" fill="#ffd23f" ${ink(9)}/><text y="22" text-anchor="middle" ${FONTEH} font-size="72" fill="#e8453c" stroke="${INK}" stroke-width="6" paint-order="stroke fill">DING-DONG</text></g>`;
  return s;
 }
 function marcosPorta(t){         // 18,4–23,6
  const a=out((t-18.4)/.5), f=1+cl((t-18.4)/5)*.05;
  let s=quarto(t,false);
  s+=`<g transform="translate(540 1500) scale(${f.toFixed(5)}) translate(-540 -1500)">`;
  s+=porta(700,1500,520,1180);
  s+=marc({expr:'feliz',look:[-8,0],armR:[20,50],armL:[-9,-5],propR:null,head:2},720+(1-a)*300,1650,1.3);
  s+=NOTA(560,1190,-6,1.0)+NOTA(620,1230,8,.9);
  s+=ator(DK,{expr:'forcado',look:[8,0],armL:[-30,-100],head:-3},230,1650,1.2);
  s+='</g>';
  s+=balao(700,300,['Só vou testar, tá?'],740,760,22.0,t,52);
  return s;
 }
 function etiqueta(t){            // 23,6–27,4: close no encosto, "LIMITE: 120 KG"
  const z=1+cl((t-23.6)/3.8)*.18, a=out((t-23.8)/.3);
  let s=quarto(t,false);
  s+=`<g transform="translate(540 1000) scale(${z.toFixed(5)}) translate(-540 -1000)">`;
  s+=`<path d="M200 300Q170 1200 230 1380H850Q910 1200 880 300Q540 220 200 300Z" fill="#e8453c" ${ink(12)}/><path d="M300 520L650 420M330 800L720 700" stroke="#ffe58a" stroke-width="22" stroke-linecap="round"/>`;
  s+=`<g transform="translate(540 1050) rotate(-4) scale(${F(a)})" filter="url(#ink-shadow)"><rect x="-280" y="-110" width="560" height="220" rx="10" fill="#fffaf0" ${ink(8)}/><text y="-30" text-anchor="middle" ${FA} font-size="44" fill="#6a5f80" letter-spacing="3">LIMITE</text><text y="76" text-anchor="middle" ${FONTEH} font-size="124" fill="#c93a3a">120 KG</text></g>`;
  s+='</g>';
  return s;
 }
 function kauaPreocupado(t){      // 27,4–31,4
  let s=rosa(t)+rosto(t<29.6?'preocupado':'envergonhado',{look:[t<29.6?10:-6,2],head:Math.sin(t*3)*2});
  const sx=out((t-28.5)/.3);
  s+=`<g transform="translate(300 600) scale(${F(sx)})"><path d="M0 -60Q40 0 28 40Q0 66 -28 40Q-40 0 0 -60Z" fill="#9fdcff" ${ink(6)}/></g>`;
  return s;
 }
 function cadeiraQuebra(t){       // 31,4–34,5: câmera lenta; ele senta de verdade, a cadeira cede e ele cai de costas
  const afunda=fit(t,31.45,32.5), crack=t>=32.6, k=out((t-32.6)/.55), e=t-32.6;
  const tremor=(e>0&&e<.9)?Math.sin(e*70)*14*(1-e/.9):0, tremorY=(e>0&&e<.9)?Math.cos(e*61)*11*(1-e/.9):0;
  let s=`<g transform="translate(${F(tremor)} ${F(tremorY)})">`+quarto(t,false);
  const gemido=t>32.0&&t<32.6?Math.sin(t*90)*3:0;
  if(!crack){
   const sx=540+gemido, hipY=1470+afunda*60;                   // quadril desce até o assento
   s+=cadeiraCosta(sx,1620,1.5);
   s+=cadeiraBase(sx,1620,1.5,0);
   s+=marc({expr:t<32.1?'feliz':'preocupado',sentado:true,look:[-2,0],head:0,armL:[-35,-10],armR:[35,10]},sx,1610,1.3,1.6,1.12);
   // assento sob o corpo (afunda)
   s+=`<rect x="${F(sx-240)}" y="${F(1515+afunda*40)}" width="480" height="64" rx="30" fill="#3a3a4a" ${ink(10)} opacity=".95"/>`;
  }else{
   const rod=[[-1,0],[1,0],[-.6,1],[.6,1]];
   rod.forEach(([d,j],i)=>{const rx=540+d*(180+k*400+i*50), ry=1640+k*20-j*26;s+=`<g transform="translate(${F(rx)} ${F(ry)}) rotate(${F(k*560*d)})"><circle r="40" fill="#25252f" ${ink(6)}/><circle r="14" fill="#c9c2a8"/></g>`;});
   s+=`<g transform="translate(540 1600) rotate(${F(-30*k)})">${cadeiraCosta(0,0,1.4)}</g>`;
   s+=`<g transform="translate(540 ${F(1500+k*130)}) rotate(${F(-48*k)}) translate(-540 -1500)">${ator(MARC,{expr:'surpreso',look:[0,-2],head:4,armL:[-85,-40],armR:[85,40],legL:[-40,-10],legR:[40,10]},540,1500,1.25)}</g>`;
   s+=`<g transform="translate(540 1620) rotate(${F(10*k)})"><rect x="-270" y="-30" width="540" height="80" rx="30" fill="#3a3a4a" ${ink(10)}/><path d="M-60 -30L-20 40M60 -30L100 30" stroke="#ffe58a" stroke-width="10"/></g>`;
   // lascas de madeira/plástico
   for(let i=0;i<9;i++){const an=i*.7+.3, d=120+k*480, px=540+Math.cos(an)*d*1.2, py=1400-Math.abs(Math.sin(an))*d*.9+k*k*320;s+=`<rect x="${F(px)}" y="${F(py)}" width="46" height="16" rx="5" fill="${i%2?'#e8453c':'#3a3a4a'}" ${ink(4)} transform="rotate(${F(k*400+i*40)} ${F(px)} ${F(py)})"/>`;}
  }
  s+='</g>';
  if(e>0&&e<1.4){
   const a=out(e/.1)*(1+.07*Math.sin(e*38)*Math.exp(-e*3)), fade=1-fit(e,1.0,1.4);
   s+=`<rect width="1080" height="1920" fill="#fff" opacity="${F(Math.max(0,1-e/.14)*.9)}"/>`;
   s+=`<g opacity="${F(fade)}" transform="translate(540 820) rotate(-7) scale(${F(a*2.7)})" filter="url(#ink-shadow)"><polygon points="0,-300 80,-110 270,-160 150,0 290,140 90,120 0,300 -90,120 -290,140 -150,0 -270,-160 -80,-110" fill="#ffd23f" ${ink(10)}/><polygon points="0,-300 80,-110 270,-160 150,0 290,140 90,120 0,300 -90,120 -290,140 -150,0 -270,-160 -80,-110" transform="scale(.74) rotate(9)" fill="#ff8f3a"/><text y="34" text-anchor="middle" ${FONTEH} font-size="150" fill="#e8453c" stroke="${INK}" stroke-width="9" paint-order="stroke fill">CRAAC!</text></g>`;
  }
  return s;
 }
 function aposEstrondo(t){        // 34,5–41,5: a mãe pergunta; o Kauã responde
  let s=quarto(t,false);
  s+=porta(930,1450,240,900);
  s+=marc({expr:'envergonhado',sentado:true,look:[-6,2],head:4,armL:[-40,-10],armR:[40,10]},640,1640,1.2);
  s+=`<g><path d="M360 1600Q540 1500 760 1600L800 1700H320Z" fill="#e8453c" ${ink(10)}/><path d="M420 1590L520 1540M600 1560L700 1590" stroke="#ffe58a" stroke-width="12" stroke-linecap="round"/><rect x="380" y="1690" width="420" height="70" rx="26" fill="#3a3a4a" ${ink(10)} transform="rotate(-6 590 1725)"/></g>`;
  s+=ator(DK,{expr:t<37.1?'surpreso':'forcado',look:[8,0],head:-3,armL:[-9,-5]},230,1650,1.2);
  s+=balao(600,300,['Kauã, que barulho','foi esse?!'],930,800,34.6,t,52);
  s+=balao(280,640,['Foi a cadeira, mãe!','Tá... se aposentando!'],230,1000,37.1,t,48);
  return s;
 }
 function semDinheiro(t){         // 41,5–48,6
  const sai=fit(t,43.6,46.2);
  let s=quarto(t,false);
  s+=`<g transform="translate(540 1640)"><path d="M-230 -30Q-120 -120 0 -90Q120 -120 230 -30L200 100H-200Z" fill="#e8453c" ${ink(10)} transform="rotate(-8)"/></g>`;
  s+=marc({expr:'triste',look:[-6,2],head:3,armL:[-9,-5],armR:[30,40]},780+sai*500,1650,1.3);
  s+=NOTA(640+sai*500,1180,-6,.9);
  s+=ator(DK,{expr:t<44?'cansado':'triste',look:[0,3],head:-3,propR:null,armR:[40,40]},260,1650,1.2);
  s+=`<g transform="translate(180 1250) rotate(10)"><circle r="40" fill="#25252f" ${ink(6)}/><circle r="14" fill="#c9c2a8"/></g>`;
  s+=balao(700,300,['Foi mal, patrão.','Mas não levo quebrada.'],760,900,41.8,t,50);
  return s;
 }
 function tvFutebol(t,u){         // jogo de futebol genérico (nosso); u = tempo desde o início da cena
  const gc=u>3.4, x=-340+0, run=Math.min(1,u/3.4);
  let s=`<g><rect x="-400" y="-230" width="800" height="460" rx="20" fill="#232338" ${ink(10)}/><rect x="-370" y="-200" width="740" height="400" fill="#4caf63"/>`;
  for(let i=0;i<6;i++)s+=`<rect x="${-370+i*123}" y="-200" width="62" height="400" fill="#58c070" opacity=".6"/>`;
  s+=`<rect x="-370" y="-200" width="740" height="400" fill="none" stroke="#fff" stroke-width="5"/><path d="M0 -200V200" stroke="#fff" stroke-width="5"/><circle r="60" fill="none" stroke="#fff" stroke-width="5"/><rect x="-370" y="-70" width="70" height="140" fill="none" stroke="#fff" stroke-width="5"/><rect x="300" y="-70" width="70" height="140" fill="none" stroke="#fff" stroke-width="5"/>`;
  for(const [px,py,c] of [[-120,-100,'#e8453c'],[40,60,'#e8453c'],[140,-40,'#e8453c'],[-60,110,'#4a7cd8'],[180,100,'#4a7cd8']])s+=`<circle cx="${px}" cy="${py}" r="16" fill="${c}" ${ink(4)}/>`;
  const jx=120-run*380, jy=20+Math.sin(u*3)*10;   // o jogador do Kauã (amarelo) corre sozinho para a esquerda
  s+=`<circle cx="${F(jx)}" cy="${F(jy)}" r="18" fill="#ffd23f" ${ink(5)}/><circle cx="${F(jx-22)}" cy="${F(jy+4)}" r="9" fill="#fff" ${ink(3)}/>`;
  if(gc){const p=out((u-3.4)/.2);s+=`<g transform="translate(0 -20) scale(${F(p)})"><rect x="-250" y="-60" width="500" height="120" rx="10" fill="#30233f" stroke="#ffe7c2" stroke-width="6"/><text y="30" text-anchor="middle" ${FONTEH} font-size="82" fill="#ffd23f" letter-spacing="3">GOL CONTRA</text></g>`;}
  return s+'</g>';
 }
 function noiteChao(t){           // 48,6–54,6
  const u=t-48.6;
  let s=quarto(t,true);
  s+=`<g transform="translate(540 760) scale(.92)">${tvFutebol(t,u)}</g>`;
  s+=`<g transform="translate(540 1040)"><rect x="-340" y="0" width="680" height="30" rx="10" fill="#30233f" ${ink(7)}/><rect x="-60" y="30" width="120" height="50" fill="#30233f" ${ink(6)}/></g>`;
  s+=`<rect x="140" y="1300" width="800" height="200" rx="40" fill="#7a6aa8" ${ink(9)}/>`;  // lado da cama
  s+=ator(DK,{expr:u>3.4?'bravo':'neutro',sentado:true,look:[0,-6],head:2,armL:[-40,-10],armR:[40,-10]},540,1660,1.15);
  s+=controle(540,1440,.55,-8,{luz:u<3.6?1:0});
  return s;
 }
 function controleMorre(t){       // 54,6–57,6: close no controle; a luz apaga e o analógico sai
  const u=t-54.6, luz=u<1.3?1-fit(u,.7,1.3):0, sai=fit(u,1.6,2.6);
  let s=`<rect width="1080" height="1920" fill="#3a2f5c"/><rect width="1080" height="1920" fill="url(#dots)" opacity=".16"/>`;
  s+=controle(540,900,2.2,-6,{luz,stick:sai});
  if(sai>0&&sai<1)s+=stickSolto(540-135+sai*-380,900+120-Math.sin(sai*Math.PI)*620+sai*sai*420,2.2,sai*620);
  else if(sai>=1)s+=stickSolto(540-135-380,900+120+420,2.2,620);
  if(u>1.6&&u<2.6)s+=`<g transform="translate(560 420) rotate(-6) scale(${F(out((u-1.6)/.15))})"><polygon points="0,-110 30,-44 100,-60 58,0 104,54 32,46 0,112 -32,46 -104,54 -58,0 -100,-60 -30,-44" fill="#ffd23f" ${ink(8)}/><text y="20" text-anchor="middle" ${FONTEH} font-size="62" fill="#e8453c" stroke="${INK}" stroke-width="6" paint-order="stroke fill">POP!</text></g>`;
  return s;
 }
 function kauaQuebrado(t){        // 57,6–61,6
  let s=`<rect width="1080" height="1920" fill="#3a2f5c"/><rect width="1080" height="1920" fill="url(#dots)" opacity=".16"/>`+rosto(t<58.2?'surpreso':'triste',{look:[0,3],head:Math.sin(t*2)*2});
  s+=controle(300,1330,.8,-24,{luz:0,stick:1});
  return s;
 }
 function chat(t){                // 61,6–65,5 e a regra nº 3
  let s=`<rect width="1080" height="1920" fill="#2a2140"/><rect width="1080" height="1920" fill="url(#dots)" opacity=".10"/>`;
  s+=`<g transform="translate(60 180)"><rect width="960" height="1280" rx="46" fill="#f5efe4" ${ink(10)}/><rect width="960" height="150" rx="46" fill="#5a43a0" ${ink(10)}/><text x="480" y="98" text-anchor="middle" ${FONTEH} font-size="62" letter-spacing="3" fill="${CREAM}">RESENHA 19/11</text></g>`;
  const msgs=[{t0:61.7,q:'Léo',l1:'confirmando: cada um traz',l2:'o SEU controle',cor:'#ffd9b8',cl:'#e8453c',lt:'#fff'},{t0:62.5,q:'Rafa',check:1,cor:'#d9f2e0',cl:'#f3efe4',lt:'#19213c'},{t0:63.1,q:'Pedrão',check:1,burg:1,cor:'#d9f2e0',cl:'#c93a3a',lt:'#fff'},{t0:63.6,q:'Léo',l1:'@Kauã o teu tá novinho?',l2:'',cor:'#ffd9b8',cl:'#e8843a',lt:'#fff'}];
  let y=380;
  for(const m of msgs){
   const a=fit(t,m.t0,m.t0+.35), h=m.check?110:(m.l2?190:140);
   if(a>0){s+=`<g transform="translate(120 ${y})" opacity="${F(a)}"><circle cx="46" cy="${h/2}" r="46" fill="${m.cl}" ${ink(6)}/><text x="46" y="${h/2+14}" text-anchor="middle" ${FONTEH} font-size="40" fill="${m.lt}">${m.q[0]}</text><rect x="110" y="0" width="${m.check?(m.burg?280:190):640}" height="${h}" rx="28" fill="${m.cor}" ${ink(6)}/>`;
    if(m.check){s+=`<rect x="150" y="24" width="62" height="62" rx="12" fill="#3fbf6a" ${ink(5)}/><path d="M164 56L180 72L204 40" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`;if(m.burg)s+=`<text x="232" y="80" font-size="60">🍔</text>`;}
    else{s+=`<text x="136" y="52" ${FA} font-size="34" fill="${INK}">${m.l1}</text>`;s+=m.l2?`<text x="136" y="108" ${FA} font-size="44" fill="#c93a3a">${m.l2}</text>`:'';}
    s+='</g>';}
   y+=h+34;
  }
  // resposta digitando → apaga → "tá novinho 😎"
  const d0=63.95, ty=380+110+34+110+34+110+34+140+34+30;
  if(t>d0-.3){const dig=t<64.2, apaga=t>=64.2&&t<64.5;
   s+=`<g transform="translate(120 ${ty})"><rect x="110" y="0" width="${dig?170:620}" height="110" rx="28" fill="#d8d0e8" ${ink(6)}/>`;
   if(dig)for(let i=0;i<3;i++)s+=`<circle cx="${150+i*46}" cy="55" r="${10+Math.sin(t*14+i)*3}" fill="#6a5f80"/>`;
   else s+=`<text x="140" y="70" ${FA} font-size="46" fill="${INK}">tá novinho 😎</text>`;
   s+='</g>';}
  const r=fit(t,65.55,65.95);
  if(r>0){
   s+=`<rect width="1080" height="1920" fill="#2a2140" opacity="${F(r*.92)}"/>`;
   s+=`<g opacity="${F(r)}" transform="translate(540 700) rotate(-3)" filter="url(#ink-shadow)"><rect x="-470" y="-260" width="940" height="520" rx="22" fill="url(#vice-sunset)" ${ink(12)}/><text y="-150" text-anchor="middle" ${FONTEH} font-size="70" letter-spacing="5" fill="#35233e">REGRA DO GRUPO Nº 3</text><text y="-20" text-anchor="middle" ${FONTEH} font-size="118" fill="#fff9e7" stroke="#35233e" stroke-width="10" paint-order="stroke fill">QUEM NÃO TRAZ</text><text y="100" text-anchor="middle" ${FONTEH} font-size="118" fill="#fff9e7" stroke="#35233e" stroke-width="10" paint-order="stroke fill">CONTROLE,</text><text y="215" text-anchor="middle" ${FONTEH} font-size="118" fill="#fff9e7" stroke="#35233e" stroke-width="10" paint-order="stroke fill">ASSISTE.</text></g>`;
   s+=`<g transform="translate(300 1300) rotate(-30)" opacity="${F(r)}">${controle(0,0,.7,0,{luz:0,stick:1})}</g>`;
  }
  return s;
 }
 function kauaSeguir(t){          // 67,0–73,4: resignado; "SEGUIR" no pedido
  const s2=pop(t,70.6,.3);
  let s=rosa(t)+rosto(t<70.5?'cansado':'feliz',{look:[0,2],head:Math.sin(t*2.4)*2});
  if(s2>0)s+=`<g transform="translate(540 1330) scale(${F(s2)})" filter="url(#ink-shadow)"><rect x="-260" y="-70" width="520" height="140" rx="70" fill="#ff8fb3" ${ink(10)}/><text y="30" text-anchor="middle" ${FONTEH} font-size="86" letter-spacing="4" fill="#35233e">+ SEGUIR</text></g>`;
  return s;
 }
 function loja(t){                // 73,4–80,0: DualSense R$ 430 e a barra que estica
  const a=out((t-73.5)/.35), p=pop(t,74.0,.3);
  let s=`<rect width="1080" height="1920" fill="#2a2140"/><rect width="1080" height="1920" fill="url(#dots)" opacity=".10"/>`;
  s+=`<g transform="translate(60 190)"><rect width="960" height="1190" rx="46" fill="#f5efe4" ${ink(10)}/><rect width="960" height="130" rx="46" fill="#3a6fd8" ${ink(10)}/><text x="480" y="88" text-anchor="middle" ${FONTEH} font-size="56" letter-spacing="3" fill="${CREAM}">LOJA</text></g>`;
  s+=`<g transform="translate(${F(540-(1-a)*1200)} 700)"><rect x="-410" y="-290" width="820" height="580" rx="28" fill="#e9f0ff" ${ink(9)}/>${controle(0,-90,1.3,0,{luz:1})}<text x="0" y="230" text-anchor="middle" ${FA} font-size="40" fill="${INK}">Controle sem fio DualSense</text></g>`;
  s+=`<g transform="translate(540 1130) scale(${F(p)})"><rect x="-300" y="-90" width="600" height="180" rx="20" fill="#30233f" stroke="#ffe7c2" stroke-width="6"/><text y="56" text-anchor="middle" ${FONTEH} font-size="136" fill="#ffd23f">R$ 430</text></g>`;
  const m=fit(t,77.8,78.2);
  if(m>0)s+=`<g opacity="${F(m)}" transform="translate(540 1330) rotate(-3)" filter="url(#ink-shadow)"><rect x="-340" y="-70" width="680" height="140" rx="12" fill="#e8453c" ${ink(10)}/><text y="40" text-anchor="middle" ${FONTEH} font-size="90" fill="#fff9e7" letter-spacing="4">A META DOBRA</text></g>`;
  return s;
 }
 function audioJao(t){            // 80,0–97,4: áudio de 4:12, ele arrasta até 3:51
  const u=t-80.0, a=out(u/.3), play=t>84.4;
  // posição da reprodução (segundos do áudio): toca no começo (84,4–88,5), depois arrasta aos saltos até 3:51 em 91,3
  let pos=0;
  if(t<84.4)pos=0; else if(t<88.5)pos=(t-84.4)*.6; else if(t<91.3)pos=lerp(2.5,231,Math.pow(fit(t,88.5,91.3),1.3)); else pos=231+Math.max(0,t-91.5)*.9;
  const mm=Math.floor(pos/60), ss=String(Math.floor(pos%60)).padStart(2,'0');
  let s=`<rect width="1080" height="1920" fill="#2a2140"/><rect width="1080" height="1920" fill="url(#dots)" opacity=".10"/>`;
  s+=`<g transform="translate(60 190)"><rect width="960" height="1190" rx="46" fill="#f5efe4" ${ink(10)}/><rect width="960" height="170" rx="46" fill="#2f7f8a" ${ink(10)}/><circle cx="110" cy="85" r="56" fill="#ffd23f" ${ink(7)}/><text x="110" y="104" text-anchor="middle" ${FONTEH} font-size="56" fill="${INK}">J</text><text x="200" y="76" ${FA} font-size="52" fill="${CREAM}">TIO JÃO 🏍️</text><text x="200" y="130" ${FA} font-size="32" fill="#cfeff2">áudio · 4:12</text></g>`;
  s+=`<g transform="translate(${F(540-(1-a)*1200)} 760)"><rect x="-420" y="-150" width="840" height="300" rx="40" fill="#cfe9ee" ${ink(8)}/>`;
  const N=44, prog=pos/252;
  for(let i=0;i<N;i++){const tocando=(t>=84.4&&t<88.6)||t>=88.6, h=(34+Math.abs(Math.sin(i*1.7)*70+Math.sin(i*.5)*40))*(tocando?1+.28*Math.sin(t*16+i*.9):1), x=-380+i*17.4, on=i/N<prog;s+=`<rect x="${F(x)}" y="${F(-h/2-10)}" width="10" height="${F(h)}" rx="5" fill="${on?'#2f7f8a':'#8fb9c4'}"/>`;}
  s+=`<rect x="-380" y="86" width="760" height="10" rx="5" fill="#8fb9c4"/><circle cx="${F(-380+760*prog)}" cy="91" r="20" fill="#e8453c" ${ink(5)}/></g>`;
  s+=`<g transform="translate(540 1110)"><text text-anchor="middle" ${FONTEH} font-size="170" fill="${t>=91.3&&t<93?'#e8453c':INK}">${mm}:${ss}</text></g>`;
  if(t>=84.4&&t<88.6)s+=balao(540,1260,['Sobrinho! A Companheira','tá com um barulhinho...'],540,1210,84.5,t,40);
  if(t>=91.5)s+=balao(540,1260,['...traz aí que eu dou um jeito.','Mas já aviso: eu uso o que tiver.'],540,1210,91.5,t,38);
  if(t>=96.7){const e=t-96.7;s+=`<g transform="translate(540 620) rotate(-8) scale(${F(out(e/.12)*(1+.05*Math.sin(e*40)))})" filter="url(#ink-shadow)"><polygon points="0,-300 80,-110 270,-160 150,0 290,140 90,120 0,300 -90,120 -290,140 -150,0 -270,-160 -80,-110" fill="#ffd23f" ${ink(10)}/><text y="40" text-anchor="middle" ${FONTEH} font-size="130" fill="#e8453c" stroke="${INK}" stroke-width="9" paint-order="stroke fill">CLANK!</text></g>`;}
  return s;
 }
 function kauaDuvida(t){          // 97,4–106,6
  const cta=t>=102.9;
  let s=rosa(t)+rosto(cta?'feliz':'pensando',{look:cta?[0,2]:[6,-2],head:Math.sin(t*2.2)*2});
  return s;
 }
 function votacao(t){             // 106,8–112,8
  const a=out((t-103.1)/.3), b=out((t-103.35)/.3), c=fit(t,104.5,104.9);
  let s=`<rect width="1080" height="1920" fill="url(#vice-rim)"/><rect width="1080" height="1920" fill="url(#dots)" opacity=".16"/>`;
  s+=`<g transform="translate(540 330) rotate(-2)"><rect x="-480" y="-100" width="960" height="200" rx="14" fill="#30233f" stroke="#ffe7c2" stroke-width="6"/><text y="30" text-anchor="middle" ${FONTEH} font-size="60" letter-spacing="1" fill="${CREAM}">COMO O KAUÃ ARRUMA O CONTROLE?</text></g>`;
  s+=`<g transform="translate(${F(540-(1-a)*1200)} 740) rotate(-1.5)" filter="url(#ink-shadow)"><rect x="-440" y="-200" width="880" height="400" rx="26" fill="#2f7f8a" ${ink(12)}/><text x="0" y="-60" text-anchor="middle" ${FONTEH} font-size="170" fill="#fff9e7" stroke="#183c44" stroke-width="10" paint-order="stroke fill">JÃO</text><text x="0" y="70" text-anchor="middle" ${FONTEH} font-size="82" fill="#eaffff">Grátis.</text><text x="0" y="150" text-anchor="middle" ${FA} font-size="46" fill="#eaffff">Mas é o Jão.</text></g>`;
  s+=`<g transform="translate(${F(540+(1-b)*1200)} 1190) rotate(1.5)" filter="url(#ink-shadow)"><rect x="-440" y="-200" width="880" height="400" rx="26" fill="#e86a5c" ${ink(12)}/><text x="0" y="-60" text-anchor="middle" ${FONTEH} font-size="170" fill="#fff9e7" stroke="#6a2118" stroke-width="10" paint-order="stroke fill">NOVO</text><text x="0" y="70" text-anchor="middle" ${FONTEH} font-size="82" fill="#fff4ea">R$ 430</text><text x="0" y="150" text-anchor="middle" ${FA} font-size="46" fill="#fff4ea">A meta dobra.</text></g>`;
  s+=`<g opacity="${F(c)}" transform="translate(540 1470)"><rect x="-340" y="-60" width="680" height="120" rx="12" fill="#30233f" stroke="#ffe7c2" stroke-width="6"/><text y="30" text-anchor="middle" ${FONTEH} font-size="74" letter-spacing="6" fill="${CREAM}">VOCÊS DECIDEM.</text></g>`;
  return s;
 }
 function fim(t){                 // 112,98–114
  let s=quarto(t,true);
  s+=`<g transform="translate(300 1560) rotate(-14)">${controle(0,0,.9,0,{luz:0,stick:1})}</g>`+stickSolto(560,1650,.9,20);
  s+=`<g transform="translate(750 1500) rotate(14)">${controle(0,0,.5,0,{luz:0,stick:1})}</g>`;
  s+=ator(DK,{expr:'cansado',sentado:true,look:[0,3],head:-3},640,1560,1.35);
  return s;
 }
 const PLANOS=[[0,6.0,'c'],[6.0,8.6,'ui'],[8.6,12.2,'c'],[12.2,15.7,'ui'],[15.7,18.4,'c'],[18.4,23.6,'c'],[23.6,27.4,'c'],[27.4,31.4,'c'],[31.4,34.5,'n'],[34.5,41.5,'c'],[41.5,48.6,'c'],[48.6,54.6,'c'],[54.6,57.6,'c'],[57.6,61.6,'c'],[61.6,67.0,'ui'],[67.0,73.4,'c'],[73.4,80.0,'ui'],[80.0,97.4,'ui'],[97.4,103.0,'c'],[103.0,107.0,'ui']];
 window.CUTS=[86.13,87.8,10.5,10.6,10.73,10.8,12.53,13.4,32.07,64.2,73.73,74.13,74.2,88.6,89.0,96.73,96.8,6.0,8.6,12.2,15.7,18.4,23.6,27.4,31.4,32.6,34.5,41.5,48.6,54.6,57.6,61.6,65.55,67.0,73.4,80.0,97.4,103.0];
 window.HOLDS=[[6.0,8.6],[12.2,15.7],[61.6,67.0],[73.4,80.0],[80.0,84.4],[103.0,107.0]];
 function scene(t){
  let body;
  if(t<6.0)body=gancho(t);
  else if(t<8.6)body=cartaoVoto(t);
  else if(t<12.2)body=fotoCadeira(t);
  else if(t<15.7)body=celularAnuncio(t);
  else if(t<18.4)body=campainha(t);
  else if(t<23.6)body=marcosPorta(t);
  else if(t<27.4)body=etiqueta(t);
  else if(t<31.4)body=kauaPreocupado(t);
  else if(t<34.5)body=cadeiraQuebra(t);
  else if(t<41.5)body=aposEstrondo(t);
  else if(t<48.6)body=semDinheiro(t);
  else if(t<54.6)body=noiteChao(t);
  else if(t<57.6)body=controleMorre(t);
  else if(t<61.6)body=kauaQuebrado(t);
  else if(t<67.0)body=chat(t);
  else if(t<73.4)body=kauaSeguir(t);
  else if(t<80.0)body=loja(t);
  else if(t<97.4)body=audioJao(t);
  else if(t<103.0)body=kauaDuvida(t);
  else body=votacao(t);
  // Aproximação contínua nos planos de atuação (cenas de interface ficam estáveis para leitura: ver HOLDS).
  const pl=PLANOS.find(([a,b])=>t>=a&&t<b);
  if(pl&&pl[2]==='c'){const z=1+cl((t-pl[0])/(pl[1]-pl[0]))*.12, px=Math.sin(t*.9)*9, py=Math.cos(t*.7)*7;body=`<g transform="translate(${(540+px).toFixed(2)} ${(1000+py).toFixed(2)}) scale(${z.toFixed(5)}) translate(-540 -1000)">${body}</g>`;}
  const hud=t>=103.0?'':hud3(t);
  return defs(t)+body+hud;
 }
 async function renderFrame(t){clock=t;await document.fonts.ready;const s=`<svg xmlns="http://www.w3.org/2000/svg" width="${C.width}" height="${C.height}" viewBox="0 0 1080 1920">${scene(t)}</svg>`;const im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s);await im.decode();ctx.clearRect(0,0,C.width,C.height);ctx.drawImage(im,0,0,C.width,C.height);
  const suav=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
  const fala=t<103.0?DADOS.faixas.find(f=>t>=f.ini&&t<f.fim):null, l=t<103.0?DADOS.legendas.find(l=>t>=l.ini&&t<l.fim):null;
  if(fala){ctx.save();ctx.scale(C.width/1080,C.height/1920);ctx.globalAlpha=Math.min(suav((t-fala.ini)/.3),suav((fala.fim-t)/.3));ctx.fillStyle='#151a2a';ctx.strokeStyle='#fff3d3';ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(56,1458,968,102,12);ctx.fill();ctx.stroke();ctx.restore();}
  if(l){ctx.save();ctx.scale(C.width/1080,C.height/1920);ctx.font='900 64px Arial';ctx.textAlign='center';ctx.textBaseline='middle';if(ctx.measureText(l.texto).width>928)throw new Error('Legenda excede caixa: '+l.texto);ctx.globalAlpha=Math.min(suav((t-l.ini)/.12),suav((l.fim-t)/.12));ctx.fillStyle='#fff7df';ctx.fillText(l.texto,540,1509);ctx.restore();}
 }
 return {renderFrame,scene};
})();
window.HQ=HQ;window.renderFrame=HQ.renderFrame;window.FILM_DURATION=107.0;window.READY=true;
window.renderFrame(1);
