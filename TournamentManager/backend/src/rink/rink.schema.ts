import { z } from 'zod'

export const rinkSchema = z.object({
  id: z.string().uuid('Invalid Rink ID format'),
  name: z.string().min(1, 'Rink name is required'),
  tournamentId: z.string().uuid('Invalid tournament ID format'),
})

export const rinkCreateSchema = z.object({
  name: z.string().min(1, 'Rink name is required'),
  tournamentId: z.string().uuid('Invalid tournament ID format'),
})

export const rinkIdQuerySchema = z.object({
  id: z.string().uuid('Invalid Rink ID format'),
})
