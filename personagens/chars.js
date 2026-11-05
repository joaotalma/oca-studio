'use strict';
// Se Vira, Tico — personagens em SVG parametrizado (frente, traço plano, contorno fixo)
const OUT = '#2b1a12', T = 6;           // cor e espessura visível do contorno
const DARK_MOUTH = '#5a1a18';
let _id = 0; const uid = () => 'c' + (++_id);
const r2 = n => Math.round(n * 100) / 100;
const rad = d => d * Math.PI / 180;

function rpoly(pts, r) {
  const n = pts.length; let d = '';
  const unit = (a, b) => { const dx = b[0]-a[0], dy = b[1]-a[1], l = Math.hypot(dx, dy) || 1; return [dx/l, dy/l]; };
  for (let i = 0; i < n; i++) {
    const p = pts[i], pr = pts[(i+n-1)%n], nx = pts[(i+1)%n];
    const v1 = unit(p, pr), v2 = unit(p, nx);
    const a = [p[0]+v1[0]*r, p[1]+v1[1]*r], b = [p[0]+v2[0]*r, p[1]+v2[1]*r];
    d += (i === 0 ? 'M' : 'L') + r2(a[0]) + ' ' + r2(a[1]) + ' Q' + r2(p[0]) + ' ' + r2(p[1]) + ' ' + r2(b[0]) + ' ' + r2(b[1]);
  }
  return d + 'Z';
}
const shape = (tag, a, fill, sw = T) => `<${tag} ${a} fill="${fill}" stroke="${OUT}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"/>`;
const union = (shapes, fill) => `<g>` +
  shapes.map(s => `<${s[0]} ${s[1]} fill="${OUT}" stroke="${OUT}" stroke-width="${T*2}" stroke-linejoin="round"/>`).join('') +
  shapes.map(s => `<${s[0]} ${s[1]} fill="${fill}"/>`).join('') + `</g>`;

function seg(x, y, ang, len, w, fill) {
  const ex = x + Math.sin(rad(ang)) * len, ey = y + Math.cos(rad(ang)) * len;
  return { x: ex, y: ey, svg:
    `<line x1="${r2(x)}" y1="${r2(y)}" x2="${r2(ex)}" y2="${r2(ey)}" stroke="${OUT}" stroke-width="${w+2*T}" stroke-linecap="round"/>` +
    `<line x1="${r2(x)}" y1="${r2(y)}" x2="${r2(ex)}" y2="${r2(ey)}" stroke="${fill}" stroke-width="${w}" stroke-linecap="round"/>` };
}
const ell = (P, th, rx, ry, cx, cy) => [cx + rx*Math.cos(rad(th)), cy - ry*Math.sin(rad(th))];

// ---------- expressões ----------
const EXPR = {
  neutro:       { brow:[0,0],   open:1, lid:{cover:.3, slant:0}, mouth:'flat' },
  feliz:        { brow:[-6,-4], open:1, lid:{cover:.12, slant:-2}, mouth:'smile' },
  rindo:        { brow:[-10,-12], eye:'happy', mouth:'laugh' },
  surpreso:     { brow:[-18,-20], open:1.2, wide:1.05, pupilScale:.7, mouth:'o' },
  preocupado:   { brow:[4,-14], open:1, lid:{cover:.14, slant:-7}, look:[0,-3], mouth:'wobble', details:['suor'] },
  envergonhado: { brow:[0,-12], open:.9, lid:{cover:.2, slant:-3}, look:[-8,10], mouth:'smallsmile', blush:1 },
  forcado:      { brow:[-8,-8], open:1.05, pupilScale:.65, mouth:'teeth', details:['suor'] },
  bravo:        { brow:[-6,12], open:1, lid:{cover:.38, slant:10}, mouth:'frown', details:['veia'] },
  triste:       { brow:[8,-12], open:.95, lid:{cover:.25, slant:-8}, look:[0,7], mouth:'frown', details:['lagrima'] },
  lado:         { brow:[0,-4], open:.95, lid:{cover:.3, slant:0}, look:[15,0], mouth:'smirk' },
  pensando:     { bl:[-4,-18], br:[3,1], open:1, lid:{cover:.18, slant:0}, look:[13,-12], mouth:'side' },
  aliviado:     { brow:[2,-8], eye:'soft', mouth:'smallsmile', details:['brilho'] },
};
const EXPR_ORDER = Object.keys(EXPR);
const VISEME = { closed:'flat', small:'vsmall', open:'vopen', wide:'vwide' };

