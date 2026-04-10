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

/* altura de cada linha de nav — usada tanto no CSS quanto no logo */
var NAV_ROW_H = 36

var css = [
  '.atv-header { background:#fff; border-bottom:1px solid #e5e7eb; position:sticky; top:0; z-index:100; box-shadow:0 2px 8px rgba(0,0,0,.06); }',

  /* container principal: logo + coluna de navs lado a lado */
  '.atv-header-inner { max-width:1280px; margin:0 auto; padding:0 1.25rem; display:flex; align-items:center; }',

  /* logo à esquerda, centralizado verticalmente */
  '.atv-logo-wrap { flex-shrink:0; display:flex; align-items:center; padding-right:28px; border-right:1px solid #e5e7eb; height:' + (NAV_ROW_H * 2) + 'px; }',
  '.atv-header-logo { height:48px; display:block; }',

  /* coluna de navs ocupa o restante da largura */
  '.atv-nav-col { flex:1; }',

  /* cada linha de nav tem altura igual */
  '.atv-nav-row { display:flex; align-items:center; justify-content:center; height:' + NAV_ROW_H + 'px; }',
  '.atv-nav-row + .atv-nav-row { border-top:1px solid #f0f0f0; }',

  /* links */
  '.atv-nav-link { padding:0 11px; height:' + NAV_ROW_H + 'px; line-height:' + NAV_ROW_H + 'px; color:#374151; font-size:.79rem; font-weight:500; border-bottom:2px solid transparent; transition:color .15s,border-color .15s; white-space:nowrap; text-decoration:none; display:block; }',
  '.atv-nav-link:hover { color:#cc0000; }',
  '.atv-nav-link.active { color:#cc0000; border-bottom-color:#cc0000; font-weight:700; }',

  /* hamburger — escondido no desktop */
  '.atv-hamburger { display:none; background:none; border:none; padding:8px; cursor:pointer; margin-left:auto; }',

  /* mobile */
  '@media (max-width:900px) {',
  '  .atv-nav-col { display:none; }',
  '  .atv-logo-wrap { border-right:none; padding-right:0; height:52px; }',
  '  .atv-header-logo { height:32px !important; }',
  '  .atv-hamburger { display:flex; flex-direction:column; gap:5px; }',
  '  .atv-hamburger span { width:22px; height:2px; background:#374151; border-radius:2px; transition:all .2s; display:block; }',
  '  .atv-hamburger.open span:nth-child(1) { transform:translateY(7px) rotate(45deg); }',
  '  .atv-hamburger.open span:nth-child(2) { opacity:0; }',
  '  .atv-hamburger.open span:nth-child(3) { transform:translateY(-7px) rotate(-45deg); }',
  '}',

  /* mobile drawer */
  '.atv-mobile-menu { position:fixed; top:52px; left:0; right:0; bottom:0; background:#fff; z-index:99; display:none; overflow-y:auto; }',
  '.atv-mobile-menu.open { display:block; }',
  '.atv-mobile-menu a { display:flex; align-items:center; padding:14px 20px; color:#1a1a2e; font-size:.92rem; font-weight:500; border-bottom:1px solid #f3f4f6; text-decoration:none; }',
  '.atv-mobile-menu a:hover { background:#f9fafb; color:#cc0000; }',
].join('\n')

export default function Header() {
  var loc = useLocation()
  var pathname = loc.pathname
  var menuState = useState(false)
  var menuOpen = menuState[0]
  var setMenuOpen = menuState[1]

  return (
    <>
      <style>{css}</style>
      <header className="atv-header">
        <div className="atv-header-inner">

          {/* Logo */}
          <Link to="/" className="atv-logo-wrap">
            <img
              className="atv-header-logo"
              src="/logos/logo-horizontal.png"
              alt="Atibaia TV"
            />
          </Link>

          {/* 2 linhas de editorias */}
          <nav className="atv-nav-col">
            <div className="atv-nav-row">
              {ROW1.map(function(item) {
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={'atv-nav-link' + (pathname === item.to ? ' active' : '')}
                  >{item.label}</Link>
                )
              })}
            </div>
            <div className="atv-nav-row">
              {ROW2.map(function(item) {
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={'atv-nav-link' + (pathname === item.to ? ' active' : '')}
                  >{item.label}</Link>
                )
              })}
            </div>
          </nav>

          {/* Hamburger mobile */}
          <button
            className={'atv-hamburger' + (menuOpen ? ' open' : '')}
            onClick={function() { setMenuOpen(function(o) { return !o }) }}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>

        </div>
      </header>

      {/* Drawer mobile */}
      <div className={'atv-mobile-menu' + (menuOpen ? ' open' : '')}>
        {EDITORIAS_NAV.map(function(item) {
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={function() { setMenuOpen(false) }}
              style={{ fontWeight: pathname === item.to ? 700 : 500, color: pathname === item.to ? '#cc0000' : undefined }}
            >{item.label}</Link>
          )
        })}
      </div>
    </>
  )
}
