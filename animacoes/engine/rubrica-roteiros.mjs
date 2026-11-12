import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const FONTES_EDITORIAIS = [
  {id:'mrbeast',titulo:'How to Succeed in MrBeast Production',paginas:[2,5,6,7,8,29,35],contexto:'Manual de produção de vídeos longos; edição/data não confirmadas.',arquivo:'C:/Users/joaot/Downloads/66edaa19db6e9359bb92931f_How-To-Succeed-At-MrBeast-Production (2)_cópia.pdf'},
  {id:'storykit',titulo:'Script writing for social media videos',paginas:[9,10,11,12,14,18,20,22,23,24,25],contexto:'Guia Storykit de vídeo social orientado por texto; metadados do PDF de 2023.',arquivo:'C:/Users/joaot/Downloads/ENG-academy-ebook-script_cópia.pdf'},
  {id:'playbook',titulo:'Creator Playbook for Brands',paginas:[14,20,21,22,29,30,42,75,76,77,78,79,80],contexto:'Guia histórico de marcas; metadados do PDF de 2016, não regras atuais de Shorts.',arquivo:'C:/Users/joaot/Downloads/youtube-playbook_cópia.pdf'},
];

const texto = value => typeof value==='string' && value.trim().length>0;
const objeto = value => value!==null && typeof value==='object' && !Array.isArray(value);
const normalizar = value => String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const genericos = new Set(['aumenta a tensao','mais tensao','a tensao aumenta','algo acontece','acontece algo','algo inesperado','uma surpresa','virada surpreendente','o problema aumenta','o conflito aumenta','primeiro problema','segundo problema','terceiro problema','escalada','piora','payoff','entrega','a resposta','contexto','continuidade','a definir','preencher','tbd']);
const poucoEspecifico = value => genericos.has(normalizar(value)) || /^(acontece algo|algo inesperado acontece|inserir |preencher |descrever )/.test(normalizar(value));

/** Presença de decisões + indícios literais. Não avalia graça, retenção ou qualidade semântica. */
export function avaliarEditorial(estrutura={}) {
  const r={versao:1,estado:'sem-contrato',aplicada:false,avisos:[],limites:'Auditoria não bloqueante de campos e indícios textuais. Campos presentes não comprovam compreensão, causalidade, graça, retenção ou aprovação editorial. Não houve ajuste de pesos de modelo.',fontes:FONTES_EDITORIAIS};
  if(!objeto(estrutura)||!Object.hasOwn(estrutura,'editorial'))return r;
  r.aplicada=true;
  const aviso=(codigo,campo,mensagem)=>r.avisos.push({codigo,campo,mensagem});
  const e=estrutura.editorial;
  if(!objeto(e)){
    aviso('CONTRATO_INVALIDO','editorial','O contrato editorial deve ser um objeto; revisar antes da aprovação humana.');
    r.estado='revisar-campos';return r;
  }
  const campos={
    promessa:'Qual expectativa específica o começo e a embalagem criam?',
    contextoNovo:'Que contexto mínimo permite a um novo espectador compreender a situação?',
    perguntaLocal:'Qual pergunta este vídeo se compromete a responder?',
    payoffLocal:'Qual resposta, consequência ou revelação é entregue no próprio vídeo?',
    hipoteseTeste:'Que hipótese será comparada, sem prometer resultado?',
  };
  for(const [campo,pergunta]of Object.entries(campos)){
    if(!texto(e[campo]))aviso('CAMPO_AUSENTE',`editorial.${campo}`,pergunta);
    else if(poucoEspecifico(e[campo]))aviso('DECISAO_GENERICA',`editorial.${campo}`,'Há um rótulo/placeholder em lugar de uma decisão específica da história.');
  }
  if(typeof e.publicadoAnteriormente!=='boolean')aviso('HISTORICO_AUSENTE','editorial.publicadoAnteriormente','Declare explicitamente se a história/episódio já foi publicado antes desta reconstrução.');
  if(!Array.isArray(e.escalada)||e.escalada.length===0)aviso('ESCALADA_AUSENTE','editorial.escalada','Declare as mudanças de risco, custo, informação ou relação; uma lista vazia não descreve progressão.');
  else {
    const vistos=new Set();
    e.escalada.forEach((passo,i)=>{
      if(!texto(passo)||poucoEspecifico(passo))aviso('ESCALADA_GENERICA',`editorial.escalada[${i}]`,'Substitua o rótulo por tentativa/consequência específica; não basta dizer que a tensão aumenta.');
      else {const chave=normalizar(passo);if(vistos.has(chave))aviso('ESCALADA_REPETIDA',`editorial.escalada[${i}]`,'Este degrau repete o mesmo texto; conferir se existe mudança real.');vistos.add(chave);}
    });
  }
  for(const campo of ['entrada','saida'])if(!objeto(e.continuidade)||!texto(e.continuidade[campo]))aviso('CONTINUIDADE_AUSENTE',`editorial.continuidade.${campo}`,`Declare o estado de ${campo} que liga o vídeo à série; para vídeo independente, descreva seu estado inicial/final.`);
  if(texto(e.perguntaLocal)&&texto(e.payoffLocal)&&normalizar(e.perguntaLocal)===normalizar(e.payoffLocal))aviso('ENTREGA_REPETE_PERGUNTA','editorial.payoffLocal','A entrega repete literalmente a pergunta. Conferir se há resposta/consequência no vídeo.');
  if(texto(e.payoffLocal)&&/^(continua no|a resposta (fica|vem|esta) no proximo|so no proximo|descubra no proximo)/.test(normalizar(e.payoffLocal)))aviso('ENTREGA_ADIADA','editorial.payoffLocal','A declaração parece adiar a entrega para outro vídeo; conferir se a promessa local é paga antes da continuação.');
  const p=e.participacao;
  if(!objeto(p)||!['retrospectiva','futura','nenhuma'].includes(p.tipo))aviso('PARTICIPACAO_INVALIDA','editorial.participacao.tipo','Escolha retrospectiva, futura ou nenhuma; não inferir o tipo pelo texto do CTA.');
  else {
    if(p.tipo!=='nenhuma'&&!texto(p.pergunta))aviso('PERGUNTA_PARTICIPACAO_AUSENTE','editorial.participacao.pergunta','Declare a pergunta concreta e, quando houver escolha, os custos/opções que o espectador entende.');
    const reabertura=objeto(p.reabertura)&&p.reabertura.confirmada===true&&texto(p.reabertura.motivo);
    if(p.tipo==='futura'&&e.publicadoAnteriormente===true&&!reabertura)aviso('FUTURA_EM_PUBLICADO','editorial.participacao','O episódio já foi publicado: uma votação futura pode prometer alterar um passado pronto. Usar pergunta retrospectiva ou documentar reabertura real e explícita.');
    if(p.reabertura!==undefined&&!reabertura)aviso('REABERTURA_INCOMPLETA','editorial.participacao.reabertura','Reabertura precisa de confirmada: true e motivo específico; a declaração não comprova aprovação ou realização de uma votação.');
  }
  r.estado=r.avisos.length?'revisar-campos':'campos-presentes';return r;
}

