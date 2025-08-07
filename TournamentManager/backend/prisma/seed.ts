import { tournamentTypeEnum } from './../src/tournament/tournament.schema'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.message.deleteMany({})
  await prisma.sponsor.deleteMany({})
  await prisma.zamboniTime.deleteMany({})
  await prisma.game.deleteMany({})
  await prisma.player.deleteMany({})
  await prisma.standing.deleteMany({})
  await prisma.team.deleteMany({})
  await prisma.group.deleteMany({})
  await prisma.rink.deleteMany({})
  await prisma.tournament.deleteMany({})
  // Create a tournament
  const tournament = await prisma.tournament.create({
    data: {
      name: 'Winter Hockey Cup',
      location: 'Ice Arena Central',
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-01-17'),
      type: tournamentTypeEnum.Values.GROUPS,
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

  // Create Games ONLY between teams in the same group
  const now = new Date()
  const pastBase = new Date(now.getTime() - 48 * 60 * 60 * 1000) // 48 hours ago
  const futureBase = new Date(now.getTime() + 2 * 60 * 60 * 1000) // 2 hours from now

  const rinks = [rinkA, rinkB]
  let gameCount = 1

  // Helper: get teams in a group
  const teamsInGroupA = teams.filter((t) => t.groupId === groupA.id)
  const teamsInGroupB = teams.filter((t) => t.groupId === groupB.id)

  // Round-robin for Group A
  for (let i = 0; i < teamsInGroupA.length; i++) {
    for (let j = 0; j < teamsInGroupA.length; j++) {
      if (i !== j) {
        let date: Date
        if (gameCount % 3 === 1) {
          date = new Date(pastBase.getTime() + (gameCount - 1) * 60 * 60 * 1000)
        } else if (gameCount % 3 === 2) {
          date = new Date(now.getTime())
        } else {
          date = new Date(
            futureBase.getTime() + (gameCount - 1) * 60 * 60 * 1000,
          )
        }

        await prisma.game.create({
          data: {
            team1Id: teamsInGroupA[i].id,
            team2Id: teamsInGroupA[j].id,
            score1: Math.floor(Math.random() * 6),
            score2: Math.floor(Math.random() * 6),
            date,
            tournamentId: tournament.id,
            groupId: groupA.id,
            rinkId: rinks[gameCount % rinks.length].id,
            rinkName: rinks[gameCount % rinks.length].name,
            status: 'SCHEDULED',
          },
        })
        gameCount++
      }
    }
  }

  // Round-robin for Group B
  for (let i = 0; i < teamsInGroupB.length; i++) {
    for (let j = 0; j < teamsInGroupB.length; j++) {
      if (i !== j) {
        let date: Date
        if (gameCount % 3 === 1) {
          date = new Date(pastBase.getTime() + (gameCount - 1) * 60 * 60 * 1000)
        } else if (gameCount % 3 === 2) {
          date = new Date(now.getTime())
        } else {
          date = new Date(
            futureBase.getTime() + (gameCount - 1) * 60 * 60 * 1000,
          )
        }

        await prisma.game.create({
          data: {
            team1Id: teamsInGroupB[i].id,
            team2Id: teamsInGroupB[j].id,
            score1: Math.floor(Math.random() * 6),
            score2: Math.floor(Math.random() * 6),
            date,
            tournamentId: tournament.id,
            groupId: groupB.id,
            rinkId: rinks[gameCount % rinks.length].id,
            rinkName: rinks[gameCount % rinks.length].name,
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

  // Add some messages
  await prisma.message.createMany({
    data: [
      {
        tournamentId: tournament.id,
        content: 'Welcome to the Winter Hockey Cup!',
        priority: 1,
        type: 'INFO',
      },
      {
        tournamentId: tournament.id,
        content: 'First games start at 09:00 on January 15th.',
        priority: 2,
        type: 'INFO',
      },
      {
        tournamentId: tournament.id,
        content: 'Please check in at the registration desk.',
        priority: 1,
        type: 'ALERT',
      },
    ],
  })

  console.log('✅ Seed completed')
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
  })
