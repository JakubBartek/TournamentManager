import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTournamentCreateAndGoToEditTeams } from '@/hooks/useTournament'
import { useNavigate } from 'react-router-dom'

export default function TournamentCreate() {
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
          <CardTitle>Create Tournament</CardTitle>
        </CardHeader>
        <CardContent>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <label>
              Tournament Name
              <Input
                placeholder='Enter tournament name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label>
              Location
              <Input
                placeholder='Enter location'
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </label>
            <label>
              Start Date
              <Input
                type='date'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </label>
            <label>
              End Date
              <Input
                type='date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </label>
            <label>
              Admin Password
              <Input
                type='password'
                placeholder='Enter admin password'
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
                Back
              </Button>
              <Button
                className='w-32'
                type='submit'
                disabled={
                  !name || !location || !startDate || !endDate || !adminPassword
                }
              >
                {'Create'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
