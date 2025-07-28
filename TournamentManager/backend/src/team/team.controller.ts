import { parseRequest } from '../utils/utils'
import TeamRepository from './team.repository'
import {
  teamPaginationQuerySchema,
  teamEditSchema,
  teamIdQuerySchema,
  teamQuerySchema,
  teamSchema,
  teamWithPlayersSchema,
  teamIdWithTournamentIdSchema,
} from './team.schema'
import { NotFound } from 'http-errors'

export const addNewTeam: ControllerFn = async (req, res, next) => {
  try {
    const data = await parseRequest(teamSchema, req.body)
    const team = await TeamRepository.createTeam(data)

    res.status(201).send(team)
  } catch (error) {
    next(error)
  }
}

export const getSingleTeam: ControllerFn = async (req, res, next) => {
  try {
    const params = await parseRequest(teamIdWithTournamentIdSchema, req.params)

    const data = await TeamRepository.getSingleTeam(params.id, {
      tournamentId: params.tournamentId,
    })

    if (!data) {
      throw new NotFound('Team not found')
    }
    res.status(200).send(data)
  } catch (error) {
    next(error)
  }
}

export const deleteTeam: ControllerFn = async (req, res, next) => {
  try {
    const params = await parseRequest(teamIdQuerySchema, req.params)
    const data = await TeamRepository.deleteTeam(params.id)

    res.status(200).send(data)
  } catch (error) {
    next(error)
  }
}

export const updateTeam: ControllerFn = async (req, res, next) => {
  try {
    const params = await parseRequest(teamIdQuerySchema, req.params)
    const payload = await parseRequest(teamEditSchema, req.body)

    const updated = await TeamRepository.updateTeam(params.id, payload)

    res.status(200).send(updated)
  } catch (error) {
    next(error)
  }
}

export const getAllTeams: ControllerFn = async (req, res, next) => {
  try {
    const data = await TeamRepository.getAllTeams()

    res.status(200).send(data)
  } catch (error) {
    next(error)
  }
}

export const getPaginatedTeams: ControllerFn = async (req, res, next) => {
  try {
    const options = await parseRequest(teamPaginationQuerySchema, req.query)
    const data = await TeamRepository.getPaginatedTeams(options)

    res.status(200).send(data)
  } catch (error) {
    next(error)
  }
}

export const getTeamsWithPlayers: ControllerFn = async (req, res, next) => {
  try {
    const params = await parseRequest(teamWithPlayersSchema, req.params)
    const data = await TeamRepository.getTeamsWithPlayers(params.id)

    res.status(200).send(data)
  } catch (error) {
    next(error)
  }
}
