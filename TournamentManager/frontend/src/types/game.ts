export enum GameStatus {
  SCHEDULED = 'SCHEDULED',
  LIVE = 'LIVE',
  FINISHED = 'FINISHED',
}

export type Game = {
  id: number
  team1Id: string
  team2Id: string
  date: string // ISO format
  rink: string
  score1: number
  score2: number
  tournamentId: string
  status: GameStatus
}

export type GameCreate = {
  team1Id: string
  team2Id: string
  date: string // ISO format
  rink: string
  score1: number
  score2: number
  tournamentId: string
  status?: GameStatus
}

export type GameQuery = {
  tournamentId?: string
  date?: string // ISO format
  status?: GameStatus
}
