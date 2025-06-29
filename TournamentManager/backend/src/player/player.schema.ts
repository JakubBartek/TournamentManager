import { z } from 'zod'

/*
model Player {
  id           String      @id @default(uuid())
  name         String
  position     String
  teamId       String
  team         Team        @relation(fields: [teamId], references: [id])
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  Tournament   Tournament? @relation(fields: [tournamentId], references: [id])
  tournamentId String?
}
*/

export const playerSchema = z.object({
  name: z.string().min(1, 'Player name is required'),
  position: z.string().min(1, 'Position is required'),
  teamId: z.string().uuid('Invalid team ID format'),
  tournamentId: z.string().uuid('Invalid tournament ID format').optional(),
})

export const playerEditSchema = z.object({
  name: z.string().min(1, 'Player name is required'),
  position: z.string().min(1, 'Position is required'),
  teamId: z.string().uuid('Invalid team ID format'),
  tournamentId: z.string().uuid('Invalid tournament ID format').optional(),
})

export const playerPaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  tournamentId: z.string().uuid('Invalid tournament ID format').optional(),
})

export const playerQuerySchema = z.object({
  tournamentId: z.string().uuid('Invalid tournament ID format').optional(),
})

export const playerIdQuerySchema = z.object({
  id: z.string().uuid('Invalid player ID format'),
})
