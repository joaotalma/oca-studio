#!/usr/bin/env node
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const raiz=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const fonte=fs.readFileSync(path.join(raiz,'docs/FLUXOS.md'),'utf8').replace(/\r\n/g,'\n');
const gravar=(p,s)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,s);};
const blocos=[...fonte.matchAll(/<!-- skill:([\w-]+) -->\n([\s\S]*?)\n<!-- \/skill:\1 -->/g)];
if(!blocos.length || blocos.length !== (fonte.match(/<!-- skill:/g)||[]).length) throw Error('Blocos de instrução incompletos');
for(const m of blocos){
 const [,nome,body]=m,front=body.match(/^---\r?\n[\s\S]*?\r?\n---/)[0];
 const texto=front+`\n\n# ${nome}\n\nEntrada gerada por motor/sincronizar-instrucoes.mjs. Leia a seção entre \`<!-- skill:${nome} -->\` e \`<!-- /skill:${nome} -->\` em [docs/FLUXOS.md](../../../docs/FLUXOS.md). Os caminhos são relativos a animacoes/. Edite a fonte única, não este atalho.\n`;
 for(const app of ['.agents','.claude'])gravar(path.join(raiz,app,'skills',nome,'SKILL.md'),texto);
}
const serie=path.join(raiz,'series/se-vira-tico'),doc=fs.readFileSync(path.join(serie,'docs/PRODUCAO.md'),'utf8');
const front=doc.match(/^---\r?\n[\s\S]*?\r?\n---/)[0];
for(const app of ['.agents','.claude'])gravar(path.join(serie,app,'skills/se-vira-tico/SKILL.md'),front+'\n\n# Se Vira, Tico\n\nEntrada gerada. Leia [docs/PRODUCAO.md](../../../docs/PRODUCAO.md) e o AGENTS.md da série. Edite apenas a fonte em docs/.\n');
console.log('Instruções sincronizadas: fontes únicas, entradas de descoberta para Claude e Codex.');
