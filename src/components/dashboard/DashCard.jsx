export default function DashCard({ icon, label, value, color }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb',
      padding: '1.25rem', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 42, height: 42, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: '0.68rem', color: '#6b7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a2e' }}>{value}</div>
        </div>
      </div>
    </div>
  )
}
