// Gera as falas de um episódio no ElevenLabs, com as vozes fixas de scripts/vozes-elevenlabs.json.
// Lê a tabela de episodios/epNN/falas.md (| `NN_personagem.mp3` | Quem | Fala |) e grava
// <saida>/NN_personagem.mp3 e <saida>/alinhamento/NN.json (início e fim de cada palavra, em segundos).
//
// Uso: node --env-file=.env.local scripts/gerar-vozes-elevenlabs.mjs episodios/ep03 audio/ep03 [--refazer 3,7 | --refazer todas]
// ESTABILIDADE=0.8 no ambiente deixa a entonação mais contida (padrão 0,5). Modelo eleven_v4 em português. Custo: um caractere por caractere de fala; o total sai no fim.
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import fs from 'node:fs';
import path from 'node:path';

const [pasta, saida, ...opcoes] = process.argv.slice(2);
if (!pasta || !saida) { console.error('uso: gerar-vozes-elevenlabs.mjs <episódio> <saída> [--refazer n,n|todas]'); process.exit(1); }
const refazer = opcoes.includes('--refazer') ? new Set(opcoes[opcoes.indexOf('--refazer') + 1].split(',')) : new Set();
const vozes = JSON.parse(fs.readFileSync(path.join('scripts', 'vozes-elevenlabs.json'), 'utf8'));
const md = fs.readFileSync(path.join(pasta, 'falas.md'), 'utf8');
const falas = [...md.matchAll(/^\| `((\d+)_(\w+))\.mp3` \| [^|]+ \| ([^|]+?) \|/gm)].map((m) => ({ base: m[1], n: m[2], voz: m[3], texto: m[4].trim() }));

// Junta os caracteres alinhados em palavras
function palavras(al) {
  const out = []; let atual = null;
  al.characters.forEach((c, i) => {
    if (/\s/.test(c)) { atual = null; return; }
    if (!atual) { atual = { palavra: '', ini: al.characterStartTimesSeconds[i], fim: 0 }; out.push(atual); }
    atual.palavra += c; atual.fim = al.characterEndTimesSeconds[i];
  });
  return out;
}

const client = new ElevenLabsClient();
fs.mkdirSync(path.join(saida, 'alinhamento'), { recursive: true });
let caracteres = 0;
for (const f of falas) {
  const mp3 = path.join(saida, `${f.base}.mp3`);
  if (fs.existsSync(mp3) && !refazer.has('todas') && !refazer.has(String(Number(f.n)))) continue;
  if (!vozes[f.voz]) { console.error('sem voz no registro:', f.voz); process.exit(1); }
  const r = await client.textToSpeech.convertWithTimestamps(vozes[f.voz].voiceId, {
    text: f.texto, modelId: 'eleven_v4', languageCode: 'pt', outputFormat: 'mp3_44100_128',
    voiceSettings: { stability: Number(process.env.ESTABILIDADE || .5), similarityBoost: .8 },
  });
  fs.writeFileSync(mp3, Buffer.from(r.audioBase64, 'base64'));
  fs.writeFileSync(path.join(saida, 'alinhamento', `${f.n}.json`), JSON.stringify({ n: Number(f.n), texto: f.texto, palavras: palavras(r.alignment) }, null, 1));
  caracteres += f.texto.length;
  console.log(`${f.base}.mp3  ${f.texto}`);
}
console.log(`fim: ${caracteres} caracteres`);
