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
    </div>
  )
}
