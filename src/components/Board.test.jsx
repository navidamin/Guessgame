import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Board from './Board.jsx'

describe('Board', () => {
  it('renders a 7x7 grid of 49 tiles', () => {
    const { container } = render(<Board />)
    // The grid container is the top-level element.
    const grid = container.firstChild
    expect(grid.children.length).toBe(49)
  })
})
