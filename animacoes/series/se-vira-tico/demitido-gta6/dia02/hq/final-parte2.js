 // ===== Parte 2 (39,9 a 117,8 s): selfie, revelação do Pedrão, pacto, pagamento, pizza, mãe, anúncios e votação em HQ V10 =====
 // t é o tempo GLOBAL do episódio (renderizar com START=39.9). A luta em 3D ocupa 24,0 a 39,9 s.
 const FRASES=[].concat(...FALAS2.map(f=>f.frases));
 const lerp=(a,b,p)=>a+(b-a)*cl(p);
 const wrap=(s,x,y,sc,flip=false)=>`<g transform="translate(${F(x)} ${F(y)}) scale(${F(flip?-sc:sc)} ${F(sc)}) translate(-540 -1712)">${s}</g>`;
 const pop=(t,t0,d=.22)=>out((t-t0)/d);
 const SALDO=t=>t<72.9?3.2:t<98.1?53.2:13.2;
 const reais=v=>'R$ '+v.toFixed(2).replace('.',',');
 const FONTEH='font-family="Impact,Arial Black"';

 // ----- HUD (relógio + barra com saldo que muda) -----
 function hud2(t,quente=false){
  const v=SALDO(t), w=Math.max(22,792*v/449.9);
  let s=`<g transform="translate(250 56)"><rect x="0" y="0" width="580" height="96" rx="12" fill="#30233f" stroke="#ffe7c2" stroke-width="5"/><text x="290" y="66" text-anchor="middle" ${FONTEH} font-size="54" letter-spacing="5" fill="${CREAM}">GTA 6 EM 5 DIAS</text></g>`;
  if(quente)s+=`<g transform="translate(70 56)"><rect x="0" y="0" width="150" height="96" rx="12" fill="#30233f" stroke="#ffe7c2" stroke-width="5"/><rect x="26" y="14" width="18" height="52" rx="9" fill="${CREAM}"/><circle cx="35" cy="72" r="17" fill="#ff5e6c"/><rect x="29" y="30" width="12" height="46" fill="#ff5e6c"/><text x="102" y="66" text-anchor="middle" ${FONTEH} font-size="42" fill="#ff9a8a">34°</text></g>`;
  const mudou=bell(t,72.9,73.6)+bell(t,98.1,98.8), k=1+mudou*.06;
  s+=`<g transform="translate(540 1655) scale(${F(k)}) translate(-540 -1655)"><g transform="translate(100 1580)"><rect x="0" y="0" width="880" height="150" rx="12" fill="#30233f" stroke="#ffe7c2" stroke-width="5"/><text x="440" y="70" text-anchor="middle" ${FONTEH} font-size="62" letter-spacing="4" fill="${mudou?'#ffd23f':CREAM}">${reais(v)} DE R$ 449,90</text><rect x="44" y="100" width="792" height="22" rx="11" fill="#fff3d3" opacity=".22"/><rect x="44" y="100" width="${F(w)}" height="22" rx="11" fill="#ff8fb3"/></g></g>`;
  return s;
 }
 // ----- balão de fala em HQ -----
 function balao(cx,y,linhas,tx,ty,t0,t,tam=46){
  const _w=Math.max(...linhas.map(l=>l.length))*tam*.55+60,_h=linhas.length*tam*1.15+30,_x=cx-_w/2;
  const bx=Math.min(_x+_w-70,Math.max(_x+70,tx)),by=y+_h,dx=tx-bx,dy=ty-by,dd=Math.hypot(dx,dy)||1,len=Math.min(dd,120);tx=bx+dx/dd*len;ty=by+dy/dd*len;
  const a=pop(t,t0,.18); if(a<=0)return '';
  const w=Math.max(...linhas.map(l=>l.length))*tam*.55+60, h=linhas.length*tam*1.15+30, x=cx-w/2;
  let s=`<g transform="translate(${F(cx)} ${F(y+h/2)}) scale(${F(a)}) translate(${F(-cx)} ${F(-y-h/2)})" filter="url(#ink-shadow)">`;
  s+=`<path d="M${F(bx-30)} ${F(y+h-6)}L${F(tx)} ${F(ty)}L${F(bx+30)} ${F(y+h-6)}Z" fill="#fffaf0" ${ink(7)}/>`;
  s+=`<rect x="${F(x)}" y="${F(y)}" width="${F(w)}" height="${F(h)}" rx="34" fill="#fffaf0" ${ink(8)}/><rect x="${F(bx-24)}" y="${F(y+h-12)}" width="48" height="16" fill="#fffaf0"/>`;
  linhas.forEach((l,i)=>{s+=`<text x="${F(cx)}" y="${F(y+tam*1.0+i*tam*1.15+8)}" text-anchor="middle" font-family="Arial Black,Impact" font-weight="900" font-size="${tam}" fill="${INK}">${l}</text>`;});
  return s+'</g>';
 }
 // ----- cenário: corredor do shopping com a fonte -----
 function fonte2D(t,x=540,y=1330,sc=1){
  let s=`<g transform="translate(${x} ${y}) scale(${sc})"><ellipse cx="0" cy="40" rx="330" ry="70" fill="#c9b8ff" ${ink(8)}/><ellipse cx="0" cy="24" rx="290" ry="52" fill="#9fdcff" ${ink(6)}/><ellipse cx="0" cy="24" rx="190" ry="30" fill="none" stroke="#fff" stroke-width="5" opacity=".7"/><rect x="-40" y="-170" width="80" height="190" fill="#b9acd9" ${ink(8)}/><ellipse cx="0" cy="-150" rx="150" ry="34" fill="#c9b8ff" ${ink(8)}/><ellipse cx="0" cy="-158" rx="116" ry="22" fill="#9fdcff"/>`;
  for(let i=0;i<12;i++){const u=(t*.9+i*.083)%1,alt=4*u*(1-u)*190,ang=i*.52;s+=`<ellipse cx="${F(Math.cos(ang)*(30+u*130))}" cy="${F(-170-alt+u*u*80)}" rx="9" ry="13" fill="#9ed8ff" ${ink(3)}/>`;}
  return s+'</g>';
 }
 const corredorF=(t)=>fundoCorredor(t)+fonte2D(t);
 const personagensBase=(...a)=>a.join('');

 // ----- cenas -----
 function selfie(t){   // 39,9 a 46,1
  const a=out((t-40)/.4), abra=fit(t,43.4,44.0), flash=bell(t,42.4,42.7);
  let s=corredorF(t);
  s+=wrap(mascote(t,{abre:0,danca:.25*(1-abra)}),400,1530,.62);
  // Léo abraça o mascote; Rafa tira a selfie
  s+=ator(LEO,{expr:'neutro',head:-3,armL:[-8,-10],armR:[-70+abra*10,-50],lean:-3},560+(1-a)*300,1530,.95);
  s+=ator(RAFA,{expr:'neutro',head:2,armL:[10,20],armR:[-95,-70]},800+(1-a)*320,1530,.95);
  s+=`<g transform="translate(${F(570+(1-a)*320)} 1060) rotate(-10)"><rect width="74" height="120" rx="12" fill="#1c2438" ${ink(6)}/><rect x="8" y="10" width="58" height="92" rx="6" fill="#9fdcff"/></g>`;
  s+=balao(760,500,['Cadê o Kauã?','Sumiu hoje.'],800,900,41.3,t);
  s+=balao(330,430,['Tá trabalhando.','Estagiário de TI,','vai longe.'],560,900,43.0,t,42);
  if(flash>0)s+=`<rect width="1080" height="1920" fill="#fff" opacity="${F(flash*.9)}"/>`;
  return s;
 }
 const pedHead=(t,expr='surpreso')=>'<clipPath id="pcP"><rect x="0" y="0" width="1080" height="1215"/></clipPath><g clip-path="url(#pcP)">'+ator(PEDRAO,{expr,head:Math.sin(t*12)*3},540,2090,2.2)+'</g>';
 function corpoHamb(t,x,y,sc,o={}){ // hambúrguer sem a cabeça: pernas, braços, tronco e gola
  let s=hamburguer(t,{danca:o.danca??.8,moon:o.moon||0});
  return s;
 }
 function revelacao(t){  // 46,1 a 52,1
  const corre=out((t-46.2)/4.2), cai=fit(t,50.2,50.6);
  let s=corredorF(t);
  s+=wrap(mascote(t,{abre:0,danca:.3}),320,1530,.62);
  const bx=lerp(1050,640,corre), tomb=cai*-32;
  const PEDHEAD=pedHead(t);
  const corpo=hamburguer(t,{danca:1-cai,moon:0,look:-1,semCabeca:t>=50.5});
  s+=`<g transform="rotate(${F(tomb)} ${F(bx)} 1530)">`+wrap(corpo+(t>=50.5?`<g opacity="${F(out((t-50.5)/.25))}">${PEDHEAD}</g>`:''),bx,1530,.62,true)+'</g>';
  if(t>=50.5){ // a cabeça sai voando e rola
   const u=cl((t-50.5)/1.4), hx=lerp(bx-150,150,sm(u)), hy=1230-Math.sin(Math.PI*Math.min(1,u*1.3))*560+u*u*300, rot=u*900;
   s+=`<g transform="translate(${F(hx)} ${F(hy)}) rotate(${F(rot)}) scale(.5) translate(-540 -725)">${hamburguer(t,{soCabeca:true})}</g>`;
  }
  return s;
 }
 function panelPedrao(t){ // 52,1 a 56,5: o susto dos dois, em painéis diagonais
  const z=.9+cl((t-52.1)/3)*.12;
  const topo=`<clipPath id="qT"><path d="M0 0H1080V900L0 1050Z"/></clipPath><clipPath id="qB"><path d="M0 1050L1080 900V1920H0Z"/></clipPath>`;
  let s=topo;
  s+=`<g clip-path="url(#qT)"><rect width="1080" height="1920" fill="#ffd9b8"/><rect width="1080" height="1920" fill="url(#dots)" opacity=".14"/><polygon points="${Array.from({length:22},(_,i)=>{const a=i*Math.PI/11,r0=i%2?330:620;return F(540+Math.cos(a)*r0)+','+F(560+Math.sin(a)*r0*.9);}).join(' ')}" fill="#e8453c" stroke="#fff6df" stroke-width="12" opacity=".8"/>${ator(PEDRAO,{expr:'surpreso',head:Math.sin(t*14)*4},540,1840,2.15)}</g>`;
  s+=`<g clip-path="url(#qB)"><rect width="1080" height="1920" fill="url(#vice-sunset)"/><polygon points="${Array.from({length:22},(_,i)=>{const a=i*Math.PI/11,r0=i%2?330:620;return F(540+Math.cos(a)*r0)+','+F(1420+Math.sin(a)*r0*.9);}).join(' ')}" fill="url(#vice-rim)" stroke="#fff6df" stroke-width="12" opacity=".8"/><g transform="translate(540 1420) scale(${F(z*.74)}) translate(-540 -790) rotate(${F(Math.sin(t*14)*2)} 540 1190)">${mascote(t,{abre:0,danca:0,cara:'susto'})}</g></g>`;
  s+=`<path d="M-20 1050L1100 890" stroke="#fff6df" stroke-width="22"/><path d="M-20 1050L1100 890" stroke="${INK}" stroke-width="8"/>`;
  s+=`<g transform="translate(850 960) rotate(10) scale(${F(pop(t,52.9))})"><polygon points="0,-130 36,-52 120,-70 70,0 124,64 38,56 0,134 -38,56 -124,64 -70,0 -120,-70 -36,-52" fill="#ffd23f" ${ink(9)}/><text y="30" text-anchor="middle" ${FONTEH} font-size="100" fill="#e8453c" stroke="${INK}" stroke-width="7" paint-order="stroke fill">?!</text></g>`;
  return s;
 }
 function pacto(t){      // 56,1 a 64,4
  const lento=fit(t,63.2,64.0), junta=out((t-61.2)/.9);
  let s=corredorF(t);
  s+=wrap(mascote(t,{abre:0,danca:.15}),330,1530,.62);
  s+=wrap(hamburguer(t,{danca:.2,semCabeca:true,look:-1})+pedHead(t,'preocupado'),760,1530,.62,true);
  s+=balao(760,330,['Você não me viu.'],760,1000,57.0,t);
  s+=balao(290,420,['Nem você a mim.'],330,860,59.2,t);
  if(t>=61.2){ // aperto de mão em câmera lenta
   const gx=540+(1-junta)*70;
   s+=`<g transform="translate(${F(gx)} 1010)"><circle r="${F(60+lento*18)}" fill="#fff" ${ink(8)}/><circle cx="${F(-120+junta*80)}" r="52" fill="#fff" ${ink(8)}/><circle cx="${F(120-junta*80)}" r="52" fill="#fff" ${ink(8)}/>`;
   if(lento>0)for(let i=0;i<10;i++){const an=i*Math.PI/5;s+=`<path d="M${F(Math.cos(an)*110)} ${F(Math.sin(an)*110)}L${F(Math.cos(an)*(150+lento*60))} ${F(Math.sin(an)*(150+lento*60))}" stroke="#ffd23f" stroke-width="10" stroke-linecap="round"/>`;}
   s+='</g>';
  }
  return s;
 }
 function seguir(t){     // 64,5 a 68,6: o pedido para seguir, com o Kauã falando dentro da tela e o Hambúrguer ao fundo
  let s=fundo(t);
  s+=`<g transform="translate(830 1260) scale(.5)">${hamburguer(t,{danca:0,moon:1})}</g>`;
  s+=wrap(mascote(t,{abre:1,danca:.2}),470,1560,.94);
  const a=pop(t,65.1,.25), k=1+Math.sin(t*10)*.04;
  s+=`<g transform="translate(830 560) rotate(-7) scale(${F(a*k)})" filter="url(#ink-shadow)"><polygon points="0,-190 50,-80 170,-110 98,-6 176,92 56,80 0,200 -56,80 -176,92 -98,-6 -170,-110 -50,-80" fill="url(#vice-rim)" stroke="${CREAM}" stroke-width="16" stroke-linejoin="round"/><polygon points="0,-190 50,-80 170,-110 98,-6 176,92 56,80 0,200 -56,80 -176,92 -98,-6 -170,-110 -50,-80" fill="none" stroke="#32233e" stroke-width="8"/><text y="34" text-anchor="middle" ${FONTEH} font-size="124" fill="#fff9e7" stroke="#35233e" stroke-width="12" paint-order="stroke fill">SEGUE</text></g>`;
  const seta=Math.sin(t*9)*14;
  s+=`<g transform="translate(${F(930+seta)} ${F(860+seta)}) rotate(40)"><path d="M0 0H110L110 -36L190 30L110 96L110 60H0Z" fill="#ffd23f" ${ink(8)}/></g>`;
  return s;
 }
 function sala(t){       // 68,9 a 75,4: pagamento
  const a=out((t-69.0)/.4), nota=out((t-70.2)/.4), desc=out((t-72.3)/.3);
  let s=`<rect width="1080" height="1920" fill="#e7d9bf"/><rect width="1080" height="1920" fill="url(#paper)" opacity=".35"/><path d="M0 1500H1080V1920H0Z" fill="#cfb88f" ${ink(8)}/><rect x="60" y="240" width="420" height="620" fill="#9ad0c9" ${ink(8)}/><path d="M270 240V860M60 550H480" stroke="${INK}" stroke-width="8"/>`;
  s+=`<g transform="translate(700 560)"><rect width="320" height="900" rx="14" fill="#bc9271" ${ink(8)}/><rect x="30" y="40" width="260" height="200" fill="#e9dcb2" ${ink(5)}/><rect x="30" y="280" width="260" height="200" fill="#e9dcb2" ${ink(5)}/></g>`;
  // Kauã sem a cabeça do mascote: cabelo amassado e rosto vermelho (rig + recorte no pescoço do traje)
  const KCAB='<clipPath id="pcK"><rect x="0" y="0" width="1080" height="1200"/></clipPath><g clip-path="url(#pcK)">'+ator(DA,{expr:'cansado',head:-2},540,2200,2.4)+'<ellipse cx="418" cy="880" rx="60" ry="34" fill="#e6554f" opacity=".5"/><ellipse cx="662" cy="860" rx="60" ry="34" fill="#e6554f" opacity=".5"/></g>';
  s+=wrap(mascote(t,{abre:0,danca:0,semCabeca:true})+KCAB,330,1620,.72);
  s+=`<g transform="translate(190 1270) rotate(-14) scale(.7)"><rect x="-160" y="-200" width="320" height="400" rx="60" fill="#8a6fd6" ${ink(9)}/><rect x="-132" y="-172" width="264" height="344" rx="40" fill="url(#vice-sunset)" ${ink(6)}/><path d="M-70 -50Q-40 -90 -10 -50M30 -50Q60 -90 90 -50" fill="none" stroke="#3a1f4a" stroke-width="14" stroke-linecap="round"/><path d="M-80 20Q10 110 100 20Q10 40 -80 20Z" fill="#3a1f4a"/></g>`;
  // gerente de costas, entregando as notas
  s+=`<g transform="translate(${F(820-a*0)} 1500)"><path d="M-130 0Q-150 -420 -90 -540Q0 -590 90 -540Q150 -420 130 0Z" fill="#35496b" ${ink(9)}/><circle cx="0" cy="-640" r="84" fill="#7a5a44" ${ink(9)}/><path d="M-84 -650Q0 -740 84 -650Q70 -700 0 -712Q-70 -700 -84 -650Z" fill="#1c1410"/><g transform="translate(-130 -400) rotate(${F(-70+nota*20)})"><path d="M0 0V220" stroke="${INK}" stroke-width="78" stroke-linecap="round"/><path d="M0 0V220" stroke="#35496b" stroke-width="58" stroke-linecap="round"/><rect x="-36" y="210" width="72" height="44" rx="6" fill="#8fd47a" ${ink(5)}/></g></g>`;
  s+=balao(790,420,['R$ 80','−R$ 30 (lavagem','da fantasia)'],780,780,70.8,t,44);
  s+=`<g transform="translate(540 1180) scale(${F(desc)})"><rect x="-250" y="-64" width="500" height="128" rx="12" fill="#30233f" stroke="#ffe7c2" stroke-width="6"/><text y="36" text-anchor="middle" ${FONTEH} font-size="84" fill="#ff8a8a">−R$ 30</text></g>`;
  return s;
 }
 function conta(t){      // 75,4 a 79,4: três e vinte mais cinquenta
  const a=pop(t,75.5,.25), b=pop(t,77.0,.25), c=pop(t,78.2,.3);
  let s=`<rect width="1080" height="1920" fill="url(#vice-rim)"/><rect width="1080" height="1920" fill="url(#dots)" opacity=".16"/>`;
  s+=`<g transform="translate(540 700) scale(${F(a)})"><rect x="-440" y="-110" width="880" height="220" rx="16" fill="#30233f" stroke="#ffe7c2" stroke-width="6"/><text y="66" text-anchor="middle" ${FONTEH} font-size="150" fill="${CREAM}">R$ 3,20</text></g>`;
  s+=`<g transform="translate(540 1010) scale(${F(b)})"><rect x="-440" y="-110" width="880" height="220" rx="16" fill="#30233f" stroke="#ffe7c2" stroke-width="6"/><text y="66" text-anchor="middle" ${FONTEH} font-size="150" fill="#9be58a">+ R$ 50</text></g>`;
  s+=`<g transform="translate(540 1330) rotate(-3) scale(${F(c)})" filter="url(#ink-shadow)"><rect x="-470" y="-130" width="940" height="260" rx="20" fill="url(#vice-sunset)" ${ink(12)}/><text y="70" text-anchor="middle" ${FONTEH} font-size="190" fill="#fff9e7" stroke="#35233e" stroke-width="12" paint-order="stroke fill">R$ 53,20</text></g>`;
  return s;
 }
 function chatUI(t){     // 79,7 a 88,2 e cartão da regra nº 2
  let s=`<rect width="1080" height="1920" fill="#2a2140"/><rect width="1080" height="1920" fill="url(#dots)" opacity=".10"/>`;
  s+=`<g transform="translate(60 180)"><rect width="960" height="1280" rx="46" fill="#f5efe4" ${ink(10)}/><rect width="960" height="150" rx="46" fill="#5a43a0" ${ink(10)}/><text x="480" y="98" text-anchor="middle" ${FONTEH} font-size="62" letter-spacing="3" fill="${CREAM}">RESENHA 19/11</text></g>`;
  const msgs=[[80.4,'Léo','pizza da noite do lançamento','R$ 40 cada',false,'#ffd9b8',LEO],[81.7,'Rafa','',null,true,'#d9f2e0',RAFA],[82.7,'Pedrão','',null,true,'#d9f2e0',PEDRAO],[83.8,'Léo','@Kauã e tu?','',false,'#ffd9b8',LEO]];
  let y=380;
  for(const [t0,quem,l1,l2,check,cor,d] of msgs){
   const a=pop(t,t0,.2);
   if(a>0){const h=check?110:(l2?190:140);
    s+=`<g transform="translate(120 ${y}) scale(${F(a)})" style="transform-origin:0 0"><circle cx="46" cy="${h/2}" r="46" fill="${d.cloth}" ${ink(6)}/><text x="46" y="${h/2+14}" text-anchor="middle" ${FONTEH} font-size="40" fill="#fff">${quem[0]}</text><rect x="110" y="0" width="${check?190:640}" height="${h}" rx="28" fill="${cor}" ${ink(6)}/>`;
    if(check)s+=`<rect x="150" y="24" width="62" height="62" rx="12" fill="#3fbf6a" ${ink(5)}/><path d="M164 56L180 72L204 40" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`;
    else{s+=`<text x="136" y="52" font-family="Arial Black,Impact" font-weight="900" font-size="36" fill="${INK}">${l1}</text>`;if(l2)s+=`<text x="136" y="104" font-family="Arial Black,Impact" font-weight="900" font-size="52" fill="#c93a3a">${l2}</text>`;}
    s+='</g>';}
   y+=(check?110:(l2?190:140))+34;
  }
  // "Pedrão ✅ (cansado)": legenda miúda sob o check
  if(t>83.2)s+=`<text x="360" y="${F(380+190+34+110+34+80)}" font-family="Arial Black,Impact" font-weight="900" font-size="32" fill="#7a6a8a" opacity="${F(pop(t,83.2,.3))}">(cansado)</text>`;
  // cartão da regra nº 2
  const r=pop(t,86.7,.28);
  if(r>0){
   s+=`<rect width="1080" height="1920" fill="#2a2140" opacity="${F(Math.min(1,r)*.9)}"/>`;
   s+=`<g transform="translate(540 760) rotate(-3) scale(${F(r)})" filter="url(#ink-shadow)"><rect x="-470" y="-250" width="940" height="500" rx="22" fill="url(#vice-sunset)" ${ink(12)}/><text y="-130" text-anchor="middle" ${FONTEH} font-size="70" letter-spacing="5" fill="#35233e">REGRA DO GRUPO Nº 2</text><text y="-20" text-anchor="middle" ${FONTEH} font-size="130" fill="#fff9e7" stroke="#35233e" stroke-width="10" paint-order="stroke fill">QUEM NÃO RACHA,</text><text y="130" text-anchor="middle" ${FONTEH} font-size="130" fill="#fff9e7" stroke="#35233e" stroke-width="10" paint-order="stroke fill">NÃO SENTA.</text></g>`;
   s+=cadeira(540,1500,1.0,r);
  }
  return s;
 }
 function cadeira(x,y,sc,a=1){
  return `<g transform="translate(${x} ${y}) scale(${sc})" opacity="${F(a)}"><path d="M-120 -420Q-130 -140 -90 -80H90Q130 -140 120 -420Q0 -470 -120 -420Z" fill="#e8453c" ${ink(10)}/><path d="M-70 -300L40 -360M-30 -200L90 -240" stroke="#ffe58a" stroke-width="14" stroke-linecap="round"/><rect x="-150" y="-80" width="300" height="70" rx="26" fill="#3a3a4a" ${ink(10)}/><path d="M-40 -10V120M40 -10V120M-150 160L0 110L150 160" stroke="${INK}" stroke-width="16" stroke-linecap="round" fill="none"/><circle cx="-150" cy="170" r="22" fill="${INK}"/><circle cx="150" cy="170" r="22" fill="${INK}"/><rect x="60" y="-70" width="70" height="40" rx="8" fill="#c9c2a8" ${ink(5)} transform="rotate(-8 95 -50)"/></g>`;
 }
 function quarto(t,noite=true){
  let s=`<rect width="1080" height="1920" fill="${noite?'#4a4278':'#8fb8c8'}"/><rect width="1080" height="1920" fill="url(#dots)" opacity=".10"/><rect width="1080" height="1920" fill="url(#paper)" opacity=".35"/>`;
  s+=`<rect x="90" y="260" width="360" height="420" fill="#1c2438" ${ink(8)}/><path d="M270 260V680M90 470H450" stroke="${INK}" stroke-width="8"/>`;
  for(const [x,y] of[[150,330],[360,560],[200,620],[400,300]])s+=`<circle cx="${x}" cy="${y}" r="5" fill="#fff6d6"/>`;
  s+=`<g transform="translate(700 420)"><rect width="300" height="400" fill="#7a6aa8" ${ink(8)}/><rect x="20" y="20" width="260" height="360" fill="#9a8ac8"/><path d="M30 300L110 200L170 280L220 220L270 310" stroke="#ffd23f" stroke-width="10" fill="none"/></g>`;
  s+=`<path d="M0 1450H1080V1920H0Z" fill="#a8845f" ${ink(8)}/>`;
  for(let i=0;i<8;i++)s+=`<path d="M${i*150} 1450L${i*190-60} 1920" stroke="#6e5238" stroke-width="3" opacity=".5"/>`;
  return s;
 }
 function pix(t){        // 88,4 a 99,6: ele paga a pizza
  const k=pop(t,95.6,.3), s2=pop(t,98.1,.3);
  let s=quarto(t)+cadeira(780,1600,.95);
  const bat=Math.sin(t*2);
  s+=ator(D,{expr:t>96.0?'cansado':'preocupado',head:bat*2-2,look:[t>93.2?-8:0,2],armR:[-60,-70]},400,1620,.98);
  // pizza e dignidade fatiada
  const pz=pop(t,93.8,.3);
  s+=`<g transform="translate(250 760) rotate(-12) scale(${F(pz)})"><path d="M0 0L260 -40Q300 40 150 150Z" fill="#ffd9b8" ${ink(9)}/><path d="M24 20L250 -16Q270 40 150 120Z" fill="#ffb347" ${ink(6)}/><circle cx="160" cy="30" r="22" fill="#e8453c" ${ink(5)}/><circle cx="210" cy="70" r="18" fill="#e8453c" ${ink(5)}/><path d="M130 160L260 140" stroke="${INK}" stroke-width="0"/></g>`;
  if(k>0)s+=`<g transform="translate(540 740) rotate(2) scale(${F(k)})" filter="url(#ink-shadow)"><rect x="-340" y="-150" width="680" height="300" rx="30" fill="#fffaf0" ${ink(10)}/><circle cx="-220" cy="0" r="62" fill="#3fbf6a" ${ink(7)}/><path d="M-246 0L-228 20L-192 -22" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/><text x="-130" y="-20" font-family="Arial Black,Impact" font-weight="900" font-size="48" fill="${INK}">PIX ENVIADO</text><text x="-130" y="56" ${FONTEH} font-size="84" fill="#c93a3a">R$ 40,00</text></g>`;
  return s;
 }
 function mae(t){        // 99,8 a 104,4
  const a=out((t-99.9)/.3);
  let s=quarto(t);
  s+=`<g transform="translate(900 1540)"><rect x="-120" y="-700" width="240" height="820" fill="#7a5a44" ${ink(9)}/><path d="M-110 -700V120" stroke="${INK}" stroke-width="0"/></g>`;
  // Dona Rose, só da cintura para baixo (avental e chinelo), no vão da porta
  s+=`<g transform="translate(${F(900-0)} 1540)"><path d="M-110 -220Q-130 -20 -110 120H110Q130 -20 110 -220Z" fill="#5c8f6a" ${ink(9)}/><path d="M-90 -200Q0 -170 90 -200L100 60H-100Z" fill="#fff2c9" ${ink(7)}/><path d="M-60 120V220M60 120V220" stroke="${INK}" stroke-width="40" stroke-linecap="round"/><path d="M-60 120V220M60 120V220" stroke="#e9c19a" stroke-width="26" stroke-linecap="round"/><ellipse cx="-62" cy="236" rx="48" ry="22" fill="#e8453c" ${ink(6)}/><ellipse cx="62" cy="236" rx="48" ry="22" fill="#e8453c" ${ink(6)}/></g>`;
  // Kauã de costas ao lado, com a sacola enorme (a ponta da cabeça do celular aparece)
  s+=ator(D,{expr:'preocupado',head:-2,look:[8,0],armR:[-55,-40]},380,1620,.98);
  s+=`<g transform="translate(560 1480)"><path d="M-110 0Q-140 -250 -70 -330H120Q190 -250 160 0Q20 40 -110 0Z" fill="#c9b8ff" ${ink(10)}/><path d="M-40 -330Q0 -430 70 -330" stroke="${INK}" stroke-width="14" fill="none"/><rect x="-20" y="-410" width="120" height="110" rx="24" fill="#8a6fd6" ${ink(9)} transform="rotate(-10)"/><path d="M-60 -250L10 -180" stroke="#fff" stroke-width="10" opacity=".5"/></g>`;
  s+=balao(700,330,['Filho, o que tem','nessa sacola?'],900,1060,100.1,t,44);
  s+=balao(270,560,['Servidor, mãe.'],380,860,102.7,t,48);
  return s;
 }
 function anuncios(t){   // 104,6 a 110,6
  const a=out((t-104.7)/.35), b=out((t-105.6)/.35);
  let s=`<rect width="1080" height="1920" fill="#2a2140"/><rect width="1080" height="1920" fill="url(#dots)" opacity=".10"/>`;
  s+=`<g transform="translate(60 190)"><rect width="960" height="1290" rx="46" fill="#f5efe4" ${ink(10)}/><rect width="960" height="130" rx="46" fill="#5a43a0" ${ink(10)}/><text x="480" y="88" text-anchor="middle" ${FONTEH} font-size="56" letter-spacing="3" fill="${CREAM}">ANUNCIAR</text></g>`;
  s+=`<g transform="translate(${F(540-(1-a)*1200)} 600)"><rect x="-400" y="-200" width="800" height="400" rx="28" fill="#cfe9ee" ${ink(9)}/><g transform="translate(-240 130)">${cadeira(0,0,.55)}</g><text x="-60" y="-80" font-family="Arial Black,Impact" font-weight="900" font-size="36" fill="${INK}">CADEIRA GAMER</text><text x="-60" y="-34" font-family="Arial Black,Impact" font-weight="900" font-size="26" fill="#6a5f80">rasgada, mas confortável</text><text x="-60" y="96" ${FONTEH} font-size="110" fill="#c93a3a">R$ 150</text></g>`;
  s+=`<g transform="translate(${F(540+(1-b)*1200)} 1060)"><rect x="-400" y="-200" width="800" height="400" rx="28" fill="#ffe3d3" ${ink(9)}/><g transform="translate(-240 -70) scale(1.1)"><path d="M-110 -40L-50 -90H50L110 -40L80 -10L60 -30V120H-60V-30L-80 -10Z" fill="#ffd23f" ${ink(8)}/><path d="M-30 30Q0 0 30 40T40 80" stroke="#2a4f8a" stroke-width="8" fill="none"/></g><text x="-60" y="-80" font-family="Arial Black,Impact" font-weight="900" font-size="30" fill="${INK}">CAMISA AUTOGRAFADA</text><text x="-60" y="-34" font-family="Arial Black,Impact" font-weight="900" font-size="26" fill="#6a5f80">nunca vestida</text><text x="-60" y="96" ${FONTEH} font-size="110" fill="#c93a3a">R$ 150</text></g>`;
  return s;
 }
 function votacao(t){    // 110,6 a 116,6
  const a=out((t-110.7)/.35), b=out((t-111.0)/.35), c=pop(t,112.4,.3);
  let s=`<rect width="1080" height="1920" fill="url(#vice-rim)"/><rect width="1080" height="1920" fill="url(#dots)" opacity=".16"/>`;
  s+=`<g transform="translate(540 330) rotate(-2)"><rect x="-480" y="-100" width="960" height="200" rx="14" fill="#30233f" stroke="#ffe7c2" stroke-width="6"/><text y="30" text-anchor="middle" ${FONTEH} font-size="84" letter-spacing="3" fill="${CREAM}">O QUE O KAUÃ VENDE?</text></g>`;
  s+=`<g transform="translate(${F(540-(1-a)*1200)} 740) rotate(-1.5)" filter="url(#ink-shadow)"><rect x="-440" y="-200" width="880" height="400" rx="26" fill="#2f7f8a" ${ink(12)}/><text x="0" y="-100" text-anchor="middle" ${FONTEH} font-size="130" fill="#fff9e7" stroke="#183c44" stroke-width="10" paint-order="stroke fill">CADEIRA</text><g transform="translate(-260 150) scale(.42)">${cadeira(0,0,1)}</g><text x="140" y="30" text-anchor="middle" ${FONTEH} font-size="70" fill="#eaffff">R$ 150</text><text x="140" y="100" text-anchor="middle" font-family="Arial Black,Impact" font-weight="900" font-size="34" fill="#eaffff">joga no chão até o dia 19</text></g>`;
  s+=`<g transform="translate(${F(540+(1-b)*1200)} 1190) rotate(1.5)" filter="url(#ink-shadow)"><rect x="-440" y="-200" width="880" height="400" rx="26" fill="#e86a5c" ${ink(12)}/><text x="0" y="-100" text-anchor="middle" ${FONTEH} font-size="130" fill="#fff9e7" stroke="#6a2118" stroke-width="10" paint-order="stroke fill">CAMISA</text><g transform="translate(-260 40) scale(1.0)"><path d="M-110 -40L-50 -90H50L110 -40L80 -10L60 -30V120H-60V-30L-80 -10Z" fill="#ffd23f" ${ink(7)}/></g><text x="140" y="30" text-anchor="middle" ${FONTEH} font-size="70" fill="#fff4ea">R$ 150</text><text x="140" y="100" text-anchor="middle" font-family="Arial Black,Impact" font-weight="900" font-size="34" fill="#fff4ea">o maior tesouro dele</text></g>`;
  s+=`<g transform="translate(540 1470) scale(${F(c)})"><rect x="-340" y="-60" width="680" height="120" rx="12" fill="#30233f" stroke="#ffe7c2" stroke-width="6"/><text y="30" text-anchor="middle" ${FONTEH} font-size="74" letter-spacing="6" fill="${CREAM}">VOCÊS DECIDEM.</text></g>`;
  return s;
 }
 function fim(t){        // 116,8 a 117,8
  let s=`<rect width="1080" height="1920" fill="#4a4278"/><rect width="1080" height="1920" fill="url(#dots)" opacity=".10"/>`;
  s+=`<path d="M0 0H540L420 1920H0Z" fill="#a8845f" ${ink(0)}/><path d="M540 0H1080V1920H420Z" fill="#8fb8c8"/><path d="M540 0L420 1920" stroke="${CREAM}" stroke-width="18"/><path d="M540 0L420 1920" stroke="${INK}" stroke-width="7"/>`;
  s+=cadeira(220,1300,1.4);
  s+=`<g transform="translate(780 780)"><rect x="-190" y="-240" width="380" height="500" fill="#fffaf0" ${ink(12)}/><rect x="-150" y="-200" width="300" height="420" fill="#d8d0e8"/><path d="M-110 -120L-50 -170H50L110 -120L80 -90L60 -110V90H-60V-110L-80 -90Z" fill="#ffd23f" ${ink(8)}/></g>`;
  s+=`<g transform="translate(560 1480)"><rect x="-250" y="-80" width="500" height="160" rx="24" fill="url(#vice-sunset)" ${ink(10)}/><text y="30" text-anchor="middle" ${FONTEH} font-size="90" fill="#35233e">ANUNCIAR</text></g>`;
  s+=`<g transform="translate(700 1560) rotate(-18)"><ellipse rx="52" ry="82" fill="#c68b62" ${ink(8)}/></g>`;
  return s;
 }
 function scene(t){
  let body, quente=false;
  if(t<46.15)body=selfie(t);
  else if(t<52.1)body=revelacao(t);
  else if(t<56.1)body=panelPedrao(t);
  else if(t<64.5)body=pacto(t);
  else if(t<68.8)body=seguir(t);
  else if(t<75.4)body=sala(t);
  else if(t<79.6)body=conta(t);
  else if(t<88.35)body=chatUI(t);
  else if(t<99.7)body=pix(t);
  else if(t<104.5)body=mae(t);
  else if(t<110.6)body=anuncios(t);
  else if(t<116.7)body=votacao(t);
  else body=fim(t);
  let s=defs(t)+body+hud2(t,t<56.1||(t>=64.5&&t<75.4));
  const cut=[46.15,52.1,56.1,64.5,68.8,75.4,79.6,88.35,99.7,104.5,110.6,116.7];
  for(const c of cut){const b=bell(t,c-.05,c+.12);if(b>0)s+=`<rect width="1080" height="1920" fill="#fff" opacity="${F(b*.5)}"/>`;}
  const ent=1-fit(t,39.9,40.25);if(ent>0)s+=`<rect width="1080" height="1920" fill="#fff" opacity="${F(ent)}"/>`;
  return s;
 }
 function captions(t){
  if(t>=110.6)return;
  const f=FRASES.find(([a,b])=>t>=a&&t<b);if(!f)return;
  ctx.save();ctx.scale(C.width/1080,C.height/1920);ctx.font='900 49px Arial';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.globalAlpha=Math.min(fit(t,f[0],f[0]+.15),1-fit(t,f[1]-.12,f[1]));
  ctx.fillStyle='#151a2a';ctx.strokeStyle=CREAM;ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(48,1790,984,82,8);ctx.fill();ctx.stroke();
  let txt=f[2];ctx.font='900 40px Arial';if(ctx.measureText(txt).width>930){const m=txt.match(/^(.*?[:,])s+(.*)$/);if(m){const meio=f[0]+(f[1]-f[0])*.42;txt=t<meio?m[1]:m[2];}}
  let px=49;ctx.font='900 49px Arial';while(ctx.measureText(txt).width>930&&px>30){px-=2;ctx.font='900 '+px+'px Arial';}ctx.fillStyle='#fff7df';ctx.fillText(txt,540,1832);ctx.restore();
 }
 async function renderFrame(t){clock=t;await document.fonts.ready;const s=`<svg xmlns="http://www.w3.org/2000/svg" width="${C.width}" height="${C.height}" viewBox="0 0 1080 1920">${scene(t)}</svg>`;const im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s);await im.decode();ctx.clearRect(0,0,C.width,C.height);ctx.drawImage(im,0,0,C.width,C.height);captions(t);}
 return {renderFrame,scene};
})();
window.HQ=HQ;window.renderFrame=HQ.renderFrame;window.FILM_DURATION=117.8;window.READY=true;
window.renderFrame(40);
