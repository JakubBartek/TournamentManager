import { tournamentTypeEnum } from './../src/tournament/tournament.schema'
import { Prisma, PrismaClient } from '@prisma/client'
import { createSchedule } from '../src/tournament/tournament.service'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

async function createTournament(
  tournamentName: string,
  tournamentType: 'GROUPS' | 'GROUPS_AND_PLACEMENT' | 'GROUPS_AND_PLAYOFFS',
  numberOfTeams: number,
) {
  const hashedPassword = await bcrypt.hash('admin', 10)
  const today = new Date()
  const endDate = new Date(today)
  endDate.setDate(today.getDate() + 2)
  const tournament = await prisma.tournament.create({
    data: {
      name: tournamentName,
      location: 'Ice Arena Central',
      startDate: today,
      endDate: endDate,
      type: tournamentType,
      gameDuration: 60,
      breakDuration: 15,
      zamboniDuration: 10,
      zamboniInterval: 60,
      dailyStartTime: '09:00',
      dailyEndTime: '18:00',
      adminPasswordHash: hashedPassword,
    },
  })

  // Create Rinks
  await prisma.rink.create({
    data: {
      name: 'Main Rink',
      tournamentId: tournament.id,
    },
  })
  await prisma.rink.create({
    data: {
      name: 'Practice Rink',
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
    'Team A',
    'Team B',
    'Team C',
    'Team D',
    'Team E',
    'Team F',
    'Team G',
    'Team H',
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
    'City A',
    'City B',
    'City C',
    'City D',
    'City E',
    'City F',
    'City G',
    'City H',
  ]
  const teams: Awaited<ReturnType<typeof prisma.team.create>>[] = []
  for (let i = 0; i < numberOfTeams; i++) {
    const team = await prisma.team.create({
      data: {
        name: teamNames[i],
        city: teamCities[i],
        tournamentId: tournament.id,
        roomNumber: `Room ${i + 1}`,
      },
    })
    teams.push(team)
  }

  // Create games using tournament.service
  await createSchedule(tournament.id, 2, true)

  // Create Sponsor
  await prisma.sponsor.create({
    data: {
      name: 'CoolDrink Corp',
      amount: 1000.0,
      tournamentId: tournament.id,
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
}

async function main() {
  // Clear existing data
  await prisma.message.deleteMany({})
  await prisma.sponsor.deleteMany({})
  await prisma.zamboniTime.deleteMany({})
  await prisma.placementGame.deleteMany({})
  await prisma.playoffRound.deleteMany({})
  await prisma.game.deleteMany({})
  await prisma.player.deleteMany({})
  await prisma.standing.deleteMany({})
  await prisma.team.deleteMany({})
  await prisma.group.deleteMany({})
  await prisma.rink.deleteMany({})
  await prisma.tournament.deleteMany({})

  await createTournament(
    'Winter Hockey Cup',
    tournamentTypeEnum.Values.GROUPS_AND_PLACEMENT,
    8,
  )
  await createTournament(
    'Spring Hockey Challenge',
    tournamentTypeEnum.Values.GROUPS_AND_PLAYOFFS,
    16,
  )
  await createTournament(
    'Summer Hockey Showdown',
    tournamentTypeEnum.Values.GROUPS_AND_PLACEMENT,
    12,
  )
  await createTournament(
    'Tournament1',
    tournamentTypeEnum.Values.GROUPS_AND_PLACEMENT,
    7,
  )
  await createTournament(
    'Tournament2',
    tournamentTypeEnum.Values.GROUPS_AND_PLAYOFFS,
    6,
  )

  console.log('✅ Seed completed')
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
  })
