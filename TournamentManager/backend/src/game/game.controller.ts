import standingsRepository from '../standings/standings.repository'
import { parseRequest } from '../utils/utils'
import GameRepository from './game.repository'
import {
  gamePaginationQuerySchema,
  gameEditSchema,
  gameIdQuerySchema,
  gameQuerySchema,
  gameSchema,
} from './game.schema'
import { NotFound } from 'http-errors'

export const addNewGame: ControllerFn = async (req, res, next) => {
  try {
    const data = await parseRequest(gameSchema, req.body)
    const game = await GameRepository.createGame(data)

    res.status(201).send(game)
  } catch (error) {
    next(error)
  }
}

export const getSingleGame: ControllerFn = async (req, res, next) => {
  try {
    const params = await parseRequest(gameIdQuerySchema, req.params)
    const options = await parseRequest(gameQuerySchema, req.query)

    const data = await GameRepository.getSingleGame(params.id, options)

    if (!data) {
      throw new NotFound('Game not found')
    }
    res.status(200).send(data)
  } catch (error) {
    next(error)
  }
}

export const deleteGame: ControllerFn = async (req, res, next) => {
  try {
    const params = await parseRequest(gameIdQuerySchema, req.params)
    const data = await GameRepository.deleteGameById(params.id)

    res.status(200).send(data)
  } catch (error) {
    next(error)
  }
}

export const updateGame: ControllerFn = async (req, res, next) => {
  try {
    const params = await parseRequest(gameIdQuerySchema, req.params)
    const payload = await parseRequest(gameEditSchema, req.body)

    const updated = await GameRepository.upateGame(params.id, payload)

    // Recalculate groups
    await standingsRepository.calculateStandings(updated.tournamentId)

    res.status(200).send(updated)
  } catch (error) {
    next(error)
  }
}

export const getGames: ControllerFn = async (req, res, next) => {
  try {
    const tournamentId = req.params.tournamentId || req.query.tournamentId
    const games = await GameRepository.getAllGames(tournamentId as string)
    res.status(200).send(games)
  } catch (error) {
    next(error)
  }
}
