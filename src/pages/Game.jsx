import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Board from '../components/Board.jsx'
import ScoreBar from '../components/ScoreBar.jsx'
import { generateBoard } from '../lib/boardGen.js'

// Phase 2: renders a seeded board derived from the session id.
// In Phase 3 this will be replaced by a Firestore-backed session
// listener so both teams see identical boards.
export default function Game() {
  const { sessionId } = useParams()
  const tiles = useMemo(
    () => generateBoard(sessionId || 'default'),
    [sessionId]
  )

  return (
    <div className="max-w-3xl mx-auto">
      <ScoreBar
        teamA={{ name: 'تیم آبی', score: 0 }}
        teamB={{ name: 'تیم قرمز', score: 0 }}
        currentTurn="A"
      />

      <div className="mt-6">
        <Board tiles={tiles} />
      </div>

      <p className="mt-6 text-center text-xs text-slate-500">
        جلسه: <span className="font-mono">{sessionId}</span>
      </p>
    </div>
  )
}
