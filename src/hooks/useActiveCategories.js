import { useState, useEffect } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

var MAX_AGE_MONTHS = 6

/**
 * Categorias com pelo menos 1 materia publicada nos ultimos 6 meses.
 * Retorna null enquanto carrega (o chamador deve tratar null como "mostrar tudo"
 * para nao esconder botoes validos por um instante antes dos dados chegarem).
 */
export default function useActiveCategories() {
  var state = useState(null)
  var active = state[0]
  var setActive = state[1]

  useEffect(function() {
    var unsub = onSnapshot(collection(db, 'articles'), function(snap) {
      var cutoff = new Date()
      cutoff.setMonth(cutoff.getMonth() - MAX_AGE_MONTHS)

      var set = new Set()
      snap.docs.forEach(function(d) {
        var data = d.data()
        var created = data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : null
        if (data.category && created && created >= cutoff) set.add(data.category)
      })
      setActive(set)
    }, function() { /* em caso de erro, mantem null (mostra tudo) */ })

    return unsub
  }, [])

  return active
}
