import { useEffect, useState } from 'react'
import NewsCard from '../components/NewsCard'
import VideoCard from '../components/VideoCard'
import ShortVideos from '../components/ShortVideos'
import TrendingList from '../components/TrendingList'
import SidebarWidgets from '../components/SidebarWidgets'
import EnqueteWidget from '../components/EnqueteWidget'
import BannerCarousel from '../components/BannerCarousel'
import useArticles from '../hooks/useArticles'
import useVideos from '../hooks/useVideos'
import useBanners from '../hooks/useBanners'
import { trackPageView, trackVisit, useMarcarPresenca } from '../hooks/usePageViews'
import { useMaisLidas } from '../hooks/useAnalytics'

var bannerWrap = {
  background: '#f4f5f7',
  borderTop: '1px solid #e5e7eb',
  borderBottom: '1px solid #e5e7eb',
  padding: '10px 0',
}

var PAGE_SIZE = 12

export default function Home() {
  var visibleState = useState(PAGE_SIZE)
  var visibleCount = visibleState[0]
  var setVisibleCount = visibleState[1]

  var articlesData = useArticles()
  var articles = articlesData.articles
  var loading   = articlesData.loading

  var videosData  = useVideos()
  var videos      = videosData.videos

  var bannersData    = useBanners()
  var banners        = bannersData.banners

  var abaState = useState('lidas')
  var abaRanking = abaState[0]
  var setAbaRanking = abaState[1]

  var maisLidasData = useMaisLidas(7)

  useEffect(function() {
    trackPageView('home')
    trackVisit()
  }, [])
  useMarcarPresenca()

  /* cada espaco roda entre TODOS os banners ativos do seu tipo — antes so o
     primeiro cadastrado aparecia e os demais ficavam escondidos pra sempre */
  var billboardBanners   = banners.filter(function(b) { return b.type === 'billboard' })
  var squareBanners      = banners.filter(function(b) { return b.type === 'square' })

  /* se nao houver leaderboard dedicado, usa os billboards em video nesse espaco —
     mesma regra de antes, so que agora intercalando quando houver mais de um */
  var leaderboardBanners = banners.filter(function(b) { return b.type === 'leaderboard' })
  if (leaderboardBanners.length === 0) {
    leaderboardBanners = banners.filter(function(b) { return b.type === 'billboard' && b.mediaType === 'video' })
  }

  var featured     = articles[0]
  var sideNews     = articles.slice(1, 4)
  var restNews     = articles.slice(4)
  var latestVideo  = videos[0] || null
  var shortVideos  = videos.filter(function(v) { return v.format === 'short' })
  var recentes     = articles.slice(0, 6)

  /* ranking real dos últimos 7 dias: junta o número de acessos a cada matéria e
     descarta as que ninguém leu, para a lista não virar uma cópia das recentes */
  var lidas = articles
    .map(function(a) { return Object.assign({}, a, { acessos: maisLidasData.ranking['article-' + a.id] || 0 }) })
    .filter(function(a) { return a.acessos > 0 })
    .sort(function(a, b) { return b.acessos - a.acessos })
    .slice(0, 6)

  var listaRanking = abaRanking === 'lidas' ? lidas : recentes

  return (
    <>
      {/* BANNER TOPO — todos os billboards ativos, intercalando entre si */}
      {billboardBanners.length > 0 && (
        <div style={bannerWrap}>
          <div className="atv-container">
            <BannerCarousel type="billboard" banners={billboardBanners} />
          </div>
        </div>
      )}

      {/* HERO — materia principal + enquete ao lado, materias menores abaixo */}
      <div className="atv-container" style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
        {!loading && featured && (
          <>
            <div className="atv-grid-featured" style={{ marginBottom: '1rem', alignItems: 'start' }}>
              <div style={{ background: '#e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
                <NewsCard news={featured} featured={true} />
              </div>
              <div className="atv-featured-enquete" style={{ height: 320 }}>
                <EnqueteWidget compact fillHeight />
              </div>
            </div>
            <div className="atv-grid-sidenews">
              {sideNews.map(function(n) { return <NewsCard key={n.id} news={n} highlight={true} /> })}
            </div>
          </>
        )}
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
            Carregando noticias...
          </div>
        )}
      </div>

      {/* VIDEOS CURTOS — carrossel vertical */}
      <ShortVideos videos={shortVideos} />

      {/* BANNER MEIO — leaderboard, intercalando */}
      {leaderboardBanners.length > 0 && (
        <div style={bannerWrap}>
          <div className="atv-container">
            <BannerCarousel type="leaderboard" banners={leaderboardBanners} />
          </div>
        </div>
      )}

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
            {restNews.slice(0, visibleCount).map(function(n, i) {
              /* a cada 4 materias, uma carta "destaque" maior quebra a monotonia da lista */
              var isHighlight = i > 0 && i % 4 === 0
              return <NewsCard key={n.id} news={n} highlight={isHighlight} />
            })}
            {restNews.length === 0 && !loading && (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.85rem' }}>
                Nenhuma noticia adicional.
              </div>
            )}
          </div>

          {visibleCount < restNews.length && (
            <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
              <button onClick={function() { setVisibleCount(function(c) { return c + PAGE_SIZE }) }} style={{
                padding: '10px 28px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff',
                color: '#4971B1', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
              }}>
                Carregar mais noticias
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="atv-sidebar-sticky" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Clima, mercado, rodovias, acessibilidade — no topo da coluna, mais visivel */}
          <SidebarWidgets />

          {/* 1 square 300x300 rotativo */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <BannerCarousel banners={squareBanners} width={300} height={300} />
          </div>

          {/* Ranking numerado: mais lidas dos últimos 7 dias ou mais recentes */}
          <TrendingList
            items={listaRanking}
            aba={abaRanking}
            onTrocarAba={setAbaRanking}
            vazio={maisLidasData.carregando ? 'Carregando...' : 'Ainda não há leituras registradas nos últimos 7 dias.'}
          />

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

      {/* BANNER RODAPE — leaderboard, intercalando */}
      {leaderboardBanners.length > 0 && (
        <div style={bannerWrap}>
          <div className="atv-container">
            <BannerCarousel type="leaderboard" banners={leaderboardBanners} />
          </div>
        </div>
      )}
    </>
  )
}