function mouthSVG(kind, m) {
  const D = DARK_MOUTH, S = `stroke="${OUT}" stroke-width="${T-1}" stroke-linecap="round" stroke-linejoin="round"`;
  switch (kind) {
    case 'flat':  return `<path d="M${-m*.7} 0 Q0 ${m*.12} ${m*.7} 0" fill="none" ${S}/>`;
    case 'smile': return `<path d="M${-m} -2 Q0 ${m*.95} ${m} -2" fill="none" ${S}/>`;
    case 'smallsmile': return `<path d="M${-m*.6} 0 Q0 ${m*.5} ${m*.6} 0" fill="none" ${S}/>`;
    case 'laugh': return `<path d="M${-m*1.15} -6 Q0 ${m*2.3} ${m*1.15} -6 Z" fill="${D}" ${S}/>` +
                         `<path d="M${-m*1.0} -4 L${m*1.0} -4 L${m*.9} 5 Q0 ${m*.5} ${-m*.9} 5Z" fill="#fff"/>` +
                         `<ellipse cx="0" cy="${m*.95}" rx="${m*.55}" ry="${m*.3}" fill="#e8736f"/>`;
    case 'o':     return `<ellipse cx="0" cy="${m*.2}" rx="${m*.34}" ry="${m*.5}" fill="${D}" ${S}/>`;
    case 'frown': return `<path d="M${-m*.8} 8 Q0 ${-m*.5} ${m*.8} 8" fill="none" ${S}/>`;
    case 'wobble':return `<polyline points="${-m*.8},3 ${-m*.4},-4 0,3 ${m*.4},-4 ${m*.8},3" fill="none" ${S}/>`;
    case 'teeth': return `<rect x="${-m}" y="-9" width="${2*m}" height="22" rx="9" fill="#fff" ${S}/>` +
                          [-.5,0,.5].map(k=>`<line x1="${m*k}" y1="-9" x2="${m*k}" y2="13" stroke="${OUT}" stroke-width="2.5"/>`).join('') +
                          `<line x1="${-m}" y1="2" x2="${m}" y2="2" stroke="${OUT}" stroke-width="2.5"/>`;
    case 'smirk': return `<path d="M${-m*.7} 4 Q${m*.1} ${m*.3} ${m*.85} -9" fill="none" ${S}/>`;
    case 'side':  return `<ellipse cx="${m*.45}" cy="3" rx="${m*.26}" ry="${m*.2}" fill="none" ${S}/>`;
    case 'vsmall':return `<ellipse cx="0" cy="3" rx="${m*.38}" ry="${m*.3}" fill="${D}" ${S}/>`;
    case 'vopen': return `<ellipse cx="0" cy="6" rx="${m*.46}" ry="${m*.56}" fill="${D}" ${S}/><ellipse cx="0" cy="${m*.42+6}" rx="${m*.28}" ry="${m*.16}" fill="#e8736f"/>`;
    case 'vwide': return `<rect x="${-m*.9}" y="-8" width="${m*1.8}" height="${m*.8}" rx="${m*.34}" fill="${D}" ${S}/><rect x="${-m*.68}" y="-5" width="${m*1.36}" height="8" rx="3" fill="#fff"/>`;
  }
  return '';
}

function eyeSVG(side, d, cx, cy, e) {
  const ex = cx + side*d.eyeDx, ey = cy + d.eyeDy;
  const rx = d.eyeRx*(e.wide||1), ry = d.eyeRy*(e.open||1);
  const sw = T-1;
  if (e.eye === 'happy')
    return `<path d="M${r2(ex-rx)} ${ey+6} Q${ex} ${r2(ey-ry*1.25)} ${r2(ex+rx)} ${ey+6}" fill="none" stroke="${OUT}" stroke-width="${T+1}" stroke-linecap="round"/>`;
  if (e.eye === 'soft')
    return `<path d="M${r2(ex-rx)} ${ey-3} Q${ex} ${r2(ey+ry*.8)} ${r2(ex+rx)} ${ey-3}" fill="none" stroke="${OUT}" stroke-width="${T+1}" stroke-linecap="round"/>`;
  const id = uid();
  const look = (e.look || [0,0]).map(v => v*(d.k||1));
  let s = `<clipPath id="${id}"><ellipse cx="${ex}" cy="${ey}" rx="${rx}" ry="${ry}"/></clipPath>`;
  s += `<ellipse cx="${ex}" cy="${ey}" rx="${rx}" ry="${ry}" fill="#fff"/>`;
  const pr = d.pupilR*(e.pupilScale||1);
  const px = Math.max(-rx+pr+2, Math.min(rx-pr-2, look[0])), py = Math.max(-ry+pr+2, Math.min(ry-pr-2, look[1]));
  s += `<circle cx="${r2(ex+px)}" cy="${r2(ey+py)}" r="${r2(pr)}" fill="${OUT}"/><circle cx="${r2(ex+px+pr*.35)}" cy="${r2(ey+py-pr*.4)}" r="${r2(pr*.28)}" fill="#fff"/>`;
  if (e.lid) {
    const yl = ey - ry + 2*ry*e.lid.cover, k = e.lid.slant*(d.k||1);
    const xi = ex - side*rx*1.5, xo = ex + side*rx*1.5;
    const yi = yl + k, yo = yl - k;
    s += `<g clip-path="url(#${id})"><polygon points="${xo},${yo} ${xi},${yi} ${xi},${ey-ry-30} ${xo},${ey-ry-30}" fill="${d.skin}"/>` +
         `<line x1="${xo}" y1="${yo}" x2="${xi}" y2="${yi}" stroke="${OUT}" stroke-width="${sw}"/></g>`;
  }
  s += `<ellipse cx="${ex}" cy="${ey}" rx="${rx}" ry="${ry}" fill="none" stroke="${OUT}" stroke-width="${sw}"/>`;
  if (d.lashes) {
    const ox = ex + side*rx;
    s += [-1,0,1].map(i => `<line x1="${r2(ox)}" y1="${r2(ey-ry*.55+i*6)}" x2="${r2(ox+side*(11-Math.abs(i)*2))}" y2="${r2(ey-ry*.85+i*8)}" stroke="${OUT}" stroke-width="4.5" stroke-linecap="round"/>`).join('');
  }
  if (d.bags) s += `<path d="M${r2(ex-rx*.8)} ${r2(ey+ry+9)} Q${ex} ${r2(ey+ry+19)} ${r2(ex+rx*.8)} ${r2(ey+ry+9)}" fill="none" stroke="${d.bagsC}" stroke-width="4" stroke-linecap="round"/>`;
  return s;
}

