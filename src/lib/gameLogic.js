// Pure game-logic functions. No side effects, no Firestore.
// Every function here is deterministic (or accepts an injectable RNG)
// so the test suite can cover them exhaustively.

import { BOARD_SIZE, BOARD_TILE_COUNT } from './boardGen.js'

// Returns up/down/left/right neighbours of a tile (no diagonals).
export function getAdjacentTileIds(tileId) {
  const row = Math.floor(tileId / BOARD_SIZE)
  const col = tileId % BOARD_SIZE
  const adj = []
  if (row > 0) adj.push(tileId - BOARD_SIZE) // up
  if (row < BOARD_SIZE - 1) adj.push(tileId + BOARD_SIZE) // down
  if (col > 0) adj.push(tileId - 1) // left
  if (col < BOARD_SIZE - 1) adj.push(tileId + 1) // right
  return adj
}

// Pick `count` random topics from the full list (Fisher-Yates partial shuffle).
export function pickRandomTopics(allTopics, count = 3, random = Math.random) {
  const pool = [...allTopics]
  const result = []
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(random() * pool.length)
    result.push(pool.splice(idx, 1)[0])
  }
  return result
}

export function switchTurn(current) {
  return current === 'A' ? 'B' : 'A'
}

// Deep-clones the board (array of plain tile objects). Uses a shallow
// spread per tile since tiles are flat.
function cloneBoard(board) {
  return board.map((t) => ({ ...t }))
}

// Correct answer: tile → house, adjacent burnt → grassland.
export function applyCorrectAnswer(board, tileId, team) {
  const b = cloneBoard(board)

  // 1. Target tile becomes a house owned by the answering team.
  b[tileId] = {
    ...b[tileId],
    type: 'house',
    ownedBy: team,
    questionId: null,
  }

  // 2. Every adjacent burnt tile is revived to grassland.
  //    Per CLAUDE.md: "When a new house H is built, find all
  //    adjacent tiles of H that are burnt. Those burnt tiles
  //    become grassland (assign new random questionId)."
  //    We keep the original difficulty/score; questionId=null
  //    signals "re-eligible for play".
  for (const adjId of getAdjacentTileIds(tileId)) {
    if (b[adjId].type === 'burnt') {
      b[adjId] = {
        ...b[adjId],
        type: 'grassland',
        ownedBy: null,
        questionId: null,
      }
    }
  }

  return b
}

// Wrong answer: tile → burnt, one random adjacent house → grassland.
export function applyWrongAnswer(board, tileId, random = Math.random) {
  const b = cloneBoard(board)

  // 1. Target tile becomes burnt.
  b[tileId] = {
    ...b[tileId],
    type: 'burnt',
    ownedBy: null,
    questionId: null,
  }

  // 2. Pick one adjacent house at random and revert it to grassland.
  //    Per CLAUDE.md: "Find all adjacent tiles that are houses,
  //    pick ONE at random, that house → becomes vacant grassland
  //    (assign new random questionId)."
  const adjacentHouses = getAdjacentTileIds(tileId).filter(
    (id) => b[id].type === 'house'
  )
  if (adjacentHouses.length > 0) {
    const picked =
      adjacentHouses[Math.floor(random() * adjacentHouses.length)]
    b[picked] = {
      ...b[picked],
      type: 'grassland',
      ownedBy: null,
      questionId: null,
    }
  }

  return b
}

// Computes the score a team earns from a correct answer.
export function computeScore(tileScore, hint2Used) {
  if (!hint2Used) return tileScore
  return Math.max(0, tileScore - 30)
}
