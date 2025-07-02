import { Card, CardContent } from '@/components/ui/card'
import type { Game } from '../types/game.ts'
import { format } from 'date-fns'
import { useGames } from '@/hooks/useGame'
import { useParams } from 'react-router-dom'

export default function Home() {
  const now = new Date()
  const GAME_DURATION_MINUTES = 60
  const { tournamentId } = useParams<{ tournamentId: string }>()
  const { data: games, isLoading, error } = useGames(tournamentId ?? '')

  if (!tournamentId) {
    return <div>Error: Tournament ID is missing</div>
  }

  let currentGame: Game | null = null
  let nextGame: Game | null = null

  if (isLoading) return <div>Loading games...</div>
  if (error) return <div>Error: {(error as Error).message}</div>

  if (games === undefined) {
    return <div>Loading...</div>
  }

  for (let i = 0; i < games.length; i++) {
    const game = games[i]
    const start = new Date(game.date)
    const end = new Date(start.getTime() + GAME_DURATION_MINUTES * 60_000)

    if (now >= start && now <= end) {
      currentGame = game
      nextGame = games[i + 1] ?? null
      break
    }

    if (now < start) {
      nextGame = game
      break
    }

    // TODO: REMOVE--- THIS IS ONLY TO SHOW SOMETHING IN THE UI
    currentGame = game
    nextGame = games[i + 1] ?? null
    break
  }

  return (
    <div className='flex flex-col gap-2'>
      {}
      {currentGame && (
        <Card className='w-full'>
          <CardContent className=''>
            <p className='font-semibold text-blue-600'>Now Playing</p>
            <p>
              {currentGame.team1} vs {currentGame.team2}
            </p>
            {currentGame.score1 && (
              <p className='text-xl font-bold'>
                {currentGame.score1} : {currentGame.score1}
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
          <CardContent className=''>
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
    </div>
  )
}
