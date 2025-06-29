import { z } from 'zod'

/*
model Tournament {
  id        String    @id @default(uuid())
  name      String
  location  String
  startDate DateTime
  endDate   DateTime
  teams     Team[]
  games     Game[]
  sponsors  Sponsor[]
  Player    Player[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
*/

export const tournamentSchema = z.object({
  name: z.string().min(1, 'Tournament name is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z
    .date()
    .refine((date) => date > new Date(), 'Start date must be in the future'),
  endDate: z
    .date()
    .refine((date) => date > new Date(), 'End date must be in the future'),
})
export const tournamentEditSchema = z.object({
  name: z.string().min(1, 'Tournament name is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z
    .date()
    .refine((date) => date > new Date(), 'Start date must be in the future'),
  endDate: z
    .date()
    .refine((date) => date > new Date(), 'End date must be in the future'),
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
