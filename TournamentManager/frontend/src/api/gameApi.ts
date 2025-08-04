import BaseApi from './baseApi'
import { Game, GameCreate, GameQuery } from '../types/game'
import { PaginatedResponse } from '@/types/api'

const GAME_PREFIX = '/games'

async function getAll(tournamentId: string) {
  return BaseApi.getAll<Game>(`/tournaments/${tournamentId}${GAME_PREFIX}`)
}

async function getPaginated(opts: GameQuery) {
  if (opts.tournamentId === undefined) delete opts.tournamentId
  if (opts.date === undefined) delete opts.date

  const params = new URLSearchParams(opts)
  params.append('page', '1')

  return BaseApi.getAllPaginated<PaginatedResponse<Game>>(
    `${GAME_PREFIX}?` + params.toString(),
  )
}

async function getDetail(id: string) {
  return BaseApi.getDetail<Game>(`${GAME_PREFIX}/${id}`)
}

async function create(data: GameCreate) {
  return BaseApi.create<Game>(`${GAME_PREFIX}`, data)
}

async function deleteGame(id: string) {
  return BaseApi.deleteResource<void>(`${GAME_PREFIX}/${id}`)
}

async function update(data: Game) {
  return BaseApi.update<Game>(
    `/tournaments/${data.tournamentId}${GAME_PREFIX}/${data.id}`,
    data,
  )
}

export default {
  getAll,
  getDetail,
  create,
  delete: deleteGame,
  update,
  getPaginated,
}
