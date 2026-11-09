// Transforma roteiros/<slug>/cenas/*.svg em roteiros/<slug>/assets/*.png (1080 x 1920).
// As cenas podem usar o personagem aprovado com <use href="#frente"/> ou <use href="#perfil"/>.
// Uso: node engine/desenhar-cenas.mjs roteiros/<slug>
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { corBaseDoPersonagem } from './camadas3d.mjs';

const pasta = process.argv[2];
if (!pasta) { console.error('uso: node engine/desenhar-cenas.mjs roteiros/<slug>'); process.exit(2); }
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ficha = fs.readFileSync(path.join(raiz, 'personagens/voce-ficha.svg'), 'utf8');
const cenas = path.join(pasta, 'cenas'), saida = path.join(pasta, 'assets');
fs.mkdirSync(saida, { recursive: true });
const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
// A paleta vem de video.js e troca só as cores de cena. A ficha do personagem fica intacta.
// Cada template pode ter as próprias paletas; sem o arquivo, valem as do ilustrado.
const textoVideo = fs.readFileSync(path.join(pasta, 'video.js'), 'utf8');
const nomeTemplate = (textoVideo.match(/template: *'([a-z-]+)'/) || [])[1] || 'ilustrado';
const arqPaletas = [`templates/${nomeTemplate}/paletas.js`, 'templates/ilustrado/paletas.js'].map((p) => path.join(raiz, p)).find((p) => fs.existsSync(p));
const textoPaletas = fs.readFileSync(arqPaletas, 'utf8');
const PALETAS = JSON.parse(textoPaletas.match(/const PALETAS = (\{[\s\S]*?\n\});/)[1]);
const nomePaleta = (textoVideo.match(/paleta: *'([a-z-]+)'/) || [])[1] || 'petroleo';
const PAL = PALETAS[nomePaleta];
if (!PAL) { console.error(`paleta '${nomePaleta}' não existe em ${path.relative(raiz, arqPaletas)}`); process.exit(2); }
const FAMILIAS = {
  escuro: ['#071318', '#050f13', '#04080a', '#0a1a20', '#0a1d23', '#091a20', '#14262b', '#17272c', '#0d2329', '#071318'],
  medio: ['#0c232a', '#0d2a31', '#0c2c35', '#0f2c34', '#123840', '#17404e', '#18262a', '#142a31'],
  claro: ['#1f5a60', '#2a6d74', '#2a4c52', '#2a8087', '#1b4752', '#3f5a5c', '#2f4c50'],
  destaque: ['#ffb25d', '#ff8a3d', '#ffcf8a', '#ffd9a0', '#ffe2b0', '#f0a860'],
  fria: ['#58c3c9', '#6fa0a4', '#7ff0ee'],
};
const recolorir = (svg) => {
  if (nomePaleta === 'petroleo') return svg;
  let s = svg;
  for (const [papel, cores] of Object.entries(FAMILIAS)) for (const c of cores) s = s.replaceAll(c, PAL[papel]);
  return s;
};
// O rosto vem de video.js. Cabelo, mecha, pinta, risco na sobrancelha e roupa continuam iguais.
const ROSTOS = JSON.parse(fs.readFileSync(path.join(raiz, 'personagens/rostos.json'), 'utf8'));
const nomeRosto = (textoVideo.match(/rosto: *'([a-z]+)'/) || [])[1];
// olhos: 'cinema' (canal de filmes) troca o olho simples por íris com brilho, sombra da pálpebra e reflexo da cena.
// Se a cena tiver <symbol id="reflexo" viewBox="0 0 100 100">, o que estiver nele aparece refletido na íris.
const olhosCinema = /olhos: *'cinema'/.test(textoVideo);
const olhoSimples = (cx, ry, pR, dx, dy) => `<ellipse cx="${cx}" cy="244" rx="22" ry="${ry}" fill="#f6f1e4" class="l" stroke-width="4"/><circle cx="${cx + 3 + dx}" cy="${247 + dy}" r="${pR}" fill="#3b2318"/><circle cx="${cx + 3 + dx}" cy="${247 + dy}" r="${pR * .55}" fill="#120c0a"/><circle cx="${cx + 7 + dx}" cy="${242 + dy}" r="3.6" fill="#fff"/>`;
const olhoCinema = (cx, ry, pR, dx, dy, comReflexo) => {
  const ix = cx + 3 + dx, iy = 247 + dy, ir = Math.min(pR * 1.35, ry - 3), id = `o${cx}`;
  // Brilho contido (pedido do João em 2026-11-07): reflexo discreto, um brilho só e sem cílios.
  const reflexo = comReflexo
    ? `<use href="#reflexo" x="${ix - ir}" y="${iy - ir * .1}" width="${ir * 2}" height="${ir * 1.1}" opacity=".5"/>`
    : `<ellipse cx="${ix}" cy="${iy + ir * .55}" rx="${ir * .9}" ry="${ir * .45}" fill="${PAL.destaque}" opacity=".25"/>`;
  return `<defs><radialGradient id="${id}g" cx=".5" cy=".62" r=".6"><stop offset="0" stop-color="#9a6a3e"/><stop offset=".7" stop-color="#4a2a18"/><stop offset="1" stop-color="#1c0f0a"/></radialGradient>`
    + `<clipPath id="${id}c"><circle cx="${ix}" cy="${iy}" r="${ir}"/></clipPath><clipPath id="${id}e"><ellipse cx="${cx}" cy="244" rx="22" ry="${ry}"/></clipPath></defs>`
    + `<ellipse cx="${cx}" cy="244" rx="22" ry="${ry}" fill="#f6f1e4"/>`
    + `<g clip-path="url(#${id}e)"><circle cx="${ix}" cy="${iy}" r="${ir}" fill="url(#${id}g)"/>`
    + `<g clip-path="url(#${id}c)">${reflexo}<circle cx="${ix}" cy="${iy}" r="${pR * .5}" fill="#0c0705"/></g>`
    + `<circle cx="${ix}" cy="${iy}" r="${ir}" fill="none" stroke="#120a06" stroke-width="2"/>`
    + `<rect x="${cx - 24}" y="${244 - ry}" width="48" height="${ry * .55}" fill="#20161c" opacity=".28"/></g>`
    + `<rect x="${ix + ir * .2}" y="${iy - ir * .7}" width="${ir * .36}" height="${ir * .3}" rx="${ir * .08}" fill="#fff" opacity=".7"/>`
    + `<ellipse cx="${cx}" cy="244" rx="22" ry="${ry}" fill="none" class="l" stroke-width="4"/>`;
};
// Olho fechado: a pálpebra vira um traço curvo. Serve para o boneco piscar no template filmes.
const olhoFechado = (cx) => `<path class="f" stroke-width="6" d="M${cx - 22} 242 Q${cx} 256 ${cx + 22} 242"/>`;
const trocarRosto = (svg, r, comReflexo, fechado = false) => {
  if (!r) return svg;
  const [oL, oR, pR, dx, dy] = r.olho;
  const olho = (cx, ry) => fechado ? olhoFechado(cx) : olhosCinema ? olhoCinema(cx, ry, pR, dx, dy, comReflexo) : olhoSimples(cx, ry, pR, dx, dy);
  // No olho de cinema a sobrancelha fica mais grossa: o rosto lê como masculino mesmo com olho grande.
  const sw = olhosCinema ? 13 : 9;
  const novo = `<!-- sobrancelhas --><path class="f" stroke-width="${sw}" d="${r.sobr[0]}"/><path class="f" stroke-width="${sw}" d="${r.sobr[1]}"/>${olho(188, oL)}${olho(252, oR)}<path class="f" style="stroke:#7d4c36" stroke-width="4" d="M222 258 Q212 284 216 288 Q224 292 232 288"/>${r.boca}`;
  return svg.replace(/<!-- sobrancelhas[\s\S]*?(?=<!-- pinta -->)/, novo);
};
// Olho de cinema sem rosto escolhido usa o curioso, que é o mais neutro.
const rostoDoVideo = ROSTOS[nomeRosto] || (olhosCinema ? ROSTOS.curioso : undefined);
// Uma cena pode trocar a expressão com <!--rosto:surpreso-->: o rosto muda de corte em corte, o resto não.
const fichaDaCena = (svg, fechado = false) => {
  const proprio = (svg.match(/<!--rosto:([a-z]+)-->/) || [])[1];
  if (proprio && !ROSTOS[proprio]) throw new Error(`rosto '${proprio}' não existe em personagens/rostos.json`);
  return trocarRosto(ficha, ROSTOS[proprio] || rostoDoVideo, svg.includes('id="reflexo"'), fechado);
};

