import {chromium} from '../../node_modules/playwright-core/index.mjs';
import {serve} from '../../engine/take-one/serve.mjs';
import {spawn} from 'node:child_process';
import fs from 'node:fs';
const R='C:/Users/joaot/Projetos/se-vira-tico',S='C:/Users/joaot/Projetos/plotline/producao/tico-ep06-v2',root=R+'/episodios/ep06/v2';
const proof=process.argv.includes('--prova'),draft=process.argv.includes('--rascunho'),W=proof||draft?540:1080,H=proof||draft?960:1920,fps=draft?15:30;
const {srv,url}=await serve(root),browser=await chromium.launch({channel:'chrome',headless:true}),errors=[];
async function open(){const p=await browser.newPage({viewport:{width:W,height:H}});p.on('pageerror',e=>errors.push(e.message));await p.goto(url+'/film.html');await p.waitForFunction(()=>window.READY===true);return p;}
const p=await open(),dur=await p.evaluate(()=>FILM_DURATION),meta=await p.evaluate(()=>({B,F:FALAS}));
if(proof){
 fs.mkdirSync(S+'/provas',{recursive:true});const ff=Object.fromEntries(meta.F.map(f=>[f.n,f])),b=meta.B;
 const samples={gancho:0,prazo:4.5,turbo:b.turbo+.08,traseira:b.traseira+.2,vermelho:(b.traseira+b.chegada)/2,chegada:b.chegada+.6,outro:ff[5].ini+.3,magoa:ff[6].ini+.4,triste:ff[8].fim+1.1,convite:ff[9].ini+.4,sentados:b.cinema+1.7,contar:ff[12].ini+.3,olhos:ff[15].ini+.2,juntos:b.juntos+.5,silencio:b.silencio+.6,doce:ff[16].ini+.65,curso:ff[17].ini+.6,gente:ff[19].ini+.3,resposta:ff[20].ini+.4,fim:dur-1/fps};
 for(const [name,t]of Object.entries(samples)){await p.evaluate(async t=>renderFrame(t),t);await p.screenshot({path:S+'/provas/'+name+'.png'});}
 console.log(JSON.stringify({dur,errors,samples}));
}else{
 const pages=[p,await open(),await open()],si=process.argv.indexOf('--trecho'),first=si>=0?Math.round(Number(process.argv[si+1])*fps):0,last=si>=0?Math.round(Number(process.argv[si+2])*fps):Math.ceil(dur*fps),file=si>=0?process.argv[si+3]:draft?'ep06_v2_rascunho_mudo.mp4':'ep06_v2_mudo.mp4';
 const enc=spawn('ffmpeg',['-y','-v','error','-f','image2pipe','-framerate',String(fps),'-i','-','-c:v','libx264','-threads','2','-preset','fast','-crf','17','-pix_fmt','yuv420p','-movflags','+faststart',R+'/render/'+file],{stdio:['pipe','ignore','inherit']});
 for(let i=first;i<last;i+=pages.length){const batch=await Promise.all(pages.map(async(page,j)=>{if(i+j>=last)return null;return page.evaluate(async t=>{await renderFrame(t);return document.querySelector('canvas').toDataURL('image/jpeg',.95).split(',')[1]},(i+j)/fps)}));if(errors.length)throw Error(errors.join('\n'));for(const b of batch)if(b&&!enc.stdin.write(Buffer.from(b,'base64')))await new Promise(r=>enc.stdin.once('drain',r));if(i%(fps*10)===0)console.log(`${i/fps}s / ${dur}s`);}
 enc.stdin.end();const code=await new Promise(r=>enc.on('close',r));if(code)throw Error('FFmpeg '+code);console.log(JSON.stringify({dur,errors,file}));
}
await browser.close();srv.close();
