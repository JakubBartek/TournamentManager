import { Card, CardContent } from '@/components/ui/card'
import type { Game } from '../types/game.ts'
import { format } from 'date-fns'
import { useGames } from '@/hooks/useGame'
import { useParams } from 'react-router-dom'
import { useTournament } from '@/hooks/useTournament.ts'

export default function Home() {
  const now = new Date()
  const GAME_DURATION_MINUTES = 60
  const { tournamentId } = useParams<{ tournamentId: string }>()
  const { data: games, isLoading, error } = useGames(tournamentId ?? '')
  const { data: tournament } = useTournament(tournamentId ?? '')

  if (!tournamentId) {
    return <div>Error: Tournament ID is missing</div>
  }

  if (!tournament) {
    return <div>Loading tournament...</div>
  }

  let currentGame: Game | null = null
  let nextGame: Game | null = null

  if (isLoading) return <div>Loading games...</div>
  if (error) return <div>Error: {(error as Error).message}</div>

  if (games === undefined) {
    return <div>Loading...</div>
  }

  // Games that are currently playing
  const playingGames = games.filter((game) => {
    const start = new Date(game.date)
    const end = new Date(start.getTime() + GAME_DURATION_MINUTES * 60_000)
    return now >= start && now <= end
  })

  // Games that are coming up next
  const nextGameTimes = games
    .map((game) => new Date(game.date))
    .filter((date) => date > now)

  let nextGames: Game[] = []
  if (nextGameTimes.length === 0) {
    /* empty */
  } else {
    const earliestNextGameTime = new Date(
      Math.min(...nextGameTimes.map((d) => d.getTime())),
    )

    nextGames = games.filter((game) => {
      const start = new Date(game.date)
      return start.getTime() === earliestNextGameTime.getTime()
    })
  }

  // TODO: REMOVE--- THIS IS ONLY TO SHOW SOMETHING IN THE UI
  for (let i = 0; i < games.length; i++) {
    const game = games[i]
    currentGame = game
    nextGame = games[i + 1] ?? null
    break
  }

  return (
    <div className='flex flex-col gap-2'>
      <p className='text-xl font-bold mb-4'>{tournament.name}</p>
      {/* TODO: REMOVE ----------THIS IS ONLY FOR TESTING-------------------*/}
      {currentGame && (
        <Card className='w-full'>
          <CardContent>
            <p className='font-semibold text-blue-600'>Now Playing</p>
            <p>
              {currentGame.team1} vs {currentGame.team2}
            </p>
            {currentGame.score1 && (
              <p className='text-xl font-bold'>
                {currentGame.score1} : {currentGame.score2}
              </p>
            )}
            <p className='text-sm text-gray-600'>
              {format(new Date(currentGame.date), 'HH:mm')} @ {currentGame.rink}
            </p>
          </CardContent>
        </Card>
      )}
      {nextGame && (
        <Card className='w-full'>
          <CardContent>
            <p className='font-semibold text-gray-800'>Next Game</p>
            <p>
              {nextGame.team1} vs {nextGame.team2}
            </p>
            <p className='text-sm text-gray-600'>
              {format(new Date(nextGame.date), 'HH:mm')} @ {nextGame.rink}
            </p>
          </CardContent>
        </Card>
      )}
      {/* TODO: END REMOVE ----------------------------------------------*/}
      {playingGames.map((game) => (
        <Card key={game.id} className='w-full'>
          <CardContent>
            <p className='font-semibold text-blue-600'>Now Playing</p>
            <p>
              {game.team1} vs {game.team2}
            </p>
            {game.score1 && (
              <p className='text-xl font-bold'>
                {game.score1} : {game.score2}
              </p>
            )}
            <p className='text-sm text-gray-600'>
              {format(new Date(game.date), 'HH:mm')} @ {game.rink}
            </p>
          </CardContent>
        </Card>
      ))}
      {nextGames.map((game) => (
        <Card key={game.id} className='w-full'>
          <CardContent>
            <p className='font-semibold text-gray-800'>Next Game</p>
            <p>
              {game.team1} vs {game.team2}
            </p>
            <p className='text-sm text-gray-600'>
              {format(new Date(game.date), 'HH:mm')} @ {game.rink}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
