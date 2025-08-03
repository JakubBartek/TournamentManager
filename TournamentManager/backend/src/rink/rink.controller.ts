import { parseRequest } from '../utils/utils'
import RinkRepository from './rink.repository'
import { rinkCreateSchema, rinkIdQuerySchema, rinkSchema } from './rink.schema'
import { NotFound } from 'http-errors'

export const addNewRink: ControllerFn = async (req, res, next) => {
  const { name, tournamentId } = await parseRequest(rinkCreateSchema, req.body)
  const rink = await RinkRepository.createRink({ name, tournamentId })
  res.status(201).json(rink)
}

export const getSingleRink: ControllerFn = async (req, res, next) => {
  try {
    const params = await parseRequest(rinkIdQuerySchema, req.params)
    const rink = await RinkRepository.getRinkById({ id: params.id })

    if (!rink) {
      throw new NotFound('Rink not found')
    }
    res.status(200).json(rink)
  } catch (error) {
    next(error)
  }
}

export const deleteRink: ControllerFn = async (req, res, next) => {
  try {
    const params = await parseRequest(rinkIdQuerySchema, req.params)
    const deleted = await RinkRepository.deleteRink(params.id)

    if (!deleted) {
      throw new NotFound('Rink not found')
    }
    res.status(200).json({ message: 'Rink deleted successfully' })
  } catch (error) {
    next(error)
  }
}

export const updateRink: ControllerFn = async (req, res, next) => {
  try {
    const params = await parseRequest(rinkIdQuerySchema, req.params)
    const payload = await parseRequest(rinkSchema, req.body)

    const updatedRink = await RinkRepository.updateRink(params.id, payload)

    if (!updatedRink) {
      throw new NotFound('Rink not found')
    }
    res.status(200).json(updatedRink)
  } catch (error) {
    next(error)
  }
}

export const getRinks: ControllerFn = async (req, res, next) => {
  try {
    const tournamentId = req.params.tournamentId as string
    if (!tournamentId) {
      throw new Error('Tournament ID is required')
    }
    const rinks = await RinkRepository.getRinks(tournamentId)
    res.status(200).json(rinks)
  } catch (error) {
    next(error)
  }
}
