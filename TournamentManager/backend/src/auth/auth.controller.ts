import { parseRequest } from '../utils/utils'
import authRepository from './auth.repository'
import { authLoginSchema, authRegisterSchema } from './auth.schema'
import httpErr from 'http-errors'
import bcrypt from 'bcryptjs'
import { generateTokens, verifyRefreshToken } from '../utils/jwt'
import * as assert from 'node:assert'
import { userMapper } from '../utils/mappers'

export const register: ControllerFn = async (req, res, next) => {
  try {
    const data = await parseRequest(authRegisterSchema, req.body)

    const user = await authRepository.register(data)

    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    await authRepository.addRefreshTokenToWhitelist({
      refreshToken: tokens.refreshToken,
      userId: user.id,
    })

    res.status(201).send(tokens)
  } catch (error) {
    next(error)
  }
}

export const login: ControllerFn = async (req, res, next) => {
  try {
    const data = await parseRequest(authLoginSchema, req.body)
    const { email, password } = data

    const user = await authRepository.findUserByEmail(email)
    if (!user) {
      throw httpErr.Unauthorized('Email address or password not valid')
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      throw httpErr.Unauthorized('Email address or password not valid')
    }

    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    await authRepository.addRefreshTokenToWhitelist({
      refreshToken: tokens.refreshToken,
      userId: user.id,
    })

    res.send(tokens)
  } catch (error) {
    next(error)
  }
}

export const refreshToken: ControllerFn = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      throw httpErr.Unauthorized('Unauthorized')
    }

    verifyRefreshToken(token)

    const savedRefreshToken = await authRepository.findRefreshTokenByToken(
      token,
    )

    if (!savedRefreshToken || savedRefreshToken.revoked) {
      throw httpErr.Unauthorized('Invalid refresh token')
    }

    const user = await authRepository.findUserById(savedRefreshToken.userId)
    if (!user) {
      throw httpErr.Unauthorized('Invalid refresh token')
    }

    await authRepository.deleteRefreshToken(savedRefreshToken.id)

    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    })
    await authRepository.addRefreshTokenToWhitelist({
      refreshToken: tokens.refreshToken,
      userId: user.id,
    })

    res.send(tokens)
  } catch (error) {
    next(error)
  }
}

export const getProfile: ControllerFn = async (req, res, next) => {
  try {
    assert.ok(req.user, 'User not authenticated')

    const user = await authRepository.findUserById(req.user.id)

    if (!user) {
      throw httpErr.Unauthorized('User not found')
    }

    res.send(userMapper(user))
  } catch (error) {
    next(error)
  }
}
