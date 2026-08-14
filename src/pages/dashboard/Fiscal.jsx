import { useState, useEffect } from 'react'
import DashCard from '../../components/dashboard/DashCard'

const CHAVE_CACHE = 'atibaiatv-certidoes-ultimo-estado'

const NOMES_CERTIDAO = {
  federal: 'CND Federal',
  sefaz: 'CND Estadual (Sefaz SP)',
  pge: 'Dívida Ativa (PGE SP)',
  fgts: 'FGTS (Caixa)',
  tjsp: 'Falências e Concordatas (TJSP)',
  cndt: 'CNDT (TST)',
}

const ROTULO_STATUS = {
  'nunca-emitida': 'nunca emitida',
  valida: 'válida',
  vencendo: 'vencendo em breve',
  vencida: 'VENCIDA',
}

const COR_STATUS = {
  'nunca-emitida': '#9ca3af',
  valida: '#16a34a',
  vencendo: '#d97706',
  vencida: '#dc2626',
}

const ROTULO_STATUS_GUIA = {
  paga: 'paga',
  'a-vencer': 'a vencer',
  vencendo: 'vencendo em breve',
  vencida: 'VENCIDA',
  'sem-vencimento': 'sem vencimento',
}

const COR_STATUS_GUIA = {
  paga: '#9ca3af',
  'a-vencer': '#16a34a',
  vencendo: '#d97706',
  vencida: '#dc2626',
  'sem-vencimento': '#9ca3af',
}

