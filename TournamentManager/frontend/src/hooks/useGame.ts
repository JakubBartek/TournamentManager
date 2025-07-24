import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import gameApi from '@/api/gameApi'
import { Game, GameCreate } from '@/types/game'

export const useGames = (tournamentId: string) => {
  return useQuery({
    queryKey: ['games', tournamentId],
    queryFn: () => gameApi.getAll(tournamentId),
    enabled: !!tournamentId,
  })
}

export const useGame = (id: string) => {
  return useQuery({
    queryKey: ['game', id],
    queryFn: () => gameApi.getDetail(id),
  })
}

export const useGameCreate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['game'],
    mutationFn: (game: GameCreate) => gameApi.create(game),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['games'],
      })
    },
  })
}

export const useGameDelete = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['game'],
    mutationFn: (id: string) => gameApi.delete(id),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['games'],
      })
    },
  })
}

export const useGameEdit = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['game'],
    mutationFn: (game: Game) => gameApi.update(game),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['games'],
      })
    },
  })
}
