import { parseRequest } from '../utils/utils'
import TournamentRepository from './tournament.repository'
import {
  tournamentPaginationQuerySchema,
  tournamentEditSchema,
  tournamentIdQuerySchema,
  tournamentQuerySchema,
  tournamentSchema,
  tournamentCreateSchema,
} from './tournament.schema'
import { NotFound } from 'http-errors'
import { createSchedule as createTournamentSchedule } from './tournament.service'
import { Request, Response } from 'express'
import db from '../db'
import bcrypt from 'bcryptjs'

export async function verifyTournamentPassword(req: Request, res: Response) {
  const { id } = req.params
  const { password } = req.body

  if (!password) {
    return res.status(400).json({ message: 'Password is required' })
  }

  const tournament = await db.tournament.findUnique({ where: { id } })
  if (!tournament) {
    return res.status(404).json({ message: 'Tournament not found' })
  }

  // Compare password with hash
  const isValid = await bcrypt.compare(
    password,
    tournament.adminPasswordHash || '',
  )
  if (isValid) {
    return res.status(200).json({ success: true })
  } else {
    return res.status(401).json({ message: 'Invalid password' })
  }
}

export const addNewTournament: ControllerFn = async (req, res, next) => {
  try {
    const data = await parseRequest(tournamentCreateSchema, req.body)
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

export const createScheduleController: ControllerFn = async (
  req,
  res,
  next,
) => {
  try {
    const { id: tournamentId } = req.params
    const { numberOfGroups, autoCreate, manualGroups } = req.body

    // Validate input here (Zod schema)
    await createTournamentSchedule(
      tournamentId,
      numberOfGroups,
      autoCreate,
      manualGroups,
    )
    res.status(201).send({ message: 'Schedule created successfully' })
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
  createSchedule: createScheduleController,
}
