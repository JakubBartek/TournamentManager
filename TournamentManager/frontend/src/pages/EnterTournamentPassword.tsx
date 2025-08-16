import { useTournamentAuth } from '@/components/Auth/TournamentAuthContext'
import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function EnterTournamentPassword() {
  const { tournamentId } = useParams()
  const { authenticate } = useTournamentAuth()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await authenticate(tournamentId!, password)
    if (success) {
      navigate(`/${tournamentId}/edit`)
      toast.success(t('you_can_edit'))
    } else {
      setError('Invalid password')
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 40,
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: 300,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <Input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('enter_tournament_password')}
        />
        <Button type='submit'>{t('enter')}</Button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </form>
      <Button onClick={() => navigate(`/${tournamentId}`)}>
        {t('back_home')}
      </Button>
    </div>
  )
}
