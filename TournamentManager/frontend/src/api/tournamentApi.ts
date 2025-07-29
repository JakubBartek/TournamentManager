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
  // Convert Date properties to ISO strings
  const serializedOpts: Record<string, string> = {}
  Object.entries(opts).forEach(([key, value]) => {
    if (value instanceof Date) {
      serializedOpts[key] = value.toISOString()
    } else if (value !== undefined && value !== null) {
      serializedOpts[key] = String(value)
    }
  })
  const params = new URLSearchParams(serializedOpts)
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

async function createAndRetId(tournament: TournamentCreate) {
  const resp = await BaseApi.create<Tournament>('/tournaments', tournament)
  console.log('Created tournament:', resp)
  return resp
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
  createAndRetId,
  delete: deleteTournament,
  update,
  getPaginated,
}
