import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import tournamentApi from '@/api/tournamentApi'
import { Tournament, TournamentCreate } from '@/types/tournament'

export const useTournaments = () => {
  return useQuery({
    queryKey: ['tournaments'],
    queryFn: () => tournamentApi.getAll(),
  })
}

export const useTournament = (id: string) => {
  return useQuery({
    queryKey: ['tournament', id],
    queryFn: () => tournamentApi.getDetail(id),
  })
}

export const useTournamentCreate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['tournament'],
    mutationFn: (tournament: TournamentCreate) =>
      tournamentApi.create(tournament),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['tournaments'],
      })
    },
  })
}

export const useTournamentCreateAndGoToEditTeams = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['tournament'],
    mutationFn: (tournament: TournamentCreate) =>
      tournamentApi.create(tournament),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['tournaments'],
      })
    },
    onSuccess: (data) => {
      // Navigate to the edit teams page after successful creation
      window.location.href = `/${data.id}/edit/teams`
    },
  })
}

export const useTournamentDelete = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['tournament'],
    mutationFn: (id: string) => tournamentApi.delete(id),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['tournaments'],
      })
    },
  })
}

export const useTournamentEdit = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['tournament'],
    mutationFn: (tournament: Tournament) => tournamentApi.update(tournament),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['tournaments'],
      })
    },
  })
}