function browSVG(side, d, cx, cy, e) {
  const o = side < 0 ? (e.bl || e.brow) : (e.br || e.brow);
  const kk = d.k||1; const base = cy + d.eyeDy - d.eyeRy - 17*kk + (d.browDy||0);
  const xo = cx + side*(d.eyeDx + 28*kk), xi = cx + side*(d.eyeDx - 26*kk);
  return `<line x1="${r2(xo)}" y1="${r2(base+o[0]*kk)}" x2="${r2(xi)}" y2="${r2(base+o[1]*kk)}" stroke="${d.browC}" stroke-width="${d.browW}" stroke-linecap="round"/>`;
}

function detailsSVG(list, d, cx, cy) {
  let s = '';
  for (const k of list || []) {
    if (k === 'suor') s += `<path d="M${cx+d.headRx*.78} ${cy-d.headRy*.55} q16 24 0 38 q-16 -14 0 -38z" fill="#7fd6ee" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/>`;
    if (k === 'lagrima') s += `<path d="M${cx-d.eyeDx-4} ${cy+d.eyeDy+d.eyeRy+4} q14 26 0 40 q-16 -14 0 -40z" fill="#7fd6ee" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/>`;
    if (k === 'veia') { const vx = cx+d.headRx*.5, vy = cy-d.headRy*.62;
      s += `<g stroke="#d6281e" stroke-width="6" stroke-linecap="round" fill="none"><path d="M${vx} ${vy} q10 0 10 -12 M${vx} ${vy} q10 0 12 12 M${vx} ${vy} q-10 0 -10 -12 M${vx} ${vy} q-10 0 -12 12"/></g>`; }
    if (k === 'brilho') { const bx = cx-d.headRx*.95, by = cy-d.headRy*.7;
      s += `<path d="M${bx} ${by-26} Q${bx+4} ${by-4} ${bx+26} ${by} Q${bx+4} ${by+4} ${bx} ${by+26} Q${bx-4} ${by+4} ${bx-26} ${by} Q${bx-4} ${by-4} ${bx} ${by-26}z" fill="#ffe36a" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/>`; }
  }
  return s;
}

