import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useGames } from '@/hooks/useGame'
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

export default function Schedule() {
  const { tournamentId } = useParams<{ tournamentId: string }>()
  const {
    data: games,
    isLoading: gamesLoading,
    error: gamesError,
  } = useGames(tournamentId ?? '')
  const {
    data: teams,
    isLoading: teamsLoading,
    error: teamsError,
  } = useTeams(tournamentId ?? '')
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

  const sortedGames = [...(games ?? [])].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )

  const filteredGames = selectedTeamId
    ? sortedGames.filter(
        (game) =>
          game.team1Id === selectedTeamId || game.team2Id === selectedTeamId,
      )
    : sortedGames

  const scrollToIndex = filteredGames.findIndex((game) => {
    const start = new Date(game.date)
    const end = new Date(start.getTime() + GAME_DURATION_MINUTES * 60_000)
    return (now >= start && now <= end) || now < start
  })

  return (
    <>
      <div className='mb-4 fixed top-4 left-14 right-0'>
        <Select
          onValueChange={(value) =>
            setSelectedTeamId(value === 'all' ? null : value)
          }
        >
          <SelectTrigger className='w-[300px] h-12 text-lg border-2 border-blue-400 rounded-lg shadow-md hover:border-blue-600 transition-colors duration-200 text-gray-300'>
            <SelectValue placeholder='Filter by team' />
          </SelectTrigger>
          <SelectContent className='bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto'>
            <SelectItem
              value='all'
              className='text-base py-2 px-4 hover:bg-blue-50 cursor-pointer rounded-md font-semibold text-blue-700'
            >
              All teams
            </SelectItem>
            {teams?.map((team) => (
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

      <div className='flex flex-col gap-2 mb-16 mt-4'>
        <h1 className='text-4xl font-bold mb-4'>Schedule</h1>
        {filteredGames.length === 0 && (
          <p className='text-gray-500'>No games found for selected team.</p>
        )}
        {filteredGames.map((game, index) => {
          const start = new Date(game.date)
          const end = new Date(start.getTime() + GAME_DURATION_MINUTES * 60_000)
          let gameColor = ''
          const team1Name =
            teams?.find((team) => team.id === game.team1Id)?.name ||
            'Unknown Team 1'
          const team2Name =
            teams?.find((team) => team.id === game.team2Id)?.name ||
            'Unknown Team 2'

          if (now >= start && now <= end) {
            gameColor = 'bg-green-100'
          } else if (now < start) {
            gameColor = 'bg-blue-200'
          } else {
            gameColor = 'bg-gray-100'
          }

          return (
            <Card
              key={game.id}
              className={`w-full ${gameColor}`}
              ref={index === scrollToIndex ? scrollRef : null}
            >
              <CardContent>
                <p>
                  {team1Name} vs {team2Name}
                </p>
                {game.score1 !== undefined &&
                  ((now >= start && now <= end) || now > end) && (
                    <p className='text-xl font-bold'>
                      {game.score1} : {game.score2}
                    </p>
                  )}
                <p className='text-sm text-gray-600'>
                  {format(start, 'yyyy-MM-dd')}
                </p>
                <p>
                  {format(start, 'HH:mm')} @ {game.rink}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  )
}
