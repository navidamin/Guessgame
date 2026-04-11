import { useParams } from 'react-router-dom'
import Board from '../components/Board.jsx'
import ScoreBar from '../components/ScoreBar.jsx'

// Phase 1: renders a static 7x7 placeholder board so we can confirm
// layout + Tailwind before wiring session state in Phase 3.
export default function Game() {
  const { sessionId } = useParams()

  return (
    <div className="max-w-3xl mx-auto">
      <ScoreBar
        teamA={{ name: 'تیم آبی', score: 0 }}
        teamB={{ name: 'تیم قرمز', score: 0 }}
        currentTurn="A"
      />

      <div className="mt-6">
        <Board />
      </div>

      <p className="mt-6 text-center text-xs text-slate-500">
        جلسه: <span className="font-mono">{sessionId}</span>
      </p>
    </div>
  )
}
