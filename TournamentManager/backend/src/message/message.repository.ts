import db from '../db'
import { Message, MessageCreate, MessageUpdate } from './message.types'

const createMessage = async (data: MessageCreate) => {
  return db.message.create({
    data: {
      ...data,
    },
  })
}

const updateMessage = async (id: string, data: MessageUpdate) => {
  return db.message.update({
    where: { id },
    data: {
      ...data,
    },
  })
}

const deleteMessage = async (id: string) => {
  return db.message.delete({
    where: { id },
  })
}

const getMessageById = async (id: string) => {
  const message = await db.message.findUnique({
    where: { id },
  })
  if (!message) {
    throw new Error(`Message with id ${id} not found`)
  }
  return message
}

const getMessagesByTournamentId = async (tournamentId: string) => {
  return db.message.findMany({
    where: { tournamentId },
    orderBy: [
      { type: 'asc' }, // Assuming 'alert' is the highest value for type
      { priority: 'desc' }, // Highest priority first
      { createdAt: 'desc' }, // Most recent first
    ],
  })
}

export default {
  createMessage,
  updateMessage,
  deleteMessage,
  getMessageById,
  getMessagesByTournamentId,
}
