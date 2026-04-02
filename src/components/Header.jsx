import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/',          label: 'Inicio'     },
  { to: '/noticias',  label: 'Noticias'   },
  { to: '/seguranca', label: 'Seguranca'  },
  { to: '/mobilidade',label: 'Mobilidade' },
  { to: '/economia',  label: 'Economia'   },
  { to: '/cultura',   label: 'Cultura'    },
  { to: '/eventos',   label: 'Eventos'    },
  { to: '/esportes',  label: 'Esportes'   },
  { to: '/turismo',   label: 'Turismo'    },
]

const css = `
.atv-header { background: #fff; border-bottom: 1px solid #e5e7eb; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 8px rgba(0,0,0,.06); }
.atv-header-inner { max-width: 1280px; margin: 0 auto; padding: 0 2rem; display: flex; align-items: center; height: 60px; gap: 2rem; }
.atv-nav-desktop { display: flex; align-items: center; gap: 0; flex: 1; }
.atv-nav-link { padding: 0 12px; height: 60px; line-height: 60px; color: #374151; font-size: .82rem; font-weight: 500; border-bottom: 3px solid transparent; transition: all .15s; white-space: nowrap; text-decoration: none; display: block; }
.atv-nav-link:hover { color: #Cd0000; }
.atv-nav-link.active { color: #Cd0000; border-bottom-color: #Cd0000; font-weight: 600; }
.atv-live-pill { display: inline-flex; align-items: center; gap: 6px; background: #Cd0000; color: #fff; border-radius: 20px; padding: 6px 16px; font-size: .78rem; font-weight: 600; text-decoration: none; transition: background .2s; margin-left: auto; flex-shrink: 0; }
.atv-live-pill:hover { background: #a00; }
.atv-hamburger { display: none; background: none; border: none; padding: 8px; cursor: pointer; }
@media (max-width: 1000px) {
  .atv-nav-desktop { display: none !important; }
  .atv-hamburger { display: flex; flex-direction: column; gap: 5px; }
  .atv-hamburger span { width: 22px; height: 2px; background: #374151; border-radius: 2px; transition: all .2s; display: block; }
  .atv-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .atv-hamburger.open span:nth-child(2) { opacity: 0; }
  .atv-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
}
.atv-mobile-menu { position: absolute; top: 60px; left: 0; right: 0; background: #fff; border-bottom: 1px solid #e5e7eb; box-shadow: 0 8px 24px rgba(0,0,0,.1); z-index: 99; display: none; }
.atv-mobile-menu.open { display: block; }
.atv-mobile-menu a { display: block; padding: 14px 2rem; color: #1a1a2e; font-size: .9rem; font-weight: 500; border-bottom: 1px solid #f3f4f6; text-decoration: none; }
.atv-mobile-menu a:hover { background: #f9fafb; color: #Cd0000; }
@keyframes atv-blink { 0%,100%{opacity:1} 50%{opacity:.3} }
`

export default function Header() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <style>{css}</style>
      <header className="atv-header">
        <div className="atv-header-inner">
          <Link to="/" style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            <img src="/logos/logo-horizontal.png" alt="Atibaia TV" style={{ height: 36 }} />
          </Link>

          <nav className="atv-nav-desktop">
            {NAV_LINKS.map(({ to, label }) => (
              <Link key={to} to={to} className={`atv-nav-link${pathname === to ? ' active' : ''}`}>{label}</Link>
            ))}
          </nav>

          <Link to="/ao-vivo" className="atv-live-pill">
            <div style={{ width: 8, height: 8, background: '#fff', borderRadius: '50%', animation: 'atv-blink 1.2s ease-in-out infinite' }} />
            AO VIVO
          </Link>

          <button className={`atv-hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </header>

      <div className={`atv-mobile-menu${menuOpen ? ' open' : ''}`}>
        {NAV_LINKS.map(({ to, label }) => (
          <Link key={to} to={to} onClick={() => setMenuOpen(false)}
            style={{ fontWeight: pathname === to ? 700 : 500, color: pathname === to ? '#Cd0000' : undefined }}>
            {label}
          </Link>
        ))}
        <Link to="/ao-vivo" onClick={() => setMenuOpen(false)} style={{ color: '#Cd0000', fontWeight: 600 }}>AO VIVO</Link>
      </div>
    </>
  )
}
