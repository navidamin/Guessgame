import { useState } from 'react'
import { computeScore } from '../lib/gameLogic.js'

// Modal: shows hint1 → optional hint2 → answer field → reveal + judge.
//
// Flow:
//   1. Team sees hint1
//   2. Optional: click "سرنخ ۲" button (costs −30 points)
//   3. Type answer → submit
//   4. Correct answer is revealed alongside the team's answer
//   5. Host/team clicks "درست" or "نادرست"
//
// We use manual judging (not string matching) because Farsi has too
// many valid alternate spellings and transliterations. This is also
// more fun for a party-game setting.

export default function QuestionCard({
  question,
  tileScore,
  onResult, // ({ correct: bool, scoreGained: number }) => void
  onCancel,
}) {
  const [showHint2, setShowHint2] = useState(false)
  const [hint2Used, setHint2Used] = useState(false)
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const currentScore = computeScore(tileScore, hint2Used)

  function handleHint2() {
    setShowHint2(true)
    setHint2Used(true)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!answer.trim()) return
    setSubmitted(true)
  }

  function handleJudge(correct) {
    onResult({ correct, scoreGained: correct ? currentScore : 0 })
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-lg w-full mx-4 space-y-5">
        {/* Header */}
        <div className="text-center space-y-1">
          <p className="text-sm text-slate-400">
            {question.topic} ·{' '}
            <span className="capitalize">{question.difficulty}</span>
          </p>
          <p className="text-2xl font-bold tabular-nums text-emerald-400">
            {currentScore} <span className="text-base font-normal text-slate-400">امتیاز</span>
          </p>
        </div>

        {/* Hint 1 */}
        <div className="bg-slate-700/60 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">سرنخ ۱</p>
          <p className="text-lg leading-relaxed">{question.hint1}</p>
        </div>

        {/* Hint 2 */}
        {showHint2 ? (
          <div className="bg-amber-900/30 border border-amber-800 rounded-xl p-4">
            <p className="text-xs text-amber-400 mb-1">سرنخ ۲ (−۳۰ امتیاز)</p>
            <p className="text-lg leading-relaxed">{question.hint2}</p>
          </div>
        ) : (
          !submitted && (
            <button
              type="button"
              onClick={handleHint2}
              className="w-full bg-amber-900/40 hover:bg-amber-900/60 border border-amber-800 text-amber-200 py-3 rounded-xl text-sm font-semibold transition"
            >
              نمایش سرنخ ۲ (−۳۰ امتیاز)
            </button>
          )
        )}

        {/* Answer or result */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="پاسخ شما"
              autoFocus
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-center text-lg focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!answer.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white py-3 rounded-xl font-semibold transition"
            >
              ارسال پاسخ
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            {/* Team's answer */}
            <div className="bg-slate-700/60 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">پاسخ شما</p>
              <p className="text-lg">{answer}</p>
            </div>

            {/* Correct answer */}
            <div className="bg-emerald-900/30 border border-emerald-700 rounded-xl p-4">
              <p className="text-xs text-emerald-400 mb-1">پاسخ صحیح</p>
              <p className="text-lg text-emerald-300 font-semibold">
                {question.answer}
              </p>
            </div>

            {/* Judge buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleJudge(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-lg transition"
              >
                ✓ درست
              </button>
              <button
                type="button"
                onClick={() => handleJudge(false)}
                className="bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-bold text-lg transition"
              >
                ✗ نادرست
              </button>
            </div>
          </div>
        )}

        {/* Cancel (only before submit) */}
        {!submitted && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full text-sm text-slate-500 hover:text-slate-300 transition pt-1"
          >
            انصراف
          </button>
        )}
      </div>
    </div>
  )
}
