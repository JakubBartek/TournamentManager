import baseApi from './baseApi'
import { Rink, RinkCreate, RinkEdit } from '../types/rink'

const RINKS_PREFIX = '/rinks'

async function getAll(tournamentId: string) {
  return baseApi.getAll<Rink>(`/tournaments/${tournamentId}${RINKS_PREFIX}`)
}

async function create(tournamentId: string, data: RinkCreate) {
  return baseApi.create<Rink>(
    `/tournaments/${tournamentId}${RINKS_PREFIX}`,
    data,
  )
}

async function update(tournamentId: string, data: RinkEdit) {
  return baseApi.update<Rink>(
    `/tournaments/${tournamentId}${RINKS_PREFIX}/${data.id}`,
    data,
  )
}

async function deleteRink(tournamentId: string, id: string) {
  return baseApi.deleteResource<void>(
    `/tournaments/${tournamentId}${RINKS_PREFIX}/${id}`,
  )
}

async function getDetail(tournamentId: string, id: string) {
  return baseApi.getDetail<Rink>(
    `/tournaments/${tournamentId}${RINKS_PREFIX}/${id}`,
  )
}

export default {
  getAll,
  create,
  update,
  delete: deleteRink,
  getDetail,
}
