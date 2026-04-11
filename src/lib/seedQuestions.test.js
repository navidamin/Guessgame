import { describe, it, expect } from 'vitest'
import { SEED_QUESTIONS } from './seedQuestions.js'
import { TOPIC_LABELS } from './topics.js'
import { DIFFICULTIES } from './boardGen.js'

describe('SEED_QUESTIONS', () => {
  it('contains at least one question per (topic × difficulty) combo', () => {
    // The game flow picks a tile (with difficulty) then a topic, then
    // looks up questions matching both. If any combo is empty, the
    // player gets stuck. This test guarantees full coverage.
    for (const topic of TOPIC_LABELS) {
      for (const difficulty of DIFFICULTIES) {
        const match = SEED_QUESTIONS.find(
          (q) => q.topic === topic && q.difficulty === difficulty
        )
        expect(
          match,
          `missing seed question for topic="${topic}" difficulty="${difficulty}"`
        ).toBeDefined()
      }
    }
  })

  it('has unique ids', () => {
    const ids = SEED_QUESTIONS.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every entry matches the Firestore question schema', () => {
    for (const q of SEED_QUESTIONS) {
      expect(typeof q.id).toBe('string')
      expect(q.id.length).toBeGreaterThan(0)
      expect(TOPIC_LABELS).toContain(q.topic)
      expect(DIFFICULTIES).toContain(q.difficulty)
      expect(typeof q.hint1).toBe('string')
      expect(q.hint1.length).toBeGreaterThan(0)
      expect(typeof q.hint2).toBe('string')
      expect(q.hint2.length).toBeGreaterThan(0)
      expect(typeof q.answer).toBe('string')
      expect(q.answer.length).toBeGreaterThan(0)
    }
  })

  it('uses stable "seed-" prefixed ids so re-seeding is idempotent', () => {
    for (const q of SEED_QUESTIONS) {
      expect(q.id.startsWith('seed-')).toBe(true)
    }
  })

  it('has no obviously broken hints (hint2 longer-or-more-specific is the norm)', () => {
    // Soft check: hint1 and hint2 should be different. This catches
    // copy-paste mistakes during editing.
    for (const q of SEED_QUESTIONS) {
      expect(q.hint1).not.toBe(q.hint2)
    }
  })
})
