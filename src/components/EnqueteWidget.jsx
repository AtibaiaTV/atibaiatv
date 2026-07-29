import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore'
import { db } from '../firebase'

function votoKey(id) { return 'atv-enquete-voto-' + id }

export default function EnqueteWidget() {
  var enqueteState = useState(null)
  var enquete = enqueteState[0]
  var setEnquete = enqueteState[1]
  var votadaState = useState(null) // id da opcao votada, ou null se ainda nao votou
  var votada = votadaState[0]
  var setVotada = votadaState[1]
  var enviandoState = useState(false)
  var enviando = enviandoState[0]
  var setEnviando = enviandoState[1]

  useEffect(function() {
    /* filtro simples (sem orderBy) pra nao depender de indice composto do Firestore;
       ordena e pega a mais recente aqui mesmo, no cliente */
    var q = query(collection(db, 'enquetes'), where('ativa', '==', true))
    var unsub = onSnapshot(q, function(snap) {
      if (snap.empty) { setEnquete(null); return }
      var docs = snap.docs.slice().sort(function(a, b) {
        var ta = a.data().createdAt && a.data().createdAt.toMillis ? a.data().createdAt.toMillis() : 0
        var tb = b.data().createdAt && b.data().createdAt.toMillis ? b.data().createdAt.toMillis() : 0
        return tb - ta
      })
      var d = docs[0]
      var data = Object.assign({ id: d.id }, d.data())
      setEnquete(data)
      try { setVotada(localStorage.getItem(votoKey(d.id))) } catch (e) { setVotada(null) }
    }, function() { setEnquete(null) })
    return unsub
  }, [])

  if (!enquete) return null

  var opcoesArr = Object.keys(enquete.opcoes || {}).map(function(key) {
    return Object.assign({ key: key }, enquete.opcoes[key])
  })
  var totalVotos = opcoesArr.reduce(function(sum, o) { return sum + (o.votos || 0) }, 0)

  function votar(optKey) {
    if (votada || enviando) return
    setEnviando(true)
    var updates = {}
    updates['opcoes.' + optKey + '.votos'] = increment(1)
    updateDoc(doc(db, 'enquetes', enquete.id), updates)
      .then(function() {
        try { localStorage.setItem(votoKey(enquete.id), optKey) } catch (e) {}
        setVotada(optKey)
      })
      .finally(function() { setEnviando(false) })
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ padding: '0.9rem 1.1rem', borderBottom: '1px solid #f3f4f6' }}>
        <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1a1a2e', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>📊 Enquete</h3>
      </div>
      <div style={{ padding: '1rem 1.1rem' }}>
        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1a1a2e', marginBottom: 12, lineHeight: 1.4 }}>{enquete.pergunta}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {opcoesArr.map(function(op) {
            var pct = totalVotos > 0 ? Math.round(((op.votos || 0) / totalVotos) * 100) : 0
            var isVotada = votada === op.key

            if (votada) {
              return (
                <div key={op.key} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid ' + (isVotada ? '#4971B1' : '#e5e7eb'), padding: '8px 12px' }}>
                  <div style={{ position: 'absolute', inset: 0, width: pct + '%', background: isVotada ? '#eef3fa' : '#f9fafb', transition: 'width .4s ease' }} />
                  <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: '0.82rem' }}>
                    <span style={{ fontWeight: isVotada ? 700 : 500, color: '#1a1a2e' }}>{isVotada ? '✓ ' : ''}{op.texto}</span>
                    <span style={{ fontWeight: 700, color: '#4971B1', flexShrink: 0 }}>{pct}%</span>
                  </div>
                </div>
              )
            }

            return (
              <button key={op.key} onClick={function() { votar(op.key) }} disabled={enviando} style={{
                textAlign: 'left', padding: '9px 12px', borderRadius: 8, border: '1px solid #e5e7eb',
                background: '#fafbfc', fontSize: '0.82rem', color: '#374151', fontWeight: 500,
                cursor: enviando ? 'not-allowed' : 'pointer', transition: 'border-color .15s, background .15s',
              }}
              onMouseEnter={function(e) { e.currentTarget.style.borderColor = '#4971B1'; e.currentTarget.style.background = '#eef3fa' }}
              onMouseLeave={function(e) { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = '#fafbfc' }}
              >{op.texto}</button>
            )
          })}
        </div>

        <p style={{ fontSize: '0.68rem', color: '#9ca3af', marginTop: 10 }}>
          {totalVotos} voto{totalVotos === 1 ? '' : 's'}{votada ? '' : ' · toque numa opção pra votar'}
        </p>
      </div>
    </div>
  )
}
