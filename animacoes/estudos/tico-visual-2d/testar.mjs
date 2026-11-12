// Testes do estudo visual 2D, sem navegador: carrega as fontes como scripts clássicos num contexto isolado,
// como o film.html faz, e confere o SVG de cada quadro.
// Uso: node testar.mjs
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const ctx = vm.createContext({ console, Math, JSON });
for (const f of ['chars.js', 'cenarios.js', 'acabamento.js', 'organico.js', 'cenario-rico.js', 'estudo.js'])
  vm.runInContext(fs.readFileSync(path.join(aqui, f), 'utf8'), ctx, { filename: f });
const run = (code) => vm.runInContext(code, ctx);

let falhas = 0;
const ok = (cond, msg) => { console.log(`${cond ? 'OK   ' : 'FALHA'} ${msg}`); if (!cond) falhas++; };
const tempos = [0, .9, 1.8, 2.7, 3.2, 4.4, 4.6, 5.1, 5.7, 6.2, 7.0, 8.2, 8.9, 9.1, 9.4, 10.2, 11.0, 12.9];

// 1. Desligado, o rig desenha exatamente como o original.
run('Organico.ativar(false)');
const pose = { expr: 'feliz', armR: [70, 120], legL: [-8, -2] };
const original = (() => { const c = vm.createContext({}); vm.runInContext(fs.readFileSync(path.join(aqui, 'chars.js'), 'utf8'), c); vm.runInContext("setEstiloRig('classico')", c); return vm.runInContext(`drawChar(CHARS.tico, ${JSON.stringify(pose)})`, c); })();
ok(run(`drawChar(CHARS.tico, ${JSON.stringify(pose)})`) === original, 'desligado, o estudo usa o estilo clássico do rig');
run('Organico.ativar(true)'); ok(run(`drawChar(CHARS.tico, ${JSON.stringify(pose)})`) !== original, 'ligado, o rig desenha as formas orgânicas'); run('Organico.ativar(false)');

// 2. Quadros válidos: sem NaN, undefined ou Infinity, nos dois modos.
for (const modo of ['comparar', 'depois']) {
  const ruins = tempos.filter((t) => /NaN|undefined|Infinity/.test(run(`Estudo.quadro(${t}, '${modo}')`)));
  ok(ruins.length === 0, `${modo}: ${tempos.length} quadros sem NaN, undefined ou Infinity${ruins.length ? ' (falham: ' + ruins.join(', ') + ')' : ''}`);
}

// 3. Determinismo: a mesma sequência em ordem direta e inversa gera o mesmo texto quadro a quadro.
const ida = tempos.map((t) => run(`Estudo.quadro(${t}, 'comparar')`));
const volta = [...tempos].reverse().map((t) => run(`Estudo.quadro(${t}, 'comparar')`)).reverse();
ok(ida.every((s, i) => s === volta[i]), 'determinismo: ordem direta e inversa iguais');

// 4. O estado global volta a desligado depois de cada quadro (nada vaza para outro código).
run(`Estudo.quadro(3, 'comparar')`);
ok(run('Organico.ligado') === false, 'o estudo deixa o rig desligado ao fim de cada quadro');

// 5. Todos os personagens e expressões desenham com as formas novas, inclusive visemas e mãos com objeto.
run('Organico.ativar(true)');
const exprs = run('EXPR_ORDER'), nomes = run('Object.keys(CHARS)');
let ruins = [];
for (const n of nomes) for (const e of exprs) for (const m of [null, 'small', 'open', 'wide']) {
  const s = run(`drawChar(CHARS.${n}, { expr: '${e}', mouth: ${m ? `'${m}'` : null}, armL: [-30, -150], propL: 'phone', armR: [80, 160], legR: [20, -10], look: [4, 1] })`);
  if (/NaN|undefined|Infinity/.test(s)) ruins.push(`${n}/${e}/${m}`);
}
ok(ruins.length === 0, `${nomes.length} personagens × ${exprs.length} expressões × 4 bocas sem valores inválidos${ruins.length ? ' (' + ruins.slice(0, 5).join(', ') + ')' : ''}`);

// 6. Dobras extremas: braço em grampo e joelho dobrado continuam com coordenadas finitas.
const extremos = [[[10, 178], [-10, -178]], [[90, -90], [-90, 90]], [[0, 0], [0, 0]], [[170, 10], [-170, -10]]];
ok(extremos.every(([r, l]) => !/NaN|Infinity/.test(run(`drawChar(CHARS.lua, { armR: ${JSON.stringify(r)}, armL: ${JSON.stringify(l)}, legL: [-40, 30], legR: [40, -30] })`))), 'dobras extremas de braço e perna sem valores inválidos');
run('Organico.ativar(false)');

// 7. Pupila dentro do olho em qualquer foco.
run('Organico.ativar(true)');
const foco = run(`drawChar(CHARS.tico, { look: [40, 40] })`);
ok(!/NaN/.test(foco), 'foco exagerado não quebra a pupila');
run('Organico.ativar(false)');

console.log(falhas ? `\n${falhas} falha(s)` : '\nTodos os testes passaram.');
process.exit(falhas ? 1 : 0);
