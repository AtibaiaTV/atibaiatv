import { useState } from 'react'
import { CATEGORIES } from '../data'
import useArticles from '../hooks/useArticles'
import NewsCard from './NewsCard'

export default function NewsFeed() {
  const [active, setActive] = useState('Todos')
  const { articles, loading } = useArticles()
  const filtered = active === 'Todos' ? articles : articles.filter(n => n.category === active)
  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#Cd0000', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0, whiteSpace: 'nowrap' }}>
          Ultimas noticias
        </h2>
        <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: '1rem', flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActive(cat)} style={{
            padding: '5px 14px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 500,
            cursor: 'pointer', border: '1px solid',
            borderColor: active === cat ? '#Cd0000' : '#e5e7eb',
            background: active === cat ? '#Cd0000' : '#fff',
            color: active === cat ? '#fff' : '#6b7280', transition: 'all .15s',
          }}>{cat}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Carregando...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Nenhuma noticia nessa categoria.</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          {featured && <NewsCard news={featured} featured={true} />}
          {rest.map(n => <NewsCard key={n.id} news={n} />)}
        </div>
      )}
    </section>
  )
}
