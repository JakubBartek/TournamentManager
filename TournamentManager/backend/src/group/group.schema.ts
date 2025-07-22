import { z } from 'zod'

export const groupSchema = z.object({
  name: z.string().min(1, 'Group name is required'),
  tournamentId: z.string().uuid('Invalid tournament ID format'),
})

export const groupEditSchema = z.object({
  name: z.string().min(1, 'Group name is required'),
})

export const groupIdSchema = z.object({
  id: z.string().uuid('Invalid group ID format'),
})
