import { Link } from 'react-router-dom'

export const SIZES = {
  billboard:   { maxWidth: 1920, maxHeight: 180, label: 'Publicidade' },
  leaderboard: { maxWidth: 970,  maxHeight: 180, label: 'Publicidade' },
  square:      { maxWidth: 300,  maxHeight: 300, label: 'Publicidade' },
  video:       { maxWidth: 1200, maxHeight: 360, label: 'Video patrocinado' },
}

export default function AdBanner({ type = 'leaderboard', src = null, video = null, href = '#', style: extraStyle = {} }) {
  const size = SIZES[type] || SIZES.leaderboard

  const containerStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '100%', maxWidth: size.maxWidth, margin: '0 auto',
    overflow: 'hidden', position: 'relative', borderRadius: 6, ...extraStyle,
  }

  const mediaStyle = {
    maxWidth: '100%', maxHeight: size.maxHeight,
    width: 'auto', height: 'auto', display: 'block',
  }

  if (video) {
    return (
      <div style={{ ...containerStyle, background: '#000' }}>
        <video src={video} autoPlay muted loop playsInline style={mediaStyle} />
        <span style={{ position: 'absolute', top: 4, right: 6, fontSize: '0.5rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Publicidade</span>
      </div>
    )
  }

  if (src) {
    const isInternal = href && href.charAt(0) === '/'
    if (isInternal) {
      return (
        <Link to={href} style={containerStyle}>
          <img src={src} alt="Publicidade" style={mediaStyle} />
        </Link>
      )
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer sponsored" style={containerStyle}>
        <img src={src} alt="Publicidade" style={mediaStyle} />
      </a>
    )
  }

  return (
    <div style={{ ...containerStyle, height: 90, background: '#f3f4f6', border: '1px dashed #d1d5db' }}>
      <span style={{ fontSize: '0.65rem', fontWeight: 500, color: '#b0b7c3', letterSpacing: '0.06em' }}>{size.label}</span>
    </div>
  )
}
