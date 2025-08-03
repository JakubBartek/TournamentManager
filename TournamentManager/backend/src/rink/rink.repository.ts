import db from '../db'
import { Rink, RinkCreate, RinkIdQuery } from './rink.types'

const getRinks = async (tournamentId: string) => {
  return db.rink.findMany({
    where: { tournamentId },
    select: {
      id: true,
      name: true,
      tournamentId: true,
    },
  })
}

const createRink = async (data: RinkCreate) => {
  return db.rink.create({
    data: {
      ...data,
    },
  })
}

const updateRink = async (id: string, data: Rink) => {
  return db.rink.update({
    where: { id },
    data: {
      ...data,
    },
  })
}

const deleteRink = async (id: string) => {
  return db.rink.delete({
    where: { id },
  })
}

const getRinkById = async (query: RinkIdQuery) => {
  return db.rink.findFirst({
    where: {
      id: query.id,
    },
    select: {
      id: true,
      name: true,
      tournamentId: true,
    },
  })
}

export default {
  getRinks,
  createRink,
  updateRink,
  deleteRink,
  getRinkById,
}
