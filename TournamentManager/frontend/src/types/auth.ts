export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  name: string
  password: string
}

export interface User {
  email: string
  name: string
  role: string
}

export interface Tokens {
  accessToken: string
  refreshToken: string
}
