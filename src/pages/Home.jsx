import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { firebaseConfigured } from '../lib/firebase.js'
import {
  createSession,
  joinSession,
  normalizeSessionCode,
  SESSION_CODE_LENGTH,
} from '../lib/session.js'

// Phase 3: the home screen is now the real session entry point.
// Left card: create a new session (writes to Firestore, navigates in).
// Right card: join an existing session by its 6-char code.
export default function Home() {
  const navigate = useNavigate()

  const [teamAName, setTeamAName] = useState('')
  const [teamBName, setTeamBName] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState(null)

  const [joinCode, setJoinCode] = useState('')
  const [joining, setJoining] = useState(false)
  const [joinError, setJoinError] = useState(null)

  const disabled = !firebaseConfigured

  async function handleCreate(e) {
    e.preventDefault()
    if (disabled || creating) return
    setCreating(true)
    setCreateError(null)
    try {
      const code = await createSession({ teamAName, teamBName })
      navigate(`/game/${code}`)
    } catch (err) {
      setCreateError(err.message || 'خطا در ساخت جلسه')
      setCreating(false)
    }
  }

  async function handleJoin(e) {
    e.preventDefault()
    if (disabled || joining) return
    const normalized = normalizeSessionCode(joinCode)
    if (!normalized) {
      setJoinError('کد را وارد کنید')
      return
    }
    setJoining(true)
    setJoinError(null)
    try {
      const code = await joinSession(normalized)
      navigate(`/game/${code}`)
    } catch (err) {
      setJoinError(err.message || 'خطا در پیوستن')
      setJoining(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">بازی کاشی</h1>
        <p className="text-slate-400">
          بازی چهار نفره مسابقه‌ای روی یک جدول ۷×۷.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Create */}
        <form
          onSubmit={handleCreate}
          className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4"
        >
          <h2 className="text-lg font-semibold">ساخت بازی جدید</h2>

          <label className="block">
            <span className="text-sm text-slate-400">نام تیم آبی</span>
            <input
              type="text"
              value={teamAName}
              onChange={(e) => setTeamAName(e.target.value)}
              placeholder="تیم آبی"
              maxLength={24}
              className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </label>

          <label className="block">
            <span className="text-sm text-slate-400">نام تیم قرمز</span>
            <input
              type="text"
              value={teamBName}
              onChange={(e) => setTeamBName(e.target.value)}
              placeholder="تیم قرمز"
              maxLength={24}
              className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
            />
          </label>

          <button
            type="submit"
            disabled={disabled || creating}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white py-3 rounded-lg font-semibold transition"
          >
            {creating ? 'در حال ساخت…' : 'ساخت بازی جدید'}
          </button>

          {createError && (
            <p className="text-sm text-red-400">{createError}</p>
          )}
        </form>

        {/* Join */}
        <form
          onSubmit={handleJoin}
          className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4"
        >
          <h2 className="text-lg font-semibold">پیوستن به بازی</h2>

          <label className="block">
            <span className="text-sm text-slate-400">
              کد بازی ({SESSION_CODE_LENGTH} کاراکتر)
            </span>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="ABC123"
              maxLength={SESSION_CODE_LENGTH}
              className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-center text-xl tracking-widest font-mono focus:outline-none focus:border-emerald-500"
            />
          </label>

          <button
            type="submit"
            disabled={disabled || joining}
            className="w-full bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white py-3 rounded-lg font-semibold transition"
          >
            {joining ? 'در حال پیوستن…' : 'پیوستن'}
          </button>

          {joinError && <p className="text-sm text-red-400">{joinError}</p>}
        </form>
      </div>

      {disabled && (
        <p className="mt-8 text-center text-xs text-amber-300">
          برای ساخت یا پیوستن به بازی ابتدا Firebase را پیکربندی کنید.
        </p>
      )}
    </div>
  )
}
