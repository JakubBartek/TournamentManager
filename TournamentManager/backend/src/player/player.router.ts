import { Router } from 'express'
import {
  addNewPlayer,
  deletePlayer,
  getAllPlayers,
  updatePlayer,
  getPlayersOfTeam,
} from './player.controller'
import { isAdmin } from '../middlewares'

const router = Router({ mergeParams: true })

router.post('/', isAdmin, addNewPlayer)
router.get('/', getAllPlayers)
router.get('/:teamId', getPlayersOfTeam)
router.put('/:id', isAdmin, updatePlayer)
router.delete('/:id', isAdmin, deletePlayer)

export default router
