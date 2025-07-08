import { useParams } from 'react-router-dom'
import { useTeams } from '@/hooks/useTeam'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

export default function Standings() {
  const { tournamentId } = useParams<{ tournamentId: string }>()
  const { data: teams, isLoading, error } = useTeams(tournamentId ?? '')

  if (!tournamentId) {
    return <div className='text-red-500 text-lg'>Missing tournament ID</div>
  }

  if (isLoading) {
    return (
      <div className='p-4'>
        <h2 className='text-2xl font-bold mb-4'>Teams</h2>
        <Skeleton className='h-10 w-full mb-2' />
        <Skeleton className='h-10 w-full mb-2' />
        <Skeleton className='h-10 w-full' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='text-red-500 text-lg'>
        Error: {(error as Error).message}
      </div>
    )
  }

  return (
    <div className='p-4'>
      <h2 className='text-3xl font-bold mb-6'>Standings</h2>
      <Card>
        <CardContent className='p-4'>
          <Table className='w-64'>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams?.map((team) => (
                <TableRow key={team.id}>
                  <TableCell className='font-medium text-left'>
                    {team.name}
                  </TableCell>
                  <TableCell>0</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
