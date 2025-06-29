export type Player = {
  id: string
  name: string
  position: string
  teamId: string
  tournamentId: string
}

export type PlayerCreate = {
  name: string
  position: string
  teamId: string
  tournamentId: string
}

export type PlayerQuery = {
  name?: string
  teamId?: string
}
