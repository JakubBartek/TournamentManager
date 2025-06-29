export type Team = {
  id: string
  name: string
  city: string
  tournamentId: string
}

export type TeamCreate = {
  name: string
  city: string
  tournamentId: string
}

export type TeamQuery = {
  name?: string
}
