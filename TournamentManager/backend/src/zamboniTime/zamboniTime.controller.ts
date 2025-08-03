import { parseRequest } from '../utils/utils'
import zamboniTimeRepository from './zamboniTime.repository'
import {
  zamboniTimeSchema,
  zamboniTimeCreateSchema,
  zamboniTimeTournamentIdSchema,
} from './zamboniTime.schema'
import { NotFound } from 'http-errors'

export const addNewZamboniTime: ControllerFn = async (req, res, next) => {
  try {
    const data = await parseRequest(zamboniTimeCreateSchema, req.body)
    const zamboniTime = await zamboniTimeRepository.createZamboniTime(data)

    res.status(201).send(zamboniTime)
  } catch (error) {
    next(error)
  }
}

export const getZamboniTimes: ControllerFn = async (req, res, next) => {
  try {
    const params = await parseRequest(zamboniTimeTournamentIdSchema, req.params)
    const zamboniTimes = await zamboniTimeRepository.getZamboniTimes(
      params.tournamentId,
    )

    res.status(200).send(zamboniTimes)
  } catch (error) {
    next(error)
  }
}

export const getZamboniTime: ControllerFn = async (req, res, next) => {
  try {
    const params = await parseRequest(zamboniTimeSchema, req.params)
    const zamboniTime = await zamboniTimeRepository.getZamboniTime(
      params.tournamentId,
    )

    if (!zamboniTime) {
      throw new NotFound('Zamboni time not found')
    }

    res.status(200).send(zamboniTime)
  } catch (error) {
    next(error)
  }
}

export const updateZamboniTime: ControllerFn = async (req, res, next) => {
  try {
    const params = await parseRequest(zamboniTimeSchema, req.params)
    const payload = await parseRequest(zamboniTimeCreateSchema, req.body)

    const updated = await zamboniTimeRepository.updateZamboniTime(
      params.tournamentId,
      {
        ...payload,
        id: params.id,
      },
    )

    if (!updated) {
      throw new NotFound('Zamboni time not found')
    }

    res.status(200).send(updated)
  } catch (error) {
    next(error)
  }
}

export const deleteZamboniTime: ControllerFn = async (req, res, next) => {
  try {
    const params = await parseRequest(zamboniTimeSchema, req.params)
    const deleted = await zamboniTimeRepository.deleteZamboniTime(params.id)

    if (!deleted) {
      throw new NotFound('Zamboni time not found')
    }

    res.status(200).send({ message: 'Zamboni time deleted successfully' })
  } catch (error) {
    next(error)
  }
}
