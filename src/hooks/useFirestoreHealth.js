import { useEffect, useState } from 'react'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db, firebaseConfigured } from '../lib/firebase.js'

// Writes, reads, and confirms a tiny doc at /_healthcheck/ping to prove
// Firestore round-trips work end-to-end. Returns:
//   'idle'     — not configured yet
//   'checking' — call in flight
//   'ok'       — write+read succeeded
//   'error'    — something threw (see the returned `error` for details)
export default function useFirestoreHealth() {
  const [status, setStatus] = useState(firebaseConfigured ? 'checking' : 'idle')
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!firebaseConfigured || !db) return
    let cancelled = false

    async function run() {
      try {
        const ref = doc(db, '_healthcheck', 'ping')
        await setDoc(ref, {
          at: serverTimestamp(),
          from: 'phase1-healthcheck',
        })
        const snap = await getDoc(ref)
        if (cancelled) return
        if (!snap.exists()) throw new Error('healthcheck doc missing after write')
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
