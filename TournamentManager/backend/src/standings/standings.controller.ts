import { parseRequest } from '../utils/utils'
import StandingsRepository from './standings.repository'
import {
  standingsQuerySchema,
  standingsEditSchema,
  standingSchema,
} from './standings.schema'
import { NotFound } from 'http-errors'

export const getStandings: ControllerFn = async (req, res, next) => {
  try {
    const query = await parseRequest(standingsQuerySchema, req.query)
    const standings = await StandingsRepository.getStandings(query.tournamentId)

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

export const calculateStandings: ControllerFn = async (req, res, next) => {
  try {
    const { tournamentId } = req.params
    await StandingsRepository.calculateStandings(tournamentId)
    res.json({ message: 'Standings updated successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to calculate standings' })
  }
}
