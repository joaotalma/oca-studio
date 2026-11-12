import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

// Compila decisões editoriais explícitas; não inventa fatos nem promete desempenho.
export function compilar(e,{ppm=150}={}) {
  for(const k of ['slug','pergunta','mecanismo','pista','virada','resposta'])if(!e[k]?.trim())throw Error(`Falta decisão editorial: ${k}`);
  if(!Array.isArray(e.falas)||e.falas.length<6)throw Error('Estrutura precisa de falas completas');
  if(!Number.isFinite(ppm)||ppm<80||ppm>260)throw Error('Ritmo inválido');
  const fontes=e.fontes||{};let t=0,palavras=0;
  const falas=e.falas.map((f,i)=>{
    if(!f.texto?.trim()||!['foi','seria','voce'].includes(f.camada))throw Error(`Fala ${i+1}: texto/camada inválidos`);
    if(!f.funcao||!f.acao||!f.revela)throw Error(`Fala ${i+1}: falta função, ação ou informação nova`);
    if(f.camada==='foi'&&(!fontes[f.fonte]||fontes[f.fonte].situacao!=='conferido'))throw Error(`Fala ${i+1}: fato sem fonte conferida`);
    if(i>3&&!f.causa)throw Error(`Fala ${i+1}: falta ligação com a etapa anterior`);
    const words=f.texto.trim().split(/\s+/).length;palavras+=words;
    const pausa=f.pausa??(f.funcao==='virada'?.45:i===0?0:.12);
    const ini=+(t+pausa).toFixed(2),fim=+(ini+words/ppm*60).toFixed(2);t=fim;
    return {n:i+1,quem:'Narrador',texto:f.texto,camada:f.camada,pausa,ini,fim,inteiro:i===0,movimento:f.movimento||'parado',...(f.imagem?{imagem:f.imagem}:{}),...(f.cena3d?{cena3d:f.cena3d}:{}),...(f.fonte?{fonte:f.fonte}:{}),...(f.destaque?{destaque:f.destaque}:{}),...(f.camada==='foi'?{filtro:'flashback'}:{})};
  });
  if(falas[0].fim>3)throw Error('Gancho excede 3 s no ritmo estimado');
  const avisos=[];
  if(t<65||t>75)avisos.push(`Duração ${t.toFixed(1)} s fora do alvo 65–75; revisar texto/ritmo, nunca preencher com frase vazia.`);
  if(e.falas.some(f=>f.texto.split(/\s+/).length>15))avisos.push('Há fala com mais de 15 palavras; conferir respiração.');
  return {falas,palavras,duracao:t,avisos,direcao:{versao:2,slug:e.slug,mecanismo:e.mecanismo,pergunta:e.pergunta,pista:e.pista,virada:e.virada,resposta:e.resposta,planos:e.falas.map((f,i)=>({fala:i+1,funcao:f.funcao,acao:f.acao,revela:f.revela,causa:f.causa||'abertura/contexto',enquadramento:f.enquadramento||'medio',movimento:f.movimento||'parado',motivoCorte:f.motivoCorte||'mudança de informação',...(f.cena3d?{cena3d:f.cena3d}:{})}))}};
}
export function gerar(file,{ppm=150}={}) {
  const e=JSON.parse(fs.readFileSync(file,'utf8')),dir=path.dirname(file),r=compilar(e,{ppm});
  fs.writeFileSync(path.join(dir,'falas.js'),'const FALAS = [\n'+r.falas.map(f=>'  '+JSON.stringify(f)).join(',\n')+'\n];\n');
  fs.writeFileSync(path.join(dir,'direcao.json'),JSON.stringify(r.direcao,null,2)+'\n');
  fs.writeFileSync(path.join(dir,'video.js'),`const VIDEO = { template: 'ilustrado', slug: '${e.slug}', paleta: '${e.paleta||'petroleo'}', rosto: 'curioso', olhos: 'cinema', dissolve: 0.08, folga: 0.6 };\n`);
  const rows=e.falas.map((f,i)=>`| ${i+1} | ${f.funcao} | ${f.camada==='foi'?'ACONTECEU':'E SE...'} | ${f.texto} | ${f.fonte||'Hipótese declarada'} |`).join('\n');
  fs.writeFileSync(path.join(dir,'roteiro.md'),`# ${e.titulo||e.falas[0].texto}\n\nDireitos: ${e.direitos||'LIVRE — fatos históricos, texto e imagens próprios; ver fontes.md.'}\n\nRevisão v2: original preservado na pasta superior. ${r.palavras} palavras; ${r.duracao.toFixed(1)} s estimados a ${ppm} ppm. A voz real substitui esta estimativa.\n\nPergunta: ${e.pergunta}\n\nMecanismo: ${e.mecanismo}\n\nPista: ${e.pista}\n\nVirada: ${e.virada}\n\nEntrega: ${e.resposta}\n\n| Nº | Função | Selo | Fala | Fonte |\n|---|---|---|---|---|\n${rows}\n\n## Fontes\n\n${Object.entries(e.fontes).map(([id,s])=>`- ${id}: ${s.descricao} — ${s.url}. ${s.evidencia}`).join('\n')}\n\n## Produção\n\nGuia: docs/DIRECAO-VISUAL.md. Plano por fala: direcao.json. Não reutilizar automaticamente as imagens do roteiro antigo: o texto mudou.\n\n## Aprovações\n\n${e.autorizacao||'Roteiro revisado: aguardando decisão do João. Imagens novas e vídeo: ainda não produzidos.'}\n\n${r.avisos.map(a=>'- Revisar: '+a).join('\n')}\n`);
  return r;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const r=gerar(process.argv[2],{ppm:Number(process.argv[3]||150)});console.log(`${r.palavras} palavras; ${r.duracao.toFixed(1)} s; ${r.avisos.join(' ')}`);
}
