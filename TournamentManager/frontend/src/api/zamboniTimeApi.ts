import baseApi from './baseApi'
import { ZamboniTime } from '../types/zamboniTime'

const ZAMBONI_TIME_PREFIX = '/zamboni-time'

async function getAll(tournamentId: string) {
  return baseApi.getAll<ZamboniTime>(
    `/tournaments/${tournamentId}${ZAMBONI_TIME_PREFIX}`,
  )
}

async function getDetail(tournamentId: string) {
  return baseApi.getDetail<ZamboniTime>(
    `/tournaments/${tournamentId}${ZAMBONI_TIME_PREFIX}`,
  )
}

async function create(tournamentId: string, data: Omit<ZamboniTime, 'id'>) {
  return baseApi.create<ZamboniTime>(
    `/tournaments/${tournamentId}${ZAMBONI_TIME_PREFIX}`,
    data,
  )
}

async function update(tournamentId: string, data: ZamboniTime) {
  return baseApi.update<ZamboniTime>(
    `/tournaments/${tournamentId}${ZAMBONI_TIME_PREFIX}/${data.id}`,
    data,
  )
}

async function deleteZamboniTime(tournamentId: string, id: string) {
  return baseApi.deleteResource<void>(
    `/tournaments/${tournamentId}${ZAMBONI_TIME_PREFIX}/${id}`,
  )
}

export default {
  getAll,
  getDetail,
  create,
  update,
  deleteZamboniTime,
}
