import { useState, useEffect } from 'react'
import { doc, setDoc, onSnapshot, increment, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

export function trackPageView(pageId) {
  const key = 'pv_' + pageId
  if (sessionStorage.getItem(key)) return
  sessionStorage.setItem(key, '1')

  setDoc(doc(db, 'pageViews', pageId), {
    count: increment(1),
    lastUpdated: serverTimestamp(),
  }, { merge: true }).catch(() => {})
}

export function usePageViewCount(pageId) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!pageId) return
    const unsub = onSnapshot(doc(db, 'pageViews', pageId), (snap) => {
      if (snap.exists()) setCount(snap.data().count || 0)
    })
    return unsub
  }, [pageId])

  return count
}
