/* Devolve a localizacao aproximada de quem esta acessando.

   O Cloudflare ja resolve isso na borda e entrega os dados prontos em request.cf,
   entao nao precisamos de servico externo nem de guardar o IP do visitante. O que
   sai daqui e so cidade/estado/pais e as coordenadas do centro da cidade — nada
   que identifique uma pessoa. */

export async function onRequestGet(context) {
  const cf = context.request.cf || {}

  return new Response(JSON.stringify({
    pais: cf.country || '',
    estado: cf.regionCode || cf.region || '',
    cidade: cf.city || '',
    lat: cf.latitude ? Number(cf.latitude) : null,
    lon: cf.longitude ? Number(cf.longitude) : null,
  }), {
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
    },
  })
}
