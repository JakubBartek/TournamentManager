import { NavbarEdit } from '@/components/Navbar/NavbarEdit'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useParams } from 'react-router-dom'
import { useGames, useGameEdit } from '@/hooks/useGame'
import { useTranslation } from 'react-i18next'
import { Game, GameStatus } from '@/types/game'
import { useTournamentAuth } from '@/components/Auth/TournamentAuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function EditGames() {
  const { t } = useTranslation()
  const { tournamentId } = useParams<{ tournamentId: string }>()
  const { data: games, isLoading, error } = useGames(tournamentId ?? '')
  const { mutate: updateGame } = useGameEdit()
  const { isAuthenticated } = useTournamentAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated(tournamentId ?? '')) {
      navigate(`/${tournamentId}/enter-password`)
    }
  }, [isAuthenticated, navigate, tournamentId])

  if (!isAuthenticated(tournamentId ?? '')) return null

  const handleScoreChange = (
    game: Game,
    team: 'team1' | 'team2',
    delta: number,
  ) => {
    updateGame({
      ...game,
      score1: team === 'team1' ? game.score1 + delta : game.score1,
      score2: team === 'team2' ? game.score2 + delta : game.score2,
    })
  }

  if (isLoading) return <div>Loading games...</div>
  if (error) return <div>Error: {(error as Error).message}</div>
  if (!games) return <div>No games found.</div>

  return (
    <div className='max-w-xl mx-auto my-16 flex flex-col items-center w-full'>
      <NavbarEdit />
      <h2 className='text-2xl font-bold mb-6'>{t('edit_games')}</h2>
      {games.map((game: Game) => (
        <Card key={game.id} className='w-full mb-4'>
          <CardContent className='flex flex-col gap-2'>
            <span className='font-semibold'>
              {game.team1?.name || game.team1Id} vs{' '}
              {game.team2?.name || game.team2Id}
            </span>
            <div className='flex justify-center items-center gap-8'>
              <div className='flex flex-col items-center'>
                <div className='flex items-center gap-2'>
                  <Button
                    size='sm'
                    className='w-10 h-10'
                    onClick={() => handleScoreChange(game, 'team1', -1)}
                    disabled={game.score1 <= 0}
                  >
                    -
                  </Button>
                  <span className='text-xl font-bold'>{game.score1}</span>
                  <Button
                    size='sm'
                    className='w-10 h-10'
                    onClick={() => handleScoreChange(game, 'team1', 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              <div className='flex flex-col items-center'>
                <div className='flex items-center gap-2'>
                  <Button
                    size='sm'
                    className='w-10 h-10'
                    onClick={() => handleScoreChange(game, 'team2', -1)}
                    disabled={game.score2 <= 0}
                  >
                    -
                  </Button>
                  <span className='text-xl font-bold'>{game.score2}</span>
                  <Button
                    size='sm'
                    className='w-10 h-10'
                    onClick={() => handleScoreChange(game, 'team2', 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
            <span className='text-sm text-gray-500'>
              {new Date(game.date).toLocaleString()}
            </span>
            {game.status === GameStatus.SCHEDULED && (
              <Button
                onClick={() => updateGame({ ...game, status: GameStatus.LIVE })}
              >
                {t('start_game')}
              </Button>
            )}
            {game.status === GameStatus.LIVE && (
              <Button
                onClick={() =>
                  updateGame({ ...game, status: GameStatus.FINISHED })
                }
              >
                {t('end_game')}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
