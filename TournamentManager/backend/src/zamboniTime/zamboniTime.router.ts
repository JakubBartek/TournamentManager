import { Router } from 'express'
import {
  addNewZamboniTime,
  deleteZamboniTime,
  getZamboniTime,
  getZamboniTimes,
  updateZamboniTime,
} from './zamboniTime.controller'

const router = Router({ mergeParams: true })

router.post('/', addNewZamboniTime)
router.get('/:id', getZamboniTime)
router.get('/', getZamboniTimes)
router.put('/:id', updateZamboniTime)
router.delete('/:id', deleteZamboniTime)

export default router
