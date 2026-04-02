import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const NAV = [
  { to: '/dashboard', label: 'Visao Geral', icon: '📊', end: true },
  { to: '/dashboard/articles', label: 'Materias', icon: '📰' },
  { to: '/dashboard/videos', label: 'Videos', icon: '🎬' },
  { to: '/dashboard/ticker', label: 'Ticker', icon: '📢' },
  { to: '/dashboard/banners', label: 'Banners', icon: '🖼️' },
]

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/dashboard/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: '#0f1b2d', color: '#fff', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
          <img src="/logos/logo-horizontal.png" alt="Atibaia TV" style={{ height: 28, filter: 'brightness(10)' }} />
          <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,.4)', marginTop: 4, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Painel Admin</div>
        </div>

        <nav style={{ flex: 1, padding: '0.75rem 0' }}>
          {NAV.map(({ to, label, icon, end }) => (
            <NavLink key={to} to={to} end={end} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 1rem', fontSize: '0.85rem', fontWeight: 500,
              color: isActive ? '#fff' : 'rgba(255,255,255,.55)',
              background: isActive ? 'rgba(73,113,177,.3)' : 'transparent',
              borderLeft: isActive ? '3px solid #4971B1' : '3px solid transparent',
              textDecoration: 'none', transition: 'all .15s',
            })}>
              <span style={{ fontSize: '1rem' }}>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,.1)' }}>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,.4)', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
          <button onClick={handleLogout} style={{
            width: '100%', padding: '8px', borderRadius: 6, border: '1px solid rgba(255,255,255,.2)',
            background: 'transparent', color: 'rgba(255,255,255,.6)', fontSize: '0.78rem',
            cursor: 'pointer', transition: 'all .15s',
          }}>
            Sair
          </button>
        </div>

        <a href="/" target="_blank" rel="noreferrer" style={{
          display: 'block', padding: '10px 1rem', borderTop: '1px solid rgba(255,255,255,.1)',
          fontSize: '0.75rem', color: 'rgba(255,255,255,.4)', textDecoration: 'none', textAlign: 'center',
        }}>
          Ver site →
        </a>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, background: '#f4f5f7', overflow: 'auto' }}>
        <div style={{ padding: '2rem' }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