// ---------- cabelo ----------
function hairCap(d, cx, cy, cover, hairline) {
  const rx = d.headRx*1.045, ry = d.headRy*1.045;
  const a = ell(0, 180-cover, rx, ry, cx, cy), b = ell(0, cover, rx, ry, cx, cy);
  return shape('path', `d="M${r2(a[0])} ${r2(a[1])} A${rx} ${ry} 0 0 1 ${r2(b[0])} ${r2(b[1])} Q${cx} ${r2(cy-ry*hairline)} ${r2(a[0])} ${r2(a[1])}Z"`, d.hair);
}
function hairBack(d, cx, cy) {
  if (d.hairStyle === 'puff') {
    const sh = [];
    for (let th = 5; th <= 175; th += 17) { const p = ell(0, th, d.headRx*1.02, d.headRy*1.0, cx, cy); sh.push(['circle', `cx="${r2(p[0])}" cy="${r2(p[1]-(th>60&&th<120?14*d.k:0))}" r="${r2((th>60&&th<120?72:60)*d.k*1.08)}"`]); }
    sh.push(['circle', `cx="${cx-d.headRx*1.1}" cy="${cy+8}" r="${r2(52*d.k*1.1)}"`], ['circle', `cx="${cx+d.headRx*1.1}" cy="${cy+8}" r="${r2(52*d.k*1.1)}"`]);
    return union(sh, d.hair);
  }
  if (d.hairStyle === 'wave') {
    const sh = [], k = d.k*1.1;
    for (let th = 0; th <= 180; th += 22) { const p = ell(0, th, d.headRx*1.03, d.headRy*1.02, cx, cy); sh.push(['circle', `cx="${r2(p[0])}" cy="${r2(p[1])}" r="${r2(34*k)}"`]); }
    const yb = cy + d.headRy + (d.neckL||24) + 95;
    for (const sd of [-1,1]) for (let y = cy - 20, i = 0; y <= yb; y += 38*k, i++) sh.push(['circle', `cx="${r2(cx + sd*(d.headRx*1.0 + (i%2 ? 12 : 2)*k))}" cy="${r2(y)}" r="${r2((i%2?40:36)*k)}"`]);
    return union(sh, d.hair);
  }
  if (d.hairStyle === 'pony') {
    const x0 = cx + d.headRx*.55, y0 = cy - d.headRy*.95;
    const sh = [['path', `d="M${r2(x0)} ${r2(y0)} C${r2(x0+110)} ${r2(y0-110)} ${r2(x0+190)} ${r2(y0-10)} ${r2(x0+120)} ${r2(y0+120)} C${r2(x0+140)} ${r2(y0+20)} ${r2(x0+70)} ${r2(y0-50)} ${r2(x0-30)} ${r2(y0+10)}Z"`]];
    return `<g transform="translate(${r2(x0)} ${r2(y0)}) scale(${d.k*1.15}) translate(${-r2(x0)} ${-r2(y0)})">` + union(sh, d.hair) + `</g>`;
  }
  return '';
}
function scrunchie(d, cx, cy) {
  const x0 = cx + d.headRx*.55, y0 = cy - d.headRy*.95, k = d.k*1.15;
  return `<g transform="translate(${r2(x0+14*k)} ${r2(y0-2*k)}) rotate(-38) scale(${r2(k)})">` +
    shape('path', 'd="M-26 0 Q-24 -16 -8 -14 Q0 -20 10 -14 Q26 -16 26 0 Q26 16 10 14 Q0 20 -8 14 Q-24 16 -26 0Z"', '#e5532d') +
    `<path d="M-12 -8 Q0 -2 -12 8 M8 -9 Q18 0 8 9" fill="none" stroke="${OUT}" stroke-width="3" stroke-linecap="round" opacity=".5"/></g>`;
}
function hairFront(d, cx, cy) {
  if (d.hairStyle === 'tufts') { // Tico: topete bagunçado e para cima
    const y0 = cy - d.headRy*1.0, k = d.k*1.1;
    const t = (dx, rot, sc) => `<g transform="translate(${r2(cx+dx*k)} ${r2(y0+6)}) rotate(${rot}) scale(${r2(k*sc)})">` + shape('path', 'd="M-20 8 Q-26 -34 4 -56 Q2 -26 22 -4 Z"', d.hair) + `</g>`;
    return t(-30,-24,.85) + t(2,6,1.1) + t(34,34,.8) + hairCap(d, cx, cy, 33, .56);
  }
  if (d.hairStyle === 'cap')   // Tico: bagunçado + redemoinho
    return hairCap(d, cx, cy, 33, .56) +
      `<g transform="translate(${cx} ${r2(cy-d.headRy)}) scale(${d.k*1.1}) translate(${-cx} ${-r2(cy-d.headRy)})">` + shape('path', `d="M${cx-6} ${r2(cy-d.headRy*1.0)} q-4 -34 26 -44 q-6 22 8 30 q14 6 -2 16z"`, d.hair) + `</g>`;
  if (d.hairStyle === 'buzz')  // Jão: raspado + bandana
    return hairCap(d, cx, cy, 30, .5) +
      shape('path', `d="M${cx-d.headRx*1.0} ${r2(cy-d.headRy*.46)} Q${cx} ${r2(cy-d.headRy*.7)} ${cx+d.headRx*1.0} ${r2(cy-d.headRy*.46)} l0 26 Q${cx} ${r2(cy-d.headRy*.42)} ${cx-d.headRx*1.0} ${r2(cy-d.headRy*.2)}Z"`, '#e5532d') +
      shape('path', `d="M${cx+d.headRx*.95} ${r2(cy-d.headRy*.4)} l34 -6 l-6 18 l22 10 l-34 4z"`, '#e5532d');
  if (d.hairStyle === 'pony')  // Bia: liso, risca de lado + elástico
    return hairCap(d, cx, cy, 26, .66) + scrunchie(d, cx, cy);
  if (d.hairStyle === 'wave') { // Lua: franja de lado, ondas
    const rx = d.headRx*1.045, ry = d.headRy*1.045, a = ell(0,150,rx,ry,cx,cy), b = ell(0,25,rx,ry,cx,cy);
    return shape('path', `d="M${r2(a[0])} ${r2(a[1])} A${rx} ${ry} 0 0 1 ${r2(b[0])} ${r2(b[1])} Q${r2(cx+30)} ${r2(cy-ry*.3)} ${r2(cx-8)} ${r2(cy-ry*.68)} Q${r2(cx-40)} ${r2(cy-ry*.62)} ${r2(a[0])} ${r2(a[1])}Z"`, d.hair);
  }
  if (d.hairStyle === 'puff') { // Lua: cachinhos na testa
    const sh = [-60,-26,10,44,74].map((x,i)=>['circle', `cx="${cx+x*d.k*1.1}" cy="${cy-d.headRy*.9+Math.abs(x)*.2*d.k}" r="${r2((i%2?19:23)*d.k*1.1)}"`]);
    return union(sh, d.hair);
  }
  return '';
}

// ---------- adereços ----------
function propSVG(kind, x, y) {
  if (kind === 'phone') return `<g transform="translate(${x} ${y}) rotate(-12)">${shape('rect', 'x="-16" y="-40" width="32" height="54" rx="7"', '#33414f')}<rect x="-11" y="-34" width="22" height="38" rx="3" fill="#9fe3ff"/></g>`;
  if (kind === 'cup')   return `<g transform="translate(${x} ${y-10}) scale(1.4)">${shape('path', 'd="M-18 -34 L18 -34 L14 6 Q0 12 -14 6Z"', '#fff3d6')}<path d="M18 -26 q18 2 12 16 q-4 6 -14 6" fill="none" stroke="${OUT}" stroke-width="5" stroke-linecap="round"/><path d="M-6 -48 q-8 -10 0 -20 M8 -48 q-8 -10 0 -20" fill="none" stroke="#c9b9a6" stroke-width="4" stroke-linecap="round"/></g>`;
  if (kind === 'fist')  return '';
  return '';
}

