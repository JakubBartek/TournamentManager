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
import { useRinks, useRinkCreate } from '@/hooks/useRinks'
import { faArrowRight, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { NavbarEdit } from '@/components/Navbar/NavbarEdit'
import { useLocation } from 'react-router-dom'
import { Navbar } from '@material-tailwind/react'

export default function EditRinks() {
  const tournamentId = useParams().tournamentId || ''
  const {
    data: rinks,
    isLoading: isLoadingRinks,
    isError: isErrorRinks,
  } = useRinks(tournamentId)
  const { mutate: createRink } = useRinkCreate()
  const location = useLocation()
  const fromCreate = location.state?.fromEditTeams
  const navigate = useNavigate()

  // Form state for new rink
  const [name, setName] = useState('')
  const [open, setOpen] = useState(false)

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
      )}
      {fromCreate && (
        <h2 className='text-xl font-bold mb-4'>
          3. Add rinks to your tournament
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
              <DialogTitle>New Rink</DialogTitle>
            </DialogHeader>
            <form
              className='flex flex-col gap-4 mt-4'
              onSubmit={handleCreateRink}
            >
              <Input
                placeholder='Rink Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Button type='submit' className='mt-2' disabled={!name}>
                {'Create'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </Card>
      {rinks &&
        rinks.map((rink) => (
          <Link
            to={`/${tournamentId}/edit/rinks/${rink.id}`}
            className='text-primary w-full'
            key={rink.id}
          >
            <Card key={rink.id} className='max-w-3xl mx-auto mt-4 shadow-lg'>
              <CardContent className='text-2xl'>{rink.name}</CardContent>
            </Card>
          </Link>
        ))}
    </div>
  )
}
