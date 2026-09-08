// Google Analytics 4 (gtag.js).
//
// O site e uma SPA: o gtag so dispararia page_view no carregamento inicial,
// entao configuramos com send_page_view:false e enviamos o evento a cada
// troca de rota (ver components/RouteAnalytics.jsx).
//
// O ID segue o mesmo padrao do firebase.js: variavel de ambiente com fallback
// fixo, porque o .env nao vai para o git e o build do Cloudflare Pages so
// enxerga as variaveis configuradas la.
const MEASUREMENT_ID =
  import.meta.env.VITE_GA_MEASUREMENT_ID ||
  import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ||
  'G-7QNGG16XY0'

let iniciado = false

export function initAnalytics() {
  if (iniciado || !MEASUREMENT_ID || typeof window === 'undefined') return
  iniciado = true

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }

  window.gtag('js', new Date())
  window.gtag('config', MEASUREMENT_ID, { send_page_view: false })
}

export function trackPageView(path) {
  if (!iniciado || typeof window.gtag !== 'function') return

  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  })
}
