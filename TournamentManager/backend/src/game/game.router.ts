import { Router } from 'express'
import {
  addNewGame,
  deleteGame,
  getGames,
  getSingleGame,
  updateGame,
} from './game.controller'
import { isAdmin } from '../middlewares'

const router = Router({ mergeParams: true })

router.post('/', isAdmin, addNewGame)
router.get('/', getGames)
router.get('/:id', getSingleGame)
router.put('/:id', isAdmin, updateGame)
router.delete('/:id', isAdmin, deleteGame)

export default router
