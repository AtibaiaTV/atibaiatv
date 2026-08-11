/* Apaga uma publicacao ja feita nas redes.

   Vale saber antes de contar com isso: o Facebook tem endpoint de exclusao, o
   Instagram nao tem nenhum na Graph API. Um post do Instagram so sai pelo app,
   na mao. A funcao diz isso em vez de fingir que apagou.

   Usa as mesmas variaveis do social-publish (META_ACCESS_TOKEN, META_PAGE_ID).
*/

const GRAPH = 'https://graph.facebook.com/v26.0'

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

/* mesma checagem do social-publish: sem ela a URL da funcao viraria um jeito de
   qualquer pessoa apagar os posts das contas oficiais */
async function authorize(idToken, env) {
  const apiKey = env.FIREBASE_API_KEY || env.VITE_FIREBASE_API_KEY
  if (!apiKey) return { ok: false, msg: 'FIREBASE_API_KEY nao configurada no Cloudflare' }
  if (!idToken) return { ok: false, msg: 'Sessao ausente. Entre no painel novamente.' }

  const res = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' + apiKey, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ idToken }),
  })
  const data = await res.json()
  const email = data.users && data.users[0] && data.users[0].email
  if (!email) return { ok: false, msg: 'Sessao invalida ou expirada. Entre no painel novamente.' }

  const allowed = (env.SOCIAL_ALLOWED_EMAILS || '')
    .split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
  if (allowed.length && !allowed.includes(email.toLowerCase())) {
    return { ok: false, msg: 'Sua conta nao tem permissao para apagar posts das redes.' }
  }
  return { ok: true, email }
}

export async function onRequestPost(context) {
  const { request, env } = context

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'corpo invalido' }, 400)
  }

  const auth = await authorize(body.idToken, env)
  if (!auth.ok) return json({ error: auth.msg }, 401)

  const token = env.META_ACCESS_TOKEN
  if (!token) return json({ error: 'Configuracao da Meta ausente: defina META_ACCESS_TOKEN.' }, 500)

  const alvos = Array.isArray(body.published) ? body.published : []
  if (!alvos.length) return json({ error: 'nenhuma publicacao informada' }, 400)

  const removed = []
  const errors = []

  for (const alvo of alvos) {
    if (!alvo || !alvo.id) continue

    if (alvo.network !== 'facebook') {
      errors.push('Instagram: a API nao permite apagar publicacao — remova pelo app.')
      continue
    }

    try {
      const res = await fetch(GRAPH + '/' + alvo.id + '?access_token=' + encodeURIComponent(token), {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error.error_user_msg || data.error.message)
      removed.push('facebook')
    } catch (e) {
      errors.push('Facebook: ' + e.message)
    }
  }

  if (!removed.length && errors.length) return json({ removed, errors }, 502)
  return json({ removed, errors })
}
