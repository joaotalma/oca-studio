import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {compilar} from '../gerar-roteiro.mjs';
const base=()=>JSON.parse(fs.readFileSync(new URL('../../roteiros/apagao-2001/v2/estrutura.json',import.meta.url),'utf8'));
test('fato sem fonte conferida não pode virar fala factual',()=>{
 const e=base();e.fontes.F01.situacao='nao-conferido';assert.throws(()=>compilar(e),/fonte conferida/);
});
test('decisões editoriais e ligação causal não são opcionais',()=>{
 const e=base();delete e.virada;assert.throws(()=>compilar(e),/virada/);
 const f=base();delete f.falas[6].causa;assert.throws(()=>compilar(f),/ligação/);
});
test('geração liga direção a todas as falas e preserva separação de hipótese/fato',()=>{
 const e=base(),r=compilar(e);assert.equal(r.direcao.planos.length,e.falas.length);
 for(let i=1;i<r.falas.length;i++)assert.ok(r.falas[i].ini>=r.falas[i-1].fim);
 assert.ok(r.falas.filter(f=>f.camada==='foi').every(f=>f.fonte==='F01'));
 assert.equal(r.falas[0].pausa,0);assert.ok(r.falas[0].fim<=3);
});
test('câmera parada e trajetória explícita independem da ordem dos quadros',()=>{
 const sandbox=vm.createContext({});vm.runInContext(fs.readFileSync(new URL('../ambiente3d.js',import.meta.url),'utf8'),sandbox);
 const m=sandbox.Plotline3D,c=m.config({tipo:'sala'}),plain=x=>JSON.parse(JSON.stringify(x));
 assert.deepEqual(plain(m.camera(c,0,4,'parado')),plain(m.camera(c,1,4,'parado')));
 const scene={...c,camera:{de:[0,2,-5],para:[1,2,-4],alvo:[0,1,3]}};
 const a=plain(m.camera(scene,.5,4));m.camera(scene,.8,4);assert.deepEqual(plain(m.camera(scene,.5,4)),a);
 assert.equal(m.camera(scene,0,4).x,0);assert.equal(m.camera(scene,1,4).x,1);
});
