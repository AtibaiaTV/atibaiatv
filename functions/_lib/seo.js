/* Logica compartilhada entre as Functions de /artigo (bot prerender) e o
   sitemap.xml. Fica com "_" na frente pra o Cloudflare Pages NAO tratar como
   rota — so um modulo importavel pelas outras functions. */

export const PROJECT_ID = 'site-atibaiatv'
export const SITE_URL = 'https://www.atibaiatv.com.br'

/* so os bots que realmente montam preview a partir do HTML cru; Googlebot e
   bingbot entram tambem por seguranca — nao muda nada pra eles, mas garante
   que a meta certa chegue mesmo se o crawl acontecer antes do JS rodar */
const BOT_UA = /facebookexternalhit|Facebot|WhatsApp|Twitterbot|LinkedInBot|Slackbot|TelegramBot|Discordbot|SkypeUriPreview|Pinterest|redditbot|Googlebot|bingbot|Applebot/i

export function isBot(request) {
  return BOT_UA.test(request.headers.get('user-agent') || '')
}

/* mesma regra usada em src/utils/slugify.js — duplicada aqui porque as
   functions nao importam de src/ */
export function slugify(text) {
  const base = (text || '').toString().trim().toLowerCase()
  if (!base) return ''
  const full = base
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  if (full.length <= 80) return full
  /* corta no ultimo hifen dentro do limite, pra nao terminar no meio de uma
     palavra (ex.: "...prevencao-e-servic" viraria "...prevencao-e") */
  const cut = full.slice(0, 80)
  const lastDash = cut.lastIndexOf('-')
  return lastDash > 0 ? cut.slice(0, lastDash) : cut
}

export function articlePath(article) {
  const slug = slugify(article.title)
  return '/artigo/' + article.id + (slug ? '/' + slug : '')
}

function fieldValue(f) {
  if (!f) return undefined
  if ('stringValue' in f) return f.stringValue
  if ('timestampValue' in f) return f.timestampValue
  if ('integerValue' in f) return Number(f.integerValue)
  if ('doubleValue' in f) return f.doubleValue
  if ('booleanValue' in f) return f.booleanValue
  return undefined
}

function parseDoc(doc) {
  const out = {}
  for (const key in doc.fields || {}) out[key] = fieldValue(doc.fields[key])
  return out
}

/* remove os intertitulos "## " e corta num tamanho bom pra meta description —
   mesma regra usada em ArticlePage.jsx */
function excerptFromBody(body, max = 160) {
  const text = (body || '').replace(/^\s*##\s+/gm, '').replace(/\s+/g, ' ').trim()
  if (text.length <= max) return text
  return text.slice(0, max - 1).replace(/\s+\S*$/, '') + '…'
}

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function fetchArticle(id) {
  const url = 'https://firestore.googleapis.com/v1/projects/' + PROJECT_ID + '/databases/(default)/documents/articles/' + id
  const res = await fetch(url)
  if (!res.ok) return null
  const doc = await res.json()
  if (!doc.fields) return null
  return { id, ...parseDoc(doc) }
}

export function renderArticleHtml(article) {
  const title = article.title + ' - Atibaia TV'
  const description = article.subtitle || excerptFromBody(article.body) ||
    'A TV da sua cidade. Noticias, cultura, eventos e esportes de Atibaia e regiao.'
  const canonicalUrl = SITE_URL + articlePath(article)
  const imageUrl = article.thumbnailUrl || SITE_URL + '/logo.png'
  const publishedIso = article.publishedAt || article.createdAt || null
  const modifiedIso = article.updatedAt || publishedIso

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description,
    image: [imageUrl],
    datePublished: publishedIso || undefined,
    dateModified: modifiedIso || undefined,
    author: { '@type': 'Person', name: article.author || 'Redacao Atibaia TV' },
    publisher: {
      '@type': 'Organization',
      name: 'Atibaia TV',
      logo: { '@type': 'ImageObject', url: SITE_URL + '/logos/logo-icon.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    articleSection: article.category,
  }
  /* "</" quebraria a tag <script> se aparecesse dentro do corpo da materia */
  const jsonLdSafe = JSON.stringify(jsonLd).replace(/</g, '\\u003c')

  return '<!DOCTYPE html>\n' +
    '<html lang="pt-BR">\n' +
    '<head>\n' +
    '<meta charset="UTF-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
    '<title>' + escapeHtml(title) + '</title>\n' +
    '<meta name="description" content="' + escapeHtml(description) + '">\n' +
    '<link rel="canonical" href="' + escapeHtml(canonicalUrl) + '">\n' +
    '<meta property="og:title" content="' + escapeHtml(article.title) + '">\n' +
    '<meta property="og:description" content="' + escapeHtml(description) + '">\n' +
    '<meta property="og:type" content="article">\n' +
    '<meta property="og:url" content="' + escapeHtml(canonicalUrl) + '">\n' +
    '<meta property="og:image" content="' + escapeHtml(imageUrl) + '">\n' +
    '<meta property="og:site_name" content="Atibaia TV">\n' +
    '<meta name="twitter:card" content="summary_large_image">\n' +
    '<meta name="twitter:title" content="' + escapeHtml(article.title) + '">\n' +
    '<meta name="twitter:description" content="' + escapeHtml(description) + '">\n' +
    '<meta name="twitter:image" content="' + escapeHtml(imageUrl) + '">\n' +
    '<script type="application/ld+json">' + jsonLdSafe + '</script>\n' +
    '</head>\n' +
    '<body>\n' +
    '<h1>' + escapeHtml(article.title) + '</h1>\n' +
    '<p>' + escapeHtml(description) + '</p>\n' +
    '</body>\n' +
    '</html>\n'
}
