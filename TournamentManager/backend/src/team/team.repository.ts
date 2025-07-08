import db from '../db'
import {
  TeamCreate,
  TeamEdit,
  GetTeamsOptions,
  GetTeamDetailsOptions,
} from './team.types'
import { Player } from '../player/player.types'

const TEAMS_PER_PAGE = 20

const getPages = async () => {
  const count = await db.team.count()
  return Math.ceil(count / TEAMS_PER_PAGE)
}

const createTeam = async (data: TeamCreate) => {
  return db.team.create({
    data: {
      ...data,
    },
  })
}

const updateTeam = (id: string, team: TeamEdit) => {
  return db.team.update({
    where: {
      id: id,
    },
    data: {
      ...team,
    },
  })
}

const getAllTeams = async () => {
  const rawData = await db.team.findMany({
    select: {
      id: true,
      name: true,
      city: true,
      tournamentId: true,
    },
  })

  const data = rawData.map((team) => ({
    ...team,
    tournamentId: team.tournamentId === null ? undefined : team.tournamentId,
  }))

  return data
}

const getSingleTeam = async (id: string, options: GetTeamDetailsOptions) => {
  return db.team.findFirst({
    where: {
      id: id,
      tournamentId: options.tournamentId,
    },
    include: {
      Player: true,
    },
  })
}

const getPaginatedTeams = async (options: GetTeamsOptions) => {
  options.page ??= 1

  const pages = await getPages()

  const teams = await db.team.findMany({
    select: {
      id: true,
      name: true,
      city: true,
      tournamentId: true,
    },
    where: {
      tournamentId: options.tournamentId,
    },
    skip: (options.page - 1) * TEAMS_PER_PAGE,
    take: TEAMS_PER_PAGE,
  })
  return { items: teams, pagination: { page: options.page, totalPages: pages } }
}

const getTeamsWithPlayers = async (tournamentId: string) => {
  const teams = await db.team.findMany({
    where: {
      tournamentId: tournamentId,
    },
    include: {
      Player: {
        select: {
          id: true,
          name: true,
          position: true,
        },
      },
    },
  })

  return teams.map((team) => ({
    id: team.id,
    name: team.name,
    city: team.city,
    players: team.Player as Player[],
    tournamentId: team.tournamentId === null ? undefined : team.tournamentId,
  }))
}

const deleteTeam = async (id: string) => {
  return db.team.delete({
    where: {
      id: id,
    },
  })
}

export default {
  createTeam,
  updateTeam,
  getAllTeams,
  getSingleTeam,
  getPaginatedTeams,
  getTeamsWithPlayers,
  deleteTeam,
}
