var RODOVIAS = [
  { nome: 'Rodovia Fernão Dias (BR-381)', href: 'https://rodovias.motiva.com.br/minas-sp/', concessionaria: 'Motiva', contato: '0800 283 0381' },
  { nome: 'Rodovia Dom Pedro I (SP-065)', href: 'https://www.rotadasbandeiras.com.br/', concessionaria: 'Rota das Bandeiras', contato: '0800 770 8070' },
]

export default function HighwayWidget() {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ padding: '0.9rem 1.1rem', borderBottom: '1px solid #f3f4f6' }}>
        <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1a1a2e', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Situação das rodovias</h3>
      </div>
      <div style={{ padding: '1rem 1.1rem' }}>
        {RODOVIAS.map(function(r) {
          return (
            <a key={r.href} href={r.href} target="_blank" rel="noreferrer" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              padding: '10px 0', borderBottom: '1px solid #f3f4f6', textDecoration: 'none',
            }}>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1a1a2e' }}>{r.nome}</div>
                <div style={{ fontSize: '0.68rem', color: '#9ca3af' }}>{r.concessionaria} · tráfego ao vivo no app/site · {r.contato}</div>
              </div>
              <span style={{ color: '#4971B1', fontSize: '0.75rem', fontWeight: 600, flexShrink: 0 }}>Ver →</span>
            </a>
          )
        })}
        <a href="https://www.artesp.sp.gov.br/" target="_blank" rel="noreferrer" style={{
          display: 'block', marginTop: 10, fontSize: '0.72rem', color: '#4971B1', textDecoration: 'none',
        }}>ARTESP — situação geral das rodovias de SP →</a>
        <p style={{ fontSize: '0.65rem', color: '#c4c8cf', marginTop: 10, lineHeight: 1.4 }}>
          As concessionárias não oferecem uma API pública — o tráfego ao vivo delas fica no app e site próprios.
          A ARTESP tem uma API, mas exige cadastro e chave de acesso.
        </p>
      </div>
    </div>
  )
}
