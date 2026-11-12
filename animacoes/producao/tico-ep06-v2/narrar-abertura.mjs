import fs from 'node:fs';
if(fs.existsSync('.env.local'))process.loadEnvFile('.env.local');
const key=process.env.ELEVENLABS_API_KEY;if(!key)throw Error('Chave não configurada');
const cfg=JSON.parse(fs.readFileSync('canal/voz-elevenlabs.json','utf8'));
const text='Ele vai se declarar… mas ela vai embora.';
const dir='C:/Users/joaot/Projetos/se-vira-tico/audio/ep06-v2/abertura-narrada';fs.mkdirSync(dir,{recursive:true});
if(fs.existsSync(dir+'/alinhamento.json')){console.log('Abertura já gerada, preservada.');process.exit(0);}
if(545+text.length>1000)throw Error('Teto de créditos excedido');
const r=await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${cfg.voiceId}/with-timestamps?output_format=mp3_44100_128`,{method:'POST',headers:{'xi-api-key':key,'Content-Type':'application/json'},body:JSON.stringify({text,model_id:'eleven_multilingual_v2',voice_settings:{stability:.6,similarity_boost:.8,speed:1.06}})});
if(!r.ok)throw Error('ElevenLabs HTTP '+r.status);
const d=await r.json();fs.writeFileSync(dir+'/narracao.mp3',Buffer.from(d.audio_base64,'base64'));fs.writeFileSync(dir+'/alinhamento.json',JSON.stringify({texto:text,voiceId:cfg.voiceId,modelo:'eleven_multilingual_v2',alignment:d.alignment},null,2));
console.log(`Abertura gerada: ${text.length} caracteres; ${545+text.length}/1.000 acumulados. Voz original jovem, não clone.`);
