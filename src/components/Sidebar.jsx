import { SCHEDULE, TAG_STYLES } from '../data'

const CATEGORY_ICONS = {
  Notícias: (color = '#1a6fa8') => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <rect x="2" y="7" width="20" height="15" rx="2"/>
      <path d="M16 3l-4 4-4-4"/>
    </svg>
  ),
  Variedades: (color = '#b71c5b') => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>
    </svg>
  ),
  Cultura: (color = '#6c3fc5') => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M9 18V5l12-2v13"/>
      <circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
    </svg>
  ),
  Eventos: (color = '#2d7a14') => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  ),
  Esportes: (color = '#c47a00') => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 3a9 9 0 0 1 6.36 15.36M5.64 5.64A9 9 0 0 0 12 21"/>
    </svg>
  ),
}

const ICON_BG = {
  Notícias: '#e8f4fd',
  Variedades: '#fce4ec',
  Cultura: '#f0eafa',
  Eventos: '#edf7e8',
  Esportes: '#fff3e0',
}

const ICON_COLOR = {
  Notícias: '#1a6fa8',
  Variedades: '#b71c5b',
  Cultura: '#6c3fc5',
  Eventos: '#2d7a14',
  Esportes: '#c47a00',
}

function SidebarBlock({ title, children }) {
  return (
    <div style={{ padding: '18px 20px', borderBottom: '1px solid #e5e7eb' }}>
      <div style={{
        fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
        color: '#1a6fa8', marginBottom: 14,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        {title}
        <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
      </div>
      {children}
    </div>
  )
}

export default function Sidebar() {
  return (
    <div style={{
      borderLeft: '1px solid #e5e7eb',
      display: 'flex', flexDirection: 'column',
      background: '#fff',
    }}>
      {/* PROGRAMAÇÃO */}
      <SidebarBlock title="Programação">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {SCHEDULE.map((item) => (
            <div
              key={item.time}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: 8, borderRadius: 8, cursor: 'pointer',
                background: item.live ? '#e8f4fd' : 'transparent',
                transition: 'background .15s',
              }}
              onMouseEnter={e => { if (!item.live) e.currentTarget.style.background = '#f9fafb' }}
              onMouseLeave={e => { e.currentTarget.style.background = item.live ? '#e8f4fd' : 'transparent' }}
            >
              <span style={{
                fontSize: '0.72rem', minWidth: 40, fontWeight: item.live ? 700 : 500,
                color: item.live ? '#1a6fa8' : '#6b7280',
              }}>
                {item.time}
              </span>
              <div style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: item.live ? '#1a6fa8' : (ICON_BG[item.category] || '#f3f4f6'),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {(CATEGORY_ICONS[item.category] || CATEGORY_ICONS['Notícias'])(
                  item.live ? '#fff' : ICON_COLOR[item.category]
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 500, color: item.live ? '#1a6fa8' : '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>{item.category}</div>
              </div>
              {item.live && (
                <span style={{
                  background: '#1a6fa8', color: '#fff',
                  fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em',
                  padding: '2px 8px', borderRadius: 10, whiteSpace: 'nowrap', marginLeft: 'auto',
                }}>
                  ao vivo
                </span>
              )}
            </div>
          ))}
        </div>
      </SidebarBlock>

      {/* REDES SOCIAIS */}
      <SidebarBlock title="Nos acompanhe">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            {
              label: 'YouTube', href: 'https://youtube.com', hoverColor: '#c0392b',
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#fff"/></svg>,
            },
            {
              label: 'Instagram', href: 'https://instagram.com', hoverColor: '#8134af',
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>,
            },
            {
              label: 'Facebook', href: 'https://facebook.com', hoverColor: '#1877f2',
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
            },
          ].map(({ label, href, hoverColor, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                padding: '10px 6px', borderRadius: 8, border: '1px solid #e5e7eb',
                color: '#6b7280', fontSize: '0.7rem', fontWeight: 500,
                transition: 'all .2s', background: '#fff',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = hoverColor
                e.currentTarget.style.color = hoverColor
                e.currentTarget.style.background = '#f9fafb'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#e5e7eb'
                e.currentTarget.style.color = '#6b7280'
                e.currentTarget.style.background = '#fff'
              }}
            >
              {icon}
              {label}
            </a>
          ))}
        </div>
      </SidebarBlock>

      {/* REDESA */}
      <div style={{ padding: '16px 20px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', borderRadius: 8,
          border: '1px solid #e5e7eb', background: '#f9fafb',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #2d8fd4, #4caf2a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <path d="M2 12c0-4.4 8-8 10-8s10 3.6 10 8-8 8-10 8-10-3.6-10-8z"/>
              <path d="M12 4c0 4 4 8 0 16M12 4c0 4-4 8 0 16"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '0.6rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Canal afiliado</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1a6fa8' }}>Rede Redesa</div>
            <div style={{ fontSize: '0.68rem', color: '#6b7280' }}>Rede entre Serras e Águas</div>
          </div>
        </div>
      </div>
    </div>
  )
}
