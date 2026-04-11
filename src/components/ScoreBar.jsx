export default function ScoreBar({ teamA, teamB, currentTurn }) {
  return (
    <div className="flex items-stretch gap-2">
      <TeamCard team={teamA} color="blue" active={currentTurn === 'A'} />
      <TeamCard team={teamB} color="red" active={currentTurn === 'B'} />
    </div>
  )
}

function TeamCard({ team, color, active }) {
  const base = color === 'blue' ? 'bg-blue-700' : 'bg-red-700'
  const ring = active ? 'ring-2 ring-emerald-400' : 'ring-0'
  return (
    <div className={`flex-1 ${base} ${ring} rounded-xl px-5 py-3 text-white flex items-center justify-between`}>
      <span className="font-semibold">{team.name}</span>
      <span className="text-2xl font-bold tabular-nums">{team.score}</span>
    </div>
  )
}
