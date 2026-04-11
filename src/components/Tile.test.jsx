import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Tile from './Tile.jsx'

describe('Tile', () => {
  it('renders a grassland tile with its score', () => {
    render(
      <Tile
        tile={{
          id: 0,
          row: 0,
          col: 0,
          type: 'grassland',
          difficulty: 'medium',
          score: 200,
          ownedBy: null,
          questionId: null,
        }}
      />
    )
    expect(screen.getByText('200')).toBeInTheDocument()
  })

  it('renders a water tile with no content', () => {
    const { container } = render(
      <Tile tile={{ id: 1, type: 'water' }} />
    )
    const cell = container.firstChild
    expect(cell).toHaveClass('bg-blue-400')
    expect(cell.textContent).toBe('')
  })

  it('renders a house tile with team color', () => {
    const { container } = render(
      <Tile tile={{ id: 2, type: 'house', ownedBy: 'B' }} />
    )
    expect(container.firstChild).toHaveClass('bg-red-600')
  })

  it('renders a burnt tile', () => {
    const { container } = render(<Tile tile={{ id: 3, type: 'burnt' }} />)
    expect(container.firstChild).toHaveClass('bg-gray-800')
  })
})
