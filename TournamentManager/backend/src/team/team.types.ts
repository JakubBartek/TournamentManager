import { z } from 'zod'
import {
  teamPaginationQuerySchema,
  teamEditSchema,
  teamIdQuerySchema,
  teamQuerySchema,
  teamSchema,
  teamWithPlayersSchema,
} from './team.schema'
import { Player } from '../player/player.types'

export type Team = TeamCreate & z.infer<typeof teamIdQuerySchema>
export type TeamCreate = z.infer<typeof teamSchema>
export type TeamEdit = z.infer<typeof teamEditSchema>
export type GetTeamsOptions = z.infer<typeof teamPaginationQuerySchema>
export type GetTeamDetailsOptions = z.infer<typeof teamQuerySchema>
export type ResponseTeam = Team & { players: Player[] }
export type SimpleTeam = Omit<Team, 'players' | 'description'>
export type TeamWithPlayers = z.infer<typeof teamWithPlayersSchema>
