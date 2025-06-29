import { Router } from 'express'
import {
  addNewTeam,
  deleteTeam,
  getAllTeams,
  updateTeam,
  getSingleTeam,
} from './team.controller'
import { isAdmin } from '../middlewares'

const router = Router({ mergeParams: true })

router.post('/', isAdmin, addNewTeam)
router.get('/', getAllTeams)
router.get('/:id', getSingleTeam)
router.put('/:id', isAdmin, updateTeam)
router.delete('/:id', isAdmin, deleteTeam)

export default router
