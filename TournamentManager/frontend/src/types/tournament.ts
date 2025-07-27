import { User } from './auth'

export type Tournament = {
  id: string
  name: string
  startDate: Date
  endDate: Date
  location: string
  tournamentManagers?: User[]
  adminPassword?: string
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
