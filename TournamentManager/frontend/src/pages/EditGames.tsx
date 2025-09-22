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
import { DialogTrigger } from '@radix-ui/react-dialog'
import { toast } from 'sonner'
import { useRinks } from '@/hooks/useRinks'
import { Rink } from '@/types/rink'

export default function EditGames() {
  const { t } = useTranslation()
  const { tournamentId } = useParams<{ tournamentId: string }>()
  const { data: games, isLoading, error } = useGames(tournamentId ?? '')
  const { mutate: updateGame } = useGameEdit()
  const { mutate: createGame } = useGameCreate()
  const { mutate: deleteGame } = useGameDelete()
  const { data: rinks } = useRinks(tournamentId ?? '')
  const { isAuthenticated } = useTournamentAuth()
  const { data: teams } = useTeams(tournamentId ?? '')
  const navigate = useNavigate()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editGame, setEditGame] = useState<Game | null>(null)
  const [team1Id, setTeam1Id] = useState<string>('')
  const [team2Id, setTeam2Id] = useState<string>('')
  const [startTime, setStartTime] = useState<string>('')
  const [rinkId, setRinkId] = useState<string>('')

  // State for creating a new game
  const [createOpen, setCreateOpen] = useState(false)
  const [newTeam1Id, setNewTeam1Id] = useState('')
  const [newTeam2Id, setNewTeam2Id] = useState('')
  const [newStartTime, setNewStartTime] = useState('')
  const [newRinkId, setNewRinkId] = useState('')

  // Score state for editing and creating
  const [editScore1, setEditScore1] = useState<number>(0)
  const [editScore2, setEditScore2] = useState<number>(0)
  const [newScore1, setNewScore1] = useState<number>(0)
  const [newScore2, setNewScore2] = useState<number>(0)

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
    updateGame(
      {
        ...game,
        score1: team === 'team1' ? game.score1 + delta : game.score1,
        score2: team === 'team2' ? game.score2 + delta : game.score2,
      },
      {
        onError: (error: Error) => {
          toast.error('Error: ' + error.message)
        },
      },
    )
  }

  const handleEditClick = (game: Game) => {
    setEditGame(game)
    setTeam1Id(game.team1Id ?? '')
    setTeam2Id(game.team2Id ?? '')
    setStartTime(
      game.date ? new Date(game.date).toISOString().slice(0, 16) : '',
    )
    setEditScore1(game.score1 ?? 0)
    setEditScore2(game.score2 ?? 0)
    setRinkId(game.rinkId ?? '')
    setDrawerOpen(true)
  }

  const handleDrawerSave = () => {
    if (!editGame) return
    updateGame(
      {
        ...editGame,
        team1Id,
        team2Id,
        date: startTime ? new Date(startTime).toISOString() : editGame.date,
        score1: editScore1,
        score2: editScore2,
        rinkId: rinkId,
      },
      {
        onSuccess: () => {
          setDrawerOpen(false)
          toast.success(t('game_updated'))
        },
        onError: (error: Error) => {
          toast.error('Error: ' + error.message)
        },
      },
    )
  }

  const handleCreateGame = () => {
    if (!newTeam1Id || !newTeam2Id || !newStartTime) return
    createGame(
      {
        team1Id: newTeam1Id,
        team2Id: newTeam2Id,
        tournamentId: tournamentId ?? '',
        date: new Date(newStartTime).toISOString(),
        status: GameStatus.SCHEDULED,
        score1: newScore1,
        score2: newScore2,
        rinkId: newRinkId,
      },
      {
        onSuccess: () => {
          setCreateOpen(false)
          setNewTeam1Id('')
          setNewTeam2Id('')
          setNewStartTime('')
          setNewScore1(0)
          setNewScore2(0)
          toast.success(t('game_created'))
        },
        onError: (error: Error) => {
          toast.error('Error: ' + error.message)
        },
      },
    )
  }

  if (isLoading) return <div>Loading games...</div>
  if (error) return <div>Error: {(error as Error).message}</div>
  if (!games) return <div>No games found.</div>

  return (
    <div className='flex flex-col gap-3 mb-16 items-center'>
      <NavbarEdit />
      <h2 className='text-2xl font-bold mb-2'>{t('edit_games')}</h2>
      {/* Button to create a new game */}
      <Button className='mb-2' onClick={() => setCreateOpen(true)}>
        {t('create_new_game')}
      </Button>
      {Array.isArray(games) &&
        games.map((game: Game) => (
          <Card key={game.id} className='w-full max-w-xl md:w-lg'>
            <CardContent className='flex flex-col gap-2'>
              <span className='font-semibold'>
                <p className='font-bold'>
                  {(() => {
                    const idx = games.findIndex((g) => g.id === game.id)
                    return idx >= 0 ? `${idx + 1}. ` : ''
                  })()}
                  {game.name}
                </p>
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
                {game.team1?.name || game.team1Id} vs{' '}
                {game.team2?.name || game.team2Id}{' '}
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
                    <Input
                      type='number'
                      min={0}
                      value={game.score1}
                      onChange={(e) =>
                        updateGame({
                          ...game,
                          score1: Number(e.target.value),
                        })
                      }
                      className='w-16 text-center'
                    />
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
                    <Input
                      type='number'
                      min={0}
                      value={game.score2}
                      onChange={(e) =>
                        updateGame({
                          ...game,
                          score2: Number(e.target.value),
                        })
                      }
                      className='w-16 text-center'
                    />
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
                {new Date(game.date).toLocaleString('sk-SK', {
                  timeZone: 'CET',
                })}
              </span>
              {game.status === GameStatus.SCHEDULED && (
                <Button
                  onClick={() =>
                    updateGame({ ...game, status: GameStatus.LIVE })
                  }
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant='outline' className='flex-1'>
                      <FontAwesomeIcon icon={faTrash} /> {t('delete')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader className='flex items-center mb-8'>
                      <DialogTitle>{t('confirm_delete')}</DialogTitle>
                    </DialogHeader>
                    <div className='flex gap-2 w-full'>
                      <Button
                        variant='destructive'
                        className='flex-1'
                        onClick={() => {
                          deleteGame({
                            id: game.id,
                            tournamentId: game.tournamentId,
                          })
                          close()
                        }}
                      >
                        {t('confirm')}
                      </Button>
                      <Button onClick={close} className='flex-1'>
                        {t('cancel')}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}

      {/* Drawer for editing a game */}
      <Dialog open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-center'>{t('edit_game')}</DialogTitle>
          </DialogHeader>
          <div className='flex flex-col justify-center items-center gap-2 p-4'>
            <Label className='text-left w-full ml-2'>Team 1</Label>
            <Select value={team1Id} onValueChange={setTeam1Id}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder={t('select_team1')} />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(teams) &&
                  teams.map((team: Team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Label className='text-left w-full ml-2 mt-2'>Team 2</Label>
            <Select value={team2Id} onValueChange={setTeam2Id}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder={t('select_team2')} />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(teams) &&
                  teams.map((team: Team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Label className='text-left w-full ml-2 mt-2'>
              {t('select_rink')}
            </Label>
            <Select value={rinkId} onValueChange={setRinkId}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder={t('select_rink')} />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(rinks) &&
                  rinks.map((rink: Rink) => (
                    <SelectItem key={rink.id} value={rink.id}>
                      {rink.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Label className='text-left w-full ml-2 mt-2'>
              {t('start_time')}
            </Label>
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
            <DialogTitle className='text-center'>
              {t('create_new_game')}
            </DialogTitle>
          </DialogHeader>
          <div className='flex flex-col justify-center items-center gap-2 p-4'>
            <Label className='text-left w-full ml-2'>Team 1</Label>
            <Select value={newTeam1Id} onValueChange={setNewTeam1Id}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder={t('select_team')} />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(teams) &&
                  teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Label className='text-left w-full ml-2 mt-2'>Team 2</Label>
            <Select value={newTeam2Id} onValueChange={setNewTeam2Id}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder={t('select_team')} />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(teams) &&
                  teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Label className='text-left w-full ml-2 mt-2'>
              {t('select_rink')}
            </Label>
            <Select value={newRinkId} onValueChange={setNewRinkId}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder={t('select_rink')} />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(rinks) &&
                  rinks.map((rink) => (
                    <SelectItem key={rink.id} value={rink.id}>
                      {rink.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Label className='text-left w-full ml-2 mt-2'>
              {t('start_time')}
            </Label>
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
