from pathlib import Path
import json,re,shutil
ROOT=Path('C:/Users/joaot/Projetos/se-vira-tico')
STAGE=Path(__file__).parent
EP=ROOT/'episodios/ep06'
EP.mkdir(exist_ok=True)
for name in ['ep.js','falas.md']: shutil.copyfile(STAGE/name,EP/name)
slots=[(1.8,4.2),(6,7.7),(11,12.8),(13.6,15.2),(17,19.2),(20.2,22.2),(23.4,24.2),(29,31.5),(32.5,33.3),(35,36.6),(41,41.8),(43,45.8),(46.6,47.8)]
slots=[(a+4.8,b+4.8) if i>=7 else (a,b) for i,(a,b) in enumerate(slots)]
rows=re.findall(r'^\| `(\d+)_(\w+)\.mp3` \| ([^|]+) \| ([^|]+) \|', (EP/'falas.md').read_text(encoding='utf8'), re.M)
falas=[dict(n=int(n),ini=slots[i][0],fim=slots[i][1],quem=who.strip(),texto=text.strip()) for i,(n,key,who,text) in enumerate(rows)]
(EP/'falas.js').write_text('const FALAS = '+json.dumps(falas,ensure_ascii=False)+';\n',encoding='utf8')
(EP/'film.html').write_text('''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><link rel="icon" href="data:,"><title>Se Vira, Tico — Final T1</title><style>html,body{margin:0;background:#263a39}canvas{display:block}</style><script src="chars.js"></script><script src="cenarios.js"></script><script src="falas.js"></script><script src="tempos.js"></script><script src="ep.js"></script></head><body><canvas id="c"></canvas><script src="motor.js"></script></body></html>''',encoding='utf8')
# Opt-in das novas pupilas/olhar: fonte do rig, nunca a cópia do episódio.
p=ROOT/'personagens/chars.js';s=p.read_text(encoding='utf8')
old="  const E = Object.assign({}, EXPR[Pz.expr] || EXPR.neutro);"
new=old+"\n  if (Pz.look) E.look = Pz.look;\n  if (Pz.pupil != null) E.pupil = Pz.pupil;\n  if (Pz.graphicEyes) E.graphicEyes = true;"
if 'if (Pz.graphicEyes)' not in s:
 assert old in s;s=s.replace(old,new)
 old="s += ell(px, py, 5.6 * pS, 6.4 * pS, d.iris) + ell(px, py, 3 * pS, 3.8 * pS, '#171719') + ell(px - 1.4, py - 2.2, 1.6, 1.8, '#fff');"
 new="s += E.graphicEyes ? ell(px, py, 4.7 * pS, 5.4 * pS, '#171719') + ell(px - 1.4, py - 2.2, 1.5, 1.6, '#fff') : ell(px, py, 5.6 * pS, 6.4 * pS, d.iris) + ell(px, py, 3 * pS, 3.8 * pS, '#171719') + ell(px - 1.4, py - 2.2, 1.6, 1.8, '#fff');"
 assert old in s;s=s.replace(old,new);p.write_text(s,encoding='utf8')
