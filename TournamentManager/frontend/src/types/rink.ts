export type Rink = {
  id: string
  name: string
  tournamentId: string
}
export type RinkCreate = {
  name: string
  tournamentId: string
}
export type RinkEdit = {
  id: string
  name: string
  tournamentId: string
}
export type RinkIdQuery = {
  id: string
}
