import { GameStatus, GameType } from '@prisma/client'
import db from '../db'
import { Team } from '../team/team.types'
import { tournamentTypeEnum } from './tournament.schema'
import { TournamentFull } from './tournament.types'

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
    name: tournament?.name || '',
    location: tournament?.location || '',
    startDate: tournament?.startDate || new Date(),
    endDate: tournament?.endDate || new Date(),
    type:
      tournament?.type === tournamentTypeEnum.Values.GROUPS_AND_PLAYOFFS ||
      tournament?.type === tournamentTypeEnum.Values.GROUPS_AND_PLACEMENT
        ? tournament?.type
        : tournamentTypeEnum.Values.GROUPS,
    adminPasswordHash: tournament?.adminPasswordHash || '',
    zamboniDuration: tournament?.zamboniDuration || 30,
    dailyStartTime: tournament?.dailyStartTime || '09:00',
    dailyEndTime: tournament?.dailyEndTime || '18:00',
    gameDuration: tournament?.gameDuration || 30,
    breakDuration: tournament?.breakDuration || 10,
    zamboniInterval: tournament?.zamboniInterval || 5,
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
        })),
        numberOfGroups,
      )

    await createGamesForFinalStage(
      tournamentFull,
      last_game_t,
      teams.length,
      tournamentId,
      lastZamboniTime,
    )
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
      })),
      numberOfGroups,
    )

  await createGamesForFinalStage(
    tournamentFull,
    last_game_time,
    teams.length,
    tournamentId,
    last_zamboni_time,
  )
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

  if (!dailyStart || !dailyEnd || !gameDuration || !breakDuration) {
    throw new Error('Tournament scheduling parameters are not set')
  }

  let lastZamboniTime = 0
  async function getNextGameTime(current: Date): Promise<Date> {
    if (
      lastZamboniTime + gameDuration >= zamboniInterval &&
      currentGameTime.getTime() + gameDuration * 60000 < endTime.getTime()
    ) {
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

    // Use round-robin "circle method" for better distribution
    const n = groupTeams.length
    const rounds = n - 1 + (n % 2) // If odd, add a dummy team
    const teamIds = [...groupTeams.map((t) => t.id)]
    if (n % 2 === 1) teamIds.push('BYE') // Add dummy team for odd number

    const schedule: [string, string][] = []
    for (let round = 0; round < rounds; round++) {
      for (let i = 0; i < n / 2; i++) {
        const teamA = teamIds[i]
        const teamB = teamIds[n - 1 - i]
        if (teamA !== 'BYE' && teamB !== 'BYE') {
          schedule.push([teamA, teamB])
        }
      }
      // Rotate teams (except the first)
      teamIds.splice(1, 0, teamIds.pop() as string)
    }

    let pairingIdx = 0
    while (pairingIdx < schedule.length) {
      // For each time slot, schedule up to rinks.length games in parallel
      for (
        let rinkIdx = 0;
        rinkIdx < rinks.length && pairingIdx < schedule.length;
        rinkIdx++, pairingIdx++
      ) {
        const [team1Id, team2Id] = schedule[pairingIdx]
        await db.game.create({
          data: {
            team1Id,
            team2Id,
            tournamentId,
            groupId,
            date: new Date(currentGameTime),
            rinkId: rinks[rinkIdx].id,
            rinkName: rinks[rinkIdx].name,
            type: GameType.GROUP,
            status: GameStatus.SCHEDULED,
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

  // Return last game end time and last zamboni time for reference
  return {
    lastGameTime: currentGameTime,
    lastZamboniTime,
  }
}

async function createGamesForFinalStage(
  tournament: TournamentFull,
  lastGameTime: Date,
  number_of_teams: number,
  tournamentId: string,
  lastZamboniTime: number,
) {
  // Only handle GROUPS_AND_PLACEMENT here
  if (tournament.type !== tournamentTypeEnum.Values.GROUPS_AND_PLACEMENT) {
    return
  }

  // Get rinks for scheduling
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
      // Add zamboni break
      await db.zamboniTime.create({
        data: {
          tournamentId: tournamentId,
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

  // Start scheduling from lastGameTime
  let currentGameTime = new Date(lastGameTime)
  const [endHour, endMinute] = dailyEnd.split(':').map(Number)
  const endTime = new Date(
    currentGameTime.getFullYear(),
    currentGameTime.getMonth(),
    currentGameTime.getDate(),
    endHour,
    endMinute,
  )

  // For placement: create games for 1st vs 1st, 2nd vs 2nd, etc.
  const numPlacementGames = number_of_teams / 2
  let i = numPlacementGames - 1
  let justStartedNewDay = false
  while (i >= 0) {
    // Schedule up to rinks.length games in parallel
    for (
      let rinkIdx = 0;
      rinkIdx < rinks.length && i < numPlacementGames;
      rinkIdx++
    ) {
      // Create the game with team1Id and team2Id as null
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
          // placementGame will be linked after PlacementGame is created
        },
      })

      // Create the PlacementGame and link it to the game
      const placementGame = await db.placementGame.create({
        data: {
          gameId: createdGame.id,
          placement: (i + 1) * 2 - 1,
        },
      })

      // Update the game to link the placementGameId
      await db.game.update({
        where: { id: createdGame.id },
        data: { placementGameId: placementGame.id },
      })
      i--
    }
    if (justStartedNewDay) {
      justStartedNewDay = false
    } else {
      currentGameTime = await getNextGameTime(currentGameTime)
    }
    // If currentTime exceeds endTime, move to next day
    if (currentGameTime >= endTime) {
      currentGameTime = new Date(currentGameTime.getTime() + 24 * 60 * 60000)
      const [startHour, startMinute] = dailyStart.split(':').map(Number)
      currentGameTime.setHours(startHour, startMinute, 0, 0)
      lastZamboniTime = 0
      justStartedNewDay = true
    }
  }
}
