import { useState, useEffect } from 'react'
import { doc, setDoc, onSnapshot, increment, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

/* ─── Coleções usadas ─────────────────────────────────────────────────────────
   pageViews/{pageId}                 total acumulado por página (já existia)
   pageViewsDaily/{pageId}__{data}    total por página e por dia — base do "mais
                                      lidas dos últimos 7 dias"
   siteDaily/{data}                   visitas do site inteiro por dia
   presence/{sessao}                  batimento de quem está online agora
   geoCities/{chave}                  acessos por cidade, para o mapa

   Nada aqui identifica pessoas: guardamos contadores e cidade, nunca o IP.     */

function hoje() {
  // data local de São Paulo, para o "dia" bater com o dia da redação
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' })
}

function idSessao() {
  let s = sessionStorage.getItem('sid')
  if (!s) {
    s = Math.random().toString(36).slice(2) + Date.now().toString(36)
    sessionStorage.setItem('sid', s)
  }
  return s
}

const gravar = (caminho, dados) =>
  setDoc(doc(db, ...caminho), dados, { merge: true }).catch(() => {})

/* ─── Visualização de página ──────────────────────────────────────────────── */

export function trackPageView(pageId) {
  const chave = 'pv_' + pageId
  if (sessionStorage.getItem(chave)) return
  sessionStorage.setItem(chave, '1')

  gravar(['pageViews', pageId], { count: increment(1), lastUpdated: serverTimestamp() })
  gravar(['pageViewsDaily', pageId + '__' + hoje()], {
    pageId, data: hoje(), count: increment(1),
  })
}

export function usePageViewCount(pageId) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!pageId) return
    const unsub = onSnapshot(doc(db, 'pageViews', pageId), (snap) => {
      if (snap.exists()) setCount(snap.data().count || 0)
    })
    return unsub
  }, [pageId])

  return count
}

/* ─── Visita ao site e localização ────────────────────────────────────────── */

export function trackVisit() {
  if (sessionStorage.getItem('visita')) return
  sessionStorage.setItem('visita', '1')

  gravar(['siteDaily', hoje()], { data: hoje(), visitas: increment(1) })

  /* a localização vem da borda do Cloudflare; se a função não responder, a
     visita continua contabilizada, só não entra no mapa */
  fetch('/api/geo')
    .then(r => (r.ok ? r.json() : null))
    .then(g => {
      if (!g || !g.cidade) return
      const chave = [g.pais, g.estado, g.cidade].join('-').replace(/[^\w-]/g, '_')
      gravar(['geoCities', chave], {
        pais: g.pais, estado: g.estado, cidade: g.cidade,
        lat: g.lat, lon: g.lon, count: increment(1),
      })
    })
    .catch(() => {})
}

/* ─── Quem está online agora ──────────────────────────────────────────────── */

const BATIMENTO_MS = 60000

/* mantém um documento por aba aberta, atualizado de minuto em minuto. Quem
   fechou o navegador simplesmente para de atualizar, e some da contagem. */
export function useMarcarPresenca() {
  useEffect(() => {
    const sessao = idSessao()
    const bater = () => {
      if (document.visibilityState === 'hidden') return
      /* expiresAt permite ligar uma política de TTL no Firestore e deixar o
         próprio banco apagar os registros velhos, senão eles se acumulariam */
      gravar(['presence', sessao], {
        lastSeen: serverTimestamp(),
        expiresAt: new Date(Date.now() + 10 * 60000),
      })
    }
    bater()
    const t = setInterval(bater, BATIMENTO_MS)
    return () => clearInterval(t)
  }, [])
}
