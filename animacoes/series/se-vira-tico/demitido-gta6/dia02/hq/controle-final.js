'use strict';
(() => {
 const c=document.getElementById('filme');c.width=innerWidth;c.height=innerHeight;const ctx=c.getContext('2d');
 const cenas={};
 const carregar=async(nome)=>{const f=document.createElement('iframe');const loaded=new Promise((ok,no)=>{f.onload=ok;f.onerror=no;});f.src=nome+'/film.html';document.body.appendChild(f);await loaded;if(f.contentWindow.READY!==true)throw new Error('Cena não preparada: '+nome);f.contentWindow.LEGENDAS_EXTERNAS=true;cenas[nome]=f.contentWindow;};
 const pronto=Promise.all(['parte1','luta','parte2'].map(carregar));
 window.FILM_DURATION=117.8;
 // Cortes de composição e eventos gráficos deliberados; legendas usam o alinhamento real.
 window.CUTS=[7.4,9.7,12.4,17,19.4,21.6,24,25.25,25.9,28.35,30.6,31.9,32.3,32.7,34.8,38.2,38.9,39.9,42.4,42.7,46.15,50.5,52.1,56.1,64.5,68.8,75.4,79.6,86.7,88.35,99.7,104.5,110.6,116.7];
 // 42,4/42,7: abertura e fechamento do flash da selfie, efeito fotográfico visível.
 window.renderFrame=async(t)=>{
  await pronto;
  const nome=t<24?'parte1':t<39.9?'luta':'parte2',w=cenas[nome];
  await w.renderFrame(nome==='luta'?t-24:t);
  const src=w.document.querySelector('canvas');ctx.clearRect(0,0,c.width,c.height);ctx.drawImage(src,0,0,c.width,c.height);
  const l=t<110.6?DADOS.legendas.find(l=>t>=l.ini&&t<l.fim):null;
  const fala=DADOS.falas.find(f=>t>=f.ini&&t<f.fim);
  const suav=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
  if(fala){ctx.save();ctx.scale(c.width/1080,c.height/1920);ctx.font='900 64px Arial';ctx.textAlign='center';ctx.textBaseline='middle';
   ctx.globalAlpha=Math.min(suav((t-fala.ini)/.3),suav((fala.fim-t)/.3));
   ctx.fillStyle='#151a2a';ctx.strokeStyle='#fff3d3';ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(56,1458,968,102,12);ctx.fill();ctx.stroke();ctx.restore();
  }
  if(l){ctx.save();ctx.scale(c.width/1080,c.height/1920);ctx.font='900 64px Arial';ctx.textAlign='center';ctx.textBaseline='middle';
   const largura=ctx.measureText(l.texto).width;if(largura>928)throw new Error('Legenda excede caixa: '+l.texto);
   ctx.globalAlpha=Math.min(suav((t-l.ini)/.12),suav((l.fim-t)/.12));ctx.fillStyle='#fff7df';ctx.fillText(l.texto,540,1509);ctx.restore();
  }
 };
 pronto.then(()=>window.renderFrame(0)).then(()=>{window.READY=true;});
})();
