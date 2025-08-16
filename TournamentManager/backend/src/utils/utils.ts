import { ZodSchema, ZodTypeDef } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { PrismaClient } from '@prisma/client'

// Note: This code is *borrowed* from Iteration 2
export const parseRequest = async <
  Output,
  Def extends ZodTypeDef = ZodTypeDef,
  Input = Output,
>(
  schema: ZodSchema<Output, Def, Input>,
  data: unknown,
) => {
  const parsedRequest = await schema.safeParseAsync(data)

  if (!parsedRequest.success) {
    throw fromZodError(parsedRequest.error)
  }

  return parsedRequest.data
}

export const deleteAllFromDatabase = async (prisma: PrismaClient) => {
  await prisma.$transaction(async (tx) => {
    await tx.game.deleteMany({})
    await tx.player.deleteMany({})
    await tx.team.deleteMany({})
    await tx.tournament.deleteMany({})
    await tx.sponsor.deleteMany({})
  })
}
