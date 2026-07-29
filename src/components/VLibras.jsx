import { useEffect } from 'react'

/* widget oficial do governo (vlibras.gov.br) — traducao para Libras, aparece flutuando na tela.
   Montado via DOM puro (fora da arvore do React) porque o script deles espera exatamente a
   marcacao do snippet oficial, sem os atributos boolean que o JSX obriga a ter valor. */
export default function VLibras() {
  useEffect(function() {
    if (document.getElementById('vlibras-script')) return

    var host = document.createElement('div')
    host.id = 'vlibras-host'
    host.innerHTML =
      '<div vw class="enabled">' +
        '<div vw-access-button class="active"></div>' +
        '<div vw-plugin-wrapper>' +
          '<div class="vw-plugin-top-wrapper"></div>' +
        '</div>' +
      '</div>'
    document.body.appendChild(host)

    var script = document.createElement('script')
    script.id = 'vlibras-script'
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js'
    script.onload = function() {
      if (!window.VLibras) return
      new window.VLibras.Widget('https://vlibras.gov.br/app')
      /* o widget so preenche o botao dentro de um handler window.onload registrado agora —
         mas o evento "load" da pagina ja disparou muito antes (SPA), entao ele nunca rodaria
         sozinho. Chamamos manualmente pra forcar a inicializacao. */
      if (typeof window.onload === 'function') window.onload()
    }
    document.body.appendChild(script)
  }, [])

  return null
}
