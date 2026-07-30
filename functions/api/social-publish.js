/* Publica no Facebook e no Instagram via Graph API.

   Roda no servidor de proposito: o token de pagina da Meta permite postar nas
   contas oficiais, entao ele fica nas variaveis de ambiente do Cloudflare Pages e
   nunca chega ao navegador nem ao banco.

   Variaveis (Cloudflare Pages > Settings > Environment variables):
     META_ACCESS_TOKEN      token de pagina de longa duracao
     META_PAGE_ID           ID da pagina do Facebook
     META_IG_USER_ID        ID da conta profissional do Instagram (opcional)
     FIREBASE_API_KEY       chave web do Firebase (valida o login de quem chamou)
     SOCIAL_ALLOWED_EMAILS  e-mails autorizados, separados por virgula
*/

const GRAPH = 'https://graph.facebook.com/v26.0'
const FB_MIN_SCHEDULE_S = 10 * 60          // a Meta exige no minimo 10 minutos
const FB_MAX_SCHEDULE_S = 75 * 24 * 3600   // e no maximo 75 dias

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

/* confirma que quem chamou esta logado no painel; sem isso a URL da funcao
   viraria um jeito de qualquer pessoa postar nas contas oficiais */
async function authorize(idToken, env) {
  /* o projeto ja define VITE_FIREBASE_API_KEY para o front; reaproveitamos ela
     aqui para nao precisar cadastrar a mesma chave duas vezes */
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
    return { ok: false, msg: 'Sua conta nao tem permissao para publicar nas redes.' }
  }
  return { ok: true, email }
}

async function graph(path, params) {
  const res = await fetch(GRAPH + path, { method: 'POST', body: new URLSearchParams(params) })
  const data = await res.json()
  if (data.error) throw new Error(data.error.error_user_msg || data.error.message)
  return data
}

/* o container do Instagram costuma ficar pronto na hora, mas a Meta recomenda
   conferir o status antes de publicar */
async function waitForContainer(id, token) {
  for (let i = 0; i < 8; i++) {
    const res = await fetch(GRAPH + '/' + id + '?fields=status_code&access_token=' + encodeURIComponent(token))
    const data = await res.json()
    if (data.status_code === 'FINISHED') return
    if (data.status_code === 'ERROR') throw new Error('O Instagram recusou a imagem.')
    await new Promise(r => setTimeout(r, 2000))
  }
  throw new Error('O Instagram demorou demais para processar a imagem.')
}

export async function onRequestPost(context) {
  const { request, env } = context

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'corpo invalido' }, 400)
  }

  /* autenticacao antes de qualquer outra coisa: sem isso a resposta contaria a
     quem nao esta logado como o site esta configurado */
  const auth = await authorize(body.idToken, env)
  if (!auth.ok) return json({ error: auth.msg }, 401)

  const token = env.META_ACCESS_TOKEN
  const pageId = env.META_PAGE_ID
  const igUserId = env.META_IG_USER_ID
  if (!token || !pageId) {
    return json({ error: 'Configuracao da Meta ausente: defina META_ACCESS_TOKEN e META_PAGE_ID no Cloudflare.' }, 500)
  }

  const { imageUrl, caption, scheduleAt, targets } = body
  if (!imageUrl || !caption) return json({ error: 'imageUrl e caption sao obrigatorios' }, 400)

  const wantFacebook = !targets || targets.facebook !== false
  const pediuInstagram = !targets || targets.instagram !== false
  const wantInstagram = pediuInstagram && Boolean(igUserId)

  const results = []
  const errors = []

  /* sem o META_IG_USER_ID nao da para publicar no Instagram; avisa em vez de
     ignorar em silencio, senao parece que o post saiu nas duas redes */
  if (pediuInstagram && !igUserId) {
    errors.push('Instagram: ainda não configurado (falta META_IG_USER_ID).')
  }

  if (wantFacebook) {
    try {
      const params = { url: imageUrl, caption, access_token: token }
      if (scheduleAt) {
        const when = Math.floor(new Date(scheduleAt).getTime() / 1000)
        if (isNaN(when)) throw new Error('Data de agendamento invalida.')
        const delta = when - Math.floor(Date.now() / 1000)
        if (delta < FB_MIN_SCHEDULE_S) throw new Error('O Facebook exige agendar com pelo menos 10 minutos de antecedencia.')
        if (delta > FB_MAX_SCHEDULE_S) throw new Error('O Facebook aceita agendamento de no maximo 75 dias.')
        params.published = 'false'
        params.scheduled_publish_time = String(when)
      }
      await graph('/' + pageId + '/photos', params)
      results.push(scheduleAt ? 'Facebook: agendado' : 'Facebook: publicado')
    } catch (e) {
      errors.push('Facebook: ' + e.message)
    }
  }

  if (wantInstagram) {
    try {
      const media = await graph('/' + igUserId + '/media', { image_url: imageUrl, caption, access_token: token })
      await waitForContainer(media.id, token)
      await graph('/' + igUserId + '/media_publish', { creation_id: media.id, access_token: token })
      results.push('Instagram: publicado')
    } catch (e) {
      errors.push('Instagram: ' + e.message)
    }
  }

  if (!results.length) return json({ error: errors.join(' · ') || 'nada foi publicado' }, 502)
  return json({ results, errors })
}
