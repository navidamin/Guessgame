import { describe, it, expect } from 'vitest'
import {
  pickRandom,
  filterByTopicAndDifficulty,
  pickFreshQuestion,
} from './questions.js'
import { SEED_QUESTIONS } from './seedQuestions.js'

describe('pickRandom', () => {
  it('returns null for an empty list', () => {
    expect(pickRandom([])).toBeNull()
  })

  it('returns null for a non-array input', () => {
    expect(pickRandom(null)).toBeNull()
    expect(pickRandom(undefined)).toBeNull()
  })

  it('returns the only element for a singleton', () => {
    expect(pickRandom(['x'])).toBe('x')
  })

  it('uses the injected random source', () => {
    const list = ['a', 'b', 'c', 'd']
    // random()=0 → index 0, random()=0.9 → index 3
    expect(pickRandom(list, () => 0)).toBe('a')
    expect(pickRandom(list, () => 0.999)).toBe('d')
  })

  it('never produces an out-of-range index', () => {
    const list = ['a', 'b', 'c']
    for (let r = 0; r < 1; r += 0.01) {
      const picked = pickRandom(list, () => r)
      expect(list).toContain(picked)
    }
  })
})

describe('filterByTopicAndDifficulty', () => {
  it('returns only entries matching both topic and difficulty', () => {
    const results = filterByTopicAndDifficulty(
      SEED_QUESTIONS,
      'جغرافیا',
      'easy'
    )
    for (const q of results) {
      expect(q.topic).toBe('جغرافیا')
      expect(q.difficulty).toBe('easy')
    }
    expect(results.length).toBeGreaterThanOrEqual(1)
  })

  it('returns an empty array when nothing matches', () => {
    const results = filterByTopicAndDifficulty(
      SEED_QUESTIONS,
      'جغرافیا',
      'impossible'
    )
    expect(results).toEqual([])
  })

  it('does not mutate the input list', () => {
    const copy = [...SEED_QUESTIONS]
    filterByTopicAndDifficulty(SEED_QUESTIONS, 'موسیقی', 'hard')
    expect(SEED_QUESTIONS).toEqual(copy)
  })
})

describe('pickFreshQuestion', () => {
  const questions = [{ id: 'q1' }, { id: 'q2' }, { id: 'q3' }]

  it('never picks a used question while fresh ones remain', () => {
    for (let r = 0; r < 1; r += 0.01) {
      const picked = pickFreshQuestion(questions, ['q1', 'q3'], () => r)
      expect(picked.id).toBe('q2')
    }
  })

  it('picks from all questions when nothing is used', () => {
    expect(pickFreshQuestion(questions, [], () => 0).id).toBe('q1')
    expect(pickFreshQuestion(questions, [], () => 0.999).id).toBe('q3')
  })

  it('falls back to repeats when every question is used', () => {
    // A repeat beats dead-ending the game.
    const picked = pickFreshQuestion(questions, ['q1', 'q2', 'q3'], () => 0)
    expect(picked.id).toBe('q1')
  })

  it('returns null for an empty question list', () => {
    expect(pickFreshQuestion([], ['q1'])).toBeNull()
  })

  it('defaults usedIds to empty when omitted', () => {
    expect(questions).toContain(pickFreshQuestion(questions))
  })
})
