import { Card, CardContent } from '@/components/ui/card'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTournamentAuth } from '@/components/Auth/TournamentAuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useGroups } from '@/hooks/useGroup'
import { useTeams } from '@/hooks/useTeam'
import { useGames } from '@/hooks/useGame'
import { useZamboniTimes } from '@/hooks/useZamboniTime'

export default function EditTeams() {
  const { t } = useTranslation()
  const tournamentId = useParams().tournamentId
  const { isAuthenticated } = useTournamentAuth()
  const navigate = useNavigate()
  const { data: groups } = useGroups(tournamentId ?? '')
  const { data: teams } = useTeams(tournamentId ?? '')
  const { data: games } = useGames(tournamentId ?? '')
  const { data: zamboniTimes } = useZamboniTimes(tournamentId ?? '')

  useEffect(() => {
    if (!isAuthenticated(tournamentId ?? '')) {
      navigate(`/${tournamentId}/enter-password`)
    }
  }, [isAuthenticated, navigate, tournamentId])

  if (!isAuthenticated(tournamentId ?? '')) return null
  return (
    <div className='flex flex-col gap-3 mb-16 items-center'>
      <h3 className='text-3xl font-bold mb-4'>{t('tournament_settings')}</h3>
      <Card className='w-full max-w-xl md:w-lg'>
        <Link to={`/${tournamentId}/edit/games`}>
          <CardContent className='w-full text-3xl'>
            {t('edit_games')}
          </CardContent>
        </Link>
      </Card>
      <Card className='w-full max-w-xl md:w-lg'>
        <Link to={`/${tournamentId}/edit/messages`}>
          <CardContent className='w-full text-3xl'>
            {t('edit_messages')}
          </CardContent>
        </Link>
      </Card>
      <Card className='w-full max-w-xl md:w-lg'>
        <Link to={`/${tournamentId}/edit/rinks`}>
          <CardContent className='w-full text-3xl'>
            {t('edit_rinks')}
          </CardContent>
        </Link>
      </Card>
      <Card className='w-full max-w-xl md:w-lg'>
        <Link to={`/${tournamentId}/edit/teams`}>
          <CardContent className='w-full text-3xl'>
            {t('edit_teams')}
          </CardContent>
        </Link>
      </Card>
      <Card className='w-full max-w-xl md:w-lg'>
        <Link to={`/${tournamentId}/edit/tournament`}>
          <CardContent className='w-full text-3xl'>
            {t('tournament_options')}
          </CardContent>
        </Link>
      </Card>
      <Card className='w-full max-w-xl md:w-lg'>
        <Link to={`/${tournamentId}/edit/schedule`}>
          <CardContent className='w-full text-3xl'>
            {t('edit_schedule')}
          </CardContent>
        </Link>
      </Card>
      <Card className='w-full max-w-xl md:w-lg'>
        <Link
          to={`/${tournamentId}/edit`}
          onClick={async (e) => {
            // prevent Link navigation so the export can complete in this handler
            try {
              e.preventDefault()
            } catch {
              /* ignore if event not provided */
            }
            try {
              console.info('Export: starting', {
                groups: Array.isArray(groups) ? groups.length : 0,
                teams: Array.isArray(teams) ? teams.length : 0,
                games: Array.isArray(games) ? games.length : 0,
                zamboni: Array.isArray(zamboniTimes) ? zamboniTimes.length : 0,
              })

              const xlsxModule = await import('xlsx')
              // support both `import xlsx from 'xlsx'` and `const xlsx = require('xlsx')`
              // some bundlers expose exports differently when dynamic imported
              const XLSX = (xlsxModule &&
                (xlsxModule.default ??
                  xlsxModule)) as unknown as typeof import('xlsx')
              if (!XLSX || !XLSX.utils) {
                throw new Error(
                  'xlsx import succeeded but module lacks utils; please check xlsx version',
                )
              }
              const wb = XLSX.utils.book_new()

              // Groups -> sheet per group (safe sheet names)
              if (Array.isArray(groups) && groups.length > 0) {
                groups.forEach((g) => {
                  const teamsInGroup = (teams ?? []).filter(
                    (tm) => tm.groupId === g.id,
                  )
                  console.log('Export: processing group', { g, teams })
                  const wsData = teamsInGroup.map((tm) => ({
                    Name: tm?.name ?? '',
                    City: tm?.city ?? '',
                    Room: tm?.roomNumber ?? '',
                    Color: tm?.teamColor ?? '',
                  }))
                  const ws = XLSX.utils.json_to_sheet(wsData)
                  // Excel sheet names max length is 31
                  let sheetName =
                    (g?.name && String(g.name)) ||
                    `Group-${String(g.id ?? '').slice(0, 6)}`
                  if (sheetName.length > 31) sheetName = sheetName.slice(0, 31)
                  XLSX.utils.book_append_sheet(wb, ws, sheetName)
                })
              } else {
                console.info('Export: no groups to export')
              }

              // Schedule sheet: combine games and zamboniTimes with validation
              const scheduleItems: Array<{
                type: 'game' | 'zamboni'
                date: Date
                end?: Date
                team1Id?: string
                team2Id?: string
                rink?: string
                _invalidDate?: boolean
              }> = []

              ;(games ?? []).forEach((gm) => {
                try {
                  const raw = gm?.date
                  const date = raw ? new Date(raw) : null
                  if (!date || isNaN(date.getTime())) {
                    console.warn(
                      'Export: game has invalid date, marking TBD',
                      gm,
                    )
                    scheduleItems.push({
                      type: 'game',
                      date: new Date(),
                      team1Id: gm?.team1Id,
                      team2Id: gm?.team2Id,
                      rink: gm?.rinkName ?? '',
                      _invalidDate: true,
                    })
                  } else {
                    scheduleItems.push({
                      type: 'game',
                      date,
                      team1Id: gm?.team1Id,
                      team2Id: gm?.team2Id,
                      rink: gm?.rinkName ?? '',
                    })
                  }
                } catch (err) {
                  console.warn('Export: error processing game', err, gm)
                }
              })
              ;(zamboniTimes ?? []).forEach((z) => {
                try {
                  const startRaw = z?.startTime
                  const endRaw = z?.endTime
                  const start = startRaw ? new Date(startRaw) : null
                  const end = endRaw ? new Date(endRaw) : undefined
                  if (!start || isNaN(start.getTime())) {
                    console.warn('Export: zamboni has invalid start', z)
                  } else {
                    scheduleItems.push({
                      type: 'zamboni',
                      date: start,
                      end,
                    })
                  }
                } catch (err) {
                  console.warn('Export: error processing zamboni', err, z)
                }
              })

              scheduleItems.sort((a, b) => a.date.getTime() - b.date.getTime())

              const scheduleRows = scheduleItems.map((it) =>
                it.type === 'game'
                  ? {
                      Type: 'Game',
                      Date: it.date?.toISOString() ?? '',
                      Start: it.date?.toLocaleString() ?? '',
                      End: '',
                      TeamA:
                        (teams ?? []).find((x) => x.id === it.team1Id)?.name ||
                        'TBD',
                      TeamB:
                        (teams ?? []).find((x) => x.id === it.team2Id)?.name ||
                        'TBD',
                      Rink: it.rink ?? '',
                    }
                  : {
                      Type: 'Zamboni',
                      Date: it.date?.toISOString() ?? '',
                      Start: it.date?.toLocaleString() ?? '',
                      End: it.end?.toLocaleString() ?? '',
                      TeamA: '',
                      TeamB: '',
                      Rink: it.rink ?? '',
                    },
              )

              const wsSchedule = XLSX.utils.json_to_sheet(scheduleRows)
              XLSX.utils.book_append_sheet(wb, wsSchedule, 'Schedule')

              const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
              const blob = new Blob([wbout], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `tournament_${new Date()
                .toISOString()
                .slice(0, 10)}.xlsx`
              document.body.appendChild(a)
              a.click()
              a.remove()
              URL.revokeObjectURL(url)
              console.info('Export: finished successfully')
            } catch (err) {
              console.error('Export failed', err)
              // keep user-facing message concise
              alert(
                t('export_failed') || 'Export failed. See console for details.',
              )
            }
          }}
        >
          <CardContent className='w-full text-3xl'>Export</CardContent>
        </Link>
      </Card>
    </div>
  )
}
