import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useGames, useGameDelete } from '@/hooks/useGame'
import { useTeams } from '@/hooks/useTeam'
import { useParams } from 'react-router-dom'
import { format } from 'date-fns'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useZamboniTimes, useZamboniTimeDelete } from '@/hooks/useZamboniTime'
import { ZamboniTime } from '@/types/zamboniTime'
import { useTournament } from '@/hooks/useTournament'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useGroups, useGroupDelete } from '@/hooks/useGroup'

export default function Schedule() {
  const { t } = useTranslation()
  const { tournamentId } = useParams<{ tournamentId: string }>()
  const { data: tournament } = useTournament(tournamentId || '')
  const location = useLocation()
  const fromCreate = location.state?.fromCreate
  const navigate = useNavigate()
  const {
    data: games,
    isLoading: gamesLoading,
    error: gamesError,
  } = useGames(tournamentId ?? '')
  const { mutate: deleteGame } = useGameDelete()
  const { mutate: deleteZamboniTime } = useZamboniTimeDelete()
  const {
    data: teams,
    isLoading: teamsLoading,
    error: teamsError,
  } = useTeams(tournamentId ?? '')
  const { data: groups } = useGroups(tournamentId || '')
  const { mutate: deleteGroup } = useGroupDelete(tournamentId || '')
  const {
    data: zamboniTimes,
    isLoading: zamboniTimesLoading,
    error: zamboniTimesError,
  } = useZamboniTimes(tournamentId ?? '')
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const now = new Date()
  const GAME_DURATION_MINUTES = 60

  useEffect(() => {
    if (scrollRef.current) {
      const offset = 120
      const element = scrollRef.current
      const y =
        element.getBoundingClientRect().top + window.pageYOffset - offset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }, [])

  if (!tournamentId) return <div>Error: Tournament ID is missing</div>
  if (gamesLoading) return <div>Loading games...</div>
  if (gamesError) return <div>Error: {(gamesError as Error).message}</div>
  if (teamsLoading) return <div>Loading teams...</div>
  if (teamsError) return <div>Error: {(teamsError as Error).message}</div>
  if (zamboniTimesLoading) return <div>Loading zamboni times...</div>
  if (zamboniTimesError)
    return <div>Error: {(zamboniTimesError as Error).message}</div>

  const sortedGames = [...(games ?? [])].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )

  // Combine games and zamboni times, sort by time, and filter by team if needed
  type ScheduleItem =
    | { type: 'game'; game: (typeof sortedGames)[number] }
    | { type: 'zamboni'; zamboni: ZamboniTime }

  const scheduleItems: ScheduleItem[] = [
    ...sortedGames.map((game) => ({ type: 'game' as const, game })),
    ...(zamboniTimes ?? []).map((zamboni) => ({
      type: 'zamboni' as const,
      zamboni,
    })),
  ].sort((a, b) => {
    const aDate =
      a.type === 'game'
        ? new Date(a.game.date).getTime()
        : new Date(a.zamboni.startTime).getTime()
    const bDate =
      b.type === 'game'
        ? new Date(b.game.date).getTime()
        : new Date(b.zamboni.startTime).getTime()
    return aDate - bDate
  })

  const filteredScheduleItems = selectedTeamId
    ? scheduleItems.filter((item) =>
        item.type === 'game'
          ? item.game.team1Id === selectedTeamId ||
            item.game.team2Id === selectedTeamId
          : true,
      )
    : scheduleItems

  const scrollToIndex = filteredScheduleItems.findIndex((item) => {
    const start =
      item.type === 'game'
        ? new Date(item.game.date)
        : new Date(item.zamboni.startTime)
    const end = new Date(start.getTime() + GAME_DURATION_MINUTES * 60_000)
    return (now >= start && now <= end) || now < start
  })

  return (
    <>
      <div className='fixed top-4 left-1/2 transform -translate-x-1/2 w-full flex justify-center z-10'>
        <div className='max-w-md w-full mx-8'>
          <Select
            onValueChange={(value) =>
              setSelectedTeamId(value === 'all' ? null : value)
            }
          >
            <SelectTrigger className='w-full h-12 text-lg border-1 border-blue-400 rounded-lg shadow-md hover:border-blue-600 transition-colors duration-200 text-gray-300 bg-white'>
              <SelectValue placeholder={t('filter_by_team')} />
            </SelectTrigger>
            <SelectContent className='bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto'>
              <SelectItem
                value='all'
                className='text-base py-2 px-4 hover:bg-blue-50 cursor-pointer rounded-md font-semibold text-blue-700'
              >
                {t('all_teams')}
              </SelectItem>
              {Array.isArray(teams) &&
                teams?.map((team) => (
                  <SelectItem
                    key={team.id}
                    value={team.id}
                    className='text-base py-2 px-4 hover:bg-blue-50 cursor-pointer rounded-md'
                  >
                    {team.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='flex flex-col items-center gap-2 mb-16 mt-4'>
        <h1 className='text-4xl font-bold mb-4'>{t('schedule')}</h1>
        {fromCreate && (
          <Button
            onClick={() => {
              // delete all games and go back to edit tournament
              if (games) {
                ;[...games].forEach((game) => {
                  deleteGame({ id: game.id, tournamentId })
                })
              }
              if (zamboniTimes) {
                ;[...zamboniTimes].forEach((zamboni) => {
                  deleteZamboniTime({ id: zamboni.id, tournamentId })
                })
              }

              if (groups) {
                ;[...groups].forEach((group) => {
                  deleteGroup(group.id)
                })
              }

              navigate(`/${tournamentId}/edit/tournament`, {
                state: { fromEditRinks: true },
              })
            }}
            variant='destructive'
          >
            {t('delete_and_go_back')}
          </Button>
        )}
        {filteredScheduleItems.length === 0 && (
          <p className='text-gray-500'>{t('no_games_found')}</p>
        )}
        {Array.isArray(filteredScheduleItems) &&
          filteredScheduleItems.map((item, index) => {
            const start =
              item.type === 'game'
                ? new Date(item.game.date)
                : new Date(item.zamboni.startTime)
            const duration =
              item.type === 'game'
                ? GAME_DURATION_MINUTES
                : tournament?.zamboniDuration || 10
            const end = new Date(start.getTime() + duration * 60_000)
            let gameColor = ''
            let team1Name = ''
            let team2Name = ''
            let score1: number | undefined
            let score2: number | undefined
            let rink = ''

            if (item.type === 'game') {
              team1Name =
                item.game.id == undefined
                  ? 'TBD'
                  : teams?.find((team) => team.id === item.game.team1Id)
                      ?.name || 'TBD'
              team2Name =
                item.game.id == undefined
                  ? 'TBD'
                  : teams?.find((team) => team.id === item.game.team2Id)
                      ?.name || 'TBD'
              score1 = item.game.score1
              score2 = item.game.score2
              rink = item.game.rinkName || 'Unknown Rink'
            } else if (item.type === 'zamboni') {
              team1Name = 'Zamboni Break'
              team2Name = ''
              rink = t('all_rinks')
            }

            if (now >= start && now <= end) {
              gameColor = 'bg-green-100'
            } else if (now < start) {
              gameColor = 'bg-blue-200'
            } else {
              gameColor = 'bg-gray-100'
            }

            return (
              <>
                {item.type === 'game' ? (
                  <Card
                    key={
                      item.type === 'game'
                        ? item.game.id
                        : `zamboni-${
                            (item as { type: 'zamboni'; zamboni: ZamboniTime })
                              .zamboni.id
                          }`
                    }
                    className={`w-full ${gameColor} md:w-lg`}
                    ref={index === scrollToIndex ? scrollRef : null}
                  >
                    <CardContent>
                      <p className='font-bold'>{item.game.name}</p>
                      <p className='font-bold'>
                        {team1Name}
                        {team2Name && ` vs ${team2Name}`}
                      </p>
                      {item.type === 'game' &&
                        score1 !== undefined &&
                        ((now >= start && now <= end) || now > end) && (
                          <p className='text-xl font-bold'>
                            {item.game.status !== 'SCHEDULED' && (
                              <>
                                {score1} : {score2}
                              </>
                            )}
                          </p>
                        )}
                      <p className='text-sm text-gray-600'>
                        {format(
                          start.toLocaleString('sk-SK', { timeZone: 'CET' }),
                          'yyyy-MM-dd',
                        )}
                      </p>
                      <p>
                        {format(
                          start.toLocaleString('sk-SK', { timeZone: 'CET' }),
                          'HH:mm',
                        )}{' '}
                        @ {rink}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card
                    key={`zamboni-${item.zamboni.id}`}
                    className={`w-full bg-white`}
                    ref={index === scrollToIndex ? scrollRef : null}
                  >
                    <CardContent>
                      <p>{t('zamboni_break')}</p>
                      <p className='text-sm text-gray-600'>
                        {format(
                          start.toLocaleString('sk-SK', { timeZone: 'CET' }),
                          'yyyy-MM-dd',
                        )}
                      </p>
                      <p>
                        {format(
                          start.toLocaleString('sk-SK', { timeZone: 'CET' }),
                          'HH:mm',
                        )}{' '}
                        -{' '}
                        {format(
                          end.toLocaleString('sk-SK', { timeZone: 'CET' }),
                          'HH:mm',
                        )}{' '}
                        @ {rink}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            )
          })}
      </div>
    </>
  )
}
