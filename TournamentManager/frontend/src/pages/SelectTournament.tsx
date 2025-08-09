import { Link, useNavigate } from 'react-router-dom'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTournaments } from '@/hooks/useTournament'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function TournamentSelectPage() {
  const { t } = useTranslation()
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const { data: tournaments, isLoading, error } = useTournaments()
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

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
        No tournaments available.
      </div>
    )
  }

  const handleChange = (value: string) => {
    navigate(`/${value}`)
  }

  const changeLanguage = (lng: 'sk' | 'en') => {
    i18n.changeLanguage?.(lng)
  }

  // TODO: Remake this page
  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='text-3xl font-extrabold text-gray-800 mb-2 mt-32'>
        {t('choose')}
      </h1>
      <h2 className='text-3xl font-extrabold text-gray-800'>{t('a')}</h2>
      <h1 className='text-3xl font-extrabold text-gray-800 mb-8'>
        {t('tournament')}
      </h1>
      <Select onValueChange={handleChange}>
        <SelectTrigger className='w-[300px] mb-8 h-12 text-lg border-2 border-blue-400 rounded-lg shadow-md hover:border-blue-600 transition-colors duration-200'>
          <SelectValue placeholder={t('choose_a_tournament')} />
        </SelectTrigger>
        <SelectContent className='bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto'>
          {tournaments.map((tournament) => (
            <SelectItem
              key={tournament.id}
              value={tournament.id}
              className='text-base py-2 px-4 hover:bg-blue-50 cursor-pointer rounded-md'
            >
              {tournament.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className='flex gap-4 mb-8'>
        <div>
          <Label className='block text-sm mb-1'>{t('filter_from_date')}</Label>
          <Input
            type='date'
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className='border rounded px-2 py-1'
          />
        </div>
        <div>
          <Label className='block text-sm mb-1'>{t('filter_to_date')}</Label>
          <Input
            type='date'
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className='border rounded px-2 py-1'
          />
        </div>
      </div>
      <Link to='/tournament/create'>
        <Button className='mt-16' size='wide3XL'>
          {t('create_a_new_tournament')}
        </Button>
      </Link>
      <div className='flex gap-2 mt-16'>
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
