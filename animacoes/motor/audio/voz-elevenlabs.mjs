import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { conferirCreditos } from './creditos-elevenlabs.mjs';
if(fs.existsSync('.env.local'))process.loadEnvFile('.env.local');
const key=process.env.ELEVENLABS_API_KEY;if(!key)throw Error('Defina ELEVENLABS_API_KEY no ambiente');
const config='series/misterios-do-brasil/canal/voz-elevenlabs.json',acao=process.argv[2];
async function request(route,data){const r=await fetch('https://api.elevenlabs.io/v1/'+route,{method:data?'POST':'GET',headers:{'xi-api-key':key,...(data?{'Content-Type':'application/json'}:{})},...(data?{body:JSON.stringify(data)}:{})});if(!r.ok)throw Error(`ElevenLabs HTTP ${r.status}: ${(await r.text()).slice(0,600)}`);return r.json();}
if(acao==='criar') {
 if(fs.existsSync(config)){console.log('Voz existente preservada.');process.exit(0);}
 const dir='audio/elevenlabs/previas';fs.mkdirSync(dir,{recursive:true});
 const file=dir+'/design.json';
 const description='Original Brazilian Portuguese male narrator, age 25 to 30. Youthful, engaging, warm mid-pitched voice, clear Brazilian diction. Enthusiastic storytelling with genuine curiosity and cinematic tension, natural conversational energy, never shouting or sounding like a sales pitch. Measured pauses, about 150 words per minute. Dry studio audio, no music. Not an imitation of any real person.';
 let design;
 if(fs.existsSync(file))design=JSON.parse(fs.readFileSync(file,'utf8'));
 else {design=await request('text-to-voice/design?output_format=mp3_44100_128',{voice_description:description,model_id:'eleven_ttv_v3',text:'Imagine uma escolha que parecia simples. De um lado, o banho quente. Do outro, a comida da semana. No começo, você pensaria em economizar. Mas cada tomada contaria uma história diferente. E a solução que parecia perfeita esconderia outro problema.',seed:7});fs.writeFileSync(file,JSON.stringify(design));}
 design.previews.forEach((p,i)=>fs.writeFileSync(`${dir}/narrador-${i}.mp3`,Buffer.from(p.audio_base_64,'base64')));
 const voice=await request('text-to-voice',{voice_name:'Plotline — narrador jovem',voice_description:description,generated_voice_id:design.previews[0].generated_voice_id});
 fs.writeFileSync(config,JSON.stringify({voiceId:voice.voice_id,nome:voice.name,modelo:'eleven_v4',estabilidade:.6,similaridade:.8,autorizacao:'João autorizou criar voz original jovem e empolgante nesta conversa, 2026-11-08.',licenca:{plano:'starter ativo, conferido via API em 2026-11-08',fonte:'https://elevenlabs.io/pricing',situacao:'licença comercial incluída no plano pago'},origem:'Adaptação independente do fluxo ElevenLabs do Se Vira, Tico; sem voz ou áudio do elenco.'},null,2));
 console.log('Voz original criada e registrada. Prévias locais preservadas.');
} else if(acao==='narrar') {
 const pasta=process.argv[3],e=JSON.parse(fs.readFileSync(config,'utf8'));
 const falas=vm.runInNewContext(fs.readFileSync(path.join(pasta,'falas.js'),'utf8')+';FALAS');
 const slug=vm.runInNewContext(fs.readFileSync(path.join(pasta,'video.js'),'utf8')+';VIDEO').slug||path.basename(pasta);
 const dir=path.join('audio',slug);fs.mkdirSync(dir,{recursive:true});
 const file=path.join(dir,'alinhamento-completo.json'),texto=falas.map(f=>f.texto).join('\n');
 if(texto.length>2200)throw Error('Este pedido ultrapassa o limite local de 2200 caracteres por narração.');
 if(fs.existsSync(file)){const old=JSON.parse(fs.readFileSync(file,'utf8'));if(old.texto!==texto)throw Error('Texto mudou: preserve a geração anterior antes de refazer.');console.log('Narração já existente preservada.');process.exit(0);}
 if(await conferirCreditos(texto.length)) {
 const r=await request(`text-to-speech/${e.voiceId}/with-timestamps?output_format=mp3_44100_128`,{text:texto,model_id:e.modelo,language_code:'pt',voice_settings:{stability:e.estabilidade,similarity_boost:e.similaridade,speed:.96}});
 fs.writeFileSync(path.join(dir,'narracao.mp3'),Buffer.from(r.audio_base64,'base64'));
 fs.writeFileSync(file,JSON.stringify({texto,alignment:r.alignment,normalized_alignment:r.normalized_alignment},null,2));
 console.log(`Narração salva: ${texto.length} caracteres; alinhamento preservado.`);
 }
} else throw Error('uso: node motor/audio/voz-elevenlabs.mjs criar | narrar series/misterios-do-brasil/roteiros/<slug> [--confirmar]');
