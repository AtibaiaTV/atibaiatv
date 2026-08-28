import { Link } from 'react-router-dom'

/* Guia da redacao: o que preencher em cada materia e, principalmente, como
   creditar foto que nao e da nossa equipe. Fica em /dashboard/articles/padrao. */

const FIELDS = [
  { name: 'Titulo', level: 'obrigatorio', text: 'Aparece grande, em fonte serifada e na cor da editoria. A cor sai sozinha da editoria escolhida; ninguem precisa configurar nada.' },
  { name: 'Subtitulo', level: 'obrigatorio', text: 'A linha fina, logo abaixo do titulo. Uma ou duas frases que completam o titulo com a informacao seguinte, sem repetir o que ele ja disse.' },
  { name: 'Resumo', level: 'recomendado', text: 'Alimenta a caixa retratil "Ver resumo" no topo da materia. Um topico por linha, de dois a quatro. Cada linha precisa fazer sentido sozinha.' },
  { name: 'Editoria', level: 'obrigatorio', text: 'Define a cor do titulo, o chapeu acima dele e quais materias aparecem em "Leia tambem". Editoria errada quebra as tres coisas de uma vez.' },
  { name: 'Cidade / local', level: 'recomendado', text: 'Entra na assinatura: Por Fulano, Atibaia TV — Atibaia. Preencha com a cidade do fato, nao com a da redacao.' },
  { name: 'Texto da materia', level: 'obrigatorio', text: 'Linha em branco separa paragrafos. Para criar um intertitulo no meio do texto, comece a linha com "## " — por exemplo "## Como participar".' },
  { name: 'Imagem de capa', level: 'obrigatorio', text: 'Sempre horizontal e com boa resolucao. E a foto que abre a materia e a que vai para o Facebook e o WhatsApp quando alguem compartilha.' },
  { name: 'Legenda da foto', level: 'recomendado', text: 'Descreve o que se ve na imagem. Aparece em cinza logo abaixo dela.' },
  { name: 'Credito da foto', level: 'obrigatorio', text: 'Quem fez a imagem. Veja a regra abaixo — este e o campo que nao pode falhar.' },
]

const CREDITS = [
  ['Feita por alguem da nossa equipe', 'Atibaia TV'],
  ['Reporter ou cinegrafista nosso, identificado', 'Nome do profissional / Atibaia TV'],
  ['Assessoria da Prefeitura', 'Prefeitura de Atibaia / Divulgacao'],
  ['Assessoria de empresa, clube ou evento', 'Nome da instituicao / Divulgacao'],
  ['GCM, Policia Militar, Bombeiros', 'GCM de Atibaia / Divulgacao'],
  ['Agencia de noticias', 'Agencia Brasil, Reuters, AFP'],
  ['Print de rede social', 'Reproducao / Instagram'],
  ['Foto enviada por morador ou leitor', 'Arquivo pessoal — ou o nome de quem enviou, se autorizou'],
  ['Banco de imagens', 'Nome do banco (Freepik, Unsplash)'],
]

const STEPS = [
  ['Escreva titulo e subtitulo juntos.', 'Leia os dois em sequencia: se o subtitulo so repetir o titulo, reescreva.'],
  ['Monte o texto com intertitulos.', 'Materia longa pede "## " a cada bloco de assunto.'],
  ['Suba a foto e preencha legenda e credito na mesma hora.', 'Deixar para depois e como o credito se perde.'],
  ['Escreva o resumo por ultimo,', 'com a materia pronta — dois a quatro topicos.'],
  ['Confira a editoria antes de publicar;', 'ela define a cor do titulo e as materias relacionadas.'],
  ['Abra a materia no site e leia como o leitor:', 'titulo, linha fina, foto com credito, resumo.'],
]

const card = { background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '1.5rem', marginBottom: '1.25rem' }
const h2 = { fontSize: '1.05rem', fontWeight: 700, color: '#1a1a2e', marginBottom: 12 }
const para = { fontSize: '0.88rem', lineHeight: 1.7, color: '#4b5563' }

function Badge({ level }) {
  const req = level === 'obrigatorio'
  return (
    <span style={{
      fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
      padding: '2px 7px', borderRadius: 10, whiteSpace: 'nowrap',
      background: req ? '#faeaea' : '#f3f4f6', color: req ? '#b3241f' : '#6b7280',
    }}>
      {req ? 'Obrigatorio' : 'Recomendado'}
    </span>
  )
}

