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
  /* ── Header container ── */
  '.atv-header { background: #fff; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 8px rgba(0,0,0,.08); }',

  /* ── Nav rows (acima e abaixo do logo) ── */
  '.atv-nav-row { background: #cc0000; }',
  '.atv-nav-row-inner { max-width: 1280px; margin: 0 auto; padding: 0 1rem; display: flex; align-items: center; justify-content: center; flex-wrap: wrap; }',
  '.atv-nav-link { padding: 0 13px; height: 34px; line-height: 34px; color: #fff; font-size: .78rem; font-weight: 600; letter-spacing: .02em; border-bottom: 2px solid transparent; transition: all .15s; white-space: nowrap; text-decoration: none; display: block; text-transform: uppercase; }',
  '.atv-nav-link:hover { color: #ffe0e0; border-bottom-color: rgba(255,255,255,.5); }',
  '.atv-nav-link.active { color: #fff; border-bottom-color: #fff; }',

  /* ── Logo row (centro do header) ── */
  '.atv-logo-row { max-width: 1280px; margin: 0 auto; padding: 0 1rem; display: flex; align-items: center; justify-content: center; height: 80px; position: relative; }',
  '.atv-header-logo { height: 56px; display: block; }',

  /* ── Hamburger (so mobile) ── */
  '.atv-hamburger { display: none; background: none; border: none; padding: 8px; cursor: pointer; position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); }',

  /* ── Mobile ── */
  '@media (max-width: 900px) {',
  '  .atv-nav-row { display: none !important; }',
  '  .atv-hamburger { display: flex; flex-direction: column; gap: 5px; }',
  '  .atv-hamburger span { width: 22px; height: 2px; background: #374151; border-radius: 2px; transition: all .2s; display: block; }',
  '  .atv-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }',
  '  .atv-hamburger.open span:nth-child(2) { opacity: 0; }',
  '  .atv-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }',
  '  .atv-logo-row { justify-content: center; height: 64px; }',
  '  .atv-header-logo { height: 40px !important; }',
  '}',

  /* ── Mobile drawer ── */
  '.atv-mobile-menu { position: fixed; top: 64px; left: 0; right: 0; bottom: 0; background: #fff; z-index: 99; display: none; overflow-y: auto; }',
  '.atv-mobile-menu.open { display: block; }',
  '.atv-mobile-menu a { display: flex; align-items: center; padding: 14px 20px; color: #1a1a2e; font-size: .92rem; font-weight: 500; border-bottom: 1px solid #f3f4f6; text-decoration: none; }',
  '.atv-mobile-menu a:hover { background: #f9fafb; color: #cc0000; }',
].join('\n')

export default function Header() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <style>{css}</style>
      <header className="atv-header">

        {/* Linha 1 — editorias (cima) */}
        <nav className="atv-nav-row">
          <div className="atv-nav-row-inner">
            {ROW1.map(function(item) {
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={'atv-nav-link' + (pathname === item.to ? ' active' : '')}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Logo centralizado */}
        <div className="atv-logo-row">
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              className="atv-header-logo"
              src="/logos/logo-horizontal.png"
              alt="Atibaia TV"
            />
          </Link>
          <button
            className={'atv-hamburger' + (menuOpen ? ' open' : '')}
            onClick={function() { setMenuOpen(function(o) { return !o }) }}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>

        {/* Linha 2 — editorias (baixo) */}
        <nav className="atv-nav-row">
          <div className="atv-nav-row-inner">
            {ROW2.map(function(item) {
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={'atv-nav-link' + (pathname === item.to ? ' active' : '')}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>

      </header>

      {/* Menu mobile */}
      <div className={'atv-mobile-menu' + (menuOpen ? ' open' : '')}>
        {EDITORIAS_NAV.map(function(item) {
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={function() { setMenuOpen(false) }}
              style={{ fontWeight: pathname === item.to ? 700 : 500, color: pathname === item.to ? '#cc0000' : undefined }}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </>
  )
}
