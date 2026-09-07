/* transforma um titulo de materia num slug de URL amigavel pro SEO —
   usado so pra compor /artigo/:id/:slug; o id continua sendo a chave real,
   entao o slug nao precisa ser unico nem estavel */
export default function slugify(text) {
  var base = (text || '').toString().trim().toLowerCase()
  if (!base) return ''
  var full = base
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  if (full.length <= 80) return full
  /* corta no ultimo hifen dentro do limite, pra nao terminar no meio de uma
     palavra (ex.: "...prevencao-e-servic" viraria "...prevencao-e") */
  var cut = full.slice(0, 80)
  var lastDash = cut.lastIndexOf('-')
  return (lastDash > 0 ? cut.slice(0, lastDash) : cut)
}

/* URL de uma materia com o slug do titulo; a rota antiga sem slug
   (/artigo/:id) continua funcionando, o slug e so cosmetico */
export function articleUrl(news) {
  var slug = slugify(news && news.title)
  return '/artigo/' + news.id + (slug ? '/' + slug : '')
}
