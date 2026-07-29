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
  var consentState = useState(false)
  var consent = consentState[0]
  var setConsent = consentState[1]

  useEffect(function() { trackPageView('denuncia') }, [])

  /* ao concluir o envio, a pagina continua na posicao de rolagem de onde o
     formulario foi preenchido — sem isso, a mensagem de sucesso renderiza
     fora da tela e parece "sumida" ate o usuario rolar pra cima */
  useEffect(function() {
    if (done) window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [done])

  function set(key, val) { setForm(function(f) { return Object.assign({}, f, { [key]: val }) }) }

  var categoriaSelecionada = DENUNCIA_CATEGORIAS.find(function(c) { return c.value === form.category })

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.category || !form.description) {
      setError('Preencha ao menos a categoria e a descrição do problema.')
      return
    }
    if ((form.name || form.contact) && !consent) {
      setError('Marque a confirmação de uso do nome/telefone, ou deixe os dois campos em branco pra enviar anônimo.')
      return
    }
    setError('')
    setSaving(true)
    try {
      await addDoc(collection(db, 'denuncias'), Object.assign({}, form, {
        status: 'novo',
        createdAt: serverTimestamp(),
      }))

      /* gamificacao: so pontua quem se identifica com nome ou contato.
         nome completo + contato ficam SO no doc "participantes" (uso interno,
         leitura restrita ao admin). O que alimenta o ranking publico e um doc
         separado com apenas primeiro nome + pontos, sem nenhum dado pessoal. */
      var participantId = slugifyParticipant(form.contact, form.name)
      if (participantId) {
        var pontosGanhos = form.mediaUrl ? PONTOS_ENVIO_COM_MIDIA : PONTOS_ENVIO_SEM_MIDIA
        var primeiroNome = (form.name || '').trim().split(/\s+/)[0] || 'Anônimo'

        await setDoc(doc(db, 'participantes', participantId), {
          displayName: form.name || 'Anônimo',
          contact: form.contact || '',
          totalPoints: increment(pontosGanhos),
          totalEnvios: increment(1),
          lastEnvioAt: serverTimestamp(),
        }, { merge: true })

        var publicoRef = doc(db, 'ranking_publico', participantId)
        await setDoc(publicoRef, {
          firstName: primeiroNome,
          totalPoints: increment(pontosGanhos),
          totalEnvios: increment(1),
        }, { merge: true })

        var snap = await getDoc(publicoRef)
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
          Obrigado por contribuir com Atibaia. Sua denúncia aparece <b>sempre de forma anônima</b> no{' '}
          <Link to="/mural" style={{ color: '#4971B1', fontWeight: 600 }}>mural da cidade</Link>, se for aprovada pela nossa equipe.
        </p>

        {pontosInfo ? (
          <div style={{ background: '#fff7e0', border: '1px solid #ffe6a3', borderRadius: 12, padding: '1.25rem', marginBottom: 24 }}>
            <div style={{ fontSize: '2rem', marginBottom: 4 }}>{pontosInfo.nivel.icon}</div>
            <p style={{ fontWeight: 700, color: '#1a1a2e', fontSize: '1rem' }}>+{pontosInfo.ganhos} pontos!</p>
            <p style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: 4 }}>
              Você já tem <b>{pontosInfo.total} pontos</b> e é <b style={{ color: pontosInfo.nivel.color }}>{pontosInfo.nivel.label}</b>
            </p>
            <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: 8 }}>
              Seu nome e telefone ficam só no nosso controle interno. Se você estiver entre os 5 mais engajados, só o seu primeiro nome aparece no ranking público.
            </p>
            <Link to="/ranking" style={{ display: 'inline-block', marginTop: 10, fontSize: '0.8rem', fontWeight: 600, color: '#4971B1' }}>Ver ranking da comunidade →</Link>
          </div>
        ) : (
          <div style={{ background: '#eef3fa', border: '1px solid #d7e3f4', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: 24, fontSize: '0.82rem', color: '#4971B1' }}>
            Dica: envie com seu nome e telefone na próxima vez. Isso não muda nada no mural (continua anônimo), mas te coloca no nosso{' '}
            <Link to="/ranking" style={{ fontWeight: 700 }}>ranking de colaboradores</Link> — os 5 mais engajados aparecem com o primeiro nome no site.
          </div>
        )}

        <button onClick={function() { setForm(EMPTY_FORM); setPontosInfo(null); setConsent(false); setDone(false) }} style={{
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
        Viu um problema na cidade — infraestrutura, saúde, educação, segurança ou situações que exigem atenção
        especial? Escolha a categoria mais próxima, mande foto ou vídeo se puder, e conte pra gente.
      </p>
      <p style={{ background: '#fff7e0', border: '1px solid #ffe6a3', borderRadius: 10, padding: '0.75rem 1rem', color: '#7a5c00', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: 12, fontWeight: 600 }}>
        ⚠️ Este canal tem finalidade jornalística — a Atibaia TV registra e pode acompanhar o caso, mas quem
        resolve de fato é sempre o órgão oficial responsável. Ao escolher a categoria abaixo, mostramos o canal certo pra acionar.
      </p>
      <p style={{ background: '#eef3fa', border: '1px solid #d7e3f4', borderRadius: 10, padding: '0.75rem 1rem', color: '#374151', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: 24 }}>
        🔒 Sua denúncia <b>sempre aparece anônima</b> no site, com nome ou sem nome. Mas se você se identificar,
        entra no nosso <Link to="/ranking" style={{ color: '#4971B1', fontWeight: 700 }}>ranking de colaboradores</Link> — e os 5 mais engajados
        aparecem com o primeiro nome no ranking público.
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

        {categoriaSelecionada && categoriaSelecionada.sensivel && (
          <div style={{ background: '#fdf2f8', border: '1px solid #fbcfe8', borderRadius: 10, padding: '1rem 1.1rem', marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#9d174d', marginBottom: 6 }}>
              🆘 Para esse tipo de situação, procure primeiro o canal especializado:
            </p>
            <p style={{ fontSize: '0.88rem', color: '#374151', marginBottom: 4 }}>
              <b>{categoriaSelecionada.canal.nome}:</b> {categoriaSelecionada.canal.numero}
            </p>
            <p style={{ fontSize: '0.76rem', color: '#6b7280', marginBottom: 8 }}>{categoriaSelecionada.canal.descricao}</p>
            <p style={{ fontSize: '0.76rem', color: '#6b7280' }}>
              Em caso de perigo imediato, ligue <b>190</b> (Polícia Militar) ou <b>192</b> (SAMU).
              Você também pode continuar e nos contar aqui — isso ajuda a equipe a acompanhar o caso, mas não substitui os canais acima.
            </p>
          </div>
        )}

        {categoriaSelecionada && !categoriaSelecionada.sensivel && categoriaSelecionada.canal && (
          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '0.9rem 1.1rem', marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.8rem', color: '#374151', marginBottom: 2 }}>
              📞 Canal oficial pra resolver esse tipo de problema: <b>{categoriaSelecionada.canal.nome}</b> — {categoriaSelecionada.canal.numero}
            </p>
            {categoriaSelecionada.canal.descricao && (
              <p style={{ fontSize: '0.74rem', color: '#9ca3af' }}>{categoriaSelecionada.canal.descricao}</p>
            )}
            <p style={{ fontSize: '0.74rem', color: '#9ca3af', marginTop: 4 }}>
              Enviar aqui também ajuda: sua denúncia pode virar matéria e dar mais visibilidade ao problema.
            </p>
          </div>
        )}

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
          <DashFormField label="Seu nome" hint="Sua denúncia continua anônima — o nome fica só no nosso controle interno">
            <input value={form.name} onChange={function(e) { set('name', e.target.value) }} style={inputStyle} placeholder="Anônimo" />
          </DashFormField>
          <DashFormField label="Telefone ou e-mail" hint="Usado só internamente, nunca aparece no site">
            <input value={form.contact} onChange={function(e) { set('contact', e.target.value) }} style={inputStyle} placeholder="Opcional" />
          </DashFormField>
        </div>

        {(form.name || form.contact) && (
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.78rem', color: '#4b5563', marginBottom: '1rem', cursor: 'pointer', lineHeight: 1.5 }}>
            <input type="checkbox" checked={consent} onChange={function(e) { setConsent(e.target.checked) }} style={{ marginTop: 3, flexShrink: 0 }} />
            Autorizo o uso do meu nome e telefone/e-mail para fins internos de ranking e contato, conforme a{' '}
            <Link to="/privacidade" target="_blank" style={{ color: '#4971B1', fontWeight: 600 }}>Política de Privacidade</Link>. Sei que minha denúncia aparece sempre anônima no site.
          </label>
        )}

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
