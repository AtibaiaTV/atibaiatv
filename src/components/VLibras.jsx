import { useEffect } from 'react'

/* widget oficial do governo (vlibras.gov.br) — traducao para Libras, aparece flutuando na tela */
export default function VLibras() {
  useEffect(function() {
    if (window.VLibras || document.getElementById('vlibras-script')) return

    var script = document.createElement('script')
    script.id = 'vlibras-script'
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js'
    script.onload = function() {
      if (window.VLibras) new window.VLibras.Widget('https://vlibras.gov.br/app')
    }
    document.body.appendChild(script)
  }, [])

  return (
    <div vw="true" className="enabled">
      <div vw-access-button="true" className="active" />
      <div vw-plugin-wrapper="true">
        <div className="vw-plugin-top-wrapper" />
      </div>
    </div>
  )
}
