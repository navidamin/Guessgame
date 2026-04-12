import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Tile from './Tile.jsx'

// Tests assert color *families* (blue/red/orange/green) rather than
// exact Tailwind shades, so tweaking the gradient palette later
// doesn't break the suite. Behavior-level, not pixel-level.

describe('Tile', () => {
  describe('grassland', () => {
    it('does NOT show the score number (only difficulty circles)', () => {
      render(
        <Tile
          tile={{
            id: 0,
            type: 'grassland',
            difficulty: 'medium',
            score: 200,
          }}
        />
      )
      expect(screen.queryByText('200')).not.toBeInTheDocument()
    })

    it('renders difficulty pips with the correct aria label', () => {
      render(
        <Tile
          tile={{ id: 0, type: 'grassland', difficulty: 'hard', score: 300 }}
        />
      )
      const pips = screen.getByLabelText(/difficulty: hard/)
      expect(pips).toBeInTheDocument()
      // Always renders 3 pip elements regardless of difficulty.
      expect(pips.children.length).toBe(3)
    })

    it('uses a green background family', () => {
      const { container } = render(
        <Tile
          tile={{ id: 0, type: 'grassland', difficulty: 'easy', score: 100 }}
        />
      )
      expect(container.firstChild.className).toMatch(/green|lime|emerald/)
    })

    it('is marked as interactive (cursor-pointer + hover classes)', () => {
      const { container } = render(
        <Tile
          tile={{ id: 0, type: 'grassland', difficulty: 'easy', score: 100 }}
        />
      )
      const cls = container.firstChild.className
      expect(cls).toMatch(/cursor-pointer/)
      expect(cls).toMatch(/hover:/)
    })
  })

  describe('water', () => {
    it('uses a blue/sky background family', () => {
      const { container } = render(<Tile tile={{ id: 1, type: 'water' }} />)
      expect(container.firstChild.className).toMatch(/blue|sky/)
    })

    it('has no visible score or glyph text', () => {
      render(<Tile tile={{ id: 1, type: 'water' }} />)
      expect(screen.queryByText(/\d+/)).not.toBeInTheDocument()
      expect(screen.queryByText('🏠')).not.toBeInTheDocument()
      expect(screen.queryByText('🔥')).not.toBeInTheDocument()
    })

    it('is NOT interactive (no cursor-pointer)', () => {
      const { container } = render(<Tile tile={{ id: 1, type: 'water' }} />)
      expect(container.firstChild.className).not.toMatch(/cursor-pointer/)
    })
  })

  describe('house', () => {
    it('team A uses a blue family', () => {
      const { container } = render(
        <Tile tile={{ id: 2, type: 'house', ownedBy: 'A' }} />
      )
      expect(container.firstChild.className).toMatch(/blue/)
    })

    it('team B uses a red family', () => {
      const { container } = render(
        <Tile tile={{ id: 2, type: 'house', ownedBy: 'B' }} />
      )
      expect(container.firstChild.className).toMatch(/red/)
    })

    it('renders the house glyph', () => {
      render(<Tile tile={{ id: 2, type: 'house', ownedBy: 'A' }} />)
      expect(screen.getByText('🏠')).toBeInTheDocument()
    })

    it('is NOT interactive', () => {
      const { container } = render(
        <Tile tile={{ id: 2, type: 'house', ownedBy: 'A' }} />
      )
      expect(container.firstChild.className).not.toMatch(/cursor-pointer/)
    })
  })

  describe('burnt', () => {
    it('uses a dark background and orange text', () => {
      const { container } = render(<Tile tile={{ id: 3, type: 'burnt' }} />)
      const cls = container.firstChild.className
      expect(cls).toMatch(/zinc|gray|stone|slate/)
      expect(cls).toMatch(/orange/)
    })

    it('renders the fire glyph', () => {
      render(<Tile tile={{ id: 3, type: 'burnt' }} />)
      expect(screen.getByText('🔥')).toBeInTheDocument()
    })

    it('is NOT interactive', () => {
      const { container } = render(<Tile tile={{ id: 3, type: 'burnt' }} />)
      expect(container.firstChild.className).not.toMatch(/cursor-pointer/)
    })
  })
})
