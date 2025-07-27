import { z } from 'zod'
import {
  tournamentCreateSchema,
  tournamentEditSchema,
  tournamentIdQuerySchema,
  tournamentPaginationQuerySchema,
  tournamentSchema,
} from './tournament.schema'

export type TournamentCreate = z.infer<typeof tournamentCreateSchema>
export type Tournament = z.infer<typeof tournamentSchema> &
  z.infer<typeof tournamentIdQuerySchema>
export type TournamentEdit = z.infer<typeof tournamentEditSchema>
export type GetTournamentsOptions = z.infer<typeof tournamentIdQuerySchema>
export type GetTournamentDetailsOptions = z.infer<
  typeof tournamentIdQuerySchema
>
export type TournamentPaginationQuery = z.infer<
  typeof tournamentPaginationQuerySchema
>
