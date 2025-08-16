import { Request, Response, NextFunction } from "express"
import httpErr from "http-errors"
import { verifyAccessToken } from "./utils/jwt"
import * as assert from "node:assert"

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    // const token = req.cookies.accessToken
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
        throw httpErr.Unauthorized("Unauthorized")
    }

    try {
        const { payload } = verifyAccessToken(token)
        // Add user to request object
        req.user = { role: payload.role, email: payload.email, id: payload.id }
        next()
    } catch (error) {
        throw httpErr.Unauthorized("Unauthorized")
    }
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    isAuthenticated(req, res, () => {})

    assert.ok(req.user, "User is not defined")

    if (req.user.role !== "ADMIN") {
        throw httpErr.Unauthorized("Unauthorized")
    }
    next()
}
