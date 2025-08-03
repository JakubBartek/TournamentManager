import db from '../db'
import { Standings, StandingsCreate, StandingsEdit } from './standings.types'
import { GameStatusEnum } from '../game/game.types'

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

    // Get tournament to get game duration and other settings
    const tournament = await db.tournament.findUnique({
      where: { id: tournamentId },
      select: { zamboniDuration: true, gameDuration: true },
    })
    if (!tournament || !tournament.gameDuration) {
      console.warn('[calculateStandings] Tournament not found:', tournamentId)
      return
    }

    // Update game status based on time, first update them here, then in db
    const now = new Date()
    for (const game of games) {
      if (game.date > now) {
        game.status = GameStatusEnum.SCHEDULED
      } else {
        const gameEndDate = new Date(game.date)
        gameEndDate.setMinutes(
          gameEndDate.getMinutes() + tournament.gameDuration,
        )
        if (now >= gameEndDate) {
          game.status = GameStatusEnum.FINISHED
        } else {
          game.status = GameStatusEnum.LIVE
        }
      }
      console.log(`Game ${game.id} status updated to ${game.status}`)
    }

    for (const game of games) {
      await db.game.update({
        where: { id: game.id },
        data: { status: game.status },
      })
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

      if (!standingsMap.has(team1Id)) {
        standingsMap.set(team1Id, {
          teamId: team1Id,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          points: 0,
          groupId: game.team1.groupId || '',
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
          groupId: game.team2.groupId || '',
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

    standingsArray.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points
      const goalDiffA = a.goalsFor - a.goalsAgainst
      const goalDiffB = b.goalsFor - b.goalsAgainst
      return goalDiffB - goalDiffA
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
