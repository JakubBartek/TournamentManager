import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import tournamentApi from '@/api/tournamentApi'
import { Tournament, TournamentCreate } from '@/types/tournament'
import { useNavigate } from 'react-router-dom'

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
  const navigate = useNavigate()

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
      navigate(`/${data.id}/edit/teams`, { state: { fromCreate: true } })
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

export const useTournamentCreateSchedule = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['tournament', 'createSchedule'],
    mutationFn: ({
      tournamentId,
      numberOfGroups,
      autoCreate,
    }: {
      tournamentId: string
      numberOfGroups: number
      autoCreate: boolean
    }) =>
      tournamentApi.createSchedule(tournamentId, numberOfGroups, autoCreate),
    onSettled: async (_data, _error, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['tournament', variables.tournamentId],
      })
    },
  })
}
