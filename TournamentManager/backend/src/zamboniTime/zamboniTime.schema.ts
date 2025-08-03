import { z } from 'zod'

export const zamboniTimeSchema = z.object({
  id: z.string().uuid('Invalid Zamboni Time ID format'),
  tournamentId: z.string().uuid('Invalid tournament ID format'),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
})

export const zamboniTimeCreateSchema = z.object({
  tournamentId: z.string().uuid('Invalid tournament ID format'),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
})

export const zamboniTimeTournamentIdSchema = z.object({
  tournamentId: z.string().uuid('Invalid tournament ID format'),
})
