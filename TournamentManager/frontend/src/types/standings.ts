import { Group } from './group'

export type Standings = {
  id: string
  tournamentId: string
  teamId: string
  teamName: string
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  points: number
  position: number
  groupId: string
  group?: Group
}

export type StandingsCreate = Omit<Standings, 'id' | 'position'>
