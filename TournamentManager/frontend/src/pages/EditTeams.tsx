import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTeams, useTeamCreate } from '@/hooks/useTeam'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, useParams } from 'react-router-dom'
import { NavbarEdit } from '@/components/Navbar/NavbarEdit'

export default function EditTeams() {
  const tournamentId = useParams().tournamentId || ''
  const {
    data: teams,
    isLoading: isLoadingTeams,
    isError: isErrorTeams,
  } = useTeams(tournamentId)
  const { mutate: createTeam } = useTeamCreate(tournamentId)

  // Form state for new team
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [description, setDescription] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [open, setOpen] = useState(false)

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault()
    createTeam(
      {
        name,
        city,
        tournamentId,
        description: description || undefined,
        logoUrl: logoUrl || undefined,
      },
      {
        onSuccess: () => {
          setName('')
          setCity('')
          setDescription('')
          setLogoUrl('')
          setOpen(false)
        },
      },
    )
  }

  if (isLoadingTeams) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        Loading teams...
      </div>
    )
  }

  if (isErrorTeams) {
    return (
      <div className='flex items-center justify-center min-h-screen text-red-500'>
        Error loading teams: {isErrorTeams}
      </div>
    )
  }

  return (
    <div className='max-w-xl mx-auto mt-16 flex flex-col items-center w-full'>
      <NavbarEdit />
      <Card className='max-w-3xl w-full mx-auto shadow-lg'>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <CardContent className='cursor-pointer'>
              <FontAwesomeIcon
                icon={faPlus}
                className='flex-1 flex text-3xl font-bold justify-center text-[#646cff]'
              />
            </CardContent>
          </DialogTrigger>
          <DialogContent>
            <DialogDescription></DialogDescription>
            <DialogHeader>
              <DialogTitle>New Team</DialogTitle>
            </DialogHeader>
            <form
              className='flex flex-col gap-4 mt-4'
              onSubmit={handleCreateTeam}
            >
              <Input
                placeholder='Team Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                placeholder='City'
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              <Input
                placeholder='Description (optional)'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Input
                placeholder='Logo URL (optional)'
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
              />
              <Button type='submit' className='mt-2' disabled={!name || !city}>
                {'Create'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </Card>
      {teams &&
        teams.map((team) => (
          <Link
            to={`/${tournamentId}/edit/teams/${team.id}`}
            className='text-primary w-full'
            key={team.id}
          >
            <Card key={team.id} className='max-w-3xl mx-auto mt-4 shadow-lg'>
              <CardContent className='text-2xl'>{team.name}</CardContent>
            </Card>
          </Link>
        ))}
    </div>
  )
}
