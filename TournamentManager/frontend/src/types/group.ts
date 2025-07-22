export type Group = {
  id: string
  name: string
  tournamentId: string
}

export type GroupCreate = Omit<Group, 'id'>
