/* Soma as visualizacoes historicas das publicacoes no Facebook e no Instagram.

   Por que somar post a post em vez de pedir o total da conta: as insights de
   CONTA na Meta so guardam cerca de 2 anos, e no Instagram so existem a partir
   da conversao para conta profissional. Ja as insights de cada PUBLICACAO sao
   vitalicias — nao expiram. Entao paginar tudo o que ja foi publicado e somar e
   a unica forma de chegar perto de um historico completo pela API.

   O numero que sai daqui e "soma das visualizacoes das publicacoes", e nao o
   total oficial que o painel da Meta mostra: stories ficam de fora (expiram em
   24h) e posts anteriores a conta profissional nao tem metrica. Quem for usar
   isso em proposta ou prestacao de contas precisa rotular assim.

   Roda no servidor pelo mesmo motivo do social-publish: o token de pagina fica
   nas variaveis do Cloudflare Pages e nunca chega ao navegador.

   Variaveis (as mesmas do social-publish):
     META_ACCESS_TOKEN      token de pagina de longa duracao
     META_PAGE_ID           ID da pagina do Facebook
     META_IG_USER_ID        ID da conta profissional do Instagram
     FIREBASE_API_KEY       chave web do Firebase (valida o login de quem chamou)
     SOCIAL_ALLOWED_EMAILS  e-mails autorizados, separados por virgula

   Escopos necessarios no token, alem dos que o social-publish ja usa:
     read_insights                 (metricas da pagina do Facebook)
     instagram_manage_insights     (metricas do Instagram)
   Se faltarem, o modo "diagnostico" devolve o erro da Meta dizendo qual e.
*/

const GRAPH = 'https://graph.facebook.com/v26.0'
/* 50 e o teto que a Meta aceita por pagina na borda /media; pedir mais so
   devolve 50 mesmo */
const POR_PAGINA = 50
/* teto de paginas por chamada. A funcao devolve um cursor para continuar de
   onde parou, em vez de tentar varrer anos de historico numa requisicao so e
   estourar o tempo da borda */
const MAX_PAGINAS_PADRAO = 15
const MAX_PAGINAS_TETO = 40

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

/* mesma checagem do social-publish: sem ela a URL da funcao exporia as metricas
   das contas oficiais para qualquer pessoa */
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
    return { ok: false, msg: 'Sua conta nao tem permissao para ler as metricas das redes.' }
  }
  return { ok: true, email }
}

/* devolve { data } ou { erro } em vez de lancar: no diagnostico a mensagem da
   Meta e justamente o que interessa ver */
async function graphGet(path, params) {
  const res = await fetch(GRAPH + path + '?' + new URLSearchParams(params))
  const data = await res.json()
  if (data.error) return { erro: data.error.error_user_msg || data.error.message }
  return { data }
}

/* le o valor de uma metrica vinda por expansao de campo. A Meta devolve o node
   sem a chave "insights" quando nao consegue calcular aquela publicacao, entao
   ausencia aqui significa "sem dado", nao zero */
function valorInsight(node) {
  const serie = node.insights && node.insights.data && node.insights.data[0]
  if (!serie || !serie.values || !serie.values[0]) return null
  const v = serie.values[0].value
  return typeof v === 'number' ? v : null
}

function acumular(resumo, quando, valor, chave) {
  if (quando) {
    if (!resumo.maisAntigo || quando < resumo.maisAntigo) resumo.maisAntigo = quando
    if (!resumo.maisRecente || quando > resumo.maisRecente) resumo.maisRecente = quando
  }
  resumo.publicacoes += 1
  resumo.porTipo[chave] = (resumo.porTipo[chave] || 0) + 1
  if (valor === null) resumo.semMetrica += 1
  else resumo.total += valor
}

/* Instagram: /media traz as publicacoes do feed (posts, reels, carrosseis).
   "views" e a metrica unificada atual; contas ou midias antigas ainda podem so
   responder a "impressions", por isso a segunda tentativa. */
async function coletarInstagram(igUserId, token, cursor, maxPaginas) {
  const resumo = {
    rede: 'instagram', metrica: 'views', total: 0, publicacoes: 0,
    semMetrica: 0, porTipo: {}, maisAntigo: null, maisRecente: null,
  }
  let metrica = 'views'
  let after = cursor || null
  let paginas = 0

  while (paginas < maxPaginas) {
    const params = {
      fields: 'id,timestamp,media_type,media_product_type,insights.metric(' + metrica + ')',
      limit: String(POR_PAGINA),
      access_token: token,
    }
    if (after) params.after = after

    let { data, erro } = await graphGet('/' + igUserId + '/media', params)

    /* se a conta nao responde a "views", cai para "impressions" uma unica vez e
       registra qual metrica acabou valendo */
    if (erro && metrica === 'views' && /views|metric/i.test(erro)) {
      metrica = 'impressions'
      resumo.metrica = metrica
      continue
    }
    if (erro) return { erro, parcial: resumo }

    const itens = data.data || []
    for (const m of itens) {
      acumular(resumo, m.timestamp, valorInsight(m), m.media_product_type || m.media_type || 'OUTRO')
    }

    paginas += 1
    after = data.paging && data.paging.cursors && data.paging.next
      ? data.paging.cursors.after
      : null
    if (!after || !itens.length) break
  }

  return { resumo, proximoCursor: after, parcial: Boolean(after) }
}

