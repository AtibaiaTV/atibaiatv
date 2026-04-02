import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo'

const NAV_LINKS = [
  { to: '/',          label: 'Início'           },
  { to: '/noticias',  label: 'Notícias'         },
  { to: '/seguranca', label: 'Segurança'        },
  { to: '/mobilidade',label: 'Mobilidade'       },
  { to: '/economia',  label: 'Economia'         },
  { to: '/cultura',   label: 'Cultura'          },
  { to: '/eventos',   label: 'Eventos'          },
  { to: '/esportes',  label: 'Esportes'         },
]

const css = `
.atv-nav-link {
  display: block; padding: 0 11px; height: 68px; line-height: 68px;
  color: var(--muted); font-size: .8rem; font-weight: 500;
  border-bottom: 3px solid transparent;
  transition: color .2s, border-color .2s; white-space: nowrap;
}
.atv-nav-link:hover { color: var(--blue); }
.atv-nav-link.active { color: var(--blue); border-bottom-color: var(--blue); }
.atv-live-btn {
  display: inline-flex !important; align-items: center; gap: 6px;
  background: var(--green); color: #fff !important;
  border-radius: 6px; padding: 0 14px !important;
  height: 34px; font-size: .8rem; font-weight: 600;
  margin: 17px 0 0 6px; border-bottom: none !important;
  transition: background .2s; line-height: 34px !important;
}
.atv-live-btn:hover { background: var(--green-dark) !important; }
.atv-hamburger { display: none; background: none; border: none; padding: 8px; cursor: pointer; }
@media (max-width: 1000px) {
  .atv-nav-desktop { display: none; }
  .atv-hamburger { display: flex; flex-direction: column; gap: 5px; }
  .atv-hamburger span { width: 22px; height: 2px; background: var(--muted); border-radius: 2px; transition: all .2s; display: block; }
  .atv-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .atv-hamburger.open span:nth-child(2) { opacity: 0; }
  .atv-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
}
.atv-mobile-menu { position: absolute; top: 68px; left: 0; right: 0; background: #fff; border-bottom: 1px solid var(--border); box-shadow: 0 8px 24px rgba(0,0,0,.1); z-index: 99; display: none; }
.atv-mobile-menu.open { display: block; }
.atv-mobile-menu a { display: block; padding: 14px 2rem; color: var(--text); font-size: .9rem; font-weight: 500; border-bottom: 1px solid var(--border); transition: background .15s; }
.atv-mobile-menu a:hover { background: var(--surface); color: var(--blue); }
.atv-mobile-menu a.live-mobile { color: var(--green); font-weight: 600; }
`

export default function Header() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <style>{css}</style>
      <header style={{
        background: '#fff', borderBottom: '1px solid var(--border)',
        padding: '0 2rem', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 68,
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 1px 4px rgba(0,0,0,.05)',
      }}>
        <Link to="/" style={{ flexShrink: 0 }}>
          <Logo variant="horizontal" height={40} />
        </Link>

        <nav className="atv-nav-desktop">
          <ul style={{ display: 'flex', listStyle: 'none', alignItems: 'center' }}>
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className={`atv-nav-link${pathname === to ? ' active' : ''}`}>{label}</Link>
              </li>
            ))}
            <li>
              <Link to="/ao-vivo" className="atv-nav-link atv-live-btn">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff"><polygon points="5,3 19,12 5,21"/></svg>
                Ao Vivo
              </Link>
            </li>
          </ul>
        </nav>

        <button className={`atv-hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </header>

      <div className={`atv-mobile-menu${menuOpen ? ' open' : ''}`}>
        {NAV_LINKS.map(({ to, label }) => (
          <Link key={to} to={to} onClick={() => setMenuOpen(false)}
            style={{ fontWeight: pathname === to ? 700 : 500, color: pathname === to ? 'var(--blue)' : undefined }}>
            {label}
          </Link>
        ))}
        <Link to="/ao-vivo" className="live-mobile" onClick={() => setMenuOpen(false)}>▶ Ao Vivo</Link>
      </div>
    </>
  )
}