p=ROOT/'personagens/motor.js';s=p.read_text(encoding='utf8')
old="const po = { armL: [-9, -5], armR: [9, 5], ...pz, blink, breath };"
new="const po = { armL: [-9, -5], armR: [9, 5], graphicEyes: EPISODIO.graphicEyes || false, ...pz, blink, breath };"
if old in s:s=s.replace(old,new)
old="    const blocos = []; let atual = [];"
new="""    if (f.palavras && f.palavras.length) {
      const out = [];
      for (let i=0;i<f.palavras.length;i+=3) { const ws=f.palavras.slice(i,i+3); out.push({b:ws.map(w=>w.palavra),ini:ws[0].ini,fim:ws[ws.length-1].fim}); }
      return out;
    }
"""+old
if 'if (f.palavras &&' not in s:assert old in s;s=s.replace(old,new)
p.write_text(s,encoding='utf8')
ep=(EP/'ep.js').read_text(encoding='utf8').replace("const EPISODIO={duracao:DUR6,falas", "const EPISODIO={graphicEyes:true,duracao:DUR6,falas")
ep=ep.replace("({id,x,s:1.32,poses", "({id,x,s:1.32,dyn:t=>({look:[id==='tico'?3:-3,0]}),poses")
(EP/'ep.js').write_text(ep,encoding='utf8')
# Piscada progressiva opt-in: preserva o desenho legado nos episódios publicados.
p=ROOT/'personagens/chars.js';s=p.read_text(encoding='utf8')
old="  const kind = blink ? 'suave' : E.eye;"
new="  if (E.graphicEyes && blink > 0) return `<g transform=\"translate(0 -20) scale(1 ${Math.max(.025,1-blink)}) translate(0 20)\">${eyeSVG(d, side, E, 0)}</g>`;\n"+old
if 'E.graphicEyes && blink > 0' not in s:assert old in s;s=s.replace(old,new)
s=s.replace('const blink = pose.blink >= .5;', 'const blink = pose.graphicEyes ? pose.blink : pose.blink >= .5;')
p.write_text(s,encoding='utf8')
p=ROOT/'personagens/motor.js';s=p.read_text(encoding='utf8')
old="    if (Math.abs(t - trocaExpr) < .07) p.blink = 1;"
new="    if (Math.abs(t - trocaExpr) < (EPISODIO.graphicEyes ? .12 : .07)) p.blink = EPISODIO.graphicEyes ? 1-Math.abs(t-trocaExpr)/.12 : 1;"
if old in s:s=s.replace(old,new)
old="    const blink = pz.blink || (((t + f * 1.31) % 3.7) < .13 ? 1 : 0);"
new="    const bp = (t + f * 1.31) % 3.7;\n    const blink = pz.blink || (EPISODIO.graphicEyes ? (bp < .26 ? Math.sin(Math.PI * bp / .26) ** 2 : 0) : (bp < .13 ? 1 : 0));"
if old in s:s=s.replace(old,new)
old="function telas(t) { for (const e of EPISODIO.telas || []) if (t >= e.ini && t < e.fim) e.desenha((t - e.ini) / (e.fim - e.ini), t - e.ini, { g, cartao, texto, sai, suave }); }"
new="function telas(t) { for (const e of EPISODIO.telas || []) if (t >= e.ini && t < e.fim) { g.save(); if(EPISODIO.suavizarTelas && e.fim < EPISODIO.duracao) g.globalAlpha=Math.min(1,e.ini===0?1:(t-e.ini)/.18,(e.fim-t)/.18); e.desenha((t - e.ini) / (e.fim - e.ini), t - e.ini, { g, cartao, texto, sai, suave }); g.restore(); } }"
if old in s:s=s.replace(old,new)
p.write_text(s,encoding='utf8')
# Rig e motor atualizados para o episódio, sem mexer nos renders publicados.
for name in ['chars.js','cenarios.js']:shutil.copyfile(ROOT/'personagens'/name,EP/name)
(EP/'motor.js').write_text((ROOT/'personagens/acabamento.js').read_text(encoding='utf8')+(ROOT/'personagens/motor.js').read_text(encoding='utf8'),encoding='utf8')
(EP/'mixagem.py').write_text('''def config(mx,I,E):
 return {'CUES':[(0,10.5,'apuro',.55),(28.5,33.3,'romance',.4),(33.3,42.8,'romance',.65),(42.8,53.8,'romance',.65),(58.8,60.8,'romance',.55),(60.8,65.8,'voto',.6)],'EFEITOS':[(1.3,mx.fx_clique,.25),(4.5,mx.fx_passagem,.4),(8.6,mx.fx_notificacao,.25),(30.65,mx.fx_clique,.2),(38.3,mx.fx_clique,.2),(53.8,mx.fx_notificacao,.25)],'LATIDOS':[],'VOZ_INTERFONE':set(),'APITO':set(),'MOTORES':[(1.8,8.5,.045)]}
''',encoding='utf8')
print('Preparado:',len(falas),'falas;',sum(len(f['texto']) for f in falas),'caracteres. Fonte do rig com olhos gráficos opt-in.')