/* Facebook: /posts cobre o feed da pagina. post_impressions e o mais proximo de
   "visualizacoes" disponivel por post; para video existe total_video_views, que
   contamos em separado para nao misturar criterios numa soma so. */
async function coletarFacebook(pageId, token, cursor, maxPaginas) {
  const resumo = {
    rede: 'facebook', metrica: 'post_impressions', total: 0, publicacoes: 0,
    semMetrica: 0, porTipo: {}, maisAntigo: null, maisRecente: null,
  }
  let after = cursor || null
  let paginas = 0

  while (paginas < maxPaginas) {
    const params = {
      fields: 'id,created_time,status_type,insights.metric(post_impressions)',
      limit: String(POR_PAGINA),
      access_token: token,
    }
    if (after) params.after = after

    const { data, erro } = await graphGet('/' + pageId + '/posts', params)
    if (erro) return { erro, parcial: resumo }

    const itens = data.data || []
    for (const p of itens) {
      acumular(resumo, p.created_time, valorInsight(p), p.status_type || 'OUTRO')
    }

    paginas += 1
    after = data.paging && data.paging.cursors && data.paging.next
      ? data.paging.cursors.after
      : null
    if (!after || !itens.length) break
  }

  return { resumo, proximoCursor: after, parcial: Boolean(after) }
}

/* confere o que o token enxerga hoje: nome da pagina, usuario do Instagram e se
   as chamadas de insights passam. Serve para descobrir se faltam escopos antes
   de disparar a varredura inteira */
async function diagnostico(env) {
  const token = env.META_ACCESS_TOKEN
  const pageId = env.META_PAGE_ID
  const igUserId = env.META_IG_USER_ID
  const out = { pagina: null, instagram: null, insightsFacebook: null, insightsInstagram: null }

  if (pageId) {
    const r = await graphGet('/' + pageId, { fields: 'name,fan_count', access_token: token })
    out.pagina = r.erro ? { erro: r.erro } : r.data

    const i = await graphGet('/' + pageId + '/posts', {
      fields: 'id,insights.metric(post_impressions)', limit: '1', access_token: token,
    })
    out.insightsFacebook = i.erro ? { ok: false, erro: i.erro } : { ok: true }
  }

  if (igUserId) {
    const r = await graphGet('/' + igUserId, { fields: 'username,media_count,followers_count', access_token: token })
    out.instagram = r.erro ? { erro: r.erro } : r.data

    const i = await graphGet('/' + igUserId + '/media', {
      fields: 'id,insights.metric(views)', limit: '1', access_token: token,
    })
    out.insightsInstagram = i.erro ? { ok: false, erro: i.erro } : { ok: true }
  }

  return out
}

export async function onRequestPost(context) {
  const { request, env } = context

  let corpo
  try {
    corpo = await request.json()
  } catch {
    return json({ error: 'corpo invalido' }, 400)
  }

  const auth = await authorize(corpo.idToken, env)
  if (!auth.ok) return json({ error: auth.msg }, 401)

  const token = env.META_ACCESS_TOKEN
  if (!token) return json({ error: 'META_ACCESS_TOKEN nao configurada no Cloudflare' }, 500)

  const modo = corpo.modo || 'diagnostico'

  if (modo === 'diagnostico') {
    return json({ modo, ...(await diagnostico(env)) })
  }

  if (modo !== 'publicacoes') return json({ error: 'modo deve ser diagnostico ou publicacoes' }, 400)

  const maxPaginas = Math.min(Number(corpo.maxPaginas) || MAX_PAGINAS_PADRAO, MAX_PAGINAS_TETO)
  const rede = corpo.rede

  let r
  if (rede === 'instagram') {
    const igUserId = env.META_IG_USER_ID
    if (!igUserId) return json({ error: 'META_IG_USER_ID nao configurada no Cloudflare' }, 500)
    r = await coletarInstagram(igUserId, token, corpo.cursor, maxPaginas)
  } else if (rede === 'facebook') {
    const pageId = env.META_PAGE_ID
    if (!pageId) return json({ error: 'META_PAGE_ID nao configurada no Cloudflare' }, 500)
    r = await coletarFacebook(pageId, token, corpo.cursor, maxPaginas)
  } else {
    return json({ error: 'rede deve ser instagram ou facebook' }, 400)
  }

  if (r.erro) return json({ error: r.erro, parcial: r.parcial }, 422)

  return json({
    modo,
    rede,
    ...r.resumo,
    proximoCursor: r.proximoCursor,
    parcial: r.parcial,
    /* deixa explicito no proprio retorno o que o numero e e o que ele nao e */
    observacao: 'Soma das visualizacoes por publicacao. Nao inclui stories nem'
      + ' publicacoes anteriores a conta profissional. Nao equivale ao total'
      + ' exibido no painel da Meta.',
  })
}
