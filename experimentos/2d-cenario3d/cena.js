/* Perspectiva 3D em Canvas. Apenas t determina o quadro. Arte 2D aprovada intacta. */
const canvas=document.getElementById('c'),ctx=canvas.getContext('2d');
const W=1080,H=1920, F=1650;
const C={ink:'#090b16',white:'#f6f1e4',yellow:'#ffe14d',skin:'#C58A63',rust:'#B5532F',purple:'#4a2a80',blue:'#20308a'};
let timeline,images={};
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const ease=x=>{x=clamp(x);return x*x*(3-2*x)};
const mix=(a,b,t)=>a+(b-a)*t;
const rgb=h=>h.startsWith('rgb')?h.match(/\d+/g).slice(0,3).map(Number):h.match(/[a-f\d]{2}/gi).map(n=>parseInt(n,16));
const tint=(h,k)=>`rgb(${rgb(h).map(n=>Math.round(clamp(n*k,0,255))).join(',')})`;
let cam,queue,lighting;
const litCanvas=document.createElement('canvas');litCanvas.width=360;litCanvas.height=900;
const litCtx=litCanvas.getContext('2d');
function faceLight(color,point,normal){
 const base=rgb(color),warm=rgb(lighting.color),d=lighting.pos.map((v,i)=>v-point[i]);
 const distance=Math.hypot(...d),dot=Math.max(0,d.reduce((s,v,i)=>s+v*normal[i],0)/distance);
 const strength=dot*lighting.power/(1+distance*distance*.055);
 return `rgb(${base.map((n,i)=>Math.round(clamp(n*(.57+strength*warm[i]/255),0,255))).join(',')})`;
}
function cameraPoint(v){
  const dx=v[0]-cam.x,dy=v[1]-cam.y,dz=v[2]-cam.z;
  const x=dx*Math.cos(cam.yaw)-dz*Math.sin(cam.yaw),z=dx*Math.sin(cam.yaw)+dz*Math.cos(cam.yaw);
  const y=dy*Math.cos(cam.pitch)-z*Math.sin(cam.pitch),zz=dy*Math.sin(cam.pitch)+z*Math.cos(cam.pitch);
  return {x,y,z:zz};
}
const screen=p=>({x:W/2+p.x*F/p.z,y:1170-p.y*F/p.z,z:p.z});
const project=v=>screen(cameraPoint(v));
function poly(v,color,stroke=null,alpha=1){
  // Clip at the near plane; never drop the whole road when the camera passes
  // one of its corners. A rejected full polygon would cause a visible flash.
  const vertices=v.map(cameraPoint),clipped=[];const near=.3;
  for(let i=0;i<vertices.length;i++){
    const a=vertices[(i+vertices.length-1)%vertices.length],b=vertices[i],ai=a.z>=near,bi=b.z>=near;
    if(ai!==bi){const k=(near-a.z)/(b.z-a.z);clipped.push({x:mix(a.x,b.x,k),y:mix(a.y,b.y,k),z:near});}
    if(bi)clipped.push(b);
  }
  if(clipped.length<3)return;const p=clipped.map(screen);
  queue.push({z:p.reduce((a,n)=>a+n.z,0)/p.length,draw(){ctx.globalAlpha=alpha;ctx.beginPath();p.forEach((n,i)=>i?ctx.lineTo(n.x,n.y):ctx.moveTo(n.x,n.y));ctx.closePath();ctx.fillStyle=color;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.4;ctx.stroke()}ctx.globalAlpha=1;}});
}
function line(v,color,width=2){const p=v.map(project);if(p.some(n=>n.z<.3))return;queue.push({z:p.reduce((a,n)=>a+n.z,0)/p.length,draw(){ctx.beginPath();p.forEach((n,i)=>i?ctx.lineTo(n.x,n.y):ctx.moveTo(n.x,n.y));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}})}
function box(x,y,z,w,h,d,color){
  poly([[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z]],faceLight(color,[x+w/2,y+h/2,z],[0,0,-1]),C.ink);
  poly([[x,y,z+d],[x,y,z],[x,y+h,z],[x,y+h,z+d]],faceLight(color,[x,y+h/2,z+d/2],[-1,0,0]),C.ink);
  poly([[x+w,y,z],[x+w,y,z+d],[x+w,y+h,z+d],[x+w,y+h,z]],faceLight(color,[x+w,y+h/2,z+d/2],[1,0,0]),C.ink);
  poly([[x,y+h,z],[x+w,y+h,z],[x+w,y+h,z+d],[x,y+h,z+d]],faceLight(color,[x+w/2,y+h,z+d/2],[0,1,0]),C.ink);
}
function groundEllipse(x,z,rx,rz,color,alpha){const v=[];for(let n=0;n<40;n++){let a=n*Math.PI/20;v.push([x+Math.cos(a)*rx,.014,z+Math.sin(a)*rz]);}poly(v,color,null,alpha)}
function softPool(x,z,rx,rz,color,opacity){for(let i=24;i>0;i--)groundEllipse(x,z,rx*i/24,rz*i/24,color,opacity/20);}
function lightCharacter(img){
 litCtx.setTransform(1,0,0,1,0,0);litCtx.globalCompositeOperation='source-over';litCtx.globalAlpha=1;litCtx.clearRect(0,0,360,900);litCtx.drawImage(img,0,0);
 // The visible source is on the RIGHT in both scenes. Its power is the same
 // value used by the window/lamp, the set surfaces, and the pool on the ground.
 const lit=lighting.character,ambient=[112,133,179],warm=[255,240,211];
 const illuminated=p=>`rgb(${ambient.map((n,i)=>Math.round(mix(n,warm[i],p*lit))).join(',')})`;
 const key=litCtx.createLinearGradient(0,0,360,0);key.addColorStop(0,illuminated(.01));key.addColorStop(.45,illuminated(.10));key.addColorStop(.85,illuminated(.85));key.addColorStop(1,illuminated(1));
 litCtx.globalCompositeOperation='multiply';litCtx.fillStyle=key;litCtx.fillRect(0,0,360,900);
 // Restore the exact cutout alpha after multiplication, retaining linework.
 litCtx.globalCompositeOperation='destination-in';litCtx.drawImage(img,0,0);
 litCtx.globalAlpha=1;litCtx.globalCompositeOperation='source-over';return litCanvas;
}
function sprite(name,x,z,h,t){
  const blink=(t>2.1&&t<2.23)||(t>5.6&&t<5.73);
  const img=images[name+(blink?'-pisca':'')], feet=project([x,0,z]),head=project([x,h,z]);
  const ch=feet.y-head.y,cw=ch*360/900;
  const a=project([x,1.8,z]);
  softPool(x-.08,z+.05,.64,.22,C.ink,.65);
  poly([[x-.18,.015,z],[x+.18,.015,z],[x-.8,.015,z-1.25],[x-1.4,.015,z-.9]],C.ink,null,.16*lighting.character);
  queue.push({z:a.z-.015,draw(){
    const breath=1+.005*Math.sin(t*2.6),tilt=.008*Math.sin(t*1.4);
    ctx.save();ctx.translate(feet.x,feet.y);ctx.rotate(tilt);ctx.scale(1,breath);
    ctx.drawImage(lightCharacter(img),-cw/2,-ch,cw,ch);ctx.restore();
  }});
}
function house(x,z,w,h,d,base,lit,t){
  box(x,0,z,w,h,d,base);
  const roof='#653c3a';
  poly([[x-.13,h,z-.13],[x+w/2,h+1.0,z-.13],[x+w+.13,h,z-.13]],tint(roof,1.2),C.ink);
  poly([[x+w/2,h+1,z-.13],[x+w/2,h+1,z+d+.13],[x+w+.13,h,z+d+.13],[x+w+.13,h,z-.13]],tint(roof,.75),C.ink);
  poly([[x-.13,h,z-.13],[x-.13,h,z+d+.13],[x+w/2,h+1,z+d+.13],[x+w/2,h+1,z-.13]],roof,C.ink);
  poly([[x+w*.67,0,z-.015],[x+w*.9,0,z-.015],[x+w*.9,h*.73,z-.015],[x+w*.67,h*.73,z-.015]],'#090e20',C.ink);
  const glow=lit?lighting.window:0;
  const win=lit?`rgb(${Math.round(mix(22,255,glow))},${Math.round(mix(30,218,glow))},${Math.round(mix(47,112,glow))})`:'#0b1020';
  poly([[x+w*.15,h*.36,z-.025],[x+w*.45,h*.36,z-.025],[x+w*.45,h*.75,z-.025],[x+w*.15,h*.75,z-.025]],win,C.ink);
  line([[x+w*.30,h*.36,z-.04],[x+w*.30,h*.75,z-.04]],'#283044',2);
  // Street-facing side window is visible even when the front is out of frame.
  const sideX=x>0?x-.025:x+w+.025;
  poly([[sideX,h*.31,z+.5],[sideX,h*.31,z+1.95],[sideX,h*.79,z+1.95],[sideX,h*.79,z+.5]],win,C.ink);
  line([[sideX,h*.31,z+1.23],[sideX,h*.79,z+1.23]],'#283044',2);
  // Doorframe and roof joints add scale without decorative particles.
  for(let dz=.35;dz<d;dz+=.55)line([[x+w/2,h+1,z+dz],[x+w+.1,h,z+dz]],'#422c35',1.3);
  box(x-.025,.04,z-.03,w+.05,.12,d+.05,tint(base,1.15));
  line([[sideX,.18,z+.18],[sideX,h-.10,z+.18]],'#414858',2);
  if(glow){
   softPool(x-.65,z+1.2,1.7,1.15,'#f6c66f',.22*glow);
   poly([[sideX,.02,z+.5],[sideX,.02,z+1.95],[x-3.8,.02,z+1.3],[x-3.8,.02,z-.6]],'#e8bb71',null,.11*glow);
   // Reflection stays attached to the physical window in world coordinates.
   for(let j=0;j<7;j++)poly([[x-.3-j*.2,.018,z+.52],[x-.3-j*.2,.018,z+1.9],[x-.4-j*.2,.018,z+1.9],[x-.4-j*.2,.018,z+.52]],'#f0cc83',null,.055*glow*(1-j/8));
  }
}
function lamp(x,z,on,palette,h=5.5){
  box(x,0,z,.10,h,.10,'#182336');box(x-.1,h-.1,z-.1,.85,.1,.15,'#25304b');
  box(x+.48,h-.22,z-.18,.42,.16,.4,on?'#e5c580':'#253047');
  if(on)softPool(x+.6,z,1.3,1.8,palette,.18);
}
function eyes(x,z,t){
  const p=project([x,.94,z]),s=F/p.z;const alpha=ease((t-2.5)/1.2);
  groundEllipse(x,z,.45,.2,C.ink,.3*alpha);
  queue.push({z:p.z,draw(){ctx.globalAlpha=alpha;ctx.fillStyle='#0b1016';ctx.beginPath();ctx.ellipse(p.x,p.y,s*.40,s*.9,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(p.x,p.y-s*.8,s*.42,s*.45,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#d9402a';for(const dx of [-.18,.18]){ctx.beginPath();ctx.ellipse(p.x+dx*s,p.y-s*.82,s*.12,s*.07,0,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;}});
}
function renderWorld(scene,t){
  const beats=timeline.scenes[1].beats;
  const u=t/8,v=scene==='varginha',windowPower=ease((t-(beats.janelaAcende-8))/(beats.janela-beats.janelaAcende));
  lighting=v?{pos:[2.8,4.0,4.4],color:'#ffdaa0',power:1.5,character:.95,window:0}:{pos:[2.47,1.65,7.4],color:'#ffe0a0',power:2.4*windowPower,character:windowPower,window:windowPower};
  // Shots start in a move and continue through the cut. Curved camera paths
  // hold the character while nearby pillars and distant roofs reveal parallax.
  cam=v?{x:mix(-1.45,.95,u),y:2.4,z:mix(-4.8,-4.25,ease(u)),pitch:-.08}:{x:mix(1.05,-.1,u),y:2.4,z:mix(-5.2,-4.0,u),pitch:-.08};
  cam.yaw=v?Math.atan2(-.05-cam.x,1.1-cam.z):mix(.025,.085,u);
  const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,v?'#120a22':'#060a1e');sky.addColorStop(.6,v?'#392353':'#192d56');sky.addColorStop(1,'#141522');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  queue=[];
  const base=v?'#3c3150':'#283852';
  poly([[-65,0,-4],[65,0,-4],[65,0,100],[-65,0,100]],v?'#24232b':'#1a2436');
  // Concrete pavement seams, kerbs and long street provide perspective cues.
  poly([[-2.2,.006,-4],[2.2,.006,-4],[2.2,.006,80],[-2.2,.006,80]],v?'#2c2930':'#202b3c');
  for(let z=-2;z<60;z+=1.7){line([[-2.2,.012,z],[2.2,.012,z]],v?'#36313b':'#2c3748',1.1);line([[.0,.012,z],[.0,.012,z+1.7]],'#252b39',1)}
  box(-2.5,0,-2,.22,.13,65,base);box(2.3,0,-2,.22,.13,65,base);
  for(let i=0;i<9;i++){
    let z=6+i*5.2;
    house(-6.8,z,3.5,2.6+(i%3)*.3,3.7,base,false,t);
    house(2.5,z+.15,3.4,2.7+(i%2)*.4,3.8,base,!v&&i===0,t);
  }
  for(let i=0;i<6;i++){const z=10+i*9;box(-12,0,z,3,7+(i%3)*2.5,4,tint(base,.75));box(9,0,z,3,8+(i%2)*3,4,tint(base,.65));}
  if(v){
    // Same low wall and terrain as the approved image, now with real thickness.
    for(let i=0;i<14;i++)box(-7+i*1.04,0,7.1,.99,1.85,.30,i%2?'#4a3562':'#533e70');
    for(let i=0;i<20;i++){let x=-2.1+(i*1.37%4.1),z=3.3+(i*1.91%8);poly([[x,0,z],[x+.12,.30,z],[x+.24,0,z]],'#36583b');}
    eyes(1.8,6.2,t);lamp(2.2,4.4,true,'#ffdaa0',4.2);
  }else{
    lamp(-2.7,3.4,false,'#ffe14d');lamp(2.7,12,false,'#ffe14d');lamp(-2.7,24,false,'#ffe14d');
    line([[-2.65,5.2,3.4],[2.75,5.2,12],[-2.65,5.2,24]],'#0b1120',2.2);
  }
  sprite(v?'varginha':'apagao',v?-.45:.1,1.1,3.8,t);
  // Foreground has a different depth and occludes the environment at frame edge.
  box(v?-3.5:-3.0,0,v?1.7:1.2,.42,4.2,.42,v?'#262034':'#182235');
  queue.sort((a,b)=>b.z-a.z);queue.forEach(q=>q.draw());
  const fog=ctx.createLinearGradient(0,500,0,1400);fog.addColorStop(0,'rgba(17,15,35,0.1)');fog.addColorStop(1,'rgba(17,15,35,0)');ctx.fillStyle=fog;ctx.fillRect(0,500,W,900);
}
function textLines(text,size,maxWidth){ctx.font=`800 ${size}px Barlow`;const words=text.split(' '),lines=[];let line='';for(const word of words){const a=line?line+' '+word:word;if(ctx.measureText(a).width>maxWidth&&line){lines.push(line);line=word}else line=a}lines.push(line);return lines;}
function captions(t){
  const cap=timeline.captions.find(c=>t>=c.from&&t<c.to)||timeline.captions.at(-1);
  // Deliberate type treatment from the approved template, above the character.
  const shade=ctx.createLinearGradient(0,0,0,700);shade.addColorStop(0,'rgba(6,8,18,.96)');shade.addColorStop(.6,'rgba(6,8,18,.68)');shade.addColorStop(1,'rgba(6,8,18,0)');ctx.fillStyle=shade;ctx.fillRect(0,0,W,700);
  ctx.textAlign='left';ctx.textBaseline='top';ctx.font='800 43px Barlow';ctx.fillStyle=C.yellow;ctx.fillText('E SE...',108,174);
  const size=t<8?96:84,lines=textLines(cap.text,size,830);ctx.font=`800 ${size}px Barlow`;ctx.fillStyle=C.white;
  for(let i=0;i<lines.length;i++)ctx.fillText(lines[i],104,265+i*size*1.03);
}
window.FILM_DURATION=16;window.DUR=16;window.FPS=30;window.CUTS=[4,8,12];
window.TEXTS=t=>timeline.captions.filter(c=>t>=c.from&&t<c.to).map(c=>({text:c.text,px:t<8?96:84}));
window.LIGHT_STATE=()=>({window:lighting.window,character:lighting.character,source:lighting.pos,left:[...litCtx.getImageData(85,420,1,1).data],right:[...litCtx.getImageData(275,420,1,1).data]});
window.renderFrame=window.seek=t=>{t=clamp(t,0,15.999);ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.clearRect(0,0,W,H);renderWorld(t<8?'varginha':'apagao',t%8);captions(t);};
window.READY=false;
Promise.all([fetch('timeline.json').then(r=>r.json()).then(v=>timeline=v),document.fonts.load('800 96px Barlow'),...['varginha','varginha-pisca','apagao','apagao-pisca'].map(name=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{
  // Discard only the pure-black contact shadow baked into the layer; a world-space
  // shadow replaces it. The character's #20161c outlines and colour stay intact.
  const clean=document.createElement('canvas');clean.width=360;clean.height=900;
  const pad=name.startsWith('apagao')?300:0;
  const g=clean.getContext('2d');g.drawImage(img,340+pad,750+pad,360,900,0,0,360,900);const pixels=g.getImageData(0,0,360,900);
  for(let i=0;i<pixels.data.length;i+=4)if(pixels.data[i]<=1&&pixels.data[i+1]<=1&&pixels.data[i+2]<=1)pixels.data[i+3]=0;
  g.putImageData(pixels,0,0);images[name]=clean;resolve();
};img.onerror=reject;img.src=`assets/${name}.png`;}))]).then(()=>{window.renderFrame(0);window.READY=true;});
