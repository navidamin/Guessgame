import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db, firebaseConfigured } from '../lib/firebase.js'

// Subscribes to sessions/{sessionId} and returns the latest snapshot.
//
// status transitions:
//   not-configured — Firebase env vars missing (dev without .env)
//   loading        — subscription just started
//   ready          — snapshot received, data in `session`
//   not-found      — Firestore returned an empty snapshot
//   error          — onSnapshot fired its error callback (permission denied, etc.)
export default function useSession(sessionId) {
  const [session, setSession] = useState(null)
  const [status, setStatus] = useState(
    firebaseConfigured ? 'loading' : 'not-configured'
  )
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!firebaseConfigured || !db) {
      setStatus('not-configured')
      return
    }
    if (!sessionId) {
      setStatus('not-found')
      return
    }

    setStatus('loading')
    const ref = doc(db, 'sessions', sessionId)
    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setSession(null)
          setStatus('not-found')
          return
        }
        setSession(snap.data())
        setStatus('ready')
      },
      (err) => {
        // eslint-disable-next-line no-console
        console.error('[useSession] snapshot error', err)
        setError(err)
        setStatus('error')
      }
    )

    return () => unsubscribe()
  }, [sessionId])

  return { session, status, error }
}
