import db from '../db'
import { Standings, StandingsCreate, StandingsEdit } from './standings.types'

const getStandings = async (tournamentId: string) => {
  return db.standing.findMany({
    where: { tournamentId },
    orderBy: { position: 'asc' },
  })
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

async function calculateStandings(tournamentId: string) {
  const games = await db.game.findMany({
    where: {
      tournamentId,
    },
    include: {
      team1: true,
      team2: true,
    },
  })

  const standingsMap = new Map<
    string,
    {
      teamId: string
      wins: number
      draws: number
      losses: number
      goalsFor: number
      goalsAgainst: number
      points: number
    }
  >()

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

  await Promise.all(
    standingsArray.map((s, i) =>
      db.standing.create({
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
        },
      }),
    ),
  )
}

export default {
  getStandings,
  createStanding,
  updateStanding,
  deleteStanding,
  calculateStandings,
}
