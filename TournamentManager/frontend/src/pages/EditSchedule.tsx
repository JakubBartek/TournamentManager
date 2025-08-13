import { NavbarEdit } from '@/components/Navbar/NavbarEdit'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState, useMemo, useEffect } from 'react'
import { useTournament, useTournamentEdit } from '@/hooks/useTournament'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useTeams } from '@/hooks/useTeam'
import { TournamentType } from '@/types/tournament'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { useTournamentCreateSchedule } from '@/hooks/useTournament'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { useTournamentAuth } from '@/components/Auth/TournamentAuthContext'
import { useGroupDelete, useGroups } from '@/hooks/useGroup'
import { useGameDelete, useGames } from '@/hooks/useGame'
import { useZamboniTimeDelete, useZamboniTimes } from '@/hooks/useZamboniTime'

export default function EditSchedule() {
  const { t } = useTranslation()
  const location = useLocation()
  const fromCreate = location.state?.fromOptions
  const navigate = useNavigate()
  const { mutate: createSchedule } = useTournamentCreateSchedule()
  const { mutate: editTournament } = useTournamentEdit()
  const { tournamentId } = useParams<{ tournamentId: string }>()
  const { data: tournament } = useTournament(tournamentId || '')
  const { mutate: deleteGame } = useGameDelete()
  const { mutate: deleteZamboniTime } = useZamboniTimeDelete()
  const { data: teams } = useTeams(tournamentId ?? '')
  const { mutate: deleteGroup } = useGroupDelete(tournamentId || '')
  const {
    data: games,
    isLoading: gamesLoading,
    error: gamesError,
  } = useGames(tournamentId ?? '')
  const { data: zamboniTimes } = useZamboniTimes(tournamentId || '')
  const {
    data: groups,
    isLoading: groupsLoading,
    error: groupsError,
  } = useGroups(tournamentId || '')
  const [tournamentType, setTournamentType] = useState(
    tournament?.type || TournamentType.GROUPS,
  )
  const [schedulingMethod, setSchedulingMethod] = useState('option-one')
  const [groupCount, setGroupCount] = useState(2)

  // Manual group assignment state
  const [manualGroups, setManualGroups] = useState<Record<number, string[]>>({})

  const { isAuthenticated } = useTournamentAuth()

  // Compute unassigned teams for manual assignment
  const unassignedTeams = useMemo(() => {
    if (!teams) return []
    const assigned = Object.values(manualGroups).flat()
    return teams.filter((team) => !assigned.includes(team.id))
  }, [teams, manualGroups])

  useEffect(() => {
    if (!isAuthenticated(tournamentId ?? '')) {
      navigate(`/${tournamentId}/enter-password`)
    }
  }, [isAuthenticated, navigate, tournamentId])

  if (!isAuthenticated(tournamentId ?? '')) return null
  const handleAssignTeam = (groupIdx: number, teamId: string) => {
    setManualGroups((prev) => {
      const updated = { ...prev }
      // Remove team from all groups first
      Object.keys(updated).forEach((g) => {
        updated[Number(g)] = updated[Number(g)].filter((id) => id !== teamId)
      })
      // Add to selected group
      updated[groupIdx] = [...(updated[groupIdx] || []), teamId]
      return updated
    })
  }

  const handleRemoveTeam = (groupIdx: number, teamId: string) => {
    setManualGroups((prev) => ({
      ...prev,
      [groupIdx]: (prev[groupIdx] || []).filter((id) => id !== teamId),
    }))
  }

  const handleCreateGroupStagePairings = async () => {
    // If manual, pass manualGroups as assignment
    editTournament({
      id: tournament?.id || '',
      type: tournamentType,
      name: tournament?.name || '',
      gameDuration: tournament?.gameDuration || 30,
      startDate: tournament?.startDate || new Date(),
      endDate: tournament?.endDate || new Date(),
      location: tournament?.location || '',
    })
    createSchedule(
      {
        tournamentId: tournament?.id || '',
        numberOfGroups: groupCount,
        autoCreate: schedulingMethod === 'option-one',
        manualGroups:
          schedulingMethod === 'option-two'
            ? Object.entries(manualGroups).flatMap(([groupIdx, teamIds]) =>
                teamIds.map((teamId) => ({
                  groupNumber: Number(groupIdx) + 1,
                  teamId,
                })),
              )
            : undefined,
      },
      {
        onSuccess: () => {
          navigate(`/${tournamentId}/schedule`, {
            state: { fromCreate: true },
          })
          toast.success(
            'Group stage pairings created successfully! You can edit them later.',
          )
        },
      },
    )
  }

  if (
    gamesError ||
    gamesLoading ||
    groupsError ||
    groupsLoading ||
    !tournamentId
  ) {
    return (
      <div>
        {gamesLoading && <p>Loading games...</p>}
        {gamesError && <p>Error loading games</p>}
        {groupsLoading && <p>Loading groups...</p>}
        {groupsError && <p>Error loading groups</p>}
      </div>
    )
  }

  return (
    <div className='max-w-xl mx-auto my-16 flex flex-col items-center w-full'>
      <NavbarEdit />
      <h2 className='text-xl font-bold'>
        {fromCreate && t('5_create_schedule')}
      </h2>
      <Card className='w-full mt-4 shadow-lg'>
        <CardContent>
          <Select>
            <SelectTrigger className='w-full font-bold'>
              <SelectValue placeholder={t('select_tournament_type')} />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(Object.values(TournamentType)) &&
                Object.values(TournamentType).map((type) => (
                  <SelectItem
                    key={type}
                    value={type}
                    onClick={() => setTournamentType(type)}
                  >
                    {type.replace(/_/g, ' ')}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {tournamentType !== TournamentType.GROUPS_AND_PLAYOFFS && (
            <>
              <Select>
                <SelectTrigger className='w-full font-bold mt-6'>
                  <SelectValue placeholder={t('select_number_of_groups')} />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <SelectItem
                      key={num}
                      value={`group-${num}`}
                      onClick={() => setGroupCount(num)}
                    >
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
          <h3 className='text-m font-semibold mt-4'>
            {t('choose_scheduling_method')}
          </h3>
          <p className='text-xs text-gray-500'>{t('edit_schedule_later')}</p>
          <RadioGroup
            value={schedulingMethod}
            onValueChange={setSchedulingMethod}
          >
            <div className='flex items-center space-x-2 mt-2 justify-center gap-8'>
              <div>
                <RadioGroupItem value='option-one' id='option-one' />
                <Label htmlFor='option-one'>{t('auto_schedule')}</Label>
              </div>
              <div>
                <RadioGroupItem value='option-two' id='option-two' />
                <Label htmlFor='option-two'>{t('manual_schedule')}</Label>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
      {/* Manual group assignment UI */}
      {schedulingMethod === 'option-two' && teams && (
        <div className='w-full mt-8 flex flex-col gap-6'>
          {[...Array(groupCount)].map((_, groupIdx) => (
            <Card key={groupIdx} className='w-full shadow-md'>
              <CardContent>
                <h3 className='font-bold mb-2'>
                  {t('group')} {groupIdx + 1}
                </h3>
                <div className='flex flex-wrap gap-2 mb-2'>
                  {(manualGroups[groupIdx] || []).map((teamId) => {
                    const team = teams.find((t) => t.id === teamId)
                    return (
                      <span
                        key={teamId}
                        className='px-2 py-1 bg-blue-100 rounded font-semibold flex items-center gap-2'
                      >
                        {team?.name || teamId}
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => handleRemoveTeam(groupIdx, teamId)}
                        >
                          ×
                        </Button>
                      </span>
                    )
                  })}
                </div>
                <Select
                  onValueChange={(teamId) => handleAssignTeam(groupIdx, teamId)}
                >
                  <SelectTrigger className='w-full font-bold'>
                    <SelectValue placeholder={t('add_team_to_group')} />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(unassignedTeams) &&
                      unassignedTeams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {fromCreate && (
        <Button
          className='mt-4'
          onClick={handleCreateGroupStagePairings}
          disabled={
            schedulingMethod === 'option-two' && unassignedTeams.length > 0
          }
        >
          {t('create_schedule')}
        </Button>
      )}
      {!fromCreate && (
        <Button
          className='mt-4'
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

            handleCreateGroupStagePairings()
          }}
          variant='destructive'
          disabled={
            schedulingMethod === 'option-two' && unassignedTeams.length > 0
          }
        >
          {t('delete_schedule_and_create')}
        </Button>
      )}
    </div>
  )
}
