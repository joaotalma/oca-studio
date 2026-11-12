import fs from 'node:fs/promises';
const root = new URL('./', import.meta.url);
const original = await fs.readFile(new URL('../../personagens/voce-ficha.svg', root), 'utf8');
const defs = original.slice(original.indexOf('<defs>') + 6, original.indexOf('<!-- FRENTE -->'));
const front = original.match(/<g id="frente">([\s\S]*?)\n  <\/g>/)[1];
const between = (a,b) => front.slice(front.indexOf(a),front.indexOf(b));
const svg = body => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 1000"><defs>${defs}</defs>${body}</svg>`;
await fs.mkdir(new URL('assets/', root), {recursive:true});
await Promise.all([
  fs.writeFile(new URL('assets/base.svg', root), svg(front)),
  fs.writeFile(new URL('assets/tronco.svg', root), svg(between('<!-- tronco -->','<!-- cabeça -->').replace(/<path class="f" style="stroke:#7a3320"[^>]*\/>/,''))),
  fs.writeFile(new URL('assets/cabeca.svg', root), svg(between('<!-- cabeça -->','<!-- sobrancelhas,') + '<circle cx="266" cy="300" r="3.6" fill="#3b2318"/>')),
]);
console.log('Partes derivadas somente da ficha aprovada do Plotline.');
