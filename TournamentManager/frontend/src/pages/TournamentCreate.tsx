import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTournamentCreateAndGoToEditTeams } from '@/hooks/useTournament'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function TournamentCreate() {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const navigate = useNavigate()
  const { mutate: createTournament } = useTournamentCreateAndGoToEditTeams()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createTournament({
      name,
      location,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      adminPassword,
    })
  }

  return (
    <div className='max-w-xl mx-auto mt-10 flex flex-col items-center'>
      <Card className='mt-6 shadow-lg'>
        <CardHeader>
          <CardTitle>{t('create_a_new_tournament')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <label>
              {t('tournament_name')}
              <Input
                placeholder={t('enter_tournament_name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label>
              {t('location')}
              <Input
                placeholder={t('enter_location')}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </label>
            <label>
              {t('start_date')}
              <Input
                type='date'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </label>
            <label>
              {t('end_date')}
              <Input
                type='date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </label>
            <label>
              {t('admin_password')}
              <Input
                type='password'
                placeholder={t('enter_admin_password')}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />
            </label>
            <div className='flex gap-4 mt-4'>
              <Button
                type='button'
                onClick={() => navigate('/select')}
                className='text-white w-32'
              >
                {t('back')}
              </Button>
              <Button
                className='w-32'
                type='submit'
                disabled={
                  !name || !location || !startDate || !endDate || !adminPassword
                }
              >
                {t('create')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
