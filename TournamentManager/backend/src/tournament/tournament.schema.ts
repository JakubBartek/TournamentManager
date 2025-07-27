import { z } from 'zod'

export const tournamentSchema = z.object({
  name: z.string().min(1, 'Tournament name is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
})
export const tournamentEditSchema = z.object({
  name: z.string().min(1, 'Tournament name is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.coerce.date(), // Accepts string or Date and coerces to Date
  endDate: z.coerce.date(),
})

export const tournamentCreateSchema = z.object({
  name: z.string().min(1, 'Tournament name is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  adminPassword: z
    .string()
    .min(8, 'Admin password must be at least 8 characters long'),
})

export const tournamentIdQuerySchema = z.object({
  id: z.string().uuid('Invalid tournament ID format'),
})

export const tournamentPaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  location: z.string().min(1, 'Location is required').optional(),
})

export const tournamentQuerySchema = z.object({
  location: z.string().min(1, 'Location is required').optional(),
})
