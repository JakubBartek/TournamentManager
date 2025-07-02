import BaseApi from './baseApi'
import {
  Tournament,
  TournamentCreate,
  TournamentQuery,
} from '../types/tournament'
import { PaginatedResponse } from '@/types/api'

const TOURNAMENT_PREFIX = '/tournaments'

async function getAll() {
  return BaseApi.getAll<Tournament>(`${TOURNAMENT_PREFIX}/all`)
}

async function getPaginated(opts: TournamentQuery) {
  const params = new URLSearchParams(opts)
  params.append('page', '1')

  return BaseApi.getAllPaginated<PaginatedResponse<Tournament>>(
    `${TOURNAMENT_PREFIX}?` + params.toString(),
  )
}

async function getDetail(id: string) {
  return BaseApi.getDetail<Tournament>(`${TOURNAMENT_PREFIX}/${id}`)
}

async function create(data: TournamentCreate) {
  return BaseApi.create<Tournament>(`${TOURNAMENT_PREFIX}`, data)
}

async function deleteTournament(id: string) {
  return BaseApi.deleteResource<void>(`${TOURNAMENT_PREFIX}/${id}`)
}

async function update(data: Tournament) {
  return BaseApi.update<Tournament>(`${TOURNAMENT_PREFIX}/${data.id}`, data)
}

export default {
  getAll,
  getDetail,
  create,
  delete: deleteTournament,
  update,
  getPaginated,
}
