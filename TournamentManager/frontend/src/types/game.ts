export type Game = {
  id: number
  team1: string
  team2: string
  date: string // ISO format
  rink: string
  score1: number
  score2: number
  tournamentId: string
}

export type GameCreate = {
  team1: string
  team2: string
  date: string // ISO format
  rink: string
  score1: number
  score2: number
  tournamentId: string
}

export type GameQuery = {
  tournamentId?: string
  date?: string // ISO format
}
