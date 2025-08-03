import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import zamboniTimeApi from '@/api/zamboniTimeApi'
import { ZamboniTime } from '@/types/zamboniTime'

export const useZamboniTimes = (tournamentId: string) => {
  return useQuery({
    queryKey: ['zamboniTimes', tournamentId],
    queryFn: () => zamboniTimeApi.getAll(tournamentId),
  })
}

export const useZamboniTime = (tournamentId: string) => {
  return useQuery({
    queryKey: ['zamboniTime', tournamentId],
    queryFn: () => zamboniTimeApi.getAll(tournamentId),
  })
}

export const useZamboniTimeCreate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['zamboniTime'],
    mutationFn: (data: Omit<ZamboniTime, 'id'>) =>
      zamboniTimeApi.create(data.tournamentId, data),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['zamboniTimes'],
      })
    },
  })
}

export const useZamboniTimeUpdate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['zamboniTime'],
    mutationFn: (data: ZamboniTime) =>
      zamboniTimeApi.update(data.tournamentId, data),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['zamboniTimes'],
      })
    },
  })
}

export const useZamboniTimeDelete = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['zamboniTime'],
    mutationFn: ({ tournamentId, id }: { tournamentId: string; id: string }) =>
      zamboniTimeApi.deleteZamboniTime(tournamentId, id),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['zamboniTimes'],
      })
    },
  })
}
