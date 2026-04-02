import { Link } from 'react-router-dom'
import { CONTATO } from '../data'

export function SobrePage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '3rem 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <img src="/logos/logo-stacked.png" alt="Atibaia TV" height={100} style={{ margin: '0 auto 1.5rem', objectFit: 'contain' }} onError={e => e.target.style.display='none'} />
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>Sobre a Atibaia TV</h1>
        <p style={{ fontSize: '1rem', color: 'var(--muted)', lineHeight: 1.7 }}>
          A Atibaia TV é o canal de televisão local que conecta Atibaia e região com notícias, cultura, eventos e esportes. Afiliada à Rede Redesa — Rede entre Serras e Águas.
        </p>
      </div>
      {[
        { title: 'Nossa missão', text: 'Informar, entreter e conectar a comunidade de Atibaia e região por meio de conteúdo jornalístico de qualidade e produção local.' },
        { title: 'Nossa história', text: 'Fundada com o propósito de dar voz à cidade, a Atibaia TV cresceu ao lado da comunidade, documentando os principais momentos da história local e regional.' },
        { title: 'Cobertura regional', text: 'Além de Atibaia, a Atibaia TV cobre toda a região das Serras e Águas, incluindo municípios vizinhos como Bragança Paulista, Nazaré Paulista e Piracaia.' },
      ].map(({ title, text }) => (
        <div key={title} style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--blue)', marginBottom: 10 }}>{title}</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>{text}</p>
        </div>
      ))}
    </div>
  )
}

export function AnunciePage() {
  const FORMATS = [
    { name: 'Billboard', size: '1920×200px', position: 'Topo e rodapé da página', destaque: true },
    { name: 'Leaderboard', size: '1200×300px', position: 'Entre seções do conteúdo', destaque: false },
    { name: 'Square', size: '300×300px', position: 'Sidebar direita', destaque: false },
    { name: 'Vídeo Patrocinado', size: 'Miniatura 16:9', position: 'Grade de vídeos', destaque: false },
  ]
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '3rem 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>Anuncie na Atibaia TV</h1>
        <p style={{ fontSize: '1rem', color: 'var(--muted)', lineHeight: 1.7 }}>
          Alcance milhares de moradores de Atibaia e região com seus anúncios no maior portal de notícias local.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
        {FORMATS.map(f => (
          <div key={f.name} style={{ padding: '1.5rem', background: '#fff', border: `1px solid ${f.destaque ? 'var(--blue)' : 'var(--border)'}`, borderRadius: 12, position: 'relative' }}>
            {f.destaque && <div style={{ position: 'absolute', top: -1, right: 16, background: 'var(--blue)', color: '#fff', fontSize: '0.6rem', fontWeight: 700, padding: '3px 10px', borderRadius: '0 0 6px 6px' }}>MAIS POPULAR</div>}
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{f.name}</h3>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--blue)', marginBottom: 6 }}>{f.size}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{f.position}</div>
          </div>
        ))}
      </div>
      <div style={{ background: 'var(--blue-light)', border: '1px solid #c8d8ef', borderRadius: 12, padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--blue)', marginBottom: 12 }}>Entre em contato</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Nossa equipe comercial está pronta para criar o pacote ideal para o seu negócio.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={`mailto:${CONTATO.emailComercial}`} style={{ background: 'var(--blue)', color: '#fff', padding: '10px 24px', borderRadius: 8, fontWeight: 600 }}>{CONTATO.emailComercial}</a>
          <a href={`tel:+55${CONTATO.telefone.replace(/\D/g,'')}`} style={{ background: '#fff', color: 'var(--blue)', padding: '10px 24px', borderRadius: 8, fontWeight: 600, border: '1px solid var(--blue)' }}>{CONTATO.telefone}</a>
        </div>
      </div>
    </div>
  )
}

export function ContatoPage() {
  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '3rem 2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>Fale Conosco</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Entre em contato com a redação ou com nossa equipe comercial.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { icon: '📧', label: 'E-mail', value: CONTATO.emailRedacao, href: `mailto:${CONTATO.emailRedacao}` },
          { icon: '📞', label: 'Telefone / WhatsApp', value: CONTATO.telefone, href: `https://wa.me/55${CONTATO.telefone.replace(/\D/g,'')}` },
          { icon: '📍', label: 'Endereço', value: CONTATO.endereco },
          { icon: '🌐', label: 'Site', value: 'www.atibaiatv.com.br', href: 'https://www.atibaiatv.com.br' },
        ].map(({ icon, label, value, href }) => (
          <div key={label} style={{ padding: '1.25rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
            <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: 4 }}>{label}</div>
            {href
              ? <a href={href} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--blue)' }}>{value}</a>
              : <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text)' }}>{value}</div>
            }
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text)' }}>Envie uma mensagem</h2>
        {[
          { label: 'Nome', type: 'text', placeholder: 'Seu nome completo' },
          { label: 'E-mail', type: 'email', placeholder: 'seu@email.com' },
          { label: 'Assunto', type: 'text', placeholder: 'Sobre o que é?' },
        ].map(({ label, type, placeholder }) => (
          <div key={label} style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>{label}</label>
            <input type={type} placeholder={placeholder} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, fontSize: '0.9rem', border: '1px solid var(--border)', outline: 'none', fontFamily: 'inherit' }}
              onFocus={e => e.target.style.borderColor = 'var(--blue)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        ))}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Mensagem</label>
          <textarea rows={5} placeholder="Escreva sua mensagem..." style={{ width: '100%', padding: '10px 14px', borderRadius: 8, fontSize: '0.9rem', border: '1px solid var(--border)', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
            onFocus={e => e.target.style.borderColor = 'var(--blue)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
        <a href={`mailto:${CONTATO.emailRedacao}`} style={{ display: 'inline-block', background: 'var(--blue)', color: '#fff', padding: '10px 28px', borderRadius: 8, fontSize: '0.9rem', fontWeight: 600 }}>
          Enviar mensagem
        </a>
      </div>
    </div>
  )
}
