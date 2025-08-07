import { z } from 'zod'

export const tournamentTypeEnum = z.enum([
  'GROUPS',
  'GROUPS_AND_PLAYOFFS',
  'GROUPS_AND_PLACEMENT', // 1vs1, 3v3, etc.
])

export const playOffRoundEnum = z.enum([
  'ROUND_OF_16',
  'QUARTER_FINALS',
  'SEMIFINALS',
  'FINAL',
])

export const tournamentSchema = z.object({
  name: z.string().min(1, 'Tournament name is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
})
export const tournamentEditSchema = z.object({
  name: z.string().min(1, 'Tournament name is required').optional(),
  location: z.string().min(1, 'Location is required').optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  adminPasswordHash: z.string().min(1, 'Admin password is required').optional(),
  gameDuration: z.coerce
    .number()
    .int()
    .min(0, 'Game duration must be a non-negative integer')
    .optional(),
  breakDuration: z.coerce
    .number()
    .int()
    .min(0, 'Break duration must be a non-negative integer')
    .optional(),
  zamboniDuration: z.coerce
    .number()
    .int()
    .min(0, 'Zamboni duration must be a non-negative integer')
    .optional(),
  zamboniInterval: z.coerce
    .number()
    .int()
    .min(0, 'Zamboni interval must be a non-negative integer')
    .optional(),
  type: tournamentTypeEnum.optional(),
  playOffRound: playOffRoundEnum.optional(),
  dailyStartTime: z.string().optional(), // HH:mm format
  dailyEndTime: z.string().optional(), // HH:mm format
})

export const tournamentFullSchema = z.object({
  name: z.string().min(1, 'Tournament name is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  adminPasswordHash: z.string().min(1, 'Admin password is required'),
  gameDuration: z.coerce
    .number()
    .int()
    .min(0, 'Game duration must be a non-negative integer'),
  breakDuration: z.coerce
    .number()
    .int()
    .min(0, 'Break duration must be a non-negative integer'),
  zamboniDuration: z.coerce
    .number()
    .int()
    .min(0, 'Zamboni duration must be a non-negative integer'),
  zamboniInterval: z.coerce
    .number()
    .int()
    .min(0, 'Zamboni interval must be a non-negative integer'),
  type: tournamentTypeEnum,
  dailyStartTime: z.string(), // HH:mm format
  dailyEndTime: z.string(), // HH:mm format
})

export const tournamentCreateSchema = z.object({
  name: z.string().min(1, 'Tournament name is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  adminPassword: z
    .string()
    .min(1, 'Admin password must be at least 1 character long'),
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
