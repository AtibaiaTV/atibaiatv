import { useEffect, useState } from 'react'
import { collection, deleteDoc, doc, getDocs, limit, orderBy, query, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'

const REDE_ROTULO = { facebook: 'Facebook', instagram: 'Instagram' }

/* O Facebook tem endpoint de exclusao; o Instagram nao tem nenhum na Graph API.
   Dizer isso na tela evita a impressao de que o botao apagou as duas redes. */
const APAGA_PELA_API = ['facebook']

function formatarData(createdAt) {
  const data = createdAt?.toDate ? createdAt.toDate() : null
  return data ? data.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'
}

/* diz, antes de confirmar, o que a exclusao alcanca de verdade */
function descreverAlcance(post) {
  const ativos = (post.published || []).filter(p => p.id)
  const apagaveis = ativos.filter(p => APAGA_PELA_API.includes(p.network))
  const manuais = ativos.filter(p => !APAGA_PELA_API.includes(p.network))
  const nomes = lista => lista.map(p => REDE_ROTULO[p.network] || p.network).join(', ')

  if (!apagaveis.length) return 'Nenhuma rede: ' + nomes(manuais) + ' não permite apagar pela API — remova pelo app.'
  if (!manuais.length) return 'Sai do feed de ' + nomes(apagaveis) + '.'
  return 'Sai do feed de ' + nomes(apagaveis) + '. ' + nomes(manuais) + ' não permite apagar pela API e continua no ar.'
}

export default function SocialPostsHistory({ recarregar }) {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [ocupado, setOcupado] = useState(null)
  const [status, setStatus] = useState(null)

  const carregar = async () => {
    setCarregando(true)
    try {
      const q = query(collection(db, 'socialPosts'), orderBy('createdAt', 'desc'), limit(30))
      const snap = await getDocs(q)
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (e) {
      setStatus({ ok: false, msg: 'Não foi possível carregar o histórico: ' + e.message })
    }
    setCarregando(false)
  }

  useEffect(() => { carregar() }, [recarregar])

  const excluirDaRede = async (post) => {
    if (!window.confirm('Excluir a publicação das redes?\n\n' + descreverAlcance(post) + '\n\nA ação não pode ser desfeita.')) return
    setOcupado(post.id)
    setStatus(null)
    try {
      const idToken = await user.getIdToken()
      const res = await fetch('/api/social-delete', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ idToken, published: post.published || [] }),
      })
      const data = await res.json()

      /* o que saiu do ar deixa de constar como publicado; o que a rede recusou
         continua marcado, para o operador saber que ainda esta no feed */
      const restantes = (post.published || []).filter(p => !data.removed?.includes(p.network))
      await updateDoc(doc(db, 'socialPosts', post.id), { published: restantes, deleteErrors: data.errors || [] })

      setStatus({
        ok: Boolean(data.removed?.length),
        msg: (data.removed?.length ? 'Removido de: ' + data.removed.map(r => REDE_ROTULO[r] || r).join(', ') : 'Nada foi removido')
          + (data.errors?.length ? '  |  ' + data.errors.join(' · ') : ''),
      })
      await carregar()
    } catch (e) {
      setStatus({ ok: false, msg: 'Erro ao excluir das redes: ' + e.message })
    }
    setOcupado(null)
  }

  const removerDoHistorico = async (post) => {
    if (!window.confirm('Remover do histórico?\n\nO post sai desta lista. O que já foi publicado continua no ar nas redes.')) return
    setOcupado(post.id)
    try {
      await deleteDoc(doc(db, 'socialPosts', post.id))
      await carregar()
    } catch (e) {
      setStatus({ ok: false, msg: 'Erro ao remover: ' + e.message })
    }
    setOcupado(null)
  }

  const btn = (bg, color, border) => ({
    padding: '6px 12px', borderRadius: 8, border: border || 'none', background: bg,
    color, fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
  })

  if (carregando) return <p style={{ fontSize: '0.82rem', color: '#6b7280' }}>Carregando o histórico...</p>
  if (!posts.length) return <p style={{ fontSize: '0.82rem', color: '#9ca3af' }}>Nenhum post publicado ainda.</p>

  return (
    <div>
      {status && (
        <p style={{
          fontSize: '0.8rem', fontWeight: 600, padding: '10px 14px', borderRadius: 8, marginBottom: 12,
          background: status.ok ? '#ecfdf5' : '#fef2f2', color: status.ok ? '#059669' : '#dc2626',
        }}>{status.msg}</p>
      )}

      <div style={{ display: 'grid', gap: 10 }}>
        {posts.map(post => (
          <div key={post.id} style={{
            display: 'flex', gap: 12, alignItems: 'flex-start', background: '#fff',
            border: '1px solid #e5e7eb', borderRadius: 12, padding: '0.85rem 1rem',
          }}>
            {post.videoUrl ? (
              <video src={post.videoUrl} muted preload="metadata"
                style={{ width: 54, height: 68, objectFit: 'cover', borderRadius: 8, flexShrink: 0, background: '#000' }} />
            ) : post.imageUrls?.[0] && (
              <img src={post.imageUrls[0]} alt="" style={{ width: 54, height: 68, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
            )}

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#1a1a2e' }}>{post.title || 'Sem título'}</span>
                {post.videoUrl && (
                  <span style={{ fontSize: '0.68rem', color: '#4971B1', background: '#eef3fa', borderRadius: 12, padding: '2px 8px' }}>
                    🎬 Vídeo
                  </span>
                )}
                {post.imageUrls?.length > 1 && (
                  <span style={{ fontSize: '0.68rem', color: '#4971B1', background: '#eef3fa', borderRadius: 12, padding: '2px 8px' }}>
                    Carrossel · {post.imageUrls.length}
                  </span>
                )}
                <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{formatarData(post.createdAt)}</span>
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
                {(post.published || []).map(p => (
                  <a key={p.network} href={p.permalink || '#'} target="_blank" rel="noreferrer"
                    style={{ fontSize: '0.72rem', color: '#4971B1' }}>
                    {REDE_ROTULO[p.network] || p.network}{p.scheduled ? ' (agendado)' : ''}
                  </a>
                ))}
                {!(post.published || []).length && (
                  <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>fora do ar</span>
                )}
                {(post.deleteErrors || []).map((erro, i) => (
                  <span key={i} style={{ fontSize: '0.72rem', color: '#dc2626' }}>{erro}</span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
              {(post.published || []).length > 0 && (
                <button disabled={ocupado === post.id} onClick={() => excluirDaRede(post)}
                  style={btn('#fff', '#Cd0000', '1px solid #f3d0d0')}>🗑️ Excluir da rede</button>
              )}
              <button disabled={ocupado === post.id} onClick={() => removerDoHistorico(post)}
                style={btn('#fff', '#6b7280', '1px solid #e5e7eb')}>Remover do histórico</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
