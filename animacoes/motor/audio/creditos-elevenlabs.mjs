// Estimativa de créditos do ElevenLabs antes de gravar (regra da Oca Studio: perguntar antes de gastar).
// No texto para fala, o ElevenLabs cobra por caractere. Aqui se mostra o que o pedido vai usar e o que
// ainda resta no plano, consultando a API (GET /v1/user/subscription). Devolve true só com --confirmar; sem ele, nada deve ser gravado.
export async function conferirCreditos(caracteres, { chave = process.env.ELEVENLABS_API_KEY, confirmar = process.argv.includes('--confirmar') } = {}) {
  let resta = null;
  try {
    const r = await fetch('https://api.elevenlabs.io/v1/user/subscription', { headers: { 'xi-api-key': chave } });
    if (r.ok) { const s = await r.json(); resta = s.character_limit - s.character_count; }
  } catch { /* sem rede: segue só com a estimativa */ }
  const sobra = resta == null ? 'saldo do plano indisponível' : `restam ${resta} no plano; depois, cerca de ${resta - caracteres}`;
  console.log(`ElevenLabs: este pedido usa cerca de ${caracteres} créditos (1 por caractere); ${sobra}.`);
  if (resta != null && caracteres > resta) throw Error('Créditos insuficientes no plano do ElevenLabs para este pedido.');
  if (!confirmar) {
    console.log('Nada foi gravado. Mostre a estimativa ao João e, com o sim dele, rode de novo com --confirmar.');
    return false;
  }
  return true;
}
