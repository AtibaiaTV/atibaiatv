import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const EDITORIAS_NAV = [
  { to: '/alimentacao', label: 'Alimentacao' },
  { to: '/brasil',      label: 'Brasil'      },
  { to: '/cidade',      label: 'Cidade'      },
  { to: '/cultura',     label: 'Cultura'     },
  { to: '/economia',    label: 'Economia'    },
  { to: '/educacao',    label: 'Educacao'    },
  { to: '/esportes',    label: 'Esportes'    },
  { to: '/eventos',     label: 'Eventos'     },
  { to: '/mobilidade',  label: 'Mobilidade'  },
  { to: '/mundo',       label: 'Mundo'       },
  { to: '/noticias',    label: 'Noticias'    },
  { to: '/politica',    label: 'Politica'    },
  { to: '/saude',       label: 'Saude'       },
  { to: '/seguranca',   label: 'Seguranca'   },
  { to: '/turismo',     label: 'Turismo'     },
  { to: '/zeladoria',   label: 'Zeladoria'   },
]

const ROW1 = EDITORIAS_NAV.slice(0, 8)
const ROW2 = EDITORIAS_NAV.slice(8)

const css = [
  '.atv-header { background: #fff; border-bottom: 1px solid #e5e7eb; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 8px rgba(0,0,0,.06); }',
  '.atv-header-top { max-width: 1280px; margin: 0 auto; padding: 0 1rem; display: flex; align-items: center; justify-content: space-between; height: 52px; }',
  '.atv-nav-desktop { border-top: 1px solid #f3f4f6; background: #fafafa; }',
  '.atv-nav-row { max-width: 1280px; margin: 0 auto; display: flex; align-items: center; justify-content: center; }',
  '.atv-nav-row + .atv-nav-row { border-top: 1px solid #f0f0f0; }',
  '.atv-nav-link { padding: 0 12px; height: 32px; line-height: 32px; color: #374151; font-size: .80rem; font-weight: 500; border-bottom: 2px solid transparent; transition: all .15s; white-space: nowrap; text-decoration: none; display: block; }',
  '.atv-nav-link:hover { color: #Cd0000; }',
  '.atv-nav-link.active { color: #Cd0000; border-bottom-color: #Cd0000; font-weight: 700; }',
  '.atv-hamburger { display: none; background: none; border: none; padding: 8px; cursor: pointer; }',
  '@media (max-width: 900px) {',
  '  .atv-nav-desktop { display: none !important; }',
  '  .atv-hamburger { display: flex; flex-direction: column; gap: 4px; }',
  '  .atv-hamburger span { width: 20px; height: 2px; background: #374151; border-radius: 2px; transition: all .2s; display: block; }',
  '  .atv-hamburger.open span:nth-child(1) { transform: translateY(6px) rotate(45deg); }',
  '  .atv-hamburger.open span:nth-child(2) { opacity: 0; }',
  '  .atv-hamburger.open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }',
  '  .atv-header-top { padding: 0 12px; }',
  '  .atv-header-logo { height: 28px !important; }',
  '}',
  '.atv-mobile-menu { position: fixed; top: 52px; left: 0; right: 0; bottom: 0; background: #fff; z-index: 99; display: none; overflow-y: auto; }',
  '.atv-mobile-menu.open { display: block; }',
  '.atv-mobile-menu a { display: flex; align-items: center; padding: 14px 20px; color: #1a1a2e; font-size: .92rem; font-weight: 500; border-bottom: 1px solid #f3f4f6; text-decoration: none; }',
  '.atv-mobile-menu a:hover, .atv-mobile-menu a:active { background: #f9fafb; color: #Cd0000; }',
  '@keyframes atv-blink { 0%,100%{opacity:1} 50%{opacity:.3} }',
].join('\n')

export default function Header() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <style>{css}</style>
      <header className="atv-header">
        <div className="atv-header-top">
          <Link to="/" style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            <img className="atv-header-logo" src="/logos/logo-horizontal.png" alt="Atibaia TV" style={{ height: 32 }} />
          </Link>
          <button
            className={'atv-hamburger' + (menuOpen ? ' open' : '')}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>

        <nav className="atv-nav-desktop">
          <div className="atv-nav-row">
            {ROW1.map(({ to, label }) => (
              <Link key={to} to={to} className={'atv-nav-link' + (pathname === to ? ' active' : '')}>
                {label}
              </Link>
            ))}
          </div>
          <div className="atv-nav-row">
            {ROW2.map(({ to, label }) => (
              <Link key={to} to={to} className={'atv-nav-link' + (pathname === to ? ' active' : '')}>
                {label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <div className={'atv-mobile-menu' + (menuOpen ? ' open' : '')}>
        {EDITORIAS_NAV.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            onClick={() => setMenuOpen(false)}
            style={{ fontWeight: pathname === to ? 700 : 500, color: pathname === to ? '#Cd0000' : undefined }}
          >
            {label}
          </Link>
        ))}
      </div>
    </>
  )
}
