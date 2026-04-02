import { useState, useEffect } from 'react'
import { collection, getDocs, deleteDoc, updateDoc, doc, orderBy, query } from 'firebase/firestore'
import { db } from '../../firebase'
import { useNavigate, Link } from 'react-router-dom'

const TYPE_LABELS = { billboard: 'Billboard (1920x200)', leaderboard: 'Leaderboard (1200x300)', square: 'Square (300x300)' }

export default function BannersList() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchBanners = async () => {
    const q = query(collection(db, 'banners'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    setBanners(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    setLoading(false)
  }

  useEffect(() => { fetchBanners() }, [])

  const toggleActive = async (banner) => {
    await updateDoc(doc(db, 'banners', banner.id), { active: !banner.active })
    fetchBanners()
  }

  const handleDelete = async (banner) => {
    if (!window.confirm('Excluir este banner?')) return
    await deleteDoc(doc(db, 'banners', banner.id))
    fetchBanners()
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>Carregando...</div>

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a2e' }}>Banners</h1>
        <Link to="/dashboard/banners/new" style={{ padding: '10px 20px', borderRadius: 8, background: '#4971B1', color: '#fff', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>+ Novo Banner</Link>
      </div>

      {banners.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af', background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb' }}>Nenhum banner cadastrado.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {banners.map(b => (
            <div key={b.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
              <div style={{ height: 140, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {b.mediaType === 'video' ? (
                  <video src={b.mediaUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                ) : b.mediaUrl ? (
                  <img src={b.mediaUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ color: '#9ca3af' }}>Sem midia</span>
                )}
              </div>
              <div style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: 10, background: '#eef3fa', color: '#4971B1' }}>{TYPE_LABELS[b.type] || b.type}</span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: b.active ? '#edf7e8' : '#f3f4f6', color: b.active ? '#4a7a35' : '#9ca3af' }}>{b.active ? 'Ativo' : 'Inativo'}</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => toggleActive(b)} style={{ flex: 1, padding: '6px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', fontSize: '0.75rem', cursor: 'pointer', color: '#374151' }}>{b.active ? 'Desativar' : 'Ativar'}</button>
                  <button onClick={() => navigate("/dashboard/banners/" + b.id)} style={{ flex: 1, padding: '6px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', fontSize: '0.75rem', cursor: 'pointer', color: '#4971B1' }}>Editar</button>
                  <button onClick={() => handleDelete(b)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #fecaca', background: '#fff', fontSize: '0.75rem', cursor: 'pointer', color: '#dc2626' }}>X</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
