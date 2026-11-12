const fs=require('fs'),path=require('path'),os=require('os'),cp=require('child_process');
const {chromium}=require('playwright-core');
const {pathToFileURL}=require('url');
const root=path.resolve(__dirname,'..');
(async()=>{
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'tico-acabamento-'));
 const posix=p=>p.replace(/\\/g,'/').replace(/^([A-Za-z]):/,(_,d)=>'/'+d.toLowerCase());
 cp.execFileSync(process.platform==='win32'?'C:/Program Files/Git/bin/bash.exe':'bash',[posix(path.join(root,'scripts/preparar-film.sh')),posix(tmp)],{cwd:root,stdio:'pipe'});
 for(const f of ['../../motor/personagem/acabamento.js','../../motor/personagem/chars.js','../../motor/personagem/motor.js'])cp.execFileSync(process.execPath,['--check',path.join(root,f)]);
 fs.writeFileSync(path.join(tmp,'ep.js'),`const EPISODIO={duracao:10,falas:[],visual:{ambiente:'claro'},planos:[{ini:0,fim:10,cena:'vazio',cam:[[0,540,960,1]],fundo:t=>SerieVisual.rua(t),atores:[{id:'leticia',x:540,y:1590,s:1.4,poses:[[0,{expr:'feliz',armR:[18,150],propR:{tipo:'phone',live:{audiencia:37}}}]]}]}]};`);
 fs.writeFileSync(path.join(tmp,'film.html'),'<meta charset="utf-8"><script src="chars.js"></script><script src="cenarios.js"></script><script src="ep.js"></script><canvas id="c"></canvas><script src="motor.js"></script>');
 const browser=await chromium.launch({executablePath:process.platform==='win32'?'C:/Program Files/Google/Chrome/Application/chrome.exe':process.env.CHROME_PATH,headless:true});
 try{
  const page=await browser.newPage({viewport:{width:540,height:960}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(pathToFileURL(path.join(tmp,'film.html')).href);await page.waitForFunction(()=>window.READY);
  await page.evaluate(()=>renderFrame(1));const first=await page.locator('canvas').screenshot({path:path.join(tmp,'claro.png')});await page.evaluate(()=>renderFrame(2));await page.evaluate(()=>renderFrame(1));const repeat=await page.locator('canvas').screenshot();if(!first.equals(repeat))throw Error('Render não determinístico');
  await page.evaluate(()=>{EPISODIO.visual={ambiente:'noite'};EPISODIO.planos[0].fundo=t=>SerieVisual.rua(t,{ambiente:'noite'});return renderFrame(1)});const night=await page.locator('canvas').screenshot({path:path.join(tmp,'noite.png')});if(first.equals(night))throw Error('Dia/noite idênticos');
  const semantic=await page.evaluate(()=>({live:propSVG({tipo:'phone',live:{audiencia:37}}).includes('AO VIVO · 37'),normal:!propSVG('phone').includes('AO VIVO'),title:SerieVisual.abertura({linha1:'TESTE NOVO'}).includes('TESTE NOVO'),noOldTitle:!SerieVisual.abertura().includes('DESODORANTE'),escape:SerieVisual.abertura({linha1:'<script>'}).includes('&lt;script&gt;')}));
  if(Object.values(semantic).some(v=>!v))throw Error(JSON.stringify(semantic));
  for(const mode of ['abertura','gps']){await page.evaluate(mode=>{EPISODIO.planos[0].atores=[];EPISODIO.planos[0].fundo=()=>mode==='gps'?SerieVisual.gps({hora:'07:20',prazo:'40 min'}):SerieVisual.abertura({linha1:'PRÓXIMO EPISÓDIO'});return renderFrame(1)},mode);await page.locator('canvas').screenshot({path:path.join(tmp,mode+'.png')});}
  const animation=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=1080;c.height=1920;const g=c.getContext('2d');SerieVisual.seta(g,52,390,0);const a=c.toDataURL();g.clearRect(0,0,1080,1920);SerieVisual.seta(g,52,390,.45);return a!==c.toDataURL()});if(!animation)throw Error('Seta estática');
  // Compatibilidade: motor continua funcionando sem opt-in visual.
  await page.evaluate(()=>{delete EPISODIO.visual;EPISODIO.planos[0].atores=[{id:'tico',x:540,poses:[[0,{}]]}];return renderFrame(1)});
  if(errors.length)throw Error(errors.join('\n'));
  console.log(JSON.stringify({ok:true,determinismo:true,diaNoite:true,celular:semantic,setasAnimadas:animation,errors,quadros:tmp}));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
