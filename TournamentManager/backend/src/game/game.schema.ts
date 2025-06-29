import { z } from 'zod'

/*
model Game {
  id           String      @id @default(uuid())
  team1        String
  team2        String
  score1       Int
  score2       Int
  rink         String
  date         DateTime
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  Tournament   Tournament? @relation(fields: [tournamentId], references: [id])
  tournamentId String?
}
*/

export const gameSchema = z.object({
  team1: z.string().min(1, 'Team 1 is required'),
  team2: z.string().min(1, 'Team 2 is required'),
  score1: z.number().int().min(0, 'Score 1 must be a non-negative integer'),
  score2: z.number().int().min(0, 'Score 2 must be a non-negative integer'),
  rink: z.string().min(1, 'Rink is required'),
  date: z
    .date()
    .refine((date) => date > new Date(), 'Date must be in the future'),
  tournamentId: z.string().optional(),
})

export const gameEditSchema = z.object({
  team1: z.string().min(1, 'Team 1 is required'),
  team2: z.string().min(1, 'Team 2 is required'),
  score1: z.number().int().min(0, 'Score 1 must be a non-negative integer'),
  score2: z.number().int().min(0, 'Score 2 must be a non-negative integer'),
  rink: z.string().min(1, 'Rink is required'),
  date: z
    .date()
    .refine((date) => date > new Date(), 'Date must be in the future'),
  tournamentId: z.string().optional(),
})

export const gamePaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  date: z.coerce.date().optional(),
  tournamentId: z.string().optional(),
})

export const gameQuerySchema = z.object({
  tournamentId: z.string().optional(),
})

export const gameIdQuerySchema = z.object({
  id: z.string().uuid('Invalid game ID format'),
})
