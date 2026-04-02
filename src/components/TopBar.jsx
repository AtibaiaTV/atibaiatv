import { CONTATO } from '../data'

function getFormattedDate() {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function TopBar() {
  return (
    <div style={{ background: '#Cd0000', padding: '6px 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500, textTransform: 'capitalize' }}>
          {getFormattedDate()}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <a href={CONTATO.youtube} target="_blank" rel="noreferrer" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontWeight: 500, transition: 'color .2s' }}
          onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.8)'}>YouTube</a>
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
        <a href={CONTATO.instagram} target="_blank" rel="noreferrer" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontWeight: 500, transition: 'color .2s' }}
          onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.8)'}>Instagram</a>
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
        <a href={CONTATO.facebook} target="_blank" rel="noreferrer" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontWeight: 500, transition: 'color .2s' }}
          onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.8)'}>Facebook</a>
      </div>
    </div>
  )
}
