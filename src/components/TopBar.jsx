import { CONTATO } from '../data'

const css = `@keyframes atv-blink { 0%,100%{opacity:1} 50%{opacity:.3} }`

function getFormattedDate() {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function TopBar() {
  return (
    <>
      <style>{css}</style>
      <div style={{ background: '#1e2a3a', padding: '5px 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
            {getFormattedDate()}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#Cd0000', color: '#fff', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: 10 }}>
            <div style={{ width: 5, height: 5, background: '#fff', borderRadius: '50%', animation: 'atv-blink 1.2s ease-in-out infinite' }} />
            Ao vivo
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <a href={CONTATO.youtube} target="_blank" rel="noreferrer" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)', transition: 'color .2s' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.55)'}>YouTube</a>
          <a href={CONTATO.instagram} target="_blank" rel="noreferrer" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)', transition: 'color .2s' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.55)'}>Instagram</a>
          <a href={CONTATO.facebook} target="_blank" rel="noreferrer" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)', transition: 'color .2s' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.55)'}>Facebook</a>
        </div>
      </div>
    </>
  )
}
