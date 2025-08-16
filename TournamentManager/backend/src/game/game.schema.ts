import { z } from 'zod'

export const gameStatusSchema = z.enum(['SCHEDULED', 'LIVE', 'FINISHED'])
export const gameTypeEnum = z.enum([
  'FINAL',
  'GROUP',
  'ROUND_OF_16',
  'QUARTER_FINAL',
  'SEMIFINAL',
])

export const gameSchema = z.object({
  team1Id: z.string().uuid('Invalid team1Id').optional(),
  team2Id: z.string().uuid('Invalid team2Id').optional(),
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
  rinkName: z.string().optional(),
  status: gameStatusSchema.optional(),
  placementGameId: z.string().uuid('Invalid placementGameId').optional(),
  name: z.string().optional(),
})

export const gameEditSchema = z.object({
  team1Id: z.string().uuid('Invalid team1Id').optional(),
  team2Id: z.string().uuid('Invalid team2Id').optional(),
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
  rinkName: z.string().optional(),
  status: gameStatusSchema.optional(),
  placementGameId: z.string().uuid('Invalid placementGameId').optional(),
  name: z.string().optional(),
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
