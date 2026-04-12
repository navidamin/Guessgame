import { describe, it, expect } from 'vitest'
import {
  getAdjacentTileIds,
  pickRandomTopics,
  switchTurn,
  applyCorrectAnswer,
  applyWrongAnswer,
  computeScore,
} from './gameLogic.js'
import { generateBoard, BOARD_SIZE } from './boardGen.js'

// Helpers
function makeTile(id, overrides = {}) {
  return {
    id,
    row: Math.floor(id / BOARD_SIZE),
    col: id % BOARD_SIZE,
    type: 'grassland',
    difficulty: 'medium',
    score: 200,
    ownedBy: null,
    questionId: null,
    ...overrides,
  }
}

function makeBoard(overrides = {}) {
  const board = generateBoard(42)
  for (const [id, patch] of Object.entries(overrides)) {
    board[+id] = { ...board[+id], ...patch }
  }
  return board
}

describe('getAdjacentTileIds', () => {
  it('returns 4 neighbours for a centre tile', () => {
    // Tile 24 = row 3, col 3 (dead centre of 7×7)
    const adj = getAdjacentTileIds(24)
    expect(adj.sort()).toEqual([17, 23, 25, 31].sort())
  })

  it('returns 2 neighbours for a corner tile', () => {
    // top-left = 0
    expect(getAdjacentTileIds(0).sort()).toEqual([1, 7].sort())
    // bottom-right = 48
    expect(getAdjacentTileIds(48).sort()).toEqual([41, 47].sort())
  })

  it('returns 3 neighbours for an edge tile', () => {
    // Tile 3 = row 0, col 3 (top edge)
    const adj = getAdjacentTileIds(3)
    expect(adj.length).toBe(3)
    expect(adj.sort()).toEqual([2, 4, 10].sort())
  })

  it('never returns an out-of-range id', () => {
    for (let id = 0; id < 49; id++) {
      for (const adjId of getAdjacentTileIds(id)) {
        expect(adjId).toBeGreaterThanOrEqual(0)
        expect(adjId).toBeLessThan(49)
      }
    }
  })

  it('never wraps rows (left edge col=0 → no left neighbour)', () => {
    // Tile 7 = row 1, col 0 → should NOT include tile 6 (end of row 0)
    expect(getAdjacentTileIds(7)).not.toContain(6)
  })
})

describe('pickRandomTopics', () => {
  const TOPICS = ['a', 'b', 'c', 'd', 'e', 'f']

  it('returns the requested count', () => {
    expect(pickRandomTopics(TOPICS, 3).length).toBe(3)
    expect(pickRandomTopics(TOPICS, 1).length).toBe(1)
  })

  it('returns no duplicates', () => {
    for (let i = 0; i < 50; i++) {
      const picked = pickRandomTopics(TOPICS, 3)
      expect(new Set(picked).size).toBe(3)
    }
  })

  it('only returns items from the input list', () => {
    const picked = pickRandomTopics(TOPICS, 3)
    for (const t of picked) expect(TOPICS).toContain(t)
  })

  it('is deterministic with an injected random source', () => {
    const rng = () => 0
    const a = pickRandomTopics(TOPICS, 3, rng)
    const b = pickRandomTopics(TOPICS, 3, rng)
    expect(a).toEqual(b)
  })

  it('handles count > list length gracefully', () => {
    expect(pickRandomTopics(['x', 'y'], 5).length).toBe(2)
  })
})

describe('switchTurn', () => {
  it('toggles A→B', () => expect(switchTurn('A')).toBe('B'))
  it('toggles B→A', () => expect(switchTurn('B')).toBe('A'))
})

