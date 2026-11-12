'use strict';
/* Porta do Conjunto Esperança, versão de estudo: mais profundidade, material e luz motivada.
   Preserva o que a cena original já tem (prédios do fundo, fios, reboco, placas "CONJUNTO ESPERANÇA",
   "Bloco 4" e "Proibido latir", vaso e lixeira) e acrescenta só objetos que pertencem ao lugar: marquise,
   batente com espessura, degraus, interfone, caixas de correio, janela gradeada, cano, rodapé de azulejo,
   calçada em perspectiva e a luz do sol (dia) ou do poste (noite). Mesmo formato de CENARIOS: camadas {f, svg}. */
const CenarioRico = (() => {
  const pr = (n) => r2(n).toString();
  function portaConjunto(dia) {
    const k = dia ? 'd' : 'n';
    // ---------- fundo: céu em gradiente, nuvens ou estrelas, prédios com névoa de distância ----------
    let fundo = `<defs><linearGradient id="crCeu${k}" x1="0" y1="0" x2="0" y2="1">`
      + (dia ? '<stop offset="0" stop-color="#7fc3e8"/><stop offset=".62" stop-color="#cdeaf4"/><stop offset="1" stop-color="#fbe6c2"/>'
        : '<stop offset="0" stop-color="#121c33"/><stop offset=".7" stop-color="#34395a"/><stop offset="1" stop-color="#5e5170"/>')
      + `</linearGradient><linearGradient id="crNevoa${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${dia ? '#fbe6c2' : '#5e5170'}" stop-opacity="0"/><stop offset="1" stop-color="${dia ? '#fbe6c2' : '#5e5170'}" stop-opacity=".55"/></linearGradient></defs>`;
    fundo += `<rect x="-900" y="-600" width="3900" height="2600" fill="url(#crCeu${k})"/>`;
    if (dia) for (const [x, y, s] of [[-120, 120, 1], [420, 60, .8], [900, 150, 1.1], [1400, 90, .9]])
      fundo += `<g transform="translate(${x} ${y}) scale(${s})" opacity=".9">` + ell(0, 0, 90, 30, '#fffaf0') + ell(-60, 10, 60, 24, '#fffaf0') + ell(70, 12, 70, 22, '#f4f0e6') + '</g>';
    else for (let i = 0; i < 40; i++) fundo += `<circle cx="${(i * 191) % 2200 - 500}" cy="${(i * 113) % 420 - 40}" r="${1.2 + i % 3 * .8}" fill="#fff4d6" opacity="${.45 + (i % 4) * .12}"/>`;
    if (!dia) fundo += ell(860, 60, 46, 46, '#fff1c9') + ell(842, 50, 40, 40, '#2a3150', 'none', 0, 'opacity=".9"');
    fundo += predios(dia ? '#e2b06c' : '#2c3a4f', dia ? '#cf9558' : '#233044', dia ? ['#8a5a2e', '#9a6a3e', '#fff3d6'] : ['#f2d36b', '#1b2533', '#1b2533', '#e8b85a'], 'none');
    fundo += `<rect x="-900" y="200" width="3900" height="700" fill="url(#crNevoa${k})"/>`;

    // ---------- meio: a fachada do bloco ----------
    const parede = dia ? '#e08a52' : '#8a5038', paredeSombra = dia ? '#c9743f' : '#6e3d2b', azulejo = dia ? '#e9e2cf' : '#8f8a80';
    let meio = FIOS + ret(-300, 560, 1700, 1100, parede, 0);
    meio += reboco([[60, 640, 160, 60], [820, 700, 150, 60], [120, 1180, 120, 50], [880, 1250, 110, 50], [420, 610, 100, 40]], paredeSombra);
    // tijolo aparente num buraco do reboco
    meio += `<g opacity=".8">` + ret(840, 905, 130, 70, '#b55b3a', 10, 0) + [0, 1, 2].map(i => stroke(`M846 ${922 + i * 18} L964 ${922 + i * 18}`, '#8e4129', 2)).join('') + stroke('M880 905 L880 922 M920 922 L920 940 M870 940 L870 958 M930 958 L930 975', '#8e4129', 2) + '</g>';
    // janela gradeada à esquerda, com cortina
    meio += ret(30, 640, 230, 220, '#5a3c33', 8) + ret(44, 654, 202, 192, dia ? '#bfe2ef' : '#f4c96b', 4, 0)
      + (dia ? shape('M44 654 L130 654 Q118 740 132 846 L44 846Z', '#e8736f', 2) : shape('M44 654 L120 654 Q108 740 122 846 L44 846Z', '#c2584f', 2))
      + [0, 1, 2, 3].map(i => stroke(`M${70 + i * 50} 654 L${70 + i * 50} 846`, OUT, 4)).join('') + stroke('M44 750 L246 750', OUT, 4)
      + ret(22, 856, 246, 20, '#c9c2b8', 4);
    // placa "Proibido latir" (a da cena original) e caixas de correio
    meio += placa(40, 960, 270, 170, '#fff6e6', ['Proibido latir', 'após as 22h', 'A Administração'], 24, OUT, -1);
    meio += ret(70, 1185, 210, 150, '#6e7f8c', 6);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { const x = 82 + i * 66, y = 1196 + j * 68;
      meio += ret(x, y, 56, 58, '#8fa0ad', 4, 2) + stroke(`M${x + 12} ${y + 18} L${x + 44} ${y + 18}`, OUT, 3) + `<text x="${x + 28}" y="${y + 46}" font-family="Arial" font-weight="700" font-size="15" text-anchor="middle" fill="${OUT}">${41 + i + j * 3}</text>`; }
    // rodapé de azulejo
    meio += `<rect x="-300" y="1420" width="1700" height="140" fill="${azulejo}"/>` + [...Array(30)].map((_, i) => stroke(`M${-300 + i * 60} 1420 L${-300 + i * 60} 1560`, '#c8bfa9', 1.6)).join('') + stroke('M-300 1490 L1400 1490', '#c8bfa9', 1.6) + stroke('M-300 1420 L1400 1420', OUT, 3);
    // cano descendo pela parede
    meio += stroke('M1040 560 L1040 1560', OUT, 16) + stroke('M1040 560 L1040 1560', '#9aa3aa', 10) + [700, 1000, 1300].map(y => ret(1026, y, 28, 12, '#6c737a', 3, 2)).join('');
    // placas da fachada (as da cena original)
    meio += placa(330, 590, 420, 96, '#fff6e6', ['CONJUNTO ESPERANÇA'], 30) + placa(430, 696, 220, 56, '#f2d36b', ['Bloco 4'], 30);
    // entrada recuada: batente com espessura, porta, marquise
    meio += shape('M330 790 L350 800 L350 1600 L330 1600Z', dia ? '#c9c2b8' : '#8e877d') + shape('M750 790 L730 800 L730 1600 L750 1600Z', dia ? '#a39b90' : '#6f685f');
    meio += ret(350, 800, 380, 800, dia ? '#3b2c26' : '#2c201c', 0);
    if (dia) { // porta aberta: corredor com luz, escada ao fundo
      meio += ret(350, 800, 380, 800, '#f7e3a8', 0) + shape('M430 880 L650 880 L650 1600 L430 1600Z', '#e9cf8e', 0)
        + [0, 1, 2, 3, 4, 5].map(i => stroke(`M${470 + i * 8} ${1040 + i * 60} L${610 - i * 8} ${1040 + i * 60}`, '#c9a868', 4)).join('') + shape('M730 800 L830 760 L830 1640 L730 1610Z', '#7a5a44');
    } else { // porta fechada, com vidro aceso por dentro
      meio += ret(370, 820, 340, 780, '#7a5a44', 0) + ret(420, 870, 240, 260, '#f2cf7a', 6) + stroke('M540 870 L540 1130 M420 1000 L660 1000', '#7a5a44', 6) + ell(680, 1220, 12, 12, '#e2b13f', OUT, 2);
    }
    meio += shape('M300 760 L780 760 L806 792 L274 792Z', dia ? '#d8d1c6' : '#9f988d') + ret(274, 792, 532, 16, dia ? '#b9b1a4' : '#7d766c', 0, 2);
    if (dia) meio += `<path d="M274 808 L806 808 L760 870 L320 870Z" fill="#3b2a24" opacity=".22"/>`;
    // interfone, ao lado da porta
    meio += ret(770, 1050, 64, 150, '#c7cbd0', 8) + ell(802, 1072, 7, 7, '#2a2f36') + [0, 1, 2].map(i => ell(788, 1104 + i * 26, 6, 6, '#e8ecef', OUT, 1.6) + ell(816, 1104 + i * 26, 6, 6, '#e8ecef', OUT, 1.6)).join('') + stroke('M786 1180 L818 1180 M786 1188 L818 1188', '#6c737a', 2);
    // vaso com folhas (da cena original, com mais volume) e lixeira
    meio += shape('M52 1600 L60 1500 L160 1500 L168 1600Z', '#ae5d49') + ret(48, 1488, 124, 22, '#c26d57', 6) + `<path d="M60 1510 L160 1510 L156 1560 L64 1560Z" fill="#8e4636" opacity=".35"/>`
      + shape('M110 1490 Q60 1420 86 1350 Q118 1410 110 1490Z', '#6f9a2c') + shape('M112 1490 Q150 1400 190 1380 Q170 1460 112 1490Z', '#87b23a') + shape('M108 1490 Q40 1470 20 1420 Q80 1420 108 1490Z', '#5d8a26')
      + stroke('M110 1488 Q96 1420 88 1360 M114 1488 Q150 1430 186 1384 M106 1488 Q66 1452 26 1424', '#3f6a1c', 1.6);
    meio += `<rect x="900" y="1400" width="110" height="200" rx="12" fill="#4f7f9e" stroke="${OUT}" stroke-width="${T}"/>` + ret(892, 1388, 126, 24, '#3f6b87', 8) + ret(924, 1460, 62, 40, '#e9e2cf', 4, 2) + stroke('M934 1474 L976 1474 M934 1486 L966 1486', '#6c737a', 2);
    // luz motivada
    if (dia) meio += `<defs><linearGradient id="crSol" gradientUnits="userSpaceOnUse" x1="1300" y1="0" x2="300" y2="0"><stop offset="0" stop-color="#fff2c2" stop-opacity=".3"/><stop offset="1" stop-color="#fff2c2" stop-opacity="0"/></linearGradient></defs><rect x="300" y="560" width="1100" height="1040" fill="url(#crSol)"/>`;
    else meio += `<defs><linearGradient id="crCone" gradientUnits="userSpaceOnUse" x1="0" y1="560" x2="0" y2="1600"><stop offset="0" stop-color="#ffe3a0" stop-opacity=".34"/><stop offset="1" stop-color="#ffe3a0" stop-opacity=".1"/></linearGradient></defs><path d="M880 540 L960 540 L1300 1600 L520 1600Z" fill="url(#crCone)"/><defs><radialGradient id="crJanela"><stop offset="0" stop-color="#ffd27a" stop-opacity=".45"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient></defs>` + ell(145, 760, 240, 200, 'url(#crJanela)') + ell(540, 1000, 300, 260, 'url(#crJanela)');

    // ---------- chão: degraus, calçada em perspectiva, meio-fio ----------
    const piso = dia ? '#b9b2a6' : '#7f7a74', junta = dia ? '#968f84' : '#5f5a55', CH = CHAO;
    let chao = `<rect x="-900" y="${CH - 40}" width="2900" height="440" fill="${piso}"/>`;
    // juntas que fogem para um ponto acima da porta: o chão recua em vez de ser uma faixa plana
    const vpY = CH - 520, fr = (CH - 40 - vpY) / (CH + 380 - vpY);
    for (let i = -12; i <= 12; i++) { const xb = 540 + i * 170; chao += stroke(`M${pr(540 + (xb - 540) * fr)} ${CH - 40} L${xb} ${CH + 380}`, junta, 2); }
    for (const y of [CH + 6, CH + 66, CH + 146, CH + 250]) chao += stroke(`M-900 ${y} L2000 ${y}`, junta, 2);
    chao += stroke(`M180 ${CH + 90} l40 18 l-10 26 M820 ${CH + 170} l-30 12 l22 30`, junta, 1.8);
    // degrau junto da parede, atrás dos pés: os atores pisam na calçada, à frente dele
    chao += shape(`M320 ${CH - 40} L760 ${CH - 40} L770 ${CH - 33} L310 ${CH - 33}Z`, dia ? '#d6cfc3' : '#9a948b', 2) + `<rect x="310" y="${CH - 33}" width="460" height="9" fill="${dia ? '#a39b90' : '#6f685f'}" stroke="${OUT}" stroke-width="2"/>`;
    chao += `<rect x="-900" y="${CH + 300}" width="2900" height="26" fill="${dia ? '#cfc8bb' : '#8d877e'}" stroke="${OUT}" stroke-width="2.5"/><rect x="-900" y="${CH + 326}" width="2900" height="200" fill="${dia ? '#55535a' : '#3c3a40'}"/>`;
    chao += ret(880, CH + 330, 120, 28, '#3a3a40', 4, 2) + [0, 1, 2, 3, 4].map(i => stroke(`M${894 + i * 22} ${CH + 334} L${894 + i * 22} ${CH + 354}`, '#77777f', 3)).join('');
    if (!dia) { // poste à direita: luz no chão e brilho na lâmpada
      chao += `<defs><radialGradient id="crPoca"><stop offset="0" stop-color="#ffdf8f" stop-opacity=".42"/><stop offset="1" stop-color="#ffdf8f" stop-opacity="0"/></radialGradient></defs>` + ell(820, CH + 40, 560, 150, 'url(#crPoca)');
    }
    chao += `<rect x="-900" y="${CH - 40}" width="2900" height="10" fill="${OUT}" opacity=".85"/>`;
    const camadas = [{ f: .3, svg: fundo }, { f: .9, svg: meio }, { f: 1, svg: chao }];
    if (!dia) camadas.push({ f: 1.06, svg: poste(1010) });
    return camadas;
  }
  // Poste de primeiro plano (noite). A luz dele motiva o brilho do chão e a sombra dos atores para a esquerda.
  function poste(x) {
    return `<defs><radialGradient id="crLampada"><stop offset="0" stop-color="#fff0b8" stop-opacity=".8"/><stop offset=".4" stop-color="#ffd77a" stop-opacity=".25"/><stop offset="1" stop-color="#ffd77a" stop-opacity="0"/></radialGradient></defs>`
      + `<rect x="${x - 14}" y="560" width="28" height="1080" fill="#4a5058" stroke="${OUT}" stroke-width="3"/>` + shape(`M${x} 572 Q${x - 10} 520 ${x - 90} 512 L${x - 96} 528 Q${x - 26} 534 ${x - 16} 572Z`, '#4a5058', 3)
      + shape(`M${x - 130} 510 L${x - 60} 510 L${x - 70} 534 L${x - 120} 534Z`, '#2e3238', 3) + ell(x - 95, 540, 30, 8, '#fff3c4', OUT, 2) + ell(x - 95, 560, 190, 150, 'url(#crLampada)');
  }
  return { portaConjunto };
})();
