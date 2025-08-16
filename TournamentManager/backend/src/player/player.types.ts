import { z } from 'zod'
import {
  playerPaginationQuerySchema,
  playerEditSchema,
  playerIdQuerySchema,
  playerQuerySchema,
  playerSchema,
} from './player.schema'

export type PlayerCreate = z.infer<typeof playerSchema>
export type Player = PlayerCreate & z.infer<typeof playerIdQuerySchema>
export type PlayerEdit = z.infer<typeof playerEditSchema>
export type GetPlayersOptions = z.infer<typeof playerPaginationQuerySchema>
export type GetPlayerDetailsOptions = z.infer<typeof playerQuerySchema>
