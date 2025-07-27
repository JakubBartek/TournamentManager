import db from '../db'
import { Standings, StandingsCreate, StandingsEdit } from './standings.types'

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
    console.log('[calculateStandings] tournamentId:', tournamentId)
    const games = await db.game.findMany({
      where: {
        tournamentId,
      },
      include: {
        team1: true,
        team2: true,
      },
    })
    console.log('[calculateStandings] games fetched:', games.length)
    if (games.length === 0) {
      console.warn(
        '[calculateStandings] No games found for tournamentId:',
        tournamentId,
      )
    }

    const standingsMap = new Map<string, Standings>()

    for (const game of games) {
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
      await db.standing.create({
        data: {
          tournamentId,
          teamId: s.teamId,
          wins: s.wins,
          draws: s.draws,
          losses: s.losses,
          goalsFor: s.goalsFor,
          goalsAgainst: s.goalsAgainst,
          points: s.points,
          position: i + 1,
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
