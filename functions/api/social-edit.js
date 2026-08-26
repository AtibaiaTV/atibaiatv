/* Edita a legenda de um post ja publicado no Facebook.

   O Instagram nao tem endpoint de edicao de legenda na Graph API — so da pra
   trocar a legenda direto pelo app, na mao. Por isso esta funcao so aceita
   posts do Facebook.

   Video e post de feed usam campos diferentes na Graph API pra legenda: um
   video aceita "description", um post de feed aceita "message". O "kind"
   gravado no historico pelo social-publish diz qual dos dois usar.

   Usa as mesmas variaveis do social-publish (META_ACCESS_TOKEN).
*/

const GRAPH = 'https://graph.facebook.com/v26.0'

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

/* mesma checagem do social-publish: sem ela a URL da funcao viraria um jeito de
   qualquer pessoa editar os posts das contas oficiais */
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
    return { ok: false, msg: 'Sua conta nao tem permissao para editar posts das redes.' }
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

  const { id, kind, message } = body
  if (!id) return json({ error: 'id da publicacao e obrigatorio' }, 400)
  if (!message || !message.trim()) return json({ error: 'a legenda nao pode ficar vazia' }, 400)

  /* video guarda a legenda em "description", post de feed guarda em "message" */
  const campo = kind === 'video' ? 'description' : 'message'

  try {
    const res = await fetch(GRAPH + '/' + id, {
      method: 'POST',
      body: new URLSearchParams({ [campo]: message, access_token: token }),
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error.error_user_msg || data.error.message)
    return json({ ok: true })
  } catch (e) {
    /* 422 e nao 502: o Cloudflare troca respostas 502/504/52x pela sua propria
       pagina de erro generica, mesmo quando a funcao respondeu certinho */
    return json({ error: 'Facebook: ' + e.message }, 422)
  }
}
