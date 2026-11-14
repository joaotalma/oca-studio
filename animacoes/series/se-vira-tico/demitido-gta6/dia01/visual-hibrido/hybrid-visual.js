'use strict';
// Direção visual local do Dia 1. Não altera falas, relógio, acontecimentos ou entregas aprovadas.
// Referências fornecidas por João: Hybrid Studio V10, V11, bíblico V3 e os dois guias.
const HybridGTA = (() => {
  const f = n => Number(n).toFixed(2);
  const defs = ExpressaoHibrida.defs()+`<defs>
    <linearGradient id="hy-wall" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#243655"/><stop offset=".5" stop-color="#526082"/><stop offset="1" stop-color="#38415d"/></linearGradient>
    <linearGradient id="hy-floor" x2="0" y2="1"><stop stop-color="#846c64"/><stop offset="1" stop-color="#332f40"/></linearGradient>
    <linearGradient id="hy-side" x2="1" y2=".1"><stop stop-color="#172a41"/><stop offset="1" stop-color="#3a4866"/></linearGradient>
    <linearGradient id="hy-wood" x2="0" y2="1"><stop stop-color="#ceaa85"/><stop offset=".3" stop-color="#a87657"/><stop offset="1" stop-color="#674a40"/></linearGradient>
    <linearGradient id="hy-controller" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#fff6e5"/><stop offset=".45" stop-color="#d3d7d2"/><stop offset="1" stop-color="#8c9aab"/></linearGradient>
    <linearGradient id="hy-case" x1="0" x2="1"><stop stop-color="#8595a3"/><stop offset=".035" stop-color="#273747"/><stop offset=".9" stop-color="#111b2b"/><stop offset="1" stop-color="#a0b4bf"/></linearGradient>
    <linearGradient id="hy-hoodie" gradientUnits="userSpaceOnUse" x1="-110" y1="-240" x2="110" y2="-100"><stop stop-color="#214f4f"/><stop offset=".52" stop-color="#307965"/><stop offset="1" stop-color="#65a897"/></linearGradient>
    <linearGradient id="hy-pants" gradientUnits="userSpaceOnUse" x1="-90" x2="90"><stop stop-color="#323d51"/><stop offset=".7" stop-color="#535d70"/><stop offset="1" stop-color="#7a8291"/></linearGradient>
    <linearGradient id="hy-skin" gradientUnits="userSpaceOnUse" x1="-48" y1="-20" x2="48" y2="5"><stop stop-color="#975e45"/><stop offset=".65" stop-color="#b37750"/><stop offset="1" stop-color="#d69b6a"/></linearGradient>
    <linearGradient id="hy-office-wall" x2=".4" y2="1"><stop stop-color="#e7dfce"/><stop offset=".55" stop-color="#c9d6d4"/><stop offset="1" stop-color="#98aeb8"/></linearGradient>
    <linearGradient id="hy-office-floor" x2="0" y2="1"><stop stop-color="#b9c5c5"/><stop offset="1" stop-color="#728591"/></linearGradient>
    <linearGradient id="hy-beam" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffdc98" stop-opacity=".28"/><stop offset="1" stop-color="#ffe5af" stop-opacity="0"/></linearGradient>
    <linearGradient id="hy-cool-beam" x2="1" y2=".5"><stop stop-color="#85e3ee" stop-opacity=".22"/><stop offset="1" stop-color="#8fe1f0" stop-opacity="0"/></linearGradient>
    <radialGradient id="hy-tv-light"><stop stop-color="#80def7" stop-opacity=".34"/><stop offset="1" stop-color="#54b4e6" stop-opacity="0"/></radialGradient>
    <radialGradient id="hy-purple"><stop stop-color="#ac80ff" stop-opacity=".38"/><stop offset="1" stop-color="#b98aff" stop-opacity="0"/></radialGradient>
    <radialGradient id="hy-vignette"><stop offset=".45" stop-color="#152539" stop-opacity="0"/><stop offset="1" stop-color="#0b172b" stop-opacity=".31"/></radialGradient>
    <pattern id="hy-dots" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(22)"><circle cx="3" cy="3" r="1.1" fill="#111c2f" opacity=".28"/></pattern>
    <pattern id="hy-paper" width="83" height="97" patternUnits="userSpaceOnUse"><path d="M12 23h2 M39 65h1 M71 43h2 M28 87h2 M58 14h1" stroke="#fff2db" stroke-opacity=".16" stroke-width="1"/></pattern>
    <filter id="hy-cutout" x="-15%" y="-10%" width="130%" height="125%" color-interpolation-filters="sRGB"><feMorphology in="SourceAlpha" operator="dilate" radius="2.8" result="edge"/><feFlood flood-color="#ffffff"/><feComposite in2="edge" operator="in"/><feDropShadow dx="3" dy="5" stdDeviation="1.3" flood-color="#0c1424" flood-opacity=".42"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="hy-prop-shadow" x="-25%" y="-30%" width="150%" height="165%"><feDropShadow dx="3" dy="6" stdDeviation="2" flood-color="#081421" flood-opacity=".4"/></filter>
  </defs>`;

  // Projeção dos planos do quarto; o personagem e as mãos continuam nas coordenadas aprovadas.
  const oldRoom = quarto;
  quarto = function(t, o = {}) {
    let s = oldRoom(t,o);
    // Troca a parede inicial mantendo calendário, cama, TV, PS5, porta e objetos intactos.
    s = s.replace('fill="#4a5784"','fill="url(#hy-wall)"');
    s = s.replace('fill="#6b5240"','fill="url(#hy-floor)"');
    s = s.replaceAll('fill="#6b4a34"','fill="url(#hy-wood)"');
    const floorIndex = s.lastIndexOf('<rect x="-600"');
    const floor = s.slice(floorIndex);
    s = s.slice(0,floorIndex);
    // Parede lateral e encontro de planos: perspectiva, não um filtro global de cor.
    const envelope = `<path d="M-600 -400 H-100 V${CHAO} L-600 ${CHAO+450}Z" fill="url(#hy-side)"/><path d="M-100 -400 V${CHAO}" stroke="#172b43" stroke-width="8"/>`;
    s = s.replace('<rect x="-600" y="180"', envelope+'<rect x="-600" y="180"');
    s += `<path d="M80 400 L380 400 L940 1590 L-130 1590Z" fill="url(#hy-cool-beam)" opacity=".45"/>`;
    s += `<ellipse cx="780" cy="990" rx="360" ry="350" fill="url(#hy-tv-light)"/><ellipse cx="550" cy="200" rx="900" ry="270" fill="url(#hy-purple)"/>`;
    s += floor;
    for(let i=-7;i<10;i++) s += `<path d="M${540+i*48} ${CHAO} L${540+i*290} ${CHAO+700}" stroke="#281f2b" stroke-opacity=".19" stroke-width="3"/>`;
    for(let i=1;i<6;i++) s += `<path d="M-600 ${CHAO+i*i*23} H1700" stroke="#e1b69a" stroke-opacity=".13" stroke-width="2"/>`;
    // Sombras de contato dos móveis, sem cobrir a ação.
    s += `<ellipse cx="230" cy="1592" rx="300" ry="22" fill="#10172a" opacity=".25"/><ellipse cx="816" cy="1592" rx="270" ry="18" fill="#10172a" opacity=".24"/>`;
    return s;
  };

  // Cenário do escritório mantém a bancada e a Lua (desenhadas pelo episódio) no mesmo lugar.
  CENARIOS.escritorio = () => {
    let back = `<rect x="-800" y="-600" width="2900" height="2800" fill="url(#hy-office-wall)"/>`;
    back += `<path d="M-800 -450 H1850 L1320 450 H-180Z" fill="#edf2e9"/><path d="M-800 -200 H1700 M-800 80 H1500 M-800 340 H1370" stroke="#c4d0c9" stroke-width="3"/>`;
    back += `<path d="M-500 -500 L120 450 M130 -500 L430 450 M850 -500 L770 450 M1600 -500 L1110 450" stroke="#c2cdc9" stroke-width="3"/>`;
    for(let i=0;i<4;i++) back+=`<path d="M${-160+i*410} 260 H${130+i*410} L${100+i*410} 287 H${-145+i*410}Z" fill="#fffae7" stroke="#95aaa7" stroke-width="3"/>`;
    back += `<rect x="-280" y="510" width="560" height="600" rx="5" fill="#819ca7"/><rect x="-267" y="522" width="535" height="576" fill="#c9e6e7"/>`;
    for(let i=0;i<5;i++)back+=`<rect x="${-255+i*112}" y="${800-i%2*120}" width="87" height="300" fill="#8baab3"/><path d="M${-240+i*112} 580 V1100" stroke="#f4fbef" stroke-opacity=".6" stroke-width="4"/>`;
    back += `<path d="M-300 730 H285 M-300 910 H285" stroke="#77919b" stroke-width="11"/>`;
    back += `<path d="M-300 525 L290 525 L1380 1480 L-140 1480Z" fill="url(#hy-beam)"/>`;
    // Distância por escala e cor; sem mover o elenco.
    back += `<rect x="1040" y="620" width="390" height="830" fill="#8dabae"/><rect x="1060" y="650" width="350" height="760" fill="#cee1dc"/><path d="M1235 650 V1410" stroke="#96b4b3" stroke-width="5"/>`;
    let floor = `<rect x="-800" y="${CHAO-100}" width="2900" height="850" fill="url(#hy-office-floor)"/>`;
    for(let i=-6;i<8;i++)floor+=`<path d="M${540+i*75} ${CHAO-100} L${540+i*350} 2350" stroke="#4e6a7a" stroke-opacity=".2" stroke-width="3"/>`;
    for(let i=1;i<6;i++)floor+=`<path d="M-800 ${CHAO-100+i*i*25} H2100" stroke="#f6fbf2" stroke-opacity=".24" stroke-width="3"/>`;
    return [{f:.3,svg:back},{f:1,svg:floor}];
  };

  const oldController=controle;
  controle=function(cx,cy,k,t,o={}) {
    let s=oldController(cx,cy,k,t,o).replaceAll('fill="#e4e0d6"','fill="url(#hy-controller)"');
    // Textura apenas na parte de baixo da carcaça; botões e rachaduras continuam legíveis.
    const end=s.lastIndexOf('</g>');
    s=s.slice(0,end)+`<path d="M-137 58 Q-135 86 -116 90 Q-95 91 -79 60 L-65 55 L-82 81 Q-102 111 -128 94Z M95 63 L135 52 Q145 81 121 90Z" fill="url(#hy-dots)" opacity=".7"/><path d="M-108 -37 Q-92 -48 -62 -48 M-38 -48 H37" fill="none" stroke="#ffffff" stroke-opacity=".62" stroke-width="3" stroke-linecap="round"/>`+s.slice(end);
    return `<g filter="url(#hy-prop-shadow)">${s}</g>`;
  };

  let actingTime=0, hairImpulse=0;
  const oldHair=hairFront;
  hairFront=function(d){return ExpressaoHibrida.cabelo(oldHair(d),actingTime,{fase:d.key==='kaua'?0:1.7,impulso:hairImpulse});};
  const oldHead=headSVG;
  headSVG=function(d,e,po){
    // Amplifica a intenção existente sem trocar a expressão ou os visemas.
    const expressivo={...e};
    for(const key of ['browY','browIn','browL'])if(Number.isFinite(e[key]))expressivo[key]=e[key]*1.16;
    if(e.open)expressivo.open=Math.min(1.4,e.open*1.08);
    let s=oldHead(d,expressivo,po);
    if(d.key==='kaua')s+=`<path d="M25 9 Q40 5 43 15 Q41 37 24 43 L18 34Z" fill="url(#hy-dots)" opacity=".48"/><path d="M-36 -56 Q-27 -72 -13 -73" fill="none" stroke="#e6b18b" stroke-opacity=".3" stroke-width="2.2"/>`;
    return s;
  };

  // Atuação por intenção: os olhos antecipam a próxima pose, a cabeça assenta com mola.
  // Mantém braços e mãos dos planos aprovados para não descolar o controle da pegada.
  for(const pl of dia01Planos)for(const a of pl.atores||[]){
    const old=a.dyn;
    a.dyn=t=>{
      let pose=old?old(t):{};
      let latest;
      for(const [at,p]of a.poses||[]){
        if(t>=at&&p.head!=null)latest={at,head:p.head};
        if(t>=at-.12&&t<at&&p.look)pose.look=p.look;
      }
      if(latest&&t-latest.at<1.2){const u=t-latest.at;pose.head=(pose.head??latest.head)+Math.exp(-u*5)*Math.sin(u*12)*1.3;}
      if(pl.cena==='escritorio'&&a.id==='kaua'){
        const authored=Object.assign({},...(a.poses||[]).filter(([at])=>at<=t).map(([,p])=>p),pose);
        pose=ExpressaoHibrida.bracos(authored,t,{inicio:pl.ini+.38,amplitude:3});
      }
      return pose;
    };
  }

  const light=(t,office)=>office ? `<path d="M-120 450 L260 450 L1000 1450 L570 1450Z" fill="url(#hy-beam)" opacity=".32"/>` : `<ellipse cx="900" cy="1000" rx="450" ry="420" fill="url(#hy-tv-light)" opacity=".38"/>`;
  function background(s,t,pl) {
    // Vidro com espessura, borda metálica e brilho nos cantos; o conteúdo continua original.
    if(s.includes('brilhoTela')) {
      s=s.replace('fill="#23252f"','fill="url(#hy-case)"');
      s+=`<path d="M200 153 Q204 120 242 120 H838" stroke="#c9e4ed" stroke-opacity=".62" stroke-width="4" fill="none"/><path d="M875 185 V1480" stroke="#a6c9d4" stroke-opacity=".42" stroke-width="3"/><path d="M230 1560 H844" stroke="#020b16" stroke-width="9" stroke-opacity=".5"/><rect x="490" y="1540" width="100" height="6" rx="3" fill="#111f2b" opacity=".5"/>`;
    }
    return s;
  }
  function actor(s,a,t,pl) {
    if(a.id==='kaua')s=s.replaceAll('fill="#2f6f5e"','fill="url(#hy-hoodie)"').replaceAll('fill="#4a4f5a"','fill="url(#hy-pants)"').replaceAll('fill="#a86b48"','fill="url(#hy-skin)"');
    if(a.id==='kaua'&&pl.ini===19.4)s=ExpressaoHibrida.revelar(s,ExpressaoHibrida.branco(t,{inicio:pl.ini+.08,duracao:.85}));
    return `<g filter="url(#hy-cutout)">${s}</g>`;
  }
  function before(t,pl,draw){actingTime=t;hairImpulse=ExpressaoHibrida.settle(t,pl.ini,1.4);return draw();}
  function finish(s,t,pl) {
    if(!pl.cheia) {
      s+= light(t,pl.cena==='escritorio');
      // Partículas sincronizadas pelo tempo absoluto, discretas e longe dos textos.
      for(let i=0;i<9;i++) {
        const x=50+(i*197)%980+Math.sin(t*.32+i)*8, y=220+(i*157)%850+Math.cos(t*.25+i)*6;
        s+=`<circle cx="${f(x)}" cy="${f(y)}" r="${1+i%3*.45}" fill="#fff2d5" opacity="${f(.12+.07*Math.sin(t*.4+i))}"/>`;
      }
    }
    return s+`<rect width="1080" height="1920" fill="url(#hy-paper)" opacity=".28"/><rect width="1080" height="1920" fill="url(#hy-vignette)"/>`;
  }
  return {defs,background,actor,finish,before};
})();
