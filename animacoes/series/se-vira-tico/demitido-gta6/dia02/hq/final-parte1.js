 // ===== Parte 1 (0 a 24 s): gancho, escolha do público, calor, o chefão e o Hambúrguer Louco em HQ V10 =====
 // A luta (24 a 40 s) é em 3D (../3d/luta). Aqui termina com um flash para o corte.
 const DUR1=24.0;
 const FRASES=[].concat(...FALAS2.map(f=>f.frases));
 const lerp=(a,b,p)=>a+(b-a)*cl(p);
 const wrap=(s,x,y,sc,flip=false)=>`<g transform="translate(${F(x)} ${F(y)}) scale(${F(flip?-sc:sc)} ${F(sc)}) translate(-540 -1712)">${s}</g>`;

 function termometro(t,x,y,a){
  const lvl=out((t-9.9)/1.1), alt=560*lvl, topo=lvl>=1;
  let s=`<g transform="translate(${x} ${y})" opacity="${F(a)}"><rect x="-44" y="-640" width="88" height="700" rx="44" fill="#fff6d6" ${ink(9)}/><rect x="-24" y="${F(60-alt-40)}" width="48" height="${F(alt+40)}" rx="24" fill="#ff5e6c"/><circle cx="0" cy="96" r="78" fill="#ff5e6c" ${ink(9)}/><circle cx="-22" cy="72" r="18" fill="#fff" opacity=".6"/>`;
  for(let i=0;i<7;i++)s+=`<path d="M52 ${-560+i*100}H${i%2?84:104}" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`;
  if(topo)s+=`<g transform="translate(0 -690) rotate(${F(Math.sin(t*40)*4)})"><polygon points="0,-90 40,-30 110,-50 66,10 120,70 40,50 0,110 -40,50 -120,70 -66,10 -110,-50 -40,-30" fill="#ffd23f" ${ink(8)}/><text x="0" y="22" text-anchor="middle" font-family="Impact,Arial Black" font-size="64" fill="#e8453c" stroke="${INK}" stroke-width="6" paint-order="stroke fill">34°C</text></g>`;
  return s+'</g>';
 }
 function sol(t,x,y,a){let r='';for(let i=0;i<14;i++){const an=i*Math.PI/7+t*.8;r+=`<path d="M${F(Math.cos(an)*90)} ${F(Math.sin(an)*90)}L${F(Math.cos(an)*140)} ${F(Math.sin(an)*140)}" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M${F(Math.cos(an)*92)} ${F(Math.sin(an)*92)}L${F(Math.cos(an)*136)} ${F(Math.sin(an)*136)}" stroke="#ffd23f" stroke-width="12" stroke-linecap="round"/>`;}
  return `<g transform="translate(${x} ${y})" opacity="${F(a)}">${r}<circle r="82" fill="#ffd23f" ${ink(9)}/><path d="M-36 -12Q-24 -28 -10 -12M14 -12Q26 -28 40 -12" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M-30 28Q0 56 34 28" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/></g>`;}
 function ondas(t,a){let s='';for(let k=0;k<5;k++){const x=120+k*200,ph=t*3+k;s+=`<path d="M${x} 1500Q${F(x+24+Math.sin(ph)*8)} 1400 ${x} 1300T${x} 1100T${x} 900" fill="none" stroke="#fff4dc" stroke-width="9" stroke-linecap="round" opacity="${F(.55*a)}"/>`;}return s;}

 // ----- cenas -----
 function cartaoVoto(t){
  const a=out((t-7.45)/.3), b=out((t-7.7)/.3), pop=out((t-8.1)/.2);
  let s=`<rect width="1080" height="1920" fill="url(#vice-rim)"/><rect width="1080" height="1920" fill="url(#dots)" opacity=".16"/>`;
  s+=`<g transform="translate(${F(-1200*(1-a))} 0)"><g transform="translate(540 430) rotate(-3)"><rect x="-440" y="-120" width="880" height="240" rx="14" fill="#30233f" stroke="#ffe7c2" stroke-width="6"/><text y="64" text-anchor="middle" font-family="Impact,Arial Black" font-size="112" letter-spacing="4" fill="${CREAM}">VOCÊS VOTARAM</text></g></g>`;
  s+=`<g transform="translate(${F(1300*(1-b))} 0)"><g transform="translate(540 960) rotate(2)" filter="url(#ink-shadow)"><rect x="-450" y="-250" width="900" height="500" rx="26" fill="url(#vice-sunset)" ${ink(12)}/><text y="52" text-anchor="middle" font-family="Impact,Arial Black" font-size="166" fill="#fff9e7" stroke="#35233e" stroke-width="14" paint-order="stroke fill">FANTASIA</text><text y="150" text-anchor="middle" font-family="Impact,Arial Black" font-size="66" letter-spacing="6" fill="#35233e">MASCOTE · R$ 80 POR DIA</text></g></g>`;
  s+=`<g transform="translate(${F(1500*(1-b))} 1480) rotate(-2) scale(.9)" opacity=".75"><rect x="-300" y="-110" width="600" height="220" rx="22" fill="#9a8fb0" ${ink(9)}/><text y="40" text-anchor="middle" font-family="Impact,Arial Black" font-size="110" fill="#e6dff1" stroke="#4a4160" stroke-width="8" paint-order="stroke fill">CACHORROS</text></g>`;
  s+=`<g transform="translate(850 760) rotate(14) scale(${F(pop)})"><polygon points="0,-130 36,-52 120,-70 70,0 124,64 38,56 0,134 -38,56 -124,64 -70,0 -120,-70 -36,-52" fill="#ffd23f" ${ink(9)}/><text y="20" text-anchor="middle" font-family="Impact,Arial Black" font-size="62" fill="#e8453c" stroke="${INK}" stroke-width="6" paint-order="stroke fill">VENCEU!</text></g>`;
  return s;
 }
 function portaLoja(t){
  const a=out((t-9.7)/.25), z=lerp(.78,.86,(t-9.7)/2.7);
  let s=fundo(t)+sol(t,170,300,a)+termometro(t,930,1380,a);
  s+=`<g opacity="${F(a)}">`+wrap(mascote(t,{abre:0,danca:.9}),500,1560,z*.92)+`</g>`;
  return s;
 }
 function horaQuatro(t){
  const a=out((t-12.45)/.25), som=fit(t,15.75,16.4), pulse=1+Math.sin(t*10)*.02;
  let s=fundo(t)+ondas(t,a)+wrap(mascote(t,{abre:0,danca:1}),540,1560,.9);
  s+=`<g transform="translate(220 360) rotate(-8) scale(${F(out((t-12.5)/.2)*pulse)})" filter="url(#ink-shadow)"><polygon points="0,-150 40,-60 140,-80 82,0 142,74 44,64 0,156 -44,64 -142,74 -82,0 -140,-80 -40,-60" fill="url(#vice-sunset)" stroke="#32233e" stroke-width="9" stroke-linejoin="round"/><text y="22" text-anchor="middle" font-family="Impact,Arial Black" font-size="76" fill="#fff9e7" stroke="#35233e" stroke-width="8" paint-order="stroke fill">HORA 4</text></g>`;
  if(som>0){const x=1080-som*620;s+=`<g opacity="${F(.75*som)}"><path d="M${F(x)} 420Q${F(x-20)} 1100 ${F(x+80)} 1920H1080V420Z" fill="#192c45"/></g><g opacity="${F(som)}" transform="translate(${F(x+120)} 700) scale(${F(som)})"><text text-anchor="middle" font-family="Impact,Arial Black" font-size="260" fill="#ffd23f" stroke="${INK}" stroke-width="14" paint-order="stroke fill">!</text></g>`;}
  return s;
 }
 function corredor(t){
  const base=17.0, u=t-base;
  const faseA=t<19.4, faseB=t>=19.4&&t<21.6, faseC=t>=21.6;
  if(faseB){
   const p=cl((t-19.4)/2.2), zoom=.74+p*.16;
   const topo=`<clipPath id="pTopo"><path d="M0 0H1080V900L0 1050Z"/></clipPath>`, baixo=`<clipPath id="pBaixo"><path d="M0 1050L1080 900V1920H0Z"/></clipPath>`;
   let s=topo+baixo;
   s+=`<g clip-path="url(#pTopo)"><rect width="1080" height="1920" fill="url(#vice-sunset)"/><polygon points="${Array.from({length:22},(_,i)=>{const a=i*Math.PI/11,r0=i%2?330:600;return F(540+Math.cos(a)*r0)+','+F(470+Math.sin(a)*r0*.9);}).join(' ')}" fill="url(#vice-rim)" stroke="#fff6df" stroke-width="12" opacity=".8"/><g transform="translate(540 470) scale(${F(zoom)}) translate(-540 -790) rotate(${F(Math.sin(t*9)*2)} 540 1190)">${mascote(t,{abre:0,danca:.3})}</g></g>`;
   s+=`<g clip-path="url(#pBaixo)"><rect width="1080" height="1920" fill="#ffd9b8"/><rect width="1080" height="1920" fill="url(#dots)" opacity=".14"/><polygon points="${Array.from({length:22},(_,i)=>{const a=i*Math.PI/11,r0=i%2?330:600;return F(540+Math.cos(a)*r0)+','+F(1380+Math.sin(a)*r0*.9);}).join(' ')}" fill="#e8453c" stroke="#fff6df" stroke-width="12" opacity=".75"/><g transform="translate(540 1380) scale(${F(zoom)}) translate(-540 -790) rotate(${F(-Math.sin(t*9)*2)} 540 1190)">${hamburguer(t,{danca:.3,look:-1})}</g></g>`;
   s+=`<path d="M-20 1050L1100 890" stroke="#fff6df" stroke-width="22"/><path d="M-20 1050L1100 890" stroke="${INK}" stroke-width="8"/>`;
   const bolt=`M520 930L580 970L548 1000L610 1060`;s+=`<path d="${bolt}" stroke="#ffd23f" stroke-width="22" fill="none" stroke-linejoin="round" opacity="${F(.5+.5*Math.sin(t*30))}"/>`;
   return s;
  }
  let s=fundoCorredor(t);
  if(faseA){
   const ent=out((t-17.2)/.5);
   s+=wrap(mascote(t,{abre:0,danca:.6}),300,1530,.62);
   s+=wrap(hamburguer(t,{danca:.5}),780+420*(1-ent),1530,.62,true);
  }else{
   const m=cl((t-21.6)/2.2);
   s+=wrap(mascote(t,{abre:0,danca:.2}),300,1530,.62);
   const bx=780+m*210;
   s+=wrap(hamburguer(t,{danca:0,moon:1}),bx,1530,.62,true);
   for(let i=0;i<7;i++){const k=(t*3+i*.37)%1;s+=`<path d="M${F(bx-210+k*60)} ${F(1500-i*70)}h${F(60-k*40)}" stroke="#fff4dc" stroke-width="8" stroke-linecap="round" opacity="${F(1-k)}"/>`;}
  }
  return s;
 }
 // "5 DIAS" grande piscando (explosão do estudo V10 do Dia 1, aqui com 5): entra em "cinco dias" e sai quando começa "Mas eu só tenho"
 function cincoDias(t){
  const p1=FALAS2[0].palavras, t0=p1.find(p=>p[0]==='cinco')[1]-.03, t1=p1.find(p=>p[0]==='Mas')[1]-.05;
  if(t<t0||t>t1+.3)return '';
  const u=t-t0, saida=1-fit(t,t1,t1+.3), pisca=u<2.2?(Math.floor(u*7)%2?.62:1):1, pulso=1+Math.sin(u*34)*.035;
  let raios='';for(let i=0;i<16;i++){const an=i*Math.PI/8+.1,k=cl(u*3-i*.02);raios+=`<path d="M${F(790+Math.cos(an)*300)} ${F(470+Math.sin(an)*300)}L${F(790+Math.cos(an)*(380+k*140))} ${F(470+Math.sin(an)*(380+k*140))}" stroke="${CREAM}" stroke-width="12" stroke-linecap="round" opacity="${F(.8*(1-k*.6))}"/>`;}
  return `<g opacity="${F(pisca*saida)}">${raios}<g transform="translate(790 470) scale(${F(pulso)}) translate(-790 -470)">${star(790,470,330,u,'5','DIAS')}</g></g>`;
 }
 function scene(t){
  let body;
  const sh=bell(t,T_ABRE-.1,T_ABRE+.25)*6;
  if(t<7.4)body=`<g transform="translate(${F(Math.sin(t*50)*sh)} ${F(Math.cos(t*43)*sh)})">`+fundo(t)+mascote(t)+`</g>`+cincoDias(t);
  else if(t<9.7)body=cartaoVoto(t);
  else if(t<12.4)body=portaLoja(t);
  else if(t<17.0)body=horaQuatro(t);
  else body=corredor(t);
  let s=defs(t)+body+hud(t);
  return s;
 }
 function captions(t){
  if(window.LEGENDAS_EXTERNAS)return;
  const f=FRASES.find(([a,b])=>t>=a&&t<b);if(!f)return;
  ctx.save();ctx.scale(C.width/1080,C.height/1920);ctx.font='900 49px Arial';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.globalAlpha=Math.min(fit(t,f[0],f[0]+.15),1-fit(t,f[1]-.12,f[1]));
  ctx.fillStyle='#151a2a';ctx.strokeStyle=CREAM;ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(48,1790,984,82,8);ctx.fill();ctx.stroke();
  let px=49;ctx.font='900 49px Arial';while(ctx.measureText(f[2]).width>930&&px>30){px-=2;ctx.font='900 '+px+'px Arial';}ctx.fillStyle='#fff7df';ctx.fillText(f[2],540,1832);ctx.restore();
 }
 async function renderFrame(t){clock=t;await document.fonts.ready;const s=`<svg xmlns="http://www.w3.org/2000/svg" width="${C.width}" height="${C.height}" viewBox="0 0 1080 1920">${scene(t)}</svg>`;const im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s);await im.decode();ctx.clearRect(0,0,C.width,C.height);ctx.drawImage(im,0,0,C.width,C.height);captions(t);}
 return {renderFrame,scene};
})();
window.HQ=HQ;window.renderFrame=HQ.renderFrame;window.FILM_DURATION=24.0;window.READY=true;
window.renderFrame(0);
