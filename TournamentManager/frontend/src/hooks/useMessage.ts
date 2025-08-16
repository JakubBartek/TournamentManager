import messageApi from '../api/messageApi'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Message, MessageCreate } from '@/types/message'

export const useMessages = (tournamentId: string) => {
  return useQuery({
    queryKey: ['messages', tournamentId],
    queryFn: () => messageApi.getAll(tournamentId),
  })
}

export const useMessage = (tournamentId: string, id: string) => {
  return useQuery({
    queryKey: ['message', tournamentId, id],
    queryFn: () => messageApi.getDetail(tournamentId, id),
  })
}

export const useMessageCreate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['message'],
    mutationFn: (data: MessageCreate & { tournamentId: string }) =>
      messageApi.create(data.tournamentId, data),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['messages'],
      })
    },
  })
}

export const useMessageUpdate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['message'],
    mutationFn: (data: Message & { tournamentId: string }) =>
      messageApi.update(data.tournamentId, data),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['messages'],
      })
    },
  })
}

export const useMessageDelete = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['message'],
    mutationFn: ({ tournamentId, id }: { tournamentId: string; id: string }) =>
      messageApi.delete(tournamentId, id),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['messages'],
      })
    },
  })
}
