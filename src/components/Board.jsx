import Tile from './Tile.jsx'

// Phase 1 placeholder: static 7x7 grid of grassland tiles (no logic).
// Real board generation (water placement, difficulty, questionIds) lives
// in src/lib/boardGen.js and is wired up in Phase 2/3.
const SIZE = 7

export default function Board() {
  const tiles = Array.from({ length: SIZE * SIZE }, (_, i) => ({
    id: i,
    row: Math.floor(i / SIZE),
    col: i % SIZE,
    type: 'grassland',
    difficulty: ['easy', 'medium', 'hard'][i % 3],
    score: [100, 200, 300][i % 3],
    ownedBy: null,
    questionId: null,
  }))

  return (
    <div
      className="grid gap-1 bg-slate-800 p-2 rounded-xl"
      style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))` }}
    >
      {tiles.map((tile) => (
        <Tile key={tile.id} tile={tile} />
      ))}
    </div>
  )
}
