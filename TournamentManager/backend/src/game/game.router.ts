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

router.post('/', addNewGame)
router.get('/', getGames)
router.get('/:id', getSingleGame)
router.put('/:id', updateGame)
router.delete('/:id', deleteGame)

export default router
