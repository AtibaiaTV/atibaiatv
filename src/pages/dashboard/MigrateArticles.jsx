import { useState, useEffect } from 'react'
import { collection, getDocs, updateDoc, doc, orderBy, query } from 'firebase/firestore'
import { db } from '../../firebase'
import { Link } from 'react-router-dom'

/* Ferramenta de uma vez so: preenche subtitulo, resumo e credito da foto nas
   materias antigas, publicadas antes desses campos existirem.

   Nada e inventado — subtitulo e resumo saem de frases do proprio texto da
   materia. O updatedAt nao e tocado, pra nenhuma materia antiga aparecer no
   site como "Atualizado em" so por causa dessa migracao. */

const DEFAULT_CREDIT = 'Atibaia TV'
const MAX_SUBTITLE = 220

/* quebra o texto em frases, paragrafo a paragrafo e sem os intertitulos,
   pra um titulo de secao nao acabar colado na frase seguinte */
function splitSentences(text) {
  var lines = String(text || '').split('\n')
  var sentences = []
  lines.forEach(function (line) {
    var clean = line.replace(/\s+/g, ' ').trim()
    if (!clean || clean.indexOf('## ') === 0) return
    clean.split(/(?<=[.!?])\s+(?=[A-ZÁÂÃÀÉÊÍÓÔÕÚÇ"“])/).forEach(function (p) {
      var frase = p.trim()
      if (frase.length > 25) sentences.push(frase)
    })
  })
  return sentences
}

function buildSubtitle(article) {
  var sentences = splitSentences(article.body)
  if (sentences.length === 0) return ''
  var first = sentences[0]
  /* se a primeira frase so repete o titulo, tenta a seguinte */
  var title = String(article.title || '').toLowerCase().slice(0, 40)
  if (title && first.toLowerCase().indexOf(title) === 0 && sentences.length > 1) first = sentences[1]
  if (first.length > MAX_SUBTITLE) {
    var cut = first.slice(0, MAX_SUBTITLE)
    var lastSpace = cut.lastIndexOf(' ')
    first = (lastSpace > 80 ? cut.slice(0, lastSpace) : cut) + '...'
  }
  return first
}

function buildSummary(article, subtitle) {
  var sentences = splitSentences(article.body).filter(function (s) { return s !== subtitle })
  return sentences.slice(0, 3).join('\n')
}

/* o que essa materia ganharia; retorna null se nao ha nada a mudar */
function planFor(article) {
  var changes = {}
  var hasText = Boolean(String(article.body || '').trim())

  if (!String(article.subtitle || '').trim() && hasText) {
    var sub = buildSubtitle(article)
    if (sub) changes.subtitle = sub
  }
  if (!String(article.summary || '').trim() && hasText) {
    var sum = buildSummary(article, changes.subtitle || article.subtitle || '')
    if (sum) changes.summary = sum
  }
  if (!String(article.imageCredit || '').trim() && String(article.thumbnailUrl || '').trim()) {
    changes.imageCredit = DEFAULT_CREDIT
  }
  return Object.keys(changes).length > 0 ? changes : null
}

const cardStyle = { background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '1.5rem', marginBottom: '1.5rem' }

export default function MigrateArticles() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(0)
  const [failed, setFailed] = useState([])
  const [finished, setFinished] = useState(false)

  const fetchArticles = async () => {
    setLoading(true)
    const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    setArticles(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    setLoading(false)
  }

  useEffect(() => { fetchArticles() }, [])

  const pending = articles
    .map(a => ({ article: a, changes: planFor(a) }))
    .filter(x => x.changes)

  const run = async () => {
    if (!window.confirm('Preencher subtitulo, resumo e credito em ' + pending.length + ' materias?')) return
    setRunning(true)
    setDone(0)
    setFailed([])
    setFinished(false)
    const errors = []
    for (let i = 0; i < pending.length; i++) {
      try {
        /* so os campos novos: updatedAt fica intacto de proposito */
        await updateDoc(doc(db, 'articles', pending[i].article.id), pending[i].changes)
      } catch (err) {
        console.error(err)
        errors.push(pending[i].article.title || pending[i].article.id)
      }
      setDone(i + 1)
    }
    setFailed(errors)
    setRunning(false)
    setFinished(true)
    await fetchArticles()
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>Carregando materias...</div>

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a2e' }}>Completar materias antigas</h1>
        <Link to="/dashboard/articles" style={{ fontSize: '0.85rem', color: '#4971B1', textDecoration: 'none' }}>Voltar para Materias</Link>
      </div>

      <div style={cardStyle}>
        <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: '#374151', marginBottom: 12 }}>
          Materias publicadas antes do formato novo estao sem subtitulo, resumo e credito da foto.
          Esta ferramenta preenche esses campos usando frases do proprio texto de cada materia —
          nada e inventado, e o texto da materia nao e alterado.
        </p>
        <ul style={{ fontSize: '0.85rem', lineHeight: 1.8, color: '#4b5563', paddingLeft: 18, marginBottom: 16 }}>
          <li><strong>Subtitulo:</strong> primeira frase do texto.</li>
          <li><strong>Resumo:</strong> ate tres frases, uma por topico na caixa "Ver resumo".</li>
          <li><strong>Credito da foto:</strong> {DEFAULT_CREDIT} (so onde ha imagem de capa).</li>
        </ul>
        <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: 16 }}>
          Materias que ja tem esses campos preenchidos nao sao tocadas, e a data de atualizacao
          nao muda — nenhuma materia antiga vai aparecer como "Atualizado em" por causa disso.
          Depois e so revisar e ajustar o que quiser, materia por materia.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1a1a2e' }}>
            {pending.length} de {articles.length} materias a completar
          </span>
          <button
            onClick={run}
            disabled={running || pending.length === 0}
            style={{
              padding: '10px 24px', borderRadius: 8, border: 'none',
              background: (running || pending.length === 0) ? '#93a3b8' : '#4971B1',
              color: '#fff', fontSize: '0.88rem', fontWeight: 600,
              cursor: (running || pending.length === 0) ? 'not-allowed' : 'pointer',
            }}
          >
            {running ? 'Aplicando ' + done + '/' + pending.length + '...' : 'Preencher agora'}
          </button>
        </div>

        {finished && (
          <div style={{ marginTop: 14, fontSize: '0.85rem', color: failed.length ? '#b45309' : '#4a7a35' }}>
            {failed.length
              ? done - failed.length + ' materias atualizadas, ' + failed.length + ' com erro (veja o console).'
              : done + ' materias atualizadas com sucesso.'}
          </div>
        )}
      </div>

      {pending.length > 0 && (
        <div style={cardStyle}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>Previa</h2>
          <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: 16 }}>O que sera gravado nas 5 primeiras materias da fila.</p>
          {pending.slice(0, 5).map(({ article, changes }) => (
            <div key={article.id} style={{ borderTop: '1px solid #e5e7eb', paddingTop: 14, marginTop: 14 }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1a1a2e', marginBottom: 8 }}>{article.title}</div>
              {changes.subtitle && (
                <div style={{ fontSize: '0.82rem', color: '#4b5563', marginBottom: 6 }}>
                  <strong style={{ color: '#6b7280' }}>Subtitulo:</strong> {changes.subtitle}
                </div>
              )}
              {changes.summary && (
                <div style={{ fontSize: '0.82rem', color: '#4b5563', marginBottom: 6 }}>
                  <strong style={{ color: '#6b7280' }}>Resumo:</strong>
                  <ul style={{ paddingLeft: 18, marginTop: 4 }}>
                    {changes.summary.split('\n').map((l, i) => <li key={i} style={{ marginBottom: 3 }}>{l}</li>)}
                  </ul>
                </div>
              )}
              {changes.imageCredit && (
                <div style={{ fontSize: '0.82rem', color: '#4b5563' }}>
                  <strong style={{ color: '#6b7280' }}>Credito da foto:</strong> {changes.imageCredit}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
