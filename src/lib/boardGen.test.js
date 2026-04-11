import { describe, it, expect } from 'vitest'
import {
  generateBoard,
  hashSeed,
  BOARD_TILE_COUNT,
  BOARD_SIZE,
  WATER_MIN,
  WATER_MAX,
  DIFFICULTIES,
  SCORE_BY_DIFFICULTY,
} from './boardGen.js'

describe('generateBoard', () => {
  it('returns exactly 49 tiles', () => {
    expect(generateBoard(42).length).toBe(BOARD_TILE_COUNT)
  })

  it('assigns ids 0..48 with no duplicates', () => {
    const board = generateBoard(42)
    const ids = board.map((t) => t.id).sort((a, b) => a - b)
    expect(ids).toEqual(Array.from({ length: BOARD_TILE_COUNT }, (_, i) => i))
  })

  it('derives row and col from id', () => {
    const board = generateBoard(42)
    for (const tile of board) {
      expect(tile.row).toBe(Math.floor(tile.id / BOARD_SIZE))
      expect(tile.col).toBe(tile.id % BOARD_SIZE)
    }
  })

  it('places between 8 and 10 water tiles across many seeds', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const board = generateBoard(seed)
      const waterCount = board.filter((t) => t.type === 'water').length
      expect(waterCount).toBeGreaterThanOrEqual(WATER_MIN)
      expect(waterCount).toBeLessThanOrEqual(WATER_MAX)
    }
  })

  it('gives every grassland tile a valid difficulty and matching score', () => {
    const board = generateBoard(42)
    for (const tile of board) {
      if (tile.type !== 'grassland') continue
      expect(DIFFICULTIES).toContain(tile.difficulty)
      expect(tile.score).toBe(SCORE_BY_DIFFICULTY[tile.difficulty])
    }
  })

  it('leaves water tiles with null difficulty and null score', () => {
    const board = generateBoard(42)
    for (const tile of board.filter((t) => t.type === 'water')) {
      expect(tile.difficulty).toBeNull()
      expect(tile.score).toBeNull()
    }
  })

  it('every tile starts unowned with no question attached', () => {
    const board = generateBoard(42)
    for (const tile of board) {
      expect(tile.ownedBy).toBeNull()
      expect(tile.questionId).toBeNull()
    }
  })

  it('is deterministic for the same numeric seed', () => {
    expect(generateBoard(42)).toEqual(generateBoard(42))
  })

  it('is deterministic for the same string seed', () => {
    expect(generateBoard('demo')).toEqual(generateBoard('demo'))
  })

  it('produces different boards for different seeds', () => {
    const a = generateBoard(1)
    const b = generateBoard(2)
    // At least water placement or one tile's difficulty should differ.
    expect(a).not.toEqual(b)
  })

  it('exposes every difficulty at least once across seeds (no dead tiers)', () => {
    // With ~40 grassland tiles and random picks, each difficulty
    // should appear almost always. Sample a few seeds to be robust.
    const seen = new Set()
    for (let seed = 1; seed <= 10; seed++) {
      for (const tile of generateBoard(seed)) {
        if (tile.type === 'grassland') seen.add(tile.difficulty)
      }
    }
    expect(seen).toEqual(new Set(DIFFICULTIES))
  })
})

describe('hashSeed', () => {
  it('is deterministic', () => {
    expect(hashSeed('demo')).toBe(hashSeed('demo'))
  })

  it('gives different hashes for different strings', () => {
    expect(hashSeed('abc')).not.toBe(hashSeed('abd'))
  })

  it('returns an unsigned 32-bit integer', () => {
    const h = hashSeed('any string')
    expect(Number.isInteger(h)).toBe(true)
    expect(h).toBeGreaterThanOrEqual(0)
    expect(h).toBeLessThanOrEqual(0xffffffff)
  })
})
