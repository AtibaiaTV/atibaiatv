import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { addDoc, collection, doc, getDoc, setDoc, increment, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { DENUNCIA_CATEGORIAS, PONTOS_ENVIO_COM_MIDIA, PONTOS_ENVIO_SEM_MIDIA, getNivelParticipacao } from '../data'
import { trackPageView } from '../hooks/usePageViews'
import slugifyParticipant from '../utils/slugifyParticipant'
import DashFormField, { inputStyle, selectStyle, textareaStyle } from '../components/dashboard/DashFormField'
import ImageUpload from '../components/dashboard/ImageUpload'

var EMPTY_FORM = { category: '', location: '', description: '', name: '', contact: '', mediaUrl: '' }

export default function Denuncia() {
  var formState = useState(EMPTY_FORM)
  var form = formState[0]
  var setForm = formState[1]
  var savingState = useState(false)
  var saving = savingState[0]
  var setSaving = savingState[1]
  var doneState = useState(false)
  var done = doneState[0]
  var setDone = doneState[1]
  var errorState = useState('')
  var error = errorState[0]
  var setError = errorState[1]
  var pontosState = useState(null)
  var pontosInfo = pontosState[0]
  var setPontosInfo = pontosState[1]

  useEffect(function() { trackPageView('denuncia') }, [])

  function set(key, val) { setForm(function(f) { return Object.assign({}, f, { [key]: val }) }) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.category || !form.description) {
      setError('Preencha ao menos a categoria e a descrição do problema.')
      return
    }
    setError('')
    setSaving(true)
    try {
      await addDoc(collection(db, 'denuncias'), Object.assign({}, form, {
        status: 'novo',
        createdAt: serverTimestamp(),
      }))

      /* gamificacao: so pontua quem se identifica com nome ou contato */
      var participantId = slugifyParticipant(form.contact, form.name)
      if (participantId) {
        var pontosGanhos = form.mediaUrl ? PONTOS_ENVIO_COM_MIDIA : PONTOS_ENVIO_SEM_MIDIA
        var participanteRef = doc(db, 'participantes', participantId)
        await setDoc(participanteRef, {
          displayName: form.name || 'Anônimo',
          contact: form.contact || '',
          totalPoints: increment(pontosGanhos),
          totalEnvios: increment(1),
          lastEnvioAt: serverTimestamp(),
        }, { merge: true })

        var snap = await getDoc(participanteRef)
        var total = snap.exists() ? (snap.data().totalPoints || pontosGanhos) : pontosGanhos
        setPontosInfo({ ganhos: pontosGanhos, total: total, nivel: getNivelParticipacao(total) })
      } else {
        setPontosInfo(null)
      }

      setDone(true)
    } catch (err) {
      console.error(err)
      setError('Não foi possível enviar agora. Tente novamente em instantes.')
    } finally {
      setSaving(false)
    }
  }

  if (done) {
    return (
      <div className="atv-container" style={{ padding: '4rem 1rem', textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>✅</div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a1a2e', marginBottom: 10 }}>Denúncia enviada!</h1>
        <p style={{ color: '#6b7280', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: 24 }}>
          Obrigado por contribuir com Atibaia. Nossa equipe vai analisar o que você enviou e, quando fizer sentido, pode virar matéria no site.
        </p>

        {pontosInfo ? (
          <div style={{ background: '#fff7e0', border: '1px solid #ffe6a3', borderRadius: 12, padding: '1.25rem', marginBottom: 24 }}>
            <div style={{ fontSize: '2rem', marginBottom: 4 }}>{pontosInfo.nivel.icon}</div>
            <p style={{ fontWeight: 700, color: '#1a1a2e', fontSize: '1rem' }}>+{pontosInfo.ganhos} pontos!</p>
            <p style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: 4 }}>
              Você já tem <b>{pontosInfo.total} pontos</b> e é <b style={{ color: pontosInfo.nivel.color }}>{pontosInfo.nivel.label}</b>
            </p>
            <Link to="/ranking" style={{ display: 'inline-block', marginTop: 10, fontSize: '0.8rem', fontWeight: 600, color: '#4971B1' }}>Ver ranking da comunidade →</Link>
          </div>
        ) : (
          <div style={{ background: '#eef3fa', border: '1px solid #d7e3f4', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: 24, fontSize: '0.82rem', color: '#4971B1' }}>
            Dica: envie com seu nome na próxima vez para ganhar pontos e entrar no <Link to="/ranking" style={{ fontWeight: 700 }}>ranking da comunidade</Link>.
          </div>
        )}

        <button onClick={function() { setForm(EMPTY_FORM); setPontosInfo(null); setDone(false) }} style={{
          padding: '10px 24px', borderRadius: 8, border: 'none', background: '#4971B1',
          color: '#fff', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer',
        }}>Enviar outra denúncia</button>
      </div>
    )
  }

  return (
    <div className="atv-container" style={{ padding: '2.5rem 1rem 3.5rem', maxWidth: 640, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>Envie sua denúncia</h1>
      <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 24 }}>
        Viu um problema na cidade — buraco na via, falta d'água, iluminação apagada, maus-tratos a animais,
        incêndio, barulho? Mande foto ou vídeo e conte pra gente. Envie com seu nome e ganhe pontos no{' '}
        <Link to="/ranking" style={{ color: '#4971B1', fontWeight: 600 }}>ranking da comunidade</Link>.
      </p>

      <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1.5rem' }}>
        <DashFormField label="Categoria *">
          <select value={form.category} onChange={function(e) { set('category', e.target.value) }} style={selectStyle} required>
            <option value="">Selecione...</option>
            {DENUNCIA_CATEGORIAS.map(function(c) {
              return <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
            })}
          </select>
        </DashFormField>

        <DashFormField label="Local do ocorrido" hint="Rua, bairro ou ponto de referência">
          <input value={form.location} onChange={function(e) { set('location', e.target.value) }} style={inputStyle} placeholder="Ex: Rua das Flores, Jardim Imperial" />
        </DashFormField>

        <DashFormField label="Descreva o problema *">
          <textarea value={form.description} onChange={function(e) { set('description', e.target.value) }} style={textareaStyle} placeholder="Conte o que está acontecendo..." required />
        </DashFormField>

        <DashFormField label="Foto ou vídeo" hint="Opcional, mas ajuda muito a equipe a entender o caso">
          <ImageUpload value={form.mediaUrl} onChange={function(url) { set('mediaUrl', url) }} path="denuncias" accept="image/*,video/*" />
        </DashFormField>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <DashFormField label="Seu nome" hint="Com nome, você pontua no ranking">
            <input value={form.name} onChange={function(e) { set('name', e.target.value) }} style={inputStyle} placeholder="Anônimo" />
          </DashFormField>
          <DashFormField label="Telefone ou e-mail" hint="Opcional, para retorno">
            <input value={form.contact} onChange={function(e) { set('contact', e.target.value) }} style={inputStyle} placeholder="Só se quiser resposta" />
          </DashFormField>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', color: '#dc2626', fontSize: '0.82rem', padding: '10px 14px', borderRadius: 8, marginBottom: '1rem' }}>{error}</div>
        )}

        <button type="submit" disabled={saving} style={{
          width: '100%', padding: '12px', borderRadius: 8, border: 'none',
          background: saving ? '#93a3b8' : '#Cd0000', color: '#fff', fontSize: '0.92rem',
          fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
        }}>
          {saving ? 'Enviando...' : 'Enviar denúncia'}
        </button>
      </form>
    </div>
  )
}
