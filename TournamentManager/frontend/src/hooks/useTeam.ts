import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import teamApi from '@/api/teamApi'
import { Team, TeamCreate } from '@/types/team'

// Modified useTeams to accept tournamentId
export const useTeams = (tournamentId: string) => {
  return useQuery({
    queryKey: ['teams', tournamentId], // Include tournamentId in queryKey
    queryFn: () => teamApi.getAll(tournamentId), // Pass tournamentId to getAll
    enabled: !!tournamentId, // Only enable query if tournamentId is provided
  })
}

export const useTeam = (tournamentId: string, teamId: string) => {
  return useQuery({
    queryKey: ['team', tournamentId, teamId], // Include tournamentId and teamId in queryKey
    queryFn: () => teamApi.getDetail(tournamentId, teamId), // Pass both IDs
    enabled: !!tournamentId && !!teamId, // Only enable if both IDs are provided
  })
}

export const useTeamCreate = (tournamentId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['team', tournamentId], // Include tournamentId in mutationKey
    mutationFn: (team: TeamCreate) => teamApi.create(tournamentId, team), // Pass tournamentId
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['teams', tournamentId], // Invalidate with tournamentId
      })
    },
  })
}

export const useTeamDelete = (tournamentId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['team', tournamentId], // Include tournamentId in mutationKey
    mutationFn: (teamId: string) => teamApi.delete(tournamentId, teamId), // Pass tournamentId
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['teams', tournamentId], // Invalidate with tournamentId
      })
    },
  })
}

export const useTeamEdit = (tournamentId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['team', tournamentId], // Include tournamentId in mutationKey
    mutationFn: (team: Team) => teamApi.update(tournamentId, team), // Pass tournamentId
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['teams', tournamentId], // Invalidate with tournamentId
      })
    },
  })
}
