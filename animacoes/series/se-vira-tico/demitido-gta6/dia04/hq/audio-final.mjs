// Mixagem do Dia 4 (cópia adaptada de ../../dia03/hq/audio-final.mjs, 16/11/2026). Só a voz do Kauã (12 gravações); não chama serviço de voz.
// Vozes + efeitos + música de fundo (duck sob a voz), a −16,6 LUFS. Sem risadas (decisão do João, 16/11/2026: ficaram ruins; entram depois, se ele trouxer do Windows). Sem amostras de terceiros.
// Gerar antes: efeitos.py, musica.py e risadas.py -> render/demitido-gta6/dia04-final/*.wav.
import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import{spawnSync}from'node:child_process';import{fileURLToPath}from'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),out=path.resolve(here,'../../../../../render/demitido-gta6/dia04-final');
const audio=path.resolve(here,'../../../audio/demitido-gta6-dia04'),DUR=93.2;
const {FALAS}=vm.runInNewContext(fs.readFileSync(path.join(here,'../falas.js'),'utf8')+';({FALAS})');
const run=(args)=>{const r=spawnSync('ffmpeg',['-y','-hide_banner','-nostats',...args],{encoding:'utf8',maxBuffer:1<<24});if(r.status)throw new Error(r.stderr);return r;};
const items=FALAS.map(f=>[path.join(audio,fs.readdirSync(audio).find(n=>n.startsWith(String(f.n).padStart(2,'0')+'_')&&n.endsWith('.mp3'))),f.ini]);
const vozes=path.join(out,'vozes.wav'),raw=path.join(out,'mixagem.wav'),final=path.join(out,'audio-master.wav');
// 1) barramento de vozes
run(['-v','error',...items.flatMap(([p])=>['-i',p]),'-filter_complex',items.map(([,t],i)=>`[${i}:a]adelay=${Math.round(t*1000)}:all=1[a${i}]`).join(';')+';'+items.map((_,i)=>`[a${i}]`).join('')+`amix=inputs=${items.length}:normalize=0:duration=longest,apad=whole_dur=${DUR}[v]`,'-map','[v]','-t',String(DUR),'-ar','48000','-ac','2',vozes]);
// 2) música com duck sob a voz + efeitos + risadas
const f=`[0:a]asplit=2[vo][vk];[1:a]aformat=sample_rates=48000:channel_layouts=stereo,volume=0.20[mu];[mu][vk]sidechaincompress=threshold=0.015:ratio=9:attack=15:release=350:makeup=1[md];[2:a]aformat=sample_rates=48000:channel_layouts=stereo,volume=0.55[fx];[vo][md][fx]amix=inputs=3:normalize=0:duration=longest,apad=whole_dur=${DUR}[m]`;
run(['-v','error','-i',vozes,'-i',path.join(out,'musica.wav'),'-i',path.join(out,'efeitos.wav'),'-filter_complex',f,'-map','[m]','-t',String(DUR),'-ar','48000','-ac','2',raw]);
const measured=run(['-i',raw,'-af','loudnorm=I=-16.6:TP=-1.5:LRA=11:print_format=json','-f','null','-']);
const m=JSON.parse(measured.stderr.match(/\{[^{}]*"input_i"[^{}]*\}/)[0]);
run(['-v','error','-i',raw,'-af',`loudnorm=I=-16.6:TP=-1.5:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=false`,'-ar','48000','-ac','2',final]);
console.log(final,'| entrada',m.input_i,'LUFS, pico',m.input_tp);
