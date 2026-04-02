export default function DashFormField({ label, children, hint }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>
        {label}
      </label>
      {children}
      {hint && <p style={{ fontSize: '0.68rem', color: '#9ca3af', marginTop: 4 }}>{hint}</p>}
    </div>
  )
}

export const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: 8,
  border: '1px solid #e5e7eb', fontSize: '0.88rem', outline: 'none',
  boxSizing: 'border-box', fontFamily: 'inherit',
}

export const selectStyle = {
  ...inputStyle, appearance: 'auto', cursor: 'pointer',
}

export const textareaStyle = {
  ...inputStyle, minHeight: 200, resize: 'vertical', lineHeight: 1.6,
}
