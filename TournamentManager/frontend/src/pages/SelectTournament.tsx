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

export default function TournamentSelectPage() {
  const navigate = useNavigate()
  const { data: tournaments, isLoading, error } = useTournaments()

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

  // TODO: Remake this page
  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='text-3xl font-extrabold text-gray-800 mb-2 mt-32'>
        Choose
      </h1>
      <h2 className='text-3xl font-extrabold text-gray-800'>a</h2>
      <h1 className='text-3xl font-extrabold text-gray-800 mb-8'>Tournament</h1>
      <Select onValueChange={handleChange}>
        <SelectTrigger className='w-[300px] mb-16 h-12 text-lg border-2 border-blue-400 rounded-lg shadow-md hover:border-blue-600 transition-colors duration-200'>
          <SelectValue placeholder='Choose a tournament' />
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
      <Link to='/tournament/create'>
        <Button className='mt-16' size='wide3XL'>
          Create a new tournament
        </Button>
      </Link>
    </div>
  )
}
