import { useRef } from 'react'

var css = [
  '.atv-shorts-track { display:flex; gap:14px; overflow-x:auto; scroll-behavior:smooth; scroll-snap-type:x proximity; padding-bottom:4px; -ms-overflow-style:none; scrollbar-width:none; }',
  '.atv-shorts-track::-webkit-scrollbar { display:none; }',
  '.atv-shorts-card { position:relative; flex:0 0 auto; width:170px; aspect-ratio:9/16; border-radius:14px; overflow:hidden; scroll-snap-align:start; cursor:pointer; background:#111; box-shadow:0 2px 10px rgba(0,0,0,.12); transition:transform .18s ease; }',
  '.atv-shorts-card:hover { transform:translateY(-4px); }',
  '.atv-shorts-card img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; transition:transform .3s ease; }',
  '.atv-shorts-card:hover img { transform:scale(1.05); }',
  '.atv-shorts-arrow { width:34px; height:34px; border-radius:50%; border:1px solid #e5e7eb; background:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:background .15s, border-color .15s; flex-shrink:0; }',
  '.atv-shorts-arrow:hover { background:#f3f4f6; border-color:#cc0000; }',
  '@media (max-width:640px) { .atv-shorts-card { width:130px; } }',
].join('\n')

function extractYtId(url) {
  if (!url) return null
  var m = url.match(/(?:youtu\.be\/|[?&]v=)([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
}

function Arrow({ dir, onClick }) {
  return (
    <button className="atv-shorts-arrow" onClick={onClick} aria-label={dir === 'left' ? 'Anterior' : 'Proximo'}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        {dir === 'left'
          ? <path d="M15 6l-6 6 6 6" stroke="#374151" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          : <path d="M9 6l6 6-6 6" stroke="#374151" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>}
      </svg>
    </button>
  )
}

export default function ShortVideos({ videos }) {
  var trackRef = useRef(null)

  if (!videos || videos.length === 0) return null

  function scrollBy(delta) {
    if (trackRef.current) trackRef.current.scrollBy({ left: delta, behavior: 'smooth' })
  }

  return (
    <div className="atv-container" style={{ paddingTop: '0.5rem', paddingBottom: '2rem' }}>
      <style>{css}</style>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Videos curtos</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <Arrow dir="left" onClick={function() { scrollBy(-360) }} />
          <Arrow dir="right" onClick={function() { scrollBy(360) }} />
        </div>
      </div>

      <div className="atv-shorts-track" ref={trackRef}>
        {videos.map(function(video) {
          var ytId = extractYtId(video.youtubeUrl)
          var isVideoFile = video.thumbnailUrl && /\.(mp4|webm|mov)$/i.test(video.thumbnailUrl)
          var thumbSrc = (!isVideoFile && video.thumbnailUrl)
            ? video.thumbnailUrl
            : ytId ? ('https://img.youtube.com/vi/' + ytId + '/hqdefault.jpg') : null

          return (
            <div
              key={video.id}
              className="atv-shorts-card"
              onClick={function() { if (video.youtubeUrl) window.open(video.youtubeUrl, '_blank', 'noreferrer') }}
            >
              {thumbSrc && <img src={thumbSrc} alt={video.title} onError={function(e) { e.currentTarget.style.display = 'none' }} />}

              {/* selo */}
              <span style={{
                position: 'absolute', top: 10, left: 10, zIndex: 1,
                background: '#Cd0000', color: '#fff', fontSize: '0.6rem', fontWeight: 700,
                padding: '3px 7px', borderRadius: 4, letterSpacing: '0.02em',
              }}>atibaiatv</span>

              {/* duracao */}
              {video.duration && (
                <span style={{
                  position: 'absolute', top: 10, right: 10, zIndex: 1,
                  background: 'rgba(0,0,0,.6)', color: '#fff', fontSize: '0.62rem', fontWeight: 600,
                  padding: '2px 7px', borderRadius: 4,
                }}>{video.duration}</span>
              )}

              {/* play */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 1,
                width: 38, height: 38, borderRadius: '50%', background: 'rgba(0,0,0,.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff"><polygon points="6,3 20,12 6,21" /></svg>
              </div>

              {/* gradiente + titulo */}
              <div style={{
                position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 1,
                padding: '28px 10px 10px', background: 'linear-gradient(to top, rgba(0,0,0,.88) 0%, rgba(0,0,0,0) 100%)',
              }}>
                <span style={{ color: '#fff', fontSize: '0.74rem', fontWeight: 600, lineHeight: 1.3, display: 'block' }}>
                  {video.title}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
