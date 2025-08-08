import db from '../db'
import { Standings, StandingsCreate, StandingsEdit } from './standings.types'
import { GameStatusEnum } from '../game/game.types'
import { GameStatus, GameType, TournamentType } from '@prisma/client'

const getStandings = async (tournamentId: string) => {
  const groups = await db.group.findMany({
    where: { tournamentId },
    include: {
      teams: {
        include: { Standing: true },
      },
    },
  })

  const standings = groups.map((group) => ({
    group,
    teams: group.teams
      .map((team) => ({
        teamId: team.id,
        name: team.name,
        points: team.Standing?.points ?? 0,
        position: team.Standing?.position ?? 0,
      }))
      .sort((a, b) => a.position - b.position),
  }))

  return standings
}

const createStanding = async (data: StandingsCreate) => {
  return db.standing.create({
    data: {
      ...data,
    },
  })
}

const updateStanding = async (id: string, data: StandingsEdit) => {
  return db.standing.update({
    where: { id },
    data: {
      ...data,
    },
  })
}

const deleteStanding = async (id: string) => {
  return db.standing.delete({
    where: { id },
  })
}

const getGroupStandings = async (groupId: string, tournamentId: string) => {
  const teams = await db.team.findMany({
    where: { groupId, tournamentId },
    include: {
      Standing: true,
    },
  })

  const standings = teams
    .map((team) => ({
      name: team.name,
      city: team.city,
      ...team.Standing,
    }))
    .filter((t) => t.points !== undefined)
    .sort((a, b) => a.position! - b.position!)

  return standings
}

