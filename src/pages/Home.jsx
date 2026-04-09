import { useEffect } from 'react'
import NewsFeed from '../components/NewsFeed'
import AdBanner from '../components/AdBanner'
import NewsCard from '../components/NewsCard'
import VideoCard from '../components/VideoCard'
import useArticles from '../hooks/useArticles'
import useVideos from '../hooks/useVideos'
import useBanners from '../hooks/useBanners'
import { trackPageView } from '../hooks/usePageViews'

export default function Home() {
  const { articles, loading } = useArticles()
  const { videos } = useVideos()
  const { getBanner } = useBanners()

  useEffect(() => { trackPageView('home') }, [])

  const billboard = getBanner('billboard')
  const leaderboard = getBanner('leaderboard')
  const square = getBanner('square')

  const featured = articles[0]
  const sideNews = articles.slice(1, 4)
  const restNews = articles.slice(4)

  return (
    <>
      {/* BANNER TOPO */}
      <div className="atv-banner-wrap" style={{ display: 'flex', justifyContent: 'center', background: '#f4f5f7', borderBottom: '1px solid #e5e7eb' }}>
        <AdBanner type="billboard" src={billboard ? billboard.mediaUrl : '/banners/prefeitura-abril26/billboard.gif'} />
      </div>

      {/* HERO */}
      <div className="atv-container" style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
        {!loading && featured && (
          <div className="atv-grid-hero" style={{ background: '#e5e7eb', borderRadius: 12, overflow: 'hidden', marginBottom: '1.5rem' }}>
            <div style={{ gridRow: 'span 3' }}>
              <NewsCard news={featured} featured={true} />
            </div>
            {sideNews.map(n => (
              <NewsCard key={n.id} news={n} />
            ))}
          </div>
        )}
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>Carregando noticias...</div>
        )}
      </div>

      {/* BANNER LEADERBOARD */}
      <div className="atv-banner-wrap" style={{ display: 'flex', justifyContent: 'center', background: '#f4f5f7', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
        {leaderboard && leaderboard.mediaType === 'video' ? (
          <AdBanner type="leaderboard" video={leaderboard.mediaUrl} />
        ) : (
          <AdBanner type="leaderboard" video="/banners/prefeitura-abril26/banco-leite.mp4" />
        )}
      </div>

      {/* CONTEUDO + SIDEBAR */}
      <div className="atv-container atv-grid-main" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div>
          {/* Mais noticias */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#Cd0000', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Mais noticias</h2>
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
            </div>
            <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
              {restNews.map(n => <NewsCard key={n.id} news={n} />)}
              {restNews.length === 0 && !loading && (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.85rem' }}>Nenhuma noticia adicional.</div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside>
          <div style={{ marginBottom: '1.5rem' }}>
            <AdBanner type="square" src={square ? square.mediaUrl : '/banners/prefeitura-abril26/square.gif'} />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Videos recentes</h3>
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {videos.slice(0, 4).map(v => <VideoCard key={v.id} video={v} />)}
            </div>
          </div>

          <AdBanner type="square" src={square ? square.mediaUrl : '/banners/prefeitura-abril26/square.gif'} />
        </aside>
      </div>

      {/* BANNER RODAPE */}
      <div className="atv-banner-wrap" style={{ display: 'flex', justifyContent: 'center', background: '#f4f5f7', borderTop: '1px solid #e5e7eb' }}>
        {leaderboard && leaderboard.mediaType === 'video' ? (
          <AdBanner type="leaderboard" video={leaderboard.mediaUrl} />
        ) : (
          <AdBanner type="leaderboard" video="/banners/prefeitura-abril26/banco-leite.mp4" />
        )}
      </div>
    </>
  )
}
