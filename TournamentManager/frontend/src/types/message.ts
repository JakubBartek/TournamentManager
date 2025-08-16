export enum MessageType {
  INFO = 'INFO',
  ALERT = 'ALERT',
}

export type Message = {
  id: string
  content: string
  priority: number
  tournamentId: string
  createdAt: Date
  updatedAt: Date
  type: MessageType
}
export type MessageCreate = Omit<Message, 'id' | 'createdAt' | 'updatedAt'> & {
  tournamentId: string
}
export type MessageUpdate = Partial<MessageCreate>
export type MessageInput = Omit<Message, 'id' | 'createdAt' | 'updatedAt'> & {
  tournamentId: string
}
