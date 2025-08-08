import { Router } from 'express'
import {
  addNewTournament,
  createScheduleController,
  deleteTournament,
  getAllTournaments,
  getPaginatedTournaments,
  getSingleTournament,
  updateTournament,
  verifyTournamentPassword,
} from './tournament.controller'
import { isAdmin } from '../middlewares'

const router = Router({ mergeParams: true })

router.post('/', addNewTournament)
router.get('/', getPaginatedTournaments)
router.get('/all', getAllTournaments)
router.get('/:id', getSingleTournament)
router.put('/:id', updateTournament)
router.delete('/:id', deleteTournament)
router.post('/:id/create-schedule', createScheduleController)
router.post('/:id/verify-password', verifyTournamentPassword)

export default router
