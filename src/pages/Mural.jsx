import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { DENUNCIA_CATEGORIAS } from '../data'
import { trackPageView } from '../hooks/usePageViews'

function categoriaInfo(value) {
  return DENUNCIA_CATEGORIAS.find(function(c) { return c.value === value }) || { label: value || 'Outro', icon: '📌', color: '#6b7280' }
}

function formatDate(value) {
  if (!value || !value.toDate) return ''
  return value.toDate().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

export default function Mural() {
  var itemsState = useState([])
  var items = itemsState[0]
  var setItems = itemsState[1]
  var loadingState = useState(true)
  var loading = loadingState[0]
  var setLoading = loadingState[1]

  useEffect(function() { trackPageView('mural') }, [])

  useEffect(function() {
    var q = query(collection(db, 'denuncias_publicas'), orderBy('createdAt', 'desc'))
    var unsub = onSnapshot(q, function(snap) {
      /* trava extra: nunca exibe categorias sensiveis no mural, mesmo que tenham
         sido publicadas por engano */
      var docs = snap.docs
        .map(function(d) { return Object.assign({ id: d.id }, d.data()) })
        .filter(function(item) { return !categoriaInfo(item.category).sensivel })
      setItems(docs)
      setLoading(false)
    }, function() { setLoading(false) })
    return unsub
  }, [])

  return (
    <div className="atv-container" style={{ padding: '2.5rem 1rem 3.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: 32, maxWidth: 620, margin: '0 auto 32px' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🖼️</div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>Mural da cidade</h1>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6 }}>
          Fotos e vídeos enviados pela comunidade e aprovados pela nossa equipe — problemas reais de Atibaia, mostrados por quem vive na cidade.
        </p>
        <Link to="/participe" style={{
          display: 'inline-block', marginTop: 16, padding: '10px 22px', borderRadius: 8,
          background: '#Cd0000', color: '#fff', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none',
        }}>📮 Enviar a minha</Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Carregando...</div>
      ) : items.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '3rem', textAlign: 'center', color: '#9ca3af', maxWidth: 620, margin: '0 auto' }}>
          Nenhuma publicação no mural ainda. Assim que a equipe aprovar as primeiras denúncias, elas aparecem aqui.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem', maxWidth: 1100, margin: '0 auto' }}>
          {items.map(function(item) {
            var cat = categoriaInfo(item.category)
            var isVideo = item.mediaUrl && /\.(mp4|webm|mov|m4v)$/i.test(item.mediaUrl)
            return (
              <div key={item.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ width: '100%', aspectRatio: '4/3', background: '#111', position: 'relative' }}>
                  {item.mediaUrl ? (
                    isVideo ? (
                      <video src={item.mediaUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} controls />
                    ) : (
                      <img src={item.mediaUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: cat.color + '22' }}>
                      <span style={{ fontSize: '2.5rem' }}>{cat.icon}</span>
                    </div>
                  )}
                  <span style={{
                    position: 'absolute', top: 10, left: 10, fontSize: '0.66rem', fontWeight: 700,
                    background: '#fff', color: cat.color, padding: '4px 10px', borderRadius: 20,
                  }}>{cat.icon} {cat.label}</span>
                  {item.status === 'resolvido' && (
                    <span style={{
                      position: 'absolute', top: 10, right: 10, fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.04em',
                      background: '#059669', color: '#fff', padding: '4px 10px', borderRadius: 20,
                    }}>✔ RESOLVIDO</span>
                  )}
                </div>
                <div style={{ padding: '0.9rem 1rem' }}>
                  <p style={{ fontSize: '0.84rem', color: '#374151', lineHeight: 1.5, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: '#9ca3af' }}>
                    {item.location && <span>📍 {item.location}</span>}
                    <span style={{ marginLeft: 'auto' }}>{formatDate(item.createdAt)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
