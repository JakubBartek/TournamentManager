import { z } from 'zod'

export const gameStatusSchema = z.enum(['SCHEDULED', 'LIVE', 'FINISHED'])

export const gameSchema = z.object({
  team1Id: z.string().uuid('Invalid team1Id'),
  team2Id: z.string().uuid('Invalid team2Id'),
  score1: z
    .number()
    .int()
    .min(0, 'Score 1 must be a non-negative integer')
    .optional(),
  score2: z
    .number()
    .int()
    .min(0, 'Score 2 must be a non-negative integer')
    .optional(),
  date: z.coerce.date(),
  tournamentId: z.string().uuid('Invalid tournamentId').optional(), // TODO: THIS IS NOT OPTIONAL, BUT MAKING IT REQUIRED BREAKS THE APP AND I DONT HAVE BRAIN POWER TO FIX IT
  rinkId: z.string().uuid('Invalid rinkId').optional(),
  status: gameStatusSchema.optional(),
})

export const gameEditSchema = z.object({
  team1Id: z.string().uuid('Invalid team1Id'),
  team2Id: z.string().uuid('Invalid team2Id'),
  score1: z
    .number()
    .int()
    .min(0, 'Score 1 must be a non-negative integer')
    .optional(),
  score2: z
    .number()
    .int()
    .min(0, 'Score 2 must be a non-negative integer')
    .optional(),
  date: z.coerce.date(),
  tournamentId: z.string().uuid('Invalid tournamentId').optional(),
  rinkId: z.string().uuid('Invalid rinkId').optional(),
  status: gameStatusSchema.optional(),
})

export const gamePaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  date: z.coerce.date().optional(),
  tournamentId: z.string().uuid('Invalid tournamentId').optional(),
})

export const gameQuerySchema = z.object({
  tournamentId: z.string().uuid('Invalid tournamentId').optional(),
})

export const gameIdQuerySchema = z.object({
  id: z.string().uuid('Invalid game ID format'),
})
