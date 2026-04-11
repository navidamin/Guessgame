// Presentational tile. Colors follow the CLAUDE.md spec:
//   water → blue, grassland → green (shaded by difficulty),
//   house A → blue-600, house B → red-600, burnt → gray/orange.
const GRASS_BY_DIFFICULTY = {
  easy: 'bg-green-300 text-green-900',
  medium: 'bg-green-500 text-green-950',
  hard: 'bg-green-700 text-white',
}

export default function Tile({ tile }) {
  let className =
    'aspect-square flex items-center justify-center rounded-md text-xs font-bold select-none transition'

  if (tile.type === 'water') {
    className += ' bg-blue-400'
  } else if (tile.type === 'grassland') {
    className += ` ${GRASS_BY_DIFFICULTY[tile.difficulty] ?? 'bg-green-400'}`
  } else if (tile.type === 'house') {
    className += tile.ownedBy === 'A' ? ' bg-blue-600 text-white' : ' bg-red-600 text-white'
  } else if (tile.type === 'burnt') {
    className += ' bg-gray-800 text-orange-400'
  }

  return (
    <div className={className}>
      {tile.type === 'grassland' && tile.score}
      {tile.type === 'house' && '🏠'}
      {tile.type === 'burnt' && '🔥'}
    </div>
  )
}
