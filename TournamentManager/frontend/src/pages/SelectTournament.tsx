import { Link, useNavigate } from 'react-router-dom'
import { useTournaments } from '@/hooks/useTournament'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function TournamentSelectPage() {
  const { t } = useTranslation()
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const { data: tournaments, isLoading, error } = useTournaments()
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [search, setSearch] = useState('')

  const filteredTournaments = useMemo(() => {
    if (!tournaments) return []
    return tournaments.filter((tournament) => {
      const start = fromDate ? new Date(fromDate) : null
      const end = toDate ? new Date(toDate) : null
      const tStart = new Date(tournament.startDate)
      const tEnd = new Date(tournament.endDate)

      if (start && tEnd < start) return false
      if (end && tStart > end) return false
      if (
        search &&
        !tournament.name.toLowerCase().includes(search.toLowerCase())
      )
        return false
      return true
    })
  }, [tournaments, fromDate, toDate, search])

  // Show only top two tournaments
  const topTournaments = filteredTournaments.slice(0, 2)

  if (isLoading)
    return (
      <div className='flex items-center justify-center min-h-screen'>
        Loading tournaments...
      </div>
    )
  if (error)
    return (
      <div className='flex items-center justify-center min-h-screen text-red-500'>
        Error when loading tournaments: {(error as Error).message}
      </div>
    )

  if (!tournaments || tournaments.length === 0) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        {t('no_tournaments_found')}
      </div>
    )
  }

  const changeLanguage = (lng: 'sk' | 'en') => {
    i18n.changeLanguage?.(lng)
  }

  return (
    <div className='flex flex-col mb-16 items-center'>
      <h1 className='text-3xl font-extrabold text-gray-800 mb-2'>
        {t('choose')}
      </h1>
      <h2 className='text-3xl font-extrabold text-gray-800'>{t('a')}</h2>
      <h1 className='text-3xl font-extrabold text-gray-800 mb-8'>
        {t('tournament')}
      </h1>
      {/* Filters */}
      <Card className='w-full md:max-w-lg mb-4'>
        <CardHeader>
          <h2 className='text-lg font-bold'>{t('filter_tournaments')}</h2>
        </CardHeader>
        <CardContent className='flex flex-col gap-4 items-center justify-center'>
          <div className='flex flex-col gap-4 w-full px-4'>
            <div className='flex flex-row gap-4 w-full'>
              <div className='flex-1 min-w-0'>
                <Label>{t('filter_from_date')}</Label>
                <Input
                  type='date'
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className='bg-white mt-1 w-full'
                />
              </div>
              <div className='flex-1 min-w-0'>
                <Label>{t('filter_to_date')}</Label>
                <Input
                  type='date'
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className='bg-white mt-1 w-full'
                />
              </div>
            </div>
            <div className='w-full'>
              <Label>{t('search_by_name')}</Label>
              <Input
                placeholder={t('search_placeholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='bg-white mt-1 w-full'
              />
            </div>
            <Button
              variant='outline'
              onClick={() => {
                setFromDate('')
                setToDate('')
                setSearch('')
              }}
            >
              {t('reset_filter')}
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Tournament List */}
      {filteredTournaments.length === 0 && (
        <p className='text-gray-500 mt-4'>{t('no_tournaments_found')}</p>
      )}

      <div className='flex flex-col items-center gap-4 w-full px-4 max-w-2xl'>
        {topTournaments.map((tournament) => (
          <Card
            key={tournament.id}
            className='w-full cursor-pointer hover:shadow-lg transition-shadow bg-white'
            onClick={() => navigate(`/${tournament.id}`)}
          >
            <CardContent>
              <CardHeader>{t('click_to_tournament')}</CardHeader>
              <p className='font-bold text-lg'>{tournament.name}</p>
              <p className='text-sm text-gray-600'>
                {new Date(tournament.startDate).toLocaleDateString()} -{' '}
                {new Date(tournament.endDate).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className='mt-4'></div>
      <Link to='/tournament/create'>
        <Button className='' size='wide3XL'>
          {t('create_a_new_tournament')}
        </Button>
      </Link>
      <div className='flex gap-2 mt-8'>
        <Button variant='outline' onClick={() => changeLanguage('sk')}>
          SK
        </Button>
        <Button variant='outline' onClick={() => changeLanguage('en')}>
          EN
        </Button>
      </div>
    </div>
  )
}
