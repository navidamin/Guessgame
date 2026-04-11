import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Phase 1: stub home screen. Real session create/join lands in Phase 3.
export default function Home() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')

  function handleJoin(e) {
    e.preventDefault()
    const trimmed = code.trim()
    if (!trimmed) return
    navigate(`/game/${trimmed}`)
  }

  return (
    <div className="max-w-xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-3">بازی کاشی</h1>
      <p className="text-slate-400 mb-10">
        بازی چهار نفره مسابقه‌ای روی یک جدول ۷×۷.
      </p>

      <div className="grid gap-4">
        <button
          type="button"
          onClick={() => navigate('/game/demo')}
          className="bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg font-semibold transition"
        >
          ساخت بازی جدید (پیش‌نمایش)
        </button>

        <form onSubmit={handleJoin} className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="کد بازی"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-center focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="bg-slate-700 hover:bg-slate-600 text-white px-5 rounded-lg font-semibold transition"
          >
            پیوستن
          </button>
        </form>
      </div>

      <p className="mt-10 text-xs text-slate-500">
        فاز ۱ — داربست اولیه. منطق بازی در فازهای بعدی اضافه می‌شود.
      </p>
    </div>
  )
}
