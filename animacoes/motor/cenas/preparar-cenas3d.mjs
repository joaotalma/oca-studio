import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const TYPES = new Set(['rua','colonial','terreno','campo','floresta','estrada','mar','sala','interior','oficina','estudio','arte']);
// Snapshot textual dos fundos próprios anteriores às marcas de ambiente.
// Serve apenas para migração; cenas novas usam suas marcas explícitas.
const LEGADOS=JSON.parse(fs.readFileSync(new URL('./fundos3d-legados.json',import.meta.url),'utf8'));
export function lerConst(file,name) {
  const source=fs.readFileSync(file,'utf8');
  return vm.runInNewContext(`${source}\n;${name}`,Object.create(null),{timeout:1000,filename:file});
}
export function detectarAmbiente(svg) {
  const explicit=svg.match(/<!--ambiente3d:([\s\S]*?)-->/);
  if(explicit)return {dados:JSON.parse(explicit[1]),origem:'explicita'};
  const tag=svg.match(/<!--ambiente:([a-z]+)-->/)?.[1];
  if(tag)return {familia:tag,origem:'marcada'};
  // Compatibility with approved SVGs authored before the environment marker.
  // Only structural background signatures are used; never infer from a fact,
  // a person's name or a narration keyword.
  const body=svg.slice(svg.indexOf('</defs>')+7).split('<!--F-->')[0];
  for(const [familia,base] of Object.entries(LEGADOS))if(body.startsWith(base))return {familia,origem:'fundo-legado'};
  if(body.includes('M260 300 V730'))return {familia:'sala',origem:'estrutura'};
  if(body.includes('width="166" height="430"'))return {familia:'terreno',origem:'estrutura'};
  if(body.includes('M380 0 H700 L1030 1320 H50 Z'))return {familia:'palco',origem:'estrutura'};
  if(body.includes('fill="#050f13"'))return {familia:'escuro',origem:'estrutura'};
  if(body.includes('id="sol"'))return {familia:'retrato',origem:'estrutura'};
  if(body.includes('width="130" height="24"'))return {familia:'oficina',origem:'estrutura'};
  if(body.includes('y="1270" width="1080" height="20"'))return {familia:'interior',origem:'estrutura'};
  if(body.includes('rx="130" ry="46"'))return {familia:'ceu',origem:'estrutura'};
  if(body.includes('M470 1100 H610 L1080 1920 H0 Z'))return {familia:'estrada',origem:'estrutura'};
  if(body.includes('width="170" height="620"')&&body.includes('url(#noite)'))return {familia:'noite',origem:'estrutura'};
  return {familia:'arte',origem:'arte-preservada'};
}
export function daFamilia(family,paleta) {
  const types={noite:'rua',colonial:'colonial',terreno:'terreno',ceu:'campo',floresta:'floresta',mar:'mar',estrada:'estrada',sala:'sala',interior:'interior',oficina:'oficina',palco:'estudio',escuro:'estudio',retrato:'estudio',prateleira:'interior',arte:'arte'};
  return {tipo:types[family]||'arte',periodo:family==='noite'||family==='terreno'?'noite':paleta==='dia'?'dia':'noite'};
}
export function validarCena(c,label) {
  const error=message=>{throw new Error(`${label}: ${message}`);};
  if(!TYPES.has(c.tipo))error(`tipo 3D desconhecido: ${c.tipo}`);
  if(!['dia','noite'].includes(c.periodo))error('periodo deve ser dia ou noite');
  if(c.preenchimento!==undefined&&(!Number.isFinite(c.preenchimento)||c.preenchimento<0||c.preenchimento>.65))error('preenchimento deve estar entre 0 e 0.65');
  for(const key of ['estrelas','nuvens'])if(c[key]!==undefined&&(!Number.isInteger(c[key])||c[key]<0||c[key]>500))error(`${key} deve ser um inteiro entre 0 e 500`);
  if(c.luzes!==undefined&&!Array.isArray(c.luzes))error('luzes deve ser uma lista');
  if(c.camera)for(const key of ['de','para','alvo'])if(c.camera[key]!==undefined&&(!Array.isArray(c.camera[key])||c.camera[key].length!==3||!c.camera[key].every(Number.isFinite)))error(`camera.${key} precisa de três números`);
  if(c.personagem?.posicao&&(!Array.isArray(c.personagem.posicao)||c.personagem.posicao.length!==3||!c.personagem.posicao.every(Number.isFinite)))error('posição do personagem inválida');
  if(c.personagem?.altura!==undefined&&(!Number.isFinite(c.personagem.altura)||c.personagem.altura<=0))error('altura do personagem inválida');
  for(const p of c.objetos||[])if(p.tipo==='caixa')for(const key of ['posicao','tamanho'])if(!Array.isArray(p[key])||p[key].length!==3||!p[key].every(Number.isFinite))error(`objeto com ${key} inválido`);
  for(const light of c.luzes||[]) {
    if(!['sol','janela','poste','pontual'].includes(light.tipo))error('tipo de luz desconhecido');
    if(!Array.isArray(light.posicao)||light.posicao.length!==3||!light.posicao.every(Number.isFinite))error('posição da luz precisa de três números');
    if(!/^#[a-f\d]{6}$/i.test(light.cor||'#ffdaa0'))error('cor da luz inválida');
    if(light.intensidade!==undefined&&(!Number.isFinite(light.intensidade)||light.intensidade<0))error('intensidade de luz inválida');
    const a=light.animacao;
    if(a&&(!Number.isFinite(a.inicio)||!Number.isFinite(a.duracao)||a.inicio<0||a.duracao<0))error('acendimento precisa de início e duração válidos');
    if(a)for(const k of ['de','para'])if(a[k]!==undefined&&(!Number.isFinite(a[k])||a[k]<0))error('potência de animação inválida');
  }
  return c;
}
export function camadasProntas(pasta) {
  const video=lerConst(path.join(pasta,'video.js'),'VIDEO');
  if(video.template!=='ilustrado'||video.ambiente3d===false)return true;
  const camadasFile=path.join(pasta,'assets','camadas.js');if(!fs.existsSync(camadasFile))return false;
  const camadas=lerConst(camadasFile,'CAMADAS'),falas=lerConst(path.join(pasta,'falas.js'),'FALAS');
  return falas.flatMap(f=>f.imagens||[f.imagem]).every(imagem=>{
    const layer=camadas[imagem];if(!layer)return false;
    const assets=[layer.fundo,layer.voce,layer.pisca,layer.albedo,layer.piscaAlbedo,layer.frente].filter(Boolean);
    if(layer.voce&&!layer.albedo||layer.pisca&&!layer.piscaAlbedo)return false;
    if(!assets.every(file=>fs.existsSync(path.join(pasta,file))))return false;
    const svg=path.join(pasta,'cenas',`${path.basename(imagem,'.png')}.svg`);
    return !fs.existsSync(svg)||assets.every(file=>fs.statSync(path.join(pasta,file)).mtimeMs>=fs.statSync(svg).mtimeMs);
  });
}
export function compilar(pasta,{exigirAlbedo=true}={}) {
  const video=lerConst(path.join(pasta,'video.js'),'VIDEO');
  if(video.template!=='ilustrado'||video.ambiente3d===false)return {ativo:false,cenas:{},avisos:[]};
  const falas=lerConst(path.join(pasta,'falas.js'),'FALAS'),file=path.join(pasta,'assets','camadas.js');
  if(!fs.existsSync(file))throw new Error('3D precisa de assets/camadas.js. Separe as camadas das cenas antes da montagem.');
  const camadas=lerConst(file,'CAMADAS'),overrideFile=path.join(pasta,'cenas3d.json');
  const custom=fs.existsSync(overrideFile)?JSON.parse(fs.readFileSync(overrideFile,'utf8')):{};
  const imagens=[...new Set(falas.flatMap(f=>f.imagens||[f.imagem]).filter(Boolean))],cenas={},avisos=[];
  for(const imagem of imagens) {
    const layer=camadas[imagem];
    if(!layer)throw new Error(`${imagem}: faltam camadas para o motor 3D. Gere-as antes da versão final.`);
    for(const asset of [layer.fundo,layer.voce,layer.pisca,layer.albedo,layer.piscaAlbedo,layer.frente].filter(Boolean))if(!fs.existsSync(path.join(pasta,asset)))throw new Error(`Camada não encontrada: ${asset}`);
    if(exigirAlbedo&&(layer.voce&&!layer.albedo||layer.pisca&&!layer.piscaAlbedo))throw new Error(`${imagem}: falta a base neutra do personagem. Rode motor/cenas/desenhar-cenas.mjs antes da preparação 3D.`);
    const name=path.basename(imagem,'.png'),svgFile=path.join(pasta,'cenas',`${name}.svg`);
    const svg=fs.existsSync(svgFile)?fs.readFileSync(svgFile,'utf8'):'';
    const found=detectarAmbiente(svg),global=typeof video.ambiente3d==='object'?video.ambiente3d:{};
    const scene={...daFamilia(found.familia,video.paleta),...found.dados,...global,...custom.padrao,...(custom.cenas?.[imagem]||custom.cenas?.[name]),origem:found.origem};
    validarCena(scene,imagem);cenas[imagem]=scene;
    if(scene.tipo==='arte')avisos.push(`${imagem}: fundo aprovado preservado; defina cenas3d.json para modelar um ambiente específico.`);
  }
  for(const fala of falas)if(fala.cena3d)for(const imagem of fala.imagens||[fala.imagem])validarCena({...cenas[imagem],...fala.cena3d},`${imagem}, fala ${fala.n}`);
  return {ativo:true,cenas,avisos};
}
export function preparar(pasta,destino,{check=false}={}) {
  const result=compilar(pasta);
  if(!check) {
    fs.mkdirSync(destino,{recursive:true});
    fs.writeFileSync(path.join(destino,'cenas3d.js'),`const CENAS3D = ${JSON.stringify(result.cenas,null,2)};\n`);
    fs.copyFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)),'ambiente3d.js'),path.join(destino,'ambiente3d.js'));
  }
  return result;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const [pasta,destino]=process.argv.slice(2).filter(x=>!x.startsWith('--'));
  if(process.argv.includes('--camadas-prontas')) {
    if(!pasta)throw new Error('Informe a pasta do roteiro.');
    process.exitCode=camadasProntas(pasta)?0:1;
  } else {
    if(!pasta||!destino)throw new Error('uso: node motor/cenas/preparar-cenas3d.mjs series/misterios-do-brasil/roteiros/<slug> render/<slug> [--check]');
    const result=preparar(pasta,destino,{check:process.argv.includes('--check')});
    console.log(`3D: ${result.ativo?Object.keys(result.cenas).length+' cenas preparadas':'desativado explicitamente'}`);
    result.avisos.forEach(x=>console.log(`AVISO: ${x}`));
  }
}
