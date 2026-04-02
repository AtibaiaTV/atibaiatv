import { useEffect } from 'react'
import LivePlayer from '../components/LivePlayer'
import NewsFeed from '../components/NewsFeed'
import AdBanner from '../components/AdBanner'
import NewsCard from '../components/NewsCard'
import EditoriaCard from '../components/EditoriaCard'
import VideoCard from '../components/VideoCard'
import { EDITORIAS } from '../data'
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
      <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 2rem', background: '#f4f5f7', borderBottom: '1px solid #e5e7eb' }}>
        <AdBanner type="billboard" src={billboard ? billboard.mediaUrl : '/banners/prefeitura-abril26/billboard.gif'} />
      </div>

      {/* HERO: destaque + lateral */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '1.5rem 2rem' }}>
        {!loading && featured && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2px', background: '#e5e7eb', borderRadius: 12, overflow: 'hidden', marginBottom: '1.5rem' }}>
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
      <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 2rem', background: '#f4f5f7', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
        {leaderboard && leaderboard.mediaType === 'video' ? (
          <AdBanner type="leaderboard" video={leaderboard.mediaUrl} />
        ) : (
          <AdBanner type="leaderboard" video="/banners/prefeitura-abril26/banco-leite.mp4" />
        )}
      </div>

      {/* CONTEUDO PRINCIPAL + SIDEBAR */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem' }}>

        {/* Coluna principal */}
        <div>
          {/* Editorias */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#Cd0000', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Editorias</h2>
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {EDITORIAS.map(ed => <EditoriaCard key={ed.slug} editoria={ed} />)}
            </div>
          </div>

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
          {/* Ao Vivo */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
              <div style={{ width: 8, height: 8, background: '#Cd0000', borderRadius: '50%', animation: 'atv-blink 1.2s ease-in-out infinite' }} />
              <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#Cd0000', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Ao Vivo</h3>
            </div>
            <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
              <LivePlayer />
            </div>
          </div>

          {/* Banner square */}
          <div style={{ marginBottom: '1.5rem' }}>
            <AdBanner type="square" src={square ? square.mediaUrl : '/banners/prefeitura-abril26/square.gif'} />
          </div>

          {/* Videos recentes */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Videos recentes</h3>
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {videos.slice(0, 4).map(v => <VideoCard key={v.id} video={v} />)}
            </div>
          </div>

          {/* Segundo banner */}
          <div>
            <AdBanner type="square" src={square ? square.mediaUrl : '/banners/prefeitura-abril26/square.gif'} />
          </div>
        </aside>
      </div>

      {/* BANNER RODAPE */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '1.5rem 2rem', background: '#f4f5f7', borderTop: '1px solid #e5e7eb' }}>
        {leaderboard && leaderboard.mediaType === 'video' ? (
          <AdBanner type="leaderboard" video={leaderboard.mediaUrl} />
        ) : (
          <AdBanner type="leaderboard" video="/banners/prefeitura-abril26/banco-leite.mp4" />
        )}
      </div>
    </>
  )
}
