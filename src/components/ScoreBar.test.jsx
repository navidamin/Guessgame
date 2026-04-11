import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ScoreBar from './ScoreBar.jsx'

describe('ScoreBar', () => {
  it('renders both team names and scores', () => {
    render(
      <ScoreBar
        teamA={{ name: 'تیم آبی', score: 100 }}
        teamB={{ name: 'تیم قرمز', score: 250 }}
        currentTurn="A"
      />
    )
    expect(screen.getByText('تیم آبی')).toBeInTheDocument()
    expect(screen.getByText('تیم قرمز')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('250')).toBeInTheDocument()
  })
})
