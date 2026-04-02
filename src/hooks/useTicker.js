import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

export default function useTicker() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'ticker', 'config'), (snap) => {
      setItems(snap.exists() ? snap.data().items || [] : [])
      setLoading(false)
    }, () => setLoading(false))
    return unsub
  }, [])

  return { items, loading }
}
