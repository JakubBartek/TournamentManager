import React, { useEffect, useState } from 'react'
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
import {
  useTeams,
  useTeamCreate,
  useTeamEdit,
  useTeamDelete,
} from '@/hooks/useTeam'
import {
  faArrowRight,
  faPlus,
  faEdit,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate, useParams } from 'react-router-dom'
import { NavbarEdit } from '@/components/Navbar/NavbarEdit'
import { useLocation } from 'react-router-dom'
import { Navbar } from '@material-tailwind/react'
import { useTranslation } from 'react-i18next'
import { Team } from '@/types/team'
import { useStandings } from '@/hooks/useStandings'
import { useTournamentAuth } from '@/components/Auth/TournamentAuthContext'

export default function EditTeams() {
  const { t } = useTranslation()
  const tournamentId = useParams().tournamentId || ''
  const {
    data: teams,
    isLoading: isLoadingTeams,
    isError: isErrorTeams,
  } = useTeams(tournamentId)
  const { mutate: createTeam } = useTeamCreate(tournamentId)
  const { mutate: updateTeam } = useTeamEdit(tournamentId)
  const { mutate: deleteTeam } = useTeamDelete(tournamentId)
  const { data: standings } = useStandings(tournamentId)
  const location = useLocation()
  const fromCreate = location.state?.fromCreate
  const navigate = useNavigate()

  // Form state for new team
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [description, setDescription] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [open, setOpen] = useState(false)

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editCity, setEditCity] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editLogoUrl, setEditLogoUrl] = useState('')

  const { isAuthenticated } = useTournamentAuth()

  useEffect(() => {
    if (!isAuthenticated(tournamentId ?? '')) {
      navigate(`/${tournamentId}/enter-password`)
    }
  }, [isAuthenticated, navigate, tournamentId])

  if (!isAuthenticated(tournamentId ?? '')) return null

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

  const startEdit = (team: Team) => {
    setEditingId(team.id)
    setEditName(team.name)
    setEditCity(team.city)
    setEditDescription(team.description || '')
    setEditLogoUrl(team.logoUrl || '')
  }

  const handleEditTeam = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    updateTeam(
      {
        id: editingId,
        name: editName,
        city: editCity,
        tournamentId,
        description: editDescription || undefined,
        logoUrl: editLogoUrl || undefined,
        standing: standings?.find((s) => s.teamId === editingId) || null,
      },
      {
        onSuccess: () => {
          setEditingId(null)
          setEditName('')
          setEditCity('')
          setEditDescription('')
          setEditLogoUrl('')
        },
      },
    )
  }

  const handleDeleteTeam = (id: string) => {
    deleteTeam(id, {
      onSuccess: () => {
        setEditingId(null)
      },
    })
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
            <CardContent className='cursor-pointer flex justify-center items-center'>
              <FontAwesomeIcon
                icon={faPlus}
                className='text-3xl font-bold text-[#646cff]'
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
          <Card
            key={team.id}
            className='max-w-3xl w-full mx-auto mt-4 shadow-lg'
          >
            <CardContent>
              {editingId === team.id ? (
                <form className='flex flex-col gap-2' onSubmit={handleEditTeam}>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder={t('enter_team_name')}
                    required
                  />
                  <Input
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    placeholder={t('enter_city')}
                    required
                  />
                  <Input
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder={t('enter_description')}
                  />
                  <Input
                    value={editLogoUrl}
                    onChange={(e) => setEditLogoUrl(e.target.value)}
                    placeholder={t('enter_logo_url')}
                  />
                  <div className='flex gap-2 mt-2'>
                    <Button type='submit'>{t('save')}</Button>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => setEditingId(null)}
                    >
                      {t('cancel')}
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <p className='text-2xl font-bold'>{team.name}</p>
                  <p className='text-base text-gray-700'>{team.city}</p>
                  {team.description && (
                    <p className='text-sm text-gray-500'>{team.description}</p>
                  )}
                  {team.logoUrl && (
                    <img
                      src={team.logoUrl}
                      alt={team.name}
                      className='w-16 h-16 object-contain mt-2'
                    />
                  )}
                  <div className='flex gap-2 mt-2'>
                    <Button
                      className='flex-1'
                      variant='outline'
                      onClick={() => startEdit(team)}
                    >
                      <FontAwesomeIcon icon={faEdit} /> {t('edit')}
                    </Button>
                    <Button
                      className='flex-1'
                      variant='outline'
                      onClick={() => handleDeleteTeam(team.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} /> {t('delete')}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
    </div>
  )
}
