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
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

export default function Standings() {
  const { t } = useTranslation()
  const { tournamentId } = useParams<{ tournamentId: string }>()
  const queryClient = useQueryClient()
  const { mutate: calculateStandings } = useCalculateStandings(
    tournamentId || '',
    {
      onSuccess: () => {
        // Refetch groups after standings are calculated
        queryClient.invalidateQueries({ queryKey: ['groups', tournamentId] })
      },
    },
  )
  const {
    data: groups,
    isLoading: loadingGroups,
    error: errorGroups,
  } = useGroups(tournamentId || '')

  const [hasCalculated, setHasCalculated] = React.useState(false)

  // TODO: Is useEffect necessary here?
  // Calculate is not very cheap, find a better way to handle this
  // (e.g., only calculate when game results change)
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
    <div className='p-2 flex flex-col items-center'>
      <h2 className='text-3xl font-bold mb-6'>{t('standings')}</h2>
      {groups?.map((group) => (
        <div key={group.id} className='mb-4'>
          <Card className='md:w-lg'>
            <CardContent
              className='px-4'
              style={{ overflow: 'auto', scrollbarWidth: 'none' }}
            >
              <h3 className='text-xl font-semibold'>{group.name}</h3>

              <Table className='[&::-webkit-scrollbar]:hidden overflow-x-auto'>
                <TableHeader>
                  <TableRow>
                    <TableHead className='text-center'>
                      {t('position')}
                    </TableHead>
                    <TableHead className='text-center'>{t('name')}</TableHead>
                    <TableHead className='text-center'>{t('points')}</TableHead>
                    <TableHead className='text-center'>+/-</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.Standings?.map((standing) => (
                    <TableRow key={standing.teamId}>
                      <TableCell className='text-center'>
                        {standing.position}
                      </TableCell>
                      <TableCell className='font-medium text-center'>
                        {standing.teamName}
                      </TableCell>
                      <TableCell className='text-center'>
                        {standing.points}
                      </TableCell>
                      <TableCell className='text-center'>
                        {standing.goalsFor - standing.goalsAgainst}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <style>{`
              .overflow-x-auto::-webkit-scrollbar {
                display: none;
              }
              .overflow-x-auto {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
              `}</style>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}
