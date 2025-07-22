import { Router } from 'express'
import {
  addNewGroup,
  deleteGroup,
  updateGroup,
  getSingleGroup,
  getAllGroups,
} from './group.controller'
import { isAdmin } from '../middlewares'

const router = Router({ mergeParams: true })
router.post('/', isAdmin, addNewGroup)
router.get('/', getAllGroups)
router.get('/:id', getSingleGroup)
router.put('/:id', isAdmin, updateGroup)
router.delete('/:id', isAdmin, deleteGroup)

export default router
