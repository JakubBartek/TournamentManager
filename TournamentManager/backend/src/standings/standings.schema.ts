import { z } from 'zod'

/*
model Standing {
  id           String     @id @default(uuid())
  tournament   Tournament @relation(fields: [tournamentId], references: [id])
  tournamentId String
  team         Team       @relation(fields: [teamId], references: [id])
  teamId       String

  wins         Int @default(0)
  draws        Int @default(0)
  losses       Int @default(0)
  goalsFor     Int @default(0)
  goalsAgainst Int @default(0)
  points       Int @default(0)
  position     Int @default(0)
}
*/

export const standingSchema = z.object({
  id: z.string().uuid(),
  tournamentId: z.string().uuid(),
  teamId: z.string().uuid(),
  wins: z.number().int().default(0),
  draws: z.number().int().default(0),
  losses: z.number().int().default(0),
  goalsFor: z.number().int().default(0),
  goalsAgainst: z.number().int().default(0),
  points: z.number().int().default(0),
  position: z.number().int().default(0),
})

export const standingsQuerySchema = z.object({
  tournamentId: z.string().uuid('Invalid tournamentId'),
})

export const standingsEditSchema = z.object({
  tournamentId: z.string().uuid('Invalid tournamentId'),
  teamId: z.string().uuid('Invalid teamId'),
  wins: z
    .number()
    .int()
    .min(0, 'Wins must be a non-negative integer')
    .default(0),
  draws: z
    .number()
    .int()
    .min(0, 'Draws must be a non-negative integer')
    .default(0),
  losses: z
    .number()
    .int()
    .min(0, 'Losses must be a non-negative integer')
    .default(0),
  goalsFor: z
    .number()
    .int()
    .min(0, 'Goals For must be a non-negative integer')
    .default(0),
  goalsAgainst: z
    .number()
    .int()
    .min(0, 'Goals Against must be a non-negative integer')
    .default(0),
  points: z
    .number()
    .int()
    .min(0, 'Points must be a non-negative integer')
    .default(0),
  position: z
    .number()
    .int()
    .min(0, 'Position must be a non-negative integer')
    .default(0),
})
