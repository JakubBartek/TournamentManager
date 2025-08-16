import { z } from 'zod'
import { messageSchema, messageCreateSchema } from './message.schema'

export type Message = z.infer<typeof messageSchema>
export type MessageCreate = z.infer<typeof messageCreateSchema>
export type MessageUpdate = Partial<MessageCreate>
