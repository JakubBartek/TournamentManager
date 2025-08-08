import db from '../db'
import {
  GetGameDeatilsOptions,
  GetGamesOptions,
  GameCreate,
  GameEdit,
  Game,
} from './game.types'

const GAMES_PER_PAGE = 16

const getDayBounds = (date: Date | undefined, upper: boolean) => {
  if (date === undefined) {
    return undefined
  }

  const newDate = new Date(date)

  newDate.setHours(23, 59, 59, 999)

  if (!upper) {
    // If we want the lower bound, we need to subtract a day
    newDate.setDate(newDate.getDate() - 1)
  }

  return newDate
}

const getPages = async () => {
  const total = await db.game.count()
  return Math.ceil(total / GAMES_PER_PAGE)
}

const createGame = async (data: GameCreate) => {
  return db.game.create({
    data: {
      ...data,
      rinkId: data.rinkId === undefined ? '' : data.rinkId,
      tournamentId: data.tournamentId === undefined ? '' : data.tournamentId,
    },
  })
}

const upateGame = (id: string, game: GameEdit) => {
  return db.game.update({
    where: {
      id: id,
    },
    data: {
      ...game,
    },
  })
}

const getAllGames = async (tournamentId: string) => {
  const rawData = await db.game.findMany({
    select: {
      id: true,
      team1Id: true,
      team2Id: true,
      score1: true,
      score2: true,
      date: true,
      tournamentId: true,
      rinkId: true,
      rinkName: true,
      name: true,
      team1: {
        select: {
          id: true,
          name: true,
          groupId: true,
        },
      },
      team2: {
        select: {
          id: true,
          name: true,
          groupId: true,
        },
      },
      status: true,
    },
    where: {
      tournamentId: tournamentId,
    },
    orderBy: {
      date: 'asc',
    },
  })

  const data: Game[] = rawData.map((game) => ({
    ...game,
    team1Id: game.team1Id ?? undefined,
    team2Id: game.team2Id ?? undefined,
    rinkId: game.rinkId ?? '',
    tournamentId: game.tournamentId,
    rinkName: game.rinkName ?? '',
    name: game.name ?? '',
  }))

  return data
}

const getSingleGame = async (id: string, options: GetGameDeatilsOptions) => {
  return db.game.findFirst({
    select: {
      id: true,
      team1Id: true,
      team2Id: true,
      score1: true,
      score2: true,
      rinkId: true,
      date: true,
      tournamentId: true,
      rinkName: true,
      name: true,
      status: true,
    },
    where: {
      id: id,
      tournamentId: options.tournamentId,
    },
  })
}

// Get all games for a theatre that are in the future
const getPaginatedGames = async (options: GetGamesOptions) => {
  // default to first page
  options.page ??= 1

  const pages = await getPages()

  const data = await db.game.findMany({
    select: {
      id: true,
      team1Id: true,
      team2Id: true,
      score1: true,
      score2: true,
      rinkId: true,
      rinkName: true,
      date: true,
      tournamentId: true,
    },
    where: {
      tournamentId: options.tournamentId,
    },

    skip: (options.page - 1) * GAMES_PER_PAGE,
    take: GAMES_PER_PAGE,
  })

  return {
    items: data,
    pagination: {
      page: options.page,
      totalPages: pages,
    },
  }
}

const deleteGameById = async (id: string) => {
  // First, find the game to check if PlacementGame exists
  const game = await db.game.findUnique({
    where: { id },
    select: { placementGame: true },
  })

  // If PlacementGame exists, delete it
  if (game?.placementGame) {
    await db.placementGame.delete({
      where: { id: game.placementGame.id },
    })
  }

  // Delete the game itself
  return db.game.delete({
    where: { id },
  })
}

export default {
  getPages,
  getAllGames,
  getSingleGame,
  getPaginatedGames,
  upateGame,
  createGame,
  deleteGameById,
}
