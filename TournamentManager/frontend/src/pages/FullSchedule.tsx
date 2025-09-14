import { useParams } from 'react-router-dom'
import { useGames } from '@/hooks/useGame'
import { Card, CardContent } from '@/components/ui/card'

export default function FullSchedule() {
  const { tournamentId } = useParams<{ tournamentId: string }>()
  const {
    data: games,
    isLoading: loading,
    error,
  } = useGames(tournamentId || '')

  if (!games || loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    )
  }
  if (error) {
    return <div className='text-red-500 mb-4'>Error</div>
  }

  return (
    <div className='w-full flex flex-wrap justify-center'>
      {games.map((game) => (
        <Card key={game.id} className='w-sm h-xs m-0 p-1'>
          <CardContent>
            <h2 className='text-lg font-bold text-nowrap'>
              {game.name}
              {game.team1?.teamColor && (
                <span
                  style={{
                    backgroundColor: game.team1.teamColor,
                    display: 'inline-block',
                    width: 16,
                    height: 16,
                    verticalAlign: 'middle',
                    marginRight: 8,
                    border: '1px solid rgba(0,0,0,0.15)',
                    borderRadius: 2,
                  }}
                />
              )}
              {game.team1?.name} {game.team1 && <span>vs</span>}{' '}
              {game.team2?.name}{' '}
              {game.team2?.teamColor && (
                <span
                  style={{
                    backgroundColor: game.team2.teamColor,
                    display: 'inline-block',
                    width: 16,
                    height: 16,
                    verticalAlign: 'middle',
                    marginRight: 8,
                    border: '1px solid rgba(0,0,0,0.15)',
                    borderRadius: 2,
                  }}
                />
              )}
            </h2>
            <p>
              {new Date(game.date).toLocaleTimeString()} - Rink: {game.rinkName}
            </p>
            <h2 className='text-lg font-bold'>
              Score: {game.score1} - {game.score2}
            </h2>
          </CardContent>
        </Card>
      ))}{' '}
    </div>
  )
}
