import { createContext, ReactNode, useEffect } from 'react'
import { Tokens, User } from '@/types/auth.ts'
import { useProfile, useRefreshToken } from '@/hooks/useAuth.ts'
import { useQueryClient } from '@tanstack/react-query'

interface Props {
  children: ReactNode
}

interface AuthContextType {
  user: User | null
  isFetching: boolean
  setTokens: (token: Tokens | null) => void
}

const defaultAuthContext = (): AuthContextType => ({
  user: null,
  isFetching: false,
  setTokens: () => {},
})

export const AuthContext = createContext<AuthContextType>(defaultAuthContext())

export const AuthProvider = ({ children }: Props) => {
  // const [accessToken, setAccessToken] = useState<string | null>(null)
  // const [refreshToken, setRefreshToken] = useState<string | null>(null)

  const { data: user, refetch, isRefetching } = useProfile()

  const { mutate: getNewTokens, isPending } = useRefreshToken()
  const queryClient = useQueryClient()

  const setTokensToLocalStorage = async (tokens: Tokens | null) => {
    if (!tokens) {
      localStorage.clear()
      queryClient.setQueryData(['user'], null)
      return
    }

    // setAccessToken(tokens.accessToken)
    localStorage.setItem('accessToken', tokens.accessToken)
    // setRefreshToken(tokens.refreshToken)
    localStorage.setItem('refreshToken', tokens.refreshToken)

    await refetch()
    // if (user) {
    //     localStorage.setItem("user", JSON.stringify(user))
    //     setCookie("user", JSON.stringify(user), {
    //         maxAge: 7 * 24 * 60 * 60,
    //     })
    // } else {
    //     removeCookie("user")
    // }
  }

  // If "should" have a refresh token
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')

    if (!accessToken || !refreshToken) {
      return
    }

    getNewTokens(undefined, {
      onSuccess: async (data) => {
        await setTokensToLocalStorage(data)
      },
      onError: async () => {
        await setTokensToLocalStorage({ accessToken, refreshToken })
      },
    })
  }, [refetch])

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isFetching: isPending || isRefetching,
        setTokens: setTokensToLocalStorage,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
