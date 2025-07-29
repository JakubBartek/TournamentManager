import { parseRequest } from '../utils/utils'
import StandingsRepository from './standings.repository'
import {
  standingsQuerySchema,
  standingsEditSchema,
  standingSchema,
  standingsGroupQuerySchema,
} from './standings.schema'
import { NotFound } from 'http-errors'
import { recalculateStandingsForGroup } from './standings.service'

export const getStandings: ControllerFn = async (req, res, next) => {
  try {
    const params = await parseRequest(standingsQuerySchema, req.params)
    const standings = await StandingsRepository.getStandings(
      params.tournamentId,
    )

    res.status(200).send(standings)
  } catch (error) {
    next(error)
  }
}

export const createStandings: ControllerFn = async (req, res, next) => {
  try {
    const data = await parseRequest(standingSchema, req.body)
    const standing = await StandingsRepository.createStanding(data)

    res.status(201).send(standing)
  } catch (error) {
    next(error)
  }
}

export const updateStandings: ControllerFn = async (req, res, next) => {
  try {
    const params = await parseRequest(standingsQuerySchema, req.params)
    const payload = await parseRequest(standingsEditSchema, req.body)

    const updated = await StandingsRepository.updateStanding(
      params.tournamentId,
      payload,
    )

    if (!updated) {
      throw new NotFound('Standing not found')
    }

    res.status(200).send(updated)
  } catch (error) {
    next(error)
  }
}

export const deleteStandings: ControllerFn = async (req, res, next) => {
  try {
    const params = await parseRequest(standingsQuerySchema, req.params)
    const deleted = await StandingsRepository.deleteStanding(
      params.tournamentId,
    )

    if (!deleted) {
      throw new NotFound('Standing not found')
    }

    res.status(200).send(deleted)
  } catch (error) {
    next(error)
  }
}

export const recalculateGroupStandings: ControllerFn = async (
  req,
  res,
  next,
) => {
  const { groupId } = req.params

  try {
    const result = await recalculateStandingsForGroup(groupId)
    return res.status(200).json(result)
  } catch (error) {
    next(error)
    return res.status(500).json({ error: 'Failed to recalculate standings' })
  }
}

export const calculateStandings: ControllerFn = async (req, res, next) => {
  const { tournamentId } = req.params

  console.log('Params:', req.params)
  console.log('Body:', req.body)

  try {
    await StandingsRepository.calculateStandings(tournamentId)
    res.status(200).send({ message: 'Standings recalculated successfully' })
  } catch (error) {
    next(error)
  }
}

export const getTournamentStandings: ControllerFn = async (req, res, next) => {
  const { tournamentId } = req.params

  try {
    const standings = await StandingsRepository.getStandings(tournamentId)

    if (!standings) {
      throw new NotFound('Standings not found')
    }

    res.status(200).send(standings)
  } catch (error) {
    next(error)
  }
}

export const getGroupStandings: ControllerFn = async (req, res, next) => {
  const params = await parseRequest(standingsGroupQuerySchema, req.params)
  try {
    const standings = await StandingsRepository.getGroupStandings(
      params.groupId,
      params.tournamentId,
    )

    if (!standings) {
      throw new NotFound('Group standings not found')
    }

    res.status(200).send(standings)
  } catch (error) {
    next(error)
  }
}
