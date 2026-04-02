import { useEffect } from 'react'
import LivePlayer from '../components/LivePlayer'
import Sidebar from '../components/Sidebar'
import NewsFeed from '../components/NewsFeed'
import AdBanner from '../components/AdBanner'
import EditoriaCard from '../components/EditoriaCard'
import VideoCard from '../components/VideoCard'
import { EDITORIAS } from '../data'
import useVideos from '../hooks/useVideos'
import useBanners from '../hooks/useBanners'
import { trackPageView } from '../hooks/usePageViews'

export default function Home() {
  const { videos } = useVideos()
  const { getBanner } = useBanners()

  useEffect(() => { trackPageView('home') }, [])

  const billboard = getBanner('billboard')
  const leaderboard = getBanner('leaderboard')
  const square1 = getBanner('square')

  return (
    <>
      {/* BANNER TOPO BILLBOARD */}
      <div style={{ padding: '10px 2rem', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'center' }}>
        <AdBanner type="billboard" src={billboard ? billboard.mediaUrl : '/banners/prefeitura-abril26/billboard.gif'} />
      </div>

      {/* HERO: player + sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', borderBottom: '1px solid #e5e7eb' }}>
        <LivePlayer />
        <Sidebar />
      </div>

      {/* BANNER LEADERBOARD */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '1.5rem 2rem', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
        {leaderboard && leaderboard.mediaType === 'video' ? (
          <AdBanner type="leaderboard" video={leaderboard.mediaUrl} />
        ) : (
          <AdBanner type="leaderboard" video="/banners/prefeitura-abril26/banco-leite.mp4" />
        )}
      </div>

      {/* EDITORIAS */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#4a6fa5', whiteSpace: 'nowrap' }}>
            Nossas editorias
          </span>
          <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
          {EDITORIAS.map(ed => <EditoriaCard key={ed.slug} editoria={ed} />)}
        </div>
      </section>

      {/* FEED DE NOTICIAS + SIDEBAR DIREITA */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem 2.5rem', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        <NewsFeed />

        <aside>
          <div style={{ marginBottom: '1.5rem' }}>
            <AdBanner type="square" src={square1 ? square1.mediaUrl : '/banners/prefeitura-abril26/square.gif'} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4a6fa5' }}>Videos recentes</span>
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {(videos.length > 0 ? videos : []).slice(0, 4).map(v => <VideoCard key={v.id} video={v} />)}
            </div>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <AdBanner type="square" src={square1 ? square1.mediaUrl : '/banners/prefeitura-abril26/square.gif'} />
          </div>
        </aside>
      </div>

      {/* BANNER LEADERBOARD RODAPE */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 2rem 2rem', background: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
        {leaderboard && leaderboard.mediaType === 'video' ? (
          <AdBanner type="leaderboard" video={leaderboard.mediaUrl} />
        ) : (
          <AdBanner type="leaderboard" video="/banners/prefeitura-abril26/banco-leite.mp4" />
        )}
      </div>
    </>
  )
}
