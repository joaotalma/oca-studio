// Reutiliza todas as gravações aprovadas. Não chama serviço de voz nem gasta créditos.
import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import{spawnSync}from'node:child_process';import{fileURLToPath}from'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),out=path.resolve(here,'../../../../../render/demitido-gta6/dia02-final');
const audio=path.resolve(here,'../../../audio/demitido-gta6-dia02');
const {FALAS}=vm.runInNewContext(fs.readFileSync(path.join(here,'../falas.js'),'utf8')+';({FALAS})');
const run=(args)=>{const r=spawnSync('ffmpeg',['-y','-hide_banner','-nostats',...args],{encoding:'utf8',maxBuffer:1<<24});if(r.status)throw new Error(r.stderr);return r;};
const items=FALAS.map(f=>[path.join(audio,fs.readdirSync(audio).find(n=>n.startsWith(String(f.n).padStart(2,'0')+'_')&&n.endsWith('.mp3'))),f.ini]);
items.push([path.join(audio,'anunciador/round.mp3'),24.05],[path.join(audio,'anunciador/fight.mp3'),25.3],[path.join(audio,'anunciador/ko.mp3'),38.85],[path.join(out,'efeitos.wav'),0]);
const filters=items.map(([,t],i)=>`[${i}:a]adelay=${Math.round(t*1000)}:all=1[a${i}]`).join(';')+';'+items.map((_,i)=>`[a${i}]`).join('')+`amix=inputs=${items.length}:normalize=0:duration=longest,apad=whole_dur=117.8[m]`;
const raw=path.join(out,'mixagem.wav'),final=path.join(out,'audio-master.wav');
run(['-v','error',...items.flatMap(([p])=>['-i',p]),'-filter_complex',filters,'-map','[m]','-t','117.8','-ar','48000','-ac','2',raw]);
const measured=run(['-i',raw,'-af','loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json','-f','null','-']);
const m=JSON.parse(measured.stderr.match(/\{[^{}]*"input_i"[^{}]*\}/)[0]);
run(['-v','error','-i',raw,'-af',`loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=false`,'-ar','48000','-ac','2',final]);
fs.writeFileSync(path.join(out,'qa-resultados/audio-mixagem.json'),JSON.stringify({origem:'gravações existentes; efeitos originais sintetizados',entradas:items,medicao:m,normalizacao:'-16 LUFS / -1.5 dBTP, duas passadas'},null,2));
console.log(final);
