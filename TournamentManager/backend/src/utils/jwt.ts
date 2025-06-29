import jwt from "jsonwebtoken"
import { Token, TokenPair, TokenPayload } from "../auth/auth.types"
import httpErr from "http-errors"

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET!

// const accessTokenExpiriesIn = 5 // 1 hour
const accessTokenExpiriesIn = 60 * 60 // 1 hour
const refreshTokenExpiriesIn = 7 * 24 * 60 * 60 // 1 week

const generateAccessToken = (payload: TokenPayload): string => {
    return jwt.sign({ payload }, accessTokenSecret, { expiresIn: accessTokenExpiriesIn })
}

const verifyAccessToken = (token: string): Token => {
    try {
        return jwt.verify(token, accessTokenSecret) as Token
    } catch (err) {
        throw httpErr.Unauthorized("Unauthorized")
    }
}

const generateRefreshToken = (payload: TokenPayload): string => {
    return jwt.sign({ payload }, refreshTokenSecret, { expiresIn: refreshTokenExpiriesIn })
}

const verifyRefreshToken = (token: string): Token => {
    try {
        return jwt.verify(token, refreshTokenSecret) as Token
    } catch (err) {
        throw httpErr.Unauthorized("Invalid refresh token")
    }
}

const generateTokens = (payload: TokenPayload): TokenPair => {
    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload)
    return { accessToken, refreshToken }
}

export { generateTokens, verifyRefreshToken, verifyAccessToken }
