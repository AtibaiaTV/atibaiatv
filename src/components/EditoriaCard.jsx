import { Link } from 'react-router-dom'

const css = `
.editoria-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: transform .2s, box-shadow .2s;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
}
.editoria-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
}
@media (max-width: 768px) {
  .editoria-card {
    flex-direction: row;
    text-align: left;
    padding: 10px 14px;
    border-radius: 8px;
    gap: 10px;
  }
  .editoria-icon { width: 36px !important; height: 36px !important; border-radius: 8px !important; margin-bottom: 0 !important; }
  .editoria-label { font-size: 0.82rem !important; margin: 0 !important; }
  .editoria-desc { display: none !important; }
  .editoria-footer { display: none !important; }
}
`

export default function EditoriaCard({ editoria }) {
  const { slug, label, icon, color, bg } = editoria

  return (
    <>
      <style>{css}</style>
      <Link to={'/' + slug} className="editoria-card" style={{ borderTop: '3px solid ' + color }}>
        <div className="editoria-icon" style={{
          width: 44, height: 44, borderRadius: 10,
          background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.3rem', flexShrink: 0,
        }}>
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 className="editoria-label" style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
            {label}
          </h3>
          <p className="editoria-desc" style={{ fontSize: '0.72rem', color: '#6b7280', lineHeight: 1.4, margin: '4px 0 0' }}>
            {editoria.description}
          </p>
        </div>
        <div className="editoria-footer">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </Link>
    </>
  )
}
