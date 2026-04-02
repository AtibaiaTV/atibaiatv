import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { inputStyle } from '../../components/dashboard/DashFormField'

export default function TickerManager() {
  const [items, setItems] = useState([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDoc(doc(db, 'ticker', 'config')).then(snap => {
      if (snap.exists()) setItems(snap.data().items || [])
      setLoading(false)
    })
  }, [])

  const update = (i, val) => setItems(prev => prev.map((item, idx) => idx === i ? val : item))
  const remove = (i) => setItems(prev => prev.filter((_, idx) => idx !== i))
  const add = () => setItems(prev => [...prev, ''])
  const move = (i, dir) => {
    const arr = [...items]
    const j = i + dir
    if (j < 0 || j >= arr.length) return
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
    setItems(arr)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await setDoc(doc(db, 'ticker', 'config'), { items: items.filter(i => i.trim()) })
      alert('Ticker salvo com sucesso!')
    } catch (err) {
      console.error(err)
      alert('Erro ao salvar ticker')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>Carregando...</div>

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a2e' }}>Ticker de Noticias</h1>
        <button onClick={handleSave} disabled={saving} style={{
          padding: '10px 20px', borderRadius: 8, background: saving ? '#93a3b8' : '#4971B1',
          color: '#fff', fontSize: '0.85rem', fontWeight: 600, border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
        }}>
          {saving ? 'Salvando...' : 'Salvar Ticker'}
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '1.5rem' }}>
        <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '1rem' }}>
          Estes textos aparecem na faixa animada abaixo do menu do site.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.72rem', color: '#9ca3af', width: 20, textAlign: 'center', flexShrink: 0 }}>{i + 1}</span>
              <input value={item} onChange={e => update(i, e.target.value)} style={{ ...inputStyle, flex: 1 }} placeholder="Texto do ticker..." />
              <button onClick={() => move(i, -1)} disabled={i === 0} style={{ padding: '6px 8px', borderRadius: 4, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: '0.75rem' }}>↑</button>
              <button onClick={() => move(i, 1)} disabled={i === items.length - 1} style={{ padding: '6px 8px', borderRadius: 4, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: '0.75rem' }}>↓</button>
              <button onClick={() => remove(i)} style={{ padding: '6px 8px', borderRadius: 4, border: '1px solid #fecaca', background: '#fff', color: '#dc2626', cursor: 'pointer', fontSize: '0.75rem' }}>✕</button>
            </div>
          ))}
        </div>
        <button onClick={add} style={{
          marginTop: '1rem', padding: '8px 16px', borderRadius: 8, border: '1px dashed #d1d5db',
          background: 'transparent', color: '#6b7280', fontSize: '0.82rem', cursor: 'pointer', width: '100%',
        }}>
          + Adicionar item
        </button>
      </div>
    </>
  )
}
