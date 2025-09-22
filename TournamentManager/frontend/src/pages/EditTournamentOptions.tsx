import { NavbarEdit } from '@/components/Navbar/NavbarEdit'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useTournamentEdit } from '@/hooks/useTournament'
import { useTournament } from '@/hooks/useTournament'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTournamentAuth } from '@/components/Auth/TournamentAuthContext'
import { toast } from 'sonner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Navbar } from '@material-tailwind/react'

export default function EditTournamentOptions() {
  const { t } = useTranslation()
  const { tournamentId } = useParams()
  const { mutate: updateTournament } = useTournamentEdit()
  const { data: tournament } = useTournament(tournamentId || '')
  const site_location = useLocation()
  const navigate = useNavigate()
  const fromCreate = site_location.state?.fromEditRinks
  // Form state for tournament options
  const [gameDuration, setGameDuration] = useState(0)
  const [breakDuration, setBreakDuration] = useState(0)
  const [zamboniDuration, setZamboniDuration] = useState(0)
  const [zamboniInterval, setZamboniInterval] = useState(0)
  const [tournamentName, setTournamentName] = useState('')
  const [tournamentLocation, setTournamentLocation] = useState('')
  const [tournamentStartDate, setTournamentStartDate] = useState(new Date())
  const [tournamentEndDate, setTournamentEndDate] = useState(new Date())
  const [adminPassword, setAdminPassword] = useState('')
  const [dailyStartTime, setDailyStartTime] = useState(
    tournament?.dailyStartTime,
  )
  const [dailyEndTime, setDailyEndTime] = useState(tournament?.dailyEndTime)
  const [tournamentStartDateWasSet, setTournamentStartDateWasSet] =
    useState(false)
  const [tournamentEndDateWasSet, setTournamentEndDateWasSet] = useState(false)
  const [groupGamesInARow, setGroupGamesInARow] = useState(1)

  const { isAuthenticated } = useTournamentAuth()

  useEffect(() => {
    if (!isAuthenticated(tournamentId ?? '')) {
      navigate(`/${tournamentId}/enter-password`)
    }
  }, [isAuthenticated, navigate, tournamentId])

  useEffect(() => {
    if (tournament) {
      setTournamentName(tournament.name || '')
      setTournamentLocation(tournament.location || '')
      setTournamentStartDate(
        tournament.startDate ? new Date(tournament.startDate) : new Date(),
      )
      setTournamentEndDate(
        tournament.endDate ? new Date(tournament.endDate) : new Date(),
      )
      setGameDuration(tournament.gameDuration ?? 0)
      setBreakDuration(tournament.breakDuration ?? 0)
      setZamboniDuration(tournament.zamboniDuration ?? 0)
      setZamboniInterval(tournament.zamboniInterval ?? 0)
      setDailyStartTime(tournament.dailyStartTime || '09:00')
      setDailyEndTime(tournament.dailyEndTime || '18:00')
      setGroupGamesInARow(tournament.groupGamesInARow || 1)
    }
  }, [tournament])

  if (!isAuthenticated(tournamentId ?? '')) return null

  const handleSubmit = (e: React.FormEvent) => {
    const tournamentStartDateToUse = tournamentStartDateWasSet
      ? tournamentStartDate
      : tournament?.startDate || new Date()
    const tournamentEndDateToUse = tournamentEndDateWasSet
      ? tournamentEndDate
      : tournament?.endDate || new Date()

    e.preventDefault()

    updateTournament(
      {
        id: tournament?.id || '',
        endDate: tournamentEndDateToUse,
        location: tournamentLocation || tournament?.location || '',
        name: tournamentName || tournament?.name || '',
        adminPassword: adminPassword || tournament?.adminPassword || '',
        startDate: tournamentStartDateToUse,
        gameDuration: gameDuration || tournament?.gameDuration || 0,
        breakDuration: breakDuration || tournament?.breakDuration || 0,
        zamboniDuration: zamboniDuration || tournament?.zamboniDuration || 0,
        zamboniInterval: zamboniInterval || tournament?.zamboniInterval || 0,
        dailyStartTime: dailyStartTime || tournament?.dailyStartTime || '09:00',
        dailyEndTime: dailyEndTime || tournament?.dailyEndTime || '18:00',
        groupGamesInARow: groupGamesInARow || tournament?.groupGamesInARow || 1,
      },
      {
        onSuccess: () => {
          if (fromCreate) {
            navigate(`/${tournamentId}/edit/schedule`, {
              state: { fromOptions: true },
            })
          } else {
            navigate(`/${tournamentId}/edit`)
            toast.success(t('tournament_updated'))
          }
        },
        onError: (error: Error) => {
          toast.error('Error: ' + error.message)
        },
      },
    )
  }

  return (
    <div
      className={`flex flex-col gap-3 mb-16 items-center${
        fromCreate ? ' mt-8' : ''
      }`}
    >
      {!fromCreate && <NavbarEdit />}
      {fromCreate && (
        <>
          <div className='fixed top-4 md:top-100 left-0 z-50'>
            {/* @ts-expect-error Suppress missing props warning */}
            <Navbar
              className='bg-white shadow-md px-6 py-3 w-auto rounded-l-none border-gray-400'
              placeholder={undefined}
              onResize={undefined}
              onResizeCapture={undefined}
              onClick={() =>
                navigate(`/${tournamentId}/edit/rinks`, {
                  state: { fromEditTeams: true },
                })
              }
            >
              <div className='flex justify-between items-center w-full px-2 py-2 gap-8 text-3xl'>
                <Button variant='white' size='full'>
                  <FontAwesomeIcon icon={faArrowLeft} />
                </Button>
              </div>
            </Navbar>
          </div>
        </>
      )}
      {fromCreate && (
        <h2 className='text-xl font-bold'>
          4. {t('adjust_tournament_options')}
        </h2>
      )}
      <Card className='w-full max-w-xl md:w-lg'>
        <CardContent>
          <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
            {!fromCreate && (
              <div className='flex flex-col gap-6'>
                <label className='flex flex-col gap-1'>
                  <span className='text-sm font-medium text-gray-700'>
                    {t('tournament_name')}
                  </span>
                  <Input
                    type='text'
                    id='tournamentName'
                    name='tournamentName'
                    placeholder={t('enter_tournament_name')}
                    value={tournamentName}
                    onChange={(e) => setTournamentName(e.target.value)}
                  />
                </label>
                <label className='flex flex-col gap-1'>
                  <span className='text-sm font-medium text-gray-700'>
                    {t('location')}
                  </span>
                  <Input
                    type='text'
                    id='tournamentLocation'
                    name='tournamentLocation'
                    placeholder={t('enter_location')}
                    value={tournamentLocation}
                    onChange={(e) => setTournamentLocation(e.target.value)}
                  />
                </label>
                <label className='flex flex-col gap-1'>
                  <span className='text-sm font-medium text-gray-700'>
                    {t('tournament_start_date')}
                  </span>
                  <Input
                    type='date'
                    id='tournamentStartDate'
                    name='tournamentStartDate'
                    placeholder={t('enter_tournament_start_date')}
                    value={tournamentStartDate.toISOString().split('T')[0]}
                    onChange={(e) => {
                      setTournamentStartDate(new Date(e.target.value))
                      setTournamentStartDateWasSet(true)
                    }}
                  />
                </label>
                <label className='flex flex-col gap-1'>
                  <span className='text-sm font-medium text-gray-700'>
                    {t('tournament_end_date')}
                  </span>
                  <Input
                    type='date'
                    id='tournamentEndDate'
                    name='tournamentEndDate'
                    placeholder={t('enter_tournament_end_date')}
                    value={tournamentEndDate.toISOString().split('T')[0]}
                    onChange={(e) => {
                      setTournamentEndDate(new Date(e.target.value))
                      setTournamentEndDateWasSet(true)
                    }}
                  />
                </label>
                <label className='flex flex-col gap-1'>
                  <span className='text-sm font-medium text-gray-700'>
                    {t('admin_password')}
                  </span>
                  <Input
                    type='password'
                    id='adminPassword'
                    name='adminPassword'
                    placeholder={t('enter_admin_password')}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                  />
                </label>
              </div>
            )}
            <label className='flex flex-col gap-1'>
              <span className='text-sm font-medium text-gray-700'>
                {t('game_duration_minutes')}
              </span>
              <Input
                type='number'
                id='gameDuration'
                name='gameDuration'
                min={0}
                placeholder={t('enter_game_duration')}
                value={gameDuration}
                onChange={(e) => setGameDuration(Number(e.target.value))}
              />
            </label>
            <label className='flex flex-col gap-1'>
              <span className='text-sm font-medium text-gray-700'>
                {t('break_duration_minutes')}
              </span>
              <Input
                type='number'
                id='breakDuration'
                name='breakDuration'
                min={0}
                placeholder={t('enter_break_duration')}
                value={breakDuration}
                onChange={(e) => setBreakDuration(Number(e.target.value))}
              />
            </label>
            <label className='flex flex-col gap-1'>
              <span className='text-sm font-medium text-gray-700'>
                {t('zamboni_duration_minutes')}
              </span>
              <Input
                type='number'
                id='zamboniDuration'
                name='zamboniDuration'
                min={0}
                placeholder={t('enter_zamboni_duration')}
                value={zamboniDuration}
                onChange={(e) => setZamboniDuration(Number(e.target.value))}
              />
            </label>
            <label className='flex flex-col gap-1'>
              <span className='text-sm font-medium text-gray-700'>
                {t('zamboni_interval_minutes')}
              </span>
              <Input
                type='number'
                id='zamboniInterval'
                name='zamboniInterval'
                min={0}
                placeholder={t('enter_zamboni_interval')}
                value={zamboniInterval}
                onChange={(e) => setZamboniInterval(Number(e.target.value))}
              />
            </label>
            <label className='flex flex-col gap-1'>
              <span className='text-sm font-medium text-gray-700'>
                {t('daily_start_time')}
              </span>
              <Input
                type='time'
                id='dailyStartTime'
                name='dailyStartTime'
                value={dailyStartTime || '09:00'}
                onChange={(e) => setDailyStartTime(e.target.value)}
              />
            </label>
            <label className='flex flex-col gap-1'>
              <span className='text-sm font-medium text-gray-700'>
                {t('daily_end_time')}
              </span>
              <Input
                type='time'
                id='dailyEndTime'
                name='dailyEndTime'
                value={dailyEndTime || '16:00'}
                onChange={(e) => setDailyEndTime(e.target.value)}
              />
            </label>
            <label className='flex flex-col gap-1'>
              <span className='text-sm font-medium text-gray-700'>
                {t('group_games_in_a_row')}
              </span>
              <Input
                type='number'
                id='groupGamesInARow'
                name='groupGamesInARow'
                min={1}
                placeholder={t('enter_group_games_in_a_row')}
                value={groupGamesInARow}
                onChange={(e) => setGroupGamesInARow(Number(e.target.value))}
              />
            </label>
            <Button type='submit' className='w-full mt-4'>
              {t('save')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
