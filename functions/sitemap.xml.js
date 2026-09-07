/* Gera o sitemap.xml na hora, listando as materias direto do Firestore.
   Sem isso o Google so acha paginas de artigo seguindo links internos, o que
   atrasa a indexacao de noticias novas — aqui o mapa fica sempre atualizado. */

import { PROJECT_ID, SITE_URL, articlePath } from './_lib/seo.js'

const STATIC_PATHS = [
  '/', '/noticias', '/cultura', '/eventos', '/esportes',
  '/economia', '/mobilidade', '/seguranca', '/politica', '/videos',
]

async function fetchArticles() {
  const docs = []
  let pageToken = ''
  do {
    const url = new URL('https://firestore.googleapis.com/v1/projects/' + PROJECT_ID + '/databases/(default)/documents/articles')
    url.searchParams.set('pageSize', '300')
    if (pageToken) url.searchParams.set('pageToken', pageToken)
    const res = await fetch(url.toString())
    if (!res.ok) break
    const data = await res.json()
    ;(data.documents || []).forEach(doc => {
      docs.push({
        id: doc.name.split('/').pop(),
        title: doc.fields && doc.fields.title && doc.fields.title.stringValue,
        updateTime: doc.updateTime,
      })
    })
    pageToken = data.nextPageToken || ''
  } while (pageToken)
  return docs
}

function xmlEscape(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function urlEntry(loc, lastmod) {
  return '  <url>\n' +
    '    <loc>' + xmlEscape(loc) + '</loc>\n' +
    (lastmod ? '    <lastmod>' + lastmod.slice(0, 10) + '</lastmod>\n' : '') +
    '  </url>'
}

export async function onRequestGet() {
  let articles = []
  try {
    articles = await fetchArticles()
  } catch {
    /* se o Firestore falhar, ainda entrega o sitemap so com as paginas fixas
       em vez de derrubar a rota inteira */
  }

  const entries = [
    ...STATIC_PATHS.map(p => urlEntry(SITE_URL + p, null)),
    ...articles.map(a => urlEntry(SITE_URL + articlePath(a), a.updateTime)),
  ]

  const body = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries.join('\n') +
    '\n</urlset>\n'

  return new Response(body, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  })
}
