/* Serve HTML pre-renderizado, so com as meta tags, para bots de preview de link
   (WhatsApp, Facebook, Twitter...) — eles nao executam JavaScript, entao sem
   isso sempre veriam o titulo/imagem genericos do site em vez dos da materia,
   mesmo com o Helmet certo no React (ArticlePage.jsx).

   Cobre a URL antiga sem slug (/artigo/:id) — continua funcionando pros links
   ja compartilhados/indexados; o canonical dentro do HTML aponta pra versao
   com slug. Visitantes normais (e o Googlebot, que renderiza JS) passam
   direto: next() deixa a rota cair no fallback de sempre (SPA). */

import { isBot, fetchArticle, renderArticleHtml } from '../_lib/seo.js'

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
