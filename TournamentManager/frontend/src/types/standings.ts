export type Standings = {
  id: string
  tournamentId: string
  teamId: string
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  points: number
  position: number
}

export type StandingsCreate = Omit<Standings, 'id' | 'position'>
