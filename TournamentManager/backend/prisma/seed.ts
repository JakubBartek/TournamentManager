import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.game.deleteMany({})
  await prisma.player.deleteMany({})
  await prisma.standing.deleteMany({})
  await prisma.team.deleteMany({})
  await prisma.group.deleteMany({})
  await prisma.tournament.deleteMany({})
  await prisma.sponsor.deleteMany({})

  // Create a tournament
  const tournament = await prisma.tournament.create({
    data: {
      name: 'Winter Hockey Cup',
      location: 'Ice Arena Central',
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-01-17'),
    },
  })

  // Create Groups
  const groupA = await prisma.group.create({
    data: {
      name: 'Group A',
      tournamentId: tournament.id,
    },
  })

  const groupB = await prisma.group.create({
    data: {
      name: 'Group B',
      tournamentId: tournament.id,
    },
  })

  // Create Teams and assign them to groups
  const teamA = await prisma.team.create({
    data: {
      name: 'Ice Wolves',
      city: 'Northville',
      tournamentId: tournament.id,
      groupId: groupA.id,
    },
  })

  const teamB = await prisma.team.create({
    data: {
      name: 'Frost Giants',
      city: 'Southport',
      tournamentId: tournament.id,
      groupId: groupA.id,
    },
  })

  const teamC = await prisma.team.create({
    data: {
      name: 'Snow Leopards',
      city: 'Eastwood',
      tournamentId: tournament.id,
      groupId: groupB.id,
    },
  })

  const teamD = await prisma.team.create({
    data: {
      name: 'Glacier Bears',
      city: 'Westfield',
      tournamentId: tournament.id,
      groupId: groupB.id,
    },
  })

  // Create Players
  await prisma.player.createMany({
    data: [
      // Team A - Ice Wolves
      {
        name: 'Jack Frost',
        position: 'Forward',
        teamId: teamA.id,
        tournamentId: tournament.id,
      },
      {
        name: 'Liam Chill',
        position: 'Goalie',
        teamId: teamA.id,
        tournamentId: tournament.id,
      },
      {
        name: 'Ethan Snow',
        position: 'Defense',
        teamId: teamA.id,
        tournamentId: tournament.id,
      },
      {
        name: 'Mason Freeze',
        position: 'Forward',
        teamId: teamA.id,
        tournamentId: tournament.id,
      },
      {
        name: 'Lucas Iceberg',
        position: 'Defense',
        teamId: teamA.id,
        tournamentId: tournament.id,
      },

      // Team B - Frost Giants
      {
        name: 'Noah Ice',
        position: 'Defense',
        teamId: teamB.id,
        tournamentId: tournament.id,
      },
      {
        name: 'Oliver Frost',
        position: 'Forward',
        teamId: teamB.id,
        tournamentId: tournament.id,
      },
      {
        name: 'Elijah Glacier',
        position: 'Goalie',
        teamId: teamB.id,
        tournamentId: tournament.id,
      },
      {
        name: 'William Polar',
        position: 'Forward',
        teamId: teamB.id,
        tournamentId: tournament.id,
      },
      {
        name: 'James Arctic',
        position: 'Defense',
        teamId: teamB.id,
        tournamentId: tournament.id,
      },

      // Team C - Snow Leopards
      {
        name: 'Benjamin Snow',
        position: 'Forward',
        teamId: teamC.id,
        tournamentId: tournament.id,
      },
      {
        name: 'Henry White',
        position: 'Goalie',
        teamId: teamC.id,
        tournamentId: tournament.id,
      },
      {
        name: 'Alexander Chill',
        position: 'Defense',
        teamId: teamC.id,
        tournamentId: tournament.id,
      },
      {
        name: 'Sebastian Frost',
        position: 'Forward',
        teamId: teamC.id,
        tournamentId: tournament.id,
      },
      {
        name: 'Daniel Ice',
        position: 'Defense',
        teamId: teamC.id,
        tournamentId: tournament.id,
      },

      // Team D - Glacier Bears
      {
        name: 'Matthew Glacier',
        position: 'Forward',
        teamId: teamD.id,
        tournamentId: tournament.id,
      },
      {
        name: 'Joseph Polar',
        position: 'Goalie',
        teamId: teamD.id,
        tournamentId: tournament.id,
      },
      {
        name: 'Samuel Arctic',
        position: 'Defense',
        teamId: teamD.id,
        tournamentId: tournament.id,
      },
      {
        name: 'David Frost',
        position: 'Forward',
        teamId: teamD.id,
        tournamentId: tournament.id,
      },
      {
        name: 'Carter Ice',
        position: 'Defense',
        teamId: teamD.id,
        tournamentId: tournament.id,
      },
    ],
  })

  // Create Games for each team (some in the past, some now, some in the future)
  const now = new Date()
  const pastBase = new Date(now.getTime() - 48 * 60 * 60 * 1000) // 48 hours ago
  const futureBase = new Date(now.getTime() + 2 * 60 * 60 * 1000) // 2 hours from now

  const teams = [teamA, teamB, teamC, teamD]
  let gameCount = 1
  for (let i = 0; i < teams.length; i++) {
    for (let j = 0; j < teams.length; j++) {
      if (i !== j) {
        let date: Date
        if (gameCount % 3 === 1) {
          // Past
          date = new Date(pastBase.getTime() + (gameCount - 1) * 60 * 60 * 1000)
        } else if (gameCount % 3 === 2) {
          // Now
          date = new Date(now.getTime())
        } else {
          // Future
          date = new Date(
            futureBase.getTime() + (gameCount - 1) * 60 * 60 * 1000,
          )
        }

        await prisma.game.create({
          data: {
            team1Id: teams[i].id,
            team2Id: teams[j].id,
            score1: Math.floor(Math.random() * 6),
            score2: Math.floor(Math.random() * 6),
            date,
            tournamentId: tournament.id,
          },
        })
        gameCount++
      }
    }
  }

  // Create Sponsor
  await prisma.sponsor.create({
    data: {
      name: 'CoolDrink Corp',
      amount: 1000.0,
      tournamentId: tournament.id,
    },
  })

  console.log('✅ Seed completed')
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
  })
