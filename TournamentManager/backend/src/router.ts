import { Router, Response, Request, NextFunction } from 'express'
import httpErr, { HttpError } from 'http-errors'
import authRoutes from './auth/auth.router'
import tournamentRoutes from './tournament/tournament.router'
import gameRoutes from './game/game.router'
import playerRoutes from './player/player.router'
import teamRoutes from './team/team.router'
import groupRoutes from './group/group.router'
import standingsRoutes from './standings/standings.router'
import zamboniRoutes from './zamboniTime/zamboniTime.router'
import rinkRoutes from './rink/rink.router'
import { isAuthenticated } from './middlewares'
import { ValidationError } from 'zod-validation-error'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

const router = Router()
// TODO: ADD ROUTES HERE
router.use('/auth', authRoutes)
router.use('/tournaments', tournamentRoutes)
router.use('/tournaments/:tournamentId/games', gameRoutes)
router.use('/tournaments/:tournamentId/teams/:teamId/players', playerRoutes)
router.use('/tournaments/:tournamentId/teams', teamRoutes)
router.use('/tournaments/:tournamentId/groups', groupRoutes)
router.use('/tournaments/:tournamentId/standings', standingsRoutes)
router.use('/tournaments/:tournamentId/zamboni-time', zamboniRoutes)
router.use('/tournaments/:tournamentId/rinks', rinkRoutes)

router.get('/', isAuthenticated, (_req: Request, res: Response) => {
  res.send('Hello World!').status(200)
})

// ** DO NOT ADD ANY ROUTES AFTER THIS LINE **

router.use(async (_req, _res, next) => {
  next(httpErr.NotFound('Route not Found'))
})

router.use(
  (error: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        status: 400,
        name: error.name,
        message: error.message,
      })
    } else if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res.status(400).json({
          status: 400,
          message: 'Unique constraint failed',
        })
      } else if (error.code === 'P2003') {
        return res.status(400).json({
          status: 400,
          message: 'Foreign key constraint failed',
        })
      } else if (error.code === 'P2025') {
        // Record to delete does not exists
        return res.status(200).send()
      } else {
        console.error(error)
        return res.status(500).json({
          status: 500,
          message: 'Something went wrong. Please try again later.',
        })
      }
    } else if (error instanceof HttpError) {
      return res.status(error.status).json({
        status: error.status,
        message: error.message,
      })
    } else {
      console.error(error)
      return res.status(500).json({
        status: 500,
        message: 'Something went wrong. Please try again later.',
      })
    }
  },
)

export default router
