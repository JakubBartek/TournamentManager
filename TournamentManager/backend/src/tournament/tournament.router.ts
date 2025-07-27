import { Router } from 'express'
import {
  addNewTournament,
  deleteTournament,
  getAllTournaments,
  getPaginatedTournaments,
  getSingleTournament,
  updateTournament,
} from './tournament.controller'
import { isAdmin } from '../middlewares'

const router = Router({ mergeParams: true })

router.post('/', addNewTournament)
router.get('/', getPaginatedTournaments)
router.get('/all', getAllTournaments)
router.get('/:id', getSingleTournament)
router.put('/:id', isAdmin, updateTournament)
router.delete('/:id', isAdmin, deleteTournament)

export default router
