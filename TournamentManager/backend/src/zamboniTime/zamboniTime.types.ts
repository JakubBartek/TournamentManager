import { z } from 'zod'
import { zamboniTimeSchema } from './zamboniTime.schema'

export type ZamboniTime = z.infer<typeof zamboniTimeSchema>
export type ZamboniTimeCreate = Omit<ZamboniTime, 'id'>
