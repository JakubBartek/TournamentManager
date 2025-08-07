import { z } from 'zod'

export const messageType = z.enum(['INFO', 'ALERT'], {
  errorMap: () => ({ message: 'Invalid message type' }),
})

export const messageSchema = z.object({
  id: z.string().uuid(),
  tournamentId: z.string().uuid(),
  content: z.string().min(1, 'Content cannot be empty'),
  priority: z.number().min(0).optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  type: messageType,
})

export const messageCreateSchema = z.object({
  tournamentId: z.string().uuid(),
  content: z.string().min(1, 'Content cannot be empty'),
  priority: z.number().min(0).optional(),
  type: messageType,
})

export const messageUpdateSchema = messageCreateSchema.partial().extend({
  id: z.string().uuid(),
})
export const messageIdSchema = z.object({
  id: z.string().uuid('Invalid message ID format'),
})
