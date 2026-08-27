import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { SIZES } from './AdBanner'

var DEFAULT_DURATION_SEC = 5

/* embaralha array sem mutacao */
function shuffle(arr) {
  var a = arr.slice()
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp
  }
  return a
}

/* Rotaciona entre todos os banners ativos de um mesmo espaco, pra um banner
   novo nao ficar escondido atras de outro que carregou primeiro.

   Dois jeitos de exibir, escolhidos pelo prop `type`:
   - billboard/leaderboard: caixa larga e responsiva, imagem inteira visivel
     (sem cortar), igual ao AdBanner sozinho.
   - square (padrao): caixa quadrada fixa com a imagem preenchendo e cortando
     as bordas, como já era antes. */
export default function BannerCarousel({ banners, width, height, type }) {
  var w = width || 300
  var h = height || 300
  var size = type ? SIZES[type] : null

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
    } else {
      setList([])
    }
  }, [banners])

  /* cada banner fica na tela pelo tempo configurado no painel (durationSec) */
  useEffect(function() {
    if (list.length < 2) return
    var current = list[active] || {}
    var secs = Number(current.durationSec) > 0 ? Number(current.durationSec) : DEFAULT_DURATION_SEC
    timerRef.current = setTimeout(function() {
      setActive(function(prev) { return (prev + 1) % list.length })
    }, secs * 1000)
    return function() { clearTimeout(timerRef.current) }
  }, [list, active])

  if (!list || list.length === 0) {
    if (size) return null // billboard/leaderboard: sem banner, sem espaco reservado
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
  var linkHref = banner.linkUrl || '#'
  var isInternal = linkHref.charAt(0) === '/'

  var containerStyle = size
    ? { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: size.maxWidth, margin: '0 auto', position: 'relative', borderRadius: 6 }
    : { width: w, height: h, position: 'relative', borderRadius: 8, overflow: 'hidden', background: '#000' }

  var mediaStyle = size
    ? { maxWidth: '100%', maxHeight: size.maxHeight, width: 'auto', height: 'auto', display: 'block' }
    : { width: '100%', height: '100%', objectFit: 'cover', display: 'block' }

  var slide
  if (banner.mediaType === 'video') {
    slide = (
      <video
        key={banner.id}
        src={banner.mediaUrl}
        autoPlay muted loop playsInline
        style={mediaStyle}
      />
    )
  } else if (isInternal) {
    slide = (
      <Link key={banner.id} to={linkHref} style={{ display: 'block', width: size ? 'auto' : '100%', height: size ? 'auto' : '100%' }}>
        <img src={banner.mediaUrl} alt="Publicidade" style={mediaStyle} />
      </Link>
    )
  } else {
    slide = (
      <a key={banner.id} href={linkHref} target="_blank" rel="noopener noreferrer sponsored" style={{ display: 'block', width: size ? 'auto' : '100%', height: size ? 'auto' : '100%' }}>
        <img src={banner.mediaUrl} alt="Publicidade" style={mediaStyle} />
      </a>
    )
  }

  return (
    <div style={containerStyle}>
      {slide}

      {/* label Publicidade */}
      <span style={{
        position: 'absolute', top: 5, right: 7,
        fontSize: '0.5rem', color: size ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)',
        fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
        textShadow: size ? 'none' : '0 1px 3px rgba(0,0,0,.5)',
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
                onClick={function() { setActive(i); clearTimeout(timerRef.current) }}
                style={{
                  width: i === active ? 16 : 6,
                  height: 6, borderRadius: 3,
                  background: i === active ? (size ? '#4971B1' : '#fff') : (size ? 'rgba(73,113,177,.3)' : 'rgba(255,255,255,0.45)'),
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
