import React, { createContext, useContext, useState, useEffect } from 'react'
import { verifyTournamentPassword } from '@/api/tournamentApi'

type TournamentAuthContextType = {
  isAuthenticated: (tournamentId: string) => boolean
  authenticate: (tournamentId: string, password: string) => Promise<boolean>
  logout: (tournamentId?: string) => void
}

const TournamentAuthContext = createContext<TournamentAuthContextType>({
  isAuthenticated: () => false,
  authenticate: async () => false,
  logout: () => {},
})

export const useTournamentAuth = () => useContext(TournamentAuthContext)

export const TournamentAuthProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [authenticatedTournaments, setAuthenticatedTournaments] = useState<
    string[]
  >([])

  useEffect(() => {
    const stored = localStorage.getItem('tournamentAuthIds')
    setAuthenticatedTournaments(stored ? JSON.parse(stored) : [])
  }, [])

  const isAuthenticated = (tournamentId: string) =>
    authenticatedTournaments.includes(tournamentId)

  const authenticate = async (tournamentId: string, password: string) => {
    try {
      const res = await verifyTournamentPassword(tournamentId, password)
      if (res === 200) {
        const updated = [...authenticatedTournaments, tournamentId]
        setAuthenticatedTournaments(updated)
        localStorage.setItem('tournamentAuthIds', JSON.stringify(updated))
        return true
      }
      return false
    } catch {
      return false
    }
  }

  const logout = (tournamentId?: string) => {
    if (tournamentId) {
      const updated = authenticatedTournaments.filter(
        (id) => id !== tournamentId,
      )
      setAuthenticatedTournaments(updated)
      localStorage.setItem('tournamentAuthIds', JSON.stringify(updated))
    } else {
      setAuthenticatedTournaments([])
      localStorage.removeItem('tournamentAuthIds')
    }
  }

  return (
    <TournamentAuthContext.Provider
      value={{ isAuthenticated, authenticate, logout }}
    >
      {children}
    </TournamentAuthContext.Provider>
  )
}
