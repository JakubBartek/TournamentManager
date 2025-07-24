import { Team } from '@/types/team'
import { Standings } from './standings'

export type Group = {
  id: string
  name: string
  tournamentId: string
  Teams?: Team[]
  Standings?: Standings[]
}

export type GroupCreate = Omit<Group, 'id'>
