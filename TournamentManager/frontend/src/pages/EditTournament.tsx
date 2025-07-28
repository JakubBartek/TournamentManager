import { NavbarEdit } from '@/components/Navbar/NavbarEdit'
import { Card, CardContent } from '@/components/ui/card'
import { Link, useParams } from 'react-router-dom'

export default function EditTeams() {
  const tournamentId = useParams().tournamentId

  return (
    <div>
      <NavbarEdit />
      <Link to={`/${tournamentId}/edit/teams`}>
        <Card className='max-w-xl mx-auto mt-16 flex flex-col items-center'>
          <CardContent className='w-full text-3xl'>Edit Teams</CardContent>
        </Card>
      </Link>
    </div>
  )
}
