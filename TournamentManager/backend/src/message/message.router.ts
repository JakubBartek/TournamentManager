import { Router } from 'express'
import {
  createMessage,
  deleteMessage,
  updateMessage,
  getMessageById,
  getMessagesByTournamentId,
} from './message.controller'

const router = Router({ mergeParams: true })
router.post('/', createMessage)
router.get('/', getMessagesByTournamentId)
router.get('/:id', getMessageById)
router.put('/:id', updateMessage)
router.delete('/:id', deleteMessage)

export default router
