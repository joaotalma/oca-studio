'use strict';
ESTILO_RIG = 'classico'; // fixado na Oca Studio (2026-11-12): episódio feito com o rig clássico
const EPISODIO=(()=>{
 const F=Object.fromEntries(FALAS.map(f=>[f.n,f])),I=n=>F[n].ini,E=n=>F[n].fim;
 const q=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
 const mix=(a,b,p)=>a+(b-a)*q(p);
 const root=d=>-(10+d.thigh+d.shin+SHOE_H[d.shoe]);
 const hc=d=>root(d)-d.torso-d.neck-73*d.hs;
 const actor=(id,x,keys=[],extra={})=>({id,x,s:1.32,...extra,poses:[[-1,{expr:'neutro',look:[id==='tico'?3:-3,0],head:0,lean:0,armL:[-9,-5],armR:[9,5]}],...keys]});
 const shot=(ini,fim,cena,atores,cam,extra={})=>({ini,fim,cena,atores,cam:cam||[[ini,540,960,1]],...extra});
 const card=(lines)=>ret(130,420,820,800,'#fff7e9',40,5)+lines.map((l,i)=>txt(540,535+i*117,l,i===0?44:i===1?64:52,i===1?'#256d56':'#293c40')).join('');
 const phone=lines=>ret(-500,-500,2080,2920,'#68bdb5',0,0)+ret(125,200,830,1400,'#29333f',70,5)+ret(155,260,770,1260,'#fff6df',45,0)+card(lines);
 const reach=(side,target,d,x,y,s)=>{const ox=x+s*side*(d.sw-d.ru*.62),oy=y+s*(root(d)-d.torso+d.ru*1.05),a=d.armU*s,b=d.armF*s,dx=target[0]-ox,dy=target[1]-oy,dist=Math.min(a+b-2,Math.hypot(dx,dy)),cl=v=>Math.max(-1,Math.min(1,v)),base=Math.atan2(dx,dy)*180/Math.PI,ab=Math.acos(cl((a*a+dist*dist-b*b)/(2*a*dist)))*180/Math.PI,cr=Math.acos(cl((a*a+b*b-dist*dist)/(2*a*b)))*180/Math.PI,up=base-side*ab;return[up,up+side*(180-cr)];};
 const DY=820-hc(CHARS.tico),hand=t=>{const p=q((t-B.turbo+.45)/.45)*(1-q((t-B.turbo-.1)/.35));return[798-78*p,1095-55*p]};
 const driver=actor('tico',692,[[-1,{expr:'feliz',look:[-2,2]}],[I(2),{expr:'forcado',look:[0,-1],head:-4}]],{s:1,y:DY,dyn:t=>({semPernas:true,armL:reach(-1,[586,1095],CHARS.tico,692,DY,1),armR:reach(1,hand(t),CHARS.tico,692,DY,1)})});
 const passenger=actor('leticia',370,[[-1,{expr:'neutro',armR:[18,150],propR:'phone'}],[B.turbo-.1,{expr:'surpreso',look:[2,-2]}]],{s:.8,y:805-.8*hc(CHARS.leticia),dyn:t=>({semPernas:true})});
 const plans=[];
 plans.push(shot(0,B.traseira,'vazio',[passenger,driver],[[0,540,970,1],[B.traseira,540,930,1.08,B.traseira]],{
  cobrePernas:true,
  fundo:t=>SerieVisual.rua(t*.8,{ambiente:'claro'})+carroSVG(540,1660,.95,{parte:'fundo'}),
  frente:t=>carroSVG(540,1660+Math.sin(t*13)*(t>B.turbo?3:1),.95,{cor:'#e3c387'})+ret(645,985,150,100,t<B.turbo?'#b53742':'#ed8152',25,4)+txt(720,1047,'TURBO',29,'#fff')+ell(586,1095,14,14,CHARS.tico.skin,OUT,3)+ell(...hand(t),14,14,CHARS.tico.skin,OUT,3)
 }));
 function rearCar(x,y,s){return `<g transform="translate(${x} ${y}) scale(${s})">`+ell(0,12,360,55,'#25333e','none',0,'opacity=".35"')+ret(-328,-170,130,200,'#26313b',30,3)+ret(198,-170,130,200,'#26313b',30,3)+shape('M-350 -420 L-285 -650 Q0 -710 285 -650 L350 -420 L370 -100 Q370 -40 310 -40 H-310 Q-370 -40 -370 -100Z','#e3c387',6)+shape('M-258 -625 Q0 -665 258 -625 L295 -435 H-295Z','#294550',5)+stroke('M-235 -460 H235','#8dbfc5',7)+ret(-345,-230,105,105,'#f3655c',20,4)+ret(240,-230,105,105,'#f3655c',20,4)+ret(-150,-165,300,76,'#fff4df',9,3)+txt(0,-111,'LOC-4D10',37)+ret(-355,-70,710,45,'#40515a',15,4)+'</g>';}
 plans.push(shot(B.traseira,B.chegada,'vazio',[],[[B.traseira,540,960,1]],{
  fundo:t=>{const p=q((t-B.traseira)/(B.chegada-B.traseira));return SerieVisual.rua(t*2.3,{ambiente:'claro'})+`<path d="M180 1425 H900" fill="none" stroke="#f5ecd9" stroke-width="20"/>`+ret(895,390,30,1100,'#34424b',10,3)+ret(825,440,170,390,'#26363e',45,4)+ell(910,520,48,48,'#ff424a',OUT,3)+ell(910,635,48,48,'#6d5550')+ell(910,750,48,48,'#4c6b65')+rearCar(540+35*Math.sin(p*Math.PI),1740-670*p,1.05-.78*p)+Array.from({length:6},(_,i)=>stroke(`M${270+i*120} ${1690-(t*500+i*100)%700} l-12 100`,'#fff1bd',5)).join('');}
 }));
 const tk=actor('tico',360,[[-1,{expr:'feliz',head:-4,armR:[45,80]}],[E(5)+.1,{expr:'surpreso',look:[3,1],head:0,armR:[12,25]}],[I(6),{expr:'triste',look:[2,2],head:4,armR:[6,10]}],[I(8),{expr:'forcado',head:2}],[E(8)+.2,{expr:'triste',head:7,lean:-2,look:[0,3]}]],{xF:t=>mix(50,360,(t-B.chegada)/.6)});
 const lk=actor('lua',750,[[-1,{expr:'preocupado',head:-2}],[I(7)-.3,{expr:'triste',head:-5,look:[-4,1],armL:[-23,-45]}],[E(8)+.6,{expr:'triste',head:-7,armL:[-15,-20]}]]);
 const counter=t=>bancadaSVG(1420)+`<g transform="translate(925 1395) rotate(-5)">${ret(-70,-25,140,50,'#263541',12,3)}${ret(-60,-18,120,36,'#b7dcd0',7,0)}${txt(0,8,'19h50',18,'#23563e')}</g>`;
 const kitchen=(a,b,actors,cam)=>shot(a,b,'cozinhaLua',actors,cam,{cobrePernas:true,frente:counter});
 plans.push(kitchen(B.chegada,I(5)-.15,[tk,lk],[[B.chegada,550,920,1.12]]));
 plans.push(kitchen(I(5)-.15,E(5)+.55,[lk],[[I(5)-.15,750,820,1.7]]));
 plans.push(kitchen(E(5)+.55,E(6)+.25,[tk],[[E(5)+.55,360,820,1.75]]));
 plans.push(kitchen(E(6)+.25,I(8)-.15,[lk],[[E(6)+.25,750,820,1.7]]));
 plans.push(kitchen(I(8)-.15,B.dias,[tk,lk],[[I(8)-.15,540,920,1.12],[B.dias,565,890,1.24,B.dias-(I(8)-.15)]]));
 const ti=actor('tico',350,[[-1,{expr:'surpreso',head:-3}],[B.agenda,{expr:'pensando',armR:[18,150],propR:'phone',look:[2,3]}],[E(11),{expr:'feliz',look:[4,0],armR:[14,120]}]]);
 const li=actor('lua',740,[[-1,{expr:'envergonhado',head:-4,armL:[-20,85]}],[I(11),{expr:'feliz',head:5,armL:[-10,-5]}]]);
 plans.push(shot(B.dias,B.agenda,'portaDiaAberta',[ti,li],[[B.dias,540,940,1.14]]));
 plans.push(shot(B.agenda,I(11)-.05,'vazio',[],[[B.agenda,540,960,1],[I(11)-.05,540,960,1.10,I(11)-.05-B.agenda]],{fundo:t=>phone(['MINHA AGENDA','SEXTA · 20H','LIVRE','Turno encerrado: 19h'])}));
 plans.push(shot(I(11)-.05,B.cinema,'portaDiaAberta',[ti,li],[[I(11)-.05,350,840,1.6]]));
 // Cinema: chão e cadeiras sustentam quadril, coxas, joelhos, canelas e pés reais.
 function chair(x){return `<g transform="translate(${x} 0)">`+ret(-150,925,300,540,'#ad6b88',65,5)+ret(-127,950,254,450,'#ca839b',48,0)+ret(-157,1425,314,90,'#c47d90',40,4)+ret(-135,1490,24,205,'#354755',8,3)+ret(111,1490,24,205,'#354755',8,3)+ell(0,1700,175,28,'#343f51','none',0,'opacity=".22"')+'</g>';}
 const cinemaBG=t=>ret(-700,-700,2480,3320,'#6d6689',0,0)+ret(-80,290,1240,410,'#b9e2dd',38,4)+Array.from({length:6},(_,i)=>ret(-240+i*300,710,260,420,i%2?'#8c6c91':'#a67e9e',56,3)).join('')+ret(-700,1450,2480,1470,'#858ba3',0,0)+stroke('M-300 1800 L540 1445 L1400 1800','#a8adb8',4)+ret(845,720,150,70,'#7caf91',10,2)+txt(920,770,'SAÍDA',32,'#fff')+`<path d="M540 300 L-400 1640 H1480Z" fill="#e4fff5" opacity="${.07+.012*Math.sin(t*1.8)}"/>`+chair(340)+chair(740);
 const armrests=t=>[175,495,575,895].map(x=>ret(x,1305,35,150,'#3b4d5a',17,3)+ret(x-12,1295,60,32,'#f0b37d',15,3)).join('')+`<g transform="translate(515 1410)">${ret(-48,-45,96,75,'#edc39b',12,2)}${txt(0,-11,'DOCES',14,'#77483b')}${txt(0,9,'DA LUA',14,'#77483b')}</g>`;
 const ct=actor('tico',340,[[-1,{expr:'feliz',sentado:true,legL:[-55,5],legR:[55,-5],armR:[28,135],propR:'fatia',head:5,look:[5,0],pupil:1.05}],[I(12)-.1,{expr:'pensando',head:7}],[I(13),{expr:'envergonhado',head:5,pupil:1.15}],[B.juntos-.25,{expr:'feliz',look:[5,0],head:6,pupil:1.2,detalhe:'brilho'}],[B.silencio+.1,{expr:'surpreso',head:2,pupil:.85,detalhe:null}],[B.doce,{expr:'forcado',look:[2,4],head:9,armR:[25,95]}],[I(17),{expr:'preocupado',look:[5,0],head:3,armR:[25,95]}],[I(19),{expr:'triste',pupil:1.05,head:5}],[E(20)+.35,{expr:'envergonhado',head:5}]],{y:1700,s:1.4});
 const cl=actor('lua',740,[[-1,{expr:'feliz',sentado:true,legL:[-55,2],legR:[55,-2],armL:[-20,110],propL:'fatia',look:[-5,0],head:-5}],[I(12)-.25,{expr:'preocupado',head:-6,armL:[-10,20],propL:null}],[B.juntos-.2,{expr:'preocupado',head:-5}],[E(15)+.1,{expr:'surpreso',pupil:1.2}],[I(16)+.3,{expr:'triste',head:-7,look:[-4,1]}],[I(17),{expr:'pensando',head:-4}],[I(18),{expr:'preocupado',look:[-5,0]}],[I(20),{expr:'envergonhado',head:-6}],[E(20)+.3,{expr:'feliz',head:-6}]],{y:1700,s:1.5,char:t=>({...CHARS.lua,semCracha:true})});
 const cine=(a,b,actors,cam)=>shot(a,b,'vazio',actors,cam,{fundo:cinemaBG,frente:armrests});
 const both=(a,b)=>cine(a,b,[ct,cl],[[a,540,1120,1],[b,540,1110,1.07,b-a]]);
 const close=(a,b,id)=>cine(a,b,id==='tico'?[ct]:[cl],[[a,id==='tico'?340:740,1060,1.65],[b,id==='tico'?340:740,1050,1.74,b-a]]);
 plans.push(both(B.cinema,I(12)-.12));
 plans.push(close(I(12)-.12,E(12)+.3,'lua'));
 plans.push(close(E(12)+.3,B.juntos-.15,'tico'));
 plans.push(both(B.juntos-.15,I(16)-.15));
 plans.push(close(I(16)-.15,E(16)+.6,'tico'));
 plans.push(close(E(16)+.6,E(18)+.4,'lua'));
 plans.push(close(E(18)+.4,E(19)+.3,'tico'));
 plans.push(close(E(19)+.3,E(20)+.35,'lua'));
 plans.push(both(E(20)+.35,B.fim));
 const telas=[],screen=(a,b,fn)=>telas.push({ini:a,fim:b,desenha:(p,s,u)=>fn(u,s,p)});
 const label=(u,text,y=220,col='#fff1d5',size=50)=>{u.cartao(95,y,890,110,col);u.texto(text,540,y+56,size,'#293c40')};
 screen(0,3,(u)=>{u.cartao(65,170,950,270,'#fff2dc');u.texto('ELE VAI SE DECLARAR.',540,260,65,'#293c40');u.texto('ELA VAI EMBORA.',540,365,72,'#a23e4b')});
 screen(3,B.traseira,(u)=>{label(u,'ÁUDIO DA LUA · ATÉ AS 20H',230,'#fff1d5',44);label(u,'19H41 · GPS: 34 MIN',370,'#d8eee4',54)});
 screen(B.chegada,I(5)-.15,u=>label(u,'TICO CHEGOU · 19H55'));
 screen(I(5)-.15,E(5)+.55,u=>label(u,'ENTREGA CONCLUÍDA · 19H50',220,'#d4eddc',46));
 screen(B.dias,B.dias+1.6,u=>label(u,'TRÊS DIAS DEPOIS'));
 screen(B.cinema,B.cinema+1.6,u=>label(u,'SEXTA · SESSÃO DAS OITO'));
 // Falas simultâneas legíveis em duas linhas; o público não depende de decifrar duas vozes.
 screen(B.juntos,B.silencio+.8,(u,s)=>{const a=Math.min(1,s/.15);u.g.globalAlpha*=a;u.cartao(95,1230,890,100,'#f3ded0');u.texto('LUA: Eu vou pra outro estado.',540,1283,49,'#713d36');u.cartao(95,1350,890,100,'#d5e9bf');u.texto('TICO: Eu te amo.',540,1403,61,'#355735')});
 screen(B.encerramento,B.fim,(u,s)=>{const a=q(s/.3);u.g.globalAlpha*=a;u.g.fillStyle='#fff0d8';u.g.fillRect(0,125,1080,580);u.texto('SE VIRA, TICO',540,260,78,'#293c40');u.texto('TEMPORADA 2',540,390,70,'#a34b48');u.texto('EM BREVE',540,540,95,'#286b5c')});
 // Estreantes veem Lua no gancho; Letícia não é confundida com a crush.
 plans[0].ini=3;plans[0].cam=[[3,540,970,1],[B.traseira,540,930,1.08,B.traseira-3]];
 plans.unshift(shot(0,3,'vazio',[],[[0,540,960,1],[3,540,960,1.025,3]],{fundo:t=>{
  const blink=(start)=>t>start&&t<start+.25?Math.sin((t-start)/.25*Math.PI)**2:0;
  return `<defs><clipPath id="introL"><path d="M-300 -300 H540 L510 2220 H-300Z"/></clipPath><clipPath id="introR"><path d="M540 -300 H1400 V2220 H510Z"/></clipPath></defs><g clip-path="url(#introL)">${SerieVisual.rua(t*.2,{ambiente:'claro'})}<g transform="translate(260 1860) scale(1.7)">${drawChar(CHARS.tico,{graphicEyes:true,expr:'envergonhado',head:5+Math.sin(t*2),look:[4,0],blink:blink(1.1),breath:2+Math.sin(t*2),armR:[20+Math.sin(t*2)*4,135]})}</g></g><g clip-path="url(#introR)">${CENARIOS.cozinhaLua().map(c=>c.svg).join('')}<g transform="translate(795 1860) scale(1.7)">${drawChar(CHARS.lua,{graphicEyes:true,expr:'preocupado',head:-5+Math.sin(t*1.5),look:[-4,1],blink:blink(2),breath:2+Math.sin(t*1.8),armR:[18,150],propR:'phone'})}</g></g><path d="M540 -100 L510 2020" stroke="#fff1d5" stroke-width="14"/><g>${ret(100,1500,320,110,'#fff1d5',30,4)}${txt(260,1572,'TICO',55,'#293c40')}${ret(635,1500,320,110,'#fff1d5',30,4)}${txt(795,1572,'LUA',55,'#7f3d37')}</g>`;
 }}));
 // A mão e a fatia precisam caber no close durante o disfarce.
 for(const pl of plans)if(Math.abs(pl.ini-(I(16)-.15))<.001)pl.cam=[[pl.ini,385,1080,1.5],[pl.fim,385,1075,1.56,pl.fim-pl.ini]];
 for(const [time,pose]of ct.poses)if(Math.abs(time-B.doce)<.001){pose.armR=[20,120];pose.look=[4,3];}
 window.TICO_V2={rearCar,cinemaBG,armrests,ct,cl};
 return {duracao:B.fim,falas:FALAS,planos:plans,telas,graphicEyes:true,suavizarTelas:true,visual:{ambiente:'claro',lado:'direita'},nomes:false,latidos:[],impactos:[B.turbo],destaques:{2:'duvida',4:'adiantado',5:'outro',6:'achou',7:'garantir',11:'posso',12:'contar',16:'lua',17:'curso',18:'trinta',19:'gente'}};
})();