describe('applyCorrectAnswer', () => {
  it('turns the target tile into a house owned by the team', () => {
    const board = makeBoard()
    // Find a grassland tile
    const tile = board.find((t) => t.type === 'grassland')
    const result = applyCorrectAnswer(board, tile.id, 'A')
    expect(result[tile.id].type).toBe('house')
    expect(result[tile.id].ownedBy).toBe('A')
  })

  it('does not mutate the original board', () => {
    const board = makeBoard()
    const tile = board.find((t) => t.type === 'grassland')
    const copy = JSON.parse(JSON.stringify(board))
    applyCorrectAnswer(board, tile.id, 'B')
    expect(board).toEqual(copy)
  })

  it('revives adjacent burnt tiles back to grassland', () => {
    // Place a burnt tile adjacent to tile 10 (row1,col3).
    // Tile 3 (directly above) will be burnt.
    const board = makeBoard({
      10: { type: 'grassland', difficulty: 'easy', score: 100 },
      3: { type: 'burnt', difficulty: 'hard', score: 300, ownedBy: null },
    })
    const result = applyCorrectAnswer(board, 10, 'A')
    expect(result[10].type).toBe('house')
    expect(result[3].type).toBe('grassland')
    expect(result[3].ownedBy).toBeNull()
    // Original difficulty preserved
    expect(result[3].difficulty).toBe('hard')
    expect(result[3].score).toBe(300)
  })

  it('does not touch non-burnt adjacent tiles', () => {
    const board = makeBoard({
      10: { type: 'grassland' },
      3: { type: 'water' },
      11: { type: 'house', ownedBy: 'B' },
    })
    const result = applyCorrectAnswer(board, 10, 'A')
    expect(result[3].type).toBe('water')
    expect(result[11].type).toBe('house')
    expect(result[11].ownedBy).toBe('B')
  })
})

describe('applyWrongAnswer', () => {
  it('turns the target tile into burnt', () => {
    const board = makeBoard()
    const tile = board.find((t) => t.type === 'grassland')
    const result = applyWrongAnswer(board, tile.id)
    expect(result[tile.id].type).toBe('burnt')
    expect(result[tile.id].ownedBy).toBeNull()
  })

  it('does not mutate the original board', () => {
    const board = makeBoard()
    const tile = board.find((t) => t.type === 'grassland')
    const copy = JSON.parse(JSON.stringify(board))
    applyWrongAnswer(board, tile.id)
    expect(board).toEqual(copy)
  })

  it('reverts one adjacent house to grassland', () => {
    // Tile 10 answered wrong; tiles 3, 9, 11, 17 are adjacent.
    // Place houses on 3 and 11.
    const board = makeBoard({
      10: { type: 'grassland', difficulty: 'easy', score: 100 },
      3: { type: 'house', ownedBy: 'A', difficulty: 'hard', score: 300 },
      11: { type: 'house', ownedBy: 'B', difficulty: 'medium', score: 200 },
    })
    // Fixed random → always picks the first adjacent house in the list
    const result = applyWrongAnswer(board, 10, () => 0)
    expect(result[10].type).toBe('burnt')
    // Exactly one of the adjacent houses was reverted.
    const revertedHouses = [3, 11].filter(
      (id) => result[id].type === 'grassland'
    )
    expect(revertedHouses.length).toBe(1)
    const keptHouses = [3, 11].filter((id) => result[id].type === 'house')
    expect(keptHouses.length).toBe(1)
  })

  it('does nothing if no adjacent houses exist', () => {
    const board = makeBoard({
      10: { type: 'grassland' },
      3: { type: 'water' },
      9: { type: 'grassland' },
      11: { type: 'grassland' },
      17: { type: 'grassland' },
    })
    const result = applyWrongAnswer(board, 10)
    expect(result[10].type).toBe('burnt')
    // No tiles changed to grassland (they were already grassland).
    for (const id of [3, 9, 11, 17]) {
      expect(result[id].type).toBe(board[id].type)
    }
  })
})

describe('computeScore', () => {
  it('returns tile score when hint2 not used', () => {
    expect(computeScore(200, false)).toBe(200)
  })

  it('subtracts 30 when hint2 used', () => {
    expect(computeScore(300, true)).toBe(270)
  })

  it('floors at 0', () => {
    expect(computeScore(20, true)).toBe(0)
    expect(computeScore(0, true)).toBe(0)
  })
})
