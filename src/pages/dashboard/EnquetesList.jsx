import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase'
import DashFormField, { inputStyle } from '../../components/dashboard/DashFormField'

var EMPTY_OPCOES = ['', '']

export default function EnquetesList() {
  var itemsState = useState([])
  var items = itemsState[0]
  var setItems = itemsState[1]
  var loadingState = useState(true)
  var loading = loadingState[0]
  var setLoading = loadingState[1]

  var perguntaState = useState('')
  var pergunta = perguntaState[0]
  var setPergunta = perguntaState[1]
  var opcoesState = useState(EMPTY_OPCOES)
  var opcoes = opcoesState[0]
  var setOpcoes = opcoesState[1]
  var savingState = useState(false)
  var saving = savingState[0]
  var setSaving = savingState[1]
  var errorState = useState('')
  var error = errorState[0]
  var setError = errorState[1]

  async function load() {
    var q = query(collection(db, 'enquetes'), orderBy('createdAt', 'desc'))
    var snap = await getDocs(q)
    setItems(snap.docs.map(function(d) { return Object.assign({ id: d.id }, d.data()) }))
    setLoading(false)
  }

  useEffect(function() { load() }, [])

  function setOpcaoTexto(i, val) {
    setOpcoes(function(list) { var next = list.slice(); next[i] = val; return next })
  }

  function addOpcao() {
    if (opcoes.length >= 6) return
    setOpcoes(function(list) { return list.concat('') })
  }

  function removeOpcao(i) {
    if (opcoes.length <= 2) return
    setOpcoes(function(list) { return list.filter(function(_, idx) { return idx !== i }) })
  }

  async function handleCreate(e) {
    e.preventDefault()
    var textosValidos = opcoes.map(function(t) { return t.trim() }).filter(Boolean)
    if (!pergunta.trim() || textosValidos.length < 2) {
      setError('Preencha a pergunta e pelo menos 2 opções.')
      return
    }
    setError('')
    setSaving(true)
    try {
      var opcoesMap = {}
      textosValidos.forEach(function(texto, i) {
        opcoesMap['opt_' + i] = { texto: texto, votos: 0 }
      })
      await addDoc(collection(db, 'enquetes'), {
        pergunta: pergunta.trim(),
        opcoes: opcoesMap,
        ativa: true,
        createdAt: serverTimestamp(),
      })
      setPergunta('')
      setOpcoes(EMPTY_OPCOES)
      load()
    } catch (err) {
      console.error(err)
      setError('Não foi possível criar a enquete. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  async function toggleAtiva(item) {
    await updateDoc(doc(db, 'enquetes', item.id), { ativa: !item.ativa })
    setItems(function(list) { return list.map(function(it) { return it.id === item.id ? Object.assign({}, it, { ativa: !item.ativa }) : it }) })
  }

  async function handleDelete(item) {
    if (!window.confirm('Excluir esta enquete?')) return
    await deleteDoc(doc(db, 'enquetes', item.id))
    load()
  }

  return (
    <>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1.5rem' }}>Enquetes</h1>

      <form onSubmit={handleCreate} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1.5rem', marginBottom: '2rem', maxWidth: 600 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1rem' }}>Nova enquete</h2>

        <DashFormField label="Pergunta">
          <input value={pergunta} onChange={function(e) { setPergunta(e.target.value) }} style={inputStyle} placeholder="Ex: Qual editoria você mais acompanha?" />
        </DashFormField>

        <DashFormField label="Opções" hint="Mínimo 2, máximo 6">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {opcoes.map(function(texto, i) {
              return (
                <div key={i} style={{ display: 'flex', gap: 8 }}>
                  <input value={texto} onChange={function(e) { setOpcaoTexto(i, e.target.value) }} style={inputStyle} placeholder={'Opção ' + (i + 1)} />
                  {opcoes.length > 2 && (
                    <button type="button" onClick={function() { removeOpcao(i) }} style={{
                      padding: '0 12px', borderRadius: 8, border: '1px solid #fecaca', background: '#fff',
                      color: '#dc2626', fontSize: '0.85rem', cursor: 'pointer', flexShrink: 0,
                    }}>✕</button>
                  )}
                </div>
              )
            })}
          </div>
          {opcoes.length < 6 && (
            <button type="button" onClick={addOpcao} style={{
              marginTop: 8, padding: '6px 14px', borderRadius: 8, border: '1px solid #e5e7eb',
              background: '#fafbfc', color: '#4971B1', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
            }}>+ Adicionar opção</button>
          )}
        </DashFormField>

        {error && (
          <div style={{ background: '#fef2f2', color: '#dc2626', fontSize: '0.82rem', padding: '10px 14px', borderRadius: 8, marginBottom: '1rem' }}>{error}</div>
        )}

        <button type="submit" disabled={saving} style={{
          padding: '10px 24px', borderRadius: 8, border: 'none',
          background: saving ? '#93a3b8' : '#4971B1', color: '#fff', fontSize: '0.88rem',
          fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
        }}>{saving ? 'Criando...' : 'Criar enquete'}</button>
      </form>

      <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1rem' }}>Enquetes criadas</h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Carregando...</div>
      ) : items.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
          Nenhuma enquete criada ainda.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map(function(item) {
            var opcoesArr = Object.keys(item.opcoes || {}).map(function(k) { return Object.assign({ key: k }, item.opcoes[k]) }).sort(function(a, b) {
              return parseInt(a.key.replace('opt_', ''), 10) - parseInt(b.key.replace('opt_', ''), 10)
            })
            var total = opcoesArr.reduce(function(s, o) { return s + (o.votos || 0) }, 0)
            return (
              <div key={item.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1.1rem 1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 12,
                    color: item.ativa ? '#059669' : '#6b7280', background: item.ativa ? '#ecfdf5' : '#f3f4f6',
                  }}>{item.ativa ? 'Ativa' : 'Inativa'}</span>
                  <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{total} voto{total === 1 ? '' : 's'}</span>
                </div>
                <p style={{ fontSize: '0.92rem', fontWeight: 600, color: '#1a1a2e', marginBottom: 10 }}>{item.pergunta}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
                  {opcoesArr.map(function(op) {
                    var pct = total > 0 ? Math.round(((op.votos || 0) / total) * 100) : 0
                    return (
                      <div key={op.key} style={{ fontSize: '0.78rem', color: '#4b5563', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{op.texto}</span>
                        <span>{op.votos || 0} ({pct}%)</span>
                      </div>
                    )
                  })}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={function() { toggleAtiva(item) }} style={{
                    padding: '6px 12px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff',
                    color: '#374151', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer',
                  }}>{item.ativa ? 'Desativar' : 'Ativar'}</button>
                  <button onClick={function() { handleDelete(item) }} style={{
                    padding: '6px 12px', borderRadius: 6, border: '1px solid #fecaca', background: '#fff',
                    color: '#dc2626', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer',
                  }}>Excluir</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
