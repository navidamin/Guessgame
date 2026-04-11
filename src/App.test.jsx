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

  it('renders the Game page at /game/:sessionId with a board', () => {
    const { container } = renderAt('/game/demo')
    // Board is the grid with 49 children — find it via CSS grid marker.
    const grids = container.querySelectorAll('.grid')
    const boardGrid = Array.from(grids).find((el) => el.children.length === 49)
    expect(boardGrid).toBeTruthy()
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
