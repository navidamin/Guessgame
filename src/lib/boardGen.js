// Deterministic 7x7 board generator.
//
// Given a seed (string or number), produces the same board every time.
// We use a simple 32-bit PRNG (mulberry32) so the output is identical
// across browsers and Node — important because the board is generated
// once at session creation, stored in Firestore, and read by every
// client. Determinism lets us verify round-trips in tests without
// network.

export const BOARD_SIZE = 7
export const BOARD_TILE_COUNT = BOARD_SIZE * BOARD_SIZE // 49
export const WATER_MIN = 8
export const WATER_MAX = 10

export const DIFFICULTIES = ['easy', 'medium', 'hard']
export const SCORE_BY_DIFFICULTY = {
  easy: 100,
  medium: 200,
  hard: 300,
}

// Mulberry32 — tiny, fast, seedable PRNG. Not cryptographic.
function mulberry32(seed) {
  let a = seed >>> 0
  return function rand() {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// FNV-1a 32-bit string hash. Lets us accept a session code ("ABC123")
// as a seed without the caller having to hash it.
export function hashSeed(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function randInt(rng, minInclusive, maxExclusive) {
  return minInclusive + Math.floor(rng() * (maxExclusive - minInclusive))
}

function pickWaterIds(rng, count) {
  const ids = new Set()
  while (ids.size < count) {
    ids.add(randInt(rng, 0, BOARD_TILE_COUNT))
  }
  return ids
}

// Creates a blank tile with the shape defined in CLAUDE.md.
function makeTile(id, overrides = {}) {
  return {
    id,
    row: Math.floor(id / BOARD_SIZE),
    col: id % BOARD_SIZE,
    type: 'grassland',
    difficulty: null,
    score: null,
    ownedBy: null,
    questionId: null,
    ...overrides,
  }
}

// Main entry point. Returns a length-49 array of tile objects.
// `seed` can be either a number or a string (session code).
export function generateBoard(seed) {
  const numericSeed =
    typeof seed === 'string' ? hashSeed(seed) : (seed >>> 0) || 1
  const rng = mulberry32(numericSeed)

  // Pick how many water tiles (8..10 inclusive) and their positions.
  const waterCount = randInt(rng, WATER_MIN, WATER_MAX + 1)
  const waterIds = pickWaterIds(rng, waterCount)

  const tiles = []
  for (let id = 0; id < BOARD_TILE_COUNT; id++) {
    if (waterIds.has(id)) {
      tiles.push(makeTile(id, { type: 'water' }))
    } else {
      const difficulty = DIFFICULTIES[randInt(rng, 0, DIFFICULTIES.length)]
      tiles.push(
        makeTile(id, {
          type: 'grassland',
          difficulty,
          score: SCORE_BY_DIFFICULTY[difficulty],
        })
      )
    }
  }
  return tiles
}
