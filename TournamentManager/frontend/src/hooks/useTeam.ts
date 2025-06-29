import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import teamApi from '@/api/teamApi'
import { Team, TeamCreate } from '@/types/team'

export const useTeams = () => {
  return useQuery({
    queryKey: ['teamsHome'],
    queryFn: () => teamApi.getAll(),
  })
}

export const useTeam = (id: string) => {
  return useQuery({
    queryKey: ['team', id],
    queryFn: () => teamApi.getDetail(id),
  })
}

export const useTeamCreate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['team'],
    mutationFn: (team: TeamCreate) => teamApi.create(team),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['teams'],
      })
    },
  })
}

export const useTeamDelete = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['team'],
    mutationFn: (id: string) => teamApi.delete(id),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['teams'],
      })
    },
  })
}

export const useTeamEdit = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['team'],
    mutationFn: (team: Team) => teamApi.update(team),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['teams'],
      })
    },
  })
}
