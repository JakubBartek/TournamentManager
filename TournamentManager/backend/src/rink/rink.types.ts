import { z } from 'zod'
import { rinkCreateSchema, rinkIdQuerySchema, rinkSchema } from './rink.schema'

export type Rink = z.infer<typeof rinkSchema>
export type RinkCreate = z.infer<typeof rinkCreateSchema>
export type RinkIdQuery = z.infer<typeof rinkIdQuerySchema>
export type RinkEdit = Omit<Rink, 'id'> & RinkIdQuery
