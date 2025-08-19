import { NavbarEdit } from '@/components/Navbar/NavbarEdit'
import { Card, CardContent } from '@/components/ui/card'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTournamentAuth } from '@/components/Auth/TournamentAuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function EditTeams() {
  const { t } = useTranslation()
  const tournamentId = useParams().tournamentId
  const { isAuthenticated } = useTournamentAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated(tournamentId ?? '')) {
      navigate(`/${tournamentId}/enter-password`)
    }
  }, [isAuthenticated, navigate, tournamentId])

  if (!isAuthenticated(tournamentId ?? '')) return null
  return (
    <div className='flex flex-col gap-3 mb-16 items-center'>
      <NavbarEdit />
      <Link to={`/${tournamentId}/edit/games`}>
        <Card className='w-full max-w-xl md:w-lg'>
          <CardContent className='w-full text-3xl'>
            {t('edit_games')}
          </CardContent>
        </Card>
      </Link>
      <Link to={`/${tournamentId}/edit/messages`}>
        <Card className='w-full max-w-xl md:w-lg'>
          <CardContent className='w-full text-3xl'>
            {t('edit_messages')}
          </CardContent>
        </Card>
      </Link>
      <Link to={`/${tournamentId}/edit/rinks`}>
        <Card className='w-full max-w-xl md:w-lg'>
          <CardContent className='w-full text-3xl'>
            {t('edit_rinks')}
          </CardContent>
        </Card>
      </Link>
      <Link to={`/${tournamentId}/edit/teams`}>
        <Card className='w-full max-w-xl md:w-lg'>
          <CardContent className='w-full text-3xl'>
            {t('edit_teams')}
          </CardContent>
        </Card>
      </Link>
      <Link to={`/${tournamentId}/edit/tournament`}>
        <Card className='w-full max-w-xl md:w-lg'>
          <CardContent className='w-full text-3xl'>
            {t('tournament_options')}
          </CardContent>
        </Card>
      </Link>
      <Link to={`/${tournamentId}/edit/schedule`}>
        <Card className='w-full max-w-xl md:w-lg'>
          <CardContent className='w-full text-3xl'>
            {t('edit_schedule')}
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}
