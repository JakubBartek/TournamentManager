import db from '../db'
import { tournamentTypeEnum } from './tournament.schema'
import { TournamentFull } from './tournament.types'

export async function createSchedule(
  tournamentId: string,
  numberOfGroups: number,
  autoCreate: boolean,
) {
  const tournament = await db.tournament.findUnique({
    where: { id: tournamentId },
  })
  const tournamentFull: TournamentFull = {
    name: tournament?.name || '',
    location: tournament?.location || '',
    startDate: tournament?.startDate || new Date(),
    endDate: tournament?.endDate || new Date(),
    type:
      tournament?.type === 'ROUND_ROBIN' ||
      tournament?.type === 'PLAYOFF' ||
      tournament?.type === 'GROUP_STAGE'
        ? tournament.type
        : tournamentTypeEnum.Values.GROUP_STAGE,
    adminPasswordHash: tournament?.adminPasswordHash || '',
    zamboniDuration: tournament?.zamboniDuration || 30,
    dailyStartTime: tournament?.dailyStartTime || '09:00',
    dailyEndTime: tournament?.dailyEndTime || '18:00',
    gameDuration: tournament?.gameDuration || 30,
    breakDuration: tournament?.breakDuration || 10,
    zamboniInterval: tournament?.zamboniInterval || 5,
  }
  const teams = await db.team.findMany({ where: { tournamentId } })
  const rinks = await db.rink.findMany({ where: { tournamentId } })

  // Group assignment logic (auto/manual)
  if (!autoCreate) {
    // Manual schedule: just create empty groups, let user assign teams/games later
    for (let i = 0; i < numberOfGroups; i++) {
      await db.group.create({
        data: {
          name: `Group ${String.fromCharCode(65 + i)}`,
          tournamentId,
        },
      })
    }
    return
  }
  // Create groups
  const groupIds: string[] = []
  for (let i = 0; i < numberOfGroups; i++) {
    const group = await db.group.create({
      data: {
        name: `Group ${String.fromCharCode(65 + i)}`,
        tournamentId,
      },
    })
    groupIds.push(group.id)
  }

  // Assign teams to groups evenly
  await Promise.all(
    teams.map((team, idx) => {
      const groupId = groupIds[idx % numberOfGroups]
      return db.team.update({ where: { id: team.id }, data: { groupId } })
    }),
  )

  // Create games (round-robin within each group)
  // Prepare scheduling parameters
  const dailyStart = tournamentFull.dailyStartTime // e.g., "09:00"
  const dailyEnd = tournamentFull.dailyEndTime // e.g., "18:00"
  const gameDuration = tournamentFull.gameDuration // in minutes
  const breakDuration = tournamentFull.breakDuration // in minutes
  const zamboniInterval = tournamentFull.zamboniInterval // after how many games
  const zamboniDuration = tournamentFull.zamboniDuration // in minutes

  if (!dailyStart || !dailyEnd || !gameDuration || !breakDuration) {
    throw new Error('Tournament scheduling parameters are not set')
  }

  let lastZamboniTime = 0
  async function getNextGameTime(current: Date): Promise<Date> {
    if (lastZamboniTime + gameDuration >= zamboniInterval) {
      lastZamboniTime = 0
      // Add zamboni break
      await db.zamboniTime.create({
        data: {
          tournamentId,
          startTime: new Date(current.getTime() + gameDuration * 60000),
          endTime: new Date(
            current.getTime() + zamboniDuration * 60000 + gameDuration * 60000,
          ),
        },
      })
      return new Date(
        current.getTime() + zamboniDuration * 60000 + gameDuration * 60000,
      )
    }

    lastZamboniTime += gameDuration + breakDuration
    return new Date(current.getTime() + (gameDuration + breakDuration) * 60000)
  }

  // Start from tournament's daily start time
  const today = tournamentFull.startDate || new Date()
  const [startHour, startMinute] = dailyStart.split(':').map(Number)
  const [endHour, endMinute] = dailyEnd.split(':').map(Number)
  let currentGameTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    startHour,
    startMinute,
  )
  const endTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    endHour,
    endMinute,
  )

  for (const groupId of groupIds) {
    const groupTeams = teams.filter(
      (_, idx) => groupIds[idx % numberOfGroups] === groupId,
    )

    // Generate all unique pairings for round robin
    const pairings: [string, string][] = []
    for (let i = 0; i < groupTeams.length; i++) {
      for (let j = i + 1; j < groupTeams.length; j++) {
        pairings.push([groupTeams[i].id, groupTeams[j].id])
      }
    }

    let pairingIdx = 0
    while (pairingIdx < pairings.length) {
      // For each time slot, schedule up to rinks.length games in parallel
      for (
        let rinkIdx = 0;
        rinkIdx < rinks.length && pairingIdx < pairings.length;
        rinkIdx++, pairingIdx++
      ) {
        const [team1Id, team2Id] = pairings[pairingIdx]
        await db.game.create({
          data: {
            team1Id,
            team2Id,
            tournamentId,
            groupId,
            date: new Date(currentGameTime),
            rinkId: rinks[rinkIdx].id,
            rinkName: rinks[rinkIdx].name,
          },
        })
      }
      // Advance time for next slot
      currentGameTime = await getNextGameTime(currentGameTime)
      // If currentTime exceeds endTime, move to next day
      if (currentGameTime >= endTime) {
        currentGameTime = new Date(currentGameTime.getTime() + 24 * 60 * 60000)
        currentGameTime.setHours(startHour, startMinute, 0, 0)
        lastZamboniTime = 0
      }
    }
  }
}
