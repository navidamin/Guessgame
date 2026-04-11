import Tile from './Tile.jsx'
import { BOARD_SIZE, generateBoard } from '../lib/boardGen.js'

// Fallback board used when no tiles prop is passed (e.g. in tests
// or Storybook). Real gameplay always passes a board generated
// from the session seed.
const FALLBACK_TILES = generateBoard('default')

export default function Board({ tiles = FALLBACK_TILES }) {
  return (
    <div
      className="grid gap-1 bg-slate-800 p-2 rounded-xl"
      style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))` }}
    >
      {tiles.map((tile) => (
        <Tile key={tile.id} tile={tile} />
      ))}
    </div>
  )
}
