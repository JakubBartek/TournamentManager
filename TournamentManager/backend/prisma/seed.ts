import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.zamboniTime.deleteMany({})
  await prisma.game.deleteMany({})
  await prisma.player.deleteMany({})
  await prisma.standing.deleteMany({})
  await prisma.team.deleteMany({})
  await prisma.group.deleteMany({})
  await prisma.rink.deleteMany({})
  await prisma.tournament.deleteMany({})
  await prisma.sponsor.deleteMany({})

  // Create a tournament
  const tournament = await prisma.tournament.create({
    data: {
      name: 'Winter Hockey Cup',
      location: 'Ice Arena Central',
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-01-17'),
      type: 'GROUP_STAGE',
      gameDuration: 60,
      breakDuration: 15,
      zamboniDuration: 10,
      zamboniInterval: 60,
      dailyStartTime: '09:00',
      dailyEndTime: '18:00',
      adminPasswordHash: 'admin123',
    },
  })

  // Create Rinks
  const rinkA = await prisma.rink.create({
    data: {
      name: 'Main Rink',
      tournamentId: tournament.id,
    },
  })
  const rinkB = await prisma.rink.create({
    data: {
      name: 'Practice Rink',
      tournamentId: tournament.id,
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

  // Create 8 Teams and assign them to groups (4 per group)
  const teamNames = [
    'Ice Wolves',
    'Frost Giants',
    'Snow Leopards',
    'Glacier Bears',
    'Polar Sharks',
    'Blizzard Eagles',
    'Arctic Foxes',
    'Frozen Falcons',
  ]
  const teamCities = [
    'Northville',
    'Southport',
    'Eastwood',
    'Westfield',
    'Lakeview',
    'Hilltop',
    'Riverbend',
    'Forestside',
  ]
  const teams: Awaited<ReturnType<typeof prisma.team.create>>[] = []
  for (let i = 0; i < 8; i++) {
    const team = await prisma.team.create({
      data: {
        name: teamNames[i],
        city: teamCities[i],
        tournamentId: tournament.id,
        groupId: i < 4 ? groupA.id : groupB.id,
      },
    })
    teams.push(team)
  }

  // Create Games for each team (some in the past, some now, some in the future)
  const now = new Date()
  const pastBase = new Date(now.getTime() - 48 * 60 * 60 * 1000) // 48 hours ago
  const futureBase = new Date(now.getTime() + 2 * 60 * 60 * 1000) // 2 hours from now

  const rinks = [rinkA, rinkB]
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
            groupId: teams[i].groupId,
            rinkId: rinks[gameCount % rinks.length].id,
            status: 'SCHEDULED',
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

  // Create Zamboni times
  await prisma.zamboniTime.create({
    data: {
      tournamentId: tournament.id,
      startTime: new Date(now.getTime() + 3 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() + 3.5 * 60 * 60 * 1000),
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