// ---------- personagem ----------
const CHARS = {
  tico: { name:'Tico', H:590, k:.74, headRx:75, headRy:88, skin:'#c48a60', noseC:'#b3794f', hair:'#3d2a1d', hairStyle:'tufts', sleeve:.5, ex:{neutro:{brow:[-5,-7],lid:null,mouth:'smile'},lado:{brow:[-2,-8]},pensando:{brow:[-6,-18]}},
    eyeDx:31, eyeDy:4, eyeRx:14, eyeRy:13, pupilR:5.4, browC:'#2b1d14', browW:7, mouthW:26, mouthK:.82, mouthDy:.56, noseK:.72, neckL:22,  torso:{tw:66,bw:62,h:172}, hipW:26, armW:19, legW:25, armLen:118, shoe:'chinelo',
    shirt:'#a9c23a', pants:'#41667a', accent:'#7f9419', neckW:30 },
  lua:  { name:'Lua', H:548, k:.72, headRx:69, headRy:85, skin:'#f3d0b0', noseC:'#e2ab88', hair:'#e0b04e', hairStyle:'wave', blushAlways:true,
    eyeDx:29, eyeDy:3, eyeRx:15, eyeRy:14.5, pupilR:5.8, browC:'#9a6c2a', browW:5, mouthW:26, mouthK:.8, mouthDy:.56, noseK:.64, neckL:22, lashes:true,
    torso:{tw:56,bw:74,h:162}, hipW:30, armW:18, legW:24, armLen:108, shoe:'sapato',
    shirt:'#19a8a3', pants:'#3b3a52', accent:'#0f7f7c', neckW:28, lanyard:true },
  jao:  { name:'Jão', H:532, k:.74, headRx:84, headRy:87, skin:'#8a5a3b', noseC:'#774a2f', hair:'#33241b', beardC:'#5a4030', hairStyle:'buzz',
    eyeDx:33, eyeDy:3, eyeRx:13.5, eyeRy:12, pupilR:5.2, browC:'#2b1a12', browW:11, mouthW:26, mouthK:.82, mouthDy:.54, noseK:.82, neckL:20, beard:true, browDy:-1,
    torso:{tw:98,bw:90,h:176}, hipW:34, armW:27, sleeve:.9, legW:31, armLen:108, shoe:'bota',
    shirt:'#d9502b', pants:'#2e2a2a', accent:'#aa3815', neckW:50, bag:true },
  bia:  { name:'Bia', H:622, k:.7, headRx:68, headRy:84, skin:'#e0aa84', noseC:'#d0996f', hair:'#b9803e', hairStyle:'pony',
    eyeDx:29, eyeDy:3, eyeRx:15, eyeRy:14.5, pupilR:5.8, browC:'#8a5a28', browW:6, mouthW:26, mouthK:.82, mouthDy:.56, noseK:.5, neckL:20, lashes:true,
    torso:{tw:52,bw:48,h:178}, hipW:24, armW:18, sleeve:.88, legW:19, armLen:126, shoe:'tenis',
    shirt:'#eaab2a', pants:'#e0aa84', legColor:'#e0aa84', skirt:'#fff6e6', accent:'#c98a0e', neckW:26, blazer:true },
};

