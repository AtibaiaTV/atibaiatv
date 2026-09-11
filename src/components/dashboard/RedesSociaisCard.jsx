import { useState, useEffect, useCallback } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'

/* Painel de redes sociais.

   Os numeros ficam gravados no Firestore e a tela le de la, em vez de chamar a
   Meta a cada carregamento: seguidor muda devagar e a API tem limite de uso.
   Dois botoes atualizam, com custos bem diferentes.

   "Atualizar" busca seguidores e quantidade de publicacoes — duas chamadas,
   questao de segundos. "Varredura completa" percorre publicacao por publicacao
   para somar as visualizacoes de todo o historico; sao milhares de chamadas e
   leva minutos, entao roda so quando alguem pede.

   A soma por publicacao nao equivale ao total que o painel da Meta exibe:
   stories ficam de fora e o Facebook so responde a visualizacao de video. Por
   isso os rotulos aqui dizem "de video" e a data de cada apuracao fica visivel.
*/

const REF = ['socialStats', 'atual']
const API = '/api/social-insights'

const fmt = n => (typeof n === 'number' ? n.toLocaleString('pt-BR') : '—')

const quando = iso => {
  if (!iso) return null
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR') + ', ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export default function RedesSociaisCard() {
  const { user } = useAuth()
  const [dados, setDados] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [ocupado, setOcupado] = useState(null)   // 'resumo' | 'varredura'
  const [progresso, setProgresso] = useState('')
  const [erro, setErro] = useState(null)

  useEffect(() => {
    getDoc(doc(db, ...REF))
      .then(s => setDados(s.exists() ? s.data() : null))
      .catch(e => setErro(e.message))
      .finally(() => setCarregando(false))
  }, [])

  const chamar = useCallback(async (corpo) => {
    const idToken = await user.getIdToken()
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ idToken, ...corpo }),
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error)
    return data
  }, [user])

  async function atualizarResumo() {
    setOcupado('resumo'); setErro(null)
    try {
      const r = await chamar({ modo: 'resumo' })
      const novo = {
        facebook: { ...(dados?.facebook || {}), ...(r.facebook || {}) },
        instagram: { ...(dados?.instagram || {}), ...(r.instagram || {}) },
        seguidoresEm: new Date().toISOString(),
      }
      await setDoc(doc(db, ...REF), novo, { merge: true })
      setDados(d => ({ ...(d || {}), ...novo }))
    } catch (e) {
      setErro(e.message)
    } finally {
      setOcupado(null)
    }
  }

  /* segue o cursor ate o fim; o endpoint limita as paginas por chamada para nao
     estourar o tempo da borda, entao quem emenda os pedacos e esta funcao */
  async function varrer(rede) {
    let cursor = null, total = 0, publicacoes = 0, semMetrica = 0, de = null, metrica = null, voltas = 0
    do {
      const r = await chamar({ modo: 'publicacoes', rede, cursor })
      total += r.total; publicacoes += r.publicacoes; semMetrica += r.semMetrica
      metrica = r.metrica
      if (r.maisAntigo && (!de || r.maisAntigo < de)) de = r.maisAntigo
      cursor = r.proximoCursor
      setProgresso(rede + ': ' + fmt(total) + ' em ' + publicacoes + ' publicações')
    } while (cursor && ++voltas < 200)
    return { total, publicacoes, semMetrica, metrica, desde: de ? de.slice(0, 10) : null }
  }

  async function varreduraCompleta() {
    setOcupado('varredura'); setErro(null); setProgresso('')
    try {
      const instagram = await varrer('instagram')
      const facebook = await varrer('facebook')
      const novo = {
        facebook: { ...(dados?.facebook || {}), ...facebook },
        instagram: { ...(dados?.instagram || {}), ...instagram },
        varreduraEm: new Date().toISOString(),
      }
      await setDoc(doc(db, ...REF), novo, { merge: true })
      setDados(d => ({ ...(d || {}), ...novo }))
      setProgresso('')
    } catch (e) {
      setErro(e.message)
    } finally {
      setOcupado(null)
    }
  }

  const fb = dados?.facebook || {}
  const ig = dados?.instagram || {}

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '1.25rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: 10 }}>
        <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1a1a2e' }}>Redes sociais</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={atualizarResumo} disabled={Boolean(ocupado)} style={botao(false, Boolean(ocupado))}>
            {ocupado === 'resumo' ? 'Buscando…' : 'Atualizar'}
          </button>
          <button onClick={varreduraCompleta} disabled={Boolean(ocupado)} style={botao(true, Boolean(ocupado))}>
            {ocupado === 'varredura' ? 'Varrendo…' : 'Varredura completa'}
          </button>
        </div>
      </div>

      {carregando && <div style={aviso}>Carregando…</div>}
      {erro && <div style={{ ...aviso, color: '#b91c1c' }}>{erro}</div>}
      {progresso && <div style={aviso}>{progresso}</div>}

      {!carregando && !dados && !erro && (
        <div style={aviso}>Nenhum dado ainda. Use “Atualizar” para buscar os seguidores.</div>
      )}

      {dados && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            <Metrica rotulo="Seguidores no Facebook" valor={fmt(fb.seguidores)} />
            <Metrica rotulo="Seguidores no Instagram" valor={fmt(ig.seguidores)} />
            <Metrica rotulo="Visualizações de vídeo no Facebook" valor={fmt(fb.total)}
              nota={fb.desde && 'desde ' + fb.desde} />
            <Metrica rotulo="Visualizações no Instagram" valor={fmt(ig.total)}
              nota={ig.desde && 'desde ' + ig.desde} />
          </div>

          <div style={{ marginTop: '1rem', fontSize: '0.7rem', color: '#6b7280', lineHeight: 1.6 }}>
            {dados.seguidoresEm && <div>Seguidores apurados em {quando(dados.seguidoresEm)}.</div>}
            {dados.varreduraEm && (
              <div>
                Visualizações apuradas em {quando(dados.varreduraEm)} — soma por publicação
                {typeof ig.semMetrica === 'number' && ig.semMetrica > 0 &&
                  ', com ' + ig.semMetrica + ' publicações do Instagram sem dado'}
                . O Facebook contabiliza apenas vídeo.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function Metrica({ rotulo, valor, nota }) {
  return (
    <div style={{ border: '1px solid #f3f4f6', borderRadius: 10, padding: '0.85rem 1rem' }}>
      <div style={{ fontSize: '0.68rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{rotulo}</div>
      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1a1a2e', marginTop: 2 }}>{valor}</div>
      {nota && <div style={{ fontSize: '0.65rem', color: '#9ca3af', marginTop: 2 }}>{nota}</div>}
    </div>
  )
}

const aviso = { fontSize: '0.8rem', color: '#374151', marginBottom: '0.75rem' }

const botao = (secundario, desabilitado) => ({
  fontSize: '0.75rem',
  fontWeight: 600,
  padding: '0.4rem 0.8rem',
  borderRadius: 8,
  border: '1px solid ' + (secundario ? '#d1d5db' : '#4971B1'),
  background: secundario ? '#fff' : '#4971B1',
  color: secundario ? '#374151' : '#fff',
  cursor: desabilitado ? 'default' : 'pointer',
  opacity: desabilitado ? 0.55 : 1,
})
