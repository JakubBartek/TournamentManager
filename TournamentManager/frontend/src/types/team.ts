export type Team = {
  id: string
  name: string
  city: string
  tournamentId: string
  logoUrl?: string
  description?: string
}

export type TeamCreate = {
  name: string
  city: string
  tournamentId: string
  logoUrl?: string
  description?: string
}

export type TeamQuery = {
  name?: string
}
