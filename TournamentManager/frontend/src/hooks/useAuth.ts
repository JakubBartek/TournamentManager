import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AuthApi from '@/api/authApi.ts'

export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['user'],
    mutationFn: AuthApi.login,
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['user'],
      })
    },
  })
}

export const useRegister = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['user'],
    mutationFn: AuthApi.register,
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['user'],
      })
    },
  })
}

export const useProfile = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: AuthApi.getProfile,
    retry: false,
    enabled: false,
  })
}

export const useRefreshToken = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['user'],
    mutationFn: AuthApi.refreshToken,
    retry: false,
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['user'],
      })
    },
  })
}
