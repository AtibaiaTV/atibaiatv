import { useState } from 'react'
import { CATEGORIES } from '../data'
import useArticles from '../hooks/useArticles'
import NewsCard from '../components/NewsCard'

export default function NewsFeed() {
  const [active, setActive] = useState('Todos')
  const { articles, loading } = useArticles()
  const filtered = active === 'Todos' ? articles : articles.filter(n => n.category === active)
  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#4a6fa5', whiteSpace: 'nowrap' }}>
          Ultimas noticias
        </span>
        <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActive(cat)} style={{
            padding: '5px 14px', borderRadius: 20, fontSize: '0.77rem', fontWeight: 500,
            cursor: 'pointer', border: '1px solid',
            borderColor: active === cat ? '#4a6fa5' : '#e5e7eb',
            background: active === cat ? '#4a6fa5' : '#fff',
            color: active === cat ? '#fff' : '#6b7280', transition: 'all .2s',
          }}>{cat}</button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Carregando...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Nenhuma noticia nessa categoria.</div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: rest.length > 0 ? '2fr 1fr' : '1fr',
          gap: '1px', background: '#e5e7eb',
          border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden',
        }}>
          <div style={{ gridRow: rest.length > 0 ? 'span 2' : 'auto' }}>
            <NewsCard news={featured} featured={true} />
          </div>
          {rest.slice(0, 4).map(n => <NewsCard key={n.id} news={n} />)}
        </div>
      )}
    </section>
  )
}
