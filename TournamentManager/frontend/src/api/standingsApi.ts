import baseApi from './baseApi'
import { Standings, StandingsCreate } from '../types/standings'

const STANDINGS_PREFIX = '/standings'

async function getAll(tournamentId: string) {
  return baseApi.getAll<Standings>(
    `/tournaments/${tournamentId}${STANDINGS_PREFIX}`,
  )
}

async function create(tournamentId: string, data: StandingsCreate) {
  return baseApi.create<Standings>(
    `/tournaments/${tournamentId}${STANDINGS_PREFIX}`,
    data,
  )
}

async function update(tournamentId: string, data: Standings) {
  return baseApi.update<Standings>(
    `/tournaments/${tournamentId}${STANDINGS_PREFIX}/${data.id}`,
    data,
  )
}

async function deleteStanding(tournamentId: string, id: string) {
  return baseApi.deleteResource<void>(
    `/tournaments/${tournamentId}${STANDINGS_PREFIX}/${id}`,
  )
}

async function calculateStandings(tournamentId: string) {
  return baseApi.create<void>(
    `/tournaments/${tournamentId}${STANDINGS_PREFIX}/calculate`,
    {},
  )
}

export default {
  getAll,
  create,
  update,
  delete: deleteStanding,
  calculateStandings,
}
