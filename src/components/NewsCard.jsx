import { Link } from 'react-router-dom'
import { TAG_STYLES } from '../data'

const CARD_BG = {
  blue:   'linear-gradient(135deg, #eef3fa 0%, #c8d8ef 100%)',
  purple: 'linear-gradient(135deg, #f3eafa 0%, #ddd0f5 100%)',
  green:  'linear-gradient(135deg, #edf7e8 0%, #c0e4a8 100%)',
  orange: 'linear-gradient(135deg, #fff7e0 0%, #fde8bb 100%)',
  teal:   'linear-gradient(135deg, #e6f7f5 0%, #a8e0d8 100%)',
  red:    'linear-gradient(135deg, #faeaea 0%, #f0b8b8 100%)',
}

const CARD_ICON = {
  blue: <svg width="56" height="56" viewBox="0 0 80 80" fill="none" style={{ opacity: 0.2 }}>
    <rect x="10" y="30" width="20" height="44" rx="3" fill="#4a6fa5"/>
    <rect x="36" y="14" width="14" height="60" rx="3" fill="#4a6fa5"/>
    <rect x="56" y="22" width="18" height="52" rx="3" fill="#4a6fa5"/>
  </svg>,
  purple: <svg width="56" height="56" viewBox="0 0 80 80" fill="none" style={{ opacity: 0.22 }}>
    <circle cx="40" cy="40" r="26" stroke="#8b44c2" strokeWidth="3"/>
    <path d="M26 40 Q40 18 54 40 Q40 62 26 40Z" fill="#8b44c2"/>
  </svg>,
  green: <svg width="56" height="56" viewBox="0 0 80 80" fill="none" style={{ opacity: 0.22 }}>
    <rect x="14" y="20" width="52" height="46" rx="4" stroke="#5aab3a" strokeWidth="3"/>
    <path d="M14 34h52" stroke="#5aab3a" strokeWidth="3"/>
    <path d="M28 12v14M52 12v14" stroke="#5aab3a" strokeWidth="3" strokeLinecap="round"/>
  </svg>,
  orange: <svg width="56" height="56" viewBox="0 0 80 80" fill="none" style={{ opacity: 0.22 }}>
    <circle cx="40" cy="40" r="24" stroke="#c47a00" strokeWidth="3"/>
    <circle cx="40" cy="40" r="12" stroke="#c47a00" strokeWidth="2"/>
  </svg>,
  teal: <svg width="56" height="56" viewBox="0 0 80 80" fill="none" style={{ opacity: 0.22 }}>
    <path d="M8 56 L24 32 L40 42 L52 22 L72 48" stroke="#1a8c7a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  red: <svg width="56" height="56" viewBox="0 0 80 80" fill="none" style={{ opacity: 0.18 }}>
    <circle cx="40" cy="36" r="16" stroke="#c0392b" strokeWidth="3"/>
    <path d="M40 52v12M30 60h20" stroke="#c0392b" strokeWidth="3" strokeLinecap="round"/>
  </svg>,
}

const css = `
.news-card-inner { display: block; background: #fff; transition: background .2s; height: 100%; }
.news-card-inner:hover { background: var(--surface); }
.news-card-inner:hover .news-card-title { color: var(--blue); }
.news-card-title { transition: color .2s; }
`

export default function NewsCard({ news, featured = false }) {
  const tagStyle = TAG_STYLES[news.category] || TAG_STYLES['Notícias']
  const imgH = featured ? 200 : 110

  return (
    <>
      <style>{css}</style>
      <Link to={`/artigo/${news.id}`} className="news-card-inner">
        <div style={{ height: imgH, background: CARD_BG[news.color] || CARD_BG.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {CARD_ICON[news.color] || CARD_ICON.blue}
        </div>
        <div style={{ padding: '12px 14px 16px' }}>
          <span style={{
            display: 'inline-block', fontSize: '0.62rem', fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            padding: '2px 8px', borderRadius: 4, marginBottom: 8,
            background: tagStyle.bg, color: tagStyle.color,
          }}>
            {news.category}
          </span>
          <h3 className="news-card-title" style={{ fontSize: featured ? '1.1rem' : '0.84rem', fontWeight: 600, lineHeight: 1.4, color: 'var(--text)', marginBottom: 8 }}>
            {news.title}
          </h3>
          <div style={{ fontSize: '0.7rem', color: '#9ca3af', display: 'flex', gap: 6 }}>
            {news.author && <span>{news.author}</span>}
            {news.author && <span>·</span>}
            <span>{news.time}</span>
          </div>
        </div>
      </Link>
    </>
  )
}
