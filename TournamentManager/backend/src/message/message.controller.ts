import { parseRequest } from '../utils/utils'
import MessageRepository from './message.repository'
import { messageCreateSchema, messageIdSchema } from './message.schema'
import { NotFound } from 'http-errors'

export const createMessage: ControllerFn = async (req, res, next) => {
  try {
    const data = await parseRequest(messageCreateSchema, req.body)
    const message = await MessageRepository.createMessage(data)

    res.status(201).send(message)
  } catch (error) {
    next(error)
  }
}

export const updateMessage: ControllerFn = async (req, res, next) => {
  try {
    const params = await parseRequest(messageIdSchema, req.params)
    const data = await parseRequest(messageCreateSchema, req.body)

    const updatedMessage = await MessageRepository.updateMessage(
      params.id,
      data,
    )

    if (!updatedMessage) {
      throw new NotFound('Message not found')
    }

    res.status(200).send(updatedMessage)
  } catch (error) {
    next(error)
  }
}

export const deleteMessage: ControllerFn = async (req, res, next) => {
  try {
    const params = await parseRequest(messageIdSchema, req.params)
    const deletedMessage = await MessageRepository.deleteMessage(params.id)

    if (!deletedMessage) {
      throw new NotFound('Message not found')
    }

    res.status(200).send(deletedMessage)
  } catch (error) {
    next(error)
  }
}

export const getMessageById: ControllerFn = async (req, res, next) => {
  try {
    const params = await parseRequest(messageIdSchema, req.params)
    const message = await MessageRepository.getMessageById(params.id)

    res.status(200).send(message)
  } catch (error) {
    next(error)
  }
}

export const getMessagesByTournamentId: ControllerFn = async (
  req,
  res,
  next,
) => {
  try {
    const tournamentId = req.params.tournamentId
    const messages = await MessageRepository.getMessagesByTournamentId(
      tournamentId,
    )

    res.status(200).send(messages)
  } catch (error) {
    next(error)
  }
}
