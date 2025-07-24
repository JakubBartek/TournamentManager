import db from '../db'
import { GroupCreate, GroupEdit } from './group.types'

const createGroup = async (data: GroupCreate) => {
  return db.group.create({
    data: {
      ...data,
    },
  })
}

const updateGroup = async (id: string, data: GroupEdit) => {
  return db.group.update({
    where: { id },
    data: {
      ...data,
    },
  })
}

const deleteGroup = async (id: string) => {
  return db.group.delete({
    where: { id },
  })
}

const getAllGroups = async () => {
  const groups = await db.group.findMany({
    select: {
      id: true,
      name: true,
      tournamentId: true,
      Standing: {
        select: {
          id: true,
          points: true,
          position: true,
          draws: true,
          losses: true,
          wins: true,
          goalsFor: true,
          goalsAgainst: true,
          teamName: true,
          teamId: true,
          groupId: true,
          tournamentId: true,
        },
      },
    },
  })

  return groups.map((group) => ({
    ...group,
    Standings: group.Standing,
  }))
}

const getSingleGroup = async (id: string) => {
  return db.group.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      tournamentId: true,
    },
  })
}

export default {
  createGroup,
  updateGroup,
  deleteGroup,
  getAllGroups,
  getSingleGroup,
}
