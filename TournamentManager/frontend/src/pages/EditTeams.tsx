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
import { faArrowRight, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { NavbarEdit } from '@/components/Navbar/NavbarEdit'
import { useLocation } from 'react-router-dom'
import { Navbar } from '@material-tailwind/react'
import { useTranslation } from 'react-i18next'

export default function EditTeams() {
  const { t } = useTranslation()
  const tournamentId = useParams().tournamentId || ''
  const {
    data: teams,
    isLoading: isLoadingTeams,
    isError: isErrorTeams,
  } = useTeams(tournamentId)
  const { mutate: createTeam } = useTeamCreate(tournamentId)
  const location = useLocation()
  const fromCreate = location.state?.fromCreate
  const navigate = useNavigate()

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
    <div className='max-w-xl mx-auto my-16 flex flex-col items-center w-full mb-16'>
      <NavbarEdit />
      {fromCreate && (
        <div className='fixed top-4 md:top-100 right-0 z-50'>
          {/* @ts-expect-error Suppress missing props warning */}
          <Navbar
            className='bg-white shadow-md px-6 py-3 w-auto rounded-r-none border-gray-400'
            placeholder={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
            onClick={() =>
              navigate(`/${tournamentId}/edit/rinks`, {
                state: { fromEditTeams: true },
              })
            }
          >
            <div className='flex justify-between items-center w-full px-2 py-2 gap-8 text-3xl'>
              <Button variant='white' size='full'>
                <FontAwesomeIcon icon={faArrowRight} />
              </Button>
            </div>
          </Navbar>
        </div>
      )}
      {fromCreate && (
        <h2 className='text-xl font-bold mb-4'>
          2. {t('add_teams_to_your_tournament')}
        </h2>
      )}
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
              <DialogTitle>{t('new_team')}</DialogTitle>
            </DialogHeader>
            <form
              className='flex flex-col gap-4 mt-4'
              onSubmit={handleCreateTeam}
            >
              <Input
                placeholder={t('enter_team_name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                placeholder={t('enter_city')}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              <Input
                placeholder={t('enter_description')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Input
                placeholder={t('enter_logo_url')}
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
              />
              <Button type='submit' className='mt-2' disabled={!name || !city}>
                {t('create_team')}
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
