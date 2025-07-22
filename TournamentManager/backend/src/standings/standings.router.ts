import { Router } from 'express'
import {
  getStandings,
  createStandings,
  updateStandings,
  deleteStandings,
  calculateStandings,
} from './standings.controller'
import { isAdmin } from '../middlewares'

const router = Router({ mergeParams: true })

router.get('/', getStandings)
router.post('/', isAdmin, createStandings)
router.put('/:id', isAdmin, updateStandings)
router.delete('/:id', isAdmin, deleteStandings)
router.post('/calculate', isAdmin, calculateStandings)

export default router
