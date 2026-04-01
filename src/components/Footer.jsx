import { Link } from 'react-router-dom'
import Logo from './Logo'

const LINKS = [
  ['Início', '/'], ['Notícias', '/noticias'], ['Cultura', '/cultura'],
  ['Eventos', '/eventos'], ['Esportes', '/esportes'], ['Turismo', '/turismo'],
  ['Economia', '/economia'], ['Sobre', '/sobre'], ['Anuncie', '/anuncie'], ['Contato', '/contato'],
]

export default function Footer() {
  return (
    <footer style={{ background: '#1e2a3a', color: '#fff', padding: '2.5rem 2rem 1.5rem', marginTop: '2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', gap: '2rem', flexWrap: 'wrap' }}>

          {/* Logo + Redesa */}
          <div>
            <Logo variant="stacked" height={64} />
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,.45)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Canal afiliado</div>
              <img src="/logos/logo-redesa.png" alt="Redesa" height={32}
                style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.8 }}
                onError={e => { e.target.style.display = 'none' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              {[
                { label: 'YT', href: 'https://youtube.com' },
                { label: 'IG', href: 'https://instagram.com' },
                { label: 'FB', href: 'https://facebook.com' },
              ].map(({ label, href }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'rgba(255,255,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '0.65rem', fontWeight: 700, transition: 'background .2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.25)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.12)'}
                >{label}</a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 14 }}>Navegação</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 32px' }}>
              {LINKS.map(([label, href]) => (
                <Link key={label} to={href} style={{ color: 'rgba(255,255,255,.65)', fontSize: '0.82rem', transition: 'color .2s' }}
                  onMouseEnter={e => e.target.style.color = '#fff'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,.65)'}
                >{label}</Link>
              ))}
            </div>
          </div>

          {/* Contato */}
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 14 }}>Contato</div>
            {[
              { icon: '📧', text: 'contato@atibaiatv.com.br' },
              { icon: '📞', text: '(11) 4400-0000' },
              { icon: '📍', text: 'Atibaia, SP — Brasil' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontSize: '0.82rem', color: 'rgba(255,255,255,.65)' }}>
                <span style={{ fontSize: 14 }}>{icon}</span>{text}
              </div>
            ))}
            <div style={{ marginTop: 16 }}>
              <a href="/anuncie" style={{
                display: 'inline-block', background: '#5aab3a', color: '#fff',
                fontSize: '0.78rem', fontWeight: 600, padding: '8px 18px', borderRadius: 6,
                transition: 'background .2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#3d7a25'}
              onMouseLeave={e => e.currentTarget.style.background = '#5aab3a'}
              >Anuncie aqui</a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,.35)' }}>
            © {new Date().getFullYear()} Atibaia TV · www.atibaiatv.com.br · Todos os direitos reservados
          </span>
          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,.35)' }}>
            Afiliada Rede Redesa · Rede entre Serras e Águas
          </span>
        </div>
      </div>
    </footer>
  )
}
