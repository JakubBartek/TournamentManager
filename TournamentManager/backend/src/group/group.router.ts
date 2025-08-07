import { Router } from 'express'
import {
  addNewGroup,
  deleteGroup,
  updateGroup,
  getSingleGroup,
  getAllGroups,
} from './group.controller'
import { recalculateGroupStandings } from '../standings/standings.controller'

const router = Router({ mergeParams: true })
router.post('/', addNewGroup)
router.get('/', getAllGroups)
router.get('/:id', getSingleGroup)
router.put('/:id', updateGroup)
router.delete('/:id', deleteGroup)
router.post('/:id/calculate', recalculateGroupStandings)

export default router
