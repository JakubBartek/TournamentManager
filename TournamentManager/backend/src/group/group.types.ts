import { z } from 'zod'
import { groupSchema, groupEditSchema, groupIdSchema } from './group.schema'

export type Group = z.infer<typeof groupSchema>
export type GroupCreate = z.infer<typeof groupSchema>
export type GroupEdit = z.infer<typeof groupEditSchema>
export type GroupUpdate = Omit<Group, 'id' | 'tournamentId'>
export type GroupId = z.infer<typeof groupIdSchema>
