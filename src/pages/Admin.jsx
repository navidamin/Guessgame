import { useEffect, useState } from 'react'
import { firebaseConfigured } from '../lib/firebase.js'
import { countQuestions, seedQuestions } from '../lib/questions.js'
import { SEED_QUESTIONS } from '../lib/seedQuestions.js'

// Phase 1: password gate + coming-soon message
// Phase 4 (seed): adds a one-click "Seed questions" button so we can
//   exercise the question-fetch flow in dev without hand-entering data.
// Phase 5 (later): full CRUD, batch upload, delete, filter.
export default function Admin() {
  const expected = import.meta.env.VITE_ADMIN_PASSWORD || ''
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')

  function handleLogin(e) {
    e.preventDefault()
    if (expected && password === expected) {
      setAuthed(true)
    } else {
      alert('رمز عبور اشتباه است')
    }
  }

  if (!authed) {
    return (
      <form onSubmit={handleLogin} className="max-w-sm mx-auto mt-10 space-y-4">
        <h1 className="text-2xl font-bold text-center">ورود مدیر</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="رمز عبور"
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-center focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg font-semibold transition"
        >
          ورود
        </button>
      </form>
    )
  }

  return <AdminDashboard />
}

function AdminDashboard() {
  const [count, setCount] = useState(null)
  const [countError, setCountError] = useState(null)
  const [seeding, setSeeding] = useState(false)
  const [seedMessage, setSeedMessage] = useState(null)
  const [seedError, setSeedError] = useState(null)

  async function refreshCount() {
    if (!firebaseConfigured) return
    try {
      const n = await countQuestions()
      setCount(n)
      setCountError(null)
    } catch (err) {
      setCountError(err.message || String(err))
    }
  }

  useEffect(() => {
    refreshCount()
  }, [])

  async function handleSeed() {
    if (!firebaseConfigured || seeding) return
    setSeeding(true)
    setSeedError(null)
    setSeedMessage(null)
    try {
      const written = await seedQuestions()
      setSeedMessage(`${written} سوال در پایگاه داده ذخیره شد.`)
      await refreshCount()
    } catch (err) {
      setSeedError(err.message || String(err))
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-1">پنل مدیریت سوالات</h1>
        <p className="text-sm text-slate-400">
          افزودن، بارگذاری و مدیریت سوالات بازی.
        </p>
      </div>

      {/* Stats */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-3">وضعیت پایگاه داده</h2>
        {!firebaseConfigured ? (
          <p className="text-amber-300 text-sm">
            Firebase پیکربندی نشده است. برای اتصال، مقادیر <code>.env</code> را
            تنظیم کنید.
          </p>
        ) : countError ? (
          <p className="text-red-400 text-sm">خطا در خواندن تعداد: {countError}</p>
        ) : (
          <p className="text-slate-300">
            تعداد سوالات موجود:{' '}
            <span className="text-2xl font-bold tabular-nums text-emerald-400">
              {count ?? '…'}
            </span>
          </p>
        )}
      </div>

      {/* Seed */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold">بارگذاری سوالات پیش‌فرض</h2>
          <p className="text-sm text-slate-400 mt-1">
            {SEED_QUESTIONS.length} سوال پایه (یک سوال برای هر ترکیب موضوع و
            سطح) را در پایگاه داده می‌نویسد. اجرای دوباره این دکمه امن است —
            سوالات قبلی با شناسه‌های پایدار بازنویسی می‌شوند و تکرار ایجاد نمی‌شود.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSeed}
          disabled={!firebaseConfigured || seeding}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          {seeding ? 'در حال بارگذاری…' : `بارگذاری ${SEED_QUESTIONS.length} سوال پایه`}
        </button>

        {seedMessage && (
          <p className="text-sm text-emerald-400">✓ {seedMessage}</p>
        )}
        {seedError && <p className="text-sm text-red-400">✗ {seedError}</p>}
      </div>

      <p className="text-xs text-slate-500">
        مدیریت کامل سوالات (افزودن، ویرایش، حذف، بارگذاری دسته‌ای) در فاز ۵
        اضافه می‌شود.
      </p>
    </div>
  )
}
