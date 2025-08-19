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
  useRinks,
  useRinkCreate,
  useRinkUpdate,
  useRinkDelete,
} from '@/hooks/useRinks'
import {
  faArrowRight,
  faPlus,
  faEdit,
  faTrash,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate, useParams } from 'react-router-dom'
import { NavbarEdit } from '@/components/Navbar/NavbarEdit'
import { useLocation } from 'react-router-dom'
import { Navbar } from '@material-tailwind/react'
import { useTranslation } from 'react-i18next'
import { useTournamentAuth } from '@/components/Auth/TournamentAuthContext'
import { toast } from 'sonner'

export default function EditRinks() {
  const { t } = useTranslation()
  const tournamentId = useParams().tournamentId || ''
  const {
    data: rinks,
    isLoading: isLoadingRinks,
    isError: isErrorRinks,
  } = useRinks(tournamentId)
  const { mutate: createRink } = useRinkCreate()
  const { mutate: updateRink } = useRinkUpdate()
  const { mutate: deleteRink } = useRinkDelete()
  const location = useLocation()
  const fromCreate = location.state?.fromEditTeams
  const navigate = useNavigate()
  const { isAuthenticated } = useTournamentAuth()

  // Form state for new rink
  const [name, setName] = useState('')
  const [open, setOpen] = useState(false)

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  useEffect(() => {
    if (!isAuthenticated(tournamentId ?? '')) {
      navigate(`/${tournamentId}/enter-password`)
    }
  }, [isAuthenticated, navigate, tournamentId])

  if (!isAuthenticated(tournamentId ?? '')) return null

  const handleCreateRink = (e: React.FormEvent) => {
    e.preventDefault()
    createRink(
      {
        name,
        tournamentId,
      },
      {
        onSuccess: () => {
          setName('')
          setOpen(false)
          toast.success(t('rink_created'))
        },
        onError: (error: Error) => {
          toast.error('Error: ' + error.message)
        },
      },
    )
  }

  const startEdit = (rink: { id: string; name: string }) => {
    setEditingId(rink.id)
    setEditName(rink.name)
  }

  const handleEditRink = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    updateRink(
      {
        id: editingId,
        name: editName,
        tournamentId,
      },
      {
        onSuccess: () => {
          setEditingId(null)
          setEditName('')
          toast.success(t('rink_updated'))
        },
        onError: (error: Error) => {
          toast.error('Error: ' + error.message)
        },
      },
    )
  }

  const handleDeleteRink = (id: string) => {
    deleteRink(
      { tournamentId, id },
      {
        onSuccess: () => {
          setEditingId(null)
          setEditName('')
          toast.success(t('rink_deleted'))
        },
        onError: (error: Error) => {
          toast.error('Error: ' + error.message)
        },
      },
    )
  }

  if (isLoadingRinks) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        Loading rinks...
      </div>
    )
  }

  if (isErrorRinks) {
    return (
      <div className='flex items-center justify-center min-h-screen text-red-500'>
        Error loading rinks: {isErrorRinks}
      </div>
    )
  }

  return (
    <div
      className={`flex flex-col gap-3 mb-16 items-center${
        fromCreate ? ' mt-8' : ''
      }`}
    >
      {!fromCreate && <NavbarEdit />}
      {fromCreate && (
        <>
          <div className='fixed top-4 md:top-100 left-0 z-50'>
            {/* @ts-expect-error Suppress missing props warning */}
            <Navbar
              className='bg-white shadow-md px-6 py-3 w-auto rounded-l-none border-gray-400'
              placeholder={undefined}
              onResize={undefined}
              onResizeCapture={undefined}
              onClick={() =>
                navigate(`/${tournamentId}/edit/teams`, {
                  state: { fromCreate: true },
                })
              }
            >
              <div className='flex justify-between items-center w-full px-2 py-2 gap-8 text-3xl'>
                <Button variant='white' size='full'>
                  <FontAwesomeIcon icon={faArrowLeft} />
                </Button>
              </div>
            </Navbar>
          </div>
          <div className='fixed top-4 md:top-100 right-0 z-50'>
            {/* @ts-expect-error Suppress missing props warning */}
            <Navbar
              className='bg-white shadow-md px-6 py-3 w-auto rounded-r-none border-gray-400'
              placeholder={undefined}
              onResize={undefined}
              onResizeCapture={undefined}
              onClick={() =>
                navigate(`/${tournamentId}/edit/tournament`, {
                  state: { fromEditRinks: true },
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
        </>
      )}
      {fromCreate && (
        <h2 className='text-xl font-bold mb-4'>
          3. {t('add_rinks_to_your_tournament')}
        </h2>
      )}
      <Card className='w-full max-w-xl md:w-lg'>
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
              <DialogTitle>{t('new_rink')}</DialogTitle>
            </DialogHeader>
            <form
              className='flex flex-col gap-4 mt-4'
              onSubmit={handleCreateRink}
            >
              <Input
                placeholder={t('enter_rink_name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Button type='submit' className='mt-2' disabled={!name}>
                {t('create_rink')}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </Card>
      {rinks &&
        Array.isArray(rinks) &&
        rinks.map((rink) => (
          <Card key={rink.id} className='w-full max-w-xl md:w-lg'>
            <CardContent className='flex flex-col gap-2 w-full'>
              {editingId === rink.id ? (
                <form
                  className='flex flex-col gap-2 w-full'
                  onSubmit={handleEditRink}
                >
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
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
                  <span className='text-2xl mb-2'>{rink.name}</span>
                  <div className='flex gap-2 mt-2 w-full'>
                    <Button
                      variant='outline'
                      className='flex-1'
                      onClick={() => startEdit(rink)}
                    >
                      <FontAwesomeIcon icon={faEdit} /> {t('edit')}
                    </Button>
                    <Button
                      className='flex-1'
                      variant='outline'
                      onClick={() => handleDeleteRink(rink.id)}
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
