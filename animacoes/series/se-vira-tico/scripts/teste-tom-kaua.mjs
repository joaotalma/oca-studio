// Voz nova do Kauã no Dia 2 (escolha do João em 14/11/2026: prévia kaua3t_2). Salva como `kaua2` no registro
// (não mexe na `kaua` do Dia 1) e grava falas de teste com troca de tom (campo `tts` de demitido-gta6/dia02/falas.js)
// em audio/elevenlabs/teste-tom/. Velocidade ajustável: VELOCIDADE=1.15 (padrão do ElevenLabs: 1.0, faixa 0.7 a 1.2).
// Uso (de series/se-vira-tico/): node --env-file=.env.local scripts/teste-tom-kaua.mjs 1,16
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const RAIZ = path.resolve(import.meta.dirname, '..');
const REGISTRO = path.join(RAIZ, 'scripts', 'vozes-elevenlabs.json');
const SAIDA = path.join(RAIZ, 'audio', 'elevenlabs', 'teste-tom');
const MODELO = process.env.MODELO || 'eleven_v4';
const client = new ElevenLabsClient();
const falas = vm.runInNewContext(fs.readFileSync(path.join(RAIZ, 'demitido-gta6', 'dia02', 'falas.js'), 'utf8') + ';FALAS');
const registro = JSON.parse(fs.readFileSync(REGISTRO, 'utf8'));

if (!registro.kaua2) {
  const { ids } = JSON.parse(fs.readFileSync(path.join(RAIZ, 'audio', 'elevenlabs', 'previas', 'kaua3t.json'), 'utf8'));
  const voz = await client.textToVoice.create({ voiceName: 'Se Vira, Tico: kaua2', voiceDescription: 'Brazilian Portuguese young man around 19, extremely energetic and animated, hyper, comedic and mischievous like a streamer reacting to something wild, fast talker, never monotone.', generatedVoiceId: ids[2] });
  registro.kaua2 = { voiceId: voz.voiceId, previa: 'kaua3t_2', referencia: null, nota: 'Voz do Kauã a partir do Dia 2 (escolha do João em 14/11/2026). A `kaua` segue no Dia 1.' };
  fs.writeFileSync(REGISTRO, JSON.stringify(registro, null, 1) + '\n');
  console.log('kaua2 ->', voz.voiceId);
}
fs.mkdirSync(SAIDA, { recursive: true });
const vel = Number(process.env.VELOCIDADE || 1.15);
for (const n of (process.argv[2] || '1').split(',').map(Number)) {
  const f = falas.find((x) => x.n === n);
  const r = await client.textToSpeech.convertWithTimestamps(registro.kaua2.voiceId, {
    text: f.tts, modelId: MODELO, languageCode: 'pt', outputFormat: 'mp3_44100_128',
    voiceSettings: { stability: Number(process.env.ESTABILIDADE || 0.3), similarityBoost: 0.8, speed: vel },
  });
  const arq = path.join(SAIDA, `${String(n).padStart(2, '0')}_kaua2_v${vel}.mp3`);
  fs.writeFileSync(arq, Buffer.from(r.audioBase64, 'base64'));
  const a = r.alignment; let dentro = false, dur = 0;
  a.characters.forEach((c, i) => { if (c === '[') dentro = true; if (dentro) dur += a.characterEndTimesSeconds[i] - a.characterStartTimesSeconds[i]; if (c === ']') dentro = false; });
  console.log(`${path.basename(arq)}  ${a.characterEndTimesSeconds.at(-1).toFixed(1)} s (estimado no roteiro: ${(f.fim - f.ini).toFixed(1)} s)  tempo em colchetes: ${dur.toFixed(2)} s`);
}
