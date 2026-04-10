import { useState, useEffect, useRef } from 'react'

var INTERVAL_MS = 5000

/* embaralha array sem mutacao */
function shuffle(arr) {
  var a = arr.slice()
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp
  }
  return a
}

export default function BannerCarousel({ banners, width, height }) {
  var w = width || 300
  var h = height || 300

  var activeState = useState(0)
  var active = activeState[0]
  var setActive = activeState[1]

  var listState = useState([])
  var list = listState[0]
  var setList = listState[1]

  var timerRef = useRef(null)

  useEffect(function() {
    if (banners && banners.length > 0) {
      setList(shuffle(banners))
      setActive(0)
    }
  }, [banners])

  useEffect(function() {
    if (list.length < 2) return
    timerRef.current = setInterval(function() {
      setActive(function(prev) { return (prev + 1) % list.length })
    }, INTERVAL_MS)
    return function() { clearInterval(timerRef.current) }
  }, [list])

  if (!list || list.length === 0) {
    return (
      <div style={{
        width: w, height: h, background: '#f3f4f6',
        border: '1px dashed #d1d5db', borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: '0.65rem', color: '#b0b7c3', letterSpacing: '0.06em' }}>Publicidade</span>
      </div>
    )
  }

  var banner = list[active]

  return (
    <div style={{ width: w, height: h, position: 'relative', borderRadius: 8, overflow: 'hidden', background: '#000' }}>

      {/* slide */}
      {banner.mediaType === 'video' ? (
        <video
          key={banner.id}
          src={banner.mediaUrl}
          autoPlay muted loop playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <a
          key={banner.id}
          href={banner.linkUrl || '#'}
          target="_blank"
          rel="noopener noreferrer sponsored"
          style={{ display: 'block', width: '100%', height: '100%' }}
        >
          <img
            src={banner.mediaUrl}
            alt="Publicidade"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </a>
      )}

      {/* label Publicidade */}
      <span style={{
        position: 'absolute', top: 5, right: 7,
        fontSize: '0.5rem', color: 'rgba(255,255,255,0.6)',
        fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
        textShadow: '0 1px 3px rgba(0,0,0,.5)',
      }}>Publicidade</span>

      {/* dots (quando há mais de 1 banner) */}
      {list.length > 1 && (
        <div style={{
          position: 'absolute', bottom: 7, left: 0, right: 0,
          display: 'flex', justifyContent: 'center', gap: 5,
        }}>
          {list.map(function(_, i) {
            return (
              <button
                key={i}
                onClick={function() { setActive(i); clearInterval(timerRef.current) }}
                style={{
                  width: i === active ? 16 : 6,
                  height: 6, borderRadius: 3,
                  background: i === active ? '#fff' : 'rgba(255,255,255,0.45)',
                  border: 'none', padding: 0, cursor: 'pointer',
                  transition: 'all .3s',
                }}
              />
            )
          })}
        </div>
      )}

    </div>
  )
}
