import { Router } from "express"
import { getProfile, login, refreshToken, register } from "./auth.controller"
import { isAuthenticated } from "../middlewares"

const router = Router()

router.post("/register", register)
router.post("/login", login)
router.post("/refreshToken", refreshToken)
router.get("/profile", isAuthenticated, getProfile)

export default router
