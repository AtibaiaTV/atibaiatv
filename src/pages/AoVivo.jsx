import { useState } from 'react'
import LivePlayer from '../components/LivePlayer'
import AdBanner from '../components/AdBanner'
import { SCHEDULE, RECENT_VIDEOS } from '../data'
import VideoCard from '../components/VideoCard'

export default function AoVivo() {
  const [activeTab, setActiveTab] = useState('grade')

  return (
    <>
      {/* Banner topo */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'center', padding: '10px 2rem' }}>
        <AdBanner type="billboard" src="/banners/prefeitura-abril26/billboard.gif" />
      </div>

      {/* Cabeçalho */}
      <div style={{ background: 'linear-gradient(135deg, #0f1b2d 0%, #1a3a5c 100%)', padding: '1.5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 8, height: 8, background: '#c0392b', borderRadius: '50%', animation: 'atv-blink 1.2s ease-in-out infinite' }} />
              <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)' }}>Transmissão</span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff' }}>Atibaia TV — Ao Vivo</h1>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,.55)', marginTop: 4 }}>Assista agora a programação completa da Atibaia TV</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { icon: '▶', label: 'YouTube', href: 'https://youtube.com' },
              { icon: '◉', label: 'Facebook', href: 'https://facebook.com' },
            ].map(({ icon, label, href }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,.1)', color: '#fff',
                padding: '8px 16px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 500,
                border: '1px solid rgba(255,255,255,.15)', transition: 'background .2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.1)'}
              >{icon} {label}</a>
            ))}
          </div>
        </div>
      </div>

      {/* Player + sidebar */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>

        {/* Player */}
        <div>
          <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 4px 24px rgba(0,0,0,.08)' }}>
            <LivePlayer />
          </div>

          {/* Info do programa atual */}
          <div style={{ marginTop: '1rem', padding: '1rem 1.25rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 3l-4 4-4-4"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--muted)', marginBottom: 2 }}>Agora no ar</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)' }}>Jornal da Tarde</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#c0392b', color: '#fff', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', padding: '4px 10px', borderRadius: 10 }}>
              <div style={{ width: 5, height: 5, background: '#fff', borderRadius: '50%', animation: 'atv-blink 1.2s ease-in-out infinite' }} />
              AO VIVO
            </div>
          </div>

          {/* Banner após player */}
          <div style={{ marginTop: '1.5rem' }}>
            <AdBanner type="leaderboard" video="/banners/prefeitura-abril26/banco-leite.mp4" />
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Tabs */}
          <div style={{ display: 'flex', background: 'var(--surface)', borderRadius: 10, padding: 4, border: '1px solid var(--border)' }}>
            {[
              { id: 'grade', label: 'Grade do dia' },
              { id: 'videos', label: 'Vídeos' },
            ].map(({ id, label }) => (
              <button key={id} onClick={() => setActiveTab(id)} style={{
                flex: 1, padding: '8px', borderRadius: 7, fontSize: '0.82rem', fontWeight: 500,
                border: 'none', cursor: 'pointer',
                background: activeTab === id ? '#fff' : 'transparent',
                color: activeTab === id ? 'var(--blue)' : 'var(--muted)',
                boxShadow: activeTab === id ? '0 1px 3px rgba(0,0,0,.08)' : 'none',
                transition: 'all .2s',
              }}>{label}</button>
            ))}
          </div>

          {/* Grade */}
          {activeTab === 'grade' && (
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
              {SCHEDULE.map((item, i) => (
                <div key={item.time} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px',
                  background: item.live ? 'var(--blue-light)' : '#fff',
                  borderBottom: i < SCHEDULE.length - 1 ? '1px solid var(--border)' : 'none',
                  transition: 'background .15s',
                }}
                onMouseEnter={e => { if (!item.live) e.currentTarget.style.background = 'var(--surface)' }}
                onMouseLeave={e => { e.currentTarget.style.background = item.live ? 'var(--blue-light)' : '#fff' }}
                >
                  <span style={{ fontSize: '0.78rem', fontWeight: item.live ? 700 : 500, color: item.live ? 'var(--blue)' : 'var(--muted)', minWidth: 44 }}>{item.time}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: item.live ? 600 : 400, color: item.live ? 'var(--text)' : '#374151' }}>{item.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{item.category}</div>
                  </div>
                  {item.live && (
                    <span style={{ background: '#c0392b', color: '#fff', fontSize: '0.6rem', fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>ao vivo</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Vídeos */}
          {activeTab === 'videos' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {RECENT_VIDEOS.map(v => <VideoCard key={v.id} video={v} />)}
            </div>
          )}

          {/* Banner lateral */}
          <AdBanner type="square" src="/banners/prefeitura-abril26/square.gif" />
        </div>
      </div>
    </>
  )
}
