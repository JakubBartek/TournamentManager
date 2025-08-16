import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import standingsApi from '@/api/standingsApi'
import { Standings, StandingsCreate } from '@/types/standings'

export const useStandings = (tournamentId: string) => {
  return useQuery({
    queryKey: ['standings', tournamentId],
    queryFn: () => standingsApi.getAll(tournamentId),
  })
}

export const useStandingsCreate = (tournamentId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['standings', tournamentId],
    mutationFn: (data: StandingsCreate) =>
      standingsApi.create(tournamentId, data),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['standings', tournamentId],
      })
    },
  })
}

export const useStandingsEdit = (tournamentId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['standings', tournamentId],
    mutationFn: (data: Standings) => standingsApi.update(tournamentId, data),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['standings', tournamentId],
      })
    },
  })
}

export const useStandingsDelete = (tournamentId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['standings', tournamentId],
    mutationFn: (id: string) => standingsApi.delete(tournamentId, id),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['standings', tournamentId],
      })
    },
  })
}

export const useCalculateStandings = (
  tournamentId: string,
  p0: { onSuccess: () => void },
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['standings', tournamentId, 'calculate'],
    mutationFn: () => standingsApi.calculateStandings(tournamentId),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['standings', tournamentId],
      })
    },
    onSuccess: () => {
      p0.onSuccess()
    },
  })
}
