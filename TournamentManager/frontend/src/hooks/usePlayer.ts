import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import playerApi from '@/api/playerApi'
import { Player, PlayerCreate } from '@/types/player'

export const usePlayers = () => {
  return useQuery({
    queryKey: ['playersHome'],
    queryFn: () => playerApi.getAll(),
  })
}

export const usePlayer = (id: string) => {
  return useQuery({
    queryKey: ['player', id],
    queryFn: () => playerApi.getDetail(id),
  })
}

export const usePlayerCreate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['player'],
    mutationFn: (player: PlayerCreate) => playerApi.create(player),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['players'],
      })
    },
  })
}

export const usePlayerDelete = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['player'],
    mutationFn: (id: string) => playerApi.delete(id),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['players'],
      })
    },
  })
}

export const usePlayerEdit = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['player'],
    mutationFn: (player: Player) => playerApi.update(player),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['players'],
      })
    },
  })
}
