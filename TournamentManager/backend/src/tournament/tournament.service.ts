import { GameStatus, GameType } from '@prisma/client'
import db from '../db'
import { Team } from '../team/team.types'
import { tournamentTypeEnum } from './tournament.schema'
import { TournamentFull } from './tournament.types'
import standingsRepository from '../standings/standings.repository'

export async function createSchedule(
  tournamentId: string,
  numberOfGroups: number,
  autoCreate: boolean,
  manualGroups?: { groupNumber: number; teamId: string }[],
) {
  const tournament = await db.tournament.findUnique({
    where: { id: tournamentId },
  })
  const tournamentFull: TournamentFull = {
    id: tournament?.id || '',
    name: tournament?.name || '',
    location: tournament?.location || '',
    startDate: tournament?.startDate || new Date(),
    endDate: tournament?.endDate || new Date(),
    type: tournament?.type || tournamentTypeEnum.Values.GROUPS,
    adminPasswordHash: tournament?.adminPasswordHash || '',
    zamboniDuration: tournament?.zamboniDuration || 0,
    dailyStartTime: tournament?.dailyStartTime || '09:00',
    dailyEndTime: tournament?.dailyEndTime || '18:00',
    gameDuration: tournament?.gameDuration || 0,
    breakDuration: tournament?.breakDuration || 0,
    zamboniInterval: tournament?.zamboniInterval || 0,
    groupGamesInARow: tournament?.groupGamesInARow || 0,
  }
  const teams = await db.team.findMany({ where: { tournamentId } })

  if (!autoCreate) {
    if (!manualGroups || manualGroups.length === 0) {
      throw new Error('Manual group assignment requires at least one group')
    }

    // Put teams into groups based on groupNumber
    const groupTeams: Record<number, string[]> = {}
    manualGroups.forEach(({ groupNumber, teamId }) => {
      if (!groupTeams[groupNumber]) {
        groupTeams[groupNumber] = []
      }
      groupTeams[groupNumber].push(teamId)
    })
    // Create groups based on manual assignment
    const groupIdsM: string[] = []
    for (const groupNumber in groupTeams) {
      const group = await db.group.create({
        data: {
          name: `Group ${groupNumber}`,
          tournamentId,
        },
      })
      groupIdsM.push(group.id)

      // Assign teams to this group
      await Promise.all(
        groupTeams[groupNumber].map((teamId) =>
          db.team.update({
            where: { id: teamId },
            data: { groupId: group.id },
          }),
        ),
      )
    }

    // Create games for manual groups
    const { lastGameTime: last_game_t, lastZamboniTime } =
      await createGamesForGroup(
        tournamentFull,
        groupIdsM,
        tournamentId,
        teams.map((team) => ({
          ...team,
          logoUrl: team.logoUrl === null ? undefined : team.logoUrl,
          description: team.description === null ? undefined : team.description,
          roomNumber: team.roomNumber === null ? undefined : team.roomNumber,
          teamColor: team.teamColor === null ? undefined : team.teamColor,
        })),
        numberOfGroups,
      )

    if (tournament?.type === tournamentTypeEnum.Values.GROUPS_AND_PLACEMENT) {
      await createPlacementGames(
        tournamentFull,
        last_game_t,
        teams.length,
        tournamentId,
        lastZamboniTime,
      )
    }

    if (tournament?.type === tournamentTypeEnum.Values.GROUPS_AND_PLAYOFFS) {
      await createPlayoffGames(
        tournamentFull,
        last_game_t,
        teams.length,
        tournamentId,
        lastZamboniTime,
      )
    }

    if (
      tournament?.type ===
      tournamentTypeEnum.Values.GROUPS_AND_PLACEMENT_IN_GROUP
    ) {
      await createPlacementInGroupGames(
        tournamentFull,
        last_game_t,
        teams.length,
        tournamentId,
        lastZamboniTime,
      )
    }

    await standingsRepository.calculateStandings(tournamentId)
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
  const { lastGameTime: last_game_time, lastZamboniTime: last_zamboni_time } =
    await createGamesForGroup(
      tournamentFull,
      groupIds,
      tournamentId,
      teams.map((team) => ({
        ...team,
        logoUrl: team.logoUrl === null ? undefined : team.logoUrl,
        description: team.description === null ? undefined : team.description,
        roomNumber: team.roomNumber === null ? undefined : team.roomNumber,
        teamColor: team.teamColor === null ? undefined : team.teamColor,
      })),
      numberOfGroups,
    )

  if (tournament?.type === tournamentTypeEnum.Values.GROUPS_AND_PLACEMENT) {
    await createPlacementGames(
      tournamentFull,
      last_game_time,
      teams.length,
      tournamentId,
      last_zamboni_time,
    )
  }

  if (tournament?.type === tournamentTypeEnum.Values.GROUPS_AND_PLAYOFFS) {
    await createPlayoffGames(
      tournamentFull,
      last_game_time,
      teams.length,
      tournamentId,
      last_zamboni_time,
    )
  }

  if (
    tournament?.type === tournamentTypeEnum.Values.GROUPS_AND_PLACEMENT_IN_GROUP
  ) {
    await createPlacementInGroupGames(
      tournamentFull,
      last_game_time,
      teams.length,
      tournamentId,
      last_zamboni_time,
    )
  }

  await standingsRepository.calculateStandings(tournamentId)
}

async function createGamesForGroup(
  tournamentFull: TournamentFull,
  groupIds: string[],
  tournamentId: string,
  teams: Team[],
  numberOfGroups: number,
) {
  const rinks = await db.rink.findMany({ where: { tournamentId } })

  const dailyStart = tournamentFull.dailyStartTime // e.g., "09:00"
  const dailyEnd = tournamentFull.dailyEndTime // e.g., "18:00"
  const gameDuration = tournamentFull.gameDuration // in minutes
  const breakDuration = tournamentFull.breakDuration // in minutes
  const zamboniInterval = tournamentFull.zamboniInterval // after how many games
  const zamboniDuration = tournamentFull.zamboniDuration // in minutes

  if (!dailyStart || !dailyEnd || !gameDuration) {
    throw new Error('Tournament scheduling parameters are not set')
  }

  let lastZamboniTime = 0
  let lastZamboni = 0
  async function getNextGameTime(current: Date): Promise<Date> {
    if (
      lastZamboniTime + gameDuration >= zamboniInterval &&
      currentGameTime.getTime() + gameDuration * 60000 < endTime.getTime() &&
      lastZamboni !== current.getTime()
    ) {
      lastZamboni = current.getTime()
      lastZamboniTime = 0
      // Add zamboni break if not already scheduled for this start time
      const zStart = new Date(current.getTime() + gameDuration * 60000)
      const zEnd = new Date(
        current.getTime() + zamboniDuration * 60000 + gameDuration * 60000,
      )
      const existing = await db.zamboniTime.findFirst({
        where: { tournamentId, startTime: zStart },
      })
      if (!existing) {
        await db.zamboniTime.create({
          data: {
            tournamentId,
            startTime: zStart,
            endTime: zEnd,
          },
        })
      }
      return zEnd
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
  let endTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    endHour,
    endMinute,
  )

  // Build per-group schedules using the circle method,
  // keep schedules as mutable arrays so specific matches can be consumed out-of-order
  type GroupSchedule = {
    id: string
    schedule: [string, string][] // remaining matches
  }

  const groupSchedules: GroupSchedule[] = []

  for (const groupId of groupIds) {
    const groupTeams = teams.filter(
      (_, idx) => groupIds[idx % numberOfGroups] === groupId,
    )
    const n = groupTeams.length
    const teamIds = [...groupTeams.map((t) => t.id)]
    if (n % 2 === 1) teamIds.push('BYE') // add dummy to make even
    const working = [...teamIds]
    const workingCount = working.length
    const rounds = workingCount - 1

    const schedule: [string, string][] = []

    for (let round = 0; round < rounds; round++) {
      for (let i = 0; i < workingCount / 2; i++) {
        const teamA = working[i]
        const teamB = working[workingCount - 1 - i]
        if (
          teamA !== 'BYE' &&
          teamB !== 'BYE' &&
          teamA !== teamB // Prevent self-pairing
        ) {
          schedule.push([teamA, teamB])
        }
      }
      // Rotate teams (except the first)
      working.splice(1, 0, working.pop() as string)
    }

    groupSchedules.push({
      id: groupId,
      schedule,
    })
  }

  // Interleave scheduling across groups while using as many rinks as possible.
  // Ensure no team plays two games in the same time slot.
  while (groupSchedules.some((g) => g.schedule.length > 0)) {
    const scheduledTeams = new Set<string>()

    for (let rinkIdx = 0; rinkIdx < rinks.length; rinkIdx++) {
      // find a group and the earliest match in its schedule where both teams are free this slot
      let chosenGroupIndex = -1
      let chosenMatchIndex = -1

      for (let gi = 0; gi < groupSchedules.length; gi++) {
        const gs = groupSchedules[gi]
        // find first match index in this group's schedule where teams are free
        const mi = gs.schedule.findIndex(
          ([a, b]) => !scheduledTeams.has(a) && !scheduledTeams.has(b),
        )
        if (mi >= 0) {
          chosenGroupIndex = gi
          chosenMatchIndex = mi
          break // choose the earliest available group-match (keeps fairness)
        }
      }

      if (chosenGroupIndex === -1) {
        // no available match can be scheduled on this slot (teams conflict), try next rink or end
        break
      }

      const gs = groupSchedules[chosenGroupIndex]
      const [team1Id, team2Id] = gs.schedule.splice(chosenMatchIndex, 1)[0]

      // create games
      let _time = new Date(currentGameTime)
      for (let g = 0; g < tournamentFull.groupGamesInARow; g++) {
        await db.game.create({
          data: {
            team1Id,
            team2Id,
            tournamentId,
            groupId: gs.id,
            date: new Date(_time),
            rinkId: rinks[rinkIdx].id,
            rinkName: rinks[rinkIdx].name,
            type: GameType.GROUP,
            status: GameStatus.SCHEDULED,
          },
        })
        _time = await getNextGameTime(_time)
      }

      // mark teams as scheduled this slot
      scheduledTeams.add(team1Id)
      scheduledTeams.add(team2Id)
    }

    // Advance time for next slot
    for (let i = 0; i < tournamentFull.groupGamesInARow; i++) {
      currentGameTime = await getNextGameTime(currentGameTime)
    }
    if (currentGameTime >= endTime) {
      currentGameTime = new Date(currentGameTime.getTime() + 24 * 60 * 60000)
      currentGameTime.setHours(startHour, startMinute, 0, 0)
      lastZamboniTime = 0
      endTime = new Date(
        currentGameTime.getFullYear(),
        currentGameTime.getMonth(),
        currentGameTime.getDate(),
        endHour,
        endMinute,
      )
    }
  }

  // Return last game end time and last zamboni time for reference
  return {
    lastGameTime: currentGameTime,
    lastZamboniTime,
  }
}

async function createPlacementGames(
  tournament: TournamentFull,
  lastGameTime: Date,
  number_of_teams: number,
  tournamentId: string,
  lastZamboniTime: number,
) {
  if (tournament.type !== tournamentTypeEnum.Values.GROUPS_AND_PLACEMENT) {
    return
  }

  const rinks = await db.rink.findMany({
    where: { tournamentId: tournamentId },
  })
  const gameDuration = tournament.gameDuration
  const breakDuration = tournament.breakDuration
  const zamboniInterval = tournament.zamboniInterval
  const zamboniDuration = tournament.zamboniDuration
  const dailyStart = tournament.dailyStartTime
  const dailyEnd = tournament.dailyEndTime

  async function getNextGameTime(current: Date): Promise<Date> {
    if (
      lastZamboniTime + gameDuration >= zamboniInterval &&
      currentGameTime.getTime() + gameDuration * 60000 < endTime.getTime()
    ) {
      lastZamboniTime = 0
      const zStart = new Date(current.getTime() + gameDuration * 60000)
      const zEnd = new Date(
        current.getTime() + zamboniDuration * 60000 + gameDuration * 60000,
      )
      const existingZ = await db.zamboniTime.findFirst({
        where: { tournamentId: tournamentId, startTime: zStart },
      })
      if (!existingZ) {
        await db.zamboniTime.create({
          data: {
            tournamentId: tournamentId,
            startTime: zStart,
            endTime: zEnd,
          },
        })
      }
      return zEnd
    }

    lastZamboniTime += gameDuration + breakDuration
    return new Date(current.getTime() + (gameDuration + breakDuration) * 60000)
  }

  let currentGameTime = new Date(lastGameTime)
  const [startHour, startMinute] = dailyStart.split(':').map(Number)
  const [endHour, endMinute] = dailyEnd.split(':').map(Number)
  let endTime = new Date(
    currentGameTime.getFullYear(),
    currentGameTime.getMonth(),
    currentGameTime.getDate(),
    endHour,
    endMinute,
  )

  // Only create games for pairs; if odd, last team does not play
  const numPlacementGames = Math.floor(number_of_teams / 2)
  let i = numPlacementGames - 1
  while (i >= 0) {
    for (let rinkIdx = 0; rinkIdx < rinks.length && i >= 0; rinkIdx++) {
      const createdGame = await db.game.create({
        data: {
          team1Id: null,
          team2Id: null,
          tournamentId: tournamentId,
          groupId: null,
          date: new Date(currentGameTime),
          rinkId: rinks[rinkIdx].id,
          rinkName: rinks[rinkIdx].name,
          status: GameStatus.SCHEDULED,
          name: `Zápas o ${(i + 1) * 2 - 1} miesto`,
          type: GameType.FINAL,
        },
      })
      i--

      const placementGame = await db.placementGame.create({
        data: {
          gameId: createdGame.id,
          placement: (i + 1) * 2 - 1,
        },
      })

      await db.game.update({
        where: { id: createdGame.id },
        data: { placementGameId: placementGame.id },
      })
    }
    currentGameTime = await getNextGameTime(currentGameTime)
    if (currentGameTime >= endTime) {
      currentGameTime = new Date(currentGameTime.getTime() + 24 * 60 * 60000)
      currentGameTime.setHours(startHour, startMinute, 0, 0)
      lastZamboniTime = 0
      endTime = new Date(
        currentGameTime.getFullYear(),
        currentGameTime.getMonth(),
        currentGameTime.getDate(),
        endHour,
        endMinute,
      )
    }
  }
  // No game for the last team if odd number
}

async function createPlayoffGames(
  tournamentFull: TournamentFull,
  lastGameTime: Date,
  numberOfTeams: number,
  tournamentId: string,
  lastZamboniTime: number,
) {
  if (tournamentFull.type !== tournamentTypeEnum.Values.GROUPS_AND_PLAYOFFS) {
    return
  }

  // Determine starting round based on number of teams
  let roundTeams = numberOfTeams
  let teamsToPlay = 0
  let roundIdx = 0
  let roundGameTypes: GameType[] = []
  if (roundTeams >= 16) {
    roundGameTypes = [
      GameType.ROUND_OF_16,
      GameType.QUARTERFINAL,
      GameType.SEMIFINAL,
      GameType.FINAL,
    ]
    roundIdx = 0
    teamsToPlay = 16
  } else if (roundTeams >= 8) {
    roundGameTypes = [GameType.QUARTERFINAL, GameType.SEMIFINAL, GameType.FINAL]
    roundIdx = 0
    teamsToPlay = 8
  } else if (roundTeams >= 4) {
    roundGameTypes = [GameType.SEMIFINAL, GameType.FINAL]
    roundIdx = 0
    teamsToPlay = 4
  } else if (roundTeams === 2) {
    roundGameTypes = [GameType.FINAL]
    roundIdx = 0
    teamsToPlay = 2
  } else {
    // Not enough teams for playoff
    return
  }

  const rinks = await db.rink.findMany({ where: { tournamentId } })
  const gameDuration = tournamentFull.gameDuration
  const breakDuration = tournamentFull.breakDuration
  const zamboniInterval = tournamentFull.zamboniInterval
  const zamboniDuration = tournamentFull.zamboniDuration
  const dailyStart = tournamentFull.dailyStartTime
  const dailyEnd = tournamentFull.dailyEndTime

  async function getNextGameTime(current: Date): Promise<Date> {
    if (
      lastZamboniTime + gameDuration >= zamboniInterval &&
      currentGameTime.getTime() + gameDuration * 60000 < endTime.getTime()
    ) {
      lastZamboniTime = 0
      const zStart = new Date(current.getTime() + gameDuration * 60000)
      const zEnd = new Date(
        current.getTime() + zamboniDuration * 60000 + gameDuration * 60000,
      )
      const existingZ = await db.zamboniTime.findFirst({
        where: { tournamentId, startTime: zStart },
      })
      if (!existingZ) {
        await db.zamboniTime.create({
          data: { tournamentId, startTime: zStart, endTime: zEnd },
        })
      }
      return zEnd
    }
    lastZamboniTime += gameDuration + breakDuration
    return new Date(current.getTime() + (gameDuration + breakDuration) * 60000)
  }

  let currentGameTime = new Date(lastGameTime)
  const [startHour, startMinute] = dailyStart.split(':').map(Number)
  const [endHour, endMinute] = dailyEnd.split(':').map(Number)
  let endTime = new Date(
    currentGameTime.getFullYear(),
    currentGameTime.getMonth(),
    currentGameTime.getDate(),
    endHour,
    endMinute,
  )

  // Schedule rounds
  for (let round = 0; round < roundGameTypes.length; round++) {
    const numGames = teamsToPlay / 2
    let i = numGames - 1
    while (i >= 0) {
      for (let rinkIdx = 0; rinkIdx < rinks.length && i >= 0; rinkIdx++) {
        await db.game.create({
          data: {
            team1Id: null,
            team2Id: null,
            tournamentId,
            groupId: null,
            date: new Date(currentGameTime),
            rinkId: rinks[rinkIdx].id,
            rinkName: rinks[rinkIdx].name,
            status: GameStatus.SCHEDULED,
            name: roundGameTypes[round] + ` ${i + 1}`,
            type: roundGameTypes[round],
          },
        })
        i--
      }
      currentGameTime = await getNextGameTime(currentGameTime)
      if (currentGameTime >= endTime) {
        currentGameTime = new Date(currentGameTime.getTime() + 24 * 60 * 60000)
        currentGameTime.setHours(startHour, startMinute, 0, 0)
        lastZamboniTime = 0
        endTime = new Date(
          currentGameTime.getFullYear(),
          currentGameTime.getMonth(),
          currentGameTime.getDate(),
          endHour,
          endMinute,
        )
      }
    }
    teamsToPlay = teamsToPlay / 2
  }
}

async function createPlacementInGroupGames(
  tournamentFull: TournamentFull,
  lastGameTime: Date,
  numberOfTeams: number,
  tournamentId: string,
  lastZamboniTime: number,
) {
  if (
    tournamentFull.type !==
    tournamentTypeEnum.Values.GROUPS_AND_PLACEMENT_IN_GROUP
  ) {
    return
  }

  const rinks = await db.rink.findMany({
    where: { tournamentId },
  })
  const gameDuration = tournamentFull.gameDuration
  const breakDuration = tournamentFull.breakDuration
  const zamboniInterval = tournamentFull.zamboniInterval
  const zamboniDuration = tournamentFull.zamboniDuration
  const dailyStart = tournamentFull.dailyStartTime
  const dailyEnd = tournamentFull.dailyEndTime

  if (!dailyStart || !dailyEnd || !gameDuration || !breakDuration) {
    throw new Error('Tournament scheduling parameters are not set')
  }

  async function getNextGameTime(current: Date): Promise<Date> {
    if (
      lastZamboniTime + gameDuration >= zamboniInterval &&
      current.getTime() + gameDuration * 60000 < endTime.getTime()
    ) {
      lastZamboniTime = 0
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

  let currentGameTime = new Date(lastGameTime)
  const [startHour, startMinute] = dailyStart.split(':').map(Number)
  const [endHour, endMinute] = dailyEnd.split(':').map(Number)
  let endTime = new Date(
    currentGameTime.getFullYear(),
    currentGameTime.getMonth(),
    currentGameTime.getDate(),
    endHour,
    endMinute,
  )

  // Fetch groups for this tournament and compute how many placement games each needs
  const groups = await db.group.findMany({ where: { tournamentId } })

  const groupsInfo = await Promise.all(
    groups.map(async (group) => {
      const groupTeams = await db.team.findMany({
        where: { tournamentId, groupId: group.id },
        select: { id: true },
      })
      const numPlacementGames = Math.floor(groupTeams.length / 2)
      return {
        id: group.id,
        name: group.name,
        nextIndex: numPlacementGames - 1, // start from highest index (lowest placement)
      }
    }),
  )

  // If no groups or no placement games at all, exit early
  if (!groupsInfo.some((g) => g.nextIndex >= 0)) return

  // Cycle through groups, scheduling one placement game per group per slot,
  // filling rinks across groups, and scheduling lower placement games first
  while (groupsInfo.some((g) => g.nextIndex >= 0)) {
    // Track which groups were scheduled in this time slot to avoid multiple games per group in one slot
    const scheduledThisSlot = new Set<string>()

    for (let rinkIdx = 0; rinkIdx < rinks.length; rinkIdx++) {
      // find next group with remaining placement game and not scheduled in this slot
      const groupToSchedule = groupsInfo.find(
        (g) => g.nextIndex >= 0 && !scheduledThisSlot.has(g.id),
      )
      if (!groupToSchedule) break

      const idx = groupToSchedule.nextIndex
      const placementValue = (idx + 1) * 2 - 1 // same formula as elsewhere

      const createdGame = await db.game.create({
        data: {
          team1Id: null,
          team2Id: null,
          tournamentId,
          groupId: groupToSchedule.id,
          date: new Date(currentGameTime),
          rinkId: rinks[rinkIdx].id,
          rinkName: rinks[rinkIdx].name,
          status: GameStatus.SCHEDULED,
          name: `${groupToSchedule.name} - Zápas o ${placementValue} miesto`,
          type: GameType.FINAL,
        },
      })

      const placementGame = await db.placementGame.create({
        data: {
          gameId: createdGame.id,
          placement: placementValue,
        },
      })

      await db.game.update({
        where: { id: createdGame.id },
        data: { placementGameId: placementGame.id },
      })

      // mark this group scheduled in this slot and decrement its index
      scheduledThisSlot.add(groupToSchedule.id)
      groupToSchedule.nextIndex--
    }

    // Advance time for next slot
    currentGameTime = await getNextGameTime(currentGameTime)
    if (currentGameTime >= endTime) {
      currentGameTime = new Date(currentGameTime.getTime() + 24 * 60 * 60000)
      currentGameTime.setHours(startHour, startMinute, 0, 0)
      lastZamboniTime = 0
      endTime = new Date(
        currentGameTime.getFullYear(),
        currentGameTime.getMonth(),
        currentGameTime.getDate(),
        endHour,
        endMinute,
      )
    }
  }
}
