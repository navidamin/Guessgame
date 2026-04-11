import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App.jsx'

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  )
}

describe('App routing', () => {
  it('renders the Home page at /', () => {
    renderAt('/')
    // Home shows the create-new-game button.
    expect(
      screen.getByRole('button', { name: /ساخت بازی جدید/ })
    ).toBeInTheDocument()
  })

  it('renders the not-configured shell on /game/:sessionId when Firebase is absent', () => {
    // In the test env, .env.test has placeholder values so
    // firebaseConfigured is false and useSession short-circuits.
    // The Game page should fall through to its not-configured shell
    // rather than try to render a board.
    renderAt('/game/demo')
    expect(
      screen.getByText(/برای ورود به بازی، ابتدا Firebase/)
    ).toBeInTheDocument()
  })

  it('shows the admin login form at /admin', () => {
    renderAt('/admin')
    expect(
      screen.getByRole('heading', { name: /ورود مدیر/ })
    ).toBeInTheDocument()
  })

  it('shows 404 for unknown routes', () => {
    renderAt('/nope')
    expect(screen.getByText('۴۰۴')).toBeInTheDocument()
  })

  it('shows the Firebase-not-configured banner when env is placeholder', () => {
    renderAt('/')
    expect(screen.getByText(/Firebase پیکربندی نشده/)).toBeInTheDocument()
  })
})
