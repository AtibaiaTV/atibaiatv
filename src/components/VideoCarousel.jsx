import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

var css = [
  '.atv-vcar { position:relative; height:100%; min-height:240px; border-radius:12px; overflow:hidden; background:#111; box-shadow:0 2px 10px rgba(0,0,0,.12); }',
  '.atv-vcar-slide { position:absolute; inset:0; opacity:0; transition:opacity .5s ease; cursor:pointer; pointer-events:none; }',
  '.atv-vcar-slide.on { opacity:1; pointer-events:auto; }',
  '.atv-vcar-slide img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }',
  '.atv-vcar-arrow { position:absolute; top:50%; transform:translateY(-50%); z-index:3; width:30px; height:30px; border-radius:50%; border:none; background:rgba(0,0,0,.5); color:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; opacity:0; transition:opacity .2s; }',
  '.atv-vcar:hover .atv-vcar-arrow, .atv-vcar-arrow:focus-visible { opacity:1; }',
  '@media (hover:none) { .atv-vcar-arrow { opacity:.85; } }',
].join('\n')

function extractYtId(url) {
  if (!url) return null
  var m = url.match(/(?:youtu\.be\/|[?&]v=)([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
}

function thumbOf(video) {
  var ytId = extractYtId(video.youtubeUrl)
  var isVideoFile = video.thumbnailUrl && /\.(mp4|webm|mov)$/i.test(video.thumbnailUrl)
  if (!isVideoFile && video.thumbnailUrl) return video.thumbnailUrl
  return ytId ? 'https://img.youtube.com/vi/' + ytId + '/hqdefault.jpg' : null
}

export default function VideoCarousel({ videos }) {
  var navigate = useNavigate()
  var indexState = useState(0)
  var index = indexState[0]
  var setIndex = indexState[1]
  var pausedState = useState(false)
  var paused = pausedState[0]
  var setPaused = pausedState[1]
  var touchX = useRef(null)

  var total = videos.length

  useEffect(function() {
    if (total < 2 || paused) return undefined
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    var timer = setInterval(function() { setIndex(function(i) { return (i + 1) % total }) }, 5000)
    return function() { clearInterval(timer) }
  }, [total, paused])

  if (total === 0) return null

  function go(delta) { setIndex(function(i) { return (i + delta + total) % total }) }

  function open(video) {
    if (video.videoUrl) navigate('/video/' + video.id)
    else if (video.youtubeUrl) window.open(video.youtubeUrl, '_blank', 'noreferrer')
  }

  return (
    <div
      className="atv-vcar"
      onMouseEnter={function() { setPaused(true) }}
      onMouseLeave={function() { setPaused(false) }}
      onTouchStart={function(e) { touchX.current = e.touches[0].clientX }}
      onTouchEnd={function(e) {
        if (touchX.current === null) return
        var dx = e.changedTouches[0].clientX - touchX.current
        touchX.current = null
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
      }}
    >
      <style>{css}</style>

      {videos.map(function(video, i) {
        var thumb = thumbOf(video)
        return (
          <div key={video.id} className={'atv-vcar-slide' + (i === index ? ' on' : '')} onClick={function() { open(video) }} aria-hidden={i !== index}>
            {thumb && <img src={thumb} alt={video.title} loading={i === 0 ? 'eager' : 'lazy'} onError={function(e) { e.currentTarget.style.display = 'none' }} />}

            <div style={{
              position: 'absolute', top: '42%', left: '50%', transform: 'translate(-50%,-50%)',
              width: 46, height: 46, borderRadius: '50%', background: 'rgba(0,0,0,.55)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><polygon points="6,3 20,12 6,21" /></svg>
            </div>

            {video.duration && (
              <span style={{
                position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,.65)', color: '#fff',
                fontSize: '0.64rem', fontWeight: 600, padding: '2px 7px', borderRadius: 4,
              }}>{video.duration}</span>
            )}

            <div style={{
              position: 'absolute', left: 0, right: 0, bottom: 0,
              padding: '38px 14px 30px', background: 'linear-gradient(to top, rgba(0,0,0,.9) 0%, rgba(0,0,0,0) 100%)',
            }}>
              <span style={{
                color: '#fff', fontSize: '0.88rem', fontWeight: 700, lineHeight: 1.3, display: '-webkit-box',
                WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>{video.title}</span>
            </div>
          </div>
        )
      })}

      <span style={{
        position: 'absolute', top: 10, left: 10, zIndex: 2, background: '#Cd0000', color: '#fff',
        fontSize: '0.62rem', fontWeight: 700, padding: '3px 8px', borderRadius: 4, letterSpacing: '0.04em',
      }}>▶ VÍDEOS</span>

      {total > 1 && (
        <>
          <button type="button" className="atv-vcar-arrow" style={{ left: 8 }} onClick={function() { go(-1) }} aria-label="Vídeo anterior">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" className="atv-vcar-arrow" style={{ right: 8 }} onClick={function() { go(1) }} aria-label="Próximo vídeo">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 10, zIndex: 3, display: 'flex', justifyContent: 'center', gap: 6 }}>
            {videos.map(function(video, i) {
              return (
                <button
                  key={video.id}
                  type="button"
                  onClick={function() { setIndex(i) }}
                  aria-label={'Ir para o vídeo ' + (i + 1)}
                  style={{
                    width: i === index ? 18 : 7, height: 7, borderRadius: 4, border: 'none', padding: 0, cursor: 'pointer',
                    background: i === index ? '#fff' : 'rgba(255,255,255,.5)', transition: 'width .25s, background .25s',
                  }}
                />
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
