import { parseRequest } from '../utils/utils'
import GroupRepository from './group.repository'
import { groupSchema, groupEditSchema, groupIdSchema } from './group.schema'
import { NotFound } from 'http-errors'

export const addNewGroup: ControllerFn = async (req, res, next) => {
  try {
    const data = await parseRequest(groupSchema, req.body)
    const group = await GroupRepository.createGroup(data)

    res.status(201).send(group)
  } catch (error) {
    next(error)
  }
}

export const deleteGroup: ControllerFn = async (req, res, next) => {
  try {
    const params = await parseRequest(groupIdSchema, req.params)
    const deleted = await GroupRepository.deleteGroup(params.id)

    if (!deleted) {
      throw new NotFound('Group not found')
    }
    res.status(200).send(deleted)
  } catch (error) {
    next(error)
  }
}

export const updateGroup: ControllerFn = async (req, res, next) => {
  try {
    const params = await parseRequest(groupIdSchema, req.params)
    const payload = await parseRequest(groupEditSchema, req.body)

    const updated = await GroupRepository.updateGroup(params.id, payload)

    if (!updated) {
      throw new NotFound('Group not found')
    }
    res.status(200).send(updated)
  } catch (error) {
    next(error)
  }
}

export const getAllGroups: ControllerFn = async (req, res, next) => {
  try {
    const groups = await GroupRepository.getAllGroups()
    res.status(200).send(groups)
  } catch (error) {
    next(error)
  }
}

export const getSingleGroup: ControllerFn = async (req, res, next) => {
  try {
    const params = await parseRequest(groupIdSchema, req.params)
    const group = await GroupRepository.getSingleGroup(params.id)

    if (!group) {
      throw new NotFound('Group not found')
    }
    res.status(200).send(group)
  } catch (error) {
    next(error)
  }
}
