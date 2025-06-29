import { z } from 'zod'

/*
model Team {
  id           String      @id @default(uuid())
  name         String
  city         String
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  Player       Player[]
  Tournament   Tournament? @relation(fields: [tournamentId], references: [id])
  tournamentId String?
}
*/

export const teamSchema = z.object({
  name: z.string().min(1, 'Team name is required'),
  city: z.string().min(1, 'City is required'),
  tournamentId: z.string(),
})

export const teamEditSchema = z.object({
  name: z.string().min(1, 'Team name is required'),
  city: z.string().min(1, 'City is required'),
  tournamentId: z.string(),
})

export const teamPaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  tournamentId: z.string(),
})

export const teamQuerySchema = z.object({
  tournamentId: z.string(),
})

export const teamIdQuerySchema = z.object({
  id: z.string().uuid('Invalid team ID format'),
})

export const teamWithPlayersSchema = z.object({
  id: z.string().uuid('Invalid team ID format'),
  name: z.string(),
  city: z.string(),
  players: z.array(
    z.object({
      id: z.string().uuid('Invalid player ID format'),
      name: z.string(),
      position: z.string(),
    }),
  ),
  tournamentId: z.string(),
})
