import { z } from 'zod'
import {
  gamePaginationQuerySchema,
  gameEditSchema,
  gameIdQuerySchema,
  gameQuerySchema,
  gameSchema,
} from './game.schema'

export type Game = GameCreate & z.infer<typeof gameIdQuerySchema>
export type GameCreate = z.infer<typeof gameSchema>
export type GameEdit = z.infer<typeof gameEditSchema>
export type GetGamesOptions = z.infer<typeof gamePaginationQuerySchema>
export type GetGameDeatilsOptions = z.infer<typeof gameQuerySchema>

export type ResponseGame = Game & { references: Game[] }

export type SimpleGame = Omit<Game, 'references' | 'description'>