function drawChar(d, pose = {}) {
  const P = Object.assign({ armL:[-10,-6], armR:[10,6], legL:[-3,-2], legR:[3,2], lean:0, expr:'neutro', mouth:null, details:null, propL:null, propR:null }, pose);
  const E = Object.assign({}, EXPR[P.expr], (d.ex||{})[P.expr]), cx = 0;
  const blushA = d.blushAlways;
  const headCy = -(d.H - d.headRy);
  const shoulderY = headCy + d.headRy + (d.neckL||24);
  const ty = shoulderY - 16, by = ty + d.torso.h, hipY = by - 14;
  const ANK = 20, segLen = (-hipY - ANK) / 2;      // tornozelo a 20 px do chão com a perna reta
  let s = `<g>`;
  const P2 = (x, y, ang, len) => [x + Math.sin(rad(ang))*len, y + Math.cos(rad(ang))*len];
  // Regra de montagem: peças da MESMA cor viram uma silhueta só (contorno por baixo, preenchimento por cima),
  // então não há linha de emenda na junta. Peças de cor diferente se encaixam por "manga/barra" com ponta redonda.
  const itemSVG = (it, mode, fill) => {
    const o = mode === 'o', f = o ? OUT : fill, sw = o ? ` stroke="${OUT}" stroke-width="${T*2}" stroke-linejoin="round"` : '';
    if (it.d) return `<path d="${it.d}" fill="${f}"${sw}/>`;
    if (it.c) return `<circle cx="${r2(it.c[0])}" cy="${r2(it.c[1])}" r="${r2(it.r)}" fill="${f}"${sw}/>`;
    if (it.e) return `<ellipse cx="${r2(it.e[0])}" cy="${r2(it.e[1])}" rx="${r2(it.e[2])}" ry="${r2(it.e[3])}" transform="rotate(${r2(it.e[4])} ${r2(it.e[0])} ${r2(it.e[1])})" fill="${f}"${sw}/>`;
    return `<line x1="${r2(it.p[0])}" y1="${r2(it.p[1])}" x2="${r2(it.q[0])}" y2="${r2(it.q[1])}" stroke="${o?OUT:fill}" stroke-width="${o?it.w+2*T:it.w}" stroke-linecap="round"/>`;
  };
  const merge = (items, fill) => items.map(it => itemSVG(it, 'o', fill)).join('') + items.map(it => itemSVG(it, 'f', fill)).join('');
  const dirv = a => [Math.sin(rad(a)), Math.cos(rad(a))];
  const nrm = (u, side) => { const n = [-u[1], u[0]]; return n[0]*side < 0 ? [-n[0], -n[1]] : n; };
  const add = (p, u, k) => [p[0]+u[0]*k, p[1]+u[1]*k];
  const quad = (p, q, wp, wq) => { const u = [q[0]-p[0], q[1]-p[1]], L = Math.hypot(u[0],u[1])||1, n = [-u[1]/L, u[0]/L];
    return `M${r2(p[0]+n[0]*wp)} ${r2(p[1]+n[1]*wp)}L${r2(q[0]+n[0]*wq)} ${r2(q[1]+n[1]*wq)}L${r2(q[0]-n[0]*wq)} ${r2(q[1]-n[1]*wq)}L${r2(p[0]-n[0]*wp)} ${r2(p[1]-n[1]*wp)}Z`; };
  // pernas: coxa + canela em uma peça só; o pé cobre a ponta
  const BO = { chinelo:15, tenis:6, bota:4, sapato:6 };
  const leg = (side, a) => {
    const lc = d.legColor || d.pants, hx = side*d.hipW, h0 = [hx, hipY];
    const k1 = P2(hx, hipY, a[0], segLen), an = P2(k1[0], k1[1], a[1], segLen);
    const w0 = d.legW*.5, wk = d.legW*.45, wa = d.legW*.4;
    let g = merge([{d:quad(h0,k1,w0,wk)}, {c:k1,r:wk}, {d:quad(k1,an,wk,wa)}, {c:an,r:wa}], lc);
    const fx = an[0] + side*4, fy = an[1] + ANK - (BO[d.shoe]||6);
    if (d.shoe === 'chinelo') g += shape('ellipse', `cx="${fx}" cy="${fy+4}" rx="29" ry="11"`, '#e9c46a') + shape('ellipse', `cx="${fx}" cy="${fy-1}" rx="19" ry="8"`, d.skin, 4) + `<path d="M${fx-12} ${fy-8} q12 -10 24 0" fill="none" stroke="#e5532d" stroke-width="7" stroke-linecap="round"/>`;
    else if (d.shoe === 'tenis') g += shape('path', `d="M${fx-20} ${fy-12} q22 -8 40 0 q10 6 8 18 l-52 0z"`, '#fff') + `<line x1="${fx-26}" y1="${fy+2}" x2="${fx+28}" y2="${fy+2}" stroke="${d.accent}" stroke-width="4"/>`;
    else if (d.shoe === 'bota') g += shape('path', `d="M${fx-22} ${fy-16} l38 0 q16 6 16 20 l-62 0z"`, '#3a2a22');
    else g += shape('path', `d="M${fx-22} ${fy-12} q26 -10 46 0 q8 8 4 18 l-56 0z"`, '#5a3c4a');
    return g;
  };
  s += leg(-1, P.legL) + leg(1, P.legR);
  if (d.skirt) s += shape('path', rpoly([[-d.hipW-22,by-26],[d.hipW+22,by-26],[d.hipW+34,by+72],[-d.hipW-34,by+72]], 12).replace(/^/, 'd="').concat('"'), d.skirt);
  // tronco/cabeça/braços giram juntos
  s += `<g transform="rotate(${P.lean} 0 ${r2(hipY)})">`;
  if (d.bag) s += shape('rect', `x="-92" y="${r2(shoulderY-62)}" width="184" height="176" rx="20"`, '#f29a2e') + `<rect x="-92" y="${r2(shoulderY+14)}" width="184" height="20" fill="#fff3d6" stroke="${OUT}" stroke-width="${T}"/>`;
  s += hairBack(d, cx, headCy);
  // pescoço
  s += shape('rect', `x="${-d.neckW/2}" y="${r2(headCy+d.headRy-22)}" width="${d.neckW}" height="${r2(shoulderY-(headCy+d.headRy)+34)}" rx="8"`, d.skin);
  // tronco + mangas = uma silhueta só (ombro sem emenda)
  const tw = d.torso.tw, bw = d.torso.bw;
  const torsoD = rpoly([[-tw,ty],[tw,ty],[bw,by],[-bw,by]], 26);
  const A = {};
  for (const [side, a] of [[-1, P.armL], [1, P.armR]]) {
    const sh = [side*(tw-6), shoulderY+6], u1 = dirv(a[0]), u2 = dirv(a[1]), L1 = d.armLen, L2 = d.armLen*.92;
    const el = add(sh, u1, L1), wr = add(el, u2, L2);
    A[side] = { sh, el, wr, u1, u2, n: nrm(u1, side), a };
  }
  s += shape('path', `d="${torsoD}"`, d.shirt);
  if (d.blazer) s += shape('path', `d="M${-tw+4} ${ty+6} L0 ${ty+78} L${tw-4} ${ty+6} L${tw-18} ${ty+6} L0 ${ty+46} L${-tw+18} ${ty+6}Z"`, '#fff6e6') + `<line x1="0" y1="${ty+78}" x2="0" y2="${by-10}" stroke="${OUT}" stroke-width="${T-2}"/>`;
  if (d.lanyard) s += `<path d="M-26 ${ty+4} L0 ${ty+88} L26 ${ty+4}" fill="none" stroke="#f2b632" stroke-width="7" stroke-linejoin="round"/>` + shape('rect', `x="-16" y="${ty+84}" width="32" height="42" rx="6"`, '#fff');
  if (d.bag) s += `<line x1="${-tw+20}" y1="${ty}" x2="${-bw+16}" y2="${by}" stroke="${d.accent}" stroke-width="9"/><line x1="${tw-20}" y1="${ty}" x2="${bw-16}" y2="${by}" stroke="${d.accent}" stroke-width="9"/>`;
  if (d.name === 'Tico') s += `<path d="M-14 ${ty+2} q14 20 28 0" fill="none" stroke="${OUT}" stroke-width="${T-1}"/>` + `<rect x="-26" y="${ty+60}" width="52" height="8" rx="4" fill="${d.accent}" opacity=".9"/>`;
  const sl = d.sleeve || .8, W = d.armW;
  // 1) manga: forma fechada; a cava (costura do ombro) liga o contorno do tronco à axila
  const cuff = {};
  for (const side of [-1, 1]) {
    const { sh, u1 } = A[side];
    let n = [-u1[1], u1[0]];
    if (Math.abs(u1[1]) > .8) { if (n[0]*side < 0) n = [-n[0], -n[1]]; } else if (n[1] > 0) n = [-n[0], -n[1]];
    const hs = W*.62, hc = W*.55, Lc = d.armLen*sl;
    const Cc = add(sh, u1, Lc);
    cuff[side] = { Cc, n };
    const Pt = [side*(tw-3), ty+7], Co = add(Cc, n, hc), Ci = add(Cc, n, -hc);
    const Pa = [side*(tw - hs*1.3), ty + 46];
    const C = [(Pt[0]+Pa[0])/2 - side*hs*.9, (Pt[1]+Pa[1])/2 - 4];
    const dd = `M${r2(Pt[0])} ${r2(Pt[1])}L${r2(Co[0])} ${r2(Co[1])}L${r2(Ci[0])} ${r2(Ci[1])}L${r2(Pa[0])} ${r2(Pa[1])}Q${r2(C[0])} ${r2(C[1])} ${r2(Pt[0])} ${r2(Pt[1])}Z`;
    s += `<path d="${dd}" fill="${d.shirt}" stroke="${OUT}" stroke-width="${T}" stroke-linejoin="round"/>`;
  }
  // 2) braço de pele POR CIMA da manga: trecho cuff→cotovelo é cortado na linha do punho; antebraço e mão ficam à frente
  for (const side of [-1, 1]) {
    const { el, wr, u1, u2, a } = A[side], prop = side < 0 ? P.propL : P.propR, { Cc, n } = cuff[side];
    const hd = add(wr, u2, W*.5), id = uid(), o = add(Cc, u1, T/2 + 1);
    const big = 600, rect = [add(o, n, big), add(o, n, -big), add(add(o, n, -big), u1, big), add(add(o, n, big), u1, big)];
    s += `<clipPath id="${id}"><path d="M${rect.map(p => r2(p[0])+' '+r2(p[1])).join('L')}Z"/></clipPath>`;
    const upper = [{d:quad(Cc,el,W*.4,W*.4)}], fore = [{c:el,r:W*.4}, {d:quad(el,wr,W*.4,W*.34)}, {e:[hd[0],hd[1],W*.74,W*.98,-a[1]]}];
    if (prop === 'cup') s += propSVG(prop, hd[0], hd[1]);
    s += `<g clip-path="url(#${id})">` + upper.map(it => itemSVG(it, 'o', d.skin)).join('') + `</g>` + fore.map(it => itemSVG(it, 'o', d.skin)).join('');
    s += `<g clip-path="url(#${id})">` + upper.map(it => itemSVG(it, 'f', d.skin)).join('') + `</g>` + fore.map(it => itemSVG(it, 'f', d.skin)).join('');
    if (prop && prop !== 'cup') s += propSVG(prop, hd[0], hd[1]);
  }
  // cabeça
  s += `<g>`;
  s += shape('ellipse', `cx="${-d.headRx}" cy="${headCy+d.headRy*.14}" rx="${r2(d.headRy*.12)}" ry="${r2(d.headRy*.2)}"`, d.skin) + shape('ellipse', `cx="${d.headRx}" cy="${headCy+d.headRy*.14}" rx="${r2(d.headRy*.12)}" ry="${r2(d.headRy*.2)}"`, d.skin);
  s += shape('ellipse', `cx="${cx}" cy="${headCy}" rx="${d.headRx}" ry="${d.headRy}"`, d.skin);
  if (E.blush || d.blushAlways) s += [-1,1].map(k=>`<ellipse cx="${k*(d.eyeDx+10)}" cy="${headCy+d.headRy*.4}" rx="${r2(22*d.k)}" ry="${r2(12*d.k)}" fill="#e8736f" opacity="${E.blush?.55:.28}"/>`).join('');
  s += eyeSVG(-1, d, cx, headCy, E) + eyeSVG(1, d, cx, headCy, E);
  s += browSVG(-1, d, cx, headCy, E) + browSVG(1, d, cx, headCy, E);
  { const nk = d.noseK||1, ny = headCy + d.headRy*.3;
    s += shape('path', `d="M${-16*nk} ${r2(ny+2*nk)} Q${-20*nk} ${r2(ny+16*nk)} ${-8*nk} ${r2(ny+20*nk)} Q0 ${r2(ny+25*nk)} ${8*nk} ${r2(ny+20*nk)} Q${20*nk} ${r2(ny+16*nk)} ${16*nk} ${r2(ny+2*nk)} Q0 ${r2(ny-6*nk)} ${-16*nk} ${r2(ny+2*nk)}Z"`, d.noseC||d.skin, 4.5);
    if (d.lines) { const my = headCy + d.headRy*d.mouthDy;
      s += [-1,1].map(k=>`<path d="M${k*20*nk} ${r2(ny+10*nk)} Q${k*(28*nk+6)} ${r2((ny+my)/2)} ${k*(d.mouthW*(d.mouthK||1)+10)} ${r2(my-2)}" fill="none" stroke="${OUT}" stroke-width="2.6" stroke-linecap="round" opacity=".28"/>`).join('');
      s += `<path d="M${-30*d.k} ${r2(headCy-d.headRy*.6)} q${30*d.k} -8 ${60*d.k} 0" fill="none" stroke="${OUT}" stroke-width="2.4" stroke-linecap="round" opacity=".22"/>`; }
  }
  if (d.beard) s += shape('path', `d="M${r2(ell(0,222,d.headRx,d.headRy,0,headCy)[0])} ${r2(ell(0,222,d.headRx,d.headRy,0,headCy)[1])} A${d.headRx} ${d.headRy} 0 0 0 ${r2(ell(0,318,d.headRx,d.headRy,0,headCy)[0])} ${r2(ell(0,318,d.headRx,d.headRy,0,headCy)[1])} Q0 ${r2(headCy+d.headRy*.64)} ${r2(ell(0,222,d.headRx,d.headRy,0,headCy)[0])} ${r2(ell(0,222,d.headRx,d.headRy,0,headCy)[1])}Z"`, d.beardC);
  s += `<g transform="translate(0 ${r2(headCy + d.headRy*d.mouthDy)}) scale(${d.mouthK||1})">${mouthSVG(P.mouth ? VISEME[P.mouth] : E.mouth, d.mouthW)}</g>`;
  s += hairFront(d, cx, headCy);
  s += detailsSVG(P.details || E.details, d, cx, headCy);
  s += `</g></g></g>`;
  return s;
}

