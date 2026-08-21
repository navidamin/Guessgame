// Firebase initialization.
// All values come from Vite env vars (see .env.example).
// The Firestore instance is the single source of truth for game state.
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Committed defaults for the guessgametiles project. The web config is
// not a secret — it ships in the browser bundle to every visitor, and
// access control lives entirely in Firestore security rules. Env vars
// still take precedence so another Firebase project can be swapped in
// without touching code.
const DEFAULT_CONFIG = {
  apiKey: 'AIzaSyB7byckPDXlYN4EvcA2-r6ksk1D6dSnI5o',
  authDomain: 'guessgametiles.firebaseapp.com',
  projectId: 'guessgametiles',
  storageBucket: 'guessgametiles.firebasestorage.app',
  messagingSenderId: '971528501901',
  appId: '1:971528501901:web:c3b6e5afc8712a4b4240c4',
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || DEFAULT_CONFIG.apiKey,
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || DEFAULT_CONFIG.authDomain,
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID || DEFAULT_CONFIG.projectId,
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    DEFAULT_CONFIG.storageBucket,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    DEFAULT_CONFIG.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || DEFAULT_CONFIG.appId,
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
