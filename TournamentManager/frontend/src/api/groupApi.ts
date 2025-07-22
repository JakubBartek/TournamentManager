import baseApi from './baseApi'
import { Group, GroupCreate } from '../types/group'

const GROUP_PREFIX = '/groups'

async function getAll(tournamentId: string) {
  return baseApi.getAll<Group>(`/tournaments/${tournamentId}${GROUP_PREFIX}`)
}

async function create(tournamentId: string, data: GroupCreate) {
  return baseApi.create<Group>(
    `/tournaments/${tournamentId}${GROUP_PREFIX}`,
    data,
  )
}

async function update(tournamentId: string, data: Group) {
  return baseApi.update<Group>(
    `/tournaments/${tournamentId}${GROUP_PREFIX}/${data.id}`,
    data,
  )
}

async function deleteGroup(tournamentId: string, id: string) {
  return baseApi.deleteResource<void>(
    `/tournaments/${tournamentId}${GROUP_PREFIX}/${id}`,
  )
}

export default {
  getAll,
  create,
  update,
  delete: deleteGroup,
}