// Camadas para animar no template filmes. Marcas no SVG da cena:
//   <!--P--> ... <!--/P-->  o personagem (vira a camada "voce", e "pisca" com os olhos fechados)
//   <!--F-->                 daqui em diante, objetos que flutuam (camada "frente"); sem P, o que vem antes é o fundo
//   <!--pivo:x,y-->          ponto em que o personagem balança e respira (os pés ou o quadril)
// Sem marcas, a cena continua sendo uma imagem só, como no template ilustrado.
const separarCamadas = (svg) => {
  const ini = svg.indexOf('<!--P-->'), fim = svg.indexOf('<!--/P-->'), f = svg.indexOf('<!--F-->');
  if (ini < 0 && f < 0) return null;
  const abre = svg.slice(0, svg.indexOf('</defs>') + 7), fecha = '</svg>';
  const corpo = svg.slice(abre.length, svg.lastIndexOf(fecha));
  const defsExtras = (corpo.match(/<defs>[\s\S]*?<\/defs>/g) || []).join('');
  const off = abre.length;
  let fundo, voce = '', frente;
  if (ini >= 0) {
    fundo = corpo.slice(0, ini - off); voce = corpo.slice(ini - off, fim + 9 - off); frente = corpo.slice(fim + 9 - off);
  } else {
    fundo = corpo.slice(0, f - off); frente = corpo.slice(f - off);
  }
  const monta = (miolo) => abre + defsExtras + miolo + fecha;
  const pivo = (svg.match(/<!--pivo:(-?[\d.]+),(-?[\d.]+)-->/) || []).slice(1).map(Number);
  return { fundo: monta(fundo), voce: voce && monta(voce), frente: frente.replace(/<defs>[\s\S]*?<\/defs>/g, '').trim() && monta(frente), pivo: pivo.length ? pivo : [540, 1920] };
};

