import db from '../db'
import {
  PlayerCreate,
  Player,
  PlayerEdit,
  GetPlayersOptions,
  GetPlayerDetailsOptions,
} from './player.types'

const PLAYERS_PER_PAGE = 20

const getPages = async () => {
  const count = await db.player.count()
  return Math.ceil(count / PLAYERS_PER_PAGE)
}

const createPlayer = async (data: PlayerCreate) => {
  return db.player.create({
    data: {
      ...data,
    },
  })
}

const updatePlayer = (id: string, player: PlayerEdit) => {
  return db.player.update({
    where: {
      id: id,
    },
    data: {
      ...player,
    },
  })
}

const getAllPlayers = async () => {
  const rawData = await db.player.findMany({
    select: {
      id: true,
      name: true,
      position: true,
      teamId: true,
      tournamentId: true,
    },
  })

  const data: Player[] = rawData.map((player) => ({
    ...player,
    tournamentId:
      player.tournamentId === null ? undefined : player.tournamentId,
  }))

  return data
}

const getSinglePlayer = async (
  id: string,
  options: GetPlayerDetailsOptions,
) => {
  return db.player.findFirst({
    select: {
      id: true,
      name: true,
      position: true,
      teamId: true,
      tournamentId: true,
    },
    where: {
      id: id,
      tournamentId: options.tournamentId,
    },
  })
}

const getPaginatedPlayers = async (
  options: GetPlayersOptions,
): Promise<{ players: Player[]; pages: number }> => {
  // default to first page
  options.page ??= 1

  const pages = await getPages()

  const players = await db.player.findMany({
    skip: (options.page - 1) * PLAYERS_PER_PAGE,
    take: PLAYERS_PER_PAGE,
    where: {
      tournamentId: options.tournamentId,
    },
    include: {
      team: true,
    },
  })

  const mappedPlayers: Player[] = players.map((player) => ({
    ...player,
    tournamentId:
      player.tournamentId === null ? undefined : player.tournamentId,
  }))
  return { players: mappedPlayers, pages }
}

const deletePlayer = async (id: string) => {
  return db.player.delete({
    where: {
      id: id,
    },
  })
}

const getPlayersOfTeam = async (
  teamId: string,
  options: GetPlayersOptions,
): Promise<{ players: Player[]; pages: number }> => {
  // default to first page
  options.page ??= 1

  const pages = await getPages()

  const players = await db.player.findMany({
    skip: (options.page - 1) * PLAYERS_PER_PAGE,
    take: PLAYERS_PER_PAGE,
    where: {
      teamId: teamId,
      tournamentId: options.tournamentId,
    },
    include: {
      team: true,
    },
  })

  const mappedPlayers: Player[] = players.map((player) => ({
    ...player,
    tournamentId:
      player.tournamentId === null ? undefined : player.tournamentId,
  }))
  return { players: mappedPlayers, pages }
}

export default {
  createPlayer,
  updatePlayer,
  getAllPlayers,
  getSinglePlayer,
  getPaginatedPlayers,
  deletePlayer,
  getPlayersOfTeam,
}
