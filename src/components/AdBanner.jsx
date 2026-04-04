const SIZES = {
  billboard: { width: '100%', maxWidth: 1920, height: 80, label: 'Publicidade', ratio: '1920/200' },
  leaderboard: { width: '100%', maxWidth: 1200, height: 120, label: 'Publicidade', ratio: '1200/300' },
  square: { width: '100%', maxWidth: 300, height: 300, label: 'Publicidade', ratio: '1/1' },
  video: { width: '100%', height: 180, label: 'Video patrocinado', ratio: '16/9' },
}

export default function AdBanner({ type = 'leaderboard', src = null, video = null, href = '#', style: extraStyle = {} }) {
  const size = SIZES[type] || SIZES.leaderboard

  const containerStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '100%', maxWidth: size.maxWidth || undefined,
    height: 'auto', overflow: 'hidden', position: 'relative',
    borderRadius: 6, ...extraStyle,
  }

  if (video) {
    return (
      <div style={{ ...containerStyle, background: '#000' }}>
        <video src={video} autoPlay muted loop playsInline style={{ width: '100%', height: 'auto', display: 'block' }} />
        <span style={{ position: 'absolute', top: 4, right: 6, fontSize: '0.5rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Publicidade</span>
      </div>
    )
  }

  if (src) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer sponsored" style={{ ...containerStyle, display: 'block' }}>
        <img src={src} alt="Publicidade" style={{ width: '100%', height: 'auto', display: 'block' }} />
      </a>
    )
  }

  return (
    <div style={{ ...containerStyle, height: size.height, background: '#f3f4f6', border: '1px dashed #d1d5db' }}>
      <span style={{ fontSize: '0.65rem', fontWeight: 500, color: '#b0b7c3', letterSpacing: '0.06em' }}>{size.label}</span>
    </div>
  )
}
