import { z } from "zod"
import { authLoginSchema, authRegisterSchema } from "./auth.schema"

export type BaseAuthUser = z.infer<typeof authLoginSchema>
export type RegisterAuthUser = z.infer<typeof authRegisterSchema>

export interface Token {
    iat: number
    exp: number
    payload: TokenPayload
}

export interface TokenPayload {
    id: string
    email: string
    role: string
}

export interface TokenPair {
    accessToken: string
    refreshToken: string
}

export type TokenResponse = TokenPair