export default function Fiscal() {
  const [dados, setDados] = useState(null)
  const [aoVivo, setAoVivo] = useState(false)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let cancelado = false

    async function carregar() {
      try {
        const controlador = new AbortController()
        const cronometro = setTimeout(() => controlador.abort(), 2000)
        const resposta = await fetch('http://localhost:4747/api/ping', { signal: controlador.signal })
        clearTimeout(cronometro)
        if (!resposta.ok) throw new Error('resposta não-ok')
        const json = await resposta.json()
        if (cancelado) return
        localStorage.setItem(CHAVE_CACHE, JSON.stringify(json))
        setDados(json)
        setAoVivo(true)
      } catch {
        if (cancelado) return
        const cache = localStorage.getItem(CHAVE_CACHE)
        setDados(cache ? JSON.parse(cache) : null)
        setAoVivo(false)
      } finally {
        if (!cancelado) setCarregando(false)
      }
    }

    carregar()
    return () => { cancelado = true }
  }, [])

  if (carregando) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>Carregando...</div>
  }

  if (!dados) {
    return (
      <>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1.5rem' }}>Situação Fiscal</h1>
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '1.5rem', color: '#6b7280' }}>
          Não foi possível conectar ao computador que emite as certidões, e não há nenhuma posição salva
          ainda neste navegador. Abra o painel local (http://localhost:4747) na máquina que roda a
          ferramenta de certidões pelo menos uma vez.
        </div>
      </>
    )
  }

  const vencidas = dados.certidoes.filter((c) => c.status === 'vencida').length
  const vencendo = dados.certidoes.filter((c) => c.status === 'vencendo').length
  const listaGuias = dados.guias.lista || []
  const ultimasNfse = dados.nfse?.ultimasEmitidas || []

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a2e' }}>Situação Fiscal</h1>
        <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>
          {new Date(dados.atualizadoEm).toLocaleString('pt-BR')}
        </span>
      </div>

      {!aoVivo && (
        <div style={{
          background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e',
          borderRadius: 8, padding: '0.85rem 1rem', marginBottom: '1.5rem', fontSize: '0.82rem',
        }}>
          Não foi possível falar agora com o computador que emite as certidões. Mostrando a última
          posição salva neste navegador — dali só dá para consultar, não emitir.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <DashCard icon="⚠️" label="Certidões vencidas" value={vencidas} color="#dc2626" />
        <DashCard icon="⏳" label="Vencendo em breve" value={vencendo} color="#d97706" />
        <DashCard icon="💰" label="Guias vencidas" value={dados.guias.vencidas} color="#dc2626" />
        <DashCard icon="🧾" label="Guias cadastradas" value={dados.guias.total} color="#4971B1" />
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#1a1a2e', marginBottom: '1rem' }}>Certidões</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#6b7280', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '0.5rem 0' }}>Certidão</th>
              <th style={{ padding: '0.5rem 0' }}>Situação</th>
              <th style={{ padding: '0.5rem 0' }}>Dias</th>
            </tr>
          </thead>
          <tbody>
            {dados.certidoes.map((certidao) => (
              <tr key={certidao.chave} style={{ borderTop: '1px solid #f3f4f6' }}>
                <td style={{ padding: '0.6rem 0' }}>{NOMES_CERTIDAO[certidao.chave] || certidao.chave}</td>
                <td style={{ padding: '0.6rem 0', color: COR_STATUS[certidao.status], fontWeight: 600 }}>
                  {ROTULO_STATUS[certidao.status] || certidao.status}
                </td>
                <td style={{ padding: '0.6rem 0', color: '#6b7280' }}>
                  {certidao.diasFaltando != null ? certidao.diasFaltando : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '1.5rem', marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#1a1a2e', marginBottom: '1rem' }}>Guias de tributos</h2>
        {listaGuias.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Nenhuma guia cadastrada ainda.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#6b7280', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.5rem 0' }}>Tipo</th>
                <th style={{ padding: '0.5rem 0' }}>Competência</th>
                <th style={{ padding: '0.5rem 0' }}>Valor</th>
                <th style={{ padding: '0.5rem 0' }}>Vencimento</th>
                <th style={{ padding: '0.5rem 0' }}>Situação</th>
              </tr>
            </thead>
            <tbody>
              {listaGuias.map((guia) => (
                <tr key={guia.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.6rem 0' }}>{guia.tipo}</td>
                  <td style={{ padding: '0.6rem 0' }}>{guia.competencia || '—'}</td>
                  <td style={{ padding: '0.6rem 0' }}>{guia.valor || '—'}</td>
                  <td style={{ padding: '0.6rem 0' }}>{guia.vencimento || '—'}</td>
                  <td style={{ padding: '0.6rem 0', color: COR_STATUS_GUIA[guia.status], fontWeight: 600 }}>
                    {ROTULO_STATUS_GUIA[guia.status] || guia.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '1.5rem', marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#1a1a2e', marginBottom: '1rem' }}>Últimas NFS-e emitidas</h2>
        {ultimasNfse.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Nenhuma NFS-e emitida por esta ferramenta ainda.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#6b7280', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.5rem 0' }}>Tomador</th>
                <th style={{ padding: '0.5rem 0' }}>Competência</th>
                <th style={{ padding: '0.5rem 0' }}>Valor</th>
                <th style={{ padding: '0.5rem 0' }}>Ambiente</th>
                <th style={{ padding: '0.5rem 0' }}>Emitida em</th>
              </tr>
            </thead>
            <tbody>
              {ultimasNfse.map((nfse) => (
                <tr key={nfse.chaveAcesso} style={{ borderTop: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.6rem 0' }}>{nfse.tomadorNome || '—'}</td>
                  <td style={{ padding: '0.6rem 0' }}>{nfse.competencia || '—'}</td>
                  <td style={{ padding: '0.6rem 0' }}>R$ {Number(nfse.valorServico).toFixed(2)}</td>
                  <td style={{ padding: '0.6rem 0' }}>
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: 999,
                      background: nfse.ambiente === 'producao' ? '#dcfce7' : '#fef3c7',
                      color: nfse.ambiente === 'producao' ? '#16a34a' : '#92400e',
                    }}>
                      {nfse.ambiente === 'producao' ? 'PRODUÇÃO' : 'homologação'}
                    </span>
                  </td>
                  <td style={{ padding: '0.6rem 0', color: '#6b7280' }}>
                    {new Date(nfse.emitidoEm).toLocaleString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
