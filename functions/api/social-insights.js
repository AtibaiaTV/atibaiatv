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

/* A Meta aposenta e renomeia metrica de post a cada versao da Graph API — na
   v26 "post_impressions" ja responde (#100) The value must be a valid insights
   metric. Em vez de fixar um nome que quebra na proxima virada de versao, a
   funcao testa os candidatos em ordem e fica com o primeiro que a API aceitar,
   e o retorno sempre diz qual metrica acabou valendo. */
const CANDIDATAS = {
  instagram: ['views', 'impressions', 'reach'],
  facebook: ['views', 'post_impressions', 'post_impressions_unique', 'post_video_views'],
}

const BORDA = { instagram: '/media', facebook: '/posts' }

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

/* Testa os candidatos e devolve o primeiro nome que a API aceitar.

   A checagem NAO pode ser feita por expansao de campo (fields=insights.metric):
   quando falta o escopo read_insights a Meta devolve 200 com a lista sem o
   campo insights, em silencio. Isso dava "metrica aceita" e a varredura somava
   zero por milhares de publicacoes sem nenhum aviso.

   Pedindo a borda /insights direto na publicacao o erro vem explicito — (#10)
   ou (#200) para falta de permissao, (#100) para nome de metrica invalido —
   que e o que o diagnostico precisa mostrar. */
async function descobrirMetrica(id, rede, token) {
  const amostra = await graphGet('/' + id + BORDA[rede], { fields: 'id', limit: '1', access_token: token })
  if (amostra.erro) return { erro: amostra.erro, tentativas: {} }

  const primeira = amostra.data && amostra.data.data && amostra.data.data[0]
  if (!primeira) return { erro: 'nenhuma publicacao encontrada para testar', tentativas: {} }

  const tentativas = {}
  for (const metrica of CANDIDATAS[rede]) {
    const r = await graphGet('/' + primeira.id + '/insights', { metric: metrica, access_token: token })
    if (!r.erro && r.data && r.data.data && r.data.data.length) return { metrica, tentativas }
    tentativas[metrica] = r.erro || 'aceita, porem sem valor devolvido'
  }
  return { erro: 'nenhuma metrica aceita', tentativas }
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

/* Instagram traz as publicacoes do feed em /media (posts, reels, carrosseis) e
   o Facebook em /posts. Fora os campos proprios de cada rede, a varredura e a
   mesma: paginar, ler a metrica de cada publicacao e somar. */
const CAMPOS = {
  instagram: 'id,timestamp,media_type,media_product_type',
  facebook: 'id,created_time,status_type',
}

const quando = (rede, node) => (rede === 'instagram' ? node.timestamp : node.created_time)
const tipo = (rede, node) => (rede === 'instagram'
  ? node.media_product_type || node.media_type || 'OUTRO'
  : node.status_type || 'OUTRO')

async function coletar(rede, id, token, cursor, maxPaginas) {
  const achada = await descobrirMetrica(id, rede, token)
  if (achada.erro) return { erro: achada.erro, tentativas: achada.tentativas }

  const resumo = {
    rede, metrica: achada.metrica, total: 0, publicacoes: 0,
    semMetrica: 0, porTipo: {}, maisAntigo: null, maisRecente: null,
  }
  let after = cursor || null
  let paginas = 0

  while (paginas < maxPaginas) {
    const params = {
      fields: CAMPOS[rede] + ',insights.metric(' + achada.metrica + ')',
      limit: String(POR_PAGINA),
      access_token: token,
    }
    if (after) params.after = after

    const { data, erro } = await graphGet('/' + id + BORDA[rede], params)
    if (erro) return { erro, parcial: resumo }

    const itens = data.data || []
    for (const node of itens) {
      acumular(resumo, quando(rede, node), valorInsight(node), tipo(rede, node))
    }

    paginas += 1

    /* se a primeira pagina inteira voltou sem metrica nenhuma, parar aqui: seguir
       adiante so produziria um total zero convincente ao longo de milhares de
       publicacoes. Costuma ser escopo faltando, ja que a Meta omite o campo em
       vez de recusar a chamada */
    if (paginas === 1 && resumo.publicacoes && resumo.semMetrica === resumo.publicacoes) {
      return {
        erro: 'a pagina inteira voltou sem a metrica ' + achada.metrica
          + ' — normalmente falta escopo de insights no token',
        parcial: resumo,
      }
    }

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

    const m = await descobrirMetrica(pageId, 'facebook', token)
    out.insightsFacebook = m.erro
      ? { ok: false, erro: m.erro, tentativas: m.tentativas }
      : { ok: true, metrica: m.metrica }
  }

  if (igUserId) {
    const r = await graphGet('/' + igUserId, { fields: 'username,media_count,followers_count', access_token: token })
    out.instagram = r.erro ? { erro: r.erro } : r.data

    const m = await descobrirMetrica(igUserId, 'instagram', token)
    out.insightsInstagram = m.erro
      ? { ok: false, erro: m.erro, tentativas: m.tentativas }
      : { ok: true, metrica: m.metrica }
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

  const id = rede === 'instagram' ? env.META_IG_USER_ID
    : rede === 'facebook' ? env.META_PAGE_ID
    : null
  if (rede !== 'instagram' && rede !== 'facebook') {
    return json({ error: 'rede deve ser instagram ou facebook' }, 400)
  }
  if (!id) {
    const nome = rede === 'instagram' ? 'META_IG_USER_ID' : 'META_PAGE_ID'
    return json({ error: nome + ' nao configurada no Cloudflare' }, 500)
  }

  const r = await coletar(rede, id, token, corpo.cursor, maxPaginas)
  if (r.erro) return json({ error: r.erro, tentativas: r.tentativas, parcial: r.parcial }, 422)

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
