import { collection, getDocs, addDoc, setDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { NEWS, RECENT_VIDEOS, TICKER_ITEMS } from '../data'

export async function seedFirestore() {
  // Check if already seeded
  const articlesSnap = await getDocs(collection(db, 'articles'))
  if (articlesSnap.size > 0) {
    return { success: false, message: 'Dados ja existem no Firestore.' }
  }

  // Seed articles
  for (const news of NEWS) {
    await addDoc(collection(db, 'articles'), {
      title: news.title,
      category: news.category,
      author: news.author || 'Redacao Atibaia TV',
      body: news.body,
      featured: news.featured || false,
      color: news.color || 'blue',
      thumbnailUrl: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }

  // Seed videos
  for (const video of RECENT_VIDEOS) {
    await addDoc(collection(db, 'videos'), {
      title: video.title,
      duration: video.duration,
      youtubeUrl: '',
      thumbnailUrl: '',
      createdAt: serverTimestamp(),
    })
  }

  // Seed ticker
  await setDoc(doc(db, 'ticker', 'config'), { items: TICKER_ITEMS })

  return { success: true, message: `Seed concluido: ${NEWS.length} materias, ${RECENT_VIDEOS.length} videos, ${TICKER_ITEMS.length} itens do ticker.` }
}
