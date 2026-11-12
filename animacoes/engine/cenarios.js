'use strict';
// Utilitários de cenário em SVG. Carregar depois de rig/chars.js (usa T e OUT).
// Cada cenário devolve camadas [{ f, svg }]: f é o fator de paralaxe (1 = acompanha a câmera por inteiro).
// O mundo tem 1080 x 1920, com o chão em CHAO. Os cenários do canal entram em CENARIOS.
const CHAO = 1590;
const FONTE = 'Arial Black, Arial, sans-serif';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ret = (x, y, w, h, fill, rx = 0, sw = T) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${sw ? OUT : 'none'}" stroke-width="${sw}"/>`;
const txt = (x, y, s, tam, fill = OUT, anc = 'middle', rot = 0) => `<text x="${x}" y="${y}" font-family="${FONTE}" font-size="${tam}" font-weight="900" fill="${fill}" text-anchor="${anc}"${rot ? ` transform="rotate(${rot} ${x} ${y})"` : ''}>${esc(s)}</text>`;
const placa = (x, y, w, h, fill, linhas, tam = 28, cor = OUT, rot = 0) => `<g${rot ? ` transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"` : ''}>` + ret(x, y, w, h, fill, 4) + linhas.map((l, i) => txt(x + w / 2, y + (h - (linhas.length - 1) * tam * 1.2) / 2 + tam * .36 + i * tam * 1.2, l, tam, cor)).join('') + '</g>';
const CENARIOS = { vazio: () => [] };
