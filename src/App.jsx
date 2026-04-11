import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Game from './pages/Game.jsx'
import Admin from './pages/Admin.jsx'
import { firebaseConfigured } from './lib/firebase.js'
import useFirestoreHealth from './hooks/useFirestoreHealth.js'

export default function App() {
  const { status, error } = useFirestoreHealth()

  return (
    <div dir="rtl" className="min-h-screen bg-slate-900 text-slate-100 font-vazir">
      <header className="border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-xl font-bold">
            بازی کاشی
          </Link>
          <HealthBadge status={status} />
        </div>
        <nav className="flex gap-4 text-sm">
          <Link to="/" className="hover:text-emerald-400">خانه</Link>
          <Link to="/admin" className="hover:text-emerald-400">مدیریت</Link>
        </nav>
      </header>

      {!firebaseConfigured && (
        <div className="bg-amber-900/40 border-b border-amber-700 text-amber-200 text-sm px-6 py-2 text-center">
          Firebase پیکربندی نشده است. مقادیر <code>.env</code> را تنظیم کنید.
        </div>
      )}

      {status === 'error' && (
        <div className="bg-red-900/40 border-b border-red-700 text-red-200 text-sm px-6 py-2 text-center">
          خطای اتصال به Firestore: <code>{error?.code || error?.message || 'unknown'}</code>
        </div>
      )}

      <main className="px-6 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game/:sessionId" element={<Game />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

function HealthBadge({ status }) {
  const map = {
    idle: { label: 'تنظیم نشده', cls: 'bg-slate-700 text-slate-300' },
    checking: { label: 'در حال بررسی…', cls: 'bg-amber-600/40 text-amber-200' },
    ok: { label: 'Firestore ✓', cls: 'bg-emerald-600/40 text-emerald-200' },
    error: { label: 'Firestore ✗', cls: 'bg-red-600/40 text-red-200' },
  }
  const { label, cls } = map[status] ?? map.idle
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${cls}`}>{label}</span>
  )
}

function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold mb-2">۴۰۴</h1>
      <p className="text-slate-400">صفحه پیدا نشد.</p>
      <Link to="/" className="inline-block mt-4 text-emerald-400 hover:underline">
        بازگشت به خانه
      </Link>
    </div>
  )
}
