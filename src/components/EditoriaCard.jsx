import { Link } from 'react-router-dom'
import { NEWS } from '../data'

// Ícones SVG por editoria
const ICONS = {
  noticias: (color) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2-2zM4 6H2"/>
      <path d="M8 6h8M8 10h8M8 14h4"/>
    </svg>
  ),
  cultura: (color) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <path d="M9 18V5l12-2v13"/>
      <circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
    </svg>
  ),
  eventos: (color) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  ),
  esportes: (color) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 3a9 9 0 0 1 6.36 15.36M5.64 5.64A9 9 0 0 0 12 21" strokeLinecap="round"/>
    </svg>
  ),
  turismo: (color) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <path d="M3 17l4-8 4 4 3-6 4 10"/>
      <path d="M2 20h20"/>
    </svg>
  ),
  economia: (color) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/>
      <path d="M12 6v2m0 8v2M9 9c0-1.1.9-2 2-2h2a2 2 0 0 1 0 4h-2a2 2 0 0 0 0 4h2a2 2 0 0 0 2-2"/>
    </svg>
  ),
}

const css = `
.editoria-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: transform .2s, box-shadow .2s, border-color .2s;
  text-decoration: none;
  display: block;
}
.editoria-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}
`

export default function EditoriaCard({ editoria }) {
  const { slug, label, color, bg, description } = editoria
  const IconFn = ICONS[slug] || ICONS.noticias

  // Conta notícias desta editoria
  const count = NEWS.filter(n => n.category === label).length

  return (
    <>
      <style>{css}</style>
      <Link to={`/${slug}`} className="editoria-card"
        style={{ borderTopColor: color, borderTopWidth: 3 }}>
        {/* Ícone */}
        <div style={{
          width: 52, height: 52, borderRadius: 12,
          background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 14,
        }}>
          {IconFn(color)}
        </div>

        {/* Título */}
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a2e', marginBottom: 6 }}>
          {label}
        </h3>

        {/* Descrição */}
        <p style={{ fontSize: '0.78rem', color: '#6b7280', lineHeight: 1.5, marginBottom: 14 }}>
          {description}
        </p>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.06em',
            background: bg, color: color,
            padding: '3px 10px', borderRadius: 20,
          }}>
            {count} matérias
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </Link>
    </>
  )
}
