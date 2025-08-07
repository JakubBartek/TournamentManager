import { Router } from 'express'
import {
  createMessage,
  deleteMessage,
  updateMessage,
  getMessageById,
  getMessagesByTournamentId,
} from './message.controller'
import { isAdmin } from '../middlewares'

const router = Router({ mergeParams: true })
router.post('/', isAdmin, createMessage)
router.get('/', getMessagesByTournamentId)
router.get('/:id', getMessageById)
router.put('/:id', isAdmin, updateMessage)
router.delete('/:id', isAdmin, deleteMessage)

export default router
