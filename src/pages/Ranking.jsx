import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { getNivelParticipacao } from '../data'
import { trackPageView } from '../hooks/usePageViews'

var MEDALHAS = ['🥇', '🥈', '🥉']

export default function Ranking() {
  var listState = useState([])
  var list = listState[0]
  var setList = listState[1]
  var loadingState = useState(true)
  var loading = loadingState[0]
  var setLoading = loadingState[1]

  useEffect(function() { trackPageView('ranking') }, [])

  useEffect(function() {
    var q = query(collection(db, 'participantes'), orderBy('totalPoints', 'desc'), limit(30))
    var unsub = onSnapshot(q, function(snap) {
      setList(snap.docs.map(function(d) { return Object.assign({ id: d.id }, d.data()) }))
      setLoading(false)
    }, function() { setLoading(false) })
    return unsub
  }, [])

  return (
    <div className="atv-container" style={{ padding: '2.5rem 1rem 3.5rem', maxWidth: 680, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🏆</div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>Ranking da comunidade</h1>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: 480, margin: '0 auto' }}>
          Quem mais ajuda a cuidar de Atibaia enviando fotos, vídeos e denúncias de problemas na cidade.
        </p>
        <Link to="/participe" style={{
          display: 'inline-block', marginTop: 16, padding: '10px 22px', borderRadius: 8,
          background: '#Cd0000', color: '#fff', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none',
        }}>Quero participar</Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Carregando ranking...</div>
      ) : list.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
          Ninguém pontuou ainda. Seja o primeiro a participar!
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
          {list.map(function(p, i) {
            var nivel = getNivelParticipacao(p.totalPoints || 0)
            return (
              <div key={p.id} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '0.9rem 1.25rem',
                borderBottom: i < list.length - 1 ? '1px solid #f3f4f6' : 'none',
                background: i < 3 ? '#fffbeb' : '#fff',
              }}>
                <span style={{ width: 32, textAlign: 'center', fontSize: i < 3 ? '1.3rem' : '1rem', fontWeight: 800, color: i < 3 ? undefined : '#d1d5db', flexShrink: 0 }}>
                  {i < 3 ? MEDALHAS[i] : i + 1}
                </span>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: nivel.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                  {nivel.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: '#1a1a2e', fontSize: '0.92rem' }}>{p.displayName || 'Anônimo'}</div>
                  <div style={{ fontSize: '0.72rem', color: nivel.color, fontWeight: 600 }}>{nivel.label} · {p.totalEnvios || 0} envio{(p.totalEnvios || 0) === 1 ? '' : 's'}</div>
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1a1a2e', flexShrink: 0 }}>{p.totalPoints || 0}<span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#9ca3af' }}> pts</span></div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
