import { describe, it, expect } from 'vitest'
import {
  generateSessionCode,
  normalizeSessionCode,
  buildSessionDoc,
  SESSION_CODE_ALPHABET,
  SESSION_CODE_LENGTH,
} from './session.js'
import { BOARD_TILE_COUNT } from './boardGen.js'

describe('generateSessionCode', () => {
  it('returns a string of the configured length', () => {
    const code = generateSessionCode()
    expect(code).toHaveLength(SESSION_CODE_LENGTH)
  })

  it('uses only characters from the safe alphabet', () => {
    for (let i = 0; i < 100; i++) {
      const code = generateSessionCode()
      for (const ch of code) {
        expect(SESSION_CODE_ALPHABET).toContain(ch)
      }
    }
  })

  it('omits confusable characters 0, O, 1, I, L', () => {
    // Defensive check: even if someone edits the alphabet, this catches
    // a regression that would ship ambiguous codes to users.
    for (const ch of '0O1IL') {
      expect(SESSION_CODE_ALPHABET).not.toContain(ch)
    }
  })

  it('is deterministic when given a deterministic random source', () => {
    // Given the same RNG source, two calls must return the same code.
    const makeWalker = () => {
      let n = 0
      return () => (n++ % 10) / 10
    }
    expect(generateSessionCode(makeWalker())).toBe(
      generateSessionCode(makeWalker())
    )
    // And with RNG always returning 0, we should get 6× the first char.
    const firstChar = SESSION_CODE_ALPHABET[0]
    expect(generateSessionCode(() => 0)).toBe(firstChar.repeat(6))
  })

  it('produces different codes across real calls (probabilistically)', () => {
    const codes = new Set()
    for (let i = 0; i < 50; i++) codes.add(generateSessionCode())
    // 31^6 ≈ 887M. 50 draws should essentially never collide.
    expect(codes.size).toBe(50)
  })
})

describe('normalizeSessionCode', () => {
  it('trims whitespace and uppercases', () => {
    expect(normalizeSessionCode('  abc123  ')).toBe('ABC123')
  })

  it('returns empty string for null/undefined', () => {
    expect(normalizeSessionCode(null)).toBe('')
    expect(normalizeSessionCode(undefined)).toBe('')
  })
})

describe('buildSessionDoc', () => {
  const base = {
    code: 'ABC123',
    teamAName: 'آلفا',
    teamBName: 'براوو',
    createdAt: 'TS',
  }

  it('matches the Firestore schema in CLAUDE.md', () => {
    const doc = buildSessionDoc(base)
    expect(doc).toMatchObject({
      id: 'ABC123',
      createdAt: 'TS',
      status: 'active',
      currentTurn: 'A',
      teams: {
        A: { name: 'آلفا', score: 0 },
        B: { name: 'براوو', score: 0 },
      },
    })
  })

  it('seeds the board from the code and includes 49 tiles', () => {
    const doc = buildSessionDoc(base)
    expect(doc.board).toHaveLength(BOARD_TILE_COUNT)
  })

  it('produces identical boards for the same code (deterministic)', () => {
    const a = buildSessionDoc(base)
    const b = buildSessionDoc(base)
    expect(a.board).toEqual(b.board)
  })

  it('falls back to Farsi default team names when blank', () => {
    const doc = buildSessionDoc({
      code: 'AAAA11',
      teamAName: '',
      teamBName: '   ',
      createdAt: 'TS',
    })
    expect(doc.teams.A.name).toBe('تیم آبی')
    expect(doc.teams.B.name).toBe('تیم قرمز')
  })

  it('trims whitespace around team names', () => {
    const doc = buildSessionDoc({
      code: 'AAAA11',
      teamAName: '  آلفا  ',
      teamBName: '  براوو  ',
      createdAt: 'TS',
    })
    expect(doc.teams.A.name).toBe('آلفا')
    expect(doc.teams.B.name).toBe('براوو')
  })

  it('initializes both team scores at zero', () => {
    const doc = buildSessionDoc(base)
    expect(doc.teams.A.score).toBe(0)
    expect(doc.teams.B.score).toBe(0)
  })

  it('starts on team A and status=active', () => {
    const doc = buildSessionDoc(base)
    expect(doc.currentTurn).toBe('A')
    expect(doc.status).toBe('active')
  })

  it('starts with an empty usedQuestionIds list', () => {
    const doc = buildSessionDoc(base)
    expect(doc.usedQuestionIds).toEqual([])
  })
})
