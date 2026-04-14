import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { TAG_STYLES } from '../data'
import useArticles from '../hooks/useArticles'
import useVideos from '../hooks/useVideos'
import useBanners from '../hooks/useBanners'
import { trackPageView, usePageViewCount } from '../hooks/usePageViews'
import NewsCard from '../components/NewsCard'
import AdBanner from '../components/AdBanner'
import VideoCard from '../components/VideoCard'

export default function ArticlePage() {
  const { id } = useParams()
  const [news, setNews] = useState(null)
  const [loading, setLoading] = useState(true)
  const { articles } = useArticles()
  const { videos } = useVideos()
  const { getBanner } = useBanners()
  const views = usePageViewCount('article-' + id)

  useEffect(() => {
    trackPageView('article-' + id)
    getDoc(doc(db, 'articles', id)).then(snap => {
      if (snap.exists()) setNews({ id: snap.id, ...snap.data() })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>Carregando...</div>
  if (!news) return <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>Materia nao encontrada.</div>

  const tagStyle = TAG_STYLES[news.category] || TAG_STYLES['Notícias']
  const related = articles.filter(n => n.category === news.category && n.id !== news.id).slice(0, 4)
  const billboard = getBanner('billboard')
  const square = getBanner('square')

  const CARD_BG = {
    blue: 'linear-gradient(135deg, #eef3fa, #c8d8ef)',
    green: 'linear-gradient(135deg, #edf7e8, #c0e4a8)',
    orange: 'linear-gradient(135deg, #fff7e0, #fde8bb)',
    red: 'linear-gradient(135deg, #faeaea, #f0b8b8)',
    purple: 'linear-gradient(135deg, #f3eafa, #ddd0f5)',
    teal: 'linear-gradient(135deg, #e6f7f5, #a8e0d8)',
  }

  return (
    <>
      <div className="atv-banner-wrap" style={{ display: 'flex', justifyContent: 'center', background: '#f4f5f7', borderBottom: '1px solid #e5e7eb' }}>
        <AdBanner type="billboard" src={billboard ? billboard.mediaUrl : '/banners/prefeitura-abril26/billboard.gif'} />
      </div>

      <div className="atv-container atv-grid-article atv-section-pad">
        <article>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1.25rem', fontSize: '0.78rem', color: 'var(--muted)', flexWrap: 'wrap' }}>
            <Link to="/" style={{ color: 'var(--blue)' }}>Inicio</Link>
            <span>&gt;</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 300 }}>{news.title}</span>
          </nav>

          <span style={{ display: 'inline-block', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 4, marginBottom: 14, background: tagStyle.bg, color: tagStyle.color }}>
            {news.category}
          </span>
          <h1 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.3, marginBottom: '1rem' }}>{news.title}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: tagStyle.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', color: tagStyle.color, flexShrink: 0 }}>
              {(news.author || 'R')[0]}
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>{news.author || 'Redacao Atibaia TV'}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{views} visualizacoes</div>
            </div>
          </div>

          {news.thumbnailUrl ? (
            <img src={news.thumbnailUrl} alt={news.title} style={{ width: '100%', height: 'auto', maxHeight: 400, borderRadius: 10, marginBottom: '1.5rem', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: 240, borderRadius: 10, marginBottom: '1.5rem', background: CARD_BG[news.color] || CARD_BG.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ opacity: 0.3, fontSize: '0.75rem', color: tagStyle.color }}>Foto: Atibaia TV</span>
            </div>
          )}

          <div style={{ fontSize: '1rem', lineHeight: 1.8, color: '#374151' }}>
            {(news.body || '').split('\n\n').map((para, i) => (
              <p key={i} style={{ marginBottom: '1.25rem' }}>{para}</p>
            ))}
          </div>

          <div style={{ margin: '2rem 0' }}>
            <AdBanner type="leaderboard" video="/banners/prefeitura-abril26/banco-leite.mp4" />
          </div>

          {related.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#Cd0000' }}>Leia tambem</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>
              <div className="atv-grid-related" style={{ background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                {related.map(n => <NewsCard key={n.id} news={n} />)}
              </div>
            </div>
          )}
        </article>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <AdBanner type="square" src={square ? square.mediaUrl : '/banners/prefeitura-abril26/square.gif'} />
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#Cd0000', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              Videos <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {videos.slice(0, 3).map(v => <VideoCard key={v.id} video={v} />)}
            </div>
          </div>
          <AdBanner type="square" src={square ? square.mediaUrl : '/banners/prefeitura-abril26/square.gif'} />
        </aside>
      </div>
    </>
  )
}
