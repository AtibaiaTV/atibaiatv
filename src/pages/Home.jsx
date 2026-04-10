import { useEffect } from 'react'
import NewsCard from '../components/NewsCard'
import VideoCard from '../components/VideoCard'
import AdBanner from '../components/AdBanner'
import BannerCarousel from '../components/BannerCarousel'
import useArticles from '../hooks/useArticles'
import useVideos from '../hooks/useVideos'
import useBanners from '../hooks/useBanners'
import { trackPageView } from '../hooks/usePageViews'

var bannerWrap = {
  background: '#f4f5f7',
  borderTop: '1px solid #e5e7eb',
  borderBottom: '1px solid #e5e7eb',
  padding: '10px 0',
}

export default function Home() {
  var articlesData = useArticles()
  var articles = articlesData.articles
  var loading   = articlesData.loading

  var videosData  = useVideos()
  var videos      = videosData.videos

  var bannersData    = useBanners()
  var banners        = bannersData.banners
  var getBanner      = bannersData.getBanner

  useEffect(function() { trackPageView('home') }, [])

  var billboard   = getBanner('billboard')
  var leaderboard = getBanner('leaderboard')

  /* todos os squares para o carrossel */
  var squareBanners = banners.filter(function(b) { return b.type === 'square' })

  var featured    = articles[0]
  var sideNews    = articles.slice(1, 4)
  var restNews    = articles.slice(4)
  var latestVideo = videos[0] || null

  var leaderEl = leaderboard && leaderboard.mediaType === 'video'
    ? <AdBanner type="leaderboard" video={leaderboard.mediaUrl} />
    : <AdBanner type="leaderboard" video="/banners/prefeitura-abril26/banco-leite.mp4" />

  return (
    <>
      {/* BANNER TOPO — billboard, mesma largura do conteudo */}
      <div style={bannerWrap}>
        <div className="atv-container">
          <AdBanner
            type="billboard"
            src={billboard ? billboard.mediaUrl : '/banners/prefeitura-abril26/billboard.gif'}
            href={billboard ? billboard.linkUrl : '#'}
          />
        </div>
      </div>

      {/* HERO */}
      <div className="atv-container" style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
        {!loading && featured && (
          <div className="atv-grid-hero" style={{
            background: '#e5e7eb', borderRadius: 12,
            overflow: 'hidden', marginBottom: '1.5rem',
          }}>
            <div style={{ gridRow: 'span 3' }}>
              <NewsCard news={featured} featured={true} />
            </div>
            {sideNews.map(function(n) { return <NewsCard key={n.id} news={n} /> })}
          </div>
        )}
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
            Carregando noticias...
          </div>
        )}
      </div>

      {/* BANNER MEIO — leaderboard */}
      <div style={bannerWrap}>
        <div className="atv-container">
          {leaderEl}
        </div>
      </div>

      {/* CONTEUDO + SIDEBAR */}
      <div className="atv-container atv-grid-main" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>

        {/* Coluna principal */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
            <h2 style={{
              fontSize: '0.85rem', fontWeight: 700, color: '#Cd0000',
              textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0,
            }}>Mais noticias</h2>
            <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
          </div>
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            {restNews.map(function(n) { return <NewsCard key={n.id} news={n} /> })}
            {restNews.length === 0 && !loading && (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.85rem' }}>
                Nenhuma noticia adicional.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside>

          {/* 1 square 300x300 rotativo */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <BannerCarousel banners={squareBanners} width={300} height={300} />
          </div>

          {/* 1 video mais recente */}
          {latestVideo && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
                <h3 style={{
                  fontSize: '0.8rem', fontWeight: 700, color: '#1a1a2e',
                  textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0,
                }}>Video recente</h3>
                <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
              </div>
              <VideoCard video={latestVideo} />
            </div>
          )}

        </aside>
      </div>

      {/* BANNER RODAPE — leaderboard */}
      <div style={bannerWrap}>
        <div className="atv-container">
          {leaderEl}
        </div>
      </div>
    </>
  )
}
