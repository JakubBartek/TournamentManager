import { Card, CardContent } from '@/components/ui/card'
import type { Game } from '../types/game.ts'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { useGames } from '@/hooks/useGame'
import { useParams } from 'react-router-dom'
import { useTournament } from '@/hooks/useTournament.ts'
import { useTranslation } from 'react-i18next'
import { useMessages } from '@/hooks/useMessage'

export default function Home() {
  const { t } = useTranslation()
  const now = new Date()
  const { tournamentId } = useParams<{ tournamentId: string }>()
  const { data: games, isLoading, error } = useGames(tournamentId ?? '')
  const { data: tournament } = useTournament(tournamentId ?? '')
  const { data: messages } = useMessages(tournamentId ?? '')

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

  const GAME_DURATION_MINUTES = tournament.gameDuration || 30

  // Show ALERT messages at the top
  const alertMessages = (messages ?? []).filter((msg) => msg.type === 'ALERT')

  // Games that are currently playing
  const playingGames = games.filter((game) => {
    const start = new Date(game.date)
    const end = new Date(start.getTime() + GAME_DURATION_MINUTES * 60_000)
    return now >= start && now <= end
  })

  // Games that are coming up next
  if (!Array.isArray(games)) return
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
    <div className='flex flex-col gap-3 mb-16 items-center'>
      <p className='text-xl font-bold mb-4'>{tournament.name}</p>
      {/* ALERT messages on top */}
      {Array.isArray(alertMessages) &&
        alertMessages.map((msg) => (
          <Card key={msg.id} className='w-full max-w-xl md:w-lg bg-yellow-100'>
            <CardContent>
              <p className='font-semibold text-yellow-800'>{msg.content}</p>
              <p className='text-xs text-gray-500'>
                {new Date(msg.createdAt).toLocaleString('sk-SK', {
                  timeZone: 'CET',
                })}
              </p>
            </CardContent>
          </Card>
        ))}
      {Array.isArray(playingGames) &&
        playingGames.map((game) => {
          const team1 = game.team1?.name || game.team1Id
          const team2 = game.team2?.name || game.team2Id
          const team1Color = game.team1?.teamColor || ''
          const team2Color = game.team2?.teamColor || ''
          return (
            <Card key={game.id} className='w-full max-w-xl md:w-lg'>
              <CardContent>
                <p className='font-semibold text-blue-600'>
                  {t('now_playing')}
                </p>
                <p className='font-bold'>
                  {(() => {
                    const idx = games.findIndex((g) => g.id === game.id)
                    return idx >= 0 ? `${idx + 1}. ` : ''
                  })()}
                  {game.name}
                </p>
                <p>
                  {team1Color && (
                    <span
                      style={{
                        backgroundColor: team1Color,
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
                  {team1} vs {team2}{' '}
                  {team2Color && (
                    <span
                      style={{
                        backgroundColor: team2Color,
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
                </p>
                {game.score1 !== undefined && (
                  <p className='text-xl font-bold'>
                    {game.score1} : {game.score2}
                  </p>
                )}
                <p className='text-sm text-gray-600'>
                  {format(toZonedTime(new Date(game.date), 'CET'), 'HH:mm')} @{' '}
                  {game.rinkName || 'Unknown Rink'}
                </p>
              </CardContent>
            </Card>
          )
        })}

      {Array.isArray(nextGames) &&
        nextGames.map((game) => {
          const team1 = game.team1?.name || game.team1Id
          const team2 = game.team2?.name || game.team2Id
          const team1Color = game.team1?.teamColor || ''
          const team2Color = game.team2?.teamColor || ''
          return (
            <Card key={game.id} className='w-full max-w-xl md:w-lg'>
              <CardContent>
                <p className='font-semibold text-gray-800'>{t('next_game')}</p>
                <p className='font-bold'>
                  {(() => {
                    const idx = games.findIndex((g) => g.id === game.id)
                    return idx >= 0 ? `${idx + 1}. ` : ''
                  })()}
                  {game.name}
                </p>
                <p>
                  {team1Color && (
                    <span
                      style={{
                        backgroundColor: team1Color,
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
                  {team1} vs {team2}{' '}
                  {team2Color && (
                    <span
                      style={{
                        backgroundColor: team2Color,
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
                </p>
                <p className='text-sm text-gray-600'>
                  {format(toZonedTime(new Date(game.date), 'CET'), 'HH:mm')} @{' '}
                  {game.rinkName || 'Unknown Rink'}
                </p>
              </CardContent>
            </Card>
          )
        })}
    </div>
  )
}
