import db from '../db'
import { ZamboniTime, ZamboniTimeCreate } from './zamboniTime.types'

const createZamboniTime = async (data: ZamboniTimeCreate) => {
  return db.zamboniTime.create({
    data: {
      ...data,
    },
  })
}

const getZamboniTime = async (tournamentId: string) => {
  return db.zamboniTime.findFirst({
    where: { tournamentId },
  })
}

const getZamboniTimes = async (tournamentId: string) => {
  return db.zamboniTime.findMany({
    where: { tournamentId },
    orderBy: { startTime: 'asc' },
  })
}

const updateZamboniTime = async (tournamentId: string, data: ZamboniTime) => {
  const id = data.id
  return db.zamboniTime.update({
    where: { id },
    data: {
      ...data,
    },
  })
}

const deleteZamboniTime = async (id: string) => {
  return db.zamboniTime.delete({
    where: { id },
  })
}

export default {
  createZamboniTime,
  getZamboniTime,
  updateZamboniTime,
  deleteZamboniTime,
  getZamboniTimes,
}
