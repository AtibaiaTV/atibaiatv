import { Link } from 'react-router-dom'
import { TAG_STYLES } from '../data'
import timeAgo from '../utils/timeAgo'

const CARD_BG = {
  blue: '#eef3fa', green: '#edf7e8', orange: '#fff7e0',
  red: '#faeaea', purple: '#f3eafa', teal: '#e6f7f5',
}

function MetaLine({ news }) {
  const when = timeAgo(news.createdAt) || news.time
  return (
    <span style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: 6, display: 'block' }}>
      {when && <>{when} — </>}Em <b style={{ color: '#6b7280' }}>{news.category}</b>
    </span>
  )
}

function Thumb({ news, tagStyle, style }) {
  return news.thumbnailUrl ? (
    <img src={news.thumbnailUrl} alt="" style={style} />
  ) : (
    <div style={{ ...style, background: CARD_BG[news.color] || CARD_BG.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: '1.8rem', opacity: 0.3, color: tagStyle.color }}>📰</span>
    </div>
  )
}

export default function NewsCard({ news, featured = false, highlight = false }) {
  const tagStyle = TAG_STYLES[news.category] || { bg: '#f3f4f6', color: '#6b7280' }

  if (featured) {
    return (
      <Link to={'/artigo/' + news.id} style={{ display: 'block', textDecoration: 'none', background: '#fff' }}>
        <div style={{ width: '100%', height: 320, overflow: 'hidden', position: 'relative' }}>
          <Thumb news={news} tagStyle={tagStyle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

  /* variante "destaque": card largo, imagem em cima, usado para quebrar a monotonia da lista */
  if (highlight) {
    return (
      <Link to={'/artigo/' + news.id} style={{
        display: 'block', textDecoration: 'none', background: '#fff',
        borderBottom: '1px solid #f3f4f6', position: 'relative',
      }}
      onMouseEnter={e => e.currentTarget.querySelector('.ncard-title').style.color = tagStyle.color}
      onMouseLeave={e => e.currentTarget.querySelector('.ncard-title').style.color = '#1a1a2e'}
      >
        <div style={{ width: '100%', aspectRatio: '21/9', overflow: 'hidden', position: 'relative' }}>
          <Thumb news={news} tagStyle={tagStyle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <span style={{ position: 'absolute', top: 12, left: 12, fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 4, background: tagStyle.color, color: '#fff' }}>
            {news.category}
          </span>
        </div>
        <div style={{ padding: '1rem 1.25rem 1.25rem' }}>
          <h3 className="ncard-title" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1a1a2e', lineHeight: 1.32, margin: 0, transition: 'color .15s' }}>
            {news.title}
          </h3>
          <MetaLine news={news} />
        </div>
      </Link>
    )
  }

  return (
    <Link to={'/artigo/' + news.id} style={{
      display: 'flex', gap: 16, padding: '1.1rem 1.25rem', background: '#fff',
      textDecoration: 'none', transition: 'background .15s', borderBottom: '1px solid #f3f4f6',
      borderLeft: '3px solid transparent',
    }}
    onMouseEnter={e => { e.currentTarget.style.background = '#fafbfc'; e.currentTarget.style.borderLeftColor = tagStyle.color }}
    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderLeftColor = 'transparent' }}
    >
      <Thumb news={news} tagStyle={tagStyle} style={{ width: 200, aspectRatio: '16/10', borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <span style={{ fontSize: '0.64rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: tagStyle.color }}>
          {news.category}
        </span>
        <h3 style={{ fontSize: '1.02rem', fontWeight: 700, color: '#1a1a2e', lineHeight: 1.35, margin: '5px 0 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {news.title}
        </h3>
        <MetaLine news={news} />
      </div>
    </Link>
  )
}
