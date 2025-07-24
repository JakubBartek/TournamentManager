import { group } from 'node:console'
import { z } from 'zod'

export const standingSchema = z.object({
  id: z.string().uuid(),
  tournamentId: z.string().uuid(),
  teamId: z.string().uuid(),
  groupId: z.string().uuid(),
  wins: z.number().int().default(0),
  draws: z.number().int().default(0),
  losses: z.number().int().default(0),
  goalsFor: z.number().int().default(0),
  goalsAgainst: z.number().int().default(0),
  points: z.number().int().default(0),
  position: z.number().int().default(0),
  teamName: z.string().min(1, 'Team name is required'),
})

export const standingsQuerySchema = z.object({
  tournamentId: z.string().uuid('Invalid tournamentId'),
})

export const standingsGroupQuerySchema = z.object({
  groupId: z.string().uuid('Invalid groupId'),
  tournamentId: z.string().uuid('Invalid tournamentId'),
})

export const standingsEditSchema = z.object({
  tournamentId: z.string().uuid('Invalid tournamentId'),
  teamId: z.string().uuid('Invalid teamId'),
  groupId: z.string().uuid('Invalid groupId'),
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
  teamName: z.string().min(1, 'Team name is required'),
})
