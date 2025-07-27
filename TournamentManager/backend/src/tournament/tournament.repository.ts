import db from '../db'
import {
  TournamentCreate,
  Tournament,
  TournamentEdit,
  GetTournamentsOptions,
  GetTournamentDetailsOptions,
  TournamentPaginationQuery,
} from './tournament.types'
import bcrypt from 'bcryptjs'

const TOURNAMENTS_PER_PAGE = 20

const getPages = async () => {
  const count = await db.tournament.count()
  return Math.ceil(count / TOURNAMENTS_PER_PAGE)
}

const createTournament = async (data: TournamentCreate) => {
  const hashedPassword = await bcrypt.hash(data.adminPassword, 10)

  return db.tournament.create({
    data: {
      ...data,
      adminPasswordHash: hashedPassword,
    },
  })
}

const updateTournament = (id: string, tournament: TournamentEdit) => {
  return db.tournament.update({
    where: {
      id: id,
    },
    data: {
      ...tournament,
    },
  })
}

const getAllTournaments = async () => {
  const data: Tournament[] = await db.tournament.findMany({
    include: {
      teams: true,
      games: true,
      sponsors: true,
      Player: true,
    },
  })

  return data
}

const getSingleTournament = async (id: string) => {
  return db.tournament.findFirst({
    select: {
      id: true,
      name: true,
      location: true,
      startDate: true,
      endDate: true,
      TournamentManagers: true,
    },
    where: {
      id: id,
    },
  })
}

const getPaginatedTournaments = async (
  options: TournamentPaginationQuery,
): Promise<{ tournaments: Tournament[]; pages: number }> => {
  // default to first page
  options.page ??= 1

  const pages = await getPages()

  const tournaments = await db.tournament.findMany({
    skip: (options.page - 1) * TOURNAMENTS_PER_PAGE,
    take: TOURNAMENTS_PER_PAGE,
    where: {
      location: {
        contains: options.location,
      },
    },
    include: {
      teams: true,
      games: true,
      sponsors: true,
      Player: true,
    },
  })

  return { tournaments, pages }
}

const deleteTournament = async (id: string) => {
  return db.tournament.delete({
    where: {
      id: id,
    },
  })
}

export default {
  createTournament,
  updateTournament,
  getAllTournaments,
  getSingleTournament,
  getPaginatedTournaments,
  deleteTournament,
}
