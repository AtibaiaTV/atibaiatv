/* Repassa imagens do Firebase Storage com cabecalho de CORS.
   O bucket nao envia Access-Control-Allow-Origin, e sem ele o navegador nao deixa
   desenhar a foto no <canvas>: a arte sairia sem imagem e o JPEG nao poderia ser
   exportado. Passando pelo nosso dominio, o canvas continua liberado.

   Restrito ao bucket do projeto de proposito: aceitar qualquer URL transformaria
   esta funcao num proxy aberto. */

const ALLOWED_HOSTS = ['firebasestorage.googleapis.com']
const ALLOWED_BUCKET = 'site-atibaiatv'

export async function onRequestGet(context) {
  const target = new URL(context.request.url).searchParams.get('u')
  if (!target) return new Response('parametro "u" obrigatorio', { status: 400 })

  let parsed
  try {
    parsed = new URL(target)
  } catch {
    return new Response('URL invalida', { status: 400 })
  }

  if (!ALLOWED_HOSTS.includes(parsed.hostname) || !parsed.pathname.includes(ALLOWED_BUCKET)) {
    return new Response('origem nao permitida', { status: 403 })
  }

  const upstream = await fetch(parsed.toString())
  if (!upstream.ok) return new Response('imagem nao encontrada', { status: upstream.status })

  const contentType = upstream.headers.get('content-type') || 'image/jpeg'
  if (!contentType.startsWith('image/')) return new Response('conteudo nao e imagem', { status: 415 })

  return new Response(upstream.body, {
    status: 200,
    headers: {
      'content-type': contentType,
      'access-control-allow-origin': '*',
      'cache-control': 'public, max-age=86400',
    },
  })
}
