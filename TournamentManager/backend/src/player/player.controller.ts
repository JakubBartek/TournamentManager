import { parseRequest } from '../utils/utils'
import PlayerRepository from './player.repository'
import {
  playerPaginationQuerySchema,
  playerEditSchema,
  playerIdQuerySchema,
  playerQuerySchema,
  playerSchema,
} from './player.schema'
import { NotFound } from 'http-errors'

export const addNewPlayer: ControllerFn = async (req, res, next) => {
  try {
    const data = await parseRequest(playerSchema, req.body)
    const player = await PlayerRepository.createPlayer(data)

    res.status(201).send(player)
  } catch (error) {
    next(error)
  }
}

export const getSinglePlayer: ControllerFn = async (req, res, next) => {
  try {
    const params = await parseRequest(playerIdQuerySchema, req.params)
    const options = await parseRequest(playerQuerySchema, req.query)

    const data = await PlayerRepository.getSinglePlayer(params.id, options)

    if (!data) {
      throw new NotFound('Player not found')
    }
    res.status(200).send(data)
  } catch (error) {
    next(error)
  }
}

export const deletePlayer: ControllerFn = async (req, res, next) => {
  try {
    const params = await parseRequest(playerIdQuerySchema, req.params)
    const data = await PlayerRepository.deletePlayer(params.id)

    res.status(200).send(data)
  } catch (error) {
    next(error)
  }
}

export const updatePlayer: ControllerFn = async (req, res, next) => {
  try {
    const params = await parseRequest(playerIdQuerySchema, req.params)
    const payload = await parseRequest(playerEditSchema, req.body)

    const updated = await PlayerRepository.updatePlayer(params.id, payload)

    res.status(200).send(updated)
  } catch (error) {
    next(error)
  }
}

export const getAllPlayers: ControllerFn = async (req, res, next) => {
  try {
    const data = await PlayerRepository.getAllPlayers()

    res.status(200).send(data)
  } catch (error) {
    next(error)
  }
}

export const getPlayersOfTeam: ControllerFn = async (req, res, next) => {
  try {
    const params = await parseRequest(playerIdQuerySchema, req.params)
    const options = await parseRequest(playerPaginationQuerySchema, req.query)

    const data = await PlayerRepository.getPlayersOfTeam(params.id, options)

    res.status(200).send(data)
  } catch (error) {
    next(error)
  }
}
