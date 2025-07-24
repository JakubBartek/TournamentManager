import { useParams } from 'react-router-dom'
import { useGroups } from '@/hooks/useGroup'
import { useCalculateStandings } from '@/hooks/useStandings'
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
import React from 'react'

export default function Standings() {
  const { tournamentId } = useParams<{ tournamentId: string }>()
  const { mutate: calculateStandings } = useCalculateStandings(
    tournamentId || '',
  )
  const {
    data: groups,
    isLoading: loadingGroups,
    error: errorGroups,
  } = useGroups(tournamentId || '')

  const [hasCalculated, setHasCalculated] = React.useState(false)

  // TODO: Calculate only when change happens (move this somewhere else)
  React.useEffect(() => {
    if (tournamentId && !hasCalculated) {
      calculateStandings()
      setHasCalculated(true)
    }
  }, [tournamentId, calculateStandings, hasCalculated])

  if (!tournamentId) {
    return <div className='text-red-500 text-lg'>Missing tournament ID</div>
  }

  if (loadingGroups) {
    return (
      <div className='p-4'>
        <h2 className='text-2xl font-bold mb-4'>Standings</h2>
        <Skeleton className='h-10 w-full mb-2' />
        <Skeleton className='h-10 w-full mb-2' />
        <Skeleton className='h-10 w-full' />
      </div>
    )
  }

  if (errorGroups) {
    return (
      <div className='text-red-500 text-lg'>Error: {errorGroups?.message}</div>
    )
  }

  return (
    <div className='p-4'>
      <h2 className='text-3xl font-bold mb-6'>Standings</h2>
      {groups?.map((group) => (
        <div key={group.id} className='mb-8'>
          <h3 className='text-xl font-semibold mb-2'>{group.name}</h3>
          <Card>
            <CardContent className='p-4'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='text-left'>Position</TableHead>
                    <TableHead className='text-center'>Name</TableHead>
                    <TableHead className='text-left'>Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.Standings?.map((standing) => (
                    <TableRow key={standing.teamId}>
                      <TableCell className='text-center'>
                        {standing.position}
                      </TableCell>
                      <TableCell className='font-medium text-left'>
                        {standing.teamName}
                      </TableCell>
                      <TableCell className='text-center'>
                        {standing.points}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}
