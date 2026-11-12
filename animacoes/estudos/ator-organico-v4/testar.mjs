import assert from 'node:assert/strict';
import {sample,mouthNames,mouthPose} from './atuacao.mjs';
import {ribbon,cubic,roundMouth} from './formas.mjs';
import {pupil,eyeFocus} from './olhos.mjs';
import {sample as oldSample} from '../ator-expressivo-v3/atuacao.mjs';
assert.deepEqual(cubic([0,0],[1,1],[2,1],[3,0],0),[0,0]);
assert.deepEqual(cubic([0,0],[1,1],[2,1],[3,0],1),[3,0]);
for(let i=0;i<=360;i++){
  const p=sample(i/30);assert.deepEqual(p,oldSample(i/30),'tempos e poses preservados');
  for(const [upper,fore] of [[p.armL,p.foreL],[p.armR,p.foreR]]){
    const a=[132,410],j=[132+Math.cos(upper*Math.PI/180)*112,410+Math.sin(upper*Math.PI/180)*112],b=[j[0]+Math.cos(fore*Math.PI/180)*112,j[1]+Math.sin(fore*Math.PI/180)*112];
    const r=ribbon(a,j,b,[55,46,34]);assert.ok(!/NaN|Infinity/.test(r.outline));
    assert.deepEqual(r.center[0],a);assert.deepEqual(r.center.at(-1),b);
    assert.deepEqual(r.controls[0][3],r.controls[1][0]);
    const incoming=r.controls[0][3].map((v,k)=>v-r.controls[0][2][k]),outgoing=r.controls[1][1].map((v,k)=>v-r.controls[1][0][k]);
    assert.ok(Math.abs(incoming[0]*outgoing[1]-incoming[1]*outgoing[0])<1e-7,'junta com tangente contínua');
  }
  const mouth=roundMouth(p);assert.ok(mouth.w>0&&mouth.open>0);assert.ok(!/NaN|Infinity/.test(mouth.d));
  const eye=pupil(p);assert.ok(eye.radius>=5.5&&eye.radius<=11.6);assert.ok(eye.shine>0&&eye.shine<eye.radius);
}
for(const name of mouthNames)assert.ok(!/NaN|Infinity/.test(roundMouth({...sample(0),...mouthPose(name)}).d));
assert.ok(pupil(sample(2.9)).radius<pupil(sample(0)).radius);
assert.ok(pupil(sample(6.5)).radius>pupil(sample(0)).radius);
assert.ok(eyeFocus(sample(1.2)).x>0&&eyeFocus(sample(4.7)).x<0,'olhar muda de lado por intenção');
console.log('OK: poses/tempos, curvas, tangência das juntas, pontas fixas, bocas e pupilas/foco por intenção.');
