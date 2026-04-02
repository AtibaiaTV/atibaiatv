import { useState, useEffect } from 'react'
import { collection, query, orderBy, where, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

export default function useArticles(category) {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const constraints = [orderBy('createdAt', 'desc')]
    if (category) constraints.unshift(where('category', '==', category))

    const q = query(collection(db, 'articles'), ...constraints)
    const unsub = onSnapshot(q, (snap) => {
      setArticles(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }, () => setLoading(false))

    return unsub
  }, [category])

  return { articles, loading }
}
