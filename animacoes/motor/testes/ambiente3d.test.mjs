import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import {compilar,preparar,validarCena,camadasProntas} from '../preparar-cenas3d.mjs';
import {corBaseDoPersonagem} from '../camadas3d.mjs';

const source=fs.readFileSync(new URL('../ambiente3d.js',import.meta.url),'utf8');
const ctx=vm.createContext({});vm.runInContext(source,ctx);const engine=ctx.Plotline3D;
const plain=x=>JSON.parse(JSON.stringify(x));

test('céu acompanha horário e ambiente; interiores não recebem céu decorativo',()=>{
 assert.equal(engine.config({tipo:'rua',periodo:'noite'}).ceu,'estrelas');
 assert.equal(engine.config({tipo:'campo',periodo:'dia'}).ceu,'nuvens');
 for(const tipo of ['sala','interior','oficina','estudio','arte'])for(const periodo of ['dia','noite'])assert.equal(engine.config({tipo,periodo}).ceu,'nenhum');
});
test('preenchimento clareia a base sem antecipar o acendimento da janela',()=>{
 const light={tipo:'janela',posicao:[3,2,7],cor:'#ffe0a0',animacao:{inicio:1,duracao:1,de:0,para:1}};
 const c=engine.config({tipo:'sala',luzes:[light]}),old=engine.config({...c,preenchimento:0});
 const before=engine.characterLight(c,engine.lightStates(c,.5),[0,0,1],v=>v[0]);
 const baseline=engine.characterLight(old,engine.lightStates(old,.5),[0,0,1],v=>v[0]);
 const during=engine.lightStates(c,1.5),after=engine.characterLight(c,engine.lightStates(c,2),[0,0,1],v=>v[0]);
 assert.ok(before.ambient.every((n,i)=>n>baseline.ambient[i]));
 assert.deepEqual(plain(before.left),plain(before.right));assert.equal(during[0].potencia,.5);
 assert.ok(after.right[0]>before.right[0]+40);assert.ok(after.left[0]-before.left[0]<5);
 assert.deepEqual(plain(after.ambient),plain(before.ambient));
});
test('trocar a fonte para a esquerda troca o lado iluminado',()=>{
 for(const x of [-3,3]) {
  const c=engine.config({luzes:[{tipo:'pontual',posicao:[x,2,4],cor:'#ffe0a0'}]});
  const p=engine.characterLight(c,engine.lightStates(c,2),[0,0,1],v=>v[0]);
  assert.ok(x<0?p.left[0]>p.right[0]+30:p.right[0]>p.left[0]+30);
 }
});
test('base neutra conserva a arte e retira só a luz fixa; não desenha outra imagem',()=>{
 const shape='<mask id="p"><use href="#frente" filter="url(#branco)"/></mask><use href="#frente"/>';
 const svg=shape+'<rect width="440" fill="url(#luzP)" style="mix-blend-mode:multiply"/><rect fill="url(#bordaP)"/><rect fill="#B5532F"/>';
 assert.equal(corBaseDoPersonagem(svg),shape+'<rect fill="#B5532F"/>');
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'plotline-3d-off-'));
 fs.writeFileSync(path.join(dir,'video.js'),"const VIDEO={template:'ilustrado',ambiente3d:false};");
 assert.equal(camadasProntas(dir),true);assert.equal(compilar(dir).ativo,false);
});
test('chão atravessa o plano próximo sem ser descartado inteiro',()=>{
 const clipped=engine.clipNear([{x:-10,y:-2,z:-.5},{x:10,y:-2,z:1},{x:10,y:-2,z:30},{x:-10,y:-2,z:30}]);
 assert.ok(clipped.length>=4);assert.ok(clipped.every(p=>p.z>=.3&&Object.values(p).every(Number.isFinite)));
 assert.equal(engine.clipNear([{x:0,y:0,z:-2},{x:1,y:0,z:-1},{x:0,y:1,z:-1}]).length,0);
});
test('câmera continua em movimento dentro dos planos e é independente da ordem',()=>{
 const c=engine.config({tipo:'rua'});
 for(const move of ['esq','dir','zoom-in','zoom-out','impacto','cima','baixo']) {
  const a=engine.camera(c,0,4,move),b=engine.camera(c,.5,4,move),d=engine.camera(c,1,4,move);
  assert.notDeepEqual(plain(a),plain(b));assert.notDeepEqual(plain(b),plain(d));
  engine.camera(c,.9,4,move);assert.deepEqual(plain(engine.camera(c,.5,4,move)),plain(b));
 }
});
test('preparação conecta camadas, ambiente, configuração de luz e arquivo do motor',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'plotline-3d-')),out=path.join(dir,'saida');
 fs.mkdirSync(path.join(dir,'assets'));fs.mkdirSync(path.join(dir,'cenas'));
 fs.writeFileSync(path.join(dir,'video.js'),"const VIDEO={template:'ilustrado',paleta:'dia'};");
 fs.writeFileSync(path.join(dir,'falas.js'),'const FALAS=[{"n":1,"imagem":"assets/a.png"}];');
 fs.writeFileSync(path.join(dir,'assets','camadas.js'),'const CAMADAS={"assets/a.png":{"fundo":"assets/f.png","voce":"assets/p.png","albedo":"assets/p.png"}};');
 for(const f of ['f.png','p.png'])fs.writeFileSync(path.join(dir,'assets',f),'fixture-only-no-image-render');
 fs.writeFileSync(path.join(dir,'cenas','a.svg'),'<svg><defs></defs><!--ambiente:ceu--></svg>');
 fs.writeFileSync(path.join(dir,'cenas3d.json'),JSON.stringify({cenas:{a:{preenchimento:.3}}}));
 const prepared=preparar(dir,out);assert.equal(prepared.cenas['assets/a.png'].tipo,'campo');assert.equal(prepared.cenas['assets/a.png'].periodo,'dia');
 assert.equal(prepared.cenas['assets/a.png'].preenchimento,.3);assert.ok(fs.existsSync(path.join(out,'ambiente3d.js')));assert.match(fs.readFileSync(path.join(out,'cenas3d.js'),'utf8'),/const CENAS3D/);
 fs.utimesSync(path.join(dir,'assets','p.png'),1,1);
 assert.equal(camadasProntas(dir),false); // source SVG is newer than the texture fixture
 fs.unlinkSync(path.join(dir,'assets','p.png'));assert.throws(()=>compilar(dir),/Camada não encontrada/);
});
test('configuração inválida é barrada e modo anterior precisa ser explícito',()=>{
 assert.throws(()=>validarCena({tipo:'rua',periodo:'noite',luzes:[{tipo:'janela',posicao:[NaN,2,3]}]},'cena'),/três números/);
 assert.throws(()=>validarCena({tipo:'rua',periodo:'noite',preenchimento:1},'cena'),/preenchimento/);
 assert.throws(()=>validarCena({tipo:'rua',periodo:'noite',luzes:[{tipo:'janela',posicao:[1,2,3],animacao:{inicio:1,duracao:-1}}]},'cena'),/acendimento/);
 const html=fs.readFileSync(new URL('../../templates/ilustrado/film.html',import.meta.url),'utf8');
 assert.ok(html.indexOf('cenas3d.js')<html.indexOf('ilustrado.js'));assert.ok(html.indexOf('ambiente3d.js')<html.indexOf('ilustrado.js'));
 assert.match(fs.readFileSync(new URL('../preparar-film.sh',import.meta.url),'utf8'),/preparar-cenas3d\.mjs/);
});