// Sobra abaixo do quadro nas camadas que se mexem (boneco e frente). Quando o boneco aparece só do tronco
// para cima, o corte de baixo continua desenhado fora da tela: ao respirar, balançar ou subir, o que entra
// em cena é mais corpo, nunca um vazio que faz ele parecer flutuar (problema visto pelo João em 2026-11-07).
// Nos closes, o rosto passa das bordas da tela: a sobra vale também nas laterais e no alto, senão o balanço
// mostra a linha reta onde o desenho foi cortado (visto pelo João em 2026-11-07 nos closes do Click).
const SOBRA = 520, MARGEM = 300;
const CAIXA = [-MARGEM, -MARGEM, 1080 + 2 * MARGEM, 1920 + MARGEM + SOBRA]; // x, y, largura, altura
const comSobra = (svg) => svg
  .replace('viewBox="0 0 1080 1920" width="1080" height="1920"', `viewBox="${CAIXA.join(' ')}" width="${CAIXA[2]}" height="${CAIXA[3]}"`)
  // A máscara do personagem (cenas-lib.py, pessoa) também recortava no quadro.
  .replace(/x="0" y="0" width="1080" height="1920"/g, `x="${CAIXA[0]}" y="${CAIXA[1]}" width="${CAIXA[2]}" height="${CAIXA[3]}"`);

const nav = await chromium.launch({ executablePath: chrome });
const pagina = await nav.newPage({ viewport: { width: 1080, height: 1920 } });
const foto = async (fichaCena, svg, destino, transparente) => {
  const [larg, alto] = transparente ? [CAIXA[2], CAIXA[3]] : [1080, 1920];
  await pagina.setViewportSize({ width: larg, height: alto });
  await pagina.setContent(`<!doctype html><html><body style="margin:0;background:${transparente ? 'transparent' : '#000'}"><div style="position:absolute;width:0;height:0;overflow:hidden">${fichaCena}</div>${transparente ? comSobra(svg) : svg}</body></html>`);
  await pagina.screenshot({ path: destino, omitBackground: transparente, clip: { x: 0, y: 0, width: larg, height: alto } });
};
const CAMADAS = {};
// Textura-base para o 3D: a fonte dinâmica aplica a iluminação uma única vez.
// As imagens iluminadas anteriores continuam disponíveis para o modo 2D.
for (const nome of fs.readdirSync(cenas).filter((n) => n.endsWith('.svg')).sort()) {
  const svg = recolorir(fs.readFileSync(path.join(cenas, nome), 'utf8'));
  const base = nome.replace(/\.svg$/, '');
  await foto(fichaDaCena(svg), svg, path.join(saida, `${base}.png`), false);
  const cam = separarCamadas(svg);
  if (cam) {
    // caixa: onde as camadas que se mexem ficam no espaço da cena (com as sobras). chao: os pés aparecem.
    const reg = { fundo: `assets/${base}-fundo.png`, pivo: cam.pivo, caixa: CAIXA, chao: cam.pivo[1] < 1900 };
    await foto(fichaDaCena(svg), cam.fundo, path.join(saida, `${base}-fundo.png`), false);
    if (cam.voce) {
      await foto(fichaDaCena(svg), cam.voce, path.join(saida, `${base}-voce.png`), true);
      reg.voce = `assets/${base}-voce.png`;
      await foto(fichaDaCena(svg), corBaseDoPersonagem(cam.voce), path.join(saida, `${base}-albedo.png`), true);
      reg.albedo = `assets/${base}-albedo.png`;
      // <!--sempisca--> desliga a piscada: no close extremo do olho ela vira um salto na tela.
      if (!svg.includes('<!--sempisca-->')) {
        await foto(fichaDaCena(svg, true), cam.voce, path.join(saida, `${base}-pisca.png`), true);
        reg.pisca = `assets/${base}-pisca.png`;
        await foto(fichaDaCena(svg, true), corBaseDoPersonagem(cam.voce), path.join(saida, `${base}-pisca-albedo.png`), true);
        reg.piscaAlbedo = `assets/${base}-pisca-albedo.png`;
      }
    }
    if (cam.frente) {
      await foto(fichaDaCena(svg), cam.frente, path.join(saida, `${base}-frente.png`), true);
      reg.frente = `assets/${base}-frente.png`;
    }
    CAMADAS[`assets/${base}.png`] = reg;
  }
  console.log(path.join(saida, `${base}.png`), cam ? '(camadas)' : '');
}
await nav.close();
// O template filmes lê este arquivo; nos outros templates ele é ignorado.
fs.writeFileSync(path.join(saida, 'camadas.js'), `const CAMADAS = ${JSON.stringify(CAMADAS, null, 1)};\n`);
