import assert from 'node:assert/strict';
import {sample,knee,mouthPose,mouthNames} from './atuacao.mjs';
const times=Array.from({length:361},(_,i)=>i/30);
const sequential=times.map(t=>JSON.stringify(sample(t)));
for(const i of [...times.keys()].reverse())assert.equal(JSON.stringify(sample(times[i])),sequential[i]);
assert.deepEqual(sample(2.801),sample(2.825),'duas exposições compartilham a pose');
assert.notDeepEqual(sample(2.801,{twos:false}),sample(2.825,{twos:false}));
assert.equal(sample(0).jaw,0);assert.equal(sample(12).jaw,0);
for(const t of times){
  const p=sample(t);
  assert.ok(Number.isInteger(p.handL)&&Number.isInteger(p.handR),'poses de mão são estados, não valores interpolados');
  if(t>=2.9 && t<=3.55)assert.notEqual(p.handR,2,'a transição de palma 3 para palma 1 não pode passar pelo punho 2');
  assert.ok(Object.values(p).every(Number.isFinite));
  assert.ok(p.squash>=.94 && p.squash<=1.07);
  assert.ok(Math.abs(p.squash*(1/p.squash)-1)<1e-12,'área local da cabeça conservada');
  for(const [x,side]of [[175,-1],[265,1]]){
    const hip=[220+p.hip+side*36,667+p.dy],foot=[x,913],joint=knee(hip,foot,125,125,-side);
    assert.ok(Math.abs(Math.hypot(joint[0]-hip[0],joint[1]-hip[1])-125)<.02);
    assert.ok(Math.abs(Math.hypot(foot[0]-joint[0],foot[1]-joint[1])-125)<.02);
  }
}
assert.equal(mouthNames.length,8);
for(const name of mouthNames){const p=mouthPose(name);assert.ok(p.jaw>=0 && p.jaw<=1);}
assert.throws(()=>mouthPose('desconhecida'));
console.log('OK: determinismo fora de ordem, cadências, repouso, volume local, pernas de comprimento fixo com pés plantados e biblioteca de boca.');
