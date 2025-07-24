import { Router } from 'express'
import {
  getStandings,
  createStandings,
  updateStandings,
  deleteStandings,
  calculateStandings,
  getTournamentStandings,
} from './standings.controller'
import { isAdmin } from '../middlewares'

const router = Router({ mergeParams: true })

router.get('/', getTournamentStandings)
router.post('/', isAdmin, createStandings)
router.put('/:id', isAdmin, updateStandings)
router.delete('/:id', isAdmin, deleteStandings)
router.post('/calculate', calculateStandings)

export default router
