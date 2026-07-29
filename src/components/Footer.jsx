import { Link } from 'react-router-dom'
import Logo from './Logo'
import { CONTATO } from '../data'

const LINKS = [
  ['Início', '/'], ['Notícias', '/noticias'], ['Cultura', '/cultura'],
  ['Eventos', '/eventos'], ['Esportes', '/esportes'], ['Turismo', '/turismo'],
  ['Economia', '/economia'], ['Sobre', '/sobre'], ['Anuncie', '/anuncie'], ['Contato', '/contato'],
  ['Mural', '/mural'], ['Privacidade', '/privacidade'],
]

const SOCIAL = [
  {
    label: 'Instagram',
    href: CONTATO.instagram,
    background: 'radial-gradient(circle at 30% 110%, #ffdb73 0%, #fdb143 16%, #ff6f4c 33%, #dc3079 50%, #b6266e 65%, #7b2c8e 78%, #4f2fb5 100%)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="#fff" strokeWidth="2"/>
        <circle cx="12" cy="12" r="4.2" stroke="#fff" strokeWidth="2"/>
        <circle cx="17.4" cy="6.6" r="1.2" fill="#fff"/>
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: CONTATO.facebook,
    background: 'linear-gradient(145deg, #4d93f5 0%, #1859c9 100%)',
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
        <path d="M15.5 8.5h-2c-.28 0-.5.22-.5.5v2h2.4l-.32 2.5H13v7h-3v-7H8.5V11H10V8.8C10 6.6 11.2 5 13.6 5H15.5v3.5z" fill="#fff"/>
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: CONTATO.youtube,
    background: 'linear-gradient(145deg, #ff5252 0%, #d90d0d 100%)',
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
        <rect x="2.5" y="6" width="19" height="12" rx="4" stroke="#fff" strokeWidth="2"/>
        <path d="M10.5 9.7v4.6l4-2.3-4-2.3z" fill="#fff"/>
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: CONTATO.whatsapp,
    background: 'linear-gradient(145deg, #4fce5d 0%, #1fa855 100%)',
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
        <path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.3-1.2A8.5 8.5 0 1 0 12 3.5z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M8.7 8.3c.2-.4.4-.4.6-.4h.5c.15 0 .35 0 .5.4.2.5.6 1.5.65 1.6.05.1.08.22.02.35-.06.13-.1.2-.2.3-.1.12-.2.2-.3.3-.1.1-.2.2-.1.4.1.2.5.85 1.05 1.35.7.65 1.3.85 1.5.95.2.1.3.08.4-.05.15-.15.5-.6.65-.8.15-.2.3-.17.5-.1.2.08 1.3.6 1.5.72.2.1.35.15.4.25.05.1.05.55-.15 1.1-.2.5-1.1 1-1.5 1.05-.4.05-.8.2-2.7-.6-2.3-1-3.7-3.35-3.8-3.5-.1-.15-.9-1.2-.9-2.3 0-1.1.55-1.6.75-1.85z" fill="#fff"/>
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer style={{ background: '#f7f8fa', color: '#1a1a2e' }}>
      {/* divisor colorido separando o conteúdo de notícias do rodapé */}
      <div style={{ height: 4, background: 'linear-gradient(90deg, #Cd0000 0%, #4971B1 50%, #67AA4D 100%)' }} />

      <div style={{ padding: '2.5rem 2rem 1.5rem', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', gap: '2rem', flexWrap: 'wrap' }}>

            {/* Logo + Redesa */}
            <div>
              <Logo variant="stacked" height={56} />
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: '0.65rem', color: '#9aa1ac', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Canal afiliado</div>
                <div style={{ display: 'inline-flex', background: '#0d1b2a', borderRadius: 8, padding: '6px 10px' }}>
                  <img src="/logos/logo-redesa.png" alt="Redesa" height={28}
                    style={{ objectFit: 'contain', display: 'block' }}
                    onError={e => { e.target.parentElement.style.display = 'none' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                {SOCIAL.map(({ label, href, background, icon }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 3px 10px rgba(0,0,0,.18)', transition: 'transform .18s ease, box-shadow .18s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.06)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,.28)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 3px 10px rgba(0,0,0,.18)' }}
                  >{icon}</a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9aa1ac', marginBottom: 14 }}>Navegação</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 32px' }}>
                {LINKS.map(([label, href]) => (
                  <Link key={label} to={href} style={{ color: '#4b5563', fontSize: '0.82rem', transition: 'color .2s' }}
                    onMouseEnter={e => e.target.style.color = '#cc0000'}
                    onMouseLeave={e => e.target.style.color = '#4b5563'}
                  >{label}</Link>
                ))}
              </div>
            </div>

            {/* Contato */}
            <div>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9aa1ac', marginBottom: 14 }}>Contato</div>
              {[
                { icon: '📧', text: CONTATO.emailRedacao, href: `mailto:${CONTATO.emailRedacao}` },
                { icon: '📞', text: CONTATO.telefone, href: `tel:+55${CONTATO.telefone.replace(/\D/g,'')}` },
                { icon: '📍', text: CONTATO.endereco },
              ].map(({ icon, text, href }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10, fontSize: '0.78rem', color: '#4b5563' }}>
                  <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                  {href ? <a href={href} style={{ color: '#4b5563', transition: 'color .2s' }} onMouseEnter={e => e.target.style.color='#cc0000'} onMouseLeave={e => e.target.style.color='#4b5563'}>{text}</a> : <span>{text}</span>}
                </div>
              ))}
              <div style={{ marginTop: 16 }}>
                <Link to="/anuncie" style={{
                  display: 'inline-block', background: '#67AA4D', color: '#fff',
                  fontSize: '0.78rem', fontWeight: 600, padding: '8px 18px', borderRadius: 6,
                  transition: 'background .2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#4a7a35'}
                onMouseLeave={e => e.currentTarget.style.background = '#67AA4D'}
                >Anuncie aqui</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div style={{ padding: '1.1rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: '0.72rem', color: '#9aa1ac' }}>
            © {new Date().getFullYear()} Atibaia TV · www.atibaiatv.com.br · Todos os direitos reservados
          </span>
          <span style={{ fontSize: '0.72rem', color: '#9aa1ac' }}>
            Afiliada Rede Redesa · Rede entre Serras e Águas
          </span>
        </div>
      </div>
    </footer>
  )
}
