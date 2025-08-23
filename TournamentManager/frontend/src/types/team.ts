import { Group } from './group'
import { Standings } from './standings'

export type Team = {
  id: string
  name: string
  city: string
  tournamentId: string
  logoUrl?: string
  description?: string
  standing: Standings | null
  groupId?: string
  group?: Group
  roomNumber?: string
  teamColor?: string
}

export type TeamCreate = {
  name: string
  city: string
  tournamentId: string
  logoUrl?: string
  description?: string
  roomNumber?: string
  teamColor?: string
}

export type TeamQuery = {
  name?: string
}
