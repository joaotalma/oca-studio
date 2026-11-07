// Gera falas.js a partir do roteiro.md, que é a fonte das falas e dos tempos.
// Uso: node scripts/gerar-falas.mjs episodios/ep01 [V|H]
// O caminho opcional inclui as falas de um caminho da votação (V5, H5...) com o número dele.
// Fala de caminho sem tempo próprio usa o tempo da fala de mesmo número do primeiro caminho.
import fs from 'node:fs';
import path from 'node:path';
const [pasta, caminho] = process.argv.slice(2);
if (!pasta) { console.error('uso: node scripts/gerar-falas.mjs <pasta do episódio> [V|H]'); process.exit(1); }
const falas = [], tempoDe = {};
for (const linha of fs.readFileSync(path.join(pasta, 'roteiro.md'), 'utf8').split(/\r?\n/)) {
  const c = linha.trim().replace(/^\||\|$/g, '').split('|').map((x) => x.trim());
  if (c.length !== 8) continue;
  const var_ = c[0].match(/^([A-Z])(\d+)$/);
  if (!/^\d+$/.test(c[0]) && !var_) continue;
  const n = Number(var_ ? var_[2] : c[0]);
  if (c[1]) tempoDe[n] = c[1];
  if (var_ && var_[1] !== caminho) continue;
  const [ini, fim] = tempoDe[n].split('–').map((x) => Number(x.replace(',', '.')));
  falas.push({ n, ini, fim, quem: c[2], texto: c[3] });
}
falas.sort((a, b) => a.ini - b.ini);
fs.writeFileSync(path.join(pasta, 'falas.js'), `// Gerado por scripts/gerar-falas.mjs. Não edite: altere o roteiro.md.\nconst FALAS = ${JSON.stringify(falas, null, 1)};\n`);
console.log(falas.length, 'falas', caminho ? `(caminho ${caminho})` : '');