async function calculateStandings(tournamentId: string) {
  try {
    const games = await db.game.findMany({
      where: {
        tournamentId,
      },
      include: {
        team1: true,
        team2: true,
      },
    })
    if (games.length === 0) {
      console.warn(
        '[calculateStandings] No games found for tournamentId:',
        tournamentId,
      )
    }

    const tournament = await db.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        groups: {
          include: {
            teams: {
              include: { Standing: true },
            },
          },
        },
      },
    })
    if (!tournament || !tournament.gameDuration) {
      console.warn('[calculateStandings] Tournament not found:', tournamentId)
      return
    }

    // drop games that are not finished
    const finishedGames = games.filter(
      (game) => game.status === GameStatusEnum.FINISHED,
    )
    if (finishedGames.length === 0) {
      // give every team 0 points if no finished games
      const teams = await db.team.findMany({
        where: { tournamentId },
        include: { Standing: true },
      })
      for (const team of teams) {
        await db.standing.upsert({
          where: { teamId: team.id, tournamentId: tournamentId },
          update: {
            points: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            position: 0,
            teamName: team.name,
          },
          create: {
            tournamentId,
            teamId: team.id,
            groupId: team.groupId || '',
            points: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            position: 0,
            teamName: team.name,
          },
        })
      }
      return
    }

    const standingsMap = new Map<string, Standings>()

    for (const game of finishedGames) {
      const { team1Id, team2Id, score1, score2 } = game

      if (!team1Id || !team2Id) {
        continue
      }

      if (!standingsMap.has(team1Id)) {
        standingsMap.set(team1Id, {
          teamId: team1Id,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          points: 0,
          groupId: game.team1!.groupId || '',
          id: '',
          tournamentId: tournamentId,
          position: 0,
          teamName: '',
        })
      }
      if (!standingsMap.has(team2Id)) {
        standingsMap.set(team2Id, {
          teamId: team2Id,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          points: 0,
          id: '',
          tournamentId: tournamentId,
          groupId: game.team2!.groupId || '',
          position: 0,
          teamName: '',
        })
      }

      const team1Stats = standingsMap.get(team1Id)!
      const team2Stats = standingsMap.get(team2Id)!

      team1Stats.goalsFor += score1
      team1Stats.goalsAgainst += score2
      team2Stats.goalsFor += score2
      team2Stats.goalsAgainst += score1

      if (score1 > score2) {
        team1Stats.wins += 1
        team1Stats.points += 3
        team2Stats.losses += 1
      } else if (score2 > score1) {
        team2Stats.wins += 1
        team2Stats.points += 3
        team1Stats.losses += 1
      } else {
        team1Stats.draws += 1
        team2Stats.draws += 1
        team1Stats.points += 1
        team2Stats.points += 1
      }
    }

    const standingsArray = Array.from(standingsMap.values())

    // Tiebreakers: POINTS -> MUTUAL MATCH -> GOAL DIFFERENCE -> GOALS SCORED -> GOALS TAKEN
    standingsArray.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points

      // Mutual match tiebreaker
      const mutualGame = finishedGames.find(
        (g) =>
          (g.team1Id === a.teamId && g.team2Id === b.teamId) ||
          (g.team1Id === b.teamId && g.team2Id === a.teamId),
      )
      if (mutualGame) {
        if (
          mutualGame.score1 !== undefined &&
          mutualGame.score2 !== undefined
        ) {
          if (
            mutualGame.team1Id === a.teamId &&
            mutualGame.score1 !== mutualGame.score2
          ) {
            return mutualGame.score2 - mutualGame.score1 // a won: negative, b won: positive
          }
          if (
            mutualGame.team2Id === a.teamId &&
            mutualGame.score2 !== mutualGame.score1
          ) {
            return mutualGame.score1 - mutualGame.score2
          }
        }
      }

      // Goal difference
      const goalDiffA = a.goalsFor - a.goalsAgainst
      const goalDiffB = b.goalsFor - b.goalsAgainst
      if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA

      // Goals scored
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor

      // Goals taken (lower is better)
      if (a.goalsAgainst !== b.goalsAgainst)
        return a.goalsAgainst - b.goalsAgainst

      return 0
    })

    // create array of ints that will represent positions within groups
    const groupPositions = standingsArray.reduce((acc, s) => {
      if (!acc[s.groupId]) acc[s.groupId] = 0
      acc[s.groupId] += 1
      return acc
    }, {} as Record<string, number>)

    await db.standing.deleteMany({ where: { tournamentId } })
    for (let i = 0; i < standingsArray.length; i++) {
      const s = standingsArray[i]
      let teamName = s.teamName
      if (!teamName) {
        const team = await db.team.findUnique({
          where: { id: s.teamId },
          select: { name: true },
        })
        teamName = team?.name || ''
      }
      // Calculate position within the group using groupPositions
      const positionInGroup =
        groupPositions[s.groupId] -
        standingsArray.slice(i + 1).filter((t) => t.groupId === s.groupId)
          .length
      await db.standing.upsert({
        where: { teamId: s.teamId },
        update: {
          wins: s.wins,
          draws: s.draws,
          losses: s.losses,
          goalsFor: s.goalsFor,
          goalsAgainst: s.goalsAgainst,
          points: s.points,
          position: positionInGroup,
          groupId: s.groupId,
          teamName: teamName,
          tournamentId,
        },
        create: {
          tournamentId,
          teamId: s.teamId,
          wins: s.wins,
          draws: s.draws,
          losses: s.losses,
          goalsFor: s.goalsFor,
          goalsAgainst: s.goalsAgainst,
          points: s.points,
          position: positionInGroup,
          groupId: s.groupId,
          teamName: teamName,
        },
      })
    }

    // if all games with type group have status finished and tournament.type == Groups_And_Placement, assign teams to final games

    const allGroupGamesFinished = await db.game.findMany({
      where: {
        tournamentId: tournament.id,
        type: GameType.GROUP,
      },
    })

    const allGroupGamesFinishedBool = allGroupGamesFinished.every(
      (game) => game.status === GameStatus.FINISHED,
    )

    // Assign teams to placement games for any number of teams in each group
    if (
      allGroupGamesFinishedBool &&
      tournament?.type === TournamentType.GROUPS_AND_PLACEMENT
    ) {
      // Get all games that have PlacementGame not undefined and sort them by PlacementGame.placement
      const placementGames = await db.game.findMany({
        where: {
          tournamentId: tournament.id,
          placementGameId: { not: null },
        },
        include: {
          placementGame: true,
        },
        orderBy: {
          placementGame: {
            placement: 'asc',
          },
        },
      })
      console.log(
        '[calculateStandings] Found placementGames:',
        placementGames.map((g) => ({
          id: g.id,
          placementGame: g.placementGameId,
        })),
      )

      const groups = tournament.groups || []
      console.log(
        '[calculateStandings] Groups:',
        groups.map((g) => ({
          id: g.id,
          name: g.name,
          teams: g.teams.map((t) => ({
            id: t.id,
            name: t.name,
            standing: t.Standing,
          })),
        })),
      )

      // Find the minimum number of teams in any group (to avoid out-of-bounds)
      const minTeams = Math.min(...groups.map((g) => g.teams.length))
      console.log('[calculateStandings] minTeams:', minTeams)

      // For each placement position (1st, 2nd, 3rd, ...)
      for (let pos = 0; pos < minTeams; pos++) {
        // Collect the teamId for this position from each group
        const teamIdsAtPos = groups
          .map((group) => {
            const team = group.teams[pos]
            console.log(
              `[calculateStandings] Group ${group.id} position ${pos}:`,
              team?.Standing,
            )
            return team?.Standing?.teamId
          })
          .filter(Boolean)
        console.log(
          `[calculateStandings] Position ${pos} teamIdsAtPos:`,
          teamIdsAtPos,
        )

        // If there are at least 2 teams for this position, assign them to a placement game
        if (teamIdsAtPos.length >= 2 && placementGames[pos]) {
          console.log(
            `[calculateStandings] Assigning to placementGame ${placementGames[pos].id}:`,
            {
              team1Id: teamIdsAtPos[0] ?? null,
              team2Id: teamIdsAtPos[1] ?? null,
            },
          )

          placementGames[pos].team1Id = teamIdsAtPos[0] ?? null
          placementGames[pos].team2Id = teamIdsAtPos[1] ?? null

          const newgame = await db.game.update({
            where: { id: placementGames[pos].id },
            data: {
              team1Id: teamIdsAtPos[0] ?? null,
              team2Id: teamIdsAtPos[1] ?? null,
            },
          })
          console.log(
            `[calculateStandings] Updated placementGame ${placementGames[pos].id} with teams:`,
            newgame,
          )
        } else {
          console.log(
            `[calculateStandings] Not enough teams for position ${pos} or no placementGame available`,
          )
        }
      }
    }

    console.log('[calculateStandings] Standings calculated successfully')
  } catch (err) {
    console.error('[calculateStandings] Error:', err)
    throw err
  }
}

export default {
  getStandings,
  createStanding,
  updateStanding,
  deleteStanding,
  calculateStandings,
  getGroupStandings,
}
