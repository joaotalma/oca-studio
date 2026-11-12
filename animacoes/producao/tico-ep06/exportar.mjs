import {chromium} from '../../node_modules/playwright-core/index.mjs';
import {serve} from '../../engine/take-one/serve.mjs';
import {spawn} from 'node:child_process';
import fs from 'node:fs';
const root='C:/Users/joaot/Projetos/se-vira-tico',ep=root+'/episodios/ep06',out=root+'/render';fs.mkdirSync(out,{recursive:true});
const {srv,url}=await serve(ep);const browser=await chromium.launch({channel:'chrome',headless:true});
const proof=process.argv.includes('--prova'),W=proof?540:1080,H=proof?960:1920;
const page=await browser.newPage({viewport:{width:W,height:H}});const errors=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
await page.goto(url+'/film.html');await page.waitForFunction(()=>window.READY===true);
const dur=await page.evaluate(()=>FILM_DURATION);
if(proof){for(const t of [0,3,7,8.1,8.8,9.3,12,15,18,21,25.5,30,34,36,40,44,47.5,49.8,50.5,51,52,55,Math.floor((dur-1/30)*1000)/1000]){await page.evaluate(t=>renderFrame(t),t);await page.screenshot({path:out+`/ep06_prova_${t}.png`});} console.log(JSON.stringify({dur,errors}));}
else{
 const tail=process.argv.includes('--cauda'),si=process.argv.indexOf('--trecho'),first=si>=0?Math.round(Number(process.argv[si+1])*30):tail?1482:0,last=si>=0?Math.round(Number(process.argv[si+2])*30):Math.ceil(dur*30),target=si>=0?'/'+process.argv[si+3]:tail?'/ep06_cauda.mp4':'/ep06_mudo.mp4';
 const ff=spawn('ffmpeg',['-y','-v','error','-f','image2pipe','-framerate','30','-i','-','-c:v','libx264','-preset','fast','-crf','17','-pix_fmt','yuv420p','-movflags','+faststart',out+target],{stdio:['pipe','ignore','inherit']});
 for(let i=first;i<last;i++){const b=await page.evaluate(async t=>{await renderFrame(t);return document.querySelector('canvas').toDataURL('image/jpeg',.95).split(',')[1]},i/30);if(errors.length)throw Error(errors.join('\n'));if(!ff.stdin.write(Buffer.from(b,'base64')))await new Promise(r=>ff.stdin.once('drain',r));if(i%300===0)console.log(`${i/30}s / ${dur}s`);}
 ff.stdin.end();const code=await new Promise(r=>ff.on('close',r));if(code)throw Error('FFmpeg '+code);console.log(JSON.stringify({dur,errors,render:'ep06_mudo.mp4'}));
}
await browser.close();srv.close();
