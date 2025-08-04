import { Card, CardContent } from '@/components/ui/card'
import type { Game } from '../types/game.ts'
import { format } from 'date-fns'
import { useGames } from '@/hooks/useGame'
import { useParams } from 'react-router-dom'
import { useTournament } from '@/hooks/useTournament.ts'
import { useTeams } from '@/hooks/useTeam.ts'
import { useTranslation } from 'react-i18next'

export default function Home() {
  const { t } = useTranslation()
  const now = new Date()
  const GAME_DURATION_MINUTES = 60
  const { tournamentId } = useParams<{ tournamentId: string }>()
  const { data: games, isLoading, error } = useGames(tournamentId ?? '')
  const { data: tournament } = useTournament(tournamentId ?? '')
  const { data: teams } = useTeams(tournamentId ?? '')

  if (!tournamentId) {
    return <div>Error: Tournament ID is missing</div>
  }

  if (!tournament) {
    return <div>Loading tournament...</div>
  }

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
  if (nextGameTimes.length !== 0) {
    const earliestNextGameTime = new Date(
      Math.min(...nextGameTimes.map((d) => d.getTime())),
    )

    nextGames = games.filter((game) => {
      const start = new Date(game.date)
      return start.getTime() === earliestNextGameTime.getTime()
    })
  }

  return (
    <div className='flex flex-col gap-2 mb-16 items-center'>
      <p className='text-xl font-bold mb-4'>{tournament.name}</p>
      {playingGames.map((game) => {
        const team1 =
          teams?.find((t) => t.id === game.team1Id)?.name || game.team1Id
        const team2 =
          teams?.find((t) => t.id === game.team2Id)?.name || game.team2Id
        return (
          <Card key={game.id} className='w-full md:w-lg'>
            <CardContent>
              <p className='font-semibold text-blue-600'>{t('now_playing')}</p>
              <p>
                {team1} vs {team2}
              </p>
              {game.score1 !== undefined && (
                <p className='text-xl font-bold'>
                  {game.score1} : {game.score2}
                </p>
              )}
              <p className='text-sm text-gray-600'>
                {format(new Date(game.date), 'HH:mm')} @{' '}
                {game.rinkName || 'Unknown Rink'}
              </p>
            </CardContent>
          </Card>
        )
      })}

      {nextGames.map((game) => {
        const team1 =
          teams?.find((t) => t.id === game.team1Id)?.name || game.team1Id
        const team2 =
          teams?.find((t) => t.id === game.team2Id)?.name || game.team2Id
        return (
          <Card key={game.id} className='w-full md:w-lg'>
            <CardContent>
              <p className='font-semibold text-gray-800'>{t('next_game')}</p>
              <p>
                {team1} vs {team2}
              </p>
              <p className='text-sm text-gray-600'>
                {format(new Date(game.date), 'HH:mm')} @{' '}
                {game.rinkName || 'Unknown Rink'}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
