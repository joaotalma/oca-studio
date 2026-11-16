import fs from 'node:fs';import path from 'node:path';import{spawnSync}from'node:child_process';import{fileURLToPath}from'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),hq=path.resolve(here,'../hq'),root=path.resolve(here,'../../../../..'),out=path.join(root,'render/demitido-gta6/dia02-revisao-joao');
const run=(cmd,args)=>{const r=spawnSync(cmd,args,{encoding:'utf8',maxBuffer:1<<24});if(r.status)throw Error(r.stderr);return r.stdout;};
run(process.execPath,[path.join(hq,'preparar-final.mjs')]);fs.mkdirSync(out,{recursive:true});
const base=path.join(root,'render/demitido-gta6/dia02-final');
for(const x of ['parte1','parte2','luta','vendor'])fs.cpSync(path.join(base,x),path.join(out,x),{recursive:true});
for(const x of ['film.html','controle-final.js','export.mjs','serve.mjs','still.mjs'])fs.copyFileSync(path.join(base,x),path.join(out,x));
const A=path.resolve(here,'../../../audio/demitido-gta6-dia02'),N=path.join(A,'revisao-joao');
const duration=p=>+run('ffprobe',['-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',p]);
const intro=duration(path.join(N,'19_kaua2.mp3'))+.25;
const fim=24+intro+15.9+53.55;
const nar=duration(path.join(A,'18_kaua2.mp3')),cta=duration(path.join(N,'20_kaua2.mp3'));
const dur=+(fim+nar+.3+cta+.8).toFixed(3);
const map=t=>t<24?t:t>=24&&t<39.9?t+intro:t>=46.15&&t<99.7?t+intro-6.25:null;
const old=JSON.parse(fs.readFileSync(path.join(base,'timeline.json'),'utf8'));
const falas=old.falas.filter(f=>![9,3,4,18,11].includes(f.n)).map(f=>({...f,ini:map(f.ini),fim:map(f.fim),palavras:f.palavras.map(p=>[p[0],map(p[1]),map(p[2])]),arquivo:path.join(A,String(f.n).padStart(2,'0')+'_kaua2.mp3')}));
for(const [n,ini,dir] of [[19,24,N],[11,map(52.2),N],[18,fim,A],[20,fim+nar+.3,N]]){const al=JSON.parse(fs.readFileSync(path.join(dir,'alinhamento',n+'.json'),'utf8'));const arquivo=path.join(dir,String(n).padStart(2,'0')+'_kaua2.mp3');falas.push({n,ini,fim:ini+duration(arquivo),texto:al.texto,arquivo,palavras:al.palavras.map(p=>[p.palavra,ini+p.ini,ini+p.fim])});}
falas.sort((a,b)=>a.ini-b.ini);const legendas=[];
for(const f of falas){let g=[];const flush=()=>{if(g.length)legendas.push({ini:g[0][1]-.025,fim:g.at(-1)[2]+.1,texto:g.map(p=>p[0]).join(' ')});g=[];};for(const p of f.palavras){if(g.length&&(g.length>=3||g.map(p=>p[0]).join(' ').length+p[0].length>23))flush();g.push(p);if(/[.!?:]$/.test(p[0]))flush();}flush();}
for(let i=0;i<legendas.length-1;i++)legendas[i].fim=Math.min(legendas[i].fim,legendas[i+1].ini);
fs.writeFileSync(path.join(out,'dados.js'),`const DADOS=${JSON.stringify({legendas,falas:falas.map(f=>({ini:f.ini-.03,fim:f.fim+.12}))})};`);
fs.writeFileSync(path.join(out,'falas.js'),`const FALAS = ${JSON.stringify(falas.map(({palavras,arquivo,...f})=>f),null,2)};`);
fs.writeFileSync(path.join(out,'timeline.json'),JSON.stringify({duracao:dur,intro,fimVoto:fim,falas},null,2));
let controller=fs.readFileSync(path.join(out,'controle-final.js'),'utf8');
controller=controller.replace('window.FILM_DURATION=117.8;',`window.FILM_DURATION=${dur};`);
controller=controller.replace(/window.CUTS=\[[^;]+;/,`window.CUTS=${JSON.stringify([7.4,9.7,12.4,17,19.4,21.6,24,24+intro,38.2+intro,39.9+intro,...[50.5,52.1,56.1,64.5,68.8,75.4,79.6,86.7,88.35].map(t=>map(t)),fim])};`);
controller=controller.replace("const nome=t<24?'parte1':t<39.9?'luta':'parte2',w=cenas[nome];\n  await w.renderFrame(nome==='luta'?t-24:t);",`let nome,srcT;if(t<24){nome='parte1';srcT=t;}else if(t<${24+intro}){nome='parte1';srcT=21.6+(t-24)*.5;}else if(t<${39.9+intro}){nome='luta';srcT=t-${24+intro};}else if(t<${fim}){nome='parte2';srcT=t-${intro}+6.25;}else{nome='parte2';srcT=110.6+Math.min(5.5,t-${fim});}const w=cenas[nome];await w.renderFrame(srcT);`);
controller=controller.replace("const l=t<110.6?DADOS.legendas.find(l=>t>=l.ini&&t<l.fim):null;","const l=DADOS.legendas.find(l=>t>=l.ini&&t<l.fim);");
// No voto, reservar abaixo dos cartões apenas a legenda da fala/CTA.
controller=controller.replaceAll('1458', '1755').replaceAll('1509','1806');
fs.writeFileSync(path.join(out,'controle-final.js'),controller);
const inputs=falas.map(f=>[f.arquivo,f.ini]);
// Preservar os efeitos originais, aplicando os mesmos cortes da imagem.
run('ffmpeg',['-v','error','-y','-i',path.join(base,'efeitos.wav'),'-filter_complex',`[0:a]atrim=0:24,asetpts=PTS-STARTPTS[a];anullsrc=r=48000:cl=mono,atrim=duration=${intro}[b];[0:a]atrim=24:39.9,asetpts=PTS-STARTPTS[c];[0:a]atrim=46.15:99.7,asetpts=PTS-STARTPTS[d];anullsrc=r=48000:cl=mono,atrim=duration=${dur-fim}[e];[a][b][c][d][e]concat=n=5:v=0:a=1[s]`,'-map','[s]',path.join(out,'efeitos.wav')]);
inputs.push([path.join(out,'efeitos.wav'),0]);
for(const [file,t]of[['round',24.05],['fight',25.3],['ko',38.85]])inputs.push([path.join(A,'anunciador',file+'.mp3'),t+intro]);
const filters=inputs.map(([,t],i)=>`[${i}:a]adelay=${Math.round(t*1000)}:all=1[a${i}]`).join(';')+';'+inputs.map((_,i)=>`[a${i}]`).join('')+`amix=inputs=${inputs.length}:normalize=0:duration=longest,apad=whole_dur=${dur}[m]`;
run('ffmpeg',['-v','error','-y',...inputs.flatMap(([p])=>['-i',p]),'-filter_complex',filters,'-map','[m]','-t',String(dur),'-ar','48000','-ac','2',path.join(out,'mixagem.wav')]);
run('ffmpeg',['-v','error','-y','-i',path.join(out,'mixagem.wav'),'-af','loudnorm=I=-16:TP=-1.5:LRA=11','-ar','48000','-ac','2',path.join(out,'audio-master.wav')]);
fs.writeFileSync(path.join(out,'pausas-visuais.json'),JSON.stringify([{ini:7.4,fim:9.7,motivo:'Resultado do voto'},{ini:map(75.4),fim:map(79.6),motivo:'Conta do saldo'},{ini:map(79.6),fim:map(88.35),motivo:'Leitura do chat e da regra'},{ini:fim,fim:dur,motivo:'Uma única tela para comparar cadeira e camisa, com narração e CTA solicitado pelo João'}],null,2));
console.log(JSON.stringify({out,dur,intro,fim}));
