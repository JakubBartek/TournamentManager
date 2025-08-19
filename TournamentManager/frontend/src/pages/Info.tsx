import { Card, CardContent } from '@/components/ui/card'
import { useMessages } from '@/hooks/useMessage'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Info() {
  const { t } = useTranslation()
  const { tournamentId } = useParams<{ tournamentId: string }>()
  const { data: messages, isLoading, error } = useMessages(tournamentId ?? '')

  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-4 mb-16'>
      <h1 className='text-4xl font-bold mb-4'>{t('info')}</h1>
      {isLoading && <p>Loading messages...</p>}
      {error && (
        <p className='text-red-500'>Error: {(error as Error).message}</p>
      )}
      {messages && messages.length === 0 && (
        <p className='text-gray-500'>No messages found.</p>
      )}
      <Link to={`/${tournamentId}/teams`}>
        <Card className='w-full max-w-xl md:w-lg'>
          <CardContent>
            <h2 className='text-xl font-bold'>{t('team_info')}</h2>
            <p className='text-sm text-gray-500'>{t('click_for_redirect')}</p>
          </CardContent>
        </Card>
      </Link>
      {messages &&
        Array.isArray(messages) &&
        messages.map((msg) => (
          <Card
            key={msg.id}
            className={`w-full max-w-xl md:w-lg ${
              msg.type === 'ALERT' ? 'bg-yellow-100' : ''
            }`}
          >
            <CardContent>
              <p className='text-lg'>{msg.content}</p>
              <p className='text-xs text-gray-500'>
                {new Date(msg.createdAt).toLocaleString('sk-SK', {
                  timeZone: 'CET',
                })}
              </p>
            </CardContent>
          </Card>
        ))}
    </div>
  )
}
