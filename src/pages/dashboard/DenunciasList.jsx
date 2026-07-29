import { useState, useEffect } from 'react'
import { collection, getDocs, deleteDoc, doc, updateDoc, orderBy, query } from 'firebase/firestore'
import { db } from '../../firebase'
import { DENUNCIA_CATEGORIAS, DENUNCIA_STATUS } from '../../data'
import { selectStyle } from '../../components/dashboard/DashFormField'

function categoriaInfo(value) {
  return DENUNCIA_CATEGORIAS.find(function(c) { return c.value === value }) || { label: value || '—', icon: '📌', color: '#6b7280' }
}

function statusInfo(value) {
  return DENUNCIA_STATUS.find(function(s) { return s.value === value }) || DENUNCIA_STATUS[0]
}

export default function DenunciasList() {
  var itemsState = useState([])
  var items = itemsState[0]
  var setItems = itemsState[1]
  var loadingState = useState(true)
  var loading = loadingState[0]
  var setLoading = loadingState[1]

  async function load() {
    var q = query(collection(db, 'denuncias'), orderBy('createdAt', 'desc'))
    var snap = await getDocs(q)
    setItems(snap.docs.map(function(d) { return Object.assign({ id: d.id }, d.data()) }))
    setLoading(false)
  }

  useEffect(function() { load() }, [])

  async function handleStatusChange(row, newStatus) {
    setItems(function(list) { return list.map(function(it) { return it.id === row.id ? Object.assign({}, it, { status: newStatus }) : it }) })
    await updateDoc(doc(db, 'denuncias', row.id), { status: newStatus })
  }

  async function handleDelete(row) {
    if (!window.confirm('Excluir esta denúncia?')) return
    await deleteDoc(doc(db, 'denuncias', row.id))
    load()
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>Carregando...</div>

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a2e' }}>Denúncias da cidade</h1>
        <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{items.length} recebidas</span>
      </div>

      {items.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
          Nenhuma denúncia recebida ainda.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map(function(row) {
            var cat = categoriaInfo(row.category)
            var st = statusInfo(row.status)
            var when = row.createdAt && row.createdAt.toDate ? row.createdAt.toDate().toLocaleString('pt-BR') : '—'
            var isVideo = row.mediaUrl && /\.(mp4|webm|mov)$/i.test(row.mediaUrl)

            return (
              <div key={row.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1rem 1.25rem', display: 'flex', gap: 16 }}>
                {row.mediaUrl && (
                  isVideo ? (
                    <video src={row.mediaUrl} style={{ width: 120, height: 90, borderRadius: 8, objectFit: 'cover', flexShrink: 0, background: '#000' }} controls />
                  ) : (
                    <a href={row.mediaUrl} target="_blank" rel="noreferrer">
                      <img src={row.mediaUrl} alt="" style={{ width: 120, height: 90, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                    </a>
                  )
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: cat.color, background: '#f3f4f6', padding: '3px 9px', borderRadius: 12 }}>
                      {cat.icon} {cat.label}
                    </span>
                    {row.location && <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>📍 {row.location}</span>}
                    <span style={{ fontSize: '0.72rem', color: '#9ca3af', marginLeft: 'auto' }}>{when}</span>
                  </div>

                  <p style={{ fontSize: '0.86rem', color: '#374151', lineHeight: 1.5, marginBottom: 8 }}>{row.description}</p>

                  {(row.name || row.contact) && (
                    <p style={{ fontSize: '0.74rem', color: '#9ca3af', marginBottom: 10 }}>
                      {row.name || 'Anônimo'}{row.contact ? ' · ' + row.contact : ''}
                    </p>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <select value={row.status || 'novo'} onChange={function(e) { handleStatusChange(row, e.target.value) }} style={Object.assign({}, selectStyle, { width: 'auto', padding: '6px 10px', fontSize: '0.78rem', background: st.bg, color: st.color, fontWeight: 600, border: 'none' })}>
                      {DENUNCIA_STATUS.map(function(s) { return <option key={s.value} value={s.value}>{s.label}</option> })}
                    </select>
                    <button onClick={function() { handleDelete(row) }} style={{
                      padding: '6px 12px', borderRadius: 6, border: '1px solid #fecaca',
                      background: '#fff', color: '#dc2626', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 500,
                    }}>Excluir</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
