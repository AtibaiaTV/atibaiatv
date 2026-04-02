/**
 * AdBanner — Espaços para publicidade
 *
 * Tamanhos suportados:
 *   'billboard'  → 1920×200px  (full-width, topo/rodapé)
 *   'leaderboard'→ 1200×300px  (corpo da página)
 *   'square'     → 300×300px   (sidebar)
 *   'video'      → miniatura de vídeo patrocinado
 *
 * Para ativar uma peça real, passe a prop `src` com a URL da imagem/iframe.
 * Para vídeo, passe `video` com a URL do arquivo de vídeo.
 */

const SIZES = {
  billboard: {
    width: '100%',
    maxWidth: 1920,
    height: 100,
    label: 'Publicidade · 1920×200px',
    ratio: '1920/200',
  },
  leaderboard: {
    width: '100%',
    maxWidth: 1200,
    height: 150,
    label: 'Publicidade · 1200×300px',
    ratio: '1200/300',
  },
  square: {
    width: 300,
    height: 300,
    label: 'Publicidade · 300×300px',
    ratio: '300/300',
  },
  video: {
    width: '100%',
    height: 180,
    label: 'Vídeo patrocinado',
    ratio: '16/9',
  },
}

export default function AdBanner({ type = 'leaderboard', src = null, video = null, href = '#', style: extraStyle = {} }) {
  const size = SIZES[type] || SIZES.leaderboard

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: size.width,
    maxWidth: size.maxWidth || undefined,
    height: size.height,
    background: 'repeating-linear-gradient(45deg, #f3f4f6, #f3f4f6 10px, #e9eaec 10px, #e9eaec 20px)',
    border: '1px dashed #d1d5db',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    cursor: 'pointer',
    textDecoration: 'none',
    ...extraStyle,
  }

  const labelStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    pointerEvents: 'none',
  }

  // Se video fornecido, renderiza o vídeo
  if (video) {
    return (
      <div style={{ ...containerStyle, background: '#000', border: 'none', height: 'auto', aspectRatio: type === 'square' ? '1/1' : '16/9' }}>
        <video
          src={video}
          autoPlay
          muted
          loop
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <span style={{
          position: 'absolute', top: 6, right: 8,
          fontSize: '0.55rem', color: 'rgba(255,255,255,0.7)',
          fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          Publicidade
        </span>
      </div>
    )
  }

  // Se src fornecido, renderiza a peça real (imagem)
  if (src) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer sponsored" style={{ ...containerStyle, background: 'transparent', border: 'none' }}>
        <img src={src} alt="Publicidade" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </a>
    )
  }

  // Placeholder visual
  return (
    <div style={containerStyle}>
      <div style={labelStyle}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
          <rect x="2" y="4" width="20" height="16" rx="2"/>
          <path d="M8 12h8M12 8v8" strokeLinecap="round"/>
        </svg>
        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#9ca3af', letterSpacing: '0.05em' }}>
          {size.label}
        </span>
        <span style={{ fontSize: '0.62rem', color: '#b0b7c3' }}>
          Espaço disponível para anúncios
        </span>
      </div>

      <span style={{
        position: 'absolute', top: 6, right: 8,
        fontSize: '0.55rem', color: '#b0b7c3',
        fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>
        Anúncio
      </span>
    </div>
  )
}
