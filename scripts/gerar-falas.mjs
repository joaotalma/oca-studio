// Gera falas.js a partir do roteiro.md, que é a fonte das falas e dos tempos.
// Uso: node scripts/gerar-falas.mjs episodios/ep01
import fs from 'node:fs';
import path from 'node:path';
const pasta = process.argv[2];
if (!pasta) { console.error('uso: node scripts/gerar-falas.mjs <pasta do episódio>'); process.exit(1); }
const falas = [];
for (const linha of fs.readFileSync(path.join(pasta, 'roteiro.md'), 'utf8').split(/\r?\n/)) {
  const c = linha.trim().replace(/^\||\|$/g, '').split('|').map((x) => x.trim());
  if (c.length !== 8 || !/^\d+$/.test(c[0])) continue;
  const [ini, fim] = c[1].split('–').map((x) => Number(x.replace(',', '.')));
  falas.push({ n: Number(c[0]), ini, fim, quem: c[2], texto: c[3] });
}
fs.writeFileSync(path.join(pasta, 'falas.js'), `// Gerado por scripts/gerar-falas.mjs. Não edite: altere o roteiro.md.\nconst FALAS = ${JSON.stringify(falas, null, 1)};\n`);
console.log(falas.length, 'falas');
