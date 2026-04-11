import { useState } from 'react'

// Phase 1 stub. Full admin CRUD lands in Phase 5.
export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const expected = import.meta.env.VITE_ADMIN_PASSWORD || ''

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

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">پنل مدیریت سوالات</h1>
      <p className="text-slate-400">
        مدیریت سوالات در فاز ۵ اضافه می‌شود (افزودن، بارگذاری دسته‌ای، حذف).
      </p>
    </div>
  )
}
