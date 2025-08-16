import BaseApi from './baseApi'
import { Message, MessageCreate } from '../types/message'

const MESSAGE_PREFIX = '/messages'

async function getAll(tournamentId: string) {
  return BaseApi.getAll<Message>(
    `/tournaments/${tournamentId}${MESSAGE_PREFIX}`,
  )
}

async function create(tournamentId: string, data: MessageCreate) {
  return BaseApi.create<Message>(
    `/tournaments/${tournamentId}${MESSAGE_PREFIX}`,
    data,
  )
}

async function update(tournamentId: string, data: Message) {
  return BaseApi.update<Message>(
    `/tournaments/${tournamentId}${MESSAGE_PREFIX}/${data.id}`,
    data,
  )
}

async function deleteMessage(tournamentId: string, id: string) {
  return BaseApi.deleteResource<void>(
    `/tournaments/${tournamentId}${MESSAGE_PREFIX}/${id}`,
  )
}

async function getDetail(tournamentId: string, id: string) {
  return BaseApi.getDetail<Message>(
    `/tournaments/${tournamentId}${MESSAGE_PREFIX}/${id}`,
  )
}

export default {
  getAll,
  create,
  update,
  delete: deleteMessage,
  getDetail,
}
