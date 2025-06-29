import db from '../db'
import { hashToken } from '../utils/hashToken'
import { RegisterAuthUser } from './auth.types'
import bcrypt from 'bcryptjs'

export const register = async (data: RegisterAuthUser) => {
  const hashedPassword = await bcrypt.hash(data.password, 10)

  return db.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
    },
  })
}

export const findUserById = (id: string) => {
  return db.user.findUnique({
    where: {
      id,
    },
  })
}

export const findUserByEmail = (email: string) => {
  return db.user.findUnique({
    where: {
      email,
    },
  })
}

// used when we create a refresh token.
export const addRefreshTokenToWhitelist = async ({
  refreshToken,
  userId,
}: {
  refreshToken: string
  userId: string
}) => {
  return db.refreshToken.create({
    data: {
      hashedToken: hashToken(refreshToken),
      userId,
    },
  })
}

export const findRefreshTokenByToken = (token: string) => {
  return db.refreshToken.findFirst({
    where: {
      hashedToken: hashToken(token),
    },
  })
}

// soft delete tokens after usage.
export const deleteRefreshToken = (id: string) => {
  return db.refreshToken.update({
    where: {
      id,
    },
    data: {
      revoked: true,
    },
  })
}

export default {
  register,
  findUserById,
  findUserByEmail,
  addRefreshTokenToWhitelist,
  deleteRefreshToken,
  findRefreshTokenByToken,
}
