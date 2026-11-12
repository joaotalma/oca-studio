'use strict';
// Final da T1. A votação é o último plano; não há conteúdo após ela.
const ease6 = x => { x=Math.max(0,Math.min(1,x)); return x*x*(3-2*x); };
const root6 = d => -(10+d.thigh+d.shin+SHOE_H[d.shoe]);
const head6 = d => root6(d)-d.torso-d.neck-73*d.hs;
const actor6 = (id,x,expr,extra={}) => ({id,x,s:1.32,dyn:t=>({look:[id==='tico'?3:-3,0]}),poses:[[0,{expr}]],...extra});
const DUR6=61, VOTE6=56;
const plano6=(ini,fim,cena,atores,cam,extra={})=>({ini,fim,cena,atores,cam:cam||[[ini,540,920,1.1]],...extra});
const label6=(lines,accent='#236f4e')=>ret(130,460,820,650,'#fff7e9',38,5)+lines.map((l,i)=>txt(540,570+i*105,l,i===0?48:56,i===0?'#51756c':i===1?accent:'#2a1f22')).join('');
const phone6=(lines)=>ret(-300,-300,1680,2520,'#55b8b3',0,0)+ret(125,250,830,1300,'#25323d',70,7)+ret(155,310,770,1160,'#fff7e9',35,0)+label6(lines);
const plans6=[];
plans6.push(plano6(0,1.8,'vazio',[],[[0,540,960,1]],{fundo:t=>phone6(['Doces da Lua','OUTRO MOTORISTA','Pedido confirmado','19h41'])}));
// Mesmo carro e mesmos lugares do EP5. A cabine cobre as pernas.
const cx6=540,cy6=1660,ck6=.95;
function reach6(side,target,d,x,y,s){const ox=x+s*side*(d.sw-d.ru*.62),oy=y+s*(root6(d)-d.torso+d.ru*1.05),a=d.armU*s,b=d.armF*s,dx=target[0]-ox,dy=target[1]-oy,dist=Math.min(a+b-2,Math.hypot(dx,dy)),cl=v=>Math.max(-1,Math.min(1,v)),base=Math.atan2(dx,dy)*180/Math.PI,ab=Math.acos(cl((a*a+dist*dist-b*b)/(2*a*dist)))*180/Math.PI,cr=Math.acos(cl((a*a+b*b-dist*dist)/(2*a*b)))*180/Math.PI,up=base-side*ab;return[up,up+side*(180-cr)];}
const hand6=t=>{const q=ease6((t-3.9)/.5)*(1-ease6((t-4.55)/.35));return [798-88*q,1095-55*q];};
const driver6=actor6('tico',692,'forcado',{y:820-head6(CHARS.tico),s:1,dyn:t=>({semPernas:true,look:[0,-1],head:Math.sin(t*5)*3,armL:reach6(-1,[586,1095],CHARS.tico,692,820-head6(CHARS.tico),1),armR:reach6(1,hand6(t),CHARS.tico,692,820-head6(CHARS.tico),1)})});
const passenger6=actor6('leticia',370,'surpreso',{y:805-.8*head6(CHARS.leticia),s:.8,dyn:t=>({semPernas:true,armR:[55,145],head:Math.sin(t*7)*4})});
plans6.push(plano6(1.8,8.5,'vazio',[passenger6,driver6],[[1.8,540,960,1]],{
 cobrePernas:true,
 fundo:t=>SerieVisual.rua(t*(t<4.5?1.1:3.5),{ambiente:'claro'})+carroSVG(cx6,cy6,ck6,{parte:'fundo'}),
 frente:t=>carroSVG(cx6,cy6+Math.sin(t*19)*(t>4.5?4:1),ck6,{cor:'#f0bf68'})+ret(645,985,150,100,t<4.5?'#b93743':'#fa795c',25,4)+txt(720,1047,'TURBO',30,'#fff')+ell(586,1095,14,14,CHARS.tico.skin,OUT,3)+ell(...hand6(t),14,14,CHARS.tico.skin,OUT,3)+(t<4.5?ret(140,390,800,150,'#fff7e9',24,4)+txt(540,484,'34 MIN  ·  PRAZO: 20H',52):ret(350,400,380,145,'#f25c47',45,5)+txt(540,495,'TURBO',70,'#fff'))
 +(t>4.5?Array.from({length:12},(_,i)=>stroke(`M${i*99-40} ${400+(t*700+i*103)%1300} l-100 220`,'#fff4bd',8)).join(''):'')
}));
plans6.push(plano6(8.5,10.5,'vazio',[],[[8.5,540,960,1]],{fundo:t=>SerieVisual.rua(t*4,{ambiente:'claro'})+ret(770,330,135,340,'#27373c',40,4)+ell(837,410,42,42,'#ff3b42')+ell(837,510,42,42,'#5c5050')+ell(837,610,42,42,'#4c6260')+`<g transform="translate(${220+(t-8.5)*280} 1600) scale(.55)">${carroSVG(0,0,1,{parte:'fundo'})}<g transform="translate(160 ${820-head6(CHARS.tico)-1660})">${drawChar(CHARS.tico,{expr:'surpreso',semPernas:true,armL:[-40,-90],armR:[40,90],graphicEyes:true})}</g><g transform="translate(-170 ${805-.8*head6(CHARS.leticia)-1660}) scale(.8)">${drawChar(CHARS.leticia,{expr:'surpreso',semPernas:true,graphicEyes:true})}</g>${carroSVG(0,0,1,{cor:'#f0bf68'})}</g>`+ret(120,500,570,200,'#fff5dc',30,4)+txt(405,580,'RADAR',48)+txt(405,650,'MULTA REGISTRADA',38,'#c63a40')}));
const tico6=actor6('tico',340,'feliz',{poses:[[0,{expr:'feliz',armR:[55,150],head:-5}],[14.8,{expr:'surpreso',armR:[15,40],head:0}],[17,{expr:'triste',armR:[4,8],head:6}],[23.3,{expr:'forcado',head:2}],[24.6,{expr:'triste',head:9,lean:-3}]],xF:t=>340+90*ease6((t-10.5)/.7)});
const lua6=actor6('lua',745,'preocupado',{poses:[[0,{expr:'preocupado',armR:[18,150],propR:'phone'}],[18,{expr:'triste',head:-5}],[23,{expr:'triste',armR:[-20,40],propR:null}],[25,{expr:'triste',armL:[-25,-65],head:-8}],[27,{expr:'triste',armL:[-9,-5]}]]});
const kitchen6=(a,b,actors,cam)=>plano6(a,b,'cozinhaLua',actors,cam,{cobrePernas:true,frente:t=>bancadaSVG(1420)});
plans6.push(kitchen6(10.5,13.4,[tico6,lua6],[[10.5,540,880,1.12],[13.4,430,790,1.55,1.1]]));
plans6.push(kitchen6(13.4,16.7,[lua6],[[13.4,745,790,1.75]]));
plans6.push(kitchen6(16.7,20,[tico6],[[16.7,430,790,1.85]]));
plans6.push(kitchen6(20,23.2,[lua6],[[20,745,790,1.75]]));
plans6.push(kitchen6(23.2,28.5,[tico6,lua6],[[23.2,520,830,1.18],[28.5,610,810,1.38,3.8]]));
const inviteT6=actor6('tico',360,'surpreso',{poses:[[0,{expr:'surpreso',head:-3}],[33.4,{expr:'pensando',propR:'phone',armR:[18,150]}],[35,{expr:'feliz',propR:null,armR:[15,40]}]]});
const inviteL6=actor6('lua',735,'envergonhado',{poses:[[0,{expr:'envergonhado',armL:[-30,90],head:-4}],[36,{expr:'feliz',head:5,armL:[-9,-5]}]]});
plans6.push(plano6(28.5,33.5,'portaDiaAberta',[inviteT6,inviteL6],[[28.5,540,900,1.1]]));
plans6.push(plano6(33.5,35,'vazio',[],[[33.5,540,960,1]],{fundo:t=>phone6(['Minha agenda','SEXTA · 20H','LIVRE','Turno encerrado: 19h'])}));
plans6.push(plano6(35,38,'portaDiaAberta',[inviteT6,inviteL6],[[35,360,800,1.7],[37.6,540,860,1.18,1.1]]));
// Cinema autoral: só reflexos da tela, nunca cenas de filmes.
const cinema6=t=>ret(-600,-600,2280,2920,'#4d496c',0,0)+ret(70,230,940,260,'#9ccdd0',30,4)+Array.from({length:5},(_,i)=>ret(-140+i*280,600,240,600,i%2?'#a26788':'#895a86',65,4)).join('')+`<path d="M540 250 L-200 1600 H1280Z" fill="#d4f3ee" opacity="${.09+.02*Math.sin(t*2)}"/>`;
const seat6=(t)=>ret(155,1360,350,400,'#c47683',65,5)+ret(570,1360,350,400,'#c47683',65,5)+ret(95,1550,890,110,'#e4a272',35,5)+ell(535,1450,58,23,'#f4d8a6',OUT,3);
const cineT6=actor6('tico',365,'feliz',{y:1750,s:1.5,xF:t=>365+30*ease6((t-54)/1.4),dyn:t=>({semPernas:true,look:[t>53?4:1,t>53?0:-1],head:-5+13*ease6((t-42.85)/.25)-15*ease6((t-45.85)/.25)+3*ease6((t-48.85)/.25)+(t>=54?16:0),lean:t<54?0:2*ease6((t-54)/1.4)}),poses:[[0,{expr:'feliz',armR:[40,140],propR:'fatia'}],[41,{expr:'envergonhado'}],[43,{expr:'forcado',armR:[20,160]}],[47.8,{expr:'rindo'}],[51,{expr:'feliz',armR:[10,20],propR:null}],[55,{expr:'envergonhado'}]]});
const cineL6=actor6('lua',730,'feliz',{y:1750,s:1.5,xF:t=>730-30*ease6((t-54)/1.4),dyn:t=>({semPernas:true,look:[t>53?-4:-1,t>53?0:-1],head:t<49?4:t<54?-5:-12,lean:t<54?0:-2*ease6((t-54)/1.4)}),poses:[[0,{expr:'feliz',armL:[-45,-130],propL:'fatia'}],[46.3,{expr:'lado',armL:[-15,-30],propL:null}],[47.8,{expr:'rindo'}],[50,{expr:'surpreso'}],[52,{expr:'preocupado'}],[54,{expr:'envergonhado',armL:[-9,-5]}]]});
const cinemaShot6=(a,b,cam,extra={})=>plano6(a,b,'vazio',[cineT6,cineL6],cam,{cobrePernas:true,fundo:cinema6,frente:seat6,...extra});
plans6.push(cinemaShot6(38,41,[[38,540,1080,1.08]]));
plans6.push(cinemaShot6(41,46.3,[[41,365,910,1.7]],{atores:[cineT6]}));
plans6.push(cinemaShot6(46.3,49,[[46.3,730,910,1.7]],{atores:[cineL6]}));
plans6.push(plano6(49,54,'vazio',[],[[49,540,960,1]],{fundo:t=>phone6(['Curso de Confeitaria','APROVADA!','Porto Alegre · RS','Início em 30 dias','Confirme até amanhã'])}));
plans6.push(cinemaShot6(54,56,[[54,540,900,1.4],[56,550,880,1.6,1.7]]));
plans6.push(cinemaShot6(56,61,[[56,540,950,1.15],[61,540,950,1.22,5]]));
const tela6=(ini,fim,fn)=>({ini,fim,desenha:(p,s,u)=>fn(u,s,p)});
const badge6=(u,text,y=250,col='#fff4d3')=>{u.cartao(110,y,860,125,col);u.texto(text,540,y+63,52,'#263a39');};
const EPISODIO={graphicEyes:true,duracao:DUR6,falas:FALAS,planos:plans6,visual:{ambiente:'claro',lado:'direita'},nomes:false,latidos:[],impactos:[],destaques:{1:'duvida',3:'adiantado',4:'outro',5:'achou',6:'garantir',10:'posso'},telas:[
 tela6(0,1.8,(u)=>{badge6(u,'ELA CHAMOU OUTRO.',140);}),
 tela6(8.5,10.5,(u)=>{u.texto('Até o turbo ganhou boleto.',540,1500,46,'#fff');}),
 tela6(10.5,13.4,(u)=>badge6(u,'TICO CHEGOU · 19H55')),
 tela6(13.4,16.7,(u)=>{badge6(u,'ENTREGA CONCLUÍDA · 19H50',300,'#d5f5dc');}),
 tela6(28.5,30.2,(u)=>badge6(u,'TRÊS DIAS DEPOIS')),
 tela6(38,39.5,(u)=>badge6(u,'SEXTA · SESSÃO DAS OITO')),
 tela6(56,61,(u,s)=>{u.g.fillStyle='#fff3dc';u.g.fillRect(0,120,1080,430);u.texto('E AGORA, LUA?',540,195,64,'#293b3e');u.texto('Comente sua escolha:',540,265,44,'#465553');u.cartao(100,300,880,95,'#98dabc');u.texto('BEIJA',540,350,72,'#173e32');u.cartao(100,425,880,95,'#edaa99');u.texto('NÃO BEIJA',540,475,68,'#572d36');})
]};
// Movimento motivado nas telas: aproximação para ler agenda e aprovação.
for(const p of plans6){
 if(p.ini===33.5)p.cam.push([p.fim,540,960,1.12,p.fim-p.ini]);
 if(p.ini===49)p.cam.push([p.fim,540,960,1.14,p.fim-p.ini]);
 if(p.ini===38)p.cam.push([p.fim,540,1080,1.2,p.fim-p.ini]);
 if(p.ini===41)p.cam.push([p.fim,365,910,1.84,p.fim-p.ini]);
 if(p.ini===46.3)p.cam.push([p.fim,730,910,1.84,p.fim-p.ini]);
}
// Lua compra dois ingressos: iniciativa concreta, sem acrescentar falas ou pós-voto.
const shift6=4.8,start6=28.5;
function laterActor6(a){const b={...a,poses:a.poses.map(([t,p])=>[t+shift6,p])};for(const key of ['dyn','xF','yF','sF','char'])if(a[key])b[key]=t=>a[key](t-shift6);if(a.movX)b.movX=[a.movX[0]+shift6,a.movX[1]+shift6,...a.movX.slice(2)];return b;}
for(const p of plans6){if(p.ini<start6)continue;p.ini+=shift6;p.fim+=shift6;p.cam=p.cam.map(c=>[c[0]+shift6,...c.slice(1)]);p.atores=(p.atores||[]).map(laterActor6);for(const key of ['fundo','frente','cor'])if(p[key]){const fn=p[key];p[key]=t=>fn(t-shift6);}}
for(const e of EPISODIO.telas){if(e.ini>=start6){e.ini+=shift6;e.fim+=shift6;}}
// A indicação de passagem de dias acompanha agora a compra, não se repete no convite.
EPISODIO.telas=EPISODIO.telas.filter(e=>e.ini!==33.3);
plans6.push(plano6(start6,start6+shift6,'vazio',[],[[start6,540,960,1],[start6+shift6,540,960,1.12,shift6]],{fundo:t=>{
 const s=t-start6,q=ease6((s-1.65)/.45),z=ease6((s-2.1)/.25),out=ease6((s-2.6)/.35),fingerX=860-180*q+240*out,fingerY=1500-290*q+450*out;
 return phone6(['CINEMA · SEXTA','SESSÃO DAS 20H','2 INGRESSOS',''])+`<g opacity="${1-z}">${txt(540,885,'Confirmar compra',56)}${ret(270,1120,540,140,'#29856e',30,4)}${txt(540,1205,'COMPRAR',60,'#fff')}</g><g opacity="${z}">${txt(540,885,'COMPRA CONFIRMADA',56)}${ret(270,1120,540,140,'#95daba',30,4)}${txt(540,1205,'PRONTO!',60,'#193d32')}</g><g opacity="${1-out}" transform="translate(${fingerX} ${fingerY}) rotate(-28)">${ret(-33,-170,66,260,CHARS.lua.skin,33,3)}</g>`;
 }}));
plans6.sort((a,b)=>a.ini-b.ini);
EPISODIO.telas.push(tela6(start6,start6+1.6,u=>badge6(u,'TRÊS DIAS DEPOIS',130)));
EPISODIO.duracao+=shift6;
EPISODIO.suavizarTelas=true;
EPISODIO.impactos.push(4.5); // disparo intencional do turbo, com linhas de velocidade.
