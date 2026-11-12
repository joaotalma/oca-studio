import { chromium } from 'playwright-core';
import fs from 'node:fs';
import {serve} from '../../engine/take-one/serve.mjs';
const {srv,url}=await serve('.');
let browser;
try{
 browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:1080,height:1920}});
 const errors=[];page.on('pageerror',e=>{errors.push(e.message);console.log('Erro de cena:',e.message)});page.on('console',e=>{if(e.type()==='error'){errors.push(e.text());console.log(e.text())}});
 console.log('Conferindo a cena local.');
 await page.goto(url+'/render/exemplo-2d-3d/film.html',{waitUntil:'domcontentloaded',timeout:120000});await page.waitForFunction(()=>window.READY===true,null,{timeout:120000});
 fs.mkdirSync('render/exemplo-2d-3d/quadros',{recursive:true});
 for(const t of [0,2,3.8,4.1,7.8,8,9.3,10,11.25,11.6,12,15.8]){await page.evaluate(t=>window.renderFrame(t),t);await page.screenshot({path:`render/exemplo-2d-3d/quadros/${String(t).replace('.','_')}.png`});}
 // Determinism: real pixel buffers, out of order on the same page.
 const hashes=[];for(const t of [0,3.8,8,12,15.8,15.8,12,8,3.8,0])hashes.push(await page.evaluate(t=>{window.renderFrame(t);return document.querySelector('canvas').toDataURL()},t));
 const deterministic=hashes.slice(0,5).every((v,i)=>v===hashes[9-i]);
 const light=[];for(const t of [10,11.25,11.6,12])light.push(await page.evaluate(t=>{window.renderFrame(t);return {t,...window.LIGHT_STATE()}},t));
 const leftGain=light.at(-1).left[0]-light[0].left[0],rightGain=light.at(-1).right[0]-light[0].right[0];
 const lightingPass=light.every(s=>s.window===s.character)&&rightGain>leftGain+10;
 const report={pageErrors:errors,deterministic,frames:12,lightingPass,leftGain,rightGain,light};fs.writeFileSync('render/exemplo-2d-3d/inspecao.json',JSON.stringify(report,null,2));console.log(report);if(errors.length||!deterministic||!lightingPass)process.exitCode=1;
}finally{if(browser)await browser.close();srv.close();}
