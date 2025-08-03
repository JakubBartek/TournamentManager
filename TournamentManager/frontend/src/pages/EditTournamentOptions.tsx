import { NavbarEdit } from '@/components/Navbar/NavbarEdit'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useTournamentEdit } from '@/hooks/useTournament'
import { useTournament } from '@/hooks/useTournament'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

export default function EditTournamentOptions() {
  const { tournamentId } = useParams()
  const { mutate: updateTournament } = useTournamentEdit()
  const { data: tournament } = useTournament(tournamentId || '')
  const site_location = useLocation()
  const navigate = useNavigate()
  const fromCreate = site_location.state?.fromEditRinks
  // Form state for tournament options
  const [gameDuration, setGameDuration] = useState(20)
  const [breakDuration, setBreakDuration] = useState(5)
  const [zamboniDuration, setZamboniDuration] = useState(10)
  const [zamboniInterval, setZamboniInterval] = useState(10)
  const [tournamentName, setTournamentName] = useState('')
  const [tournamentLocation, setTournamentLocation] = useState('')
  const [tournamentStartDate, setTournamentStartDate] = useState(new Date())
  const [tournamentEndDate, setTournamentEndDate] = useState(new Date())
  const [adminPassword, setAdminPassword] = useState('')
  const [dailyStartTime, setDailyStartTime] = useState('')
  const [dailyEndTime, setDailyEndTime] = useState('')
  const [tournamentStartDateWasSet, setTournamentStartDateWasSet] =
    useState(false)
  const [tournamentEndDateWasSet, setTournamentEndDateWasSet] = useState(false)

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
        gameDuration: gameDuration || tournament?.gameDuration || 20,
        breakDuration: breakDuration || tournament?.breakDuration || 5,
        zamboniDuration: zamboniDuration || tournament?.zamboniDuration || 10,
        zamboniInterval: zamboniInterval || tournament?.zamboniInterval || 10,
        dailyStartTime: dailyStartTime || tournament?.dailyStartTime || '09:00',
        dailyEndTime: dailyEndTime || tournament?.dailyEndTime || '18:00',
      },
      {
        onSuccess: () => {
          if (fromCreate) {
            navigate(`/${tournamentId}/edit/schedule`, {
              state: { fromOptions: true },
            })
          }
        },
      },
    )
  }

  return (
    <div className='max-w-xl mx-auto my-16 flex flex-col items-center w-full'>
      <NavbarEdit />
      {fromCreate && (
        <h2 className='text-xl font-bold'>4. Adjust tournament options</h2>
      )}
      <Card className='w-full mt-8 shadow-lg'>
        <CardContent>
          <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
            {!fromCreate && (
              <div>
                <label className='flex flex-col gap-1'>
                  <span className='text-sm font-medium text-gray-700'>
                    Tournament Name
                  </span>
                  <Input
                    type='text'
                    id='tournamentName'
                    name='tournamentName'
                    placeholder='Enter tournament name'
                    value={tournamentName}
                    onChange={(e) => setTournamentName(e.target.value)}
                  />
                </label>
                <label className='flex flex-col gap-1'>
                  <span className='text-sm font-medium text-gray-700'>
                    Tournament Location
                  </span>
                  <Input
                    type='text'
                    id='tournamentLocation'
                    name='tournamentLocation'
                    placeholder='Enter tournament location'
                    value={tournamentLocation}
                    onChange={(e) => setTournamentLocation(e.target.value)}
                  />
                </label>
                <label className='flex flex-col gap-1'>
                  <span className='text-sm font-medium text-gray-700'>
                    Tournament Start Date
                  </span>
                  <Input
                    type='date'
                    id='tournamentStartDate'
                    name='tournamentStartDate'
                    placeholder='Enter tournament start date'
                    value={tournamentStartDate.toISOString().split('T')[0]}
                    onChange={(e) => {
                      setTournamentStartDate(new Date(e.target.value))
                      setTournamentStartDateWasSet(true)
                    }}
                  />
                </label>
                <label className='flex flex-col gap-1'>
                  <span className='text-sm font-medium text-gray-700'>
                    Tournament End Date
                  </span>
                  <Input
                    type='date'
                    id='tournamentEndDate'
                    name='tournamentEndDate'
                    placeholder='Enter tournament end date'
                    value={tournamentEndDate.toISOString().split('T')[0]}
                    onChange={(e) => {
                      setTournamentEndDate(new Date(e.target.value))
                      setTournamentEndDateWasSet(true)
                    }}
                  />
                </label>
                <label className='flex flex-col gap-1'>
                  <span className='text-sm font-medium text-gray-700'>
                    Admin Password
                  </span>
                  <Input
                    type='password'
                    id='adminPassword'
                    name='adminPassword'
                    placeholder='Enter admin password'
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                  />
                </label>
              </div>
            )}
            <label className='flex flex-col gap-1'>
              <span className='text-sm font-medium text-gray-700'>
                Game Duration (minutes)
              </span>
              <Input
                type='number'
                id='gameDuration'
                name='gameDuration'
                min={0}
                placeholder='Enter game duration'
                value={gameDuration}
                onChange={(e) => setGameDuration(Number(e.target.value))}
              />
            </label>
            <label className='flex flex-col gap-1'>
              <span className='text-sm font-medium text-gray-700'>
                Break Duration (minutes)
              </span>
              <Input
                type='number'
                id='breakDuration'
                name='breakDuration'
                min={0}
                placeholder='Enter break duration'
                value={breakDuration}
                onChange={(e) => setBreakDuration(Number(e.target.value))}
              />
            </label>
            <label className='flex flex-col gap-1'>
              <span className='text-sm font-medium text-gray-700'>
                Zamboni Duration (minutes)
              </span>
              <Input
                type='number'
                id='zamboniDuration'
                name='zamboniDuration'
                min={0}
                placeholder='Enter zamboni duration'
                value={zamboniDuration}
                onChange={(e) => setZamboniDuration(Number(e.target.value))}
              />
            </label>
            <label className='flex flex-col gap-1'>
              <span className='text-sm font-medium text-gray-700'>
                Zamboni Interval (minutes)
              </span>
              <Input
                type='number'
                id='zamboniInterval'
                name='zamboniInterval'
                min={0}
                placeholder='Enter zamboni interval'
                value={zamboniInterval}
                onChange={(e) => setZamboniInterval(Number(e.target.value))}
              />
            </label>
            <label className='flex flex-col gap-1'>
              <span className='text-sm font-medium text-gray-700'>
                Daily Start Time (HH:mm)
              </span>
              <Input
                type='time'
                id='dailyStartTime'
                name='dailyStartTime'
                value={dailyStartTime}
                onChange={(e) => setDailyStartTime(e.target.value)}
              />
            </label>
            <label className='flex flex-col gap-1'>
              <span className='text-sm font-medium text-gray-700'>
                Daily End Time (HH:mm)
              </span>
              <Input
                type='time'
                id='dailyEndTime'
                name='dailyEndTime'
                value={dailyEndTime}
                onChange={(e) => setDailyEndTime(e.target.value)}
              />
            </label>
            <Button type='submit' className='w-full mt-4'>
              Save
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
