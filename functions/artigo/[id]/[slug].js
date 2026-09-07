/* Mesma logica de functions/artigo/[id].js, para a URL nova com slug
   (/artigo/:id/:slug) — o slug em si nao e usado, so o id importa. */

import { isBot, fetchArticle, renderArticleHtml } from '../../_lib/seo.js'

export async function onRequestGet(context) {
  const { request, params, next } = context

  if (!isBot(request)) return next()

  const article = await fetchArticle(params.id)
  if (!article) return next()

  return new Response(renderArticleHtml(article), {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=300',
    },
  })
}
