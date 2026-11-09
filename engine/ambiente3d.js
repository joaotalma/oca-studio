'use strict';
// Motor reutilizável derivado do estudo aprovado em 2026-11-08. Sem dependência
// dos episódios do estudo: câmera, cenário, céu e fontes pertencem a cada plano.
(() => {
  const W = 1080, H = 1920, F = 1650, NEAR = .3;
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const mix = (a, b, u) => a + (b - a) * u;
  const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
  const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const rgb = c => Array.isArray(c) ? c : c.startsWith('rgb') ? c.match(/[\d.]+/g).slice(0, 3).map(Number) : c.match(/[a-f\d]{2}/gi).map(n => parseInt(n, 16));
  const css = a => `rgb(${a.map(x => Math.round(clamp(x, 0, 255))).join(',')})`;
  const tint = (c, k) => css(rgb(c).map(x => x * k));
  const EXTERNOS = new Set(['rua', 'colonial', 'terreno', 'campo', 'floresta', 'estrada', 'mar']);
  const DEFAULTS = Object.freeze({ ativo: true, preenchimento: .22, estrelas: 90, nuvens: 6, detalhe: 1 });

  function config(input = {}) {
    const c = { ...DEFAULTS, tipo: 'arte', periodo: 'noite', ...input };
    c.preenchimento = clamp(c.preenchimento, 0, .65);
    c.exterior = EXTERNOS.has(c.tipo);
    c.ceu = c.exterior ? (c.periodo === 'dia' ? 'nuvens' : 'estrelas') : 'nenhum';
    if (!c.luzes) {
      c.luzes = c.periodo === 'dia' && c.exterior
        ? [{ id: 'sol', tipo: 'sol', posicao: [8, 12, 2], cor: '#fff0d0', intensidade: 1 }]
        : ['sala', 'interior', 'oficina'].includes(c.tipo)
          ? [{ id: 'janela', tipo: 'janela', posicao: [2.975, 2.0, 7], cor: '#ffdaa0', intensidade: 1 }]
          : c.exterior
            ? [{ id: 'poste', tipo: 'poste', posicao: [2.8, 4.0, 4.4], cor: '#ffdaa0', intensidade: 1 }]
            : [];
    }
    return c;
  }
  function lightStates(c, t) {
    return c.luzes.map(l => {
      const a = l.animacao;
      const u = !a ? 1 : a.duracao > 0 ? smooth((t - a.inicio) / a.duracao) : +(t >= a.inicio);
      const power = (l.intensidade ?? 1) * (!a ? 1 : mix(a.de ?? 0, a.para ?? 1, u));
      return { ...l, posicao: l.posicao || [2.8, 4, 4.4], cor: l.cor || '#ffdaa0', potencia: Math.max(0, power) };
    });
  }
  // Recorte contínuo de polígonos no plano próximo; conserva o chão durante travellings.
  function clipNear(vertices) {
    const out = [];
    vertices.forEach((b, i) => {
      const a = vertices[(i + vertices.length - 1) % vertices.length], ai = a.z >= NEAR, bi = b.z >= NEAR;
      if (ai !== bi) { const k = (NEAR - a.z) / (b.z - a.z); out.push({ x: mix(a.x, b.x, k), y: mix(a.y, b.y, k), z: NEAR }); }
      if (bi) out.push(b);
    });
    return out;
  }
  function camera(c, u, duration, movement) {
    if (c.camera) {
      const a = c.camera.de || [0, 2.4, -4.85], b = c.camera.para || a;
      const k = smooth(u), alvo = c.camera.alvo || [.05, 1.8, 1.1];
      const [x,y,z] = a.map((v,i)=>mix(v,b[i],k));
      return {x,y,z,yaw:Math.atan2(alvo[0]-x,alvo[2]-z),pitch:Math.atan2(alvo[1]-y,Math.hypot(alvo[0]-x,alvo[2]-z))};
    }
    if (movement === 'parado') return {x:0,y:2.4,z:-4.85,yaw:Math.atan2(.05,5.95),pitch:-.08};
    const span = Math.min(2.4, Math.max(.55, duration * .30));
    let x = mix(-span / 2, span / 2, u), z = -4.85, y = 2.4;
    if (movement === 'dir') x = -x;
    if (['impacto', 'zoom-in', 'zoom-out'].includes(movement)) {
      x *= .35; const travel = Math.min(1.1, Math.max(.4, duration * .14));
      z = movement === 'zoom-out' ? mix(-4.1, -4.1 - travel, u) : mix(-4.1 - travel, -4.1, u);
    }
    if (movement === 'cima' || movement === 'baixo') y += (movement === 'cima' ? 1 : -1) * .18 * (u - .5);
    const target = c.composicao?.alvoX ?? .05;
    return { x, y, z, yaw: Math.atan2(target - x, 1.1 - z), pitch: -.08 };
  }
  // Nível neutro mais alto que no piloto. A luz ambiente não depende da curva
  // dinâmica e deixa espaço para a fonte aquecer/iluminar apenas o lado correto.
  function characterLight(c, states, position, screenSide) {
    const base = c.periodo === 'dia' ? [205, 218, 237] : [112, 133, 179];
    const ambient = base.map(n => mix(n, 255, c.preenchimento));
    const left = [...ambient], right = [...ambient];
    for (const l of states) {
      const side = screenSide(l.posicao) - screenSide(position);
      const color = rgb(l.cor), power = clamp(l.potencia);
      for (let i = 0; i < 3; i++) {
        const target = Math.max(ambient[i], color[i]);
        left[i] += (target - ambient[i]) * power * (side < 0 ? .95 : .03);
        right[i] += (target - ambient[i]) * power * (side >= 0 ? .95 : .03);
      }
    }
    return { left: left.map(x => clamp(x, 0, 255)), right: right.map(x => clamp(x, 0, 255)), ambient };
  }

  function create({ context: g, images, palette }) {
    const textures = new Map(), ink = '#090b16';
    let c, cam, queue, states;
    const cameraPoint = v => {
      const dx = v[0] - cam.x, dy = v[1] - cam.y, dz = v[2] - cam.z;
      const x = dx * Math.cos(cam.yaw) - dz * Math.sin(cam.yaw), z = dx * Math.sin(cam.yaw) + dz * Math.cos(cam.yaw);
      return { x, y: dy * Math.cos(cam.pitch) - z * Math.sin(cam.pitch), z: dy * Math.sin(cam.pitch) + z * Math.cos(cam.pitch) };
    };
    const screen = p => ({ x: W / 2 + p.x * F / p.z, y: 1170 - p.y * F / p.z, z: p.z });
    const project = v => screen(cameraPoint(v));
    function poly(vertices, color, alpha = 1, stroke = false, depth) {
      const points = clipNear(vertices.map(cameraPoint)).map(screen);
      if (points.length < 3) return;
      queue.push({ z: depth ?? points.reduce((a, p) => a + p.z, 0) / points.length, draw() {
        g.save(); g.globalAlpha *= alpha; g.beginPath();
        points.forEach((p, i) => i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)); g.closePath();
        g.fillStyle = color; g.fill(); if (stroke) { g.strokeStyle = ink; g.lineWidth = 1.4; g.stroke(); } g.restore();
      } });
    }
    function line(vertices, color, width = 1.3) {
      const points = vertices.map(project); if (points.some(p => p.z < NEAR)) return;
      queue.push({ z: points.reduce((a, p) => a + p.z, 0) / points.length, draw() {
        g.save(); g.beginPath(); points.forEach((p, i) => i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y));
        g.strokeStyle = color; g.lineWidth = width; g.stroke(); g.restore();
      } });
    }
    function shade(color, point, normal) {
      const base = rgb(color), out = base.map(n => n * (c.periodo === 'dia' ? .90 : .67));
      for (const l of states) {
        const d = l.posicao.map((v, i) => v - point[i]), distance = Math.max(.01, Math.hypot(...d));
        const dot = Math.max(0, d.reduce((s, v, i) => s + v * normal[i], 0) / distance);
        const power = dot * l.potencia * (l.tipo === 'sol' ? .65 : 2 / (1 + distance * distance * .055)), color = rgb(l.cor);
        out.forEach((_, i) => out[i] += base[i] * power * color[i] / 255);
      }
      return css(out);
    }
    function box(x, y, z, w, h, d, color) {
      poly([[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z]], shade(color,[x+w/2,y+h/2,z],[0,0,-1]),1,true);
      poly([[x,y,z+d],[x,y,z],[x,y+h,z],[x,y+h,z+d]], shade(color,[x,y+h/2,z+d/2],[-1,0,0]),1,true);
      poly([[x+w,y,z],[x+w,y,z+d],[x+w,y+h,z+d],[x+w,y+h,z]], shade(color,[x+w,y+h/2,z+d/2],[1,0,0]),1,true);
      poly([[x,y+h,z],[x+w,y+h,z],[x+w,y+h,z+d],[x,y+h,z+d]], shade(color,[x+w/2,y+h,z+d/2],[0,1,0]),1,true);
    }
    function pool(x, z, rx, rz, color, opacity) {
      for (let k = 20; k > 0; k--) {
        const v = Array.from({length:32}, (_, i) => { const a = i * Math.PI / 16; return [x + Math.cos(a)*rx*k/20,.018,z+Math.sin(a)*rz*k/20]; });
        poly(v, color, opacity / 18);
      }
    }
    function sky(t) {
      const day = c.periodo === 'dia', gradient = g.createLinearGradient(0,0,0,H);
      gradient.addColorStop(0,day?'#3575b0':palette.escuro); gradient.addColorStop(.6,day?'#b1d8e5':palette.medio); gradient.addColorStop(1,day?'#b7c4c0':palette.escuro);
      g.fillStyle = gradient; g.fillRect(0,0,W,H);
      if (c.ceu === 'estrelas') {
        g.save(); g.fillStyle = '#ebefff';
        for(let i=0;i<c.estrelas;i++) {
          const x = ((hash(i+7)*1800 - cam.yaw*F*.65 + 360)%1800+1800)%1800-360;
          const y = 45+hash(i+173)*970+cam.pitch*240;
          g.globalAlpha = .35+hash(i+333)*.35+.05*Math.sin(t*.55+i);
          g.beginPath(); g.arc(x,y,.8+hash(i+499)*1.65,0,Math.PI*2); g.fill();
        }
        g.restore();
      }
      if(c.ceu === 'nuvens') {
        g.save();
        for(let i=0;i<c.nuvens;i++) {
          const depth=.6+hash(i+60)*.6, drift=t*(1.2+hash(i+70)*1.1);
          const x=((hash(i+80)*1900+drift-cam.yaw*F*depth)%1900+1900)%1900-410,y=150+hash(i+90)*700;
          const s=.7+hash(i+100)*.8;
          for(const [dy,color,alpha] of [[10,'#879eb8',.28],[-8,'#f8f5e8',.82]]) {
            g.fillStyle=color;g.globalAlpha=alpha;g.beginPath();
            for(const [dx,oy,rx,ry] of [[0,0,130,35],[-65,-20,72,45],[48,-32,82,52]]) {g.moveTo(x+(dx+rx)*s,y+(oy+dy)*s);g.ellipse(x+dx*s,y+(oy+dy)*s,rx*s,ry*s,0,0,Math.PI*2);} g.fill();
          }
        }
        g.restore();
      }
    }
    function house(x,z,w,h,d) {
      const base = c.periodo === 'dia' ? '#708ba4' : palette.claro;
      box(x,0,z,w,h,d,base);
      poly([[x-.12,h,z],[x+w/2,h+1,z],[x+w+.12,h,z]],'#764a3d',1,true);
      poly([[x+w/2,h+1,z],[x+w/2,h+1,z+d],[x+w+.12,h,z+d],[x+w+.12,h,z]],'#553c3b',1,true);
      poly([[x-.12,h,z],[x-.12,h,z+d],[x+w/2,h+1,z+d],[x+w/2,h+1,z]],'#694a41',1,true);
      const side=x>0?x-.025:x+w+.025;
      poly([[side,.9,z+.6],[side,.9,z+1.9],[side,2.1,z+1.9],[side,2.1,z+.6]],'#111a2a',1,true);
      for(let dz=.4;dz<d;dz+=.55)line([[x+w/2,h+1,z+dz],[x+w+.1,h,z+dz]],'#422c35');
      box(x-.02,.03,z-.02,w+.04,.12,d+.04,tint(base,1.1));
    }
    function environment(t) {
      const floor=c.cores?.chao||(c.periodo==='dia'?'#6d756c':tint(palette.medio,.65));
      // Coplanar base surfaces have explicit order; their depth average must not
      // make one jump in front of another as a corner crosses the near plane.
      poly([[-65,0,-20],[65,0,-20],[65,0,100],[-65,0,100]],floor,1,false,1e6);
      if(['rua','colonial','terreno','estrada'].includes(c.tipo)) {
        poly([[-2.2,.006,-20],[2.2,.006,-20],[2.2,.006,80],[-2.2,.006,80]],tint(floor,.8),1,false,999999);
        for(let z=-2;z<60;z+=1.7)line([[-2.2,.012,z],[2.2,.012,z]],tint(floor,1.12));
        box(-2.5,0,-2,.22,.13,65,palette.medio);box(2.3,0,-2,.22,.13,65,palette.medio);
      }
      if(['rua','colonial','terreno'].includes(c.tipo)) {
        for(let i=0;i<8;i++){const z=6+i*5.2;house(-6.8,z,3.5,2.7+(i%3)*.25,3.7);house(2.5,z+.15,3.4,2.8+(i%2)*.4,3.8);}
      }
      if(c.tipo==='terreno')for(let i=0;i<14;i++)box(-7+i*1.04,0,7.1,.99,1.85,.3,palette.claro);
      if(['floresta','estrada','campo'].includes(c.tipo))for(let i=0;i<16;i++) {
        const x=(i%2?1:-1)*(3.8+hash(i+9)*4),z=5+i*2.5;
        box(x,0,z,.34,3.3,.34,'#544139');
        for(let j=0;j<3;j++)poly([[x-1.5+j*.2,2+j*.6,z],[x+.18,5.8+j*.2,z],[x+1.9-j*.2,2+j*.6,z]],j%2?'#315746':'#3f6a52',1,true);
      }
      if(c.tipo==='mar') {
        poly([[-65,.02,-20],[65,.02,-20],[65,.02,100],[-65,.02,100]],c.periodo==='dia'?'#397f9b':palette.medio,1,false,999998);
        for(let i=0;i<45;i++){const z=1+i*1.5,x=-8+hash(i+3)*16,y=.035+.015*Math.sin(t*.7+i);line([[x,y,z],[x+1.5,y,z]],palette.fria,1.4);}
      }
      if(['sala','interior','oficina'].includes(c.tipo)) {
        box(-6,0,9,12,7,.2,c.cores?.parede||palette.medio);box(3,0,4,.2,7,7,c.cores?.lateral||palette.claro);box(-3.2,0,4,.2,7,7,c.cores?.lateral||palette.claro);
        for(let z=-2;z<10;z+=1.5)line([[-6,.015,z],[6,.015,z]],tint(palette.claro,.75));
        if(c.detalhes) {
          for(let x=-5;x<6;x+=.65)line([[x,.02,-2],[x,.02,9]],'#7e7465',.65);
          box(-3.1,.12,8.78,6.1,.13,.12,'#9a836c');
          for(let k=0;k<3;k++) {
            box(-2.7+k*1.8,1.0,8.75,1.5,1.9,.25,'#88725d');
            box(-2.61+k*1.8,1.08,8.69,1.32,1.73,.045,'#b6a48a');
            box(-2.1+k*1.8,1.82,8.59,.32,.045,.08,'#4c605e');
          }
          box(-2.7,2.98,8.64,5.15,.12,.52,'#d9c7a1');
          box(-1.4,3.1,8.4,1.6,1.5,.09,'#324851');
          box(-1.3,3.18,8.34,1.4,1.33,.05,'#b9d6d5');
          box(-.64,3.18,8.28,.07,1.33,.04,'#e9dbc2');
          box(-1.3,3.8,8.28,1.4,.07,.04,'#e9dbc2');
          line([[0,6,4.4],[0,4.5,4.4]],'#30434b',2);
          box(-.6,4.35,4.1,1.2,.22,.6,'#d7b982');
          box(-.45,4.30,4.16,.9,.05,.47,'#ffe7b0');
        }
      }
      for(const l of states) {
        const [x,y,z]=l.posicao,color=css(rgb(l.cor).map(n=>mix(24,n,clamp(l.potencia))));
        if(l.tipo==='poste') {box(x-.6,0,z,.10,y+.2,.10,'#1b2535');box(x-.6,y,z-.1,.9,.1,.15,'#253047');box(x-.15,y-.08,z-.18,.42,.13,.4,color);}
        if(l.tipo==='janela') {
          poly([[x, y-.65,z-.8],[x,y-.65,z+.8],[x,y+.65,z+.8],[x,y+.65,z-.8]],color,1,true);
          line([[x,y-.65,z],[x,y+.65,z]],'#293044',2);
          // Soft bounce on the surrounding wall, attached to the source.
          poly([[x+.006,y-.9,z-1],[x+.006,y-.9,z+1],[x+.006,y+.9,z+1],[x+.006,y+.9,z-1]],l.cor,.06*clamp(l.potencia));
        }
        if(l.tipo!=='sol'&&l.potencia>0)pool(x-.5,z,1.7,1.2,l.cor,.20*clamp(l.potencia));
      }
      for(const p of c.objetos || []) {
        if(p.tipo==='caixa'){box(...p.posicao,...p.tamanho,p.cor||palette.claro);continue;}
        const [x,y,z]=p.posicao||[1,0,3];
        if(p.tipo==='geladeira') {
          box(x-.68,y,z,1.36,3.35,1.08,'#a8c7cf');
          box(x-.6,y+.1,z-.045,1.20,2.12,.06,p.aberta?'#274451':'#d6e4df');
          box(x-.6,y+2.29,z-.055,1.2,.96,.065,'#e9efdc');
          box(x-.52,y+1.4,z-.14,.07,.56,.08,'#5d838d');
          box(x-.52,y+2.49,z-.14,.07,.46,.08,'#5d838d');
          if(p.aberta) {
            for(let shelf=0;shelf<3;shelf++) {
              box(x-.56,y+.4+shelf*.55,z-.10,1.12,.05,.08,'#e4d6aa');
              for(let k=0;k<3;k++)box(x-.45+k*.32,y+.46+shelf*.55,z-.13,.22,.32,.12,['#e8ad62','#a0bb70','#d47d65'][(shelf+k)%3]);
            }
          }
          box(x+.43,y+.23,z-.12,.07,.07,.05,p.ligada===false?'#35464c':'#8ee2ae');
          if(p.ligada!==false)pool(x,z,.85,.45,'#7bdace',.12);
        }
        if(p.tipo==='televisao') {
          box(x-1.1,y+.85,z,2.2,1.4,.15,'#152531');
          box(x-1.02,y+.93,z-.03,2.04,1.24,.03,p.ligada?'#70c3d2':'#13202e');
          box(x-.08,y+.4,z+.02,.16,.45,.10,'#243b44');box(x-.6,y+.34,z,.9,.08,.4,'#8b7561');
        }
        if(p.tipo==='chuveiro') {
          box(x-.05,y+.5,z,.10,2.8,.10,'#9db9c5');box(x-.05,y+3.21,z-.7,.1,.1,.8,'#9db9c5');
          box(x-.4,y+3.13,z-.92,.8,.13,.52,'#d7d5bd');
          if(p.ligada!==false)for(let k=0;k<7;k++) {
            const dy=(t*1.5+k*.23)%2.6;
            line([[x-.28+k*.085,y+2.95-dy,z-.7],[x-.28+k*.085,y+2.69-dy,z-.7]],'#80c6da',2);
          }
        }
        if(p.tipo==='medidor') {
          box(x-.8,y+.65,z,1.6,2.25,.28,'#d7d4ba');box(x-.64,y+1.65,z-.025,1.28,.86,.05,'#263e47');
          for(let k=0;k<4;k++)box(x-.5+k*.28,y+1.82,z-.075,.16,.5,.06,'#88d6bc');
          box(x-.48,y+.94,z-.06,.96,.34,.06,'#aa8c66');
        }
      }
    }
    function prepare(src) {
      if(textures.has(src))return textures.get(src);
      const image=images.get(src),full=document.createElement('canvas');full.width=image.width;full.height=image.height;
      const f=full.getContext('2d');f.drawImage(image,0,0);const pixels=f.getImageData(0,0,full.width,full.height),a=pixels.data;
      let x0=full.width,y0=full.height,x1=-1,y1=-1;
      for(let y=0;y<full.height;y++)for(let x=0;x<full.width;x++) {
        const k=(y*full.width+x)*4;
        if(a[k]<=1&&a[k+1]<=1&&a[k+2]<=1){a[k+3]=0;continue;}
        if(a[k+3]>16){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
      }
      f.putImageData(pixels,0,0);
      if(x1<0)throw new Error(`Camada de personagem vazia: ${src}`);
      const texture=document.createElement('canvas');texture.width=x1-x0+1;texture.height=y1-y0+1;
      texture.getContext('2d').drawImage(full,x0,y0,texture.width,texture.height,0,0,texture.width,texture.height);
      const lit=document.createElement('canvas');lit.width=texture.width;lit.height=texture.height;
      const result={texture,lit};textures.set(src,result);return result;
    }
    function litTexture(src,position) {
      const {texture,lit}=textures.get(src),p=lit.getContext('2d'),colors=characterLight(c,states,position,v=>project(v).x);
      p.globalAlpha=1;p.globalCompositeOperation='source-over';p.clearRect(0,0,lit.width,lit.height);p.drawImage(texture,0,0);
      const key=p.createLinearGradient(0,0,lit.width,0);key.addColorStop(0,css(colors.left));key.addColorStop(1,css(colors.right));
      p.globalCompositeOperation='multiply';p.fillStyle=key;p.fillRect(0,0,lit.width,lit.height);
      p.globalCompositeOperation='destination-in';p.drawImage(texture,0,0);p.globalCompositeOperation='source-over';return lit;
    }
    function actor(layers,t) {
      if(!layers.voce)return;
      const position=[...(c.personagem?.posicao||[-.35,0,1.1])],ground=layers.chao??(layers.pivo?.[1]<1900);
      if(!ground)position[1]-=1.1;
      const height=c.personagem?.altura??(ground?3.8:5),feet=project(position),head=project([position[0],position[1]+height,position[2]]);
      const ch=feet.y-head.y,period=3.2,phase=(t+.35)%period,closed=layers.piscaAlbedo||layers.pisca,blink=closed&&phase>2.1&&phase<2.23;
      const src=blink?closed:layers.albedo||layers.voce,{texture}=textures.get(src),cw=ch*texture.width/texture.height;
      if(ground){pool(position[0],position[2],.6,.20,ink,.60);for(const l of states)if(l.potencia>0&&l.tipo!=='sol') {
        const dx=position[0]-l.posicao[0],dz=position[2]-l.posicao[2],d=Math.max(.1,Math.hypot(dx,dz));
        poly([[position[0]-.15,.02,position[2]],[position[0]+.15,.02,position[2]],[position[0]+dx/d*2+.3,.02,position[2]+dz/d*2],[position[0]+dx/d*2-.3,.02,position[2]+dz/d*2]],ink,.14*clamp(l.potencia));
      }}
      queue.push({z:project([position[0],position[1]+height/2,position[2]]).z,draw(){
        g.save();g.translate(feet.x,feet.y);g.rotate(.006*Math.sin(t*1.4));g.scale(1,1+.005*Math.sin(t*2.6));
        g.drawImage(litTexture(src,position),-cw/2,-ch,cw,ch);g.restore();
      }});
    }
    function artwork(src,layers,z=3.8) {
      if(!src)return;const image=images.get(src),center=project([0,2.6,z]),scale=F/center.z*9/1920;
      const [bx,by,bw,bh]=layers.caixa||[0,0,1080,1920];
      queue.push({z:center.z,draw(){g.drawImage(image,center.x+(bx-540)*scale,center.y+(by-960)*scale,bw*scale,bh*scale);}});
    }
    function render(input,layers,t,duration,movement) {
      c=config(input);cam=camera(c,clamp(t/Math.max(.001,duration)),duration,movement);states=lightStates(c,t);queue=[];
      g.save();sky(t);
      // Unknown/custom art stays visible; an unrelated street is never invented.
      if(c.tipo==='arte'&&layers.fundo)g.drawImage(images.get(layers.fundo),-25-cam.yaw*80,0,1130,H);
      environment(t);
      artwork(layers.frente,layers,c.profundidadeObjetos??3.8);actor(layers,t);
      queue.sort((a,b)=>b.z-a.z);queue.forEach(p=>p.draw());g.restore();
      return {ceu:c.ceu,luzes:states,camera:{...cam}};
    }
    return { prepare, render };
  }
  globalThis.Plotline3D = { DEFAULTS, config, lightStates, characterLight, clipNear, camera, hash, create };
})();
