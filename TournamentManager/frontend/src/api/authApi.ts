import BaseApi from './baseApi'
import { LoginRequest, RegisterRequest, Tokens, User } from '@/types/auth.ts'

const AUTH_PREFIX = '/auth'

async function login(data: LoginRequest) {
  return BaseApi.create<Tokens>(`${AUTH_PREFIX}/login`, data)
}

async function register(data: RegisterRequest) {
  return BaseApi.create<Tokens>(`${AUTH_PREFIX}/register`, data)
}

async function getProfile() {
  return BaseApi.getDetail<User>(`${AUTH_PREFIX}/profile`)
}

async function refreshToken() {
  return BaseApi.create<Tokens>(`${AUTH_PREFIX}/refreshToken`, {})
}

export default { login, getProfile, refreshToken, register }
