// Presentational tile.
//
// Four visual states tied to tile.type:
//   water     — blue gradient with a soft glint; non-interactive
//   grassland — green gradient shaded by difficulty + difficulty pips
//               + score label; hoverable (looks clickable)
//   house     — team-colored gradient (A = blue, B = red) with a house glyph
//   burnt     — dark gradient with a flame glyph
//
// Grassland tiles are the only ones that should feel interactive to
// the player. `onSelect(tile)` fires when a grassland tile is clicked.

const GRASSLAND_BG = {
  easy: 'bg-gradient-to-br from-lime-300 to-green-500',
  medium: 'bg-gradient-to-br from-green-500 to-green-700',
  hard: 'bg-gradient-to-br from-green-700 to-emerald-900',
}

const GRASSLAND_TEXT = {
  easy: 'text-emerald-950',
  medium: 'text-white',
  hard: 'text-white',
}

const DIFFICULTY_PIP_COUNT = { easy: 1, medium: 2, hard: 3 }

export default function Tile({ tile, onSelect }) {
  function handleClick() {
    if (tile.type === 'grassland' && onSelect) onSelect(tile)
  }

  const base =
    'relative aspect-square flex flex-col items-center justify-center rounded-md font-bold select-none overflow-hidden transition-all duration-150 shadow-sm'

  let visual = ''
  let interactive = ''

  switch (tile.type) {
    case 'water':
      visual =
        'bg-gradient-to-br from-sky-300 via-sky-400 to-blue-600 text-white/0'
      break

    case 'grassland':
      visual = `${GRASSLAND_BG[tile.difficulty] || 'bg-green-500'} ${
        GRASSLAND_TEXT[tile.difficulty] || 'text-white'
      }`
      interactive =
        'cursor-pointer hover:ring-2 hover:ring-white/80 hover:brightness-110 hover:scale-[1.04] active:scale-95'
      break

    case 'house':
      visual =
        tile.ownedBy === 'A'
          ? 'bg-gradient-to-br from-blue-500 to-blue-800 text-white'
          : 'bg-gradient-to-br from-red-500 to-red-800 text-white'
      break

    case 'burnt':
      visual =
        'bg-gradient-to-br from-zinc-900 to-stone-800 text-orange-400'
      break

    default:
      visual = 'bg-slate-700 text-slate-300'
  }

  return (
    <div className={`${base} ${visual} ${interactive}`} onClick={handleClick}>
      {tile.type === 'water' && <WaterGlint />}

      {tile.type === 'grassland' && (
        <DifficultyPips difficulty={tile.difficulty} />
      )}

      {tile.type === 'house' && <span className="text-lg leading-none">🏠</span>}
      {tile.type === 'burnt' && <span className="text-lg leading-none">🔥</span>}
    </div>
  )
}

// Three pips, filled left-to-right based on difficulty. Uses `bg-current`
// so the pip color tracks the tile's text color automatically (white on
// medium/hard, emerald-950 on easy).
function DifficultyPips({ difficulty }) {
  const filled = DIFFICULTY_PIP_COUNT[difficulty] ?? 0
  return (
    <div
      className="flex gap-1.5"
      aria-label={`difficulty: ${difficulty}`}
      data-testid="difficulty-pips"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`w-2.5 h-2.5 rounded-full bg-current ${
            i < filled ? 'opacity-80' : 'opacity-20'
          }`}
        />
      ))}
    </div>
  )
}

// Subtle radial highlight that makes water tiles feel wet rather than
// flat. Pure CSS — no SVG, no animation cost.
function WaterGlint() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.55), rgba(255,255,255,0) 55%), radial-gradient(circle at 70% 75%, rgba(255,255,255,0.15), rgba(255,255,255,0) 60%)',
      }}
    />
  )
}
