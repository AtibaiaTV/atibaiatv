import { Link } from 'react-router-dom'
import { TAG_STYLES } from '../data'

const CARD_BG = {
  blue: '#eef3fa', green: '#edf7e8', orange: '#fff7e0',
  red: '#faeaea', purple: '#f3eafa', teal: '#e6f7f5',
}

export default function NewsCard({ news, featured = false }) {
  const tagStyle = TAG_STYLES[news.category] || { bg: '#f3f4f6', color: '#6b7280' }

  if (featured) {
    return (
      <Link to={'/artigo/' + news.id} style={{ display: 'block', textDecoration: 'none', background: '#fff' }}>
        <div style={{ width: '100%', height: 320, overflow: 'hidden', position: 'relative' }}>
          {news.thumbnailUrl ? (
            <img src={news.thumbnailUrl} alt={news.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: CARD_BG[news.color] || CARD_BG.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '3rem', opacity: 0.3 }}>📰</span>
            </div>
          )}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,.8))', padding: '3rem 1.25rem 1.25rem' }}>
            <span style={{ display: 'inline-block', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 4, background: tagStyle.color, color: '#fff', marginBottom: 8 }}>
              {news.category}
            </span>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', lineHeight: 1.3, margin: 0 }}>{news.title}</h2>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,.7)', marginTop: 6 }}>{news.author || 'Redacao Atibaia TV'}</p>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link to={'/artigo/' + news.id} style={{
      display: 'flex', gap: 14, padding: '1rem 1.25rem', background: '#fff',
      textDecoration: 'none', transition: 'background .15s', borderBottom: '1px solid #f3f4f6',
    }}
    onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
    >
      {news.thumbnailUrl ? (
        <img src={news.thumbnailUrl} alt="" style={{ width: 120, height: 80, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
      ) : (
        <div style={{ width: 120, height: 80, borderRadius: 6, background: CARD_BG[news.color] || CARD_BG.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: '1.5rem', opacity: 0.3 }}>📰</span>
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: tagStyle.color }}>
          {news.category}
        </span>
        <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#1a1a2e', lineHeight: 1.35, margin: '4px 0 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {news.title}
        </h3>
        <span style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: 4, display: 'block' }}>
          {news.author || 'Redacao Atibaia TV'}
        </span>
      </div>
    </Link>
  )
}
