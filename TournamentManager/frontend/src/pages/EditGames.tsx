import { NavbarEdit } from '@/components/Navbar/NavbarEdit'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useParams } from 'react-router-dom'
import {
  useGames,
  useGameEdit,
  useGameCreate,
  useGameDelete,
} from '@/hooks/useGame'
import { useTranslation } from 'react-i18next'
import { Game, GameStatus } from '@/types/game'
import { useTournamentAuth } from '@/components/Auth/TournamentAuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useTeams } from '@/hooks/useTeam'
import { Team } from '@/types/team'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'

export default function EditGames() {
  const { t } = useTranslation()
  const { tournamentId } = useParams<{ tournamentId: string }>()
  const { data: games, isLoading, error } = useGames(tournamentId ?? '')
  const { mutate: updateGame } = useGameEdit()
  const { mutate: createGame } = useGameCreate()
  const { mutate: deleteGame } = useGameDelete()
  const { isAuthenticated } = useTournamentAuth()
  const { data: teams } = useTeams(tournamentId ?? '')
  const navigate = useNavigate()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editGame, setEditGame] = useState<Game | null>(null)
  const [team1Id, setTeam1Id] = useState<string>('')
  const [team2Id, setTeam2Id] = useState<string>('')
  const [startTime, setStartTime] = useState<string>('')

  // State for creating a new game
  const [createOpen, setCreateOpen] = useState(false)
  const [newTeam1Id, setNewTeam1Id] = useState('')
  const [newTeam2Id, setNewTeam2Id] = useState('')
  const [newStartTime, setNewStartTime] = useState('')

  useEffect(() => {
    if (!isAuthenticated(tournamentId ?? '')) {
      navigate(`/${tournamentId}/enter-password`)
    }
  }, [isAuthenticated, navigate, tournamentId])

  if (!isAuthenticated(tournamentId ?? '')) return null

  if (!teams) {
    return <div>Loading teams...</div>
  }

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

  const handleEditClick = (game: Game) => {
    setEditGame(game)
    setTeam1Id(game.team1Id ?? '')
    setTeam2Id(game.team2Id ?? '')
    setStartTime(
      game.date ? new Date(game.date).toISOString().slice(0, 16) : '',
    )
    setDrawerOpen(true)
  }

  const handleDrawerSave = () => {
    if (!editGame) return
    updateGame({
      ...editGame,
      team1Id,
      team2Id,
      date: startTime ? new Date(startTime).toISOString() : editGame.date,
    })
    setDrawerOpen(false)
  }

  const handleCreateGame = () => {
    if (!newTeam1Id || !newTeam2Id || !newStartTime) return
    createGame({
      team1Id: newTeam1Id,
      team2Id: newTeam2Id,
      tournamentId: tournamentId ?? '',
      date: new Date(newStartTime).toISOString(),
      status: GameStatus.SCHEDULED,
      score1: 0,
      score2: 0,
    })
    setCreateOpen(false)
    setNewTeam1Id('')
    setNewTeam2Id('')
    setNewStartTime('')
  }

  if (isLoading) return <div>Loading games...</div>
  if (error) return <div>Error: {(error as Error).message}</div>
  if (!games) return <div>No games found.</div>

  return (
    <div className='max-w-xl mx-auto my-16 flex flex-col items-center w-full'>
      <NavbarEdit />
      <h2 className='text-2xl font-bold mb-2'>{t('edit_games')}</h2>
      {/* Button to create a new game */}
      <Button className='mb-2' onClick={() => setCreateOpen(true)}>
        {t('create_new_game')}
      </Button>
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
            <div className='flex gap-2 mt-2'>
              <Button
                variant='outline'
                onClick={() => handleEditClick(game)}
                className='flex-1'
              >
                <FontAwesomeIcon icon={faEdit} /> {t('edit')}
              </Button>
              <Button
                variant='outline'
                className='flex-1'
                onClick={() =>
                  deleteGame({ id: game.id, tournamentId: game.tournamentId })
                }
              >
                <FontAwesomeIcon icon={faTrash} /> {t('delete')}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Drawer for editing a game */}
      <Dialog open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('edit_game')}</DialogTitle>
          </DialogHeader>
          <div className='flex flex-col gap-4 p-4'>
            <label>{t('team1')}</label>
            <Select value={team1Id} onValueChange={setTeam1Id}>
              <SelectTrigger>
                <SelectValue placeholder={t('select_team1')} />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team: Team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <label>{t('team2')}</label>
            <Select value={team2Id} onValueChange={setTeam2Id}>
              <SelectTrigger>
                <SelectValue placeholder={t('select_team2')} />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team: Team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <label>{t('start_time')}</label>
            <Input
              type='datetime-local'
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <Button className='mt-4' onClick={handleDrawerSave}>
              {t('save')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Drawer for creating a new game */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('create_new_game')}</DialogTitle>
          </DialogHeader>
          <div className='flex flex-col items-center justify-center gap-4 p-4'>
            <Label>Team 1</Label>
            <Select value={newTeam1Id} onValueChange={setNewTeam1Id}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder={t('select_team')} />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label>Team 2</Label>
            <Select value={newTeam2Id} onValueChange={setNewTeam2Id}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder={t('select_team')} />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label>{t('start_time')}</Label>
            <Input
              type='datetime-local'
              value={newStartTime}
              onChange={(e) => setNewStartTime(e.target.value)}
            />
            <Button className='mt-4' onClick={handleCreateGame}>
              {t('save')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
