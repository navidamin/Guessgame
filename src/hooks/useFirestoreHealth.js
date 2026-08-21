import { useEffect, useState } from 'react'
import { collection, getDocs, limit, query } from 'firebase/firestore'
import { db, firebaseConfigured } from '../lib/firebase.js'

// Reads one doc from the questions collection to prove Firestore
// round-trips work end-to-end. Read-only on purpose: the security
// rules only open the game's own collections, so a write probe to a
// scratch collection would be denied in production. Returns:
//   'idle'     — not configured yet
//   'checking' — call in flight
//   'ok'       — read succeeded
//   'error'    — something threw (see the returned `error` for details)
export default function useFirestoreHealth() {
  const [status, setStatus] = useState(firebaseConfigured ? 'checking' : 'idle')
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!firebaseConfigured || !db) return
    let cancelled = false

    async function run() {
      try {
        await getDocs(query(collection(db, 'questions'), limit(1)))
        if (cancelled) return
        setStatus('ok')
      } catch (err) {
        if (cancelled) return
        setError(err)
        setStatus('error')
        // eslint-disable-next-line no-console
        console.error('[firebase] healthcheck failed', err)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [])

  return { status, error }
}
