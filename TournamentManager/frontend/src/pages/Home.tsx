import { Card, CardContent } from '@/components/ui/card'
import type { Game } from '../types/game.ts' // Assuming Game is exported from a shared file
import { format } from 'date-fns'
import { useGames } from '@/hooks/useGame'
import { useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'

export default function Home() {
  const [searchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const now = new Date()
  const GAME_DURATION_MINUTES = 60

  let currentGame: Game | null = null
  let nextGame: Game | null = null

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ['gamesHome'],
    })
  }, [searchParams, queryClient])

  const {
    data: games,
    isLoading,
    error,
  } = useGames('6ac7f8f0-7e75-4456-80ef-ebc342f1ceeb')

  if (isLoading) return <div>Načítavam hry...</div>
  if (error) return <div>Chyba: {(error as Error).message}</div>

  if (games === undefined) {
    return <div>Loading...</div>
  }

  console.log('games =', games)
  console.log('typeof games =', typeof games)
  console.log('isArray =', Array.isArray(games))

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
  }

  return (
    <div className='flex flex-col gap-2'>
      <ul>
        {games?.map((game) => (
          <li key={game.id}>
            {game.team1} vs {game.team2}
          </li>
        ))}
      </ul>
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
