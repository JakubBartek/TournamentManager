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
  ROUND_ROBIN = 'ROUND_ROBIN',
  SINGLE_ELIMINATION = 'SINGLE_ELIMINATION',
  DOUBLE_ELIMINATION = 'DOUBLE_ELIMINATION',
  SWISS = 'SWISS',
  GROUPS = 'GROUPS',
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
