import { Router } from 'express'
import {
  addNewRink,
  deleteRink,
  getRinks,
  getSingleRink,
  updateRink,
} from './rink.controller'
import { isAdmin } from '../middlewares'

const router = Router({ mergeParams: true })

router.post('/', addNewRink)
router.get('/', getRinks)
router.get('/:id', getSingleRink)
router.put('/:id', updateRink)
router.delete('/:id', deleteRink)

export default router
