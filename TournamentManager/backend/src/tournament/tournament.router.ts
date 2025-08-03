import { Router } from 'express'
import {
  addNewTournament,
  createScheduleController,
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
router.put('/:id', updateTournament)
router.delete('/:id', deleteTournament)
router.post('/:id/create-schedule', createScheduleController)

export default router
