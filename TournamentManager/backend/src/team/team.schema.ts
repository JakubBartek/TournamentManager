import { z } from 'zod'

export const teamSchema = z.object({
  name: z.string().min(1, 'Team name is required'),
  city: z.string().min(1, 'City is required'),
  tournamentId: z.string(),
  logoUrl: z.string().url('Invalid URL format').optional(),
  description: z.string().optional(),
})

export const teamEditSchema = z.object({
  name: z.string().min(1, 'Team name is required'),
  city: z.string().min(1, 'City is required'),
  tournamentId: z.string(),
  logoUrl: z.string().url('Invalid URL format').optional(),
  description: z.string().optional(),
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
  logoUrl: z.string().url('Invalid URL format').optional(),
  description: z.string().optional(),
})
