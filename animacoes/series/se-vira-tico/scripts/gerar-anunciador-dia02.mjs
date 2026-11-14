// Locutor da luta do Dia 2 (pedido do João, 14/11/2026): voz grossa americana, estilo jogo de luta ("Round one! Fight! K.O.!").
// Usa a voz padrão (premade) Brian do ElevenLabs, que já existe na conta e NÃO ocupa vaga de voz personalizada.
// Grava em audio/demitido-gta6-dia02/anunciador/. Custo: um crédito por caractere (cerca de 50 no total).
// Uso (de series/se-vira-tico/): node --env-file=.env.local scripts/gerar-anunciador-dia02.mjs [--refazer]
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import fs from 'node:fs';
import path from 'node:path';

const SAIDA = path.resolve(import.meta.dirname, '..', 'audio', 'demitido-gta6-dia02', 'anunciador');
const VOZ = { nome: 'Brian', voiceId: 'nPczCjzI2devNBz1zQrb' };   // "Brian - Deep, Resonant and Comforting", americano
const FALAS = [
  ['round', '[announcer] [deep voice] Round one!'],
  ['fight', '[announcer] [shouting] Fight!'],
  ['ko', '[announcer] [shouting] K.O.!'],
];
const refazer = process.argv.includes('--refazer');
fs.mkdirSync(SAIDA, { recursive: true });
const client = new ElevenLabsClient();
for (const [nome, texto] of FALAS) {
  const arq = path.join(SAIDA, `${nome}.mp3`);
  if (fs.existsSync(arq) && !refazer) { console.log(nome, 'já existe'); continue; }
  const r = await client.textToSpeech.convertWithTimestamps(VOZ.voiceId, {
    text: texto, modelId: process.env.MODELO || 'eleven_v4', languageCode: 'en', outputFormat: 'mp3_44100_128',
    voiceSettings: { stability: 0.3, similarityBoost: 0.8, style: 0.55, speed: 0.95 },
  });
  fs.writeFileSync(arq, Buffer.from(r.audioBase64, 'base64'));
  const a = r.alignment; let dentro = false, dur = 0;
  a.characters.forEach((c, i) => { if (c === '[') dentro = true; if (dentro) dur += a.characterEndTimesSeconds[i] - a.characterStartTimesSeconds[i]; if (c === ']') dentro = false; });
  console.log(`${nome}.mp3  ${a.characterEndTimesSeconds.at(-1).toFixed(2)} s  (tempo em colchetes: ${dur.toFixed(2)} s)  ${texto}`);
}
