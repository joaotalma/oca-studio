// Grava as falas do Dia 3 do spin-off (demitido-gta6/dia03/falas.js) com troca de tom dentro da fala.
// Lê o campo `tts` (com marcas [entre colchetes]) e grava `audio/demitido-gta6-dia03/NN_voz.mp3`, mais
// `alinhamento/NN.json` com o tempo de cada palavra, IGNORANDO o que está entre colchetes (a legenda usa `texto`).
// Cópia de gerar-falas-dia02.mjs (origem). Kauã -> `kaua2`; Dona Rose -> `rose`; Jão (áudio) -> `jao` (voz do Se Vira, Tico). Autorizado pelo João em 15/11/2026.
// Sem --confirmar só mostra a estimativa de caracteres. Custo: um crédito por caractere (as marcas contam).
// Uso (de series/se-vira-tico/): node --env-file=.env.local scripts/gerar-falas-dia03.mjs [--refazer 1,7] [--confirmar]
// Ambiente: VELOCIDADE (padrão 1.15, faixa 0.7 a 1.2), ESTABILIDADE (padrão 0.3), MODELO (padrão eleven_v4).
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const RAIZ = path.resolve(import.meta.dirname, '..');
const SAIDA = path.join(RAIZ, 'audio', 'demitido-gta6-dia03');
const args = process.argv.slice(2);
const confirmar = args.includes('--confirmar');
const refazer = args.includes('--refazer') ? new Set(args[args.indexOf('--refazer') + 1].split(',').map(Number)) : null;
const vozes = JSON.parse(fs.readFileSync(path.join(RAIZ, 'scripts', 'vozes-elevenlabs.json'), 'utf8'));
const falas = vm.runInNewContext(fs.readFileSync(path.join(RAIZ, 'demitido-gta6', 'dia03', 'falas.js'), 'utf8') + ';FALAS');
const chaveVoz = (quem) => (quem.startsWith('Dona Rose') ? 'rose' : quem.startsWith('Jão') ? 'jao' : 'kaua2');
const nomeArq = (f) => `${String(f.n).padStart(2, '0')}_${chaveVoz(f.quem)}`;

fs.mkdirSync(path.join(SAIDA, 'alinhamento'), { recursive: true });
const pendentes = falas.filter((f) => (refazer ? refazer.has(f.n) : !fs.existsSync(path.join(SAIDA, `${nomeArq(f)}.mp3`))));
const total = pendentes.reduce((s, f) => s + f.tts.length, 0);
console.log(`${pendentes.length} falas, ${total} caracteres (com as marcas).`);
if (!confirmar) { console.log('Estimativa apenas. Rode com --confirmar para gravar.'); process.exit(0); }

// Palavras com tempo, sem os trechos entre colchetes.
function palavras(al) {
  const out = []; let atual = null; let dentro = false;
  al.characters.forEach((c, i) => {
    if (c === '[') { dentro = true; atual = null; return; }
    if (c === ']') { dentro = false; return; }
    if (dentro) return;
    if (/\s/.test(c)) { atual = null; return; }
    if (!atual) { atual = { palavra: '', ini: al.characterStartTimesSeconds[i], fim: 0 }; out.push(atual); }
    atual.palavra += c; atual.fim = al.characterEndTimesSeconds[i];
  });
  return out;
}

const client = new ElevenLabsClient();
const MODELO = process.env.MODELO || 'eleven_v4';
const velocidade = Number(process.env.VELOCIDADE || 1.15);
for (const f of pendentes) {
  const voz = vozes[chaveVoz(f.quem)];
  const r = await client.textToSpeech.convertWithTimestamps(voz.voiceId, {
    text: f.tts, modelId: MODELO, languageCode: 'pt', outputFormat: 'mp3_44100_128',
    voiceSettings: { stability: Number(process.env.ESTABILIDADE || 0.3), similarityBoost: 0.8, speed: velocidade },
  });
  fs.writeFileSync(path.join(SAIDA, `${nomeArq(f)}.mp3`), Buffer.from(r.audioBase64, 'base64'));
  fs.writeFileSync(path.join(SAIDA, 'alinhamento', `${f.n}.json`), JSON.stringify({ n: f.n, texto: f.texto, palavras: palavras(r.alignment) }, null, 1));
  console.log(`${nomeArq(f)}.mp3  ${r.alignment.characterEndTimesSeconds.at(-1).toFixed(1)} s  ${f.texto}`);
}