export default function PublishingGuide() {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a2e' }}>Padrao de publicacao</h1>
        <Link to="/dashboard/articles" style={{ fontSize: '0.85rem', color: '#4971B1', textDecoration: 'none' }}>Voltar para Materias</Link>
      </div>

      <div style={{ ...card, borderLeft: '4px solid #4971B1' }}>
        <p style={{ ...para, fontSize: '0.92rem' }}>
          O site exibe as materias no padrao dos grandes portais: chapeu da editoria, titulo colorido,
          linha fina, caixa de resumo e credito de foto. O layout ja vale para tudo que esta no ar —
          o que muda e o que a equipe precisa preencher ao publicar.
        </p>
      </div>

      <div style={card}>
        <h2 style={h2}>O que preencher em cada materia</h2>
        <div style={{ borderTop: '1px solid #e5e7eb' }}>
          {FIELDS.map(f => (
            <div key={f.name} style={{ display: 'flex', gap: '1.25rem', padding: '0.9rem 0', borderBottom: '1px solid #e5e7eb', flexWrap: 'wrap' }}>
              <div style={{ width: 160, flexShrink: 0 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1a1a2e', marginBottom: 4 }}>{f.name}</div>
                <Badge level={f.level} />
              </div>
              <p style={{ ...para, flex: 1, minWidth: 220 }}>{f.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...card, background: '#fbeceb', borderColor: '#f3d3d1', borderLeft: '4px solid #b3241f' }}>
        <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#b3241f', marginBottom: 8 }}>
          Regra que nao abre excecao
        </div>
        <h2 style={{ ...h2, color: '#b3241f' }}>Foto que nao e nossa, credito sempre</h2>
        <p style={{ ...para, color: '#5a3230', marginBottom: 10 }}>
          Toda imagem publicada precisa dizer de onde veio. Quando a foto <strong>nao</strong> for feita
          por alguem da nossa equipe, o credito da origem e obrigatorio — assessoria, agencia, orgao
          publico, morador, rede social, outro veiculo. Publicar foto de terceiro sem credito e
          apropriacao de trabalho alheio: expoe a Atibaia TV a reclamacao do autor e a pedido de
          remocao, alem de queimar a relacao com quem nos manda material.
        </p>
        <p style={{ ...para, color: '#5a3230' }}>
          Na duvida sobre a origem de uma imagem, <strong>nao publique</strong>. Procure outra foto ou
          pergunte a quem enviou antes de subir a materia.
        </p>
      </div>

      <div style={card}>
        <h2 style={h2}>Como escrever o credito</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', minWidth: 440 }}>
            <thead>
              <tr>
                {['Origem da foto', 'O que escrever no campo'].map(t => (
                  <th key={t} style={{ textAlign: 'left', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7280', padding: '0 1rem 8px 0', borderBottom: '1px solid #e5e7eb' }}>{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CREDITS.map(([origem, credito]) => (
                <tr key={origem}>
                  <td style={{ padding: '10px 1rem 10px 0', borderBottom: '1px solid #f3f4f6', color: '#1a1a2e', fontWeight: 500, width: '45%' }}>{origem}</td>
                  <td style={{ padding: '10px 1rem 10px 0', borderBottom: '1px solid #f3f4f6', color: '#4b5563' }}>{credito}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 16, padding: '0.9rem 1rem', background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 6 }}>Como fica publicado</div>
          <p style={{ fontSize: '0.82rem', color: '#6b7280', borderLeft: '2px solid #e5e7eb', paddingLeft: 10, marginBottom: 8 }}>
            Movimento na entrada do Parque das Aguas na manha desta quinta-feira — <em>Foto: Prefeitura de Atibaia / Divulgacao</em>
          </p>
          <p style={{ ...para, fontSize: '0.82rem' }}>A palavra "Foto:" o site coloca sozinho. No campo vai so o nome da origem.</p>
        </div>
      </div>

      <div style={card}>
        <h2 style={h2}>Data, hora e atualizacao</h2>
        <p style={{ ...para, marginBottom: 12 }}>A data e a hora da publicacao aparecem na assinatura automaticamente — ninguem digita nada.</p>
        <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#4971B1', marginBottom: 12 }}>28/08/2026 09h32 · Atualizado em 28/08/2026 15h40</p>
        <p style={{ ...para, marginBottom: 10 }}>
          Quando a materia e editada, o site registra o horario. A marca <strong>"Atualizado em"</strong> so
          aparece se a edicao for feita <strong>mais de 30 minutos</strong> depois da publicacao. Correcoes
          rapidas logo apos publicar nao geram o carimbo.
        </p>
        <p style={para}>
          Isso tem uma consequencia pratica: se voce voltar horas depois para acrescentar informacao nova,
          o publico vai ver que a materia mudou. Entao vale escrever a atualizacao de forma clara no texto,
          dizendo o que e novo.
        </p>
      </div>

      <div style={card}>
        <h2 style={h2}>Rotina de publicacao</h2>
        <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {STEPS.map(([strong, rest], i) => (
            <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{
                width: 26, height: 26, borderRadius: '50%', background: '#eef3fa', color: '#4971B1',
                fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexShrink: 0,
              }}>{i + 1}</span>
              <p style={{ ...para, paddingTop: 2 }}>
                <strong style={{ color: '#1a1a2e', fontWeight: 600 }}>{strong}</strong> {rest}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div style={card}>
        <h2 style={h2}>As materias antigas</h2>
        <p style={{ ...para, marginBottom: 12 }}>
          As materias publicadas antes desse formato estao sem subtitulo, resumo e credito. O botao{' '}
          <Link to="/dashboard/articles/completar" style={{ color: '#4971B1', fontWeight: 600, textDecoration: 'none' }}>Completar materias antigas</Link>{' '}
          preenche todas de uma vez usando frases do proprio texto de cada uma, sem alterar o conteudo nem a data.
        </p>
        <p style={para}>
          O credito preenchido em massa entra como <strong>Atibaia TV</strong>. Nas materias antigas cuja foto
          veio de assessoria ou de terceiro, o credito precisa ser corrigido a mao — vale priorizar as mais
          acessadas e as de capa.
        </p>
      </div>

      <p style={{ ...para, fontSize: '0.82rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.25rem' }}>
        Duvida sobre origem de foto ou sobre como creditar um caso novo: resolva antes de publicar, nao
        depois. Uma materia no ar sem credito e mais cara de consertar do que um minuto de conversa na redacao.
      </p>
    </>
  )
}
