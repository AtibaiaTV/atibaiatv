export default function DashTable({ columns, data, onEdit, onDelete }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            {columns.map(col => (
              <th key={col.key} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#374151', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {col.label}
              </th>
            ))}
            <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 600, color: '#374151', fontSize: '0.72rem', textTransform: 'uppercase' }}>Acoes</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
                Nenhum item encontrado.
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={row.id} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                {columns.map(col => (
                  <td key={col.key} style={{ padding: '10px 14px', color: '#374151' }}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    {onEdit && (
                      <button onClick={() => onEdit(row)} style={{
                        padding: '5px 12px', borderRadius: 6, border: '1px solid #e5e7eb',
                        background: '#fff', color: '#4971B1', fontSize: '0.75rem', cursor: 'pointer',
                        fontWeight: 500, transition: 'all .15s',
                      }}>Editar</button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(row)} style={{
                        padding: '5px 12px', borderRadius: 6, border: '1px solid #fecaca',
                        background: '#fff', color: '#dc2626', fontSize: '0.75rem', cursor: 'pointer',
                        fontWeight: 500, transition: 'all .15s',
                      }}>Excluir</button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
