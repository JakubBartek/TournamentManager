import BaseApi from './baseApi'
import { Team, TeamCreate, TeamQuery } from '../types/team'
import { PaginatedResponse } from '@/types/api'

const TEAM_PREFIX = '/teams'

async function getAll(tournamentId: string) {
  return BaseApi.getAll<Team>(`/tournaments/${tournamentId}${TEAM_PREFIX}`)
}

async function getPaginated(tournamentId: string, opts: TeamQuery) {
  const params = new URLSearchParams(opts as Record<string, string>)
  params.append('page', '1')

  return BaseApi.getAllPaginated<PaginatedResponse<Team>>(
    `/tournaments/${tournamentId}${TEAM_PREFIX}?` + params.toString(),
  )
}

async function getDetail(tournamentId: string, id: string) {
  return BaseApi.getDetail<Team>(
    `/tournaments/${tournamentId}${TEAM_PREFIX}/${id}`,
  )
}

async function create(tournamentId: string, data: TeamCreate) {
  return BaseApi.create<Team>(
    `/tournaments/${tournamentId}${TEAM_PREFIX}`,
    data,
  )
}

async function deleteTeam(tournamentId: string, id: string) {
  return BaseApi.deleteResource<void>(
    `/tournaments/${tournamentId}${TEAM_PREFIX}/${id}`,
  )
}

async function update(tournamentId: string, data: Team) {
  return BaseApi.update<Team>(
    `/tournaments/${tournamentId}${TEAM_PREFIX}/${data.id}`,
    data,
  )
}

export default {
  getAll,
  getDetail,
  create,
  delete: deleteTeam,
  update,
  getPaginated,
}
