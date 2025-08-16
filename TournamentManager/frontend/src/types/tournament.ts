import { User } from './auth'

export type Tournament = {
  id: string
  name: string
  startDate: Date
  endDate: Date
  location: string
  tournamentManagers?: User[]
  adminPassword?: string
  gameDuration?: number // in minutes
  breakDuration?: number // in minutes
  zamboniDuration?: number // in minutes
  zamboniInterval?: number // in minutes
  type?: TournamentType
  dailyStartTime?: string // HH:mm format
  dailyEndTime?: string // HH:mm format
}

export enum TournamentType {
  GROUPS = 'GROUPS',
  GROUPS_AND_PLAYOFFS = 'GROUPS_AND_PLAYOFFS',
  GROUPS_AND_PLACEMENT = 'GROUPS_AND_PLACEMENT', // 1vs1, 3v3, etc.
}

export type TournamentCreate = {
  name: string
  startDate: Date
  endDate: Date
  location: string
  adminPassword: string
}

export type TournamentQuery = {
  name?: string
  startDate?: Date // ISO format
  endDate?: Date // ISO format
}
