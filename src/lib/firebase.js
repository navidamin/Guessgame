// Firebase initialization.
// All values come from Vite env vars (see .env.example).
// The Firestore instance is the single source of truth for game state.
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// True when every required env var is present and not a placeholder.
export const firebaseConfigured = Object.values(firebaseConfig).every(
  (v) => typeof v === 'string' && v.length > 0 && v !== 'REPLACE_ME'
)

let app = null
let db = null

if (firebaseConfigured) {
  app = initializeApp(firebaseConfig)
  db = getFirestore(app)
} else {
  // Intentionally not throwing — Phase 1 ships a scaffold that still
  // renders when credentials are missing. The UI will surface a warning.
  // eslint-disable-next-line no-console
  console.warn(
    '[firebase] Missing or placeholder env vars. Firestore is not initialized.'
  )
}

export { app, db }
