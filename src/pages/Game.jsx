import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Board from '../components/Board.jsx'
import ScoreBar from '../components/ScoreBar.jsx'
import TopicPicker from '../components/TopicPicker.jsx'
import QuestionCard from '../components/QuestionCard.jsx'
import useSession from '../hooks/useSession.js'
import { updateSession, markQuestionUsed } from '../lib/session.js'
import { fetchRandomQuestion } from '../lib/questions.js'
import { TOPIC_LABELS } from '../lib/topics.js'
import {
  pickRandomTopics,
  switchTurn,
  applyCorrectAnswer,
  applyWrongAnswer,
  computeScore,
} from '../lib/gameLogic.js'

// Turn-flow state machine:
//   idle → topic-picking → question-loading → answering → applying → idle
//
// All turn-flow state is local (not in Firestore) because it's
// transient UI. The *result* (board + score + turn) is written to
// Firestore once the host judges the answer, and onSnapshot pushes
// it to every connected client.

export default function Game() {
  const { sessionId } = useParams()
  const { session, status, error } = useSession(sessionId)

  // Turn-flow locals
  const [turnPhase, setTurnPhase] = useState('idle')
  const [selectedTile, setSelectedTile] = useState(null)
  // Captured at tile-select time, NOT read at judge time: the live
  // session snapshot can change mid-flow (another host screen judging
  // first flips currentTurn), which would credit the answer to the
  // wrong team.
  const [actingTeam, setActingTeam] = useState(null)
  const [offeredTopics, setOfferedTopics] = useState([])
  const [question, setQuestion] = useState(null)
  const [turnError, setTurnError] = useState(null)

  function resetTurnState() {
    setTurnPhase('idle')
    setSelectedTile(null)
    setActingTeam(null)
    setOfferedTopics([])
    setQuestion(null)
    setTurnError(null)
  }

  // Step 1: grassland tile clicked → show topic picker
  function handleTileSelect(tile) {
    if (turnPhase !== 'idle') return
    if (!session || session.status !== 'active') return
    setSelectedTile(tile)
    setActingTeam(session.currentTurn)
    setOfferedTopics(pickRandomTopics(TOPIC_LABELS))
    setTurnPhase('topic-picking')
  }

  // Step 2: topic chosen → fetch question
  async function handleTopicSelect(topic) {
    setTurnPhase('question-loading')
    try {
      const q = await fetchRandomQuestion(
        topic,
        selectedTile.difficulty,
        session.usedQuestionIds || []
      )
      if (!q) {
        setTurnError(
          `سؤالی برای موضوع «${topic}» و سطح «${selectedTile.difficulty}» پیدا نشد.`
        )
        setTurnPhase('idle')
        return
      }
      // Mark used as soon as the question is revealed — cancelling the
      // turn afterwards must not let the same question resurface.
      await markQuestionUsed(sessionId, q.id)
      setQuestion(q)
      setTurnPhase('answering')
    } catch (err) {
      setTurnError(err.message || 'خطا در دریافت سؤال')
      setTurnPhase('idle')
    }
  }

  // Step 3: host judges → apply result to Firestore
  async function handleResult({ correct, scoreGained }) {
    setTurnPhase('applying')
    try {
      const team = actingTeam
      let newBoard

      if (correct) {
        newBoard = applyCorrectAnswer(session.board, selectedTile.id, team)
      } else {
        newBoard = applyWrongAnswer(session.board, selectedTile.id)
      }

      const newTeams = {
        A: { ...session.teams.A },
        B: { ...session.teams.B },
      }
      if (correct) {
        newTeams[team] = {
          ...newTeams[team],
          score: newTeams[team].score + scoreGained,
        }
      }

      await updateSession(sessionId, {
        board: newBoard,
        teams: newTeams,
        currentTurn: switchTurn(team),
      })

      // onSnapshot will fire and update `session` automatically.
      resetTurnState()
    } catch (err) {
      setTurnError(err.message || 'خطا در ثبت نتیجه')
      setTurnPhase('idle')
    }
  }

  // -- Render gates for non-ready session states --

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
        <code className="text-red-300">
          {error?.code || error?.message || 'unknown'}
        </code>
      </StatusShell>
    )
  }

  // -- Ready: render the game --

  const currentTeam = session.currentTurn
  const currentTeamName = session.teams[currentTeam]?.name || currentTeam

  return (
    <div className="max-w-3xl mx-auto">
      <ScoreBar
        teamA={session.teams.A}
        teamB={session.teams.B}
        currentTurn={session.currentTurn}
      />

      {/* Turn indicator */}
      <div className="mt-4 text-center">
        <span
          className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${
            currentTeam === 'A'
              ? 'bg-blue-600/30 text-blue-300'
              : 'bg-red-600/30 text-red-300'
          }`}
        >
          نوبت: {currentTeamName}
        </span>
      </div>

      {/* Board */}
      <div className="mt-4">
        <Board tiles={session.board} onTileSelect={handleTileSelect} />
      </div>

      {/* Session code */}
      <p className="mt-4 text-center text-xs text-slate-500">
        جلسه: <span className="font-mono">{sessionId}</span>
      </p>

      {/* Error toast */}
      {turnError && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-900/90 border border-red-700 text-red-200 text-sm px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-3">
          <span>{turnError}</span>
          <button
            type="button"
            onClick={() => setTurnError(null)}
            className="text-red-400 hover:text-white font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Turn-flow modals */}
      {turnPhase === 'topic-picking' && (
        <TopicPicker
          topics={offeredTopics}
          onSelect={handleTopicSelect}
          onCancel={resetTurnState}
        />
      )}

      {turnPhase === 'question-loading' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl p-10 text-center">
            <p className="text-lg text-slate-300">در حال دریافت سؤال…</p>
          </div>
        </div>
      )}

      {turnPhase === 'answering' && question && (
        <QuestionCard
          question={question}
          tileScore={selectedTile.score}
          onResult={handleResult}
          onCancel={resetTurnState}
        />
      )}

      {turnPhase === 'applying' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl p-10 text-center">
            <p className="text-lg text-slate-300">در حال ثبت نتیجه…</p>
          </div>
        </div>
      )}
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
