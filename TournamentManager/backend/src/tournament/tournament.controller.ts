import { parseRequest } from '../utils/utils'
import TournamentRepository from './tournament.repository'
import {
  tournamentPaginationQuerySchema,
  tournamentEditSchema,
  tournamentIdQuerySchema,
  tournamentQuerySchema,
  tournamentSchema,
} from './tournament.schema'
import { NotFound } from 'http-errors'

export const addNewTournament: ControllerFn = async (req, res, next) => {
  try {
    const data = await parseRequest(tournamentSchema, req.body)
    const tournament = await TournamentRepository.createTournament(data)

    res.status(201).send(tournament)
  } catch (error) {
    next(error)
  }
}

export const getSingleTournament: ControllerFn = async (req, res, next) => {
  try {
    const params = await parseRequest(tournamentIdQuerySchema, req.params)

    const data = await TournamentRepository.getSingleTournament(params.id)

    if (!data) {
      throw new NotFound('Tournament not found')
    }
    res.status(200).send(data)
  } catch (error) {
    next(error)
  }
}

export const deleteTournament: ControllerFn = async (req, res, next) => {
  try {
    const params = await parseRequest(tournamentIdQuerySchema, req.params)
    const data = await TournamentRepository.deleteTournament(params.id)

    res.status(200).send(data)
  } catch (error) {
    next(error)
  }
}

export const updateTournament: ControllerFn = async (req, res, next) => {
  try {
    const params = await parseRequest(tournamentIdQuerySchema, req.params)
    const payload = await parseRequest(tournamentEditSchema, req.body)

    const updated = await TournamentRepository.updateTournament(
      params.id,
      payload,
    )

    res.status(200).send(updated)
  } catch (error) {
    next(error)
  }
}

export const getPaginatedTournaments: ControllerFn = async (req, res, next) => {
  try {
    const options = await parseRequest(
      tournamentPaginationQuerySchema,
      req.query,
    )

    const { tournaments, pages } =
      await TournamentRepository.getPaginatedTournaments(options)

    res.status(200).send({ tournaments, pages })
  } catch (error) {
    next(error)
  }
}

export const getAllTournaments: ControllerFn = async (req, res, next) => {
  try {
    const data = await TournamentRepository.getAllTournaments()

    res.status(200).send(data)
  } catch (error) {
    next(error)
  }
}

export default {
  addNewTournament,
  getSingleTournament,
  deleteTournament,
  updateTournament,
  getPaginatedTournaments,
  getAllTournaments,
  getTournamentDetails: getSingleTournament, // Alias for consistency
}
