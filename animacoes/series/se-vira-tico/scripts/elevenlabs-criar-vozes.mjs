// Cria as vozes fixas dos personagens no ElevenLabs (Voice Design, modelo eleven_ttv_v3).
// Cada voz é desenhada por uma descrição e guiada pelo clipe de referência de audio/vozes/, para ficar
// parecida com a voz que já foi ao ar. Grava as prévias em audio/elevenlabs/previas/.
//
// Uso:
//   node --env-file=.env.local scripts/elevenlabs-criar-vozes.mjs previas [tico,lua,...]
//   node --env-file=.env.local scripts/elevenlabs-criar-vozes.mjs salvar tico=2 lua=0 ...
// "salvar" transforma a prévia escolhida em voz da conta e grava o voice_id em scripts/vozes-elevenlabs.json.
// A chave fica em .env.local (ELEVENLABS_API_KEY); o SDK a lê do ambiente.
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import fs from 'node:fs';
import path from 'node:path';

const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const PREVIAS = path.join(RAIZ, 'audio', 'elevenlabs', 'previas');
const REGISTRO = path.join(RAIZ, 'scripts', 'vozes-elevenlabs.json');

export const PERSONAGENS = {
  tico: { ref: 'tico', desc: 'Brazilian Portuguese man in his early 30s, warm mid-pitched voice, slightly tired and ironic, casual urban Brazilian accent, speaks a bit fast when nervous.',
    texto: 'Olha, eu vou te falar uma coisa: hoje é o meu primeiro dia, a moto é emprestada, mas já já eu resolvo tudo isso, pode confiar.' },
  lua: { ref: 'lua', desc: 'Brazilian Portuguese woman around 30, soft mid-pitched voice, kind and perceptive, calm and clear delivery with a hint of tiredness.',
    texto: 'Hoje eu saí mais cedo do trabalho, e está tudo ótimo comigo, de verdade. Você não mudou nada, sabia? Continua o mesmo de sempre.' },
  jao: { ref: 'jao', desc: 'Brazilian Portuguese man around 40, very deep and slightly raspy voice, tough motorcycle courier, blunt but warm, relaxed street accent.',
    texto: 'Pode pegar a moto, meu irmão. Eu confio em você, mas qualquer prejuízo fica na tua conta, combinado? E devolve com gasolina.' },
  leticia: { ref: 'leticia', desc: 'Brazilian Portuguese woman in her early 30s, bright high-energy voice, confident life-coach tone, smiling and persuasive influencer cadence.',
    texto: 'Gente, presta atenção: eu acordo às quatro da manhã para agradecer, e hoje a minha vida mudou completamente. Gratidão, gente!' },
  ceo: { ref: 'borracheiro', desc: 'Brazilian Portuguese man around 60, low grainy voice, jovial and self-satisfied company owner, slow paternal delivery.',
    texto: 'Parabéns a todos pelo trimestre! Esse menino aqui vai longe, eu sempre disse: talento vem de berço, e esta empresa é uma família.' },
  vendedor: { ref: 'vendedor', desc: 'Brazilian Portuguese man in his late 40s, low hoarse street-vendor voice, hopeful and chatty, believes in himself, warm working-class accent.',
    texto: 'Olha a paçoca, freguês, tá fresquinha! Eu vendo nessa rua faz muito tempo, e hoje o dia ainda vai melhorar, pode escrever o que eu tô dizendo.' },
  cida: { ref: 'lua', desc: 'Brazilian Portuguese grandmother around 75, thin slightly shaky elderly voice, sweet and nonstop chatty, proud grandma who talks fast about her granddaughter, warm suburban accent.',
    texto: 'Ai, meu filho, deixa eu te contar: a minha netinha faz aniversário hoje, e eu comprei balão, chapeuzinho, docinho, tudo que ela gosta, viu?' },
  neta: { ref: 'leticia', desc: 'Brazilian Portuguese woman around 40, mid-low tired voice, patient and embarrassed, dry humor, speaks slowly like someone who has had this conversation many times.',
    texto: 'Mãe, vó, gente, eu tenho quarenta anos, eu pago aluguel, eu tenho emprego. Não precisa de chapeuzinho, de verdade, eu tô bem.' },
  junior: { ref: 'vendedor', desc: 'Brazilian Portuguese young man around 25, light polished voice, polite and a bit naive, rich-kid office tone.',
    texto: 'Oi, gente, prazer! Eu sou o Júnior, o novo gerente. Alguém me manda o arquivo da apresentação? Eu não achei a pasta compartilhada.' },
  // Spin-off "Demitido Antes do GTA": voz original criada só por descrição (sem clipe de referência), autorizada pelo João em 12/11/2026.
  kaua: { ref: null, desc: 'Brazilian Portuguese young man around 21, youthful mid-pitched voice, ironic and tired gamer who stayed up until 3am, fast casual urban Brazilian slang, self-deprecating humor, friendly and expressive.',
    texto: 'Faltam seis dias pro GTA 6 e eu tenho três reais e vinte. Fui demitido por e-mail, e o e-mail tinha emoji. Mas tá tudo bem, eu tô ótimo, sério.' },
};

const client = new ElevenLabsClient();

async function previas(lista) {
  fs.mkdirSync(PREVIAS, { recursive: true });
  for (const nome of lista) {
    const p = PERSONAGENS[nome];
    const ref = p.ref ? fs.readFileSync(path.join(RAIZ, 'audio', 'vozes', `${p.ref}.wav`)).toString('base64') : null;
    const r = await client.textToVoice.design({ voiceDescription: p.desc, modelId: 'eleven_ttv_v3', text: p.texto, ...(ref ? { referenceAudioBase64: ref, promptStrength: .25 } : {}), outputFormat: 'mp3_44100_128', seed: 7 });
    const ids = {};
    r.previews.forEach((pv, i) => {
      fs.writeFileSync(path.join(PREVIAS, `${nome}_${i}.mp3`), Buffer.from(pv.audioBase64, 'base64'));
      ids[i] = pv.generatedVoiceId;
    });
    fs.writeFileSync(path.join(PREVIAS, `${nome}.json`), JSON.stringify({ ids, texto: r.text }, null, 1));
    console.log(nome, Object.keys(ids).length, 'prévias');
  }
}

async function salvar(escolhas) {
  const registro = fs.existsSync(REGISTRO) ? JSON.parse(fs.readFileSync(REGISTRO, 'utf8')) : {};
  for (const e of escolhas) {
    const [nome, i] = e.split('=');
    const { ids } = JSON.parse(fs.readFileSync(path.join(PREVIAS, `${nome}.json`), 'utf8'));
    const voz = await client.textToVoice.create({ voiceName: `Se Vira, Tico: ${nome}`, voiceDescription: PERSONAGENS[nome].desc, generatedVoiceId: ids[i] });
    registro[nome] = { voiceId: voz.voiceId, previa: Number(i), referencia: PERSONAGENS[nome].ref };
    console.log(nome, '->', voz.voiceId);
  }
  fs.writeFileSync(REGISTRO, JSON.stringify(registro, null, 1) + '\n');
}

const [acao, ...resto] = process.argv.slice(2);
if (acao === 'previas') await previas(resto.length ? resto[0].split(',') : Object.keys(PERSONAGENS));
else if (acao === 'salvar') await salvar(resto);
else { console.error('uso: previas [nomes] | salvar nome=i ...'); process.exit(1); }
