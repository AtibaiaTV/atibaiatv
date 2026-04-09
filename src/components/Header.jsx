import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

// Inicio separado — logo ja linka para /
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

const css = 
export default function Header() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <style>{css}</style>
      <header className="atv-header">
        {/* Linha 1: Logo + Hamburger */}
        <div className="atv-header-top">
          <Link to="/" style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            <img className="atv-header-logo" src="/logos/logo-horizontal.png" alt="Atibaia TV" style={{ height: 32 }} />
          </Link>
          <button className={} onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>

        {/* Linhas 2 e 3: Editorias em ordem alfabetica */}
        <nav className="atv-nav-desktop">
          <div className="atv-nav-row">
            {ROW1.map(({ to, label }) => (
              <Link key={to} to={to} className={}>{label}</Link>
            ))}
          </div>
          <div className="atv-nav-row">
            {ROW2.map(({ to, label }) => (
              <Link key={to} to={to} className={}>{label}</Link>
            ))}
          </div>
        </nav>
      </header>

      {/* Menu mobile */}
      <div className={}>
        {EDITORIAS_NAV.map(({ to, label }) => (
          <Link key={to} to={to} onClick={() => setMenuOpen(false)}
            style={{ fontWeight: pathname === to ? 700 : 500, color: pathname === to ? '#Cd0000' : undefined }}>
            {label}
          </Link>
        ))}
      </div>
    </>
  )
}
