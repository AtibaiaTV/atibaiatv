import LivePlayer from '../components/LivePlayer'
import Sidebar from '../components/Sidebar'
import NewsFeed from '../components/NewsFeed'
import AdBanner from '../components/AdBanner'
import EditoriaCard from '../components/EditoriaCard'
import VideoCard from '../components/VideoCard'
import { EDITORIAS, RECENT_VIDEOS } from '../data'

export default function Home() {
  return (
    <>
      {/* ── BANNER TOPO BILLBOARD 1920×200 ── */}
      <div style={{ padding: '10px 2rem', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'center' }}>
        <AdBanner type="billboard" />
      </div>

      {/* ── HERO: player + sidebar ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', borderBottom: '1px solid #e5e7eb' }}>
        <LivePlayer />
        <Sidebar />
      </div>

      {/* ── BANNER LEADERBOARD 1200×300 ── */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '1.5rem 2rem', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
        <AdBanner type="leaderboard" />
      </div>

      {/* ── EDITORIAS ── */}
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

      {/* ── FEED DE NOTÍCIAS + SIDEBAR DIREITA ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem 2.5rem', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        <NewsFeed />

        {/* Sidebar direita com banner 300×300 + vídeos recentes */}
        <aside>
          {/* Banner 300×300 */}
          <div style={{ marginBottom: '1.5rem' }}>
            <AdBanner type="square" />
          </div>

          {/* Vídeos recentes */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4a6fa5' }}>Vídeos recentes</span>
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {RECENT_VIDEOS.map(v => <VideoCard key={v.id} video={v} />)}
            </div>
          </div>

          {/* Segundo banner 300×300 */}
          <div style={{ marginTop: '1.5rem' }}>
            <AdBanner type="square" />
          </div>
        </aside>
      </div>

      {/* ── BANNER LEADERBOARD RODAPÉ ── */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 2rem 2rem', background: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
        <AdBanner type="leaderboard" />
      </div>
    </>
  )
}
