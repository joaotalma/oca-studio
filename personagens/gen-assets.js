// Gera as folhas de personagens em assets/. Uso: cd personagens && node gen-assets.js
const { CHARS, FISCAL, EXPR_ORDER, NOMES_EXPR, SHOE_H, drawChar, drawDog } = require('./chars.js');
const fs = require('fs');

const FUNDO = '#fff3d6', TEXTO = '#7a5a44', SOMBRA = '#1b100b';
const ROTULO = 'font-family="Poppins,Segoe UI,Arial,sans-serif" font-size="15"';
const wrap = (vb, corpo, w, h) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${w}" height="${h}"><rect x="${vb.split(' ')[0]}" y="${vb.split(' ')[1]}" width="${vb.split(' ')[2]}" height="${vb.split(' ')[3]}" fill="${FUNDO}"/>${corpo}</svg>`;
const out = (nome, svg) => fs.writeFileSync('assets/' + nome, svg);
const rotulo = (x, y, texto) => `<text x="${x}" y="${y}" text-anchor="middle" ${ROTULO} fill="${TEXTO}">${texto}</text>`;

const POSES = {
  tico: [{ expr: 'neutro' }, { armR: [18, 150], propR: 'phone', legL: [-5, -1], legR: [6, 3], lean: 2, expr: 'cansado' }],
  lua: [{ expr: 'neutro' }, { armR: [8, 150], propR: 'cup', expr: 'feliz', lean: -2 }],
  jao: [{ armL: [-38, 32], armR: [38, -32], legL: [-8, -3], legR: [8, 3], expr: 'neutro' }, { armL: [-38, 32], armR: [105, 175], legL: [-8, -3], legR: [8, 3], expr: 'bravo', lean: -3 }],
  bia: [{ armL: [-30, 70], armR: [18, 150], propR: 'phone', expr: 'neutro' }, { armL: [-135, -168], armR: [135, 168], expr: 'rindo' }],
};

// Centro da cabeça de cada personagem em pé, com a perna reta.
const centroCabeca = (d) => -(10 + d.thigh + d.shin + SHOE_H[d.shoe]) - d.torso - d.neck - 49 * d.hs;
const cabeca = (k, expr, mouth, x, y, tam) => {
  const d = CHARS[k], c = centroCabeca(d), lado = 230 * d.hs;
  return `<svg x="${x}" y="${y}" width="${tam}" height="${tam}" viewBox="${-lado / 2} ${c - lado * .52} ${lado} ${lado}">${drawChar(d, { expr, mouth })}</svg>`;
};

for (const k of Object.keys(POSES)) {
  out(`${k}-poses.svg`, wrap('0 -800 920 840', `<g transform="translate(230 0)">${drawChar(CHARS[k], POSES[k][0])}</g><g transform="translate(690 0)">${drawChar(CHARS[k], POSES[k][1])}</g>`, 920, 840));
  let g = '';
  EXPR_ORDER.forEach((e, i) => {
    const x = (i % 7) * 200, y = Math.floor(i / 7) * 232;
    g += cabeca(k, e, null, x, y, 200) + rotulo(x + 100, y + 222, NOMES_EXPR[e]);
  });
  out(`${k}-expr.svg`, wrap('0 0 1400 464', g, 1400, 464));
}

const xs = [170, 460, 770, 1090];
let linha = '';
['tico', 'lua', 'jao', 'bia'].forEach((k, i) => { linha += `<g transform="translate(${xs[i]} 790)">${drawChar(CHARS[k], {})}</g>`; });
linha += `<g transform="translate(1440 790) scale(.9)">${drawDog({})}</g>`;
out('elenco.svg', wrap('0 0 1720 820', linha, 1720, 820));

// Silhueta: todas as cores viram uma só e as transparências deixam de ter efeito.
const silhueta = (svg) => svg.replace(/#[0-9a-fA-F]{6}\b/g, SOMBRA).replace(/#[0-9a-fA-F]{3}\b/g, SOMBRA).replace(/opacity="[^"]*"/g, '');
out('silhuetas.svg', wrap('0 0 1720 820', silhueta(linha), 1720, 820));

let bocas = '';
['closed', 'small', 'open', 'wide'].forEach((m, i) => { bocas += cabeca('tico', 'neutro', m, i * 230, 0, 220) + rotulo(i * 230 + 110, 243, m); });
out('bocas.svg', wrap('0 0 920 255', bocas, 920, 255));

let detalhes = '';
['suor', 'lagrima', 'veia', 'brilho'].forEach((t, i) => {
  const d = CHARS.tico, c = centroCabeca(d), lado = 230 * d.hs;
  detalhes += `<svg x="${i * 230}" y="0" width="220" height="220" viewBox="${-lado / 2} ${c - lado * .52} ${lado} ${lado}">${drawChar(d, { expr: 'neutro', detalhe: t })}</svg>` + rotulo(i * 230 + 110, 243, t);
});
out('detalhes.svg', wrap('0 0 920 255', detalhes, 920, 255));

let cao = '';
[['stand', 'stand'], ['alerta', 'alerta'], ['latindo', 'latindo']].forEach(([estado, nome], i) => {
  cao += `<g transform="translate(${i * 400 + 200} 340) scale(.8)">${drawDog(estado)}</g>` + rotulo(i * 400 + 200, 376, nome);
});
out('fiscal.svg', wrap('0 0 1200 390', cao, 1200, 390));
console.log('assets gerados para', Object.keys(POSES).join(', '), 'e', FISCAL.name);
