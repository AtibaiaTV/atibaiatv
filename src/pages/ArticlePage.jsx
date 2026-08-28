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
import BannerCarousel from '../components/BannerCarousel'
import ArticleHeader from '../components/ArticleHeader'
import VideoCard from '../components/VideoCard'

export default function ArticlePage() {
  const { id } = useParams()
  const [news, setNews] = useState(null)
  const [loading, setLoading] = useState(true)
  const { articles } = useArticles()
  const { videos } = useVideos()
  const { banners } = useBanners()
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
  /* cada espaco roda entre todos os banners ativos do seu tipo, em vez de travar
     sempre no primeiro cadastrado e esconder os demais */
  const billboardBanners = banners.filter(b => b.type === 'billboard')
  const leaderboardBanners = banners.filter(b => b.type === 'leaderboard')
  const squareBanners = banners.filter(b => b.type === 'square')

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
      {billboardBanners.length > 0 && (
        <div className="atv-banner-wrap" style={{ display: 'flex', justifyContent: 'center', background: '#f4f5f7', borderBottom: '1px solid #e5e7eb' }}>
          <BannerCarousel type="billboard" banners={billboardBanners} />
        </div>
      )}

      <div className="atv-container atv-grid-article atv-section-pad">
        <article>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1.25rem', fontSize: '0.78rem', color: 'var(--muted)', flexWrap: 'wrap' }}>
            <Link to="/" style={{ color: 'var(--blue)' }}>Inicio</Link>
            <span>&gt;</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 300 }}>{news.title}</span>
          </nav>

          <ArticleHeader news={news} tagStyle={tagStyle} views={views} />

          <figure style={{ margin: '0 0 1.75rem' }}>
            {news.thumbnailUrl ? (
              <img src={news.thumbnailUrl} alt={news.imageCaption || news.title} style={{ width: '100%', height: 'auto', maxHeight: 460, borderRadius: 10, objectFit: 'cover', display: 'block' }} />
            ) : (
              <div style={{ width: '100%', height: 240, borderRadius: 10, background: CARD_BG[news.color] || CARD_BG.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ opacity: 0.3, fontSize: '0.75rem', color: tagStyle.color }}>Foto: Atibaia TV</span>
              </div>
            )}
            {(news.imageCaption || news.imageCredit) && (
              <figcaption style={{ fontSize: '0.78rem', lineHeight: 1.5, color: 'var(--muted)', marginTop: 8 }}>
                {news.imageCaption}
                {news.imageCaption && news.imageCredit ? ' - ' : ''}
                {news.imageCredit && <span style={{ fontStyle: 'italic' }}>Foto: {news.imageCredit}</span>}
              </figcaption>
            )}
          </figure>

          {/* corpo: linhas iniciadas por "## " viram intertitulos, como no G1 */}
          <div style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#2b2b3a' }}>
            {(news.body || '').split(/\n\s*\n/).map((para, i) => (
              para.trim().indexOf('## ') === 0 ? (
                <h2 key={i} style={{ fontFamily: "'Lora', Georgia, serif", fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.35, margin: '2rem 0 0.9rem' }}>
                  {para.trim().slice(3)}
                </h2>
              ) : (
                <p key={i} style={{ marginBottom: '1.35rem' }}>{para}</p>
              )
            ))}
          </div>

          {leaderboardBanners.length > 0 && (
            <div style={{ margin: '2rem 0' }}>
              <BannerCarousel type="leaderboard" banners={leaderboardBanners} />
            </div>
          )}

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
          {squareBanners.length > 0
            ? <BannerCarousel banners={squareBanners} width={300} height={300} />
            : <AdBanner type="square" src="/banners/prefeitura-abril26/square.gif" />}
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#Cd0000', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              Videos <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {videos.slice(0, 3).map(v => <VideoCard key={v.id} video={v} />)}
            </div>
          </div>
          {squareBanners.length > 0
            ? <BannerCarousel banners={squareBanners} width={300} height={300} />
            : <AdBanner type="square" src="/banners/prefeitura-abril26/square.gif" />}
        </aside>
      </div>
    </>
  )
}
