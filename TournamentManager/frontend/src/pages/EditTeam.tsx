import { Button } from '@/components/ui/button'
import { Link, useParams } from 'react-router-dom'
import { useTeam, useTeamDelete } from '@/hooks/useTeam'
import { toast } from 'sonner'
import { NavbarEdit } from '@/components/Navbar/NavbarEdit'
import { useTranslation } from 'react-i18next'

export default function EditTeam() {
  const { t } = useTranslation()
  const { tournamentId, teamId } = useParams<{
    tournamentId: string
    teamId: string
  }>()
  const enabled = !!tournamentId && !!teamId
  const { data: team } = useTeam(tournamentId ?? '', teamId ?? '')

  const deleteTeamMutation = useTeamDelete(teamId || '')
  const handleDelete = () => {
    if (tournamentId) {
      deleteTeamMutation.mutate(teamId || '', {
        onSuccess: () => {
          toast('Team deleted successfully')
        },
      })
    }
  }

  if (!enabled) {
    return <div className='text-red-500'>Missing tournament or team ID</div>
  }

  if (!team) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p>Loading team...</p>
      </div>
    )
  }

  return (
    <div className='max-w-xl mx-auto my-16 flex flex-col items-center w-full'>
      <NavbarEdit />
      <h1>{t('edit_team')}</h1>
      <h1>{team?.name}</h1>
      <Link to={`/${tournamentId}/edit/teams`} className='mt-32'>
        <Button variant='destructive' size='lg' onClick={handleDelete}>
          {t('delete_team')}
        </Button>
      </Link>
    </div>
  )
}
