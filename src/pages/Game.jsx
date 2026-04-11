import { Link, useParams } from 'react-router-dom'
import Board from '../components/Board.jsx'
import ScoreBar from '../components/ScoreBar.jsx'
import useSession from '../hooks/useSession.js'

// Phase 3: Game screen is now Firestore-backed. We subscribe to
// sessions/:sessionId and render based on the snapshot state. No
// local board generation — the board lives in Firestore so both
// teams see the exact same thing.
export default function Game() {
  const { sessionId } = useParams()
  const { session, status, error } = useSession(sessionId)

  if (status === 'not-configured') {
    return (
      <StatusShell>
        برای ورود به بازی، ابتدا Firebase را پیکربندی کنید.
      </StatusShell>
    )
  }
  if (status === 'loading') {
    return <StatusShell>در حال بارگذاری جلسه…</StatusShell>
  }
  if (status === 'not-found') {
    return (
      <StatusShell>
        جلسه <span className="font-mono">{sessionId}</span> پیدا نشد.
        <div className="mt-4">
          <Link to="/" className="text-emerald-400 hover:underline">
            بازگشت به خانه
          </Link>
        </div>
      </StatusShell>
    )
  }
  if (status === 'error') {
    return (
      <StatusShell>
        خطا در اتصال:{' '}
        <code className="text-red-300">{error?.code || error?.message || 'unknown'}</code>
      </StatusShell>
    )
  }

  // status === 'ready'
  return (
    <div className="max-w-3xl mx-auto">
      <ScoreBar
        teamA={session.teams.A}
        teamB={session.teams.B}
        currentTurn={session.currentTurn}
      />

      <div className="mt-6">
        <Board tiles={session.board} />
      </div>

      <p className="mt-6 text-center text-xs text-slate-500">
        جلسه: <span className="font-mono">{sessionId}</span>
        {' · '}
        نوبت تیم{' '}
        <span className={session.currentTurn === 'A' ? 'text-blue-400' : 'text-red-400'}>
          {session.teams[session.currentTurn].name}
        </span>
      </p>
    </div>
  )
}

function StatusShell({ children }) {
  return (
    <div className="max-w-xl mx-auto text-center py-20 text-slate-300">
      {children}
    </div>
  )
}
