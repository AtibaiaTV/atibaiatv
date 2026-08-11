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
const MAX_CARROSSEL = 10                   // limite de itens do carrossel no Instagram

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

async function graphGet(path, params) {
  const res = await fetch(GRAPH + path + '?' + new URLSearchParams(params))
  const data = await res.json()
  if (data.error) throw new Error(data.error.error_user_msg || data.error.message)
  return data
}

/* No Facebook um carrossel é um post de feed com fotos enviadas sem publicar e
   depois anexadas a ele; a Meta espera cada anexo num campo indexado */
async function publishFacebookCarousel(pageId, token, urls, caption, agendamento) {
  const ids = []
  for (const url of urls) {
    const foto = await graph('/' + pageId + '/photos', { url, published: 'false', access_token: token })
    ids.push(foto.id)
  }

  const params = { message: caption, access_token: token }
  ids.forEach((id, i) => { params['attached_media[' + i + ']'] = JSON.stringify({ media_fbid: id }) })
  if (agendamento) {
    params.published = 'false'
    params.scheduled_publish_time = String(agendamento)
  }

  const post = await graph('/' + pageId + '/feed', params)
  return post.id
}

/* No Instagram cada foto vira um container filho e todos entram num container
   do tipo CAROUSEL, que é o que de fato é publicado */
async function publishInstagramCarousel(igUserId, token, urls, caption) {
  const filhos = []
  for (const url of urls) {
    const filho = await graph('/' + igUserId + '/media', {
      image_url: url, is_carousel_item: 'true', access_token: token,
    })
    filhos.push(filho.id)
  }

  const container = await graph('/' + igUserId + '/media', {
    media_type: 'CAROUSEL', children: filhos.join(','), caption, access_token: token,
  })
  await waitForContainer(container.id, token)

  const publicado = await graph('/' + igUserId + '/media_publish', {
    creation_id: container.id, access_token: token,
  })
  return publicado.id
}

/* o link do post só existe depois de publicado; sem ele o histórico ainda serve,
   então uma falha aqui não derruba a publicação */
async function instagramPermalink(mediaId, token) {
  try {
    const data = await graphGet('/' + mediaId, { fields: 'permalink', access_token: token })
    return data.permalink || null
  } catch {
    return null
  }
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

  /* imageUrls e a forma nova (carrossel); imageUrl continua aceito para nao
     quebrar quem chamar a funcao do jeito antigo */
  const { imageUrl, caption, scheduleAt, targets } = body
  const urls = Array.isArray(body.imageUrls) && body.imageUrls.length ? body.imageUrls : imageUrl ? [imageUrl] : []
  if (!urls.length || !caption) return json({ error: 'imageUrl(s) e caption sao obrigatorios' }, 400)
  if (urls.length > MAX_CARROSSEL) {
    return json({ error: 'O carrossel aceita no maximo ' + MAX_CARROSSEL + ' fotos.' }, 400)
  }
  const ehCarrossel = urls.length > 1

  const wantFacebook = !targets || targets.facebook !== false
  const pediuInstagram = !targets || targets.instagram !== false
  const wantInstagram = pediuInstagram && Boolean(igUserId)

  const results = []
  const errors = []
  /* ids do que saiu no ar: sem eles o painel nao teria como excluir depois */
  const published = []

  /* sem o META_IG_USER_ID nao da para publicar no Instagram; avisa em vez de
     ignorar em silencio, senao parece que o post saiu nas duas redes */
  if (pediuInstagram && !igUserId) {
    errors.push('Instagram: ainda não configurado (falta META_IG_USER_ID).')
  }

  if (wantFacebook) {
    try {
      let agendamento = null
      if (scheduleAt) {
        const when = Math.floor(new Date(scheduleAt).getTime() / 1000)
        if (isNaN(when)) throw new Error('Data de agendamento invalida.')
        const delta = when - Math.floor(Date.now() / 1000)
        if (delta < FB_MIN_SCHEDULE_S) throw new Error('O Facebook exige agendar com pelo menos 10 minutos de antecedencia.')
        if (delta > FB_MAX_SCHEDULE_S) throw new Error('O Facebook aceita agendamento de no maximo 75 dias.')
        agendamento = when
      }

      let postId
      if (ehCarrossel) {
        postId = await publishFacebookCarousel(pageId, token, urls, caption, agendamento)
      } else {
        const params = { url: urls[0], caption, access_token: token }
        if (agendamento) {
          params.published = 'false'
          params.scheduled_publish_time = String(agendamento)
        }
        const foto = await graph('/' + pageId + '/photos', params)
        postId = foto.post_id || foto.id
      }

      results.push(scheduleAt ? 'Facebook: agendado' : 'Facebook: publicado')
      published.push({
        network: 'facebook',
        id: postId,
        permalink: 'https://www.facebook.com/' + postId,
        scheduled: Boolean(scheduleAt),
      })
    } catch (e) {
      errors.push('Facebook: ' + e.message)
    }
  }

  if (wantInstagram) {
    try {
      let mediaId
      if (ehCarrossel) {
        mediaId = await publishInstagramCarousel(igUserId, token, urls, caption)
      } else {
        const media = await graph('/' + igUserId + '/media', { image_url: urls[0], caption, access_token: token })
        await waitForContainer(media.id, token)
        const publicado = await graph('/' + igUserId + '/media_publish', { creation_id: media.id, access_token: token })
        mediaId = publicado.id
      }

      results.push('Instagram: publicado')
      published.push({
        network: 'instagram',
        id: mediaId,
        permalink: await instagramPermalink(mediaId, token),
        scheduled: false,
      })
    } catch (e) {
      errors.push('Instagram: ' + e.message)
    }
  }

  if (!results.length) return json({ error: errors.join(' · ') || 'nada foi publicado' }, 502)
  return json({ results, errors, published })
}
