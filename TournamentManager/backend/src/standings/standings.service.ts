import { PrismaClient } from '@prisma/client'
import { Standings } from './standings.types'

const prisma = new PrismaClient()

export async function recalculateStandingsForGroup(groupId: string) {
  // 1. Fetch all teams in the group
  const teams = await prisma.team.findMany({
    where: { groupId },
    select: { id: true, tournamentId: true },
  })

  if (teams.length === 0) {
    throw new Error(`No teams found in group ${groupId}`)
  }

  // 2. Initialize standings map
  const standingsMap = new Map<string, Standings>()

  for (const team of teams) {
    standingsMap.set(team.id, {
      teamId: team.id,
      tournamentId: team.tournamentId,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
      id: '',
      position: 0,
      groupId: groupId,
      teamName: '',
    })
  }

  const teamIds = teams.map((t) => t.id)

  // 3. Get all games involving these teams
  const games = await prisma.game.findMany({
    where: {
      team1Id: { in: teamIds },
      team2Id: { in: teamIds },
    },
    select: {
      team1Id: true,
      team2Id: true,
      score1: true,
      score2: true,
    },
  })

  // 4. Iterate through games and update standings
  for (const game of games) {
    const team1 = standingsMap.get(game.team1Id)
    const team2 = standingsMap.get(game.team2Id)
    if (!team1 || !team2) continue

    team1.goalsFor += game.score1
    team1.goalsAgainst += game.score2
    team2.goalsFor += game.score2
    team2.goalsAgainst += game.score1
    team1.teamName =
      team1.teamName ||
      (
        await prisma.team.findUnique({
          where: { id: game.team1Id },
          select: { name: true },
        })
      )?.name ||
      ''
    team2.teamName =
      team2.teamName ||
      (
        await prisma.team.findUnique({
          where: { id: game.team2Id },
          select: { name: true },
        })
      )?.name ||
      ''

    if (game.score1 > game.score2) {
      team1.wins++
      team1.points += 3
      team2.losses++
    } else if (game.score1 < game.score2) {
      team2.wins++
      team2.points += 3
      team1.losses++
    } else {
      team1.draws++
      team2.draws++
      team1.points += 1
      team2.points += 1
    }
  }

  // Sort standings
  const sortedStandings = Array.from(standingsMap.values()).sort((a, b) => {
    const goalDiffA = a.goalsFor - a.goalsAgainst
    const goalDiffB = b.goalsFor - b.goalsAgainst

    if (b.points !== a.points) return b.points - a.points
    if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA
    return b.goalsFor - a.goalsFor
  })

  sortedStandings.forEach((standing, index) => {
    standing.position = index + 1
  })

  // 5. Delete existing standings for these teams
  await prisma.standing.deleteMany({
    where: {
      teamId: { in: teamIds },
      tournamentId: teams[0].tournamentId,
    },
  })

  // 6. Insert updated standings
  for (const standing of sortedStandings.values()) {
    await prisma.standing.create({ data: { ...standing } })
  }

  return {
    success: true,
    updatedTeams: teamIds.length,
    standings: sortedStandings,
  }
}
