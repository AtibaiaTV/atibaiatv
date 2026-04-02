import { useState } from 'react'

// ID do canal YouTube da Redesa TV
// Para stream ao vivo use o ID do vídeo ao vivo
// Para o canal use: https://www.youtube.com/@REDESA_tv
const YOUTUBE_CHANNEL = 'REDESA_tv'
const YOUTUBE_LIVE_ID = null // Substitua pelo ID do stream ao vivo quando disponível

const css = `
@keyframes atv-blink { 0%,100%{opacity:1} 50%{opacity:.3} }
.atv-play-btn {
  width: 72px; height: 72px; border-radius: 50%;
  background: #4971B1; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: transform .2s, background .2s;
}
.atv-play-btn:hover { transform: scale(1.08); background: #2d5282; }
.atv-ctrl { background: none; border: none; color: #fff; cursor: pointer; opacity: .8; display: flex; transition: opacity .2s; }
.atv-ctrl:hover { opacity: 1; }
`

export default function LivePlayer() {
  const [playing, setPlaying] = useState(false)

  return (
    <>
      <style>{css}</style>
      <div style={{ position: 'relative', background: '#0d1117', aspectRatio: '16/9', width: '100%' }}>
        {YOUTUBE_LIVE_ID && playing ? (
          <iframe
            width="100%" height="100%"
            src={`https://www.youtube.com/embed/${YOUTUBE_LIVE_ID}?autoplay=1&controls=1`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ border: 'none', display: 'block' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(160deg, #0f1b2d 0%, #1a3a5c 100%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16,
          }}>
            <button className="atv-play-btn" onClick={() => {
              if (YOUTUBE_LIVE_ID) {
                setPlaying(true)
              } else {
                window.open(`https://www.youtube.com/@${YOUTUBE_CHANNEL}`, '_blank')
              }
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </button>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,.5)', marginBottom: 4 }}>
                {YOUTUBE_LIVE_ID ? 'Ao vivo agora' : 'Assista no YouTube'}
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>
                Atibaia TV — Redesa
              </div>
              {!YOUTUBE_LIVE_ID && (
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,.4)', marginTop: 6 }}>
                  Clique para abrir o canal no YouTube
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{
          position: 'absolute', top: 14, left: 14,
          display: 'flex', alignItems: 'center', gap: 6,
          background: '#Cd0000', color: '#fff',
          fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          padding: '4px 10px', borderRadius: 4,
        }}>
          <div style={{ width: 6, height: 6, background: '#fff', borderRadius: '50%', animation: 'atv-blink 1.2s ease-in-out infinite' }} />
          Ao Vivo
        </div>

        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,.75))',
          padding: '24px 16px 12px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <button className="atv-ctrl" onClick={() => setPlaying(p => !p)}>
            {playing
              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><polygon points="5,3 19,12 5,21"/></svg>
            }
          </button>
          <div style={{ flex: 1, height: 2, background: 'rgba(255,255,255,.2)', borderRadius: 2 }}>
            <div style={{ width: '40%', height: '100%', background: '#67AA4D', borderRadius: 2 }} />
          </div>
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.7)' }}>AO VIVO</span>
          <button className="atv-ctrl">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
              <path d="M15 8a6 6 0 0 1 0 8M17.7 5a10 10 0 0 1 0 14M5 15H3a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2l4-4v14z" fill="none"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
