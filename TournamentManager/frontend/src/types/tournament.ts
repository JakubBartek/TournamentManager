export type Tournament = {
  id: string
  name: string
  startDate: string
  endDate: string
  location: string
}

export type TournamentCreate = {
  name: string
  startDate: string
  endDate: string
  location: string
}

export type TournamentQuery = {
  name?: string
  startDate?: string // ISO format
  endDate?: string // ISO format
}
