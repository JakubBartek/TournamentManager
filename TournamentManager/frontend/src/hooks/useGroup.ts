import groupApi from '@/api/groupApi'
import { Group, GroupCreate } from '@/types/group'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGroups = (tournamentId: string) => {
  return useQuery({
    queryKey: ['groups', tournamentId],
    queryFn: () => groupApi.getAll(tournamentId),
    enabled: !!tournamentId,
  })
}

export const useGroupCreate = (tournamentId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['groups', tournamentId],
    mutationFn: (data: GroupCreate) => groupApi.create(tournamentId, data),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['groups', tournamentId],
      })
    },
  })
}

export const useGroupEdit = (tournamentId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['groups', tournamentId],
    mutationFn: (data: Group) => groupApi.update(tournamentId, data),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['groups', tournamentId],
      })
    },
  })
}

export const useGroupDelete = (tournamentId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['groups', tournamentId],
    mutationFn: (id: string) => groupApi.delete(tournamentId, id),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['groups', tournamentId],
      })
    },
  })
}

export const useGroupUpdate = (tournamentId: string, groupId: string) => {
  return useQuery({
    queryKey: ['group', tournamentId, groupId],
    queryFn: () =>
      groupApi
        .getAll(tournamentId)
        .then((groups) => groups.find((group) => group.id === groupId)),
    enabled: !!tournamentId && !!groupId, // prevents fetching if either is undefined
  })
}

export const useCalculateGroupStandings = (
  tournamentId: string,
  groupId: string,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['groups', tournamentId, groupId, 'calculate'],
    mutationFn: () => groupApi.calculateStandings(tournamentId, groupId),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['groups', tournamentId],
      })
      await queryClient.invalidateQueries({
        queryKey: ['standings', tournamentId],
      })
    },
  })
}
