import { useState } from 'react'

/**
 * Logo Atibaia TV
 * variant:
 *   'horizontal' → logo horizontal completo (header desktop)
 *   'stacked'    → logo empilhado (footer, mobile)
 *   'icon'       → só o ícone triangular
 */
export default function Logo({ variant = 'horizontal', height = 44 }) {
  const [err, setErr] = useState(false)

  const src = {
    horizontal: '/logos/logo-horizontal.png',
    stacked:    '/logos/logo-stacked.png',
    icon:       '/logos/logo-icon.png',
  }[variant] || '/logos/logo-horizontal.png'

  if (err) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width={height} height={height} viewBox="0 0 80 80" fill="none">
          <polygon points="40,4 4,72 76,72" fill="none" stroke="#4a6fa5" strokeWidth="5" strokeLinejoin="round"/>
          <polygon points="40,12 8,72 40,72" fill="#c0392b" opacity="0.88"/>
          <polygon points="40,12 72,72 40,72" fill="#4a6fa5" opacity="0.88"/>
          <polygon points="40,36 24,68 56,68" fill="#5aab3a" opacity="0.95"/>
        </svg>
        {variant !== 'icon' && (
          <div style={{ lineHeight: 1 }}>
            <span style={{ fontSize: height * 0.72, fontWeight: 700, color: '#4a6fa5' }}>Atibaia</span>
            <span style={{ fontSize: height * 0.72, fontWeight: 700, color: '#5aab3a' }}>TV</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt="Atibaia TV"
      height={height}
      style={{ objectFit: 'contain', display: 'block' }}
      onError={() => setErr(true)}
    />
  )
}
