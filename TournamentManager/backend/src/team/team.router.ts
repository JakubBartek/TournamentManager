import { Router } from 'express'
import {
  addNewTeam,
  deleteTeam,
  getAllTeams,
  updateTeam,
  getSingleTeam,
} from './team.controller'

const router = Router({ mergeParams: true })

router.post('/', addNewTeam)
router.get('/', getAllTeams)
router.get('/:id', getSingleTeam)
router.put('/:id', updateTeam)
router.delete('/:id', deleteTeam)

export default router