function harness() {
 const operations=[];
 const context=()=>new Proxy({globalAlpha:1,measureText:t=>({width:t.length*42}),createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),getImageData:(x,y,w,h)=>({data:Uint8ClampedArray.from({length:w*h*4},(_,i)=>[160,90,50,255][i%4])}),createPattern:()=>null}, {
  get(target,key){if(key in target)return target[key];if(String(key).startsWith('create')&&String(key).endsWith('Gradient'))return (...a)=>({addColorStop:(...b)=>operations.push(['gradient',...a,...b])});return (...a)=>{for(const x of a)if(typeof x==='number')assert.ok(Number.isFinite(x),`${key} recebeu número inválido`);operations.push([key,...a.map(x=>typeof x==='object'?'asset':x)]);};},set(target,key,v){target[key]=v;return true;}
 });
 const canvas=()=>({width:8,height:16,getContext:()=>context()});
 const sandbox=vm.createContext({document:{createElement:canvas},console});vm.runInContext(source,sandbox);
 return {engine:sandbox.Plotline3D,canvas,context,operations,sandbox};
}
test('composição executa sem rasterizar, sem mutar o personagem ou variar por ordem',()=>{
 const h=harness(),images=new Map([['p',h.canvas()],['f',h.canvas()],['o',h.canvas()]]);
 const r=h.engine.create({context:h.context(),images,palette:{escuro:'#120a22',medio:'#2b1650',claro:'#4a2a80',fria:'#b48cff'}});r.prepare('p');
 const position=[-.35,0,1.1],scene={tipo:'sala',periodo:'noite',personagem:{posicao:position}},layers={voce:'p',fundo:'f',frente:'o',pivo:[540,1920]};
 const draw=t=>{h.operations.length=0;r.render(scene,layers,t,8,'esq');return JSON.stringify(h.operations);};
 const a=draw(2);draw(7);assert.equal(draw(2),a);assert.deepEqual(position,[-.35,0,1.1]);
 for(const tipo of ['rua','terreno','campo','floresta','estrada','mar','sala','interior','oficina','estudio','arte'])for(const periodo of ['dia','noite'])r.render({tipo,periodo},layers,2,8,'esq');
});
test('template real prepara e usa o 3D por padrão, mantendo relógio e textos',async()=>{
 const h=harness(),s=h.sandbox,main=h.canvas(),events=[];
 s.window=s;s.innerWidth=540;s.innerHeight=960;
 s.document.getElementById=()=>main;s.document.fonts={load:()=>Promise.resolve(),ready:Promise.resolve()};
 s.Image=class{constructor(){this.width=8;this.height=16;}set src(v){this.source=v;queueMicrotask(()=>this.onload());}};
 s.PALETAS={petroleo:{escuro:'#0a1a20',medio:'#123840',claro:'#1f5a60',destaque:'#ffb25d',fria:'#58c3c9'}};
 s.VIDEO={template:'ilustrado'};
 s.FALAS=[{n:1,texto:'Imagine a cena.',imagem:'assets/a.png',camada:'seria',inteiro:true,ini:0,fim:2.4},{n:2,texto:'A janela acenderia.',imagem:'assets/b.png',camada:'voce',ini:2.5,fim:5}];
 s.CAMADAS={'assets/a.png':{fundo:'f',voce:'p',albedo:'a',pivo:[520,1600]},'assets/b.png':{fundo:'f',voce:'p',albedo:'a',pivo:[520,1600]}};
 s.CENAS3D={'assets/a.png':{tipo:'rua',periodo:'noite'},'assets/b.png':{tipo:'sala',periodo:'dia'}};
 s.tempoDoVideo=()=>({TP:null,paraRoteiro:t=>t,paraReal:t=>t});
 const create=s.Plotline3D.create;s.Plotline3D.create=opts=>{const r=create(opts);return {...r,render(...args){events.push(args[0]);return r.render(...args);}};};
 vm.runInContext(fs.readFileSync(new URL('../../templates/ilustrado/ilustrado.js',import.meta.url),'utf8'),s);
 await new Promise(setImmediate);assert.equal(s.READY,true);assert.equal(s.FILM_DURATION,5.8);
 await s.renderFrame(.5);await s.renderFrame(3);assert.equal(events[0].tipo,'rua');assert.equal(events[1].tipo,'sala');
 assert.ok(h.operations.some(row=>row[0]==='fillText'));assert.ok(s.CUTS.length>0);
});
