import { useState, useEffect } from 'react'
import { collection, getDocs, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

const DIA_MS = 86400000
const ONLINE_MS = 3 * 60000  // considera online quem deu sinal nos últimos 3 min

function dataISO(d) {
  return d.toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' })
}

export function diasAtras(n) {
  return dataISO(new Date(Date.now() - n * DIA_MS))
}

/* ─── Mais lidas de um período ────────────────────────────────────────────────
   Soma os contadores diários por matéria. Devolve um mapa id → acessos.        */
export function useMaisLidas(dias = 7) {
  const [ranking, setRanking] = useState({})
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'pageViewsDaily'), where('data', '>=', diasAtras(dias - 1)))
    getDocs(q)
      .then(snap => {
        const soma = {}
        snap.forEach(d => {
          const v = d.data()
          if (!v.pageId) return
          soma[v.pageId] = (soma[v.pageId] || 0) + (v.count || 0)
        })
        setRanking(soma)
      })
      .catch(() => {})
      .finally(() => setCarregando(false))
  }, [dias])

  return { ranking, carregando }
}

/* ─── Total acumulado por página ──────────────────────────────────────────── */
export function useAcessosPorPagina() {
  const [acessos, setAcessos] = useState({})
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    getDocs(collection(db, 'pageViews'))
      .then(snap => {
        const m = {}
        snap.forEach(d => { m[d.id] = d.data().count || 0 })
        setAcessos(m)
      })
      .catch(() => {})
      .finally(() => setCarregando(false))
  }, [])

  return { acessos, carregando }
}

/* ─── Visitantes por dia, mês, ano e histórico ────────────────────────────── */
export function useVisitantes() {
  const [dados, setDados] = useState({ hoje: 0, mes: 0, ano: 0, total: 0, serie: [], desde: null })

  useEffect(() => {
    getDocs(collection(db, 'siteDaily')).then(snap => {
      const dias = []
      snap.forEach(d => {
        const v = d.data()
        if (v.data) dias.push({ data: v.data, visitas: v.visitas || 0 })
      })
      dias.sort((a, b) => (a.data < b.data ? -1 : 1))

      const h = dataISO(new Date())
      const mesAtual = h.slice(0, 7)
      const anoAtual = h.slice(0, 4)

      setDados({
        hoje: dias.filter(d => d.data === h).reduce((s, d) => s + d.visitas, 0),
        mes: dias.filter(d => d.data.startsWith(mesAtual)).reduce((s, d) => s + d.visitas, 0),
        ano: dias.filter(d => d.data.startsWith(anoAtual)).reduce((s, d) => s + d.visitas, 0),
        total: dias.reduce((s, d) => s + d.visitas, 0),
        serie: dias.slice(-30),
        desde: dias.length ? dias[0].data : null,
      })
    }).catch(() => {})
  }, [])

  return dados
}

/* ─── Quantos estão online agora ──────────────────────────────────────────── */
export function useOnline() {
  const [online, setOnline] = useState(0)

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'presence'), snap => {
      const limite = Date.now() - ONLINE_MS
      let n = 0
      snap.forEach(d => {
        const ts = d.data().lastSeen
        if (ts && ts.toMillis && ts.toMillis() >= limite) n++
      })
      setOnline(n)
    }, () => {})
    return unsub
  }, [])

  return online
}

/* ─── Cidades de onde vêm os acessos ──────────────────────────────────────── */
export function useCidades() {
  const [cidades, setCidades] = useState([])

  useEffect(() => {
    getDocs(collection(db, 'geoCities')).then(snap => {
      const lista = []
      snap.forEach(d => lista.push({ id: d.id, ...d.data() }))
      lista.sort((a, b) => (b.count || 0) - (a.count || 0))
      setCidades(lista)
    }).catch(() => {})
  }, [])

  return cidades
}