export function relatorioMarkdown(r,{titulo='Auditoria editorial de roteiro'}={}) {
  const linhas=[`# ${titulo}`,'',`Estado: **${r.estado}**. ${r.aplicada?'Contrato examinado.':'Sem contrato editorial; comportamento legado preservado.'}`,'',r.limites,'','## Pontos para revisão',''];
  if(r.avisos.length)for(const a of r.avisos)linhas.push(`- **${a.codigo}** — \`${a.campo}\`: ${a.mensagem}`);
  else linhas.push(r.aplicada?'Nenhuma lacuna estrutural detectada. A leitura humana ainda precisa conferir promessa, progressão, entrega, continuidade e participação.':'Nenhuma auditoria de contrato aplicada.');
  linhas.push('','## Origem dos critérios','');
  for(const fonte of r.fontes)linhas.push(`- ${fonte.titulo}, páginas físicas ${fonte.paginas.join(', ')}. ${fonte.contexto}`);
  return linhas.join('\n')+'\n';
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try {
    const args=process.argv.slice(2),file=args.shift();
    if(!file)throw Error('Uso: node engine/rubrica-roteiros.mjs estrutura.json [--json] [--saida-json arquivo] [--saida-md arquivo]');
    const op={json:false};
    while(args.length){const arg=args.shift();if(arg==='--json')op.json=true;else if(arg==='--saida-json'||arg==='--saida-md'){const destino=args.shift();if(!destino||destino.startsWith('--'))throw Error(`Falta arquivo para ${arg}`);op[arg]=destino;}else throw Error(`Opção desconhecida: ${arg}`);}
    const r=avaliarEditorial(JSON.parse(fs.readFileSync(file,'utf8'))),json=JSON.stringify(r,null,2)+'\n',md=relatorioMarkdown(r);
    if(op['--saida-json'])fs.writeFileSync(op['--saida-json'],json);
    if(op['--saida-md'])fs.writeFileSync(op['--saida-md'],md);
    process.stdout.write(op.json?json:md);
  }catch(error){process.stderr.write(`${error.message}\n`);process.exitCode=2;}
}
