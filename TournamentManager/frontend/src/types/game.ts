export enum GameStatus {
  SCHEDULED = 'SCHEDULED',
  LIVE = 'LIVE',
  FINISHED = 'FINISHED',
}

type GameTeam = {
  id: string
  name: string
  groupId: string
  teamColor?: string
}

export type Game = {
  id: string
  team1Id?: string
  team2Id?: string
  date: string // ISO format
  rinkId?: string
  rinkName?: string
  score1: number
  score2: number
  tournamentId: string
  status: GameStatus
  team1?: GameTeam
  team2?: GameTeam
  name?: string
}

export type GameCreate = {
  team1Id?: string
  team2Id?: string
  date: string // ISO format
  rinkId?: string
  rinkName?: string
  score1: number
  score2: number
  tournamentId: string
  status?: GameStatus
  name?: string
}

export type GameQuery = {
  tournamentId?: string
  date?: string // ISO format
  status?: GameStatus
}
