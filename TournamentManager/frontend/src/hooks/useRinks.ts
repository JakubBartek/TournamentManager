import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import rinkApi from '@/api/rinkApi'
import { Rink } from '@/types/rink'

export const useRinks = (tournamentId: string) => {
  return useQuery({
    queryKey: ['rinks', tournamentId],
    queryFn: () => rinkApi.getAll(tournamentId),
  })
}

export const useRink = (tournamentId: string, id: string) => {
  return useQuery({
    queryKey: ['rink', tournamentId, id],
    queryFn: () => rinkApi.getDetail(tournamentId, id),
  })
}

export const useRinkCreate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['rink'],
    mutationFn: (data: Omit<Rink, 'id'>) =>
      rinkApi.create(data.tournamentId, data),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['rinks'],
      })
    },
  })
}

export const useRinkUpdate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['rink'],
    mutationFn: (data: Rink) => rinkApi.update(data.tournamentId, data),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['rinks'],
      })
    },
  })
}

export const useRinkDelete = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['rink'],
    mutationFn: ({ tournamentId, id }: { tournamentId: string; id: string }) =>
      rinkApi.delete(tournamentId, id),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['rinks'],
      })
    },
  })
}
