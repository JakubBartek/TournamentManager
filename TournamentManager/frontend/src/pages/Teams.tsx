import { useTeams } from '@/hooks/useTeam'
import { Card, CardContent } from '@/components/ui/card'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Teams() {
  const { tournamentId } = useParams<{ tournamentId: string }>()
  const { data: teams, isLoading, error } = useTeams(tournamentId || '')
  const { t } = useTranslation()

  if (isLoading) return <div>Loading teams...</div>
  if (error) return <div>Error: {(error as Error).message}</div>

  return (
    <div className='flex flex-col gap-3 mb-16 items-center'>
      {Array.isArray(teams) &&
        teams.map((team) => (
          <Card key={team.id} className='w-full max-w-xl md:w-lg'>
            <CardContent className=''>
              <h2 className='text-xl font-bold'>{team.name}</h2>
              <p className='text-sm text-gray-500'>{team.city}</p>
              <p className='text-sm text-gray-500'>{team.description}</p>
              <p className='font-semibold'>
                {t('room_number')}: {team.roomNumber}
              </p>
            </CardContent>
          </Card>
        ))}
    </div>
  )
}
