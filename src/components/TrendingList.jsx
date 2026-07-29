import { Link } from 'react-router-dom'

export default function TrendingList({ items, title = 'Mais lidas' }) {
  if (!items || items.length === 0) return null

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ padding: '0.9rem 1.1rem', borderBottom: '2px solid #1a1a2e' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1a1a2e', margin: 0 }}>{title}</h3>
      </div>
      <div>
        {items.map(function(news, i) {
          return (
            <Link key={news.id} to={'/artigo/' + news.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '0.85rem 1.1rem',
              textDecoration: 'none', borderBottom: i < items.length - 1 ? '1px solid #f3f4f6' : 'none',
              transition: 'background .15s',
            }}
            onMouseEnter={function(e) { e.currentTarget.style.background = '#fafbfc' }}
            onMouseLeave={function(e) { e.currentTarget.style.background = '#fff' }}
            >
              <span style={{
                fontSize: '1.3rem', fontWeight: 800, color: i < 3 ? '#Cd0000' : '#d1d5db',
                width: 28, flexShrink: 0, lineHeight: 1, fontStyle: 'italic',
              }}>{i + 1}</span>
              <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#1a1a2e', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {news.title}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
