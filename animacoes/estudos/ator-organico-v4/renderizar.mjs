import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {chromium} from 'playwright-core';
import {serve} from '../../motor/take-one/serve.mjs';
const root=fileURLToPath(new URL('./',import.meta.url));
const out=path.resolve(root,'../../render/ator-organico-v4');await fs.mkdir(out,{recursive:true});
const {srv,url}=await serve(root);
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-gpu','--no-sandbox']});
try{
  const page=await browser.newPage({viewport:{width:1280,height:900},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`${url}/index.html?render`,{waitUntil:'networkidle'});await page.waitForFunction(()=>window.READY);
  // Leitura fora de ordem precisa produzir os mesmos pixels.
  const scope=await page.evaluate(()=>verifyScope());
  if(!scope)throw Error('Mudança fora do painel revisado');
  const pixels=await page.evaluate(()=>{const times=[0,.8,1.2,2.65,2.9,3,4.4,6.2,7.2,8.8,11.8],saved=times.map(t=>{renderFrame(t);return document.querySelector('canvas').toDataURL();});for(let i=times.length-1;i>=0;i--){renderFrame(times[i]);if(document.querySelector('canvas').toDataURL()!==saved[i])return false;}return true;});
  if(!pixels)throw Error('Render não determinístico');
  const marks=[0,.8,1.2,1.7,2.65,2.9,3.2,4.4,5.2,6.2,7.2,8.8,10.5,11.8];
  for(let i=0;i<marks.length;i++){
    await page.evaluate(t=>renderFrame(t),marks[i]);
    await page.locator('canvas').screenshot({path:path.join(out,`quadro-${String(i).padStart(2,'0')}.png`)});
  }
  for(const [prefix,times] of [['hook',Array.from({length:6},(_,i)=>i*.3)],['gesto',Array.from({length:12},(_,i)=>2.5+i*.1)]]){
    for(let i=0;i<times.length;i++){
      await page.evaluate(t=>renderFrame(t),times[i]);
      await page.locator('canvas').screenshot({path:path.join(out,`${prefix}-${String(i).padStart(2,'0')}.png`)});
    }
  }
  await page.evaluate(()=>renderVisemes());await page.locator('canvas').screenshot({path:path.join(out,'bocas.png')});
  await page.evaluate(()=>renderSmiles());await page.locator('canvas').screenshot({path:path.join(out,'sorrisos.png')});
  await page.evaluate(()=>renderEyes());await page.locator('canvas').screenshot({path:path.join(out,'olhares.png')});
  await page.evaluate(()=>renderEyeStyles());await page.locator('canvas').screenshot({path:path.join(out,'comparacao-olhos.png')});
  if(process.argv.includes('--quadros')){console.log(JSON.stringify({out,pixels,errors}));}
  else{
    const encoder=spawn('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','image2pipe','-framerate','30','-vcodec','mjpeg','-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','19','-pix_fmt','yuv420p','-movflags','+faststart',path.join(out,'comparacao-organica.mp4')],{stdio:['pipe','ignore','pipe']});
    let stderr='';encoder.stderr.on('data',b=>stderr+=b);
    const completion=once(encoder,'close');encoder.stdin.on('error',()=>{});
    for(let i=0;i<360;i++){
      const data=await page.evaluate(t=>{renderFrame(t);return document.querySelector('canvas').toDataURL('image/jpeg',.94).split(',')[1];},i/30);
      if(!encoder.stdin.write(Buffer.from(data,'base64')))await once(encoder.stdin,'drain');
      if(i%90===0)console.log(`Render ${i}/360`);
    }
    encoder.stdin.end();const [code]=await completion;if(code!==0)throw Error(stderr);
    if(errors.length)throw Error(errors.join('\n'));
    await fs.writeFile(path.join(out,'verificacao.json'),JSON.stringify({duration:12,fps:30,width:1280,height:900,audio:false,deterministicPixels:pixels,unchangedOutsideRightPanel:scope,browserErrors:errors,marks},null,2));
    console.log(JSON.stringify({out,pixels,errors}));
  }
}finally{await browser.close();await new Promise(r=>srv.close(r));}
