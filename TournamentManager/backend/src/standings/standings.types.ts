import { z } from 'zod'
import {
  standingSchema,
  standingsQuerySchema,
  standingsEditSchema,
} from './standings.schema'

export type Standings = z.infer<typeof standingSchema>
export type GetStandingsOptions = z.infer<typeof standingsQuerySchema>
export type StandingsEdit = z.infer<typeof standingsEditSchema>
export type StandingsCreate = Omit<Standings, 'id' | 'position'>
export type StandingsUpdate = Omit<
  Standings,
  'id' | 'tournamentId' | 'teamId' | 'position'
>
