import BaseApi from './baseApi'
import { Team, TeamCreate, TeamQuery } from '../types/team'
import { PaginatedResponse } from '@/types/api'

const TEAM_PREFIX = '/team'

async function getAll() {
  return BaseApi.getAll<Team>(`${TEAM_PREFIX}`)
}

async function getPaginated(opts: TeamQuery) {
  const params = new URLSearchParams(opts)
  params.append('page', '1')

  return BaseApi.getAllPaginated<PaginatedResponse<Team>>(
    `${TEAM_PREFIX}?` + params.toString(),
  )
}

async function getDetail(id: string) {
  return BaseApi.getDetail<Team>(`${TEAM_PREFIX}/${id}`)
}

async function create(data: TeamCreate) {
  return BaseApi.create<Team>(`${TEAM_PREFIX}`, data)
}

async function deleteTeam(id: string) {
  return BaseApi.deleteResource<void>(`${TEAM_PREFIX}/${id}`)
}

async function update(data: Team) {
  return BaseApi.update<Team>(`${TEAM_PREFIX}/${data.id}`, data)
}

export default {
  getAll,
  getDetail,
  create,
  delete: deleteTeam,
  update,
  getPaginated,
}