// ---------- Fiscal (cachorro) ----------
function drawDog(state = 'stand') {
  const C = '#d29a52', C2 = '#b87d3a', L = '#f4e0b8', EAR = '#8b5a2b';
  const barking = state === 'latindo', alert = state === 'alerta';
  let s = '<g>';
  const stroke = (d, w, col) => `<path d="${d}" fill="none" stroke="${OUT}" stroke-width="${w+2*T}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;
  // rabo (para cima, balançando)
  s += stroke(alert ? 'M-104 -128 Q-150 -150 -146 -214' : 'M-104 -128 Q-160 -130 -150 -196', 20, C2);
  // pernas de trás e da frente (as do lado de longe mais escuras)
  const leg = (x, col) => `<rect x="${x-13}" y="-84" width="26" height="70" rx="12" fill="${OUT}" stroke="${OUT}" stroke-width="${T*2}" stroke-linejoin="round"/><rect x="${x-13}" y="-84" width="26" height="70" rx="12" fill="${col}"/>` + shape('ellipse', `cx="${x+3}" cy="-12" rx="22" ry="10"`, L);
  s += leg(-62, C2) + leg(66, C2) + leg(-92, C) + leg(96, C);
  // corpo
  s += shape('ellipse', 'cx="0" cy="-122" rx="118" ry="54"', C);
  s += `<path d="M-60 -92 Q0 -70 74 -92 Q0 -76 -60 -92Z" fill="${L}" stroke="${L}" stroke-width="22" stroke-linejoin="round"/>`;
  // cabeça
  const hx = 112, hy = barking ? -190 : alert ? -186 : -174, rot = barking ? -10 : 0;
  s += `<g transform="rotate(${rot} ${hx} ${hy+20})">`;
  s += union([['circle', `cx="${hx}" cy="${hy}" r="54"`], ['ellipse', `cx="${hx+50}" cy="${hy+16}" rx="44" ry="29"`]], C);
  s += `<ellipse cx="${hx+54}" cy="${hy+24}" rx="34" ry="19" fill="${L}"/>`;
  s += shape('ellipse', `cx="${hx+90}" cy="${hy+6}" rx="13" ry="10"`, '#2b1a12', 4);
  s += shape('path', `d="M${hx-36} ${hy-42} Q${hx+4} ${hy-44} ${hx-4} ${hy+24} Q${hx-26} ${hy+18} ${hx-44} ${hy-12}Z"`, EAR);   // orelha caída
  s += `<circle cx="${hx+34}" cy="${hy-6}" r="${alert?13:11}" fill="#fff" stroke="${OUT}" stroke-width="4"/><circle cx="${hx+37}" cy="${hy-5}" r="5.5" fill="${OUT}"/>`;
  s += `<path d="M${hx+20} ${hy-26} q14 -8 30 -2" fill="none" stroke="${OUT}" stroke-width="5" stroke-linecap="round"/>`;
  if (barking) s += `<path d="M${hx+52} ${hy+36} Q${hx+78} ${hy+66} ${hx+100} ${hy+34}" fill="#e8736f" stroke="${OUT}" stroke-width="5" stroke-linejoin="round"/><path d="M${hx+40} ${hy+34} L${hx+98} ${hy+30}" stroke="${OUT}" stroke-width="5" stroke-linecap="round"/>`;
  else s += `<path d="M${hx+46} ${hy+36} q22 8 46 -4" fill="none" stroke="${OUT}" stroke-width="5" stroke-linecap="round"/>`;
  s += `</g>`;
  if (barking) s += `<g fill="none" stroke="${OUT}" stroke-width="6" stroke-linecap="round"><path d="M${hx+136} ${hy-34} q28 -8 44 12"/><path d="M${hx+148} ${hy+0} q30 6 50 -8"/><path d="M${hx+138} ${hy+32} q24 14 42 2"/></g>`;
  // só a medalhinha
  s += `<circle cx="${hx-14}" cy="${hy+62}" r="10" fill="#f2b632" stroke="${OUT}" stroke-width="4"/>`;
  return s + '</g>';
}

module.exports = { CHARS, EXPR, EXPR_ORDER, drawChar, drawDog, OUT };
