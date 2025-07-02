import { useTeams } from '@/hooks/useTeam'
import { Card, CardContent } from '@/components/ui/card'
import { useParams } from 'react-router-dom'

export default function Teams() {
  const { tournamentId } = useParams<{ tournamentId: string }>()
  const { data: teams, isLoading, error } = useTeams(tournamentId || '')

  if (isLoading) return <div>Loading teams...</div>
  if (error) return <div>Error: {(error as Error).message}</div>

  return (
    <div className='grid grid-cols-2 gap-4 max-w-80 w-80 h-32 max-h-32 pb-56'>
      {teams?.map((team) => (
        <Card key={team.id} className='h-32'>
          <CardContent className='flex items-center justify-center h-full'>
            <h2 className='text-xl font-bold'>{team.name}</h2>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
