import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD_r6YONBWJ4ZMeuglvipFgJpAjqBSKH5Y",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "site-atibaiatv.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "site-atibaiatv",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "site-atibaiatv.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "747543518097",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:747543518097:web:d650879ef14b2cedc21830",
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
