import fs from 'node:fs';
if(fs.existsSync('.env.local'))process.loadEnvFile('.env.local');
const key=process.env.ELEVENLABS_API_KEY;if(!key)throw Error('Sem chave');
const models=await fetch('https://api.elevenlabs.io/v1/models',{headers:{'xi-api-key':key}});if(!models.ok)throw Error('Models '+models.status);const data=await models.json();console.log(JSON.stringify(data.filter(x=>/eleven_v3|multilingual_v2/.test(x.model_id)).map(x=>({id:x.model_id,style:x.can_use_style,description:x.description?.slice(0,170)}))));
const cfg=JSON.parse(fs.readFileSync('canal/voz-elevenlabs.json','utf8'));
const dir='C:/Users/joaot/Projetos/se-vira-tico/audio/ep06-v2/abertura-enfatica';fs.mkdirSync(dir,{recursive:true});
const text='ELE… vai se declarar. MAS ELA… vai embora.';
const model=data.some(x=>x.model_id==='eleven_v3')?'eleven_v3':'eleven_multilingual_v2';
const input=model==='eleven_v3'?'[excited] ELE… vai se declarar. [serious] MAS ELA… vai embora.':text;
if(585+input.length>1000)throw Error('Teto excedido');
if(fs.existsSync(dir+'/alinhamento.json')){console.log('Geração existente preservada');process.exit(0);}
const r=await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${cfg.voiceId}/with-timestamps?output_format=mp3_44100_128`,{method:'POST',headers:{'xi-api-key':key,'Content-Type':'application/json'},body:JSON.stringify({text:input,model_id:model,language_code:'pt',voice_settings:model==='eleven_v3'?{stability:.5,similarity_boost:.8}:{stability:.3,similarity_boost:.8,style:.65,use_speaker_boost:true,speed:1.0}})});
if(!r.ok)throw Error('TTS '+r.status+' '+(await r.text()).slice(0,200));
const d=await r.json();fs.writeFileSync(dir+'/narracao.mp3',Buffer.from(d.audio_base64,'base64'));fs.writeFileSync(dir+'/alinhamento.json',JSON.stringify({texto:text,input,voiceId:cfg.voiceId,modelo:model,alignment:d.alignment,normalized_alignment:d.normalized_alignment,acumulado:585+input.length},null,2));console.log('Nova interpretação gerada: '+model+', '+(585+input.length)+'/1.000 caracteres acumulados.');
