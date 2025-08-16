import BaseApi from './baseApi'
import { Player, PlayerCreate, PlayerQuery } from '../types/player'
import { PaginatedResponse } from '@/types/api'

const PLAYER_PREFIX = '/players'

async function getAll() {
  return BaseApi.getAll<Player>(`${PLAYER_PREFIX}`)
}

async function getPaginated(opts: PlayerQuery) {
  const params = new URLSearchParams(opts)
  params.append('page', '1')

  return BaseApi.getAllPaginated<PaginatedResponse<Player>>(
    `${PLAYER_PREFIX}?` + params.toString(),
  )
}

async function getAllList() {
  return BaseApi.getAll<Player>(`${PLAYER_PREFIX}`)
}

async function getDetail(id: string) {
  return BaseApi.getDetail<Player>(`${PLAYER_PREFIX}/${id}`)
}

async function create(data: PlayerCreate) {
  return BaseApi.create<Player>(`${PLAYER_PREFIX}`, data)
}

async function deletePlayer(id: string) {
  return BaseApi.deleteResource<void>(`${PLAYER_PREFIX}/${id}`)
}

async function update(data: Player) {
  return BaseApi.update<Player>(`${PLAYER_PREFIX}/${data.id}`, data)
}

export default {
  getAll,
  getDetail,
  create,
  delete: deletePlayer,
  update,
  getPaginated,
  getAllList,
}
