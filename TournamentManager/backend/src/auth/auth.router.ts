import { Router } from 'express'
import { getProfile, login, refreshToken, register } from './auth.controller'
import { isAuthenticated } from '../middlewares'

const router = Router()

// TODO: VERIFY THAT IT IS COMING FROM TOURNAMENT ADMIN
router.post('/register', register)
router.post('/login', login)
router.post('/refreshToken', refreshToken)
router.get('/profile', isAuthenticated, getProfile)

export default router
